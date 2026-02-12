"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BottomNav } from "@/components/layout/BottomNav";

export default function BudgetPage() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 pt-[max(env(safe-area-inset-top),24px)] pb-32 content-pad"
      >
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Budget</h1>
        <p className="text-zinc-500 text-sm mb-6">
          Plan your take-home pay and get budget recommendations.
        </p>

        <Card className="mb-6">
          <p className="text-zinc-300 text-sm mb-4">
            Enter your salary, location, and benefits. Set your monthly budget to earn XP.
          </p>
          <Link href="/budget/wizard">
            <Button fullWidth size="lg">
              Start budget wizard
            </Button>
          </Link>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Results</h3>
          <p className="text-zinc-500 text-sm mb-4">
            After the wizard you&apos;ll see take-home pay and can set your monthly budget to earn XP.
          </p>
          <Link href="/budget/results">
            <Button variant="outline" fullWidth>
              View results
            </Button>
          </Link>
        </Card>
      </motion.div>
      <BottomNav />
    </>
  );
}
