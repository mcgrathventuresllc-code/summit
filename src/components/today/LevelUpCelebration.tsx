"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getLevelName } from "@/lib/gamification";

interface LevelUpCelebrationProps {
  level: number;
  onDismiss: () => void;
}

const EMOJIS = ["🎉", "⛰️", "🌟", "🏆", "🔥"];

export function LevelUpCelebration({ level, onDismiss }: LevelUpCelebrationProps) {
  const levelName = getLevelName(level);

  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onDismiss}
    >
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 40 }}
        animate={{
          scale: 1,
          opacity: 1,
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 25 },
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative rounded-3xl bg-zinc-900 border-2 border-emerald-500/50 p-8 shadow-2xl shadow-emerald-500/20 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl mb-4"
        >
          {EMOJIS[(level - 1) % EMOJIS.length]}
        </motion.div>
        <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">
          Level up!
        </p>
        <p className="text-3xl font-bold text-zinc-100 mb-1">{levelName}</p>
        <p className="text-zinc-500 text-sm">Level {level}</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-zinc-400 text-xs mt-4"
        >
          Tap to dismiss
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
