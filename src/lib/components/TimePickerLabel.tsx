import { forwardRef, type ReactNode, type CSSProperties } from "react";
import { useTimePickerContext } from "../context";
import { cn, Slot } from "../utils";

export interface TimePickerLabelProps {
  /** Which wheel this label is for */
  type: "hour" | "minute" | "period";
  /** Custom label content */
  children?: ReactNode;
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Render as child element */
  asChild?: boolean;
}

export const TimePickerLabel = forwardRef<
  HTMLSpanElement,
  TimePickerLabelProps
>(({ type, children, className, style, asChild, ...props }, ref) => {
  const { locale } = useTimePickerContext();

  const defaultLabel =
    type === "hour"
      ? locale.hourLabel
      : type === "minute"
      ? locale.minuteLabel
      : locale.periodLabel;

  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      data-time-picker-label=""
      data-type={type}
      className={cn("text-sm font-medium text-gray-500 mb-2", className)}
      style={style}
      {...props}
    >
      {children ?? defaultLabel}
    </Comp>
  );
});

TimePickerLabel.displayName = "TimePickerLabel";
