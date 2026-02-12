/**
 * PR detection and recording
 */

import { db } from "./db";
import { calcE1RM } from "./pr-utils";
import type { SessionLog } from "./types";

const LIFT_NAMES: Record<string, string> = {
  "Bench Press": "bench_press",
  "Barbell Back Squat": "squat",
  "Conventional Deadlift": "deadlift",
  "Overhead Press": "overhead_press",
  "Romanian Deadlift": "romanian_deadlift",
  "Goblet Squat": "goblet_squat",
  "Incline Dumbbell Press": "incline_press",
  "Pull-up": "pull_up",
  "Lat Pulldown": "lat_pulldown",
  "Barbell Row": "barbell_row",
  "Dumbbell Row": "dumbbell_row",
};

export async function recordPRsFromSession(
  sessionLog: SessionLog,
  exerciseIdToName: Record<string, string>
): Promise<void> {
  const userId = (await db.userProfiles.orderBy("createdAt").last())?.id;
  if (!userId) return;

  for (const set of sessionLog.setLogs.filter((s) => s.completed && s.reps > 0 && s.weightKg > 0)) {
    const name = exerciseIdToName[set.exerciseId] ?? set.exerciseId;
    const liftName = LIFT_NAMES[name] ?? name.replace(/\s+/g, "_").toLowerCase();
    const e1rm = calcE1RM(set.weightKg, set.reps);

    const existing = await db.prRecords
      .where({ userId, liftName })
      .toArray();
    const best = Math.max(...existing.map((r) => r.e1rmKg), 0);

    if (e1rm > best) {
      await db.prRecords.add({
        id: crypto.randomUUID?.() ?? `pr-${Date.now()}`,
        userId,
        liftName,
        weightKg: set.weightKg,
        reps: set.reps,
        e1rmKg: e1rm,
        date: sessionLog.date,
        sessionLogId: sessionLog.id,
      });
    }
  }
}
