/**
 * Exercise templates for plan generation
 */

import type { Exercise } from "./types";

export const EXERCISE_LIBRARY: Record<string, Omit<Exercise, "id">> = {
  barbell_squat: { name: "Barbell Back Squat", muscleGroup: "quads", equipment: ["barbell", "rack"], sets: 3, reps: "6-8", restSeconds: 180, rpe: 8 },
  goblet_squat: { name: "Goblet Squat", muscleGroup: "quads", equipment: ["dumbbell"], sets: 3, reps: "10-12", restSeconds: 90, rpe: 8 },
  leg_press: { name: "Leg Press", muscleGroup: "quads", equipment: ["machine"], sets: 3, reps: "10-12", restSeconds: 120, rpe: 8 },
  bulgarian_split: { name: "Bulgarian Split Squat", muscleGroup: "quads", equipment: ["dumbbell"], sets: 3, reps: "8-10", restSeconds: 90, rpe: 8 },
  romanian_deadlift: { name: "Romanian Deadlift", muscleGroup: "hamstrings", equipment: ["barbell", "dumbbell"], sets: 3, reps: "8-10", restSeconds: 120, rpe: 8 },
  leg_curl: { name: "Leg Curl", muscleGroup: "hamstrings", equipment: ["machine"], sets: 3, reps: "10-12", restSeconds: 90, rpe: 8 },
  deadlift: { name: "Conventional Deadlift", muscleGroup: "back", equipment: ["barbell"], sets: 3, reps: "5-6", restSeconds: 180, rpe: 8 },
  sumo_deadlift: { name: "Sumo Deadlift", muscleGroup: "back", equipment: ["barbell"], sets: 3, reps: "6-8", restSeconds: 180, rpe: 8 },
  bench_press: { name: "Bench Press", muscleGroup: "chest", equipment: ["barbell", "rack"], sets: 3, reps: "6-8", restSeconds: 120, rpe: 8 },
  incline_dumbbell: { name: "Incline Dumbbell Press", muscleGroup: "chest", equipment: ["dumbbell"], sets: 3, reps: "8-10", restSeconds: 90, rpe: 8 },
  push_ups: { name: "Push-ups", muscleGroup: "chest", equipment: ["bodyweight"], sets: 3, reps: "10-15", restSeconds: 60, rpe: 8 },
  overhead_press: { name: "Overhead Press", muscleGroup: "shoulders", equipment: ["barbell"], sets: 3, reps: "6-8", restSeconds: 120, rpe: 8 },
  landmine_press: { name: "Landmine Press", muscleGroup: "shoulders", equipment: ["barbell"], sets: 3, reps: "8-10", restSeconds: 90, rpe: 8 },
  dumbbell_press: { name: "Dumbbell Shoulder Press", muscleGroup: "shoulders", equipment: ["dumbbell"], sets: 3, reps: "8-10", restSeconds: 90, rpe: 8 },
  lateral_raise: { name: "Lateral Raise", muscleGroup: "shoulders", equipment: ["dumbbell"], sets: 3, reps: "12-15", restSeconds: 60, rpe: 8 },
  tricep_pushdown: { name: "Tricep Pushdown", muscleGroup: "triceps", equipment: ["cable"], sets: 3, reps: "10-12", restSeconds: 60, rpe: 8 },
  tricep_dips: { name: "Tricep Dips", muscleGroup: "triceps", equipment: ["bodyweight"], sets: 3, reps: "8-12", restSeconds: 60, rpe: 8 },
  pull_up: { name: "Pull-up", muscleGroup: "back", equipment: ["bar"], sets: 3, reps: "6-10", restSeconds: 90, rpe: 8 },
  lat_pulldown: { name: "Lat Pulldown", muscleGroup: "back", equipment: ["cable"], sets: 3, reps: "8-10", restSeconds: 90, rpe: 8 },
  barbell_row: { name: "Barbell Row", muscleGroup: "back", equipment: ["barbell"], sets: 3, reps: "8-10", restSeconds: 90, rpe: 8 },
  dumbbell_row: { name: "Dumbbell Row", muscleGroup: "back", equipment: ["dumbbell"], sets: 3, reps: "8-10", restSeconds: 90, rpe: 8 },
  face_pull: { name: "Face Pull", muscleGroup: "shoulders", equipment: ["cable"], sets: 3, reps: "15-20", restSeconds: 60, rpe: 7 },
  bicep_curl: { name: "Bicep Curl", muscleGroup: "biceps", equipment: ["dumbbell", "barbell"], sets: 3, reps: "10-12", restSeconds: 60, rpe: 8 },
  plank: { name: "Plank", muscleGroup: "core", equipment: ["bodyweight"], sets: 3, reps: "30-60s", restSeconds: 60, rpe: 7 },
  dead_bug: { name: "Dead Bug", muscleGroup: "core", equipment: ["bodyweight"], sets: 3, reps: "10/side", restSeconds: 60, rpe: 7 },
};

export const SHOLDER_SAFE: Record<string, string> = {
  overhead_press: "landmine_press",
  dumbbell_press: "landmine_press",
  landmine_press: "push_ups",
};

export const BACK_SAFE: Record<string, string> = {
  deadlift: "romanian_deadlift",
  barbell_row: "dumbbell_row",
};

export const KNEE_SAFE: Record<string, string> = {
  barbell_squat: "leg_press",
  goblet_squat: "leg_press",
  bulgarian_split: "leg_press",
};
