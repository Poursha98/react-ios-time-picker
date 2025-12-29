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
      className={cn(
        "flex items-center justify-center text-2xl font-bold text-blue-500 px-2",
        "h-[calc(var(--time-picker-visible-count,5)*var(--time-picker-item-height,48px))]",
        className
      )}
      {...props}
    >
      {children ?? ":"}
    </Comp>
  );
});

TimePickerSeparator.displayName = "TimePickerSeparator";
