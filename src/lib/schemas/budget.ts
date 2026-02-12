import { z } from 'zod';

export const locationSchema = z.object({
  country: z.literal('US'),
  state: z.string().min(2).max(2),
  city: z.string().optional(),
  localTaxPercent: z.number().min(0).max(20).default(0),
});

export const payFrequencySchema = z.enum(['biweekly', 'semimonthly', 'monthly']);

export const incomeSchema = z.object({
  annualGross: z.number().min(0, 'Must be 0 or more'),
  payFrequency: payFrequencySchema.default('biweekly'),
  annualBonus: z.number().min(0).default(0),
  bonusIncludedInBudget: z.boolean().default(false),
});

export const filingStatusSchema = z.enum(['single', 'married_jointly']);

export const benefitsSchema = z.object({
  filingStatus: filingStatusSchema.default('single'),
  retirement401kPercent: z.number().min(0).max(100).optional(),
  retirement401kDollars: z.number().min(0).optional(),
  employerMatchPercent: z.number().min(0).max(100).optional(),
  hsaPercent: z.number().min(0).max(100).optional(),
  hsaDollars: z.number().min(0).optional(),
  healthcarePremium: z.number().min(0).default(0),
  healthcarePreTax: z.boolean().default(true),
  dentalVision: z.number().min(0).default(0),
  otherPreTax: z.number().min(0).default(0),
  otherPostTax: z.number().min(0).default(0),
});

export const debtItemSchema = z.object({
  id: z.string(),
  type: z.enum(['credit_card', 'student_loan', 'other']),
  balance: z.number().min(0),
  apr: z.number().min(0).max(100),
  minimumPayment: z.number().min(0),
});

export const debtsSchema = z.object({
  items: z.array(debtItemSchema).default([]),
});

export const wizardSchema = z.object({
  location: locationSchema,
  income: incomeSchema,
  benefits: benefitsSchema,
  debts: debtsSchema,
});

export type LocationInput = z.infer<typeof locationSchema>;
export type IncomeInput = z.infer<typeof incomeSchema>;
export type BenefitsInput = z.infer<typeof benefitsSchema>;
export type DebtItem = z.infer<typeof debtItemSchema>;
export type DebtsInput = z.infer<typeof debtsSchema>;
export type WizardData = z.infer<typeof wizardSchema>;
