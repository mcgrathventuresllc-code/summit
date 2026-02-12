"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./OnboardingWizard";

export function StepInjuries({ value, onChange, onNext }: StepProps) {
  const [injuries, setInjuries] = useState(value.injuries ?? "");
  const [knees, setKnees] = useState(value.injuryToggles?.knees ?? false);
  const [shoulders, setShoulders] = useState(value.injuryToggles?.shoulders ?? false);
  const [back, setBack] = useState(value.injuryToggles?.back ?? false);

  const handleNext = () => {
    const updates = {
      injuries: injuries.trim() || undefined,
      injuryToggles: { knees, shoulders, back },
    };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-6">
      <Input
        label="Injuries / limitations (optional)"
        placeholder="e.g. Previous ACL surgery, lower back stiffness"
        value={injuries}
        onChange={(e) => setInjuries(e.target.value)}
      />

      <div>
        <p className="text-sm text-zinc-400 mb-2">Common limitations</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "knees", label: "Knees", val: knees, set: setKnees },
            { key: "shoulders", label: "Shoulders", val: shoulders, set: setShoulders },
            { key: "back", label: "Back", val: back, set: setBack },
          ].map(({ key, label, val, set }) => (
            <button
              key={key}
              className={`h-10 px-4 rounded-lg font-medium transition-colors ${
                val ? "bg-emerald-500/30 border border-emerald-500 text-emerald-500" : "bg-zinc-800 text-zinc-400"
              }`}
              onClick={() => set(!val)}
            >
              {label}
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
