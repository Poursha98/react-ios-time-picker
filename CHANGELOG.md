# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-29

### 🚀 BREAKING CHANGES

- **Tailwind-First Architecture**: Components now have Tailwind classes baked in (shadcn-style approach)
- **No CSS import needed**: Removed requirement for `styles.css` import when using Tailwind
- **Requires Tailwind CSS**: Library now requires Tailwind CSS to be installed in your project
- **`styles.css` deprecated**: The optional CSS file is still provided but uses only data attribute selectors for non-Tailwind users

### Added

- **Dependencies**: Added `clsx` and `tailwind-merge` for proper class merging
- **Default Styling**: All components now have beautiful iOS-style defaults via Tailwind classes
- **Easy Overrides**: User-provided `className` props seamlessly override defaults
- **Dark Mode**: Built-in dark mode support via Tailwind's `dark:` variant

### Changed

- **Updated `cn()` utility**: Now uses `tailwind-merge` for proper class conflict resolution
- **Component classes**: All hardcoded CSS class names replaced with Tailwind utilities
- **Better shadcn integration**: Works perfectly with shadcn/ui components out of the box

### Migration Guide

**Before (v1.x)**:

```tsx
import { TimePicker } from "@poursha98/react-ios-time-picker";
import "@poursha98/react-ios-time-picker/styles.css"; // Required

<TimePicker value={time} onChange={setTime} />;
```

**After (v2.x)**:

```tsx
import { TimePicker } from "@poursha98/react-ios-time-picker";
// No CSS import needed! Just use it:

<TimePicker value={time} onChange={setTime} />;
```

Override styles easily:

```tsx
<TimePicker
  value={time}
  onChange={setTime}
  className="bg-slate-900 p-8" // Your classes override defaults
/>
```

## [0.2.0] - 2025-12-29

### Added

- **Compound components API** - `TimePickerRoot`, `TimePickerWheel`, `TimePickerWheels`, `TimePickerTitle`, `TimePickerSeparator`, `TimePickerLabel`, `TimePickerButton`
- **12-hour AM/PM support** with period wheel
- **RTL and Persian numerals** - Built-in support via `numerals` prop
- **Low-level `Wheel` component** - For building custom pickers
- **Full accessibility** - ARIA listbox pattern, keyboard navigation
- **CSS variables** for theming
- **Data attributes** for styling (`[data-wheel-item]`, `[data-selected]`, etc.)
- **TypeScript types** - Complete type definitions exported

### Changed

- Moved to scoped package name `@poursha98/react-ios-time-picker`

## [0.1.0] - 2025-12-28

### Added

- Initial release
- Basic `TimePicker` component
- Smooth scroll-snap physics
- Touch and mouse drag support
