"use client";

import { useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { useBudgetStore } from "@/lib/store/use-budget-store";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function WhatIfPanel() {
  const wizard = useBudgetStore((s) => s.wizard);
  const recommendations = useBudgetStore((s) => s.recommendations);
  const userRent = useBudgetStore((s) => s.userRent);
  const userLifestyle = useBudgetStore((s) => s.userLifestyle);
  const userGroceries = useBudgetStore((s) => s.userGroceries);
  const userUtilities = useBudgetStore((s) => s.userUtilities);
  const setBenefits = useBudgetStore((s) => s.setBenefits);
  const setUserRent = useBudgetStore((s) => s.setUserRent);
  const setUserLifestyle = useBudgetStore((s) => s.setUserLifestyle);
  const setUserGroceries = useBudgetStore((s) => s.setUserGroceries);
  const setUserUtilities = useBudgetStore((s) => s.setUserUtilities);
  const refreshComputations = useBudgetStore((s) => s.refreshComputations);

  const rentRec = recommendations?.rent ?? { min: 0, max: 3000, recommended: 1500 };
  const groceriesRec = recommendations?.groceries ?? { min: 0, max: 800, recommended: 400 };
  const lifestyleRec = recommendations?.lifestyle ?? { min: 0, max: 500, recommended: 200 };

  const rentVal = userRent ?? rentRec.recommended;
  const groceriesVal = userGroceries ?? groceriesRec.recommended;
  const lifestyleVal = userLifestyle ?? lifestyleRec.recommended;

  const handle401kChange = useCallback(
    (v: number) => {
      setBenefits({ retirement401kPercent: v, retirement401kDollars: undefined });
      refreshComputations();
    },
    [setBenefits, refreshComputations]
  );

  const handleRentChange = useCallback(
    (v: number) => {
      setUserRent(v);
      refreshComputations();
    },
    [setUserRent, refreshComputations]
  );

  const handleGroceriesChange = useCallback(
    (v: number) => {
      setUserGroceries(v);
      refreshComputations();
    },
    [setUserGroceries, refreshComputations]
  );

  const handleLifestyleChange = useCallback(
    (v: number) => {
      setUserLifestyle(v);
      refreshComputations();
    },
    [setUserLifestyle, refreshComputations]
  );

  return (
    <Card>
      <h3 className="text-lg font-semibold text-zinc-100 mb-1">What-if controls</h3>
      <p className="text-sm text-zinc-500 mb-4">
        Adjust values to see instant updates
      </p>
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            401(k) %
          </label>
          <Input
            type="number"
            min={0}
            max={100}
            value={wizard.benefits.retirement401kPercent ?? ""}
            onChange={(e) => handle401kChange(Number(e.target.value) || 0)}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Rent — rec: {formatCurrency(rentRec.recommended)}
          </label>
          <Slider
            min={Math.round(rentRec.min)}
            max={Math.round(rentRec.max + 500)}
            value={rentVal}
            onValueChange={handleRentChange}
          />
          <p className="mt-1 text-xs text-zinc-500">{formatCurrency(rentVal)}</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Groceries — rec: {formatCurrency(groceriesRec.recommended)}
          </label>
          <Slider
            min={Math.round(groceriesRec.min)}
            max={Math.round(groceriesRec.max + 200)}
            value={groceriesVal}
            onValueChange={handleGroceriesChange}
          />
          <p className="mt-1 text-xs text-zinc-500">{formatCurrency(groceriesVal)}</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Lifestyle — rec: {formatCurrency(lifestyleRec.recommended)}
          </label>
          <Slider
            min={Math.round(lifestyleRec.min)}
            max={Math.round(lifestyleRec.max + 200)}
            value={lifestyleVal}
            onValueChange={handleLifestyleChange}
          />
          <p className="mt-1 text-xs text-zinc-500">{formatCurrency(lifestyleVal)}</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-400">
            Utilities ($/mo)
          </label>
          <Input
            type="number"
            min={0}
            step={50}
            placeholder="250"
            value={userUtilities ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setUserUtilities(v === "" ? null : Number(v));
              refreshComputations();
            }}
          />
        </div>
      </div>
    </Card>
  );
}
