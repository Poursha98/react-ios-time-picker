import React, { forwardRef, type ReactElement, type Ref } from "react";
import { cn } from "./cn";

export interface SlotProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

/**
 * Slot component for the asChild pattern
 * Merges parent props with child element props
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(
  ({ children, ...props }, forwardedRef) => {
    if (!React.isValidElement(children)) {
      return null;
    }

    const child = children as ReactElement<{
      ref?: Ref<HTMLElement>;
      className?: string;
      style?: React.CSSProperties;
      [key: string]: unknown;
    }>;

    return React.cloneElement(child, {
      ...props,
      ...child.props,
      ref: forwardedRef,
      className: cn(props.className as string, child.props.className),
      style: { ...(props.style as object), ...child.props.style },
    });
  }
);

Slot.displayName = "Slot";
