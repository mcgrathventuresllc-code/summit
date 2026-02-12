/**
 * Summit - Monthly budget & expense tracking
 * XP awarded when you set your monthly budget (once per month)
 */

import { db } from "./db";
import { XP_PER_BUDGET_SET } from "./gamification";
import type { MonthlyBudget, ExpenseLog, ExpenseCategory, BudgetReview } from "./types";

export async function getMonthlyBudget(
  userId: string,
  year: number,
  month: number
): Promise<MonthlyBudget | undefined> {
  return db.monthlyBudgets
    .where("[userId+year+month]")
    .equals([userId, year, month])
    .first();
}

export async function setMonthlyBudget(
  userId: string,
  year: number,
  month: number,
  data: {
    rent: number;
    groceries: number;
    lifestyle: number;
    utilities: number;
    other?: number;
  }
): Promise<MonthlyBudget> {
  const now = Date.now();
  const existing = await getMonthlyBudget(userId, year, month);
  const isNew = !existing;

  const record: MonthlyBudget = {
    id: existing?.id ?? crypto.randomUUID(),
    userId,
    year,
    month,
    rent: data.rent,
    groceries: data.groceries,
    lifestyle: data.lifestyle,
    utilities: data.utilities,
    other: data.other ?? 0,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  await db.monthlyBudgets.put(record);

  // Award XP when setting budget for a new month (not on update)
  if (isNew) {
    const review: BudgetReview = {
      id: crypto.randomUUID(),
      userId,
      year,
      month,
      xpAwarded: XP_PER_BUDGET_SET,
      withinBudget: true,
      completedAt: now,
    };
    await db.budgetReviews.add(review);
  }

  return record;
}

export async function getExpensesForMonth(
  userId: string,
  year: number,
  month: number
): Promise<ExpenseLog[]> {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0);
  const end = `${year}-${String(month).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
  return db.expenseLogs
    .where("userId")
    .equals(userId)
    .filter((e) => e.date >= start && e.date <= end)
    .toArray();
}

export async function addExpense(
  userId: string,
  category: ExpenseCategory,
  amount: number,
  date: string,
  note?: string
): Promise<ExpenseLog> {
  const record: ExpenseLog = {
    id: crypto.randomUUID(),
    userId,
    category,
    amount,
    date,
    note,
    createdAt: Date.now(),
  };
  await db.expenseLogs.add(record);
  return record;
}

