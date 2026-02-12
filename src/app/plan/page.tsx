"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSummitStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { BottomNav } from "@/components/layout/BottomNav";
import { format } from "date-fns";

export default function PlanPage() {
  const userProfile = useSummitStore((s) => s.userProfile);
  const currentPlan = useSummitStore((s) => s.currentPlan);
  const loadPlan = useSummitStore((s) => s.loadPlan);

  useEffect(() => {
    if (userProfile) loadPlan(1);
  }, [userProfile, loadPlan]);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      <main className="min-h-dvh px-4 content-pad pt-[max(env(safe-area-inset-top),24px)]">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-zinc-100 mb-2"
        >
          Your Plan
        </motion.h1>
        <p className="text-zinc-500 text-sm mb-6">
          Week {currentPlan?.weekNumber ?? 1}
          {currentPlan?.isDeloadWeek && " • Deload week"}
        </p>

        {currentPlan?.whyThisPlan && (
          <Card className="mb-6">
            <h3 className="text-sm font-medium text-emerald-500 mb-2">Why this plan?</h3>
            <p className="text-zinc-400 text-sm">{currentPlan.whyThisPlan}</p>
          </Card>
        )}

        <div className="space-y-3">
          {currentPlan?.days.map((day, i) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-500 text-xs">{dayNames[i]}</p>
                    <h3 className="text-lg font-semibold text-zinc-100">{day.name}</h3>
                    <p className="text-zinc-400 text-sm">
                      {day.type === "rest"
                        ? "Rest"
                        : `${day.durationMinutes} min • ${day.exercises?.length ?? 0} exercises`}
                    </p>
                  </div>
                  {day.type !== "rest" && (
                    <Link href={`/plan/${i}`}>
                      <button className="text-emerald-500 text-sm font-medium">View</button>
                    </Link>
                  )}
                </div>
                {day.type === "rest" && day.activeRecoverySuggestions?.length ? (
                  <p className="text-zinc-500 text-xs mt-2">
                    {day.activeRecoverySuggestions[0]}
                  </p>
                ) : null}
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
