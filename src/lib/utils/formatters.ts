/**
 * Time formatting utilities
 */

export type Period = "AM" | "PM";

/**
 * Parse a time string into components
 * Supports both 24-hour ("14:30") and 12-hour ("02:30 PM") formats
 */
export function parseTime(
  value: string,
  is12Hour: boolean = false
): [hour: number, minute: number, period: Period | null] {
  if (!value) {
    return [0, 0, is12Hour ? "AM" : null];
  }

  const upperValue = value.toUpperCase();
  const hasPeriod = upperValue.includes("AM") || upperValue.includes("PM");

  if (hasPeriod || is12Hour) {
    // 12-hour format: "02:30 PM" or "2:30PM"
    const period: Period = upperValue.includes("PM") ? "PM" : "AM";
    const timePart = upperValue.replace(/\s*(AM|PM)\s*/i, "").trim();
    const [h, m] = timePart.split(":").map(Number);

    return [
      isNaN(h) ? 12 : Math.min(12, Math.max(1, h)),
      isNaN(m) ? 0 : m,
      period,
    ];
  }

  // 24-hour format: "14:30"
  const [h, m] = value.split(":").map(Number);
  return [isNaN(h) ? 0 : h, isNaN(m) ? 0 : m, null];
}

/**
 * Format time components into a string
 */
export function formatTime(
  hour: number,
  minute: number,
  period: Period | null
): string {
  const h = hour.toString().padStart(2, "0");
  const m = minute.toString().padStart(2, "0");

  if (period) {
    return `${h}:${m} ${period}`;
  }
  return `${h}:${m}`;
}

/**
 * Convert 24-hour to 12-hour format
 */
export function to12Hour(hour24: number): [hour12: number, period: Period] {
  if (hour24 === 0) return [12, "AM"];
  if (hour24 === 12) return [12, "PM"];
  if (hour24 > 12) return [hour24 - 12, "PM"];
  return [hour24, "AM"];
}

/**
 * Convert 12-hour to 24-hour format
 */
export function to24Hour(hour12: number, period: Period): number {
  if (period === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
}

/**
 * Format a number with Persian or English numerals
 */
export function formatNumber(
  n: number,
  usePersian: boolean,
  pad: boolean = true
): string {
  const padded = pad ? n.toString().padStart(2, "0") : n.toString();
  if (usePersian) {
    return padded.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
  }
  return padded;
}

/**
 * Detect browser locale
 */
export function detectLocale(): string {
  if (typeof navigator !== "undefined") {
    const lang =
      navigator.language ||
      (navigator as Navigator & { userLanguage?: string }).userLanguage ||
      "en";
    return lang.split("-")[0].toLowerCase();
  }
  return "en";
}

/**
 * Check if RTL should be used
 */
export function isRTL(
  numerals: "en" | "fa" | "auto",
  browserLocale?: string
): boolean {
  const locale = browserLocale ?? detectLocale();
  return (
    numerals === "fa" ||
    (numerals === "auto" && (locale === "fa" || locale === "ar"))
  );
}

/**
 * Check if Persian numerals should be used
 */
export function usePersianNumerals(
  numerals: "en" | "fa" | "auto",
  browserLocale?: string
): boolean {
  return isRTL(numerals, browserLocale);
}
