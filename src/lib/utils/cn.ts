import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution
 * This ensures user-provided classes override default component styles
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
