import type { FilingStatus } from '../constants/federal-tax';
import { calcFederalIncomeTax } from './tax';
import { calcStateIncomeTax } from './tax';
import { calcFICA } from './tax';

export type PayFrequency = 'biweekly' | 'semimonthly' | 'monthly';

export const PAY_PERIODS_PER_YEAR: Record<PayFrequency, number> = {
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
};

export interface PreTaxDeductions {
  retirement401k: number;
  hsa: number;
  healthcarePremium: number;
  dentalVision: number;
  other: number;
}

export interface PostTaxDeductions {
  healthcarePremium: number;
  other: number;
}

export interface PaycheckInput {
  annualGross: number;
  payFrequency: PayFrequency;
  filingStatus: FilingStatus;
  stateCode: string;
  localTaxPercent: number;
  preTax: PreTaxDeductions;
  postTax: PostTaxDeductions;
}

export interface PaycheckBreakdown {
  grossPerPaycheck: number;
  preTaxTotal: number;
  taxableWages: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  fica: { socialSecurity: number; medicare: number; total: number };
  postTaxTotal: number;
  netPerPaycheck: number;
  netMonthly: number;
  netAnnual: number;
  annualGross: number;
}

export function computePaycheckBreakdown(input: PaycheckInput): PaycheckBreakdown {
  const periods = PAY_PERIODS_PER_YEAR[input.payFrequency];
  const grossPerPaycheck = input.annualGross / periods;
  const preTaxTotal =
    input.preTax.retirement401k +
    input.preTax.hsa +
    input.preTax.healthcarePremium +
    input.preTax.dentalVision +
    input.preTax.other;
  const annualPreTax = preTaxTotal * periods;
  const annualTaxableWages = Math.max(0, input.annualGross - annualPreTax);
  const federalTaxAnnual = calcFederalIncomeTax(annualTaxableWages, input.filingStatus);
  const stateTaxAnnual = calcStateIncomeTax(annualTaxableWages, input.stateCode);
  const localTaxAnnual = annualTaxableWages * (input.localTaxPercent / 100);
  const ficaAnnual = calcFICA(annualTaxableWages, input.filingStatus);

  const federalTax = federalTaxAnnual / periods;
  const stateTax = stateTaxAnnual / periods;
  const localTax = localTaxAnnual / periods;
  const ficaPerPeriod = {
    socialSecurity: ficaAnnual.socialSecurity / periods,
    medicare: ficaAnnual.medicare / periods,
    total: ficaAnnual.total / periods,
  };

  const postTaxTotal = input.postTax.healthcarePremium + input.postTax.other;
  const netPerPaycheck =
    grossPerPaycheck -
    preTaxTotal -
    federalTax -
    stateTax -
    localTax -
    ficaPerPeriod.total -
    postTaxTotal;

  const monthsPerYear = 12;
  const paychecksPerMonth =
    input.payFrequency === 'biweekly'
      ? 26 / 12
      : input.payFrequency === 'semimonthly'
        ? 2
        : 1;
  const netMonthly = netPerPaycheck * paychecksPerMonth;
  const netAnnual = netMonthly * monthsPerYear;

  return {
    grossPerPaycheck: Math.round(grossPerPaycheck * 100) / 100,
    preTaxTotal: Math.round(preTaxTotal * 100) / 100,
    taxableWages: Math.round((annualTaxableWages / periods) * 100) / 100,
    federalTax: Math.round(federalTax * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    localTax: Math.round(localTax * 100) / 100,
    fica: {
      socialSecurity: Math.round(ficaPerPeriod.socialSecurity * 100) / 100,
      medicare: Math.round(ficaPerPeriod.medicare * 100) / 100,
      total: Math.round(ficaPerPeriod.total * 100) / 100,
    },
    postTaxTotal: Math.round(postTaxTotal * 100) / 100,
    netPerPaycheck: Math.round(netPerPaycheck * 100) / 100,
    netMonthly: Math.round(netMonthly * 100) / 100,
    netAnnual: Math.round(netAnnual * 100) / 100,
    annualGross: input.annualGross,
  };
}
