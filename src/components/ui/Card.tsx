"use client";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-zinc-900/50 border border-zinc-800 p-6 ${className}`}
    >
      {children}
    </div>
  );
}
