import { forwardRef, type ReactNode, type CSSProperties } from "react";
import { cn, Slot } from "../utils";
import { useTimePickerContext } from "../context";

export interface TimePickerWheelsProps {
  /** Wheel components */
  children: ReactNode;
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Render as child element */
  asChild?: boolean;
  /** Hide the unified selection indicator */
  hideIndicator?: boolean;
}

export const TimePickerWheels = forwardRef<
  HTMLDivElement,
  TimePickerWheelsProps
>(
  (
    { children, className, style, asChild, hideIndicator = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    const context = useTimePickerContext();
    const itemHeight = context?.itemHeight ?? 48;
    const visibleCount = context?.visibleCount ?? 5;

    // Calculate the position for the unified indicator (from bottom of wheel)
    const containerHeight = visibleCount * itemHeight;
    const indicatorBottom = (containerHeight - itemHeight) / 2;

    return (
      <Comp
        ref={ref}
        data-time-picker-wheels=""
        className={cn("time-picker-wheels", className)}
        // Always LTR for wheels to keep hour:minute order consistent
        style={{
          direction: "ltr",
          position: "relative",
          ...style,
        }}
        {...props}
      >
        {/* Unified iOS-style selection indicator */}
        {!hideIndicator && (
          <div
            className="time-picker-indicator"
            data-time-picker-indicator=""
            style={{
              position: "absolute",
              bottom: indicatorBottom,
              left: 0,
              right: 0,
              height: itemHeight,
              pointerEvents: "none",
              zIndex: 1,
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </Comp>
    );
  }
);

TimePickerWheels.displayName = "TimePickerWheels";
