"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSummitStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  getExpensesForMonth,
  addExpense,
  getMonthlyBudget,
} from "@/lib/budget-monthly-service";
import type { ExpenseLog, ExpenseCategory } from "@/lib/types";
import { BottomNav } from "@/components/layout/BottomNav";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "rent", label: "Rent" },
  { value: "groceries", label: "Groceries" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "utilities", label: "Utilities" },
  { value: "other", label: "Other" },
];

export default function BudgetExpensesPage() {
  const userProfile = useSummitStore((s) => s.userProfile);
  const [expenses, setExpenses] = useState<ExpenseLog[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<{ [k: string]: number } | null>(null);
  const [category, setCategory] = useState<ExpenseCategory>("groceries");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const load = async () => {
    if (!userProfile) return;
    const [exps, mb] = await Promise.all([
      getExpensesForMonth(userProfile.id, year, month),
      getMonthlyBudget(userProfile.id, year, month),
    ]);
    setExpenses(exps);
    if (mb) {
      setMonthlyBudget({
        rent: mb.rent,
        groceries: mb.groceries,
        lifestyle: mb.lifestyle,
        utilities: mb.utilities,
        other: mb.other,
      });
    } else {
      setMonthlyBudget(null);
    }
  };

  useEffect(() => {
    load();
  }, [userProfile?.id, year, month]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !amount || parseFloat(amount) <= 0) return;
    setSaving(true);
    try {
      await addExpense(userProfile.id, category, parseFloat(amount), date, note || undefined);
      setAmount("");
      setNote("");
      await load();
    } finally {
      setSaving(false);
    }
  };

  const totals = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  if (!userProfile) {
    return (
      <div className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 flex flex-col items-center justify-center min-h-[50vh] content-pad">
        <p className="text-zinc-500 text-center mb-4">
          Complete onboarding to log expenses and track your budget.
        </p>
        <Link href="/budget">
          <Button variant="outline">Back to budget</Button>
        </Link>
        <BottomNav />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 content-pad"
      >
        <div className="mb-6">
          <Link
            href="/budget/results"
            className="text-sm text-zinc-500 hover:text-emerald-500"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100 mt-2">Log expenses</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Track spending by category to stay within your monthly budget.
          </p>
        </div>

        {!monthlyBudget && (
          <Card className="mb-6 bg-amber-500/10 border-amber-500/30">
            <p className="text-sm text-amber-200">
              Set your monthly budget on the results page first. Then log expenses here to see how you&apos;re doing.
            </p>
            <Link href="/budget/results" className="mt-3 inline-block">
              <Button size="sm">Set monthly budget</Button>
            </Link>
          </Card>
        )}

        <Card className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Add expense</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Category</label>
              <Select
                options={CATEGORIES}
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Amount</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Date</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Note (optional)</label>
              <Input
                placeholder="e.g. Whole Foods"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button type="submit" fullWidth disabled={saving || !amount}>
              {saving ? "Adding…" : "Add expense"}
            </Button>
          </form>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">
            This month&apos;s spending
          </h3>
          {expenses.length === 0 ? (
            <p className="text-zinc-500 text-sm">No expenses logged yet.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(totals)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, total]) => (
                  <div
                    key={cat}
                    className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0"
                  >
                    <span className="text-zinc-300 capitalize">{cat}</span>
                    <span className="font-medium text-zinc-100">
                      {formatCurrency(total)}
                      {monthlyBudget?.[cat] != null && (
                        <span className="text-zinc-500 text-sm font-normal ml-2">
                          / {formatCurrency(monthlyBudget[cat])}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              <div className="pt-3 mt-3 border-t border-zinc-700">
                <div className="flex justify-between font-semibold text-zinc-100">
                  <span>Total</span>
                  <span>{formatCurrency(Object.values(totals).reduce((a, b) => a + b, 0))}</span>
                </div>
              </div>
            </div>
          )}
          {expenses.length > 0 && (
            <div className="mt-4 pt-3 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-2">Recent entries</p>
              <ul className="space-y-1 text-sm">
                {expenses
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((e) => (
                    <li key={e.id} className="flex justify-between text-zinc-400">
                      <span className="capitalize">{e.category}</span>
                      <span>{formatCurrency(e.amount)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </Card>
      </motion.div>
      <BottomNav />
    </>
  );
}
