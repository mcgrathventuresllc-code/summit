"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { useBudgetStore } from "@/lib/store/use-budget-store";
import { US_STATES } from "@/lib/constants/state-tax";

export function StepLocation() {
  const wizard = useBudgetStore((s) => s.wizard);
  const setLocation = useBudgetStore((s) => s.setLocation);
  const location = wizard.location;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">State</label>
        <Select
          options={US_STATES.map((s) => ({ value: s, label: s }))}
          value={location.state}
          onChange={(e) => setLocation({ state: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">City (optional)</label>
        <Input
          placeholder="e.g. Phoenix"
          value={location.city ?? ""}
          onChange={(e) => setLocation({ city: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Local tax % (optional)
        </label>
        <Input
          type="number"
          min={0}
          max={20}
          step={0.1}
          placeholder="0"
          value={location.localTaxPercent}
          onChange={(e) => setLocation({ localTaxPercent: Number(e.target.value) || 0 })}
        />
      </div>
      <Card className="mt-4 border-zinc-700 bg-zinc-800/30 p-4">
        <p className="text-sm text-zinc-500">
          <strong>Tax model:</strong> Estimates based on 2024 brackets. Not filing-accurate. For planning only.
        </p>
      </Card>
    </div>
  );
}
