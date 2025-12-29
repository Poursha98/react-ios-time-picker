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
  hour: number;
  minute: number;
  period: Period | null;

  setHour: (hour: number) => void;
  setMinute: (minute: number) => void;
  setPeriod: (period: Period) => void;

  hours: number[];
  minutes: number[];
  is12Hour: boolean;
  disabled: boolean;
  numerals: NumeralFormat;
  usePersian: boolean;
  rtl: boolean;

  onConfirm?: () => void;

  locale: TimePickerLocale;

  itemHeight: number;
  visibleCount: number;
  loop: boolean;
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
