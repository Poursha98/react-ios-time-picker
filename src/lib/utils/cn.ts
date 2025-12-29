/**
 * Utility for merging class names
 * Similar to clsx/classnames but zero-dependency
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
