"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useSummitStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BottomNav } from "@/components/layout/BottomNav";

export default function PlanDayPage() {
  const params = useParams();
  const dayIndex = parseInt(params.day as string, 10);
  const currentPlan = useSummitStore((s) => s.currentPlan);

  const day = currentPlan?.days[dayIndex];
  if (!day) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-zinc-500">Day not found</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-dvh px-4 pt-[max(env(safe-area-inset-top),24px)] pb-24 content-pad"
      >
        <Link href="/plan" className="text-emerald-500 text-sm mb-4 inline-block">
          ← Back to plan
        </Link>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">{day.name}</h1>
        <p className="text-zinc-500 text-sm mb-6">
          {day.durationMinutes} min • {day.type}
        </p>

        {day.warmup?.length ? (
          <Card className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Warmup</h3>
            <ul className="text-zinc-300 text-sm space-y-1">
              {day.warmup.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </Card>
        ) : null}

        {day.exercises?.length ? (
          <Card className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Exercises</h3>
            <div className="space-y-4">
              {day.exercises.map((ex, i) => (
                <div key={ex.id} className="border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                  <p className="font-semibold text-zinc-100">{ex.name}</p>
                  <p className="text-zinc-500 text-sm">
                    {ex.sets} × {ex.reps} • {ex.restSeconds}s rest
                    {ex.rpe ? ` • RPE ${ex.rpe}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {day.cooldown?.length ? (
          <Card className="mb-6">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Cooldown</h3>
            <ul className="text-zinc-300 text-sm space-y-1">
              {day.cooldown.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </Card>
        ) : null}

        <Link href="/workout">
          <Button fullWidth size="lg">
            Start this workout
          </Button>
        </Link>
      </motion.div>
      <BottomNav />
    </>
  );
}
