import { forwardRef, useMemo, useCallback, type ReactNode } from "react";
import {
  TimePickerContext,
  type TimePickerLocale,
  type NumeralFormat,
} from "../context";
import { cn, parseTime, formatTime, isRTL, usePersianNumerals } from "../utils";
import { HOURS_24, HOURS_12, MINUTES } from "../timeConstants";
import type { Period } from "../utils/formatters";

const LOCALE_STRINGS: Record<string, TimePickerLocale> = {
  en: {
    title: "Select Time",
    hourLabel: "Hour",
    minuteLabel: "Minute",
    periodLabel: "AM/PM",
    confirm: "Confirm",
  },
  fa: {
    title: "انتخاب ساعت",
    hourLabel: "ساعت",
    minuteLabel: "دقیقه",
    periodLabel: "صبح/عصر",
    confirm: "تأیید",
  },
};

export interface TimePickerRootProps {
  /** Current time value (e.g., "14:30" or "02:30 PM") */
  value: string;
  /** Called when time changes */
  onChange: (time: string) => void;
  /** Called when confirm button is clicked */
  onConfirm?: () => void;

  /** Enable 12-hour format with AM/PM */
  is12Hour?: boolean;
  /** Custom hours array (default: 0-23 or 1-12) */
  hours?: number[];
  /** Custom minutes array (default: 0-59) */
  minutes?: number[];
  /** Minute step for auto-generating minutes (e.g., 5, 15, 30) */
  minuteStep?: number;
  /** Numeral format: "en", "fa", or "auto" */
  numerals?: NumeralFormat;
  /** Disable the picker */
  disabled?: boolean;
  /** Custom locale strings */
  localeStrings?: Partial<TimePickerLocale>;

  /** Height of each wheel item in pixels */
  itemHeight?: number;
  /** Number of visible items in wheel */
  visibleCount?: number;

  /** Component children */
  children: ReactNode;
  /** Root className */
  className?: string;
  /** Accessibility label */
  "aria-label"?: string;
}

export const TimePickerRoot = forwardRef<HTMLDivElement, TimePickerRootProps>(
  (
    {
      value,
      onChange,
      onConfirm,
      is12Hour = false,
      hours: customHours,
      minutes: customMinutes,
      minuteStep,
      numerals = "auto",
      disabled = false,
      localeStrings,
      itemHeight = 48,
      visibleCount = 5,
      children,
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    // Calculate Persian and RTL
    const usePersian = usePersianNumerals(numerals);
    const rtl = isRTL(numerals);

    // Parse current value
    const [hour, minute, period] = useMemo(
      () => parseTime(value, is12Hour),
      [value, is12Hour]
    );

    // Generate hours array
    const hours = useMemo(() => {
      if (customHours) return customHours;
      return is12Hour ? HOURS_12 : HOURS_24;
    }, [customHours, is12Hour]);

    // Generate minutes array
    const minutes = useMemo(() => {
      if (customMinutes) return customMinutes;
      if (minuteStep) {
        return Array.from(
          { length: Math.floor(60 / minuteStep) },
          (_, i) => i * minuteStep
        );
      }
      return MINUTES;
    }, [customMinutes, minuteStep]);

    // Build locale
    const locale = useMemo<TimePickerLocale>(
      () => ({
        ...(usePersian ? LOCALE_STRINGS.fa : LOCALE_STRINGS.en),
        ...localeStrings,
      }),
      [usePersian, localeStrings]
    );

    // Create stable setters with useCallback
    const setHour = useCallback(
      (h: number) => {
        onChange(formatTime(h, minute, is12Hour ? period : null));
      },
      [onChange, minute, is12Hour, period]
    );

    const setMinute = useCallback(
      (m: number) => {
        onChange(formatTime(hour, m, is12Hour ? period : null));
      },
      [onChange, hour, is12Hour, period]
    );

    const setPeriod = useCallback(
      (p: Period) => {
        onChange(formatTime(hour, minute, p));
      },
      [onChange, hour, minute]
    );

    // Build context value
    const contextValue = useMemo(
      () => ({
        hour,
        minute,
        period: is12Hour ? period ?? "AM" : null,
        setHour,
        setMinute,
        setPeriod,
        hours,
        minutes,
        is12Hour,
        disabled,
        numerals,
        usePersian,
        rtl,
        onConfirm,
        locale,
        itemHeight,
        visibleCount,
      }),
      [
        hour,
        minute,
        period,
        setHour,
        setMinute,
        setPeriod,
        hours,
        minutes,
        is12Hour,
        disabled,
        numerals,
        usePersian,
        rtl,
        onConfirm,
        locale,
        itemHeight,
        visibleCount,
      ]
    );

    return (
      <TimePickerContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-time-picker=""
          data-rtl={rtl || undefined}
          data-disabled={disabled || undefined}
          dir={rtl ? "rtl" : "ltr"}
          aria-label={ariaLabel}
          className={cn("time-picker", className)}
          {...props}
        >
          {children}
        </div>
      </TimePickerContext.Provider>
    );
  }
);

TimePickerRoot.displayName = "TimePickerRoot";
