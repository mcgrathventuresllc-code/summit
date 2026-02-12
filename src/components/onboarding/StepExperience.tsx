"use client";

import { EXPERIENCE_OPTIONS } from "@/lib/onboarding-steps";
import type { StepProps } from "./OnboardingWizard";

export function StepExperience({ value, onChange, onNext }: StepProps) {
  return (
    <div className="space-y-3">
      {EXPERIENCE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`w-full h-14 px-4 rounded-xl border text-left font-medium transition-colors tap-target ${
            value.trainingExperience === opt.value
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
              : "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:border-zinc-600"
          }`}
          onClick={() => {
            const updates = { trainingExperience: opt.value };
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
