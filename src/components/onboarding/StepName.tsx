"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./OnboardingWizard";

export function StepName({ value, onChange, onNext }: StepProps) {
  const [name, setName] = useState(value.name ?? "");

  const handleNext = () => {
    const updates = { name: name.trim() || undefined };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-6">
      <Input
        label="Name (optional)"
        placeholder="e.g. Alex"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <Button fullWidth size="lg" onClick={handleNext}>
        Continue
      </Button>
    </div>
  );
}
