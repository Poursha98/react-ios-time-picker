# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
