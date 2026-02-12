"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./OnboardingWizard";

function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalIn = cm / 2.54;
  return { ft: Math.floor(totalIn / 12), in: Math.round(totalIn % 12) };
}

function ftInToCm(ft: number, inVal: number): number {
  return Math.round((ft * 12 + inVal) * 2.54);
}

export function StepHeight({ value, onChange, onNext }: StepProps) {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const cm = value.heightCm ?? 170;
  const { ft, in: inVal } = cmToFtIn(cm);
  const [cmStr, setCmStr] = useState(String(cm));
  const [ftStr, setFtStr] = useState(String(ft));
  const [inStr, setInStr] = useState(String(inVal));

  const getHeightCm = () => {
    if (unit === "metric") return parseInt(cmStr, 10) || 170;
    return ftInToCm(parseInt(ftStr, 10) || 5, parseInt(inStr, 10) || 8);
  };

  const valid =
    unit === "metric"
      ? (parseInt(cmStr, 10) ?? 0) >= 100 && (parseInt(cmStr, 10) ?? 0) <= 250
      : true;

  const handleNext = () => {
    const updates = { heightCm: getHeightCm() };
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
          cm
        </button>
        <button
          className={`flex-1 h-10 rounded-lg font-medium ${
            unit === "imperial"
              ? "bg-emerald-500 text-zinc-900"
              : "bg-zinc-800 text-zinc-400"
          }`}
          onClick={() => setUnit("imperial")}
        >
          ft/in
        </button>
      </div>

      {unit === "metric" ? (
        <Input
          label="Height (cm)"
          type="number"
          min={100}
          max={250}
          placeholder="170"
          value={cmStr}
          onChange={(e) => setCmStr(e.target.value)}
        />
      ) : (
        <div className="flex gap-4">
          <Input
            label="Feet"
            type="number"
            min={3}
            max={8}
            placeholder="5"
            value={ftStr}
            onChange={(e) => setFtStr(e.target.value)}
          />
          <Input
            label="Inches"
            type="number"
            min={0}
            max={11}
            placeholder="8"
            value={inStr}
            onChange={(e) => setInStr(e.target.value)}
          />
        </div>
      )}

      <Button fullWidth size="lg" onClick={handleNext} disabled={!valid}>
        Continue
      </Button>
    </div>
  );
}
