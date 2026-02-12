"use client";

export function Progress({
  value,
  max = 100,
  className = "",
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={`h-1.5 rounded-full bg-zinc-800 overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
