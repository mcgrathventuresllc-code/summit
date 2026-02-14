"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { xpProgressInLevel, getLevelName } from "@/lib/gamification";

interface MountainLevelProgressProps {
  totalXp: number;
}

// Trail path — zigzags up the mountain
const TRAIL_PATH =
  "M60,405 C140,365 210,360 280,330 C340,310 410,300 470,275 C540,240 600,250 660,215 C720,190 790,200 845,175 C900,150 940,165 960,160";

// 7 milestone nodes — we map level 1–7 to these
const NODE_COUNT = 7;

export function MountainLevelProgress({ totalXp }: MountainLevelProgressProps) {
  const { current, required, level } = xpProgressInLevel(totalXp);
  const progress = required > 0 ? Math.min(1, current / required) : 1;
  const levelName = getLevelName(level);

  const trailRef = useRef<SVGPathElement>(null);
  const [trailLength, setTrailLength] = useState(0);
  const [nodePoints, setNodePoints] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const path = trailRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    setTrailLength(len);
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const t = i / (NODE_COUNT - 1);
      const p = path.getPointAtLength(len * t);
      pts.push({ x: p.x, y: p.y });
    }
    setNodePoints(pts);
  }, []);

  // Map level to trail position (0–1). Level 1 = 0, Level 7 = 1, Level 8+ = 1
  const levelIndex = Math.min(level - 1, NODE_COUNT - 1);
  const trailProgress =
    level <= NODE_COUNT
      ? (levelIndex + progress) / (NODE_COUNT - 1)
      : 1;
  const progressLen = trailLength * Math.min(1, trailProgress);

  const levelNames = Array.from({ length: NODE_COUNT }, (_, i) =>
    getLevelName(i + 1)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden bg-zinc-900/90 border border-zinc-700/50"
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
          <div>
            <p className="text-xl sm:text-lg font-bold text-zinc-100">{levelName}</p>
            <p className="text-base sm:text-sm text-zinc-500">
              Level {level} • {current} / {required} XP
            </p>
          </div>
          <div className="flex gap-3 sm:gap-2 flex-wrap text-sm sm:text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400/90 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
              Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-300/95 shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
              Current
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              Locked
            </span>
          </div>
        </div>

        <div
          className="relative w-full rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/8] min-h-[220px] sm:min-h-0"
        >
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full block"
            role="img"
            aria-label="Mountain level progress"
          >
            <defs>
              <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#18181b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="mount" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#27272a" />
                <stop offset="100%" stopColor="#18181b" />
              </linearGradient>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.75 0"
                  result="colored"
                />
                <feMerge>
                  <feMergeNode in="colored" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <rect width="1000" height="500" fill="url(#sky)" />

            <path
              id="mountain"
              d="M0,420 L90,360 L160,370 L230,330 L300,345 L380,285 L450,300 L520,250 L590,265 L660,210 L720,240 L790,180 L860,210 L930,165 L1000,190 L1000,500 L0,500 Z"
              fill="url(#mount)"
            />

            {/* Trail path */}
            <path
              ref={trailRef}
              d={TRAIL_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Completed trail (fills as you progress) */}
            <path
              d={TRAIL_PATH}
              fill="none"
              stroke="rgba(56,189,248,0.9)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#softGlow)"
              style={{
                strokeDasharray: `${progressLen} ${Math.max(0, trailLength - progressLen)}`,
                strokeDashoffset: 0,
              }}
            />

            {/* Nodes */}
            {nodePoints.map((p, i) => {
              const nodeLevel = i + 1;
              const status =
                level > nodeLevel
                  ? "done"
                  : level === nodeLevel
                    ? "current"
                    : "locked";

              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={status === "current" ? 13 : 11}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="2.5"
                    fill={
                      status === "done"
                        ? "rgba(56,189,248,0.95)"
                        : status === "current"
                          ? "rgba(253,224,71,0.98)"
                          : "rgba(255,255,255,0.15)"
                    }
                    filter={status !== "locked" ? "url(#nodeGlow)" : undefined}
                  />
                  <text
                    x={p.x + 14}
                    y={p.y - (i % 2 === 0 ? 10 : -18)}
                    fontSize={status === "current" ? 20 : 17}
                    fontWeight={700}
                    fill="rgba(255,255,255,0.92)"
                    style={{
                      paintOrder: "stroke",
                      stroke: "rgba(0,0,0,0.4)",
                      strokeWidth: 3,
                      strokeLinejoin: "round",
                    }}
                  >
                    {levelNames[i]}
                  </text>
                </g>
              );
            })}

            {/* Summit flag */}
            <g opacity="0.95">
              <line
                x1="958"
                y1="110"
                x2="958"
                y2="160"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="4"
              />
              <path
                d="M958,112 L990,122 L958,134 Z"
                fill="rgba(253,224,71,0.95)"
                filter="url(#softGlow)"
              />
            </g>
          </svg>
        </div>

        <p className="text-sm sm:text-xs text-zinc-500 mt-2">{totalXp} XP total</p>
      </div>
    </motion.div>
  );
}
