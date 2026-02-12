"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DURATION_OPTIONS } from "@/lib/onboarding-steps";
import type { StepProps } from "./OnboardingWizard";

export function StepDaysDuration({ value, onChange, onNext }: StepProps) {
  const [days, setDays] = useState(value.daysPerWeek ?? 3);

  const handleNext = () => {
    const updates = { daysPerWeek: days, preferredDuration: value.preferredDuration ?? 45 };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-zinc-400 mb-3">Days per week</p>
        <div className="flex gap-2 flex-wrap">
          {[3, 4, 5, 6].map((d) => (
            <button
              key={d}
              className={`h-12 w-14 rounded-xl font-semibold transition-colors ${
                days === d ? "bg-emerald-500 text-zinc-900" : "bg-zinc-800 text-zinc-400"
              }`}
              onClick={() => setDays(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-zinc-400 mb-3">Preferred workout duration</p>
        <div className="space-y-2">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`w-full h-12 px-4 rounded-xl border text-left font-medium transition-colors ${
                (value.preferredDuration ?? 45) === opt.value
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                  : "bg-zinc-800/50 border-zinc-700 text-zinc-100"
              }`}
              onClick={() => onChange({ preferredDuration: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Button fullWidth size="lg" onClick={handleNext}>
        Continue
      </Button>
    </div>
  );
}
