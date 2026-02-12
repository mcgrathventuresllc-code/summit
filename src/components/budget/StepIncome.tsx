"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useBudgetStore } from "@/lib/store/use-budget-store";

const PAY_FREQUENCIES = [
  { value: "biweekly", label: "Biweekly (26 pays/year)" },
  { value: "semimonthly", label: "Semi-monthly (24 pays/year)" },
  { value: "monthly", label: "Monthly (12 pays/year)" },
];

export function StepIncome() {
  const { wizard, setIncome } = useBudgetStore();
  const { income } = wizard;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Annual gross salary</label>
        <Input
          type="number"
          min={0}
          step={1000}
          placeholder="75000"
          value={income.annualGross || ""}
          onChange={(e) => setIncome({ annualGross: Number(e.target.value) || 0 })}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Pay frequency</label>
        <Select
          options={PAY_FREQUENCIES}
          value={income.payFrequency}
          onChange={(e) =>
            setIncome({
              payFrequency: e.target.value as "biweekly" | "semimonthly" | "monthly",
            })
          }
        />
      </div>
      <div className="rounded-xl border border-zinc-700 p-4">
        <h4 className="mb-3 text-sm font-medium text-zinc-300">Bonus (optional)</h4>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Annual bonus amount</label>
            <Input
              type="number"
              min={0}
              step={500}
              placeholder="0"
              value={income.annualBonus || ""}
              onChange={(e) => setIncome({ annualBonus: Number(e.target.value) || 0 })}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={income.bonusIncludedInBudget}
              onChange={(e) => setIncome({ bonusIncludedInBudget: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-zinc-400">
              Include bonus in take-home (spread across pays)
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
