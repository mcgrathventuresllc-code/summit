"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useBudgetStore } from "@/lib/store/use-budget-store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BudgetAllocation } from "@/components/budget/BudgetAllocation";
import { WhatIfPanel } from "@/components/budget/WhatIfPanel";
import { SetMonthlyBudgetCard } from "@/components/budget/SetMonthlyBudgetCard";
import { BottomNav } from "@/components/layout/BottomNav";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export default function BudgetResultsPage() {
  const router = useRouter();
  const breakdown = useBudgetStore((s) => s.breakdown);
  const recommendations = useBudgetStore((s) => s.recommendations);
  const refreshComputations = useBudgetStore((s) => s.refreshComputations);
  const budgetMode = useBudgetStore((s) => s.budgetMode);
  const setBudgetMode = useBudgetStore((s) => s.setBudgetMode);
  const saveScenario = useBudgetStore((s) => s.saveScenario);
  const scenarios = useBudgetStore((s) => s.scenarios);
  const [scenarioName, setScenarioName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    refreshComputations();
  }, [refreshComputations]);

  if (!breakdown || !recommendations) {
    return (
      <div className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 flex flex-col items-center justify-center min-h-[50vh] content-pad">
        <p className="text-zinc-500 text-center mb-4">
          Complete the wizard first to see your results.
        </p>
        <Button onClick={() => router.push("/budget/wizard")}>
          Open wizard
        </Button>
        <BottomNav />
      </div>
    );
  }

  const handleSaveScenario = () => {
    const name = scenarioName.trim() || "My budget";
    saveScenario(name);
    setScenarioName("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 content-pad"
      >
        <div className="mb-6">
          <Link
            href="/budget/wizard"
            className="text-sm text-zinc-500 hover:text-emerald-500"
          >
            ← Edit
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100 mt-2">
            Your budget
          </h1>
        </div>

        {/* Budget mode */}
        <Card className="mb-6">
          <p className="text-sm font-medium text-zinc-400 mb-3">Budget mode</p>
          <div className="flex gap-2">
            {(
              [
                { value: "conservative", label: "Conservative" },
                { value: "balanced", label: "Balanced" },
                { value: "lifestyle", label: "Lifestyle" },
              ] as const
            ).map((m) => (
              <button
                key={m.value}
                onClick={() => {
                  setBudgetMode(m.value);
                  refreshComputations();
                }}
                className={`flex-1 h-10 rounded-lg text-sm font-medium transition-colors ${
                  budgetMode === m.value
                    ? "bg-emerald-500 text-zinc-900"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Net summary */}
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Take-home</h3>
          <p className="text-3xl font-bold text-emerald-500">
            {formatCurrency(breakdown.netPerPaycheck)}
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            per paycheck • {formatCurrency(breakdown.netMonthly)}/month
          </p>
        </Card>

        {/* What-if sliders */}
        <div className="mb-6">
          <WhatIfPanel />
        </div>

        {/* Set monthly budget (XP when you stick to it) */}
        <SetMonthlyBudgetCard />

        {/* Donut chart */}
        <div className="mb-6">
          <BudgetAllocation />
        </div>

        {/* Paycheck breakdown */}
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">
            Paycheck breakdown
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Gross</span>
              <span>{formatCurrency(breakdown.grossPerPaycheck)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>− Pre-tax</span>
              <span>{formatCurrency(breakdown.preTaxTotal)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>− Federal tax</span>
              <span>{formatCurrency(breakdown.federalTax)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>− State tax</span>
              <span>{formatCurrency(breakdown.stateTax)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>− FICA</span>
              <span>{formatCurrency(breakdown.fica.total)}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>− Post-tax</span>
              <span>{formatCurrency(breakdown.postTaxTotal)}</span>
            </div>
            <div className="my-3 border-t border-zinc-700 pt-3">
              <div className="flex justify-between font-semibold text-zinc-100">
                <span>Net</span>
                <span>{formatCurrency(breakdown.netPerPaycheck)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">
            Budget recommendations (monthly)
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Rent</span>
              <span>{formatCurrency(recommendations.rent.recommended)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Groceries</span>
              <span>{formatCurrency(recommendations.groceries.recommended)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Lifestyle</span>
              <span>{formatCurrency(recommendations.lifestyle.recommended)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Emergency savings target</span>
              <span>{formatCurrency(recommendations.savings.emergencyTarget)}</span>
            </div>
          </div>
        </Card>

        {/* Save scenario */}
        <Card className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">
            Save this scenario
          </h3>
          <p className="text-xs text-zinc-500 mb-3">
            Budget XP comes from setting your monthly budget (above). No dollar-by-dollar tracking.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Scenario name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleSaveScenario}
              disabled={saved}
            >
              {saved ? "Saved!" : "Save"}
            </Button>
          </div>
          {scenarios.length > 0 && (
            <p className="text-xs text-zinc-500 mt-2">
              {scenarios.length} saved scenario{scenarios.length !== 1 ? "s" : ""}
            </p>
          )}
        </Card>
      </motion.div>
      <BottomNav />
    </>
  );
}
