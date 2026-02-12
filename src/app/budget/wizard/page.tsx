"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BudgetWizard } from "@/components/budget/BudgetWizard";
import { Button } from "@/components/ui/Button";
import { BottomNav } from "@/components/layout/BottomNav";

export default function BudgetWizardPage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 content-pad"
      >
        <div className="mb-6">
          <Link
            href="/budget"
            className="text-sm text-zinc-500 hover:text-emerald-500"
          >
            ← Budget
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100 mt-2">
            Budget wizard
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Enter your info to estimate take-home pay and budget.
          </p>
        </div>
        <BudgetWizard />
      </motion.div>
      <BottomNav />
    </>
  );
}
