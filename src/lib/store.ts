/**
 * Summit - Zustand Store
 * Central state with persistence to IndexedDB
 */

import { create } from "zustand";
import type { UserProfile, WorkoutPlan, SessionLog } from "./types";
import { db } from "./db";

const THEME_KEY = "summit-theme";

interface SummitState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  saveUserProfile: (profile: Partial<UserProfile>) => Promise<void>;

  currentPlan: WorkoutPlan | null;
  setCurrentPlan: (plan: WorkoutPlan | null) => void;
  loadPlan: (weekNumber: number) => Promise<void>;

  activeSession: SessionLog | null;
  setActiveSession: (session: SessionLog | null) => void;

  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  showAddToHomeScreen: boolean;
  setShowAddToHomeScreen: (show: boolean) => void;

  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  hydrate: () => Promise<void>;
  supabaseUserId: string | null;
  setSupabaseUserId: (id: string | null) => void;
  hydrateWithAuth: (supabaseUserId: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useSummitStore = create<SummitState>((set, get) => ({
  userProfile: null,
  currentPlan: null,
  activeSession: null,
  theme: "dark",
  showAddToHomeScreen: false,
  hydrated: false,
  supabaseUserId: null,

  setUserProfile: (profile) => set({ userProfile: profile }),
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setActiveSession: (session) => set({ activeSession: session }),
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  },
  setShowAddToHomeScreen: (show) => set({ showAddToHomeScreen: show }),
  setHydrated: (hydrated) => set({ hydrated }),
  setSupabaseUserId: (id) => set({ supabaseUserId: id }),

  saveUserProfile: async (updates) => {
    const current = get().userProfile;
    if (!current) return;
    const updated: UserProfile = {
      ...current,
      ...updates,
      updatedAt: Date.now(),
    };
    await db.userProfiles.put(updated);
    set({ userProfile: updated });
  },

  loadPlan: async (weekNumber: number) => {
    const profile = get().userProfile;
    if (!profile) return;
    const plan = await db.workoutPlans
      .where({ userId: profile.id })
      .filter((p) => p.weekNumber === weekNumber)
      .first();
    set({ currentPlan: plan ?? null });
  },

  hydrate: async () => {
    if (typeof window === "undefined") return;
    const theme = (localStorage.getItem(THEME_KEY) as "light" | "dark") ?? "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");

    const profile = await db.userProfiles.orderBy("createdAt").last();
    set({
      userProfile: profile ?? null,
      theme,
      hydrated: true,
    });

    if (profile) {
      const weekNum = Math.floor(
        (Date.now() - profile.createdAt) / (7 * 24 * 60 * 60 * 1000)
      ) + 1;
      const plan = await db.workoutPlans
        .where({ userId: profile.id })
        .filter((p) => p.weekNumber === weekNum)
        .first();
      set({ currentPlan: plan ?? null });
    }
  },

  hydrateWithAuth: async (id: string) => {
    if (typeof window === "undefined") return;
    const theme = (localStorage.getItem(THEME_KEY) as "light" | "dark") ?? "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");

    set({ supabaseUserId: id });
    const profile = await db.userProfiles.where("supabaseUserId").equals(id).first();
    set({
      userProfile: profile ?? null,
      theme,
      hydrated: true,
    });

    if (profile) {
      const weekNum = Math.floor(
        (Date.now() - profile.createdAt) / (7 * 24 * 60 * 60 * 1000)
      ) + 1;
      const plan = await db.workoutPlans
        .where({ userId: profile.id })
        .filter((p) => p.weekNumber === weekNum)
        .first();
      set({ currentPlan: plan ?? null });
    }
  },

  signOut: async () => {
    const { createClient } = await import("./supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ userProfile: null, currentPlan: null, activeSession: null, supabaseUserId: null, hydrated: true });
  },
}));
