"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getMyCrews, getCrewMembers } from "@/lib/crew-service";
import { useSummitStore } from "@/lib/store";
import type { Crew, CrewMember } from "@/lib/types";
import { CrewAuth } from "@/components/crew/CrewAuth";
import { CrewCreate } from "@/components/crew/CrewCreate";
import { CrewJoin } from "@/components/crew/CrewJoin";
import { CrewChat } from "@/components/crew/CrewChat";
import { BottomNav } from "@/components/layout/BottomNav";

type View = "auth" | "list" | "create" | "join" | "chat";

export default function CrewPage() {
  const userProfile = useSummitStore((s) => s.userProfile);
  const [view, setView] = useState<View>("auth");
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [crews, setCrews] = useState<Crew[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);
  const [memberIdMap, setMemberIdMap] = useState<Record<string, string>>({});
  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = () => {
    if (!selectedCrew) return;
    navigator.clipboard?.writeText(selectedCrew.invite_code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const displayName = userProfile?.name ?? user?.email?.split("@")[0] ?? "Climber";

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ? { id: u.id, email: u.email ?? undefined } : null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? undefined } : null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    getMyCrews().then((c) => {
      setCrews(c);
      if (c.length > 0 && view === "auth") setView("list");
    });
  }, [user]);

  useEffect(() => {
    if (!user) setView("auth");
    else if (crews.length === 0 && view !== "create" && view !== "join") setView("list");
  }, [user, crews.length, view]);

  useEffect(() => {
    if (!selectedCrew) return;
    getCrewMembers(selectedCrew.id).then((members) => {
      const map: Record<string, string> = {};
      members.forEach((m: CrewMember) => { map[m.user_id] = m.display_name; });
      setMemberIdMap(map);
    });
  }, [selectedCrew]);

  if (!isSupabaseConfigured) {
    return (
      <>
        <div className="min-h-dvh bg-zinc-950 px-4 pt-[max(env(safe-area-inset-top),24px)] pb-24 content-pad">
          <h1 className="text-2xl font-bold text-zinc-100 mb-4">Accountability Crew</h1>
          <div className="rounded-2xl bg-zinc-800/50 border border-zinc-700 p-6 text-center">
            <p className="text-zinc-400 mb-2">Accountability Crew uses Supabase for real-time chat.</p>
            <p className="text-zinc-500 text-sm">
              Add <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="bg-zinc-800 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your{" "}
              <code className="bg-zinc-800 px-1 rounded">.env.local</code>, then run the migration in{" "}
              <code className="bg-zinc-800 px-1 rounded">supabase/migrations/001_crew.sql</code>.
            </p>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  const handleCreated = (crew: Crew) => {
    setCrews((prev) => [...prev, crew]);
    setSelectedCrew(crew);
    setView("chat");
  };

  const handleJoined = (crew: Crew) => {
    setCrews((prev) => (prev.some((c) => c.id === crew.id) ? prev : [...prev, crew]));
    setSelectedCrew(crew);
    setView("chat");
  };

  return (
    <>
      <div className="min-h-dvh bg-zinc-950 flex flex-col content-pad">
        <div className="px-4 pt-[max(env(safe-area-inset-top),24px)] pb-4 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-zinc-100">Accountability Crew</h1>
          {selectedCrew && (
            <button
              type="button"
              onClick={() => { setSelectedCrew(null); setView("list"); }}
              className="text-sm text-zinc-500 hover:text-zinc-300 mt-1"
            >
              ← Back to crews
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col px-4 py-6">
          {view === "auth" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md"
            >
              <CrewAuth onSuccess={() => setView("list")} />
            </motion.div>
          )}

          {view === "list" && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {crews.length === 0 ? (
                <>
                  <p className="text-zinc-500 text-sm mb-6">
                    Create a crew or join one with an invite code.
                  </p>
                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={() => setView("create")}
                      className="h-14 px-4 rounded-xl border-2 border-dashed border-zinc-600 text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors text-left font-medium"
                    >
                      + Create crew
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("join")}
                      className="h-14 px-4 rounded-xl border-2 border-dashed border-zinc-600 text-zinc-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors text-left font-medium"
                    >
                      Join with invite code
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setView("create")}
                      className="text-sm text-emerald-500 hover:text-emerald-400"
                    >
                      + Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("join")}
                      className="text-sm text-emerald-500 hover:text-emerald-400"
                    >
                      Join
                    </button>
                  </div>
                  <div className="space-y-2">
                    {crews.map((crew) => (
                      <button
                        key={crew.id}
                        type="button"
                        onClick={() => { setSelectedCrew(crew); setView("chat"); }}
                        className="w-full h-14 px-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-left font-medium text-zinc-100 hover:border-emerald-500/50 flex items-center justify-between"
                      >
                        <span>{crew.name}</span>
                        <span className="text-zinc-500 text-xs">{crew.invite_code}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {view === "create" && user && (
            <CrewCreate
              displayName={displayName}
              onCreated={handleCreated}
              onBack={() => setView("list")}
            />
          )}

          {view === "join" && user && (
            <CrewJoin
              displayName={displayName}
              onJoined={handleJoined}
              onBack={() => setView("list")}
            />
          )}

          {view === "chat" && selectedCrew && user && (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <p className="text-zinc-500 text-sm">
                  Invite friends with code: <span className="text-emerald-500 font-mono font-semibold">{selectedCrew.invite_code}</span>
                </p>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-xs text-emerald-500 hover:text-emerald-400"
                >
                  {codeCopied ? "Link copied" : "Copy"}
                </button>
              </div>
              <CrewChat
                crew={selectedCrew}
                currentUserId={user.id}
                displayName={displayName}
                memberIdMap={memberIdMap}
              />
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
