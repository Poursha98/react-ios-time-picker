import { forwardRef, type ReactNode, type CSSProperties } from "react";
import { cn, Slot } from "../utils";

export interface TimePickerWheelsProps {
  /** Wheel components */
  children: ReactNode;
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Render as child element */
  asChild?: boolean;
}

export const TimePickerWheels = forwardRef<
  HTMLDivElement,
  TimePickerWheelsProps
>(({ children, className, style, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={ref}
      data-time-picker-wheels=""
      className={cn("time-picker-wheels", className)}
      // Always LTR for wheels to keep hour:minute order consistent
      style={{ direction: "ltr", ...style }}
      {...props}
    >
      {children}
    </Comp>
  );
});

TimePickerWheels.displayName = "TimePickerWheels";
