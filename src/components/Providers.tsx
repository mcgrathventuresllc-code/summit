"use client";

import { useEffect, useState } from "react";
import { useSummitStore } from "@/lib/store";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AppAuth } from "@/components/auth/AppAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useSummitStore((s) => s.hydrate);
  const setTheme = useSummitStore((s) => s.setTheme);
  const theme = useSummitStore((s) => s.theme);

  useEffect(() => {
    if (!isSupabaseConfigured) hydrate();
    const stored = localStorage.getItem("summit-theme") as "light" | "dark" | null;
    if (stored) setTheme(stored);
    else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, [hydrate, setTheme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <>
      {isSupabaseConfigured ? <AuthGate>{children}</AuthGate> : children}
    </>
  );
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const [authReady, setAuthReady] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<{ id: string } | null>(null);
  const hydrateWithAuth = useSummitStore((s) => s.hydrateWithAuth);
  const setSupabaseUserId = useSummitStore((s) => s.setSupabaseUserId);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSupabaseUser(user ? { id: user.id } : null);
      if (user) hydrateWithAuth(user.id);
      else setSupabaseUserId(null);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setSupabaseUser(u ? { id: u.id } : null);
      if (u) hydrateWithAuth(u.id);
      else setSupabaseUserId(null);
    });
    return () => subscription.unsubscribe();
  }, [hydrateWithAuth, setSupabaseUserId]);

  if (!authReady) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!supabaseUser) return <AppAuth onSuccess={() => {}} />;
  return <>{children}</>;
}
