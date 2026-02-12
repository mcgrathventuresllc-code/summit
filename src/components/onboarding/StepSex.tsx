"use client";

import { Button } from "@/components/ui/Button";
import { SEX_OPTIONS } from "@/lib/onboarding-steps";
import type { StepProps } from "./OnboardingWizard";

export function StepSex({ value, onChange, onNext }: StepProps) {
  const handleSelect = (v: string) => {
    const updates = { sex: v ? (v as "male" | "female" | "prefer_not") : undefined };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-3">
      {SEX_OPTIONS.filter((o) => o.value === "male" || o.value === "female" || o.value === "").map((opt) => (
        <button
          key={opt.value || "skip"}
          className="w-full h-14 px-4 rounded-xl bg-zinc-800/50 border border-zinc-700 text-left text-zinc-100 font-medium hover:border-emerald-500/50 hover:bg-zinc-800 transition-colors tap-target"
          onClick={() => handleSelect(opt.value)}
        >
          {opt.label}
        </button>
      ))}
      <Button variant="ghost" fullWidth className="mt-4" onClick={() => handleSelect("")}>
        Skip
      </Button>
    </div>
  );
}
