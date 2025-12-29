import { forwardRef, type ReactNode } from "react";
import { useTimePickerContext } from "../context";
import { cn, Slot } from "../utils";

export interface TimePickerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Custom button content (default: locale confirm text) */
  children?: ReactNode;
  /** Render as child element */
  asChild?: boolean;
}

export const TimePickerButton = forwardRef<
  HTMLButtonElement,
  TimePickerButtonProps
>(
  (
    { children, className, onClick, asChild, disabled: propDisabled, ...props },
    ref
  ) => {
    const { onConfirm, disabled: ctxDisabled, locale } = useTimePickerContext();

    const isDisabled = propDisabled ?? ctxDisabled;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      onConfirm?.();
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type="button"
        data-time-picker-button=""
        data-disabled={isDisabled || undefined}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn("time-picker-button", className)}
        {...props}
      >
        {children ?? locale.confirm}
      </Comp>
    );
  }
);

TimePickerButton.displayName = "TimePickerButton";
