export type BudgetMode = 'conservative' | 'balanced' | 'lifestyle';

export interface BudgetRecommendations {
  rent: { min: number; max: number; recommended: number; gross30: number };
  groceries: { min: number; max: number; recommended: number };
  lifestyle: { min: number; max: number; recommended: number };
  transportation: { maxAllIn: number; maxCarPayment: number };
  savings: { emergencyTarget: number; monthlyTarget: number };
  utilities: { defaultEstimate: number };
}

export function computeBudgetRecommendations(
  netMonthly: number,
  mode: BudgetMode,
  essentialsMonthly: number = 0
): BudgetRecommendations {
  const rentPct =
    mode === 'conservative' ? 0.2 : mode === 'balanced' ? 0.25 : 0.3;
  const groceriesPct = mode === 'conservative' ? 0.08 : mode === 'balanced' ? 0.1 : 0.12;
  const lifestylePct =
    mode === 'conservative' ? 0.06 : mode === 'balanced' ? 0.1 : 0.14;
  const transportPct =
    mode === 'conservative' ? 0.1 : mode === 'balanced' ? 0.12 : 0.15;

  const rentRecommended = netMonthly * rentPct;
  const rentMin = netMonthly * 0.2;
  const rentMax = netMonthly * 0.3;
  const gross30 = (netMonthly / 0.7) * 0.3;

  const groceriesRecommended = netMonthly * groceriesPct;
  const groceriesMin = netMonthly * 0.08;
  const groceriesMax = netMonthly * 0.12;

  const lifestyleRecommended = netMonthly * lifestylePct;
  const lifestyleMin = netMonthly * 0.06;
  const lifestyleMax = netMonthly * 0.14;

  const transportMaxAllIn = netMonthly * transportPct;
  const transportMaxCarPayment = transportMaxAllIn * 0.7;

  const emergencyMonths = mode === 'conservative' ? 6 : mode === 'balanced' ? 4 : 3;
  const emergencyTarget = essentialsMonthly > 0
    ? essentialsMonthly * emergencyMonths
    : (rentRecommended + groceriesRecommended + 200) * emergencyMonths;
  const savingsMonthlyTarget = emergencyTarget / 12;

  const utilitiesDefault = 250;

  return {
    rent: {
      min: Math.round(rentMin * 100) / 100,
      max: Math.round(rentMax * 100) / 100,
      recommended: Math.round(rentRecommended * 100) / 100,
      gross30: Math.round(gross30 * 100) / 100,
    },
    groceries: {
      min: Math.round(groceriesMin * 100) / 100,
      max: Math.round(groceriesMax * 100) / 100,
      recommended: Math.round(groceriesRecommended * 100) / 100,
    },
    lifestyle: {
      min: Math.round(lifestyleMin * 100) / 100,
      max: Math.round(lifestyleMax * 100) / 100,
      recommended: Math.round(lifestyleRecommended * 100) / 100,
    },
    transportation: {
      maxAllIn: Math.round(transportMaxAllIn * 100) / 100,
      maxCarPayment: Math.round(transportMaxCarPayment * 100) / 100,
    },
    savings: {
      emergencyTarget: Math.round(emergencyTarget * 100) / 100,
      monthlyTarget: Math.round(savingsMonthlyTarget * 100) / 100,
    },
    utilities: { defaultEstimate: utilitiesDefault },
  };
}

export function maxCarPriceFromPayment(
  maxMonthlyPayment: number,
  aprPercent: number,
  termMonths: number,
  downPayment: number = 0
): number {
  const r = aprPercent / 100 / 12;
  if (r === 0) return maxMonthlyPayment * termMonths + downPayment;
  const pv = maxMonthlyPayment * (1 - Math.pow(1 + r, -termMonths)) / r;
  return Math.round((pv + downPayment) * 100) / 100;
}

export function monthlyPaymentFromPrice(
  principal: number,
  aprPercent: number,
  termMonths: number
): number {
  const r = aprPercent / 100 / 12;
  if (r === 0) return principal / termMonths;
  const pmt =
    (principal * r * Math.pow(1 + r, termMonths)) /
    (Math.pow(1 + r, termMonths) - 1);
  return Math.round(pmt * 100) / 100;
}
