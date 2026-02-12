"use client";

import { GOAL_OPTIONS } from "@/lib/onboarding-steps";
import type { StepProps } from "./OnboardingWizard";

export function StepGoal({ value, onChange, onNext }: StepProps) {
  return (
    <div className="space-y-3">
      {GOAL_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`w-full h-14 px-4 rounded-xl border text-left font-medium transition-colors tap-target ${
            value.primaryGoal === opt.value
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
              : "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:border-zinc-600"
          }`}
          onClick={() => {
            const updates = { primaryGoal: opt.value };
            onChange(updates);
            onNext(updates);
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
