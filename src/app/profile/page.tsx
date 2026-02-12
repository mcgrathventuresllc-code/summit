"use client";

import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { useSummitStore } from "@/lib/store";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BottomNav } from "@/components/layout/BottomNav";

export default function ProfilePage() {
  const theme = useSummitStore((s) => s.theme);
  const signOut = useSummitStore((s) => s.signOut);
  const setTheme = useSummitStore((s) => s.setTheme);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const [profiles, plans, logs, prs, runs, checkIns, reading] = await Promise.all([
        db.userProfiles.toArray(),
        db.workoutPlans.toArray(),
        db.sessionLogs.toArray(),
        db.prRecords.toArray(),
        db.runningPRs.toArray(),
        db.eveningCheckIns.toArray(),
        db.readingLogs.toArray(),
      ]);
      const data = { profiles, plans, logs, prs, runs, checkIns, reading, exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `summit-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setImporting(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.profiles?.length) await db.userProfiles.bulkPut(data.profiles);
        if (data.plans?.length) await db.workoutPlans.bulkPut(data.plans);
        if (data.logs?.length) await db.sessionLogs.bulkPut(data.logs);
        if (data.prs?.length) await db.prRecords.bulkPut(data.prs);
        if (data.runs?.length) await db.runningPRs.bulkPut(data.runs);
        if (data.checkIns?.length) await db.eveningCheckIns.bulkPut(data.checkIns);
        if (data.reading?.length) await db.readingLogs.bulkPut(data.reading);
        window.location.reload();
      } catch (err) {
        alert("Invalid backup file");
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };

  const handleReset = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    await db.delete();
    window.location.reload();
  };

  return (
    <>
      <main className="min-h-dvh px-4 content-pad pt-[max(env(safe-area-inset-top),24px)]">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-zinc-100 mb-6"
        >
          Profile
        </motion.h1>

        {isSupabaseConfigured && (
          <Card className="mb-4">
            <h3 className="text-sm font-medium text-zinc-400 mb-2">Account</h3>
            <Button variant="outline" fullWidth onClick={() => signOut()}>
              Sign out
            </Button>
          </Card>
        )}

        <Card className="mb-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Theme</h3>
          <div className="flex gap-2">
            <button
              className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
                theme === "dark" ? "bg-emerald-500 text-zinc-900" : "bg-zinc-800 text-zinc-400"
              }`}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
            <button
              className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
                theme === "light" ? "bg-emerald-500 text-zinc-900" : "bg-zinc-800 text-zinc-400"
              }`}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
          </div>
        </Card>

        <Card className="mb-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Data</h3>
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              size="sm"
              onClick={handleExport}
              disabled={exporting}
            >
              Export backup
            </Button>
            <Button
              variant="outline"
              fullWidth
              size="sm"
              onClick={handleImport}
              disabled={importing}
            >
              Import backup
            </Button>
          </div>
        </Card>

        <Card className="mb-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Reset</h3>
          <p className="text-zinc-500 text-sm mb-3">
            Delete all data and start over. This cannot be undone.
          </p>
          <Button
            variant="outline"
            className={resetConfirm ? "border-red-500 text-red-500" : ""}
            fullWidth
            onClick={handleReset}
          >
            {resetConfirm ? "Confirm reset?" : "Reset and start over"}
          </Button>
          {resetConfirm && (
            <button
              className="mt-2 text-sm text-zinc-500"
              onClick={() => setResetConfirm(false)}
            >
              Cancel
            </button>
          )}
        </Card>

        <p className="text-zinc-600 text-xs mt-8">Summit • Gamified Healthy Living</p>
      </main>
      <BottomNav />
    </>
  );
}
