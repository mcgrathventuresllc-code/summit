/**
 * State income tax configuration for US states.
 */

export type StateTaxType = 'none' | 'flat' | 'progressive';

export interface StateTaxConfig {
  type: StateTaxType;
  rate?: number;
  brackets?: { min: number; max: number; rate: number }[];
}

export const STATE_TAX_CONFIG: Record<string, StateTaxConfig> = {
  AL: { type: 'progressive', brackets: [{ min: 0, max: 500, rate: 0.02 }, { min: 500, max: 3000, rate: 0.04 }, { min: 3000, max: Infinity, rate: 0.05 }] },
  AK: { type: 'none' },
  AZ: { type: 'flat', rate: 0.025 },
  AR: { type: 'progressive', brackets: [{ min: 0, max: 5000, rate: 0.02 }, { min: 5000, max: 10000, rate: 0.04 }, { min: 10000, max: Infinity, rate: 0.059 }] },
  CA: { type: 'progressive', brackets: [{ min: 0, max: 10736, rate: 0.01 }, { min: 10736, max: 25450, rate: 0.02 }, { min: 25450, max: 40250, rate: 0.04 }, { min: 40250, max: 56200, rate: 0.06 }, { min: 56200, max: 70200, rate: 0.08 }, { min: 70200, max: 368690, rate: 0.093 }, { min: 368690, max: 442500, rate: 0.103 }, { min: 442500, max: 737800, rate: 0.113 }, { min: 737800, max: Infinity, rate: 0.123 }] },
  CO: { type: 'flat', rate: 0.044 },
  CT: { type: 'progressive', brackets: [{ min: 0, max: 10000, rate: 0.03 }, { min: 10000, max: 50000, rate: 0.05 }, { min: 50000, max: 100000, rate: 0.055 }, { min: 100000, max: 200000, rate: 0.06 }, { min: 200000, max: 250000, rate: 0.065 }, { min: 250000, max: 500000, rate: 0.069 }, { min: 500000, max: Infinity, rate: 0.0699 }] },
  DE: { type: 'progressive', brackets: [{ min: 0, max: 2000, rate: 0.022 }, { min: 2000, max: 5000, rate: 0.039 }, { min: 5000, max: 10000, rate: 0.048 }, { min: 10000, max: 20000, rate: 0.052 }, { min: 20000, max: 25000, rate: 0.0555 }, { min: 25000, max: 60000, rate: 0.066 }, { min: 60000, max: Infinity, rate: 0.0685 }] },
  FL: { type: 'none' },
  GA: { type: 'progressive', brackets: [{ min: 0, max: 750, rate: 0.01 }, { min: 750, max: 2250, rate: 0.02 }, { min: 2250, max: 3750, rate: 0.03 }, { min: 3750, max: 5250, rate: 0.04 }, { min: 5250, max: 7000, rate: 0.05 }, { min: 7000, max: Infinity, rate: 0.0559 }] },
  HI: { type: 'progressive', brackets: [{ min: 0, max: 2400, rate: 0.014 }, { min: 2400, max: 4800, rate: 0.032 }, { min: 4800, max: 9600, rate: 0.055 }, { min: 9600, max: 14400, rate: 0.064 }, { min: 14400, max: 19200, rate: 0.068 }, { min: 19200, max: 24000, rate: 0.072 }, { min: 24000, max: 36000, rate: 0.076 }, { min: 36000, max: 48000, rate: 0.079 }, { min: 48000, max: 150000, rate: 0.0825 }, { min: 150000, max: 175000, rate: 0.09 }, { min: 175000, max: 200000, rate: 0.10 }, { min: 200000, max: Infinity, rate: 0.11 }] },
  ID: { type: 'flat', rate: 0.058 },
  IL: { type: 'flat', rate: 0.0495 },
  IN: { type: 'flat', rate: 0.0305 },
  IA: { type: 'progressive', brackets: [{ min: 0, max: 6000, rate: 0.044 }, { min: 6000, max: 30000, rate: 0.0482 }, { min: 30000, max: 75000, rate: 0.057 }, { min: 75000, max: Infinity, rate: 0.06 }] },
  KS: { type: 'progressive', brackets: [{ min: 0, max: 15000, rate: 0.031 }, { min: 15000, max: 30000, rate: 0.0525 }, { min: 30000, max: Infinity, rate: 0.057 }] },
  KY: { type: 'flat', rate: 0.045 },
  LA: { type: 'progressive', brackets: [{ min: 0, max: 12500, rate: 0.0185 }, { min: 12500, max: 50000, rate: 0.035 }, { min: 50000, max: Infinity, rate: 0.0425 }] },
  ME: { type: 'progressive', brackets: [{ min: 0, max: 24500, rate: 0.058 }, { min: 24500, max: 58050, rate: 0.0675 }, { min: 58050, max: Infinity, rate: 0.0715 }] },
  MD: { type: 'progressive', brackets: [{ min: 0, max: 1000, rate: 0.02 }, { min: 1000, max: 2000, rate: 0.03 }, { min: 2000, max: 3000, rate: 0.04 }, { min: 3000, max: 100000, rate: 0.0475 }, { min: 100000, max: 125000, rate: 0.05 }, { min: 125000, max: 150000, rate: 0.0525 }, { min: 150000, max: 250000, rate: 0.055 }, { min: 250000, max: Infinity, rate: 0.0575 }] },
  MA: { type: 'flat', rate: 0.05 },
  MI: { type: 'flat', rate: 0.0405 },
  MN: { type: 'progressive', brackets: [{ min: 0, max: 31690, rate: 0.0535 }, { min: 31690, max: 104090, rate: 0.068 }, { min: 104090, max: Infinity, rate: 0.0985 }] },
  MS: { type: 'progressive', brackets: [{ min: 0, max: 10000, rate: 0.00 }, { min: 10000, max: Infinity, rate: 0.05 }] },
  MO: { type: 'progressive', brackets: [{ min: 0, max: 1160, rate: 0.015 }, { min: 1160, max: 2320, rate: 0.02 }, { min: 2320, max: 3480, rate: 0.025 }, { min: 3480, max: 4640, rate: 0.03 }, { min: 4640, max: 5800, rate: 0.035 }, { min: 5800, max: 6960, rate: 0.04 }, { min: 6960, max: 8700, rate: 0.045 }, { min: 8700, max: Infinity, rate: 0.0545 }] },
  MT: { type: 'progressive', brackets: [{ min: 0, max: 3600, rate: 0.065 }, { min: 3600, max: 6300, rate: 0.0675 }, { min: 6300, max: 9700, rate: 0.068 }, { min: 9700, max: 13000, rate: 0.0685 }, { min: 13000, max: 16800, rate: 0.069 }, { min: 16800, max: 21600, rate: 0.0695 }, { min: 21600, max: Infinity, rate: 0.069 }] },
  NE: { type: 'progressive', brackets: [{ min: 0, max: 3700, rate: 0.0246 }, { min: 3700, max: 22170, rate: 0.0351 }, { min: 22170, max: 35730, rate: 0.0501 }, { min: 35730, max: Infinity, rate: 0.0684 }] },
  NV: { type: 'none' },
  NH: { type: 'none' },
  NJ: { type: 'progressive', brackets: [{ min: 0, max: 20000, rate: 0.014 }, { min: 20000, max: 35000, rate: 0.0175 }, { min: 35000, max: 40000, rate: 0.035 }, { min: 40000, max: 75000, rate: 0.05525 }, { min: 75000, max: 500000, rate: 0.0637 }, { min: 500000, max: 1000000, rate: 0.0897 }, { min: 1000000, max: Infinity, rate: 0.1075 }] },
  NM: { type: 'progressive', brackets: [{ min: 0, max: 5500, rate: 0.017 }, { min: 5500, max: 11000, rate: 0.032 }, { min: 11000, max: 16000, rate: 0.047 }, { min: 16000, max: 210000, rate: 0.049 }, { min: 210000, max: Infinity, rate: 0.059 }] },
  NY: { type: 'progressive', brackets: [{ min: 0, max: 8500, rate: 0.04 }, { min: 8500, max: 11700, rate: 0.045 }, { min: 11700, max: 13900, rate: 0.0525 }, { min: 13900, max: 21400, rate: 0.0585 }, { min: 21400, max: 80650, rate: 0.0625 }, { min: 80650, max: 215400, rate: 0.0685 }, { min: 215400, max: 1077550, rate: 0.0965 }, { min: 1077550, max: Infinity, rate: 0.109 }] },
  NC: { type: 'flat', rate: 0.0475 },
  ND: { type: 'progressive', brackets: [{ min: 0, max: 44225, rate: 0 }, { min: 44225, max: Infinity, rate: 0.02 }] },
  OH: { type: 'progressive', brackets: [{ min: 0, max: 26050, rate: 0 }, { min: 26050, max: 100000, rate: 0.0275 }, { min: 100000, max: Infinity, rate: 0.0375 }] },
  OK: { type: 'progressive', brackets: [{ min: 0, max: 1000, rate: 0.0025 }, { min: 1000, max: 2500, rate: 0.0075 }, { min: 2500, max: 3750, rate: 0.0175 }, { min: 3750, max: 4900, rate: 0.0275 }, { min: 4900, max: 7200, rate: 0.0375 }, { min: 7200, max: Infinity, rate: 0.0475 }] },
  OR: { type: 'progressive', brackets: [{ min: 0, max: 4050, rate: 0.0475 }, { min: 4050, max: 10200, rate: 0.0675 }, { min: 10200, max: 125000, rate: 0.0875 }, { min: 125000, max: Infinity, rate: 0.099 }] },
  PA: { type: 'flat', rate: 0.0307 },
  RI: { type: 'progressive', brackets: [{ min: 0, max: 77450, rate: 0.0375 }, { min: 77450, max: 176050, rate: 0.0475 }, { min: 176050, max: Infinity, rate: 0.0599 }] },
  SC: { type: 'progressive', brackets: [{ min: 0, max: 3410, rate: 0 }, { min: 3410, max: 17060, rate: 0.03 }, { min: 17060, max: Infinity, rate: 0.064 }] },
  SD: { type: 'none' },
  TN: { type: 'none' },
  TX: { type: 'none' },
  UT: { type: 'flat', rate: 0.0465 },
  VT: { type: 'progressive', brackets: [{ min: 0, max: 45010, rate: 0.0335 }, { min: 45010, max: 108850, rate: 0.066 }, { min: 108850, max: 231300, rate: 0.076 }, { min: 231300, max: Infinity, rate: 0.0875 }] },
  VA: { type: 'progressive', brackets: [{ min: 0, max: 3000, rate: 0.02 }, { min: 3000, max: 5000, rate: 0.03 }, { min: 5000, max: 17000, rate: 0.05 }, { min: 17000, max: Infinity, rate: 0.0575 }] },
  WA: { type: 'none' },
  WV: { type: 'progressive', brackets: [{ min: 0, max: 10000, rate: 0.03 }, { min: 10000, max: 25000, rate: 0.04 }, { min: 25000, max: 40000, rate: 0.045 }, { min: 40000, max: 60000, rate: 0.06 }, { min: 60000, max: Infinity, rate: 0.065 }] },
  WI: { type: 'progressive', brackets: [{ min: 0, max: 14010, rate: 0.035 }, { min: 14010, max: 28020, rate: 0.044 }, { min: 28020, max: 308070, rate: 0.0535 }, { min: 308070, max: Infinity, rate: 0.0765 }] },
  WY: { type: 'none' },
  DC: { type: 'progressive', brackets: [{ min: 0, max: 10000, rate: 0.04 }, { min: 10000, max: 40000, rate: 0.06 }, { min: 40000, max: 60000, rate: 0.065 }, { min: 60000, max: 250000, rate: 0.085 }, { min: 250000, max: 500000, rate: 0.0925 }, { min: 500000, max: 1000000, rate: 0.0975 }, { min: 1000000, max: Infinity, rate: 0.1075 }] },
};

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
] as const;
