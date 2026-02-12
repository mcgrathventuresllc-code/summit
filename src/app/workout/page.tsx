"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useSummitStore } from "@/lib/store";
import { db } from "@/lib/db";
import { recordPRsFromSession } from "@/lib/pr-service";
import { XP_PER_WORKOUT } from "@/lib/gamification";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Phase = "idle" | "work" | "rest" | "complete";

export default function WorkoutPage() {
  const router = useRouter();
  const userProfile = useSummitStore((s) => s.userProfile);
  const currentPlan = useSummitStore((s) => s.currentPlan);
  const [phase, setPhase] = useState<Phase>("idle");
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [sessionLog, setSessionLog] = useState<{
    id: string;
    workoutDayId: string;
    date: string;
    startedAt: number;
    setLogs: Array<{
      id: string;
      exerciseId: string;
      setNumber: number;
      reps: number;
      weightKg: number;
      completed: boolean;
    }>;
  } | null>(null);
  const [weightInput, setWeightInput] = useState("");
  const [repsInput, setRepsInput] = useState("");
  const [gymMode, setGymMode] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const dayOfWeek = new Date().getDay();
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const workoutDay = currentPlan?.days[adjustedDay];
  const exercise = workoutDay?.exercises?.[exerciseIndex];
  const totalSets = exercise?.sets ?? 0;

  const startSession = useCallback(async () => {
    if (!workoutDay || !userProfile) return;
    const id = crypto.randomUUID?.() ?? `sess-${Date.now()}`;
    const log = {
      id,
      workoutDayId: workoutDay.id,
      date: today,
      startedAt: Date.now(),
      setLogs: [],
    };
    await db.sessionLogs.add({
      ...log,
      setLogs: [],
    });
    setSessionLog(log);
    setPhase("work");
    setExerciseIndex(0);
    setSetIndex(0);
  }, [workoutDay, userProfile, today]);

  const logSet = useCallback(async () => {
    if (!exercise || !sessionLog) return;
    const reps = parseInt(repsInput, 10) || 0;
    const weight = parseFloat(weightInput) || 0;

    const setLog = {
      id: crypto.randomUUID?.() ?? `set-${Date.now()}`,
      exerciseId: exercise.id,
      setNumber: setIndex + 1,
      reps,
      weightKg: weight,
      completed: true,
    };

    const updated = {
      ...sessionLog,
      setLogs: [...sessionLog.setLogs, setLog],
    };
    await db.sessionLogs.update(sessionLog.id, {
      setLogs: updated.setLogs,
    });
    setSessionLog(updated);
    setWeightInput("");
    setRepsInput("");

    if (setIndex + 1 >= totalSets) {
      if ((workoutDay?.exercises?.length ?? 0) <= exerciseIndex + 1) {
        setPhase("complete");
        const completedLog = { ...sessionLog, ...updated, completedAt: Date.now() };
        await db.sessionLogs.update(sessionLog.id, { completedAt: completedLog.completedAt, setLogs: updated.setLogs });
        const idToName: Record<string, string> = {};
        workoutDay.exercises?.forEach((ex) => { idToName[ex.id] = ex.name; });
        await recordPRsFromSession(completedLog as import("@/lib/types").SessionLog, idToName);
      } else {
        setExerciseIndex((i) => i + 1);
        setSetIndex(0);
        setPhase("rest");
        setTimer(exercise.restSeconds ?? 90);
      }
    } else {
      setSetIndex((i) => i + 1);
      setPhase("rest");
      setTimer(exercise.restSeconds ?? 90);
    }
  }, [
    exercise,
    sessionLog,
    setIndex,
    totalSets,
    exerciseIndex,
    workoutDay?.exercises?.length,
    repsInput,
    weightInput,
    workoutDay,
  ]);

  const skipRest = () => {
    setPhase("work");
    setTimer(0);
  };

  useEffect(() => {
    if (phase !== "rest" || timer <= 0) return;
    const t = setInterval(() => setTimer((x) => (x <= 1 ? 0 : x - 1)), 1000);
    return () => clearInterval(t);
  }, [phase, timer]);

  useEffect(() => {
    if (timer === 0 && phase === "rest") setPhase("work");
  }, [timer, phase]);

  if (!workoutDay || workoutDay.type === "rest") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4">
        <p className="text-zinc-500 mb-4">No workout scheduled for today.</p>
        <Button onClick={() => router.push("/")}>Back to Today</Button>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-4">
        <p className="text-4xl mb-2">🔥</p>
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">Workout complete!</h1>
        <p className="text-zinc-500 mb-6">
          +{XP_PER_WORKOUT} XP • Great work.
        </p>
        <Button onClick={() => router.push("/")}>Back to Today</Button>
      </div>
    );
  }

  if (phase === "idle") {
    return (
      <div className="min-h-dvh flex flex-col justify-center px-4">
        <h1 className="text-2xl font-bold text-zinc-100 mb-2">{workoutDay.name}</h1>
        <p className="text-zinc-500 mb-8">
          {workoutDay.exercises?.length} exercises • ~{workoutDay.durationMinutes} min
        </p>
        <Button fullWidth size="lg" onClick={startSession}>
          Start Workout
        </Button>
        <button
          className="mt-4 text-zinc-500 text-sm"
          onClick={() => setGymMode(!gymMode)}
        >
          {gymMode ? "Exit Gym Mode" : "Gym Mode"}
        </button>
      </div>
    );
  }

  if (phase === "rest") {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return (
      <div
        className={`min-h-dvh flex flex-col items-center justify-center ${
          gymMode ? "gym-mode bg-black" : ""
        }`}
      >
        <p className="text-zinc-500 mb-2">Rest</p>
        <p className={`font-mono ${gymMode ? "text-6xl text-white" : "text-5xl text-zinc-100"}`}>
          {mins}:{secs.toString().padStart(2, "0")}
        </p>
        <Button variant="ghost" className="mt-6" onClick={skipRest}>
          Skip rest
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-dvh px-4 pt-[max(env(safe-area-inset-top),24px)] pb-24 content-pad ${
        gymMode ? "gym-mode bg-black text-white" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <p className="text-zinc-500 text-sm">
          {exerciseIndex + 1} / {workoutDay.exercises?.length} • Set {setIndex + 1} / {totalSets}
        </p>
        <button
          className="text-zinc-500 text-sm"
          onClick={() => setGymMode(!gymMode)}
        >
          {gymMode ? "Exit" : "Gym"}
        </button>
      </div>

      <h2 className={`text-2xl font-bold mb-8 ${gymMode ? "text-white" : "text-zinc-100"}`}>
        {exercise?.name}
      </h2>

      <div className="space-y-4 mb-8">
        <Input
          label="Weight (kg)"
          type="number"
          placeholder="0"
          value={weightInput}
          onChange={(e) => setWeightInput(e.target.value)}
        />
        <Input
          label="Reps"
          type="number"
          placeholder="0"
          value={repsInput}
          onChange={(e) => setRepsInput(e.target.value)}
        />
      </div>

      <Button fullWidth size="lg" onClick={logSet}>
        Log set
      </Button>
    </div>
  );
}
