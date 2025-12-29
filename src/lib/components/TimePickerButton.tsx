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
        className={cn(
          "w-full mt-6 px-6 py-3.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
          "text-white font-semibold rounded-2xl",
          "transition-colors duration-150",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          className
        )}
        {...props}
      >
        {children ?? locale.confirm}
      </Comp>
    );
  }
);

TimePickerButton.displayName = "TimePickerButton";
