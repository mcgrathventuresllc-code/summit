"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./OnboardingWizard";

export function StepSteps({ value, onChange, onNext }: StepProps) {
  const [steps, setSteps] = useState(value.stepGoal?.toString() ?? "");

  const handleNext = () => {
    const n = parseInt(steps, 10);
    const updates = { stepGoal: isNaN(n) ? undefined : n };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-6">
      <Input
        label="Daily step goal (optional)"
        type="number"
        min={1000}
        max={50000}
        step={500}
        placeholder="e.g. 10000"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
      />
      <Button fullWidth size="lg" onClick={handleNext}>
        Continue
      </Button>
    </div>
  );
}
