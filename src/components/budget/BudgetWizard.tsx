"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useBudgetStore } from "@/lib/store/use-budget-store";
import { StepLocation } from "./StepLocation";
import { StepIncome } from "./StepIncome";
import { StepBenefits } from "./StepBenefits";
import { StepDebts } from "./StepDebts";

const STEPS = [
  { id: 1, label: "Location", slug: "location" },
  { id: 2, label: "Income", slug: "income" },
  { id: 3, label: "Benefits", slug: "benefits" },
  { id: 4, label: "Debts", slug: "debts" },
] as const;

export function BudgetWizard() {
  const router = useRouter();
  const refreshComputations = useBudgetStore((s) => s.refreshComputations);
  const loadDemo = useBudgetStore((s) => s.loadDemo);
  const [step, setStep] = useState(1);

  const handleSeeResults = () => {
    refreshComputations();
    router.push("/budget/results");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {STEPS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                step === s.id
                  ? "bg-emerald-500 text-zinc-900"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={loadDemo}>
          Demo
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Card>
          <h2 className="text-lg font-semibold text-zinc-100 mb-1">
            {STEPS.find((s) => s.id === step)?.label}
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            {step === 1 && "Where you live affects your state and local taxes."}
            {step === 2 && "Enter your gross salary and pay frequency."}
            {step === 3 && "Pre-tax and post-tax deductions reduce your take-home."}
            {step === 4 && "Debts impact your budget and payoff strategy."}
          </p>

          <AnimatePresence mode="wait">
            {step === 1 && <StepLocation key="location" />}
            {step === 2 && <StepIncome key="income" />}
            {step === 3 && <StepBenefits key="benefits" />}
            {step === 4 && <StepDebts key="debts" />}
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={handleSeeResults}>See Results</Button>
            )}
          </div>
        </Card>
      </motion.div>

      <p className="text-center">
        <Link href="/budget" className="text-sm text-zinc-500 hover:text-zinc-400">
          ← Back to Budget
        </Link>
      </p>
    </div>
  );
}
