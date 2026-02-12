"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { ONBOARDING_STEPS } from "@/lib/onboarding-steps";
import { useSummitStore } from "@/lib/store";
import { db } from "@/lib/db";
import { generatePlan, buildManualPlan } from "@/lib/plan-generator";
import type { UserProfile } from "@/lib/types";
import { StepName } from "./StepName";
import { StepAge } from "./StepAge";
import { StepSex } from "./StepSex";
import { StepHeight } from "./StepHeight";
import { StepWeight } from "./StepWeight";
import { StepActivity } from "./StepActivity";
import { StepGoal } from "./StepGoal";
import { StepExperience } from "./StepExperience";
import { StepDaysDuration } from "./StepDaysDuration";
import { StepEquipment } from "./StepEquipment";
import { StepInjuries } from "./StepInjuries";
import { StepSplit } from "./StepSplit";
import { StepRunning } from "./StepRunning";
import { StepSteps } from "./StepSteps";
import { StepNotifications } from "./StepNotifications";
import { StepPlanSource } from "./StepPlanSource";
import { StepManualPlan } from "./StepManualPlan";

const STEP_COMPONENTS: Record<string, React.ComponentType<StepProps>> = {
  name: StepName,
  age: StepAge,
  sex: StepSex,
  height: StepHeight,
  weight: StepWeight,
  activity: StepActivity,
  goal: StepGoal,
  experience: StepExperience,
  days_duration: StepDaysDuration,
  equipment: StepEquipment,
  injuries: StepInjuries,
  split: StepSplit,
  running: StepRunning,
  steps: StepSteps,
  notifications: StepNotifications,
  plan_source: StepPlanSource,
  manual_plan: StepManualPlan,
};

export interface StepProps {
  value: Partial<UserProfile>;
  onChange: (updates: Partial<UserProfile>) => void;
  onNext: (updates?: Partial<UserProfile>) => void;
}

function createInitialProfile(): UserProfile {
  const id = crypto.randomUUID?.() ?? `user-${Date.now()}`;
  return {
    id,
    age: 25,
    heightCm: 170,
    weightKg: 70,
    activityLevel: "moderate",
    primaryGoal: "general_fitness",
    trainingExperience: "beginner",
    daysPerWeek: 3,
    preferredDuration: 45,
    equipmentAccess: "full_gym",
    preferredSplit: "full_body",
    completedOnboarding: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function OnboardingWizard() {
  const router = useRouter();
  const supabaseUserId = useSummitStore((s) => s.supabaseUserId);
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(() => createInitialProfile());

  useEffect(() => {
    if (supabaseUserId) {
      setProfile((p) => ({ ...p, supabaseUserId }));
    }
  }, [supabaseUserId]);
  const setUserProfile = useSummitStore((s) => s.setUserProfile);

  const step = ONBOARDING_STEPS[stepIndex];
  const StepComponent = STEP_COMPONENTS[step?.id ?? "name"];
  const progress = ((stepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  const saveAndNext = useCallback(
    async (updates?: Partial<UserProfile>) => {
      const merged = { ...profile, ...updates, updatedAt: Date.now() };
      setProfile(merged);
      await db.userProfiles.put(merged);

      const isLastStep = stepIndex >= ONBOARDING_STEPS.length - 1;
      const choseGenerate = (updates?.useManualPlan ?? merged.useManualPlan) === false;
      const onPlanSource = step?.id === "plan_source";

      if (onPlanSource && choseGenerate) {
        const final: UserProfile = { ...merged, completedOnboarding: true, updatedAt: Date.now() };
        await db.userProfiles.put(final);
        setUserProfile(final);
        const plan = generatePlan(final, 1);
        await db.workoutPlans.put(plan);
        router.replace("/");
        return;
      }

      if (isLastStep) {
        const final: UserProfile = { ...merged, completedOnboarding: true, updatedAt: Date.now() };
        await db.userProfiles.put(final);
        setUserProfile(final);
        const plan =
          merged.useManualPlan && merged.manualPlanDays?.length
            ? buildManualPlan(final, merged.manualPlanDays)
            : generatePlan(final, 1);
        await db.workoutPlans.put(plan);
        router.replace("/");
        return;
      }
      setStepIndex((i) => i + 1);
    },
    [profile, stepIndex, step?.id, setUserProfile, router]
  );

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  if (!step || !StepComponent) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-dvh flex flex-col bg-zinc-950 px-4 pt-[max(env(safe-area-inset-top),32px)] pb-[max(env(safe-area-inset-bottom),48px)]"
    >
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={handleBack} aria-label="Back">
          {stepIndex > 0 ? "← Back" : " "}
        </Button>
        <span className="text-sm text-zinc-500">
          {stepIndex + 1} / {ONBOARDING_STEPS.length}
        </span>
      </div>

      <Progress value={progress} className="mb-8" />

      <motion.h1
        key={step.id}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold text-zinc-100 mb-2"
      >
        {step.title}
      </motion.h1>

      <div className="flex-1 mt-6">
        <StepComponent
          value={profile}
          onChange={(u) => setProfile((p) => ({ ...p, ...u }))}
          onNext={(u) => saveAndNext(u ?? {})}
        />
      </div>
    </motion.div>
  );
}
