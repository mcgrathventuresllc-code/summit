import type { FilingStatus } from '../constants/federal-tax';
import {
  FEDERAL_BRACKETS,
  STANDARD_DEDUCTION_2024,
} from '../constants/federal-tax';
import { STATE_TAX_CONFIG } from '../constants/state-tax';

export function calcFederalIncomeTax(
  annualTaxableIncome: number,
  filingStatus: FilingStatus
): number {
  if (annualTaxableIncome <= 0) return 0;
  const deduction = STANDARD_DEDUCTION_2024[filingStatus];
  const taxableAfterDeduction = Math.max(0, annualTaxableIncome - deduction);
  const brackets = FEDERAL_BRACKETS[filingStatus];
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableAfterDeduction <= bracket.min) break;
    const bracketAmount = Math.min(
      taxableAfterDeduction,
      bracket.max === Infinity ? taxableAfterDeduction : bracket.max
    ) - bracket.min;
    tax += bracketAmount * bracket.rate;
  }
  return Math.round(tax * 100) / 100;
}

export function calcStateIncomeTax(
  annualTaxableIncome: number,
  stateCode: string
): number {
  const config = STATE_TAX_CONFIG[stateCode] ?? { type: 'none' as const };
  if (config.type === 'none') return 0;
  if (config.type === 'flat' && config.rate != null) {
    return Math.round(annualTaxableIncome * config.rate * 100) / 100;
  }
  if (config.type === 'progressive' && config.brackets) {
    let tax = 0;
    for (const b of config.brackets) {
      if (annualTaxableIncome <= b.min) break;
      const bracketAmount = Math.min(
        annualTaxableIncome,
        b.max === Infinity ? annualTaxableIncome : b.max
      ) - b.min;
      tax += bracketAmount * b.rate;
    }
    return Math.round(tax * 100) / 100;
  }
  return 0;
}

const SS_WAGE_BASE_2024 = 168_600;
const SS_RATE = 0.062;
const MEDICARE_RATE = 0.0145;
const ADDITIONAL_MEDICARE_RATE = 0.009;
const ADDITIONAL_MEDICARE_THRESHOLD_SINGLE = 200_000;
const ADDITIONAL_MEDICARE_THRESHOLD_MFJ = 250_000;

export function calcFICA(
  annualGross: number,
  filingStatus: FilingStatus
): { socialSecurity: number; medicare: number; total: number } {
  const ssTaxable = Math.min(annualGross, SS_WAGE_BASE_2024);
  const socialSecurity = ssTaxable * SS_RATE;
  const medicareThreshold =
    filingStatus === 'married_jointly'
      ? ADDITIONAL_MEDICARE_THRESHOLD_MFJ
      : ADDITIONAL_MEDICARE_THRESHOLD_SINGLE;
  let medicare = annualGross * MEDICARE_RATE;
  if (annualGross > medicareThreshold) {
    medicare += (annualGross - medicareThreshold) * ADDITIONAL_MEDICARE_RATE;
  }
  return {
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    medicare: Math.round(medicare * 100) / 100,
    total: Math.round((socialSecurity + medicare) * 100) / 100,
  };
}
