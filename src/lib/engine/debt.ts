export type DebtType = 'credit_card' | 'student_loan' | 'other';

export interface Debt {
  id: string;
  type: DebtType;
  balance: number;
  apr: number;
  minimumPayment: number;
}

export function totalMinimumPayments(debts: Debt[]): number {
  return debts.reduce((sum, d) => sum + d.minimumPayment, 0);
}

export function avalancheOrder(debts: Debt[]): Debt[] {
  return [...debts].sort((a, b) => b.apr - a.apr);
}

export function snowballOrder(debts: Debt[]): Debt[] {
  return [...debts].sort((a, b) => a.balance - b.balance);
}

export function estimatePayoffMonths(
  balance: number,
  apr: number,
  monthlyPayment: number
): number {
  if (monthlyPayment <= 0 || balance <= 0) return 0;
  const monthlyRate = apr / 100 / 12;
  let b = balance;
  let months = 0;
  const maxMonths = 600;
  while (b > 0 && months < maxMonths) {
    b = b * (1 + monthlyRate) - monthlyPayment;
    months++;
  }
  return months;
}

export function recommendExtraPayment(
  freeCashFlow: number,
  totalDebt: number,
  totalMinimums: number
): number {
  if (freeCashFlow <= 0) return 0;
  const maxReasonable = Math.min(freeCashFlow * 0.5, totalDebt / 24);
  return Math.round(Math.min(maxReasonable, freeCashFlow - 200) * 100) / 100;
}
