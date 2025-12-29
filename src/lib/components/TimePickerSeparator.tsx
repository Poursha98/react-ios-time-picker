import { forwardRef, type ReactNode, type CSSProperties } from "react";
import { useTimePickerContext } from "../context";
import { cn, Slot } from "../utils";

export interface TimePickerSeparatorProps {
  /** Custom separator content (default: ":") */
  children?: ReactNode;
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Render as child element */
  asChild?: boolean;
}

export const TimePickerSeparator = forwardRef<
  HTMLSpanElement,
  TimePickerSeparatorProps
>(({ children, className, style, asChild, ...props }, ref) => {
  useTimePickerContext(); // Ensure we're inside a Root

  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      data-time-picker-separator=""
      aria-hidden="true"
      style={style}
      className={cn("time-picker-separator", className)}
      {...props}
    >
      {children ?? ":"}
    </Comp>
  );
});

TimePickerSeparator.displayName = "TimePickerSeparator";
