"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./OnboardingWizard";

export function StepAge({ value, onChange, onNext }: StepProps) {
  const [ageStr, setAgeStr] = useState(String(value.age ?? ""));

  const age = parseInt(ageStr, 10);
  const valid = age >= 13 && age <= 120;

  const handleNext = () => {
    if (!valid) return;
    const updates = { age };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-6">
      <Input
        label="Age (years)"
        type="number"
        min={13}
        max={120}
        placeholder="25"
        value={ageStr}
        onChange={(e) => setAgeStr(e.target.value)}
        autoFocus
      />
      <Button fullWidth size="lg" onClick={handleNext} disabled={!valid}>
        Continue
      </Button>
    </div>
  );
}
