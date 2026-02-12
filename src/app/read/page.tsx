"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useSummitStore } from "@/lib/store";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { XP_PER_READING_SESSION, calcStreak } from "@/lib/gamification";
import { BottomNav } from "@/components/layout/BottomNav";

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ReadPage() {
  const userProfile = useSummitStore((s) => s.userProfile);
  const [logs, setLogs] = useState<{ id: string; date: string; title?: string; pagesRead: number; minutesRead: number }[]>([]);
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState(false);
  const [reading, setReading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [finishPages, setFinishPages] = useState("");
  const [showResult, setShowResult] = useState<{ xp: number; minutes: number } | null>(null);
  const startRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!userProfile) return;
      const all = await db.readingLogs.where("userId").equals(userProfile.id).reverse().limit(30).toArray();
      setLogs(all);
    };
    fetchLogs();
  }, [userProfile, saved]);

  const startReading = () => {
    setReading(true);
    startRef.current = Date.now();
    setElapsed(0);
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
  };

  const finishReading = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const totalSeconds = Math.floor((Date.now() - startRef.current) / 1000);
    const minutesRead = Math.floor(totalSeconds / 60);
    const pgs = parseInt(finishPages, 10) || 0;
    setFinishPages("");

    if (minutesRead < 1) {
      setShowResult({ xp: 0, minutes: 0 });
      setTimeout(() => { setReading(false); setShowResult(null); }, 3000);
      return;
    }
    const xp = Math.floor(minutesRead / 15) * XP_PER_READING_SESSION;
    setShowResult({ xp, minutes: minutesRead });

    if (userProfile) {
      await db.readingLogs.add({
        id: crypto.randomUUID(),
        userId: userProfile.id,
        date: format(new Date(), "yyyy-MM-dd"),
        title: title.trim() || undefined,
        pagesRead: pgs,
        minutesRead,
        completedAt: Date.now(),
      });
      setSaved(true);
      setTitle("");
    }
    setTimeout(() => { setReading(false); setShowResult(null); setSaved(false); }, 3500);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const readingDates = [...new Set(logs.map((l) => l.date))];
  const streak = calcStreak(readingDates);
  const xpEarned = logs.reduce((s, r) => s + Math.floor(r.minutesRead / 15) * XP_PER_READING_SESSION, 0);

  if (!userProfile) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 content-pad"
      >
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Reading</h1>
        <p className="text-zinc-500 text-sm mb-6">
          Log sessions to build your streak and earn XP.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card>
            <p className="text-2xl font-bold text-emerald-500">{streak}</p>
            <p className="text-xs text-zinc-500">day streak</p>
          </Card>
          <Card>
            <p className="text-2xl font-bold text-zinc-100">{xpEarned}</p>
            <p className="text-xs text-zinc-500">XP from reading</p>
          </Card>
        </div>

        <Card className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Today&apos;s reading</h3>
          <Input
            label="Book / article (optional)"
            placeholder="What are you reading?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={reading}
          />
          {!reading ? (
            <Button fullWidth size="lg" className="mt-4" onClick={startReading}>
              {saved ? "Logged! +XP" : "Start reading"}
            </Button>
          ) : null}
        </Card>

        <AnimatePresence>
          {reading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-sm p-6 pt-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),24px)]"
            >
              {!showResult ? (
                <>
                  <p className="text-zinc-500 text-sm mb-2">Reading in progress</p>
                  <p className="text-5xl font-bold text-emerald-500 font-mono tabular-nums mb-8">
                    {formatElapsed(elapsed)}
                  </p>
                  <p className="text-zinc-500 text-xs mb-6">
                    {Math.floor(elapsed / 60)} min • {Math.floor(elapsed / 15) * XP_PER_READING_SESSION} XP so far
                  </p>
                  <div className="flex flex-col gap-3 w-full max-w-sm">
                    <Input
                      label="Pages read (optional)"
                      type="number"
                      min={0}
                      placeholder="0"
                      value={finishPages}
                      onChange={(e) => setFinishPages(e.target.value)}
                    />
                    <Button fullWidth size="lg" onClick={finishReading}>
                      Finish reading
                    </Button>
                  </div>
                </>
              ) : (
                <motion.div
                  key="result"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="rounded-3xl bg-zinc-900 border-2 border-emerald-500/50 px-10 py-8 shadow-2xl shadow-emerald-500/20 text-center max-w-sm w-full"
                >
                  <motion.p
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-6xl mb-2"
                  >
                    📖
                  </motion.p>
                  <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-1">
                    Reading complete!
                  </p>
                  {showResult.xp > 0 ? (
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                      className="text-4xl font-bold text-emerald-500"
                    >
                      +{showResult.xp} XP
                    </motion.p>
                  ) : (
                    <p className="text-zinc-400 text-sm mt-2">
                      Read at least 1 min to earn XP
                    </p>
                  )}
                  <p className="text-zinc-500 text-xs mt-3">
                    {showResult.xp > 0 ? `${showResult.minutes} min logged • ` : ""}Dismissing…
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <h3 className="text-sm font-medium text-zinc-400 mb-2">Recent sessions</h3>
        <div className="space-y-2">
          {logs.slice(0, 10).map((log) => (
            <Card key={log.id} className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-zinc-100 font-medium">{log.title || "Reading"}</p>
                  <p className="text-zinc-500 text-sm">
                    {log.date} · {log.minutesRead} min
                    {log.pagesRead > 0 ? ` · ${log.pagesRead} pages` : ""}
                  </p>
                </div>
                <span className="text-emerald-500 text-sm">
                  +{Math.floor(log.minutesRead / 15) * XP_PER_READING_SESSION} XP
                </span>
              </div>
            </Card>
          ))}
          {logs.length === 0 && (
            <p className="text-zinc-500 text-sm">No sessions yet. Log your first one above.</p>
          )}
        </div>
      </motion.div>
      <BottomNav />
    </>
  );
}
