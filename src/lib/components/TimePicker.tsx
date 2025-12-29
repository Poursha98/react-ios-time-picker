import { forwardRef } from "react";
import { TimePickerRoot, type TimePickerRootProps } from "./TimePickerRoot";
import { TimePickerTitle } from "./TimePickerTitle";
import { TimePickerWheels } from "./TimePickerWheels";
import { TimePickerWheel } from "./TimePickerWheel";
import { TimePickerSeparator } from "./TimePickerSeparator";
import { TimePickerLabel } from "./TimePickerLabel";
import { TimePickerButton } from "./TimePickerButton";
import type { WheelClassNames, WheelStyles } from "./Wheel";
import { cn } from "../utils";

/**
 * Legacy classNames structure for backward compatibility
 */
export interface TimePickerClassNames {
  root?: string;
  title?: string;
  wheelsContainer?: string;
  wheelColumn?: string;
  wheelLabel?: string;
  separator?: string;
  confirmButton?: string;
  wheel?: WheelClassNames;
}

export interface TimePickerStyles {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  wheelsContainer?: React.CSSProperties;
  wheelColumn?: React.CSSProperties;
  wheelLabel?: React.CSSProperties;
  separator?: React.CSSProperties;
  confirmButton?: React.CSSProperties;
  wheel?: WheelStyles;
}

export interface TimePickerProps extends Omit<TimePickerRootProps, "children"> {
  /** Show the title */
  showTitle?: boolean;
  /** Show hour/minute labels */
  showLabels?: boolean;
  /** Show confirm button */
  showConfirmButton?: boolean;

  /**
   * Legacy classNames prop for backward compatibility
   * @deprecated Use className on individual compound components instead
   */
  classNames?: TimePickerClassNames;

  /**
   * Legacy styles prop for backward compatibility
   * @deprecated Use style on individual compound components instead
   */
  styles?: TimePickerStyles;
}

/**
 * All-in-one TimePicker component
 *
 * For more control, use the compound components:
 * TimePickerRoot, TimePickerTitle, TimePickerWheels, TimePickerWheel, etc.
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      showTitle = true,
      showLabels = true,
      showConfirmButton = true,
      classNames = {},
      styles = {},
      className,
      is12Hour,
      loop,
      ...props
    },
    ref
  ) => {
    return (
      <TimePickerRoot
        ref={ref}
        className={cn(classNames.root, className)}
        is12Hour={is12Hour}
        loop={loop}
        {...props}
      >
        {showTitle && (
          <TimePickerTitle className={classNames.title} style={styles.title} />
        )}

        <TimePickerWheels
          className={classNames.wheelsContainer}
          style={styles.wheelsContainer}
        >
          <div
            className={cn(
              "flex flex-col items-center flex-1 min-w-[100px] max-w-[140px]",
              classNames.wheelColumn
            )}
            style={styles.wheelColumn}
          >
            {showLabels && (
              <TimePickerLabel
                type="hour"
                className={classNames.wheelLabel}
                style={styles.wheelLabel}
              />
            )}
            <TimePickerWheel
              type="hour"
              classNames={classNames.wheel}
              styles={styles.wheel}
            />
          </div>

          <TimePickerSeparator
            className={classNames.separator}
            style={styles.separator}
          />

          <div
            className={cn(
              "flex flex-col items-center flex-1 min-w-[100px] max-w-[140px]",
              classNames.wheelColumn
            )}
            style={styles.wheelColumn}
          >
            {showLabels && (
              <TimePickerLabel
                type="minute"
                className={classNames.wheelLabel}
                style={styles.wheelLabel}
              />
            )}
            <TimePickerWheel
              type="minute"
              classNames={classNames.wheel}
              styles={styles.wheel}
            />
          </div>

          {is12Hour && (
            <div
              className={cn(
                "flex flex-col items-center flex-1 min-w-[100px] max-w-[140px]",
                classNames.wheelColumn
              )}
              style={styles.wheelColumn}
            >
              {showLabels && (
                <TimePickerLabel
                  type="period"
                  className={classNames.wheelLabel}
                  style={styles.wheelLabel}
                />
              )}
              <TimePickerWheel
                type="period"
                classNames={classNames.wheel}
                styles={styles.wheel}
              />
            </div>
          )}
        </TimePickerWheels>

        {showConfirmButton && (
          <TimePickerButton
            className={classNames.confirmButton}
            style={styles.confirmButton}
          />
        )}
      </TimePickerRoot>
    );
  }
);

TimePicker.displayName = "TimePicker";
