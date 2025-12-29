import { type ClassValue, clsx } from "clsx";

/**
 * Utility for combining class names
 * Uses clsx for conditional classes with standard CSS class precedence
 * User-provided classes override default component styles through CSS specificity
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
