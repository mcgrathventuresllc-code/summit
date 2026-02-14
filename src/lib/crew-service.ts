/**
 * Accountability Crew - Supabase-backed crew & chat service
 */

import { createClient, isSupabaseConfigured } from "./supabase/client";
import type { Crew, CrewMember, CrewMessage } from "./types";

function randomInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createCrew(name: string, displayName: string): Promise<Crew | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let code = randomInviteCode();
  let attempts = 0;
  while (attempts < 5) {
    const { data, error } = await supabase.rpc("create_crew", {
      p_invite_code: code,
      p_name: name,
    });
    if (!error) {
      const crew = data as Crew;
      await supabase
        .from("crew_members")
        .update({ display_name: displayName || user.email?.split("@")[0] || "Climber" })
        .eq("crew_id", crew.id)
        .eq("user_id", user.id);
      return crew;
    }
    if (error.code === "23505") {
      code = randomInviteCode();
      attempts++;
    } else {
      throw error;
    }
  }
  return null;
}

export async function joinCrew(inviteCode: string, displayName: string): Promise<{ crew: Crew } | { error: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const code = inviteCode.trim().toUpperCase();
  const { data: crew, error: crewError } = await supabase
    .from("crews")
    .select()
    .ilike("invite_code", code)
    .maybeSingle();

  if (crewError) return { error: crewError.message };
  if (!crew) return { error: "Invalid invite code" };

  const { error: joinError } = await supabase
    .from("crew_members")
    .insert({
      crew_id: crew.id,
      user_id: user.id,
      display_name: displayName || user.email?.split("@")[0] || "Climber",
    });

  if (joinError) {
    if (joinError.code === "23505") return { error: "You're already in this crew" };
    return { error: joinError.message };
  }

  return { crew: crew as Crew };
}

export async function getMyCrews(): Promise<Crew[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: members } = await supabase
    .from("crew_members")
    .select("crew_id")
    .eq("user_id", user.id);

  if (!members?.length) return [];

  const { data: crews } = await supabase
    .from("crews")
    .select()
    .in("id", members.map((m) => m.crew_id));

  return (crews ?? []) as Crew[];
}

export async function getCrewMembers(crewId: string): Promise<CrewMember[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("crew_members")
    .select()
    .eq("crew_id", crewId)
    .order("joined_at", { ascending: true });
  return (data ?? []) as CrewMember[];
}

export async function getCrewMessages(crewId: string, limit = 50): Promise<CrewMessage[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("crew_messages")
    .select()
    .eq("crew_id", crewId)
    .order("created_at", { ascending: false })
    .limit(limit);
  const msgs = (data ?? []) as CrewMessage[];
  return msgs.reverse();
}

export async function sendMessage(crewId: string, content: string): Promise<CrewMessage | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("crew_messages")
    .insert({ crew_id: crewId, user_id: user.id, type: "message", content })
    .select()
    .single();

  if (error) throw error;
  return data as CrewMessage;
}

export async function postLevelUp(crewId: string, level: number, levelName: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("crew_messages").insert({
    crew_id: crewId,
    user_id: user.id,
    type: "level_up",
    content: `Leveled up to ${levelName}! 🎉`,
    metadata: { level, levelName },
  });
}

export async function postSpelunking(crewId: string, displayName: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("crew_messages").insert({
    crew_id: crewId,
    user_id: user.id,
    type: "spelunking",
    content: `${displayName} is spelunking 🕳️ — send some encouragement!`,
    metadata: {},
  });
}

export async function announceSpelunkingToCrews(displayName: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const myCrews = await getMyCrews();
  for (const crew of myCrews) {
    await postSpelunking(crew.id, displayName);
  }
}

export async function announceLevelUpToCrews(level: number, levelName: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const myCrews = await getMyCrews();
  for (const crew of myCrews) {
    await postLevelUp(crew.id, level, levelName);
  }
}

export function subscribeToCrewMessages(
  crewId: string,
  onMessage: (msg: CrewMessage) => void
): () => void {
  const supabase = createClient();
  const channel = supabase
    .channel(`crew:${crewId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "crew_messages", filter: `crew_id=eq.${crewId}` },
      (payload) => {
        onMessage(payload.new as CrewMessage);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
