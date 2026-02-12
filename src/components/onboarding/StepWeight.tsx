"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./OnboardingWizard";

function kgToLb(kg: number): number {
  return Math.round(kg * 2.205);
}

function lbToKg(lb: number): number {
  return Math.round((lb / 2.205) * 10) / 10;
}

export function StepWeight({ value, onChange, onNext }: StepProps) {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const kg = value.weightKg ?? 70;
  const [kgStr, setKgStr] = useState(String(kg));
  const [lbStr, setLbStr] = useState(String(kgToLb(kg)));

  const getWeightKg = () => {
    if (unit === "metric") return parseFloat(kgStr) || 70;
    return lbToKg(parseFloat(lbStr) || 154);
  };

  const valid =
    unit === "metric"
      ? (parseFloat(kgStr) ?? 0) >= 30 && (parseFloat(kgStr) ?? 0) <= 300
      : (parseFloat(lbStr) ?? 0) >= 66 && (parseFloat(lbStr) ?? 0) <= 660;

  const handleNext = () => {
    const updates = { weightKg: getWeightKg() };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 h-10 rounded-lg font-medium ${
            unit === "metric"
              ? "bg-emerald-500 text-zinc-900"
              : "bg-zinc-800 text-zinc-400"
          }`}
          onClick={() => setUnit("metric")}
        >
          kg
        </button>
        <button
          className={`flex-1 h-10 rounded-lg font-medium ${
            unit === "imperial"
              ? "bg-emerald-500 text-zinc-900"
              : "bg-zinc-800 text-zinc-400"
          }`}
          onClick={() => setUnit("imperial")}
        >
          lb
        </button>
      </div>

      {unit === "metric" ? (
        <Input
          label="Weight (kg)"
          type="number"
          min={30}
          max={300}
          step={0.1}
          placeholder="70"
          value={kgStr}
          onChange={(e) => setKgStr(e.target.value)}
        />
      ) : (
        <Input
          label="Weight (lb)"
          type="number"
          min={66}
          max={660}
          step={0.5}
          placeholder="154"
          value={lbStr}
          onChange={(e) => setLbStr(e.target.value)}
        />
      )}

      <Button fullWidth size="lg" onClick={handleNext} disabled={!valid}>
        Continue
      </Button>
    </div>
  );
}
