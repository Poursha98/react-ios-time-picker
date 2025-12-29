// =============================================================================
// React iOS Time Picker - Main Exports
// =============================================================================

// Compound Components (for full control)
export {
  TimePickerRoot,
  TimePickerTitle,
  TimePickerWheels,
  TimePickerWheel,
  TimePickerSeparator,
  TimePickerLabel,
  TimePickerButton,
} from "./components";

// All-in-One Component (simple usage)
export { TimePicker } from "./components";

// Low-Level Wheel (for custom pickers)
export { Wheel } from "./components";

// Context Hook (for advanced use cases)
export { useTimePickerContext } from "./context";

// Type Exports
export type {
  // Compound component props
  TimePickerRootProps,
  TimePickerTitleProps,
  TimePickerWheelsProps,
  TimePickerWheelProps,
  TimePickerSeparatorProps,
  TimePickerLabelProps,
  TimePickerButtonProps,
  WheelType,
  // All-in-one props
  TimePickerProps,
  TimePickerClassNames,
  TimePickerStyles,
  // Wheel props
  WheelProps,
  WheelClassNames,
  WheelStyles,
} from "./components";

export type {
  TimePickerContextValue,
  TimePickerLocale,
  NumeralFormat,
} from "./context";

// Time Constants
export {
  HOURS_24,
  HOURS_12,
  MINUTES,
  MINUTES_5,
  MINUTES_15,
} from "./timeConstants";

// Utility Exports (for advanced use)
export { cn } from "./utils";
export {
  parseTime,
  formatTime,
  to12Hour,
  to24Hour,
  formatNumber,
  detectLocale,
  isRTL,
  usePersianNumerals,
} from "./utils";
export type { Period } from "./utils/formatters";

// =============================================================================
// Default styles - import separately:
//   import "@poursha98/react-ios-time-picker/styles.css";
// =============================================================================
