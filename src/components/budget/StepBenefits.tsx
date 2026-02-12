"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useBudgetStore } from "@/lib/store/use-budget-store";

const FILING_STATUS = [
  { value: "single", label: "Single" },
  { value: "married_jointly", label: "Married filing jointly" },
];

export function StepBenefits() {
  const { wizard, setBenefits } = useBudgetStore();
  const { benefits } = wizard;
  const use401kPercent =
    benefits.retirement401kPercent != null && benefits.retirement401kPercent > 0;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">Filing status</label>
        <Select
          options={FILING_STATUS}
          value={benefits.filingStatus}
          onChange={(e) =>
            setBenefits({ filingStatus: e.target.value as "single" | "married_jointly" })
          }
        />
      </div>
      <div className="rounded-xl border border-zinc-700 p-4">
        <h4 className="mb-3 text-sm font-medium text-zinc-300">401(k)</h4>
        <div className="space-y-3">
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="401k-type"
                checked={use401kPercent}
                onChange={() =>
                  setBenefits({ retirement401kPercent: 10, retirement401kDollars: undefined })
                }
                className="border-zinc-600 bg-zinc-800 text-emerald-500"
              />
              <span className="text-sm text-zinc-400">% per paycheck</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="401k-type"
                checked={!use401kPercent}
                onChange={() =>
                  setBenefits({ retirement401kPercent: 0, retirement401kDollars: 0 })
                }
                className="border-zinc-600 bg-zinc-800 text-emerald-500"
              />
              <span className="text-sm text-zinc-400">$ per paycheck</span>
            </label>
          </div>
          {use401kPercent ? (
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              placeholder="10"
              value={benefits.retirement401kPercent ?? ""}
              onChange={(e) =>
                setBenefits({ retirement401kPercent: Number(e.target.value) || 0 })
              }
            />
          ) : (
            <Input
              type="number"
              min={0}
              step={50}
              placeholder="0"
              value={benefits.retirement401kDollars ?? ""}
              onChange={(e) =>
                setBenefits({ retirement401kDollars: Number(e.target.value) || 0 })
              }
            />
          )}
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Employer match % (optional)</label>
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={benefits.employerMatchPercent ?? ""}
              onChange={(e) =>
                setBenefits({ employerMatchPercent: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-700 p-4">
        <h4 className="mb-3 text-sm font-medium text-zinc-300">HSA (optional)</h4>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-zinc-500">% per paycheck</label>
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="0"
              value={benefits.hsaPercent ?? ""}
              onChange={(e) => setBenefits({ hsaPercent: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-zinc-500">$ per paycheck</label>
            <Input
              type="number"
              min={0}
              step={25}
              placeholder="0"
              value={benefits.hsaDollars ?? ""}
              onChange={(e) => setBenefits({ hsaDollars: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Healthcare premium per paycheck
        </label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            min={0}
            step={10}
            placeholder="0"
            value={benefits.healthcarePremium || ""}
            onChange={(e) =>
              setBenefits({ healthcarePremium: Number(e.target.value) || 0 })
            }
            className="flex-1"
          />
          <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={benefits.healthcarePreTax}
              onChange={(e) => setBenefits({ healthcarePreTax: e.target.checked })}
              className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500"
            />
            Pre-tax
          </label>
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Dental/vision per paycheck
        </label>
        <Input
          type="number"
          min={0}
          step={5}
          placeholder="0"
          value={benefits.dentalVision || ""}
          onChange={(e) => setBenefits({ dentalVision: Number(e.target.value) || 0 })}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Other pre-tax / post-tax per paycheck
        </label>
        <div className="flex gap-3">
          <Input
            type="number"
            min={0}
            placeholder="Pre-tax"
            value={benefits.otherPreTax || ""}
            onChange={(e) => setBenefits({ otherPreTax: Number(e.target.value) || 0 })}
          />
          <Input
            type="number"
            min={0}
            placeholder="Post-tax"
            value={benefits.otherPostTax || ""}
            onChange={(e) => setBenefits({ otherPostTax: Number(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );
}
