import { forwardRef, useId, type ReactNode } from "react";
import { useTimePickerContext } from "../context";
import { Wheel, type WheelClassNames, type WheelStyles } from "./Wheel";
import { cn, formatNumber } from "../utils";

export type WheelType = "hour" | "minute" | "period";

export interface TimePickerWheelProps {
  /** Which wheel type this is */
  type: WheelType;
  /** Additional className for the wheel container */
  className?: string;
  /** ClassNames for wheel sub-elements */
  classNames?: WheelClassNames;
  /** Styles for wheel sub-elements */
  styles?: WheelStyles;
}

export const TimePickerWheel = forwardRef<HTMLDivElement, TimePickerWheelProps>(
  ({ type, className, classNames, styles, ...props }, ref) => {
    const ctx = useTimePickerContext();
    const wheelId = useId();

    const items: (number | string)[] =
      type === "hour"
        ? ctx.hours
        : type === "minute"
        ? ctx.minutes
        : ["AM", "PM"];

    const value =
      type === "hour"
        ? ctx.hours.indexOf(ctx.hour)
        : type === "minute"
        ? ctx.minutes.indexOf(ctx.minute)
        : ctx.period === "PM"
        ? 1
        : 0;

    const handleChange = (index: number) => {
      if (type === "hour") {
        ctx.setHour(ctx.hours[index]);
      } else if (type === "minute") {
        ctx.setMinute(ctx.minutes[index]);
      } else {
        ctx.setPeriod(index === 1 ? "PM" : "AM");
      }
    };

    const ariaLabel =
      type === "hour"
        ? ctx.locale.hourLabel
        : type === "minute"
        ? ctx.locale.minuteLabel
        : ctx.locale.periodLabel;

    const renderItem = (
      item: number | string,
      _idx1: number,
      isSelected: boolean
    ): ReactNode => {
      const display =
        typeof item === "number" ? formatNumber(item, ctx.usePersian) : item;

      return (
        <span
          data-selected={isSelected || undefined}
          style={{
            fontWeight: isSelected ? 700 : 500,
            transition: "color 0.15s ease",
          }}
        >
          {display}
        </span>
      );
    };

    const getItemLabel = (item: number | string, _idx2: number): string => {
      if (typeof item === "number") {
        return `${item} ${ariaLabel}`;
      }
      return item;
    };

    return (
      <div
        data-time-picker-column=""
        data-type={type}
        className={cn("time-picker-column", className)}
      >
        <Wheel
          ref={ref}
          id={`wheel-${wheelId}`}
          items={items}
          value={value >= 0 ? value : 0}
          onChange={handleChange}
          itemHeight={ctx.itemHeight}
          visibleCount={ctx.visibleCount}
          disabled={ctx.disabled}
          renderItem={renderItem}
          getItemLabel={getItemLabel}
          aria-label={ariaLabel}
          classNames={classNames}
          styles={styles}
          data-wheel-type={type}
          {...props}
        />
      </div>
    );
  }
);

TimePickerWheel.displayName = "TimePickerWheel";
