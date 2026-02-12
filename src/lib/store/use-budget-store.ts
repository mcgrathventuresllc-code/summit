/**
 * Summit - Budget store
 * Wizard data, computations, scenarios
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WizardData, DebtItem } from "@/lib/schemas/budget";
import {
  computePaycheckBreakdown,
  type PaycheckInput,
  type PreTaxDeductions,
  type PostTaxDeductions,
  PAY_PERIODS_PER_YEAR,
  computeBudgetRecommendations,
  totalMinimumPayments,
  type BudgetMode,
} from "@/lib/engine";
import type { PaycheckBreakdown } from "@/lib/engine/paycheck";
import type { BudgetRecommendations } from "@/lib/engine/budget";

const STORAGE_KEY = "summit-budget-store";
const MAX_SCENARIOS = 5;

export interface SavedScenario {
  id: string;
  name: string;
  data: WizardData;
  breakdown: PaycheckBreakdown;
  recommendations: BudgetRecommendations;
  createdAt: number;
}

export interface BudgetStore {
  wizard: WizardData;
  setWizard: (data: Partial<WizardData>) => void;
  setLocation: (loc: Partial<WizardData["location"]>) => void;
  setIncome: (inc: Partial<WizardData["income"]>) => void;
  setBenefits: (b: Partial<WizardData["benefits"]>) => void;
  setDebts: (d: WizardData["debts"]) => void;
  addDebt: (debt: Omit<DebtItem, "id">) => void;
  removeDebt: (id: string) => void;
  updateDebt: (id: string, updates: Partial<DebtItem>) => void;

  breakdown: PaycheckBreakdown | null;
  recommendations: BudgetRecommendations | null;
  budgetMode: BudgetMode;
  setBudgetMode: (mode: BudgetMode) => void;
  refreshComputations: () => void;

  userRent: number | null;
  userGroceries: number | null;
  userLifestyle: number | null;
  userUtilities: number | null;
  setUserRent: (v: number | null) => void;
  setUserGroceries: (v: number | null) => void;
  setUserLifestyle: (v: number | null) => void;
  setUserUtilities: (v: number | null) => void;

  scenarios: SavedScenario[];
  saveScenario: (name: string) => void;
  deleteScenario: (id: string) => void;
  loadScenario: (id: string) => void;

  loadDemo: () => void;
}

function buildPaycheckInput(wizard: WizardData): PaycheckInput {
  const periods = PAY_PERIODS_PER_YEAR[wizard.income.payFrequency];
  const annualGross =
    wizard.income.annualGross +
    (wizard.income.bonusIncludedInBudget ? wizard.income.annualBonus : 0);
  const retirementPerPaycheck =
    wizard.benefits.retirement401kPercent != null && wizard.benefits.retirement401kPercent > 0
      ? (annualGross * (wizard.benefits.retirement401kPercent / 100)) / periods
      : (wizard.benefits.retirement401kDollars ?? 0);
  const hsaPerPaycheck =
    wizard.benefits.hsaPercent != null && wizard.benefits.hsaPercent > 0
      ? (annualGross * (wizard.benefits.hsaPercent / 100)) / periods
      : (wizard.benefits.hsaDollars ?? 0);

  const preTax: PreTaxDeductions = {
    retirement401k: retirementPerPaycheck,
    hsa: hsaPerPaycheck,
    healthcarePremium: wizard.benefits.healthcarePreTax ? wizard.benefits.healthcarePremium : 0,
    dentalVision: wizard.benefits.dentalVision,
    other: wizard.benefits.otherPreTax,
  };
  const postTax: PostTaxDeductions = {
    healthcarePremium: wizard.benefits.healthcarePreTax ? 0 : wizard.benefits.healthcarePremium,
    other: wizard.benefits.otherPostTax,
  };

  return {
    annualGross,
    payFrequency: wizard.income.payFrequency,
    filingStatus: wizard.benefits.filingStatus,
    stateCode: wizard.location.state,
    localTaxPercent: wizard.location.localTaxPercent,
    preTax,
    postTax,
  };
}

const defaultWizard: WizardData = {
  location: { country: "US", state: "AZ", city: "", localTaxPercent: 0 },
  income: {
    annualGross: 0,
    payFrequency: "biweekly",
    annualBonus: 0,
    bonusIncludedInBudget: false,
  },
  benefits: {
    filingStatus: "single",
    healthcarePremium: 0,
    healthcarePreTax: true,
    dentalVision: 0,
    otherPreTax: 0,
    otherPostTax: 0,
  },
  debts: { items: [] },
};

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      wizard: defaultWizard,
      breakdown: null,
      recommendations: null,
      budgetMode: "balanced",
      userRent: null,
      userGroceries: null,
      userLifestyle: null,
      userUtilities: null,
      scenarios: [],

      setWizard: (data) => set((s) => ({ wizard: { ...s.wizard, ...data } })),

      setLocation: (loc) =>
        set((s) => ({
          wizard: {
            ...s.wizard,
            location: { ...s.wizard.location, ...loc },
          },
        })),

      setIncome: (inc) =>
        set((s) => ({
          wizard: {
            ...s.wizard,
            income: { ...s.wizard.income, ...inc },
          },
        })),

      setBenefits: (b) =>
        set((s) => ({
          wizard: {
            ...s.wizard,
            benefits: { ...s.wizard.benefits, ...b },
          },
        })),

      setDebts: (d) =>
        set((s) => ({
          wizard: { ...s.wizard, debts: d },
        })),

      addDebt: (debt) =>
        set((s) => ({
          wizard: {
            ...s.wizard,
            debts: {
              items: [...s.wizard.debts.items, { ...debt, id: crypto.randomUUID() }],
            },
          },
        })),

      removeDebt: (id) =>
        set((s) => ({
          wizard: {
            ...s.wizard,
            debts: {
              items: s.wizard.debts.items.filter((d) => d.id !== id),
            },
          },
        })),

      updateDebt: (id, updates) =>
        set((s) => ({
          wizard: {
            ...s.wizard,
            debts: {
              items: s.wizard.debts.items.map((d) =>
                d.id === id ? { ...d, ...updates } : d
              ),
            },
          },
        })),

      setBudgetMode: (mode) => set({ budgetMode: mode }),

      setUserRent: (v) => set({ userRent: v }),
      setUserGroceries: (v) => set({ userGroceries: v }),
      setUserLifestyle: (v) => set({ userLifestyle: v }),
      setUserUtilities: (v) => set({ userUtilities: v }),

      refreshComputations: () => {
        const { wizard, budgetMode } = get();
        const input = buildPaycheckInput(wizard);
        const breakdown = computePaycheckBreakdown(input);

        const totalDebtMin = totalMinimumPayments(wizard.debts.items);
        const rentEst = get().userRent ?? breakdown.netMonthly * 0.25;
        const groceriesEst = get().userGroceries ?? breakdown.netMonthly * 0.1;
        const utilitiesEst = get().userUtilities ?? 250;
        const essentials = rentEst + groceriesEst + utilitiesEst + totalDebtMin;

        const recommendations = computeBudgetRecommendations(
          breakdown.netMonthly,
          budgetMode,
          essentials
        );

        set({ breakdown, recommendations });
      },

      saveScenario: (name) => {
        const { wizard, breakdown, recommendations, scenarios } = get();
        if (!breakdown || !recommendations) return;
        const next = [...scenarios];
        if (next.length >= MAX_SCENARIOS) next.shift();
        next.push({
          id: crypto.randomUUID(),
          name,
          data: { ...wizard },
          breakdown: { ...breakdown },
          recommendations: { ...recommendations },
          createdAt: Date.now(),
        });
        set({ scenarios: next });
      },

      deleteScenario: (id) => {
        set((s) => ({
          scenarios: s.scenarios.filter((sc) => sc.id !== id),
        }));
      },

      loadScenario: (id) => {
        const scenario = get().scenarios.find((s) => s.id === id);
        if (scenario) {
          set({
            wizard: scenario.data,
            breakdown: scenario.breakdown,
            recommendations: scenario.recommendations,
          });
        }
      },

      loadDemo: () => {
        set({
          wizard: {
            location: {
              country: "US",
              state: "AZ",
              city: "Phoenix",
              localTaxPercent: 0,
            },
            income: {
              annualGross: 85_000,
              payFrequency: "biweekly",
              annualBonus: 5_000,
              bonusIncludedInBudget: true,
            },
            benefits: {
              filingStatus: "single",
              retirement401kPercent: 12,
              employerMatchPercent: 5,
              hsaDollars: 100,
              healthcarePremium: 85,
              healthcarePreTax: true,
              dentalVision: 25,
              otherPreTax: 0,
              otherPostTax: 0,
            },
            debts: {
              items: [
                {
                  id: crypto.randomUUID(),
                  type: "credit_card",
                  balance: 3_500,
                  apr: 24.99,
                  minimumPayment: 120,
                },
                {
                  id: crypto.randomUUID(),
                  type: "student_loan",
                  balance: 28_000,
                  apr: 5.5,
                  minimumPayment: 320,
                },
              ],
            },
          },
        });
        get().refreshComputations();
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({
        wizard: s.wizard,
        budgetMode: s.budgetMode,
        scenarios: s.scenarios,
      }),
    }
  )
);
