/**
 * Summit - Unified types for fitness, budget, reading, recovery
 */

// --- User & Fitness (from Forge) ---
export type Sex = "male" | "female" | "prefer_not";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active";
export type PrimaryGoal =
  | "fat_loss"
  | "muscle_gain"
  | "strength"
  | "running_endurance"
  | "general_fitness";
export type TrainingExperience = "beginner" | "intermediate" | "advanced";
export type PreferredSplit =
  | "full_body"
  | "upper_lower"
  | "push_pull_legs"
  | "running_focus";
export type EquipmentAccess =
  | "full_gym"
  | "dumbbells"
  | "home_minimal"
  | "running_only";
export type WorkoutDuration = 30 | 45 | 60 | 75 | 90;

export interface UserProfile {
  id: string;
  supabaseUserId?: string; // links to auth.users when using Supabase auth
  name?: string;
  age: number;
  sex?: Sex;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  primaryGoal: PrimaryGoal;
  trainingExperience: TrainingExperience;
  daysPerWeek: number;
  preferredDuration: WorkoutDuration;
  equipmentAccess: EquipmentAccess;
  injuries?: string;
  injuryToggles?: { knees?: boolean; shoulders?: boolean; back?: boolean };
  preferredSplit: PreferredSplit;
  runningBaseline?: {
    type: "5k_time" | "easy_pace" | "new_to_running";
    value?: string;
  };
  stepGoal?: number;
  notificationReminders?: boolean;
  useManualPlan?: boolean;
  manualPlanDays?: { name: string; type: "strength" | "rest" }[];
  completedOnboarding: boolean;
  createdAt: number;
  updatedAt: number;
}

// --- Workout Plan ---
export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string[];
  sets: number;
  reps: string;
  restSeconds: number;
  rpe?: number;
  percentEffort?: number;
  notes?: string;
  substitutions?: string[];
}

export interface WorkoutDay {
  id: string;
  dayIndex: number;
  name: string;
  type: "strength" | "running" | "mobility" | "rest" | "active_recovery";
  exercises: Exercise[];
  warmup?: string[];
  cooldown?: string[];
  activeRecoverySuggestions?: string[];
  durationMinutes: number;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  weekNumber: number;
  isDeloadWeek: boolean;
  days: WorkoutDay[];
  whyThisPlan?: string;
  createdAt: number;
  updatedAt: number;
}

// --- Session Logging ---
export interface SetLog {
  id: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rpe?: number;
  completed: boolean;
  restSeconds?: number;
}

export interface RunningLog {
  id: string;
  type: "easy" | "interval" | "long" | "tempo";
  distanceKm?: number;
  durationMinutes?: number;
  paceMinPerKm?: number;
  notes?: string;
}

export interface SessionLog {
  id: string;
  workoutDayId: string;
  date: string;
  startedAt: number;
  completedAt?: number;
  setLogs: SetLog[];
  runningLog?: RunningLog;
  skipped?: boolean;
  notes?: string;
}

// --- PR Tracking ---
export interface PRRecord {
  id: string;
  userId: string;
  liftName: string;
  weightKg: number;
  reps: number;
  e1rmKg: number;
  date: string;
  sessionLogId: string;
}

export interface RunningPR {
  id: string;
  userId: string;
  distance: "1_mile" | "5k" | "10k";
  timeSeconds: number;
  paceMinPerKm: number;
  date: string;
}

// --- Gamification ---
export type Pillar = "fitness" | "budget" | "reading" | "recovery";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  pillar?: Pillar;
  earnedAt?: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: string;
  pillar?: Pillar;
  xpReward: number;
  completed: boolean;
  completedAt?: number;
}

export interface Streak {
  id: string;
  type: "workout" | "running" | "reading" | "check_in" | "week_completed";
  pillar?: Pillar;
  currentCount: number;
  lastActivityDate: string;
}

// --- WHOOP-style Evening Check-in ---
export interface EveningCheckIn {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD (evening of)
  completedAt: number;

  // Recovery / readiness
  sleepQuality: 1 | 2 | 3 | 4 | 5; // How well do you expect to sleep?
  soreness: 1 | 2 | 3 | 4 | 5; // 1=fresh, 5=very sore
  stress: 1 | 2 | 3 | 4 | 5; // 1=calm, 5=very stressed
  energy: 1 | 2 | 3 | 4 | 5; // 1=drained, 5=energized

  // Habits
  caffeineAfterNoon: boolean;
  alcoholConsumed: boolean;
  screenTimeBeforeBed: 1 | 2 | 3 | 4 | 5; // 1=minimal, 5=heavy

  // Optional
  notes?: string;
}

// --- Reading ---
export interface ReadingLog {
  id: string;
  userId: string;
  date: string;
  title?: string;
  author?: string;
  pagesRead: number;
  minutesRead: number;
  completedAt: number;
}

// --- Budget (Summit stores budget wizard data in IndexedDB) ---
export interface BudgetScenario {
  id: string;
  userId: string;
  name: string;
  wizardData: unknown; // WizardData from schemas
  breakdown: unknown; // PaycheckBreakdown
  recommendations: unknown; // BudgetRecommendations
  createdAt: number;
  updatedAt: number;
}

// --- Monthly Budget & Expense Tracking (XP only when you stick to it) ---
export type ExpenseCategory = "rent" | "groceries" | "lifestyle" | "utilities" | "other";

export interface MonthlyBudget {
  id: string;
  userId: string;
  year: number;
  month: number; // 1-12
  rent: number;
  groceries: number;
  lifestyle: number;
  utilities: number;
  other: number; // optional catch-all
  createdAt: number;
  updatedAt: number;
}

export interface ExpenseLog {
  id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
}

export interface BudgetReview {
  id: string;
  userId: string;
  year: number;
  month: number;
  xpAwarded: number;
  withinBudget: boolean;
  completedAt: number;
}

// --- Accountability Crew ---
export interface Crew {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface CrewMember {
  id: string;
  crew_id: string;
  user_id: string;
  display_name: string;
  joined_at: string;
}

export type CrewMessageType = "message" | "level_up" | "spelunking";

export interface CrewMessage {
  id: string;
  crew_id: string;
  user_id: string | null;
  type: CrewMessageType;
  content: string;
  metadata?: { level?: number; levelName?: string };
  created_at: string;
}

// --- Insights ---
export interface Insight {
  id: string;
  type: string;
  message: string;
  value?: number;
  date: string;
}
