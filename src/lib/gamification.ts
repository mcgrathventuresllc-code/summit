/**
 * Summit - Unified gamification across all pillars
 * XP, Summit Score, badges, streaks, motivation
 */

import { format, addDays } from "date-fns";
import type { Badge, Quest, Streak } from "./types";

export const XP_PER_WORKOUT = 50;
export const XP_PER_READING_SESSION = 15; // per 15 min
export const XP_PER_CHECK_IN = 20;
/** XP awarded when you set your monthly budget (once per month) */
export const XP_PER_BUDGET_SET = 50;
export const XP_PER_QUEST = 25;
export const XP_LEVEL_BASE = 200;
export const XP_LEVEL_MULTIPLIER = 1.7;

export function xpToLevel(xp: number): number {
  let level = 1;
  let required = XP_LEVEL_BASE;
  let total = xp;
  while (total >= required) {
    total -= required;
    level++;
    required = Math.floor(XP_LEVEL_BASE * Math.pow(XP_LEVEL_MULTIPLIER, level - 2));
  }
  return level;
}

export function xpProgressInLevel(xp: number): { current: number; required: number; level: number } {
  const level = xpToLevel(xp);
  let required = XP_LEVEL_BASE;
  let accumulated = 0;
  for (let l = 1; l < level; l++) {
    accumulated += required;
    required = Math.floor(XP_LEVEL_BASE * Math.pow(XP_LEVEL_MULTIPLIER, l - 1));
  }
  const current = xp - accumulated;
  return { current, required, level };
}

/** Mountain-climbing themed level names */
const LEVEL_NAMES: Record<number, string> = {
  1: "Trailhead",
  2: "Base Camp",
  3: "First Ascent",
  4: "Ridge Walker",
  5: "Scrambler",
  6: "Alpine Hiker",
  7: "High Altitude",
  8: "Pass Crosser",
  9: "Ice Axe",
  10: "Rope Master",
  11: "Summit Seeker",
  12: "Peak Achiever",
  13: "Everest Bound",
  14: "Sherpa",
  15: "Alpine Master",
  16: "Summit Master",
  17: "Highlander",
  18: "Snow Leopard",
  19: "Cloud Walker",
  20: "Summit Legend",
  21: "Elite Climber",
  22: "Mountain Sage",
  23: "Thin Air",
  24: "Pinnacle",
  25: "Everest",
};

export function getLevelName(level: number): string {
  if (LEVEL_NAMES[level]) return LEVEL_NAMES[level];
  if (level > 25) return `Summit Legend ${level - 24}`;
  return `Summit ${level}`;
}

export const BADGE_DEFINITIONS: Omit<Badge, "earnedAt">[] = [
  // Fitness
  { id: "first_workout", name: "First Summit", description: "Complete your first workout", icon: "🔥", pillar: "fitness" },
  { id: "five_workouts", name: "Getting Started", description: "Complete 5 workouts", icon: "💪", pillar: "fitness" },
  { id: "ten_workouts", name: "Committed", description: "Complete 10 workouts", icon: "🏆", pillar: "fitness" },
  { id: "pr_badge", name: "New PR", description: "Set a personal record", icon: "📈", pillar: "fitness" },
  { id: "streak_5", name: "On Fire", description: "5-day workout streak", icon: "🔥", pillar: "fitness" },
  { id: "streak_10", name: "Unstoppable", description: "10-day workout streak", icon: "⚡", pillar: "fitness" },
  // Reading
  { id: "first_read", name: "Page Turner", description: "Log your first reading session", icon: "📖", pillar: "reading" },
  { id: "bookworm_5", name: "Bookworm", description: "5 reading sessions", icon: "📚", pillar: "reading" },
  { id: "reading_streak_7", name: "Week of Pages", description: "7-day reading streak", icon: "🌟", pillar: "reading" },
  // Recovery
  { id: "first_checkin", name: "Wind Down", description: "Complete your first evening check-in", icon: "🌙", pillar: "recovery" },
  { id: "checkin_streak_7", name: "Sleep Tracker", description: "7-day evening check-in streak", icon: "✨", pillar: "recovery" },
  // Budget
  { id: "budget_setup", name: "Financial Pilot", description: "Set up your budget", icon: "💰", pillar: "budget" },
  // General
  { id: "all_pillars", name: "Summit Seeker", description: "Engage in all four pillars", icon: "⛰️" },
];

export const DAILY_QUESTS: Omit<Quest, "id" | "completed" | "completedAt">[] = [
  { name: "Complete Warmup", description: "Do your warmup before training", type: "warmup", pillar: "fitness", xpReward: 15 },
  { name: "Complete Workout", description: "Finish today's workout", type: "workout", pillar: "fitness", xpReward: 50 },
  { name: "Read 15 min", description: "Spend 15 minutes reading", type: "reading", pillar: "reading", xpReward: 15 },
  { name: "Evening Check-in", description: "Complete your wind-down check-in", type: "check_in", pillar: "recovery", xpReward: 20 },
  { name: "Set Budget", description: "Set your monthly budget targets", type: "budget", pillar: "budget", xpReward: 50 },
];

export function calcStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = format(new Date(), "yyyy-MM-dd");
  if (sorted[0] !== today && sorted[0] !== format(addDays(new Date(), -1), "yyyy-MM-dd")) {
    return 0;
  }
  let streak = 0;
  let expect = sorted[0];
  for (const d of sorted) {
    if (d !== expect) break;
    streak++;
    expect = format(addDays(new Date(d), -1), "yyyy-MM-dd");
  }
  return streak;
}

/**
 * Summit Score: 0-100 composite from fitness, reading, recovery, consistency
 */
export function calcSummitScore(
  workoutsThisWeek: number,
  targetWorkouts: number,
  readingSessionsThisWeek: number,
  checkInsThisWeek: number,
  streakBonus: number
): number {
  const workoutCompletion = targetWorkouts > 0 ? Math.min(1, workoutsThisWeek / targetWorkouts) : 0.5;
  const workoutScore = workoutCompletion * 30; // 30 pts max

  const readingScore = Math.min(20, readingSessionsThisWeek * 5); // 20 pts max, 5 pts per session

  const checkInScore = Math.min(25, checkInsThisWeek * 5); // 25 pts max, 5 per check-in

  const consistencyBonus = Math.min(25, streakBonus * 2.5);

  return Math.round(Math.min(100, workoutScore + readingScore + checkInScore + consistencyBonus));
}

export function getMotivationMessage(
  streak: number,
  missedRecently: boolean,
  justCompleted: boolean
): string {
  if (justCompleted) {
    return ["Crushed it.", "Strong work.", "Keep climbing.", "You're building something."][
      Math.floor(Math.random() * 4)
    ];
  }
  if (missedRecently && streak === 0) {
    return "Every summit has rest stops. Ready when you are.";
  }
  if (streak >= 5) {
    return "You're building something. Don't stop now.";
  }
  if (streak >= 1) {
    return "Your streak is alive. One more today?";
  }
  return "Today's a great day to start. You've got this.";
}
