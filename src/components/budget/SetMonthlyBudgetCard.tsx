"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSummitStore } from "@/lib/store";
import { useBudgetStore } from "@/lib/store/use-budget-store";
import { getMonthlyBudget, setMonthlyBudget } from "@/lib/budget-monthly-service";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { MonthlyBudget } from "@/lib/types";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function SetMonthlyBudgetCard() {
  const userProfile = useSummitStore((s) => s.userProfile);
  const recommendations = useBudgetStore((s) => s.recommendations);
  const userRent = useBudgetStore((s) => s.userRent);
  const userGroceries = useBudgetStore((s) => s.userGroceries);
  const userLifestyle = useBudgetStore((s) => s.userLifestyle);
  const userUtilities = useBudgetStore((s) => s.userUtilities);

  const [saved, setSaved] = useState<MonthlyBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  useEffect(() => {
    if (!userProfile) {
      setLoading(false);
      return;
    }
    getMonthlyBudget(userProfile.id, year, month)
      .then((mb) => setSaved(mb ?? null))
      .finally(() => setLoading(false));
  }, [userProfile?.id, year, month]);

  const handleSetBudget = async () => {
    if (!userProfile || !recommendations) return;
    setSaving(true);
    try {
      const rent = userRent ?? recommendations.rent.recommended;
      const groceries = userGroceries ?? recommendations.groceries.recommended;
      const lifestyle = userLifestyle ?? recommendations.lifestyle.recommended;
      const utilities = userUtilities ?? recommendations.utilities.defaultEstimate;
      const mb = await setMonthlyBudget(userProfile.id, year, month, {
        rent,
        groceries,
        lifestyle,
        utilities,
        other: 0,
      });
      setSaved(mb);
    } finally {
      setSaving(false);
    }
  };

  if (!recommendations) return null;

  const rent = userRent ?? recommendations.rent.recommended;
  const groceries = userGroceries ?? recommendations.groceries.recommended;
  const lifestyle = userLifestyle ?? recommendations.lifestyle.recommended;
  const utilities = userUtilities ?? recommendations.utilities.defaultEstimate;

  if (!userProfile) {
    return (
      <Card className="mb-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-2">Monthly budget (earn XP)</h3>
        <p className="text-zinc-500 text-sm mb-3">
          Complete onboarding to set your monthly budget and earn XP.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="mb-6">
        <p className="text-sm text-zinc-500">Loading…</p>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <h3 className="text-sm font-medium text-zinc-400 mb-2">
        Monthly budget — {MONTH_NAMES[month - 1]} {year}
      </h3>
      {saved ? (
        <>
          <p className="text-emerald-500 text-sm mb-3">✓ Budget set for this month.</p>
          <Link href="/budget/expenses" className="inline-block mb-3">
            <Button variant="outline" size="sm">Log expenses (optional)</Button>
          </Link>
          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-400">
            <span>Rent: {formatCurrency(saved.rent)}</span>
            <span>Groceries: {formatCurrency(saved.groceries)}</span>
            <span>Lifestyle: {formatCurrency(saved.lifestyle)}</span>
            <span>Utilities: {formatCurrency(saved.utilities)}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={handleSetBudget}
            disabled={saving}
          >
            Update budget
          </Button>
        </>
      ) : (
        <>
          <p className="text-zinc-500 text-sm mb-3">
            Lock in your targets for the month. Earn +50 XP when you set your budget.
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-400 mb-4">
            <span>Rent: {formatCurrency(rent)}</span>
            <span>Groceries: {formatCurrency(groceries)}</span>
            <span>Lifestyle: {formatCurrency(lifestyle)}</span>
            <span>Utilities: {formatCurrency(utilities)}</span>
          </div>
          <Button onClick={handleSetBudget} disabled={saving}>
            Set monthly budget
          </Button>
        </>
      )}
    </Card>
  );
}
