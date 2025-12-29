import { createContext, useContext } from "react";
import type { Period } from "../utils/formatters";

export interface TimePickerLocale {
  title: string;
  hourLabel: string;
  minuteLabel: string;
  periodLabel: string;
  confirm: string;
}

export type NumeralFormat = "en" | "fa" | "auto";

export interface TimePickerContextValue {
  // Current values
  hour: number;
  minute: number;
  period: Period | null;

  // Setters
  setHour: (hour: number) => void;
  setMinute: (minute: number) => void;
  setPeriod: (period: Period) => void;

  // Configuration
  hours: number[];
  minutes: number[];
  is12Hour: boolean;
  disabled: boolean;
  numerals: NumeralFormat;
  usePersian: boolean;
  rtl: boolean;

  // Callbacks
  onConfirm?: () => void;

  // Locale strings
  locale: TimePickerLocale;

  // Item dimensions
  itemHeight: number;
  visibleCount: number;
}

export const TimePickerContext = createContext<TimePickerContextValue | null>(
  null
);

/**
 * Hook to access TimePicker context
 * Throws if used outside of TimePickerRoot
 */
export function useTimePickerContext(): TimePickerContextValue {
  const context = useContext(TimePickerContext);

  if (!context) {
    throw new Error(
      "TimePicker compound components must be used within <TimePickerRoot>. " +
        "Make sure to wrap your component tree with <TimePickerRoot>."
    );
  }

  return context;
}
