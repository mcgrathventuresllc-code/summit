"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { StepProps } from "./OnboardingWizard";

const DEFAULT_DAYS = [
  { name: "Push", type: "strength" as const },
  { name: "Pull", type: "strength" as const },
  { name: "Legs", type: "strength" as const },
];

export function StepManualPlan({ value, onChange, onNext }: StepProps) {
  const days = value.manualPlanDays ?? DEFAULT_DAYS;
  const [localDays, setLocalDays] = useState(days);

  const addDay = () => {
    const next = [...localDays, { name: "Rest", type: "rest" as const }];
    setLocalDays(next);
    onChange({ manualPlanDays: next });
  };

  const removeDay = (i: number) => {
    if (localDays.length <= 1) return;
    const next = localDays.filter((_, idx) => idx !== i);
    setLocalDays(next);
    onChange({ manualPlanDays: next });
  };

  const updateDay = (i: number, updates: Partial<(typeof localDays)[0]>) => {
    const next = localDays.map((d, idx) =>
      idx === i ? { ...d, ...updates } : d
    );
    setLocalDays(next);
    onChange({ manualPlanDays: next });
  };

  const handleNext = () => {
    const valid = localDays.filter((d) => d.name.trim());
    if (valid.length === 0) return;
    onChange({ manualPlanDays: valid });
    onNext({ manualPlanDays: valid });
  };

  return (
    <div className="space-y-4">
      <p className="text-zinc-500 text-sm">
        Add your training days for the week. Order matters (Day 1 = first weekday, etc.).
      </p>

      {localDays.map((day, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            placeholder="Day name (e.g. Push, Pull, Legs)"
            value={day.name}
            onChange={(e) => updateDay(i, { name: e.target.value })}
            className="flex-1"
          />
          <select
            value={day.type}
            onChange={(e) =>
              updateDay(i, {
                type: e.target.value as "strength" | "rest",
              })
            }
            className="h-14 px-3 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-100 text-sm"
          >
            <option value="strength">Strength</option>
            <option value="rest">Rest</option>
          </select>
          <button
            type="button"
            onClick={() => removeDay(i)}
            disabled={localDays.length <= 1}
            className="text-zinc-500 hover:text-red-400 disabled:opacity-30 p-2"
            aria-label="Remove day"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addDay}
        className="text-sm text-emerald-500 hover:text-emerald-400"
      >
        + Add day
      </button>

      <Button fullWidth size="lg" onClick={handleNext} className="mt-6">
        Continue
      </Button>
    </div>
  );
}
