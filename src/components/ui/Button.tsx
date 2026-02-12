"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", fullWidth, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none tap-target";
    const variants = {
      primary: "bg-emerald-500 text-zinc-900 hover:bg-emerald-400",
      secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
      ghost: "bg-transparent hover:bg-zinc-800/50",
      outline: "border-2 border-zinc-600 hover:border-emerald-500 hover:text-emerald-500",
    };
    const sizes = {
      sm: "h-10 px-4 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg",
    };
    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
