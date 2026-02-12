"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useBudgetStore } from "@/lib/store/use-budget-store";
import type { DebtItem } from "@/lib/schemas/budget";

const DEBT_TYPES = [
  { value: "credit_card", label: "Credit card" },
  { value: "student_loan", label: "Student loan" },
  { value: "other", label: "Other" },
];

export function StepDebts() {
  const { wizard, addDebt, removeDebt, updateDebt } = useBudgetStore();
  const { items } = wizard.debts;

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Add debts to see payoff impact on budget. Optional.
      </p>
      {items.map((d) => (
        <div
          key={d.id}
          className="flex flex-wrap gap-2 rounded-xl border border-zinc-700 p-4"
        >
          <Select
            options={DEBT_TYPES}
            value={d.type}
            onChange={(e) =>
              updateDebt(d.id, { type: e.target.value as DebtItem["type"] })
            }
            className="w-32"
          />
          <Input
            type="number"
            min={0}
            placeholder="Balance"
            value={d.balance || ""}
            onChange={(e) => updateDebt(d.id, { balance: Number(e.target.value) || 0 })}
            className="w-28"
          />
          <Input
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="APR %"
            value={d.apr || ""}
            onChange={(e) => updateDebt(d.id, { apr: Number(e.target.value) || 0 })}
            className="w-20"
          />
          <Input
            type="number"
            min={0}
            placeholder="Min $/mo"
            value={d.minimumPayment || ""}
            onChange={(e) =>
              updateDebt(d.id, { minimumPayment: Number(e.target.value) || 0 })
            }
            className="w-24"
          />
          <Button variant="ghost" size="sm" onClick={() => removeDebt(d.id)}>
            Remove
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() =>
          addDebt({
            type: "credit_card",
            balance: 0,
            apr: 0,
            minimumPayment: 0,
          })
        }
      >
        + Add debt
      </Button>
    </div>
  );
}
