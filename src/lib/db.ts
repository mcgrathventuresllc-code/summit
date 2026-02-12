/**
 * Summit - IndexedDB Database (Dexie)
 * Local-first storage for fitness, budget, reading, recovery
 */

import Dexie, { type Table } from "dexie";
import type {
  UserProfile,
  WorkoutPlan,
  SessionLog,
  PRRecord,
  RunningPR,
  Badge,
  Quest,
  Streak,
  Insight,
  EveningCheckIn,
  ReadingLog,
  BudgetScenario,
  MonthlyBudget,
  ExpenseLog,
  BudgetReview,
} from "./types";

export class SummitDB extends Dexie {
  userProfiles!: Table<UserProfile>;
  workoutPlans!: Table<WorkoutPlan>;
  sessionLogs!: Table<SessionLog>;
  prRecords!: Table<PRRecord>;
  runningPRs!: Table<RunningPR>;
  badges!: Table<Badge>;
  quests!: Table<Quest>;
  streaks!: Table<Streak>;
  insights!: Table<Insight>;
  eveningCheckIns!: Table<EveningCheckIn>;
  readingLogs!: Table<ReadingLog>;
  budgetScenarios!: Table<BudgetScenario>;
  monthlyBudgets!: Table<MonthlyBudget>;
  expenseLogs!: Table<ExpenseLog>;
  budgetReviews!: Table<BudgetReview>;

  constructor() {
    super("SummitDB");
    this.version(1).stores({
      userProfiles: "id, createdAt",
      workoutPlans: "id, userId, weekNumber",
      sessionLogs: "id, workoutDayId, date",
      prRecords: "id, userId, liftName, date",
      runningPRs: "id, userId, distance, date",
      badges: "id, earnedAt",
      quests: "id, completed",
      streaks: "id, type",
      insights: "id, date",
      eveningCheckIns: "id, userId, date",
      readingLogs: "id, userId, date",
      budgetScenarios: "id, userId, createdAt",
    });
    this.version(2).stores({
      monthlyBudgets: "id, userId, [userId+year+month]",
      expenseLogs: "id, userId, date",
      budgetReviews: "id, userId, [userId+year+month]",
    });
    this.version(3).stores({
      userProfiles: "id, supabaseUserId, createdAt",
    });
  }
}

export const db = new SummitDB();
