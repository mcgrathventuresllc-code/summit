/**
 * Federal income tax brackets for 2024 (simplified for estimation).
 */

export type FilingStatus = 'single' | 'married_jointly';

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

export const FEDERAL_BRACKETS: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 11_600, rate: 0.10 },
    { min: 11_600, max: 47_150, rate: 0.12 },
    { min: 47_150, max: 100_525, rate: 0.22 },
    { min: 100_525, max: 191_950, rate: 0.24 },
    { min: 191_950, max: 243_725, rate: 0.32 },
    { min: 243_725, max: 609_350, rate: 0.35 },
    { min: 609_350, max: Infinity, rate: 0.37 },
  ],
  married_jointly: [
    { min: 0, max: 23_200, rate: 0.10 },
    { min: 23_200, max: 94_300, rate: 0.12 },
    { min: 94_300, max: 201_050, rate: 0.22 },
    { min: 201_050, max: 383_900, rate: 0.24 },
    { min: 383_900, max: 487_450, rate: 0.32 },
    { min: 487_450, max: 731_200, rate: 0.35 },
    { min: 731_200, max: Infinity, rate: 0.37 },
  ],
};

export const STANDARD_DEDUCTION_2024: Record<FilingStatus, number> = {
  single: 14_600,
  married_jointly: 29_200,
};
