"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  min: number;
  max: number;
  step?: number;
  value?: number;
  onValueChange?: (value: number) => void;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ min, max, step = 1, value, onValueChange, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={(e) => onValueChange?.(Number(e.target.value))}
        className={`h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:border-0 ${className}`}
        {...props}
      />
    );
  }
);

Slider.displayName = "Slider";

export { Slider };
