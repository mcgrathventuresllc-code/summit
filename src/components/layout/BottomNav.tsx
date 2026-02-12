"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Today", icon: "⛰️" },
  { href: "/plan", label: "Fitness", icon: "💪" },
  { href: "/crew", label: "Crew", icon: "👥" },
  { href: "/read", label: "Read", icon: "📖" },
  { href: "/recover", label: "Wind Down", icon: "🌙" },
  { href: "/budget", label: "Budget", icon: "💰" },
  { href: "/profile", label: "Profile", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 safe-bottom pt-2 pl-[max(env(safe-area-inset-left),8px)] pr-[max(env(safe-area-inset-right),8px)]"
      aria-label="Main navigation"
    >
      {navItems.map(({ href, label, icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center flex-1 min-w-0 py-2 px-1 tap-target transition-colors duration-200 active:opacity-80 ${
              isActive ? "text-emerald-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="text-lg sm:text-xl shrink-0" aria-hidden>
              {icon}
            </span>
            <span className="text-[10px] sm:text-xs font-medium mt-0.5 truncate w-full text-center">{label}</span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
