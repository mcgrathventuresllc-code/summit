"use client";

export function MountainBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {/* Base gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950" />
      
      {/* Animated gradient overlay - subtle emerald glow */}
      <div 
        className="absolute inset-0 mountain-glow"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 20% 100%, rgba(16, 185, 129, 0.04) 0%, transparent 40%),
            radial-gradient(ellipse 50% 30% at 80% 100%, rgba(16, 185, 129, 0.05) 0%, transparent 35%)
          `,
        }}
      />

      {/* Mountain silhouettes - SVG */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full h-[60%] min-h-[320px]"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id="mountain-far" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27272a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="mountain-mid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3f3f46" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#27272a" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="mountain-near" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#52525b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#27272a" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="mountain-peak" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#27272a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Far range */}
        <g className="mountain-float-slow">
          <path
            d="M-100 400 L200 250 L450 320 L700 200 L900 280 L1200 180 L1300 400 Z"
            fill="url(#mountain-far)"
          />
        </g>
        
        {/* Mid range */}
        <g className="mountain-float-mid">
          <path
            d="M-50 400 L150 220 L400 300 L550 180 L750 260 L950 150 L1100 280 L1250 400 Z"
            fill="url(#mountain-mid)"
          />
        </g>
        
        {/* Near range */}
        <g className="mountain-float-near">
          <path
            d="M0 400 L100 280 L300 200 L500 260 L650 150 L850 220 L1000 120 L1150 240 L1200 400 Z"
            fill="url(#mountain-near)"
          />
        </g>
        
        {/* Central peak - emerald accent */}
        <g className="mountain-float-peak">
          <path
            d="M400 400 L550 180 L700 280 L850 120 L1000 250 L1100 400 Z"
            fill="url(#mountain-peak)"
          />
        </g>
      </svg>

      {/* Subtle mist at base */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-950/70 to-transparent mist-drift"
      />
    </div>
  );
}
