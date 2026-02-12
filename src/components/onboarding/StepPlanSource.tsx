"use client";

import type { StepProps } from "./OnboardingWizard";

export function StepPlanSource({ value, onChange, onNext }: StepProps) {
  const useManual = value.useManualPlan ?? false;

  return (
    <div className="space-y-3">
      <button
        className={`w-full h-14 px-4 rounded-xl border text-left font-medium transition-colors tap-target ${
          !useManual
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
            : "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:border-zinc-600"
        }`}
        onClick={() => {
          onChange({ useManualPlan: false });
          onNext({ useManualPlan: false });
        }}
      >
        Generate a plan for me
      </button>
      <button
        className={`w-full h-14 px-4 rounded-xl border text-left font-medium transition-colors tap-target ${
          useManual
            ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
            : "bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:border-zinc-600"
        }`}
        onClick={() => {
          onChange({ useManualPlan: true });
          onNext({ useManualPlan: true });
        }}
      >
        I have my own plan
      </button>
      <p className="text-zinc-500 text-sm mt-4">
        {useManual
          ? "You’ll enter your training days next."
          : "We’ll create a plan based on your preferences."}
      </p>
    </div>
  );
}
