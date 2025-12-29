import { forwardRef, type ReactNode, type CSSProperties } from "react";
import { useTimePickerContext } from "../context";
import { cn, Slot } from "../utils";

export interface TimePickerTitleProps {
  /** Custom title content (default: locale title) */
  children?: ReactNode;
  /** Additional className */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Render as child element instead of h2 */
  asChild?: boolean;
}

export const TimePickerTitle = forwardRef<
  HTMLHeadingElement,
  TimePickerTitleProps
>(({ children, className, style, asChild, ...props }, ref) => {
  const { locale } = useTimePickerContext();

  const Comp = asChild ? Slot : "h2";

  return (
    <Comp
      ref={ref}
      data-time-picker-title=""
      style={style}
      className={cn("time-picker-title", className)}
      {...props}
    >
      {children ?? locale.title}
    </Comp>
  );
});

TimePickerTitle.displayName = "TimePickerTitle";
