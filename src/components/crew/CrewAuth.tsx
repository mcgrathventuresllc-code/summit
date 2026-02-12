"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient, hasPlaceholderConfig } from "@/lib/supabase/client";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

interface CrewAuthProps {
  onSuccess: () => void;
}

type AuthMode = "magic" | "password";

export function CrewAuth({ onSuccess }: CrewAuthProps) {
  const [mode, setMode] = useState<AuthMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [reachable, setReachable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!SUPABASE_URL || SUPABASE_URL.includes("your-project")) return;
    fetch(`${SUPABASE_URL}/auth/v1/health`, { method: "GET" })
      .then((r) => setReachable(r.ok))
      .catch(() => setReachable(false));
  }, []);

  const setErr = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    const isNetworkError = msg.includes("fetch") || msg.includes("Failed to fetch") || msg.includes("NetworkError");
    const isRateLimit = msg.toLowerCase().includes("rate") || msg.toLowerCase().includes("limit") || msg.includes("429");
    if (hasPlaceholderConfig) {
      setError("Replace the placeholder values in .env.local with your real Supabase credentials.");
    } else if (isRateLimit) {
      setError("Email rate limit exceeded. Use sign in with password below, or try again in an hour.");
    } else if (isNetworkError) {
      setError("Can't reach Supabase. Check project status and restart dev server.");
    } else {
      setError(msg || "Something went wrong");
    }
  };

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/crew` : undefined,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setErr(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/crew` : undefined },
        });
        if (error) throw error;
        onSuccess();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        onSuccess();
      }
    } catch (err) {
      setErr(err);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center">
        <p className="text-emerald-400 font-medium">Check your inbox</p>
        <p className="text-zinc-500 text-sm mt-2">
          We sent a sign-in link to <span className="text-zinc-300">{email}</span>
        </p>
        <button
          type="button"
          onClick={() => { setSent(false); setEmail(""); }}
          className="text-sm text-emerald-500 hover:text-emerald-400 mt-4"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reachable === false && (
        <p className="text-amber-500/90 text-sm rounded-lg bg-amber-500/10 p-3">
          Supabase is unreachable. Project may be paused—check the dashboard and click Restore.
        </p>
      )}

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => { setMode("password"); setError(""); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "password" ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"}`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => { setMode("magic"); setError(""); }}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "magic" ? "bg-emerald-500/20 text-emerald-500" : "bg-zinc-800/50 text-zinc-500 hover:text-zinc-300"}`}
        >
          Magic link
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={(e) => handlePasswordAuth(e, false)} className="space-y-4">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-zinc-500 text-xs text-center">
            New?{" "}
            <button
              type="button"
              onClick={(e) => handlePasswordAuth(e, true)}
              className="text-emerald-500 hover:text-emerald-400"
            >
              Sign up with email & password
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSendLink} className="space-y-4">
          <p className="text-zinc-500 text-sm">
            We&apos;ll send a sign-in link to your email—no password needed.
          </p>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Sending…" : "Send magic link"}
          </Button>
        </form>
      )}
    </div>
  );
}
