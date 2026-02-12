"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSummitStore } from "@/lib/store";
import { BottomNav } from "@/components/layout/BottomNav";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { XP_PER_CHECK_IN } from "@/lib/gamification";

const SCALE_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export default function RecoverPage() {
  const router = useRouter();
  const userProfile = useSummitStore((s) => s.userProfile);
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [soreness, setSoreness] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [stress, setStress] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [caffeineAfterNoon, setCaffeineAfterNoon] = useState(false);
  const [alcoholConsumed, setAlcoholConsumed] = useState(false);
  const [screenTimeBeforeBed, setScreenTimeBeforeBed] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    const check = async () => {
      if (!userProfile) return;
      const existing = await db.eveningCheckIns.where({ userId: userProfile.id, date: today }).first();
      if (existing) setAlreadyDone(true);
    };
    check();
  }, [userProfile, today]);

  const handleSubmit = async () => {
    if (!userProfile) return;
    const checkIn = {
      id: crypto.randomUUID(),
      userId: userProfile.id,
      date: today,
      completedAt: Date.now(),
      sleepQuality,
      soreness,
      stress,
      energy,
      caffeineAfterNoon,
      alcoholConsumed,
      screenTimeBeforeBed,
      notes: notes.trim() || undefined,
    };
    await db.eveningCheckIns.add(checkIn);
    setSubmitted(true);
  };

  if (!userProfile) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-4">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (alreadyDone) {
    return (
      <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 content-pad"
      >
        <Card>
          <p className="text-emerald-500 font-medium">You already completed today&apos;s wind-down.</p>
          <p className="text-zinc-400 text-sm mt-2">Check back tomorrow evening.</p>
          <Button className="mt-4" variant="outline" onClick={() => router.push("/")}>
            Back to Today
          </Button>
        </Card>
      </motion.div>
      <BottomNav />
      </>
    );
  }

  if (submitted) {
    return (
      <>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 flex flex-col items-center justify-center min-h-[60vh] content-pad"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl mb-4"
        >
          ✨
        </motion.span>
        <h2 className="text-xl font-semibold text-zinc-100">Wind-down recorded</h2>
        <p className="text-zinc-500 text-sm mt-1">+{XP_PER_CHECK_IN} XP</p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to Today
        </Button>
      </motion.div>
      <BottomNav />
      </>
    );
  }

  return (
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 content-pad"
    >
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Wind down</h1>
      <p className="text-zinc-500 text-sm mb-6">
        Quick check-in before bed — like WHOOP. Helps you spot patterns.
      </p>

      <div className="space-y-6">
        <Card>
          <h3 className="text-sm font-medium text-zinc-400 mb-4">How do you expect to sleep tonight?</h3>
          <div className="flex gap-2 justify-between">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                onClick={() => setSleepQuality(n)}
                className={`flex-1 h-12 rounded-xl font-medium transition-colors ${
                  sleepQuality === n ? "bg-emerald-500 text-zinc-900" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2">{SCALE_LABELS[sleepQuality]}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Soreness (1 = fresh, 5 = very sore)</h3>
          <div className="flex gap-2 justify-between">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                onClick={() => setSoreness(n)}
                className={`flex-1 h-12 rounded-xl font-medium transition-colors ${
                  soreness === n ? "bg-emerald-500 text-zinc-900" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Stress (1 = calm, 5 = very stressed)</h3>
          <div className="flex gap-2 justify-between">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                onClick={() => setStress(n)}
                className={`flex-1 h-12 rounded-xl font-medium transition-colors ${
                  stress === n ? "bg-emerald-500 text-zinc-900" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Screen time before bed (1 = minimal, 5 = heavy)</h3>
          <div className="flex gap-2 justify-between">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                onClick={() => setScreenTimeBeforeBed(n)}
                className={`flex-1 h-12 rounded-xl font-medium transition-colors ${
                  screenTimeBeforeBed === n ? "bg-emerald-500 text-zinc-900" : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex gap-4">
            <button
              onClick={() => setCaffeineAfterNoon(!caffeineAfterNoon)}
              className={`flex-1 h-12 rounded-xl font-medium ${
                caffeineAfterNoon ? "bg-amber-500/20 border border-amber-500 text-amber-500" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              Caffeine after noon
            </button>
            <button
              onClick={() => setAlcoholConsumed(!alcoholConsumed)}
              className={`flex-1 h-12 rounded-xl font-medium ${
                alcoholConsumed ? "bg-amber-500/20 border border-amber-500 text-amber-500" : "bg-zinc-800 text-zinc-400"
              }`}
            >
              Alcohol today
            </button>
          </div>
        </Card>

        <Card>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Notes (optional)</label>
          <textarea
            className="w-full h-24 px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
            placeholder="How are you feeling?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Card>

        <Button fullWidth size="lg" onClick={handleSubmit}>
          Save wind-down
        </Button>
      </div>
      <BottomNav />
    </motion.div>
  );
}
