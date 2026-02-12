"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { StepProps } from "./OnboardingWizard";

export function StepNotifications({ value, onChange, onNext }: StepProps) {
  const [enabled, setEnabled] = useState(value.notificationReminders ?? false);

  const handleNext = () => {
    const updates = { notificationReminders: enabled };
    onChange(updates);
    onNext(updates);
  };

  return (
    <div className="space-y-6">
      <p className="text-zinc-400 text-sm">
        In-app reminders only. No push notifications unless your browser supports them.
      </p>
      <div className="flex gap-4">
        <button
          className={`flex-1 h-14 rounded-xl border font-medium ${
            enabled
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
              : "bg-zinc-800/50 border-zinc-700"
          }`}
          onClick={() => setEnabled(true)}
        >
          Yes, remind me
        </button>
        <button
          className={`flex-1 h-14 rounded-xl border font-medium ${
            !enabled
              ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
              : "bg-zinc-800/50 border-zinc-700"
          }`}
          onClick={() => setEnabled(false)}
        >
          No thanks
        </button>
      </div>
      <Button fullWidth size="lg" onClick={handleNext}>
        Create my plan →
      </Button>
    </div>
  );
}
