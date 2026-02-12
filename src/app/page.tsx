"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSummitStore } from "@/lib/store";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { TodayScreen } from "@/components/today/TodayScreen";
import { MountainBackground } from "@/components/today/MountainBackground";
import { BottomNav } from "@/components/layout/BottomNav";

export default function HomePage() {
  const hydrated = useSummitStore((s) => s.hydrated);
  const userProfile = useSummitStore((s) => s.userProfile);

  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-zinc-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-zinc-500"
        >
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-2" />
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!userProfile?.completedOnboarding) {
    return <OnboardingWizard />;
  }

  return (
    <>
      <MountainBackground />
      <main className="pt-[env(safe-area-inset-top)] min-h-dvh relative content-pad">
        <TodayScreen />
      </main>
      <BottomNav />
    </>
  );
}
