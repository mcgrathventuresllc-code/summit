/**
 * Summit - Plan Generator
 * Deterministic workout plans from user profile
 */

import type { UserProfile, WorkoutPlan, WorkoutDay, Exercise } from "./types";
import { EXERCISE_LIBRARY, SHOLDER_SAFE, BACK_SAFE, KNEE_SAFE } from "./exercises";

function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getExercise(key: string, injuryToggles?: UserProfile["injuryToggles"]): Exercise {
  let finalKey = key;
  if (injuryToggles?.shoulders && SHOLDER_SAFE[key]) finalKey = SHOLDER_SAFE[key];
  else if (injuryToggles?.back && BACK_SAFE[key]) finalKey = BACK_SAFE[key];
  else if (injuryToggles?.knees && KNEE_SAFE[key]) finalKey = KNEE_SAFE[key];
  const template = EXERCISE_LIBRARY[finalKey];
  if (!template) throw new Error(`Unknown exercise: ${finalKey}`);
  return { id: uuid(), ...template };
}

function filterByEquipment(keys: string[], equipment: UserProfile["equipmentAccess"]): string[] {
  const equipmentMap: Record<string, string[][]> = {
    full_gym: [["barbell", "rack", "dumbbell", "machine", "cable", "bar", "bodyweight"]],
    dumbbells: [["dumbbell", "bodyweight"]],
    home_minimal: [["bodyweight", "dumbbell"]],
    running_only: [["bodyweight"]],
  };
  const allowed = equipmentMap[equipment]?.[0] ?? equipmentMap.full_gym[0];
  return keys.filter((key) => {
    const ex = EXERCISE_LIBRARY[key];
    return ex && ex.equipment.some((e) => allowed.includes(e));
  });
}

function buildFullBodyDay(profile: UserProfile, duration: number): WorkoutDay {
  const lower = filterByEquipment(["barbell_squat", "goblet_squat", "leg_press", "bulgarian_split"], profile.equipmentAccess);
  const push = filterByEquipment(["bench_press", "incline_dumbbell", "push_ups", "overhead_press", "dumbbell_press", "landmine_press"], profile.equipmentAccess);
  const pull = filterByEquipment(["pull_up", "lat_pulldown", "barbell_row", "dumbbell_row"], profile.equipmentAccess);
  const setsPerEx = duration <= 45 ? 2 : 3;
  const exercises: Exercise[] = [
    getExercise(lower[0] ?? "goblet_squat", profile.injuryToggles),
    getExercise(push[0] ?? "push_ups", profile.injuryToggles),
    getExercise(pull[0] ?? "dumbbell_row", profile.injuryToggles),
    getExercise("lateral_raise", profile.injuryToggles),
    getExercise("bicep_curl", profile.injuryToggles),
    getExercise("plank", profile.injuryToggles),
  ].map((ex) => ({ ...ex, sets: setsPerEx }));

  return {
    id: uuid(),
    dayIndex: 0,
    name: "Full Body A",
    type: "strength",
    exercises,
    warmup: ["Dynamic stretches", "Band pull-aparts", "Goblet squat holds"],
    cooldown: ["Static stretching", "Deep breathing"],
    durationMinutes: duration,
  };
}

function buildUpperLowerSplit(profile: UserProfile, dayType: "upper" | "lower", duration: number): WorkoutDay {
  const setsPerEx = duration <= 45 ? 2 : 3;
  if (dayType === "upper") {
    const push = filterByEquipment(["bench_press", "incline_dumbbell", "push_ups"], profile.equipmentAccess);
    const pull = filterByEquipment(["pull_up", "lat_pulldown", "barbell_row", "dumbbell_row"], profile.equipmentAccess);
    const shoulder = filterByEquipment(["overhead_press", "dumbbell_press", "landmine_press"], profile.equipmentAccess);
    const exercises: Exercise[] = [
      getExercise(push[0] ?? "push_ups", profile.injuryToggles),
      getExercise(pull[0] ?? "dumbbell_row", profile.injuryToggles),
      getExercise(shoulder[0] ?? "lateral_raise", profile.injuryToggles),
      getExercise("face_pull", profile.injuryToggles),
      getExercise("bicep_curl", profile.injuryToggles),
      getExercise("tricep_pushdown", profile.injuryToggles),
    ].map((ex) => ({ ...ex, sets: setsPerEx }));
    return {
      id: uuid(),
      dayIndex: 0,
      name: "Upper Body",
      type: "strength",
      exercises,
      warmup: ["Arm circles", "Band pull-aparts", "Light rows"],
      cooldown: ["Shoulder stretches", "Chest stretch"],
      durationMinutes: duration,
    };
  }
  const lower = filterByEquipment(["barbell_squat", "goblet_squat", "leg_press", "romanian_deadlift", "deadlift", "sumo_deadlift"], profile.equipmentAccess);
  const hamstring = filterByEquipment(["leg_curl", "romanian_deadlift"], profile.equipmentAccess);
  const exercises: Exercise[] = [
    getExercise(lower[0] ?? "goblet_squat", profile.injuryToggles),
    getExercise(hamstring[0] ?? "romanian_deadlift", profile.injuryToggles),
    getExercise("bulgarian_split", profile.injuryToggles),
    getExercise("plank", profile.injuryToggles),
  ].map((ex) => ({ ...ex, sets: setsPerEx }));
  return {
    id: uuid(),
    dayIndex: 0,
    name: "Lower Body",
    type: "strength",
    exercises,
    warmup: ["Hip circles", "Goblet squat holds", "Leg swings"],
    cooldown: ["Hip flexor stretch", "Hamstring stretch"],
    durationMinutes: duration,
  };
}

function buildPushPullLegs(profile: UserProfile, dayType: "push" | "pull" | "legs", duration: number): WorkoutDay {
  const setsPerEx = duration <= 45 ? 2 : 3;
  const durationMultiplier = duration >= 60 ? 1.2 : 1;
  if (dayType === "push") {
    const push = filterByEquipment(["bench_press", "incline_dumbbell", "push_ups"], profile.equipmentAccess);
    const shoulder = filterByEquipment(["overhead_press", "dumbbell_press", "landmine_press"], profile.equipmentAccess);
    const exercises: Exercise[] = [
      getExercise(push[0] ?? "push_ups", profile.injuryToggles),
      getExercise(shoulder[0] ?? "lateral_raise", profile.injuryToggles),
      getExercise("lateral_raise", profile.injuryToggles),
      getExercise("tricep_pushdown", profile.injuryToggles),
      getExercise("tricep_dips", profile.injuryToggles),
    ].map((ex) => ({ ...ex, sets: Math.round(setsPerEx * durationMultiplier) }));
    return { id: uuid(), dayIndex: 0, name: "Push", type: "strength", exercises, warmup: ["Arm circles", "Band pull-aparts"], cooldown: ["Chest stretch", "Tricep stretch"], durationMinutes: duration };
  }
  if (dayType === "pull") {
    const pull = filterByEquipment(["pull_up", "lat_pulldown", "barbell_row", "dumbbell_row"], profile.equipmentAccess);
    const exercises: Exercise[] = [
      getExercise(pull[0] ?? "dumbbell_row", profile.injuryToggles),
      getExercise("face_pull", profile.injuryToggles),
      getExercise("bicep_curl", profile.injuryToggles),
    ].map((ex) => ({ ...ex, sets: Math.round(setsPerEx * durationMultiplier) }));
    return { id: uuid(), dayIndex: 0, name: "Pull", type: "strength", exercises, warmup: ["Band pull-aparts", "Light rows"], cooldown: ["Lat stretch", "Bicep stretch"], durationMinutes: duration };
  }
  const lower = filterByEquipment(["barbell_squat", "goblet_squat", "leg_press", "romanian_deadlift"], profile.equipmentAccess);
  const exercises: Exercise[] = [
    getExercise(lower[0] ?? "goblet_squat", profile.injuryToggles),
    getExercise("romanian_deadlift", profile.injuryToggles),
    getExercise("leg_curl", profile.injuryToggles),
    getExercise("plank", profile.injuryToggles),
  ].map((ex) => ({ ...ex, sets: Math.round(setsPerEx * durationMultiplier) }));
  return { id: uuid(), dayIndex: 0, name: "Legs", type: "strength", exercises, warmup: ["Hip circles", "Goblet squat holds"], cooldown: ["Hip flexor stretch"], durationMinutes: duration };
}

function restDay(suggestions: string[]): WorkoutDay {
  return { id: uuid(), dayIndex: -1, name: "Rest Day", type: "rest", exercises: [], activeRecoverySuggestions: suggestions, durationMinutes: 0 };
}

function runningDay(type: "easy" | "interval" | "long", duration: number): WorkoutDay {
  const suggestions: Record<string, string> = {
    easy: `${duration} min easy run at conversational pace`,
    interval: `${duration} min: 5 min warmup, 4x(3 min hard / 2 min easy), 5 min cooldown`,
    long: `${Math.min(duration + 15, 90)} min long run, keep heart rate in zone 2`,
  };
  return {
    id: uuid(),
    dayIndex: 0,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} Run`,
    type: "running",
    exercises: [{ id: uuid(), name: type === "easy" ? "Easy Run" : type === "interval" ? "Interval Run" : "Long Run", muscleGroup: "cardio", equipment: ["bodyweight"], sets: 1, reps: suggestions[type], restSeconds: 0 }],
    warmup: ["5 min dynamic warmup", "Light jog"],
    cooldown: ["5 min walk", "Stretch"],
    durationMinutes: duration,
  };
}

export function generatePlan(profile: UserProfile, weekNumber: number): WorkoutPlan {
  const duration = profile.preferredDuration;
  const daysPerWeek = profile.daysPerWeek;
  const split = profile.preferredSplit;
  const isDeload = weekNumber > 0 && weekNumber % 5 === 0;
  const activeRecovery = ["10 min walk", "Light yoga or stretching", "Foam rolling", "Swimming or cycling (easy)"];
  const days: WorkoutDay[] = [];
  const workoutIndices: number[] = [];
  for (let i = 0; i < daysPerWeek; i++) workoutIndices.push(i);

  if (split === "full_body") {
    const fbDay = buildFullBodyDay(profile, isDeload ? Math.min(duration, 45) : duration);
    for (let i = 0; i < daysPerWeek; i++) {
      days.push({ ...fbDay, id: uuid(), dayIndex: i, name: `Full Body ${String.fromCharCode(65 + (i % 2))}` });
    }
  } else if (split === "upper_lower") {
    for (let i = 0; i < daysPerWeek; i++) {
      const dayType = i % 2 === 0 ? "upper" : "lower";
      const d = buildUpperLowerSplit(profile, dayType, isDeload ? 45 : duration);
      days.push({ ...d, id: uuid(), dayIndex: i });
    }
  } else if (split === "push_pull_legs") {
    const pplCycle = ["push", "pull", "legs"] as const;
    for (let i = 0; i < daysPerWeek; i++) {
      const dayType = pplCycle[i % 3];
      const d = buildPushPullLegs(profile, dayType, isDeload ? 45 : duration);
      days.push({ ...d, id: uuid(), dayIndex: i });
    }
  } else {
    const runTypes: Array<"easy" | "interval" | "long"> = ["easy", "interval", "long"];
    for (let i = 0; i < Math.min(daysPerWeek, 3); i++) days.push(runningDay(runTypes[i], duration));
    for (let i = 3; i < daysPerWeek; i++) days.push(buildFullBodyDay(profile, Math.min(duration, 45)));
  }

  while (days.length < 7) days.push(restDay(activeRecovery));

  const whyThisPlan = `Based on your ${profile.trainingExperience} experience and ${profile.primaryGoal} goal, we've built a ${split.replace(/_/g, " ")} plan with ${daysPerWeek} training days per week.${isDeload ? " This is a deload week." : ""}`;

  return {
    id: uuid(),
    userId: profile.id,
    weekNumber,
    isDeloadWeek: isDeload,
    days,
    whyThisPlan,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/** Build a WorkoutPlan from user-defined manual days (onboarding) */
export function buildManualPlan(
  profile: UserProfile,
  manualDays: { name: string; type: "strength" | "rest" }[]
): WorkoutPlan {
  const duration = profile.preferredDuration;
  const activeRecovery = ["10 min walk", "Light yoga or stretching", "Foam rolling", "Swimming or cycling (easy)"];
  const days: WorkoutDay[] = manualDays.map((d, i) => {
    if (d.type === "rest") {
      return { ...restDay(activeRecovery), dayIndex: i, name: d.name.trim() || "Rest" };
    }
    const placeholder: Exercise = {
      id: uuid(),
      name: "Custom",
      muscleGroup: "general",
      equipment: ["bodyweight"],
      sets: 3,
      reps: "8-12",
      restSeconds: 90,
      notes: `Log your ${d.name} exercises here`,
    };
    return {
      id: uuid(),
      dayIndex: i,
      name: d.name.trim() || `Day ${i + 1}`,
      type: "strength",
      exercises: [placeholder],
      warmup: ["Dynamic stretches", "Light activation"],
      cooldown: ["Static stretching"],
      durationMinutes: duration,
    };
  });

  while (days.length < 7) {
    days.push(restDay(activeRecovery));
  }

  return {
    id: uuid(),
    userId: profile.id,
    weekNumber: 1,
    isDeloadWeek: false,
    days,
    whyThisPlan: "Your custom training plan.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
