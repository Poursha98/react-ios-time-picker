import { useMemo, type CSSProperties, type ReactNode } from "react";
import { Wheel, type WheelClassNames, type WheelStyles } from "./Wheel";
import { HOURS_24, MINUTES } from "./timeConstants";

export interface TimePickerClassNames {
  root?: string;
  title?: string;
  wheelsContainer?: string;
  wheelColumn?: string;
  wheelLabel?: string;
  separator?: string;
  confirmButton?: string;
  wheel?: WheelClassNames;
}

export interface TimePickerStyles {
  root?: CSSProperties;
  title?: CSSProperties;
  wheelsContainer?: CSSProperties;
  wheelColumn?: CSSProperties;
  wheelLabel?: CSSProperties;
  separator?: CSSProperties;
  confirmButton?: CSSProperties;
  wheel?: WheelStyles;
}

export interface TimePickerLocale {
  title?: string;
  hourLabel?: string;
  minuteLabel?: string;
  confirm?: string;
}

export type NumeralFormat = "en" | "fa" | "auto";

const LOCALE_STRINGS: Record<string, TimePickerLocale> = {
  en: {
    title: "Select Time",
    hourLabel: "Hour",
    minuteLabel: "Minute",
    confirm: "Confirm",
  },
  fa: {
    title: "انتخاب ساعت",
    hourLabel: "ساعت",
    minuteLabel: "دقیقه",
    confirm: "تأیید",
  },
};

function detectLocale(): string {
  if (typeof navigator !== "undefined") {
    const lang =
      navigator.language ||
      (navigator as Navigator & { userLanguage?: string }).userLanguage ||
      "en";
    return lang.split("-")[0].toLowerCase();
  }
  return "en";
}

function formatNumber(
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

function isRTL(usePersian: boolean): boolean {
  return usePersian;
}

export interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  onConfirm?: () => void;
  hours?: number[];
  minutes?: number[];
  localeStrings?: TimePickerLocale;
  /**
   * Controls both numeral format AND text language:
   * - "en": English numerals (0-9) and English text
   * - "fa": Persian numerals (۰-۹) and Persian text
   * - "auto": Auto-detect from browser locale (default)
   */
  numerals?: NumeralFormat;
  showTitle?: boolean;
  showLabels?: boolean;
  showConfirmButton?: boolean;
  itemHeight?: number;
  visibleCount?: number;
  classNames?: TimePickerClassNames;
  styles?: TimePickerStyles;
  disabled?: boolean;
}
export function TimePicker({
  value,
  onChange,
  onConfirm,
  hours = HOURS_24,
  minutes = MINUTES,
  localeStrings,
  numerals = "auto",
  showTitle = true,
  showLabels = true,
  showConfirmButton = true,
  itemHeight = 48,
  visibleCount = 5,
  classNames = {},
  styles = {},
  disabled = false,
}: TimePickerProps) {
  const browserLocale = detectLocale();
  const usePersian =
    numerals === "fa" ||
    (numerals === "auto" && (browserLocale === "fa" || browserLocale === "ar"));
  const rtl = isRTL(usePersian);

  const t: TimePickerLocale = useMemo(
    () => ({
      ...(usePersian ? LOCALE_STRINGS.fa : LOCALE_STRINGS.en),
      ...(localeStrings || {}),
    }),
    [usePersian, localeStrings]
  );

  const [currentHour, currentMinute] = useMemo(() => {
    if (!value) return [hours[0], minutes[0]];
    const [h, m] = value.split(":").map(Number);
    return [
      hours.includes(h) ? h : hours[0],
      minutes.includes(m) ? m : minutes[0],
    ];
  }, [value, hours, minutes]);

  const hourIndex = hours.indexOf(currentHour);
  const minuteIndex = minutes.indexOf(currentMinute);

  const handleHourChange = (index: number) => {
    const hour = hours[index];
    onChange(
      `${hour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleMinuteChange = (index: number) => {
    const minute = minutes[index];
    onChange(
      `${currentHour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );
  };

  const renderItem = (
    item: number,
    _index: number,
    isSelected: boolean
  ): ReactNode => (
    <span
      style={{
        fontSize: "1.25rem",
        fontWeight: isSelected ? 700 : 500,
        color: isSelected
          ? "var(--time-picker-primary, #3b82f6)"
          : "var(--time-picker-text-secondary, #9ca3af)",
        transition: "color 0.15s ease",
      }}
    >
      {formatNumber(item, usePersian)}
    </span>
  );

  return (
    <div
      className={classNames.root}
      style={{
        display: "flex",
        flexDirection: "column",
        ...styles.root,
      }}
      dir={rtl ? "rtl" : "ltr"}
    >
      {showTitle && (
        <h2
          className={classNames.title}
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            textAlign: "center",
            marginBottom: "1rem",
            color: "var(--time-picker-text-primary, #1f2937)",
            ...styles.title,
          }}
        >
          {t.title}
        </h2>
      )}
      <div
        className={classNames.wheelsContainer}
        style={{
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          direction: "ltr",
          ...styles.wheelsContainer,
        }}
      >
        <div
          className={classNames.wheelColumn}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 140,
            ...styles.wheelColumn,
          }}
        >
          {showLabels && (
            <span
              className={classNames.wheelLabel}
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--time-picker-text-secondary, #9ca3af)",
                marginBottom: "0.5rem",
                ...styles.wheelLabel,
              }}
            >
              {t.hourLabel}
            </span>
          )}
          <Wheel
            items={hours}
            value={hourIndex >= 0 ? hourIndex : 0}
            onChange={handleHourChange}
            itemHeight={itemHeight}
            visibleCount={visibleCount}
            width="100%"
            disabled={disabled}
            aria-label={t.hourLabel}
            getItemLabel={(item) => `${item} ${t.hourLabel}`}
            renderItem={renderItem}
            classNames={classNames.wheel}
            styles={styles.wheel}
          />
        </div>
        <div
          className={classNames.separator}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "var(--time-picker-primary, #3b82f6)",
            padding: "0 0.5rem",
            paddingTop: showLabels ? "1.75rem" : 0,
            ...styles.separator,
          }}
        >
          :
        </div>
        <div
          className={classNames.wheelColumn}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 140,
            ...styles.wheelColumn,
          }}
        >
          {showLabels && (
            <span
              className={classNames.wheelLabel}
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--time-picker-text-secondary, #9ca3af)",
                marginBottom: "0.5rem",
                ...styles.wheelLabel,
              }}
            >
              {t.minuteLabel}
            </span>
          )}
          <Wheel
            items={minutes}
            value={minuteIndex >= 0 ? minuteIndex : 0}
            onChange={handleMinuteChange}
            itemHeight={itemHeight}
            visibleCount={visibleCount}
            width="100%"
            disabled={disabled}
            aria-label={t.minuteLabel}
            getItemLabel={(item) => `${item} ${t.minuteLabel}`}
            renderItem={renderItem}
            classNames={classNames.wheel}
            styles={styles.wheel}
          />
        </div>
      </div>
      {showConfirmButton && (
        <button
          type="button"
          className={classNames.confirmButton}
          onClick={onConfirm}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "0.875rem 1.5rem",
            marginTop: "1.5rem",
            background: "var(--time-picker-primary, #3b82f6)",
            color: "white",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            borderRadius: 14,
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.5 : 1,
            transition: "transform 0.1s ease, background-color 0.2s ease",
            ...styles.confirmButton,
          }}
        >
          {t.confirm}
        </button>
      )}
    </div>
  );
}
