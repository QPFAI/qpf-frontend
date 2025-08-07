// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** Shorthand for combining class names with Tailwind merge */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
