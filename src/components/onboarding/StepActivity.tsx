"use client";

import { Button } from "@/components/ui/Button";
import { ACTIVITY_OPTIONS } from "@/lib/onboarding-steps";
import type { StepProps } from "./OnboardingWizard";

export function StepActivity({ value, onChange, onNext }: StepProps) {
  return (
    <div className="space-y-3">
      {ACTIVITY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`w-full h-14 px-4 rounded-xl border text-left font-medium transition-colors tap-target ${
            value.activityLevel === opt.value
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
              : "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:border-zinc-600"
          }`}
          onClick={() => {
            const updates = { activityLevel: opt.value };
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
