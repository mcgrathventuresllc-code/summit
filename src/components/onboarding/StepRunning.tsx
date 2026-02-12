"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./OnboardingWizard";

export function StepRunning({ value, onChange, onNext }: StepProps) {
  const [type, setType] = useState<"5k_time" | "easy_pace" | "new_to_running">(
    value.runningBaseline?.type ?? "new_to_running"
  );
  const [val, setVal] = useState(value.runningBaseline?.value ?? "");

  const handleNext = () => {
    const updates = {
      runningBaseline:
        type === "new_to_running"
          ? { type: "new_to_running" as const }
          : { type: type as "5k_time" | "easy_pace", value: val.trim() || undefined },
    };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {[
          { t: "new_to_running" as const, label: "New to running" },
          { t: "5k_time" as const, label: "Current 5k time (e.g. 28:00)" },
          { t: "easy_pace" as const, label: "Easy pace (e.g. 6:30 min/km)" },
        ].map(({ t, label }) => (
          <button
            key={t}
            className={`w-full h-12 px-4 rounded-xl border text-left font-medium ${
              type === t ? "bg-emerald-500/20 border-emerald-500" : "bg-zinc-800/50 border-zinc-700"
            }`}
            onClick={() => setType(t)}
          >
            {label}
          </button>
        ))}
      </div>

      {(type === "5k_time" || type === "easy_pace") && (
        <Input
          label={type === "5k_time" ? "5k time" : "Pace (min/km)"}
          placeholder={type === "5k_time" ? "28:00" : "6:30"}
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      )}

      <Button fullWidth size="lg" onClick={handleNext}>
        Continue
      </Button>
    </div>
  );
}
