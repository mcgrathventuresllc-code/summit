import type { ActivityLevel, PrimaryGoal, TrainingExperience, PreferredSplit, EquipmentAccess, WorkoutDuration, Sex } from "./types";

export const ONBOARDING_STEPS = [
  { id: "name", title: "What should we call you?" },
  { id: "age", title: "How old are you?" },
  { id: "sex", title: "Biological sex (optional)" },
  { id: "height", title: "Height" },
  { id: "weight", title: "Weight" },
  { id: "activity", title: "Activity level" },
  { id: "goal", title: "Primary goal" },
  { id: "experience", title: "Training experience" },
  { id: "days_duration", title: "Training schedule" },
  { id: "equipment", title: "Equipment access" },
  { id: "injuries", title: "Injuries & limitations" },
  { id: "split", title: "Preferred split" },
  { id: "running", title: "Running baseline (optional)" },
  { id: "steps", title: "Step goal (optional)" },
  { id: "notifications", title: "Reminders" },
  { id: "plan_source", title: "Training plan" },
  { id: "manual_plan", title: "Your training plan" },
] as const;

export type StepId = (typeof ONBOARDING_STEPS)[number]["id"];

export const ACTIVITY_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentary", label: "Sedentary (little/no exercise)" },
  { value: "light", label: "Light (1–2 days/week)" },
  { value: "moderate", label: "Moderate (3–4 days/week)" },
  { value: "very_active", label: "Very active (5+ days/week)" },
];

export const GOAL_OPTIONS: { value: PrimaryGoal; label: string }[] = [
  { value: "fat_loss", label: "Fat loss" },
  { value: "muscle_gain", label: "Muscle gain" },
  { value: "strength", label: "Strength" },
  { value: "running_endurance", label: "Running endurance" },
  { value: "general_fitness", label: "General fitness" },
];

export const EXPERIENCE_OPTIONS: { value: TrainingExperience; label: string }[] = [
  { value: "beginner", label: "Beginner (< 6 months)" },
  { value: "intermediate", label: "Intermediate (6 months – 2 years)" },
  { value: "advanced", label: "Advanced (2+ years)" },
];

export const SPLIT_OPTIONS: { value: PreferredSplit; label: string }[] = [
  { value: "full_body", label: "Full body" },
  { value: "upper_lower", label: "Upper / Lower" },
  { value: "push_pull_legs", label: "Push-Pull-Legs" },
  { value: "running_focus", label: "Running plan focus" },
];

export const EQUIPMENT_OPTIONS: { value: EquipmentAccess; label: string }[] = [
  { value: "full_gym", label: "Full gym" },
  { value: "dumbbells", label: "Dumbbells only" },
  { value: "home_minimal", label: "Home minimal" },
  { value: "running_only", label: "Running only" },
];

export const DURATION_OPTIONS: { value: WorkoutDuration; label: string }[] = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 75, label: "75 min" },
  { value: 90, label: "90 min" },
];

export const SEX_OPTIONS: { value: Sex | ""; label: string }[] = [
  { value: "", label: "Prefer not to say" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not", label: "Prefer not to say" },
];
