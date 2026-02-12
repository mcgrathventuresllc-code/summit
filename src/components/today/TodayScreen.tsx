"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSummitStore } from "@/lib/store";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getMotivationMessage, calcSummitScore, xpToLevel, getLevelName } from "@/lib/gamification";
import { announceLevelUpToCrews, announceSpelunkingToCrews } from "@/lib/crew-service";
import { calcStreak } from "@/lib/gamification";
import { MountainLevelProgress } from "./MountainLevelProgress";
import { LevelUpCelebration } from "./LevelUpCelebration";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function TodayScreen() {
  const userProfile = useSummitStore((s) => s.userProfile);
  const currentPlan = useSummitStore((s) => s.currentPlan);
  const loadPlan = useSummitStore((s) => s.loadPlan);
  const [workoutDates, setWorkoutDates] = useState<string[]>([]);
  const [readingDates, setReadingDates] = useState<string[]>([]);
  const [checkInDates, setCheckInDates] = useState<string[]>([]);
  const [motivation, setMotivation] = useState("");
  const [totalXp, setTotalXp] = useState(0);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");
  const dayOfWeek = new Date().getDay();
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const workoutDay = currentPlan?.days[adjustedDay];
  const isRestDay = !workoutDay || workoutDay.type === "rest";

  useEffect(() => {
    if (!userProfile) return;
    loadPlan(1);
  }, [userProfile, loadPlan]);

  useEffect(() => {
    const fetch = async () => {
      const logs = await db.sessionLogs.toArray();
      const dates = [...new Set(logs.filter((l) => l.completedAt).map((l) => l.date))];
      setWorkoutDates(dates);

      const reads = await db.readingLogs.toArray();
      setReadingDates([...new Set(reads.map((r) => r.date))]);

      const checkIns = await db.eveningCheckIns.toArray();
      setCheckInDates([...new Set(checkIns.map((c) => c.date))]);

      const workoutXp = dates.length * 50;
      const readingXp = reads.reduce((s, r) => s + Math.floor(r.minutesRead / 15) * 15, 0);
      const checkInXp = checkIns.length * 20;
      const budgetReviews = userProfile
        ? await db.budgetReviews.where("userId").equals(userProfile.id).toArray()
        : [];
      const budgetXp = budgetReviews.reduce((s, r) => s + r.xpAwarded, 0);

      setTotalXp(workoutXp + readingXp + checkInXp + budgetXp);
    };
    fetch();
  }, [userProfile?.id]);

  useEffect(() => {
    const streak = workoutDates.length >= 1 ? 1 : 0;
    setMotivation(getMotivationMessage(streak, workoutDates.length === 0, false));
  }, [workoutDates]);

  // Detect level up (only when crossing a level boundary, not on every XP gain)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const lastXp = sessionStorage.getItem("summit_last_xp");
    const lastXpNum = lastXp !== null ? parseInt(lastXp, 10) : null;
    const newLevel = xpToLevel(totalXp);
    const oldLevel = lastXpNum !== null ? xpToLevel(lastXpNum) : 0;
    if (lastXpNum !== null && totalXp > lastXpNum && newLevel > oldLevel) {
      setLevelUpLevel(newLevel);
      announceLevelUpToCrews(newLevel, getLevelName(newLevel)).catch(() => {});
    }
    // Don't overwrite with 0 — that's the initial state before fetch
    if (totalXp > 0 || lastXpNum === null) {
      sessionStorage.setItem("summit_last_xp", String(totalXp));
    }
  }, [totalXp]);

  // Detect streak break (Spelunking) — post to crew when workout streak drops from >0 to 0
  useEffect(() => {
    if (typeof window === "undefined" || !userProfile) return;
    const workoutStreak = calcStreak(workoutDates);
    const lastStreak = sessionStorage.getItem("summit_last_streak");
    const lastStreakNum = lastStreak !== null ? parseInt(lastStreak, 10) : null;
    if (workoutStreak > 0) {
      sessionStorage.setItem("summit_last_streak", String(workoutStreak));
    } else if (lastStreakNum !== null && lastStreakNum > 0) {
      const displayName = userProfile.name ?? "A crew member";
      announceSpelunkingToCrews(displayName).catch(() => {});
      sessionStorage.setItem("summit_last_streak", "0");
    }
  }, [workoutDates, userProfile]);

  const summitScore = calcSummitScore(
    workoutDates.filter((d) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      return new Date(d) >= weekStart;
    }).length,
    userProfile?.daysPerWeek ?? 3,
    readingDates.filter((d) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      return new Date(d) >= weekStart;
    }).length,
    checkInDates.filter((d) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
      return new Date(d) >= weekStart;
    }).length,
    workoutDates.length
  );

  return (
    <>
      <AnimatePresence>
        {levelUpLevel !== null && (
          <LevelUpCelebration
            level={levelUpLevel}
            onDismiss={() => setLevelUpLevel(null)}
          />
        )}
      </AnimatePresence>
      <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="px-4 pt-6 pb-32 safe-top"
    >
      <motion.div variants={item} className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {userProfile?.name ? `Hey, ${userProfile.name}` : "Today"}
          </h1>
          <p className="text-zinc-500 text-sm">{format(new Date(), "EEEE, MMM d")}</p>
        </div>
        <motion.div
          variants={item}
          className="flex flex-col items-end"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl font-bold text-emerald-500">{summitScore}</span>
          <span className="text-xs text-zinc-500">Summit Score</span>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="mb-6">
        <MountainLevelProgress totalXp={totalXp} />
      </motion.div>

      <motion.p variants={item} className="text-emerald-500/90 text-sm mb-6">
        {motivation}
      </motion.p>

      {/* Start today's workout */}
      <motion.div variants={item} className="mb-6">
        {isRestDay ? (
          <Card className="border-zinc-700/50">
            <h2 className="text-lg font-semibold text-zinc-100 mb-2">Today&apos;s workout</h2>
            <p className="text-zinc-400 text-sm mb-4">
              {workoutDay?.activeRecoverySuggestions?.length
                ? "Rest day — active recovery suggestions:"
                : "Rest day — recovery is part of the process."}
            </p>
            {workoutDay?.activeRecoverySuggestions?.map((s, i) => (
              <p key={i} className="text-zinc-300 text-sm mb-1">
                • {s}
              </p>
            ))}
          </Card>
        ) : (
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <h2 className="text-lg font-semibold text-zinc-100 mb-1">Today&apos;s workout</h2>
            <p className="text-zinc-400 text-sm mb-4">
              {workoutDay?.name} • {workoutDay?.durationMinutes} min • {workoutDay?.exercises?.length ?? 0} exercises
            </p>
            <Link href="/workout">
              <Button fullWidth size="lg">
                Start workout
              </Button>
            </Link>
          </Card>
        )}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-2 mb-6">
        <Link href="/read">
          <Card className="cursor-pointer hover:border-zinc-700 transition-colors h-full">
            <span className="text-2xl">📖</span>
            <p className="text-sm font-medium text-zinc-300 mt-1">Reading</p>
            <p className="text-xs text-zinc-500">{readingDates.length} sessions</p>
          </Card>
        </Link>
        <Link href="/recover">
          <Card className="cursor-pointer hover:border-zinc-700 transition-colors h-full">
            <span className="text-2xl">🌙</span>
            <p className="text-sm font-medium text-zinc-300 mt-1">Wind Down</p>
            <p className="text-xs text-zinc-500">{checkInDates.length} check-ins</p>
          </Card>
        </Link>
      </motion.div>
    </motion.div>
    </>
  );
}
