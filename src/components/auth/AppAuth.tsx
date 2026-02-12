"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient, hasPlaceholderConfig, isSupabaseConfigured } from "@/lib/supabase/client";
import { MountainBackground } from "@/components/today/MountainBackground";

interface AppAuthProps {
  onSuccess: () => void;
}

type AuthMode = "signin" | "signup";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function AppAuth({ onSuccess }: AppAuthProps) {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const setErr = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    if (hasPlaceholderConfig) {
      setError("Replace the placeholder values in .env.local with your real Supabase credentials.");
    } else if (msg.includes("fetch") || msg.includes("Failed to fetch")) {
      setError("Can't reach Supabase. Check project status.");
    } else if (msg.toLowerCase().includes("invalid") && msg.toLowerCase().includes("credential")) {
      setError("Invalid email or password. If you just created an account, check your email to confirm it first.");
    } else {
      setError(msg || "Something went wrong");
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const redirectUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/auth/callback` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });
      if (error) throw error;
    } catch (err) {
      setErr(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSignUpSuccess(false);
    setLoading(true);
    try {
      const supabase = createClient();
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      const redirectUrl = baseUrl || undefined;
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          setLoading(false);
          return;
        }
        setSignUpSuccess(true);
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

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-zinc-950">
        <div className="rounded-2xl bg-zinc-800/50 border border-zinc-700 p-6 max-w-sm text-center">
          <p className="text-zinc-400">Sign in requires Supabase.</p>
          <p className="text-zinc-500 text-sm mt-2">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 pt-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),24px)] relative overflow-hidden">
      <MountainBackground />

      {/* Snow blowing through the mountains */}
      <div className="fixed inset-0 -z-[5] overflow-hidden pointer-events-none" aria-hidden>
        {[
          { left: "3%", top: "-5%", size: 2, cls: "snow-blow", delay: "0s" },
          { left: "12%", top: "-12%", size: 3, cls: "snow-blow-slow", delay: "2s" },
          { left: "22%", top: "0%", size: 2, cls: "snow-blow-fast", delay: "1s" },
          { left: "32%", top: "-10%", size: 2, cls: "snow-blow", delay: "3s" },
          { left: "42%", top: "-18%", size: 3, cls: "snow-blow-slow", delay: "0.5s" },
          { left: "52%", top: "-6%", size: 2, cls: "snow-blow-fast", delay: "4s" },
          { left: "62%", top: "-14%", size: 2, cls: "snow-blow", delay: "1.5s" },
          { left: "72%", top: "-2%", size: 3, cls: "snow-blow-slow", delay: "2.5s" },
          { left: "82%", top: "-10%", size: 2, cls: "snow-blow-fast", delay: "0.8s" },
          { left: "90%", top: "-22%", size: 2, cls: "snow-blow", delay: "3.5s" },
          { left: "8%", top: "15%", size: 2, cls: "snow-blow-slow", delay: "5s" },
          { left: "18%", top: "8%", size: 2, cls: "snow-blow", delay: "1.2s" },
          { left: "28%", top: "22%", size: 3, cls: "snow-blow-fast", delay: "6s" },
          { left: "38%", top: "5%", size: 2, cls: "snow-blow-slow", delay: "2.2s" },
          { left: "48%", top: "18%", size: 2, cls: "snow-blow", delay: "4.5s" },
          { left: "58%", top: "12%", size: 2, cls: "snow-blow-fast", delay: "0.3s" },
          { left: "68%", top: "25%", size: 3, cls: "snow-blow-slow", delay: "7s" },
          { left: "78%", top: "8%", size: 2, cls: "snow-blow", delay: "3.2s" },
          { left: "88%", top: "20%", size: 2, cls: "snow-blow-fast", delay: "5.5s" },
          { left: "5%", top: "35%", size: 2, cls: "snow-blow-slow", delay: "8s" },
          { left: "25%", top: "42%", size: 3, cls: "snow-blow", delay: "4.2s" },
          { left: "45%", top: "38%", size: 2, cls: "snow-blow-fast", delay: "6.5s" },
          { left: "65%", top: "45%", size: 2, cls: "snow-blow-slow", delay: "2.8s" },
          { left: "85%", top: "32%", size: 2, cls: "snow-blow", delay: "9s" },
          { left: "15%", top: "55%", size: 2, cls: "snow-blow-fast", delay: "5.8s" },
          { left: "55%", top: "58%", size: 3, cls: "snow-blow-slow", delay: "7.5s" },
          { left: "95%", top: "48%", size: 2, cls: "snow-blow", delay: "1.8s" },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-white/70 ${p.cls}`}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-sm"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative rounded-3xl border border-zinc-700/80 bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-black/40 p-8"
        >
          {/* Subtle emerald border glow */}
          <div className="absolute inset-0 rounded-3xl bg-emerald-500/5 pointer-events-none" />

          <motion.div variants={item} className="text-center mb-8">
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-5xl mb-3"
            >
              ⛰️
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-3xl font-bold text-zinc-100 tracking-tight"
            >
              Summit
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-zinc-500 text-sm mt-1"
            >
              Climb higher, together
            </motion.p>
          </motion.div>

          <motion.div variants={item} className="flex gap-2 mb-6 p-1 rounded-xl bg-zinc-800/50">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setSignUpSuccess(false);
              }}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                mode === "signin"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setSignUpSuccess(false);
              }}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                mode === "signup"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
            >
              Create account
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            {signUpSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-6 overflow-hidden"
              >
                <p className="text-emerald-400 font-medium text-sm">Account created!</p>
                <p className="text-zinc-500 text-xs mt-1">
                  Check your email to confirm, then sign in. Or if email confirmation is off, you may
                  already be in.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={item}>
            <Button
              type="button"
              variant="outline"
              fullWidth
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="gap-2 text-zinc-100 hover:bg-zinc-800/50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </motion.div>

          <motion.div variants={item} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700/80" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-900/60 px-3 text-zinc-500">or continue with email</span>
            </div>
          </motion.div>

          <motion.form variants={item} onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
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
              minLength={6}
            />
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl bg-red-500/10 border border-red-500/30 p-3"
                >
                  <p className="text-sm text-red-400">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="relative overflow-hidden"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-5 h-5 border-2 border-zinc-900/30 border-t-zinc-100 rounded-full"
                  />
                  Please wait…
                </span>
              ) : (
                <span>{mode === "signin" ? "Sign in" : "Create account"}</span>
              )}
            </Button>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}
