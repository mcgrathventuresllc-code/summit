/**
 * PR utilities: e1RM calculation
 */

export function calcE1RM(weightKg: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weightKg;
  return weightKg / (1.0278 - 0.0278 * reps);
}

export function weightFromE1RM(e1rm: number, targetReps: number): number {
  if (targetReps <= 0) return 0;
  if (targetReps === 1) return e1rm;
  return e1rm * (1.0278 - 0.0278 * targetReps);
}

export function paceMinPerKm(timeSeconds: number, distanceKm: number): number {
  if (distanceKm <= 0) return 0;
  return (timeSeconds / 60) / distanceKm;
}

export function parseTimeToSeconds(str: string): number {
  const parts = str.trim().split(/[:\\.]/).map(Number);
  if (parts.length === 1) return parts[0] * 60;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}
