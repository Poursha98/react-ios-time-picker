# react-ios-time-picker

A beautiful, accessible iOS-style time picker for React. Features smooth scroll-snap physics, touch/mouse drag support, RTL support, and full TypeScript types.

![npm](https://img.shields.io/npm/v/react-ios-time-picker)
![bundle size](https://img.shields.io/bundlephobia/minzip/react-ios-time-picker)
![license](https://img.shields.io/npm/l/react-ios-time-picker)

## Features

- 🎡 **iOS-style scroll physics** - Native scroll-snap behavior
- 🖱️ **Multi-input support** - Touch, mouse drag, and keyboard navigation
- ♿ **Accessible** - ARIA listbox pattern with full keyboard support
- 🌐 **RTL & Persian numerals** - Built-in support for Persian/Arabic
- 🎨 **Fully customizable** - CSS classes and inline styles for every element
- 📦 **Lightweight** - Zero dependencies, ~5KB gzipped
- 🔧 **TypeScript** - Complete type definitions included

## Installation

```bash
npm install react-ios-time-picker
```

## Quick Start

### TimePicker (Ready-to-use)

```tsx
import { useState } from "react";
import { TimePicker } from "react-ios-time-picker";

function App() {
  const [time, setTime] = useState("09:30");

  return (
    <TimePicker
      value={time}
      onChange={setTime}
      onConfirm={() => console.log("Selected:", time)}
    />
  );
}
```

### Wheel (Low-level component)

```tsx
import { useState } from "react";
import { Wheel } from "react-ios-time-picker";

const fruits = [
  "🍎 Apple",
  "🍊 Orange",
  "🍋 Lemon",
  "🍇 Grape",
  "🍓 Strawberry",
];

function App() {
  const [selected, setSelected] = useState(0);

  return (
    <Wheel
      items={fruits}
      value={selected}
      onChange={setSelected}
      itemHeight={48}
      visibleCount={5}
    />
  );
}
```

## TimePicker Props

| Prop                | Type                     | Default      | Description                              |
| ------------------- | ------------------------ | ------------ | ---------------------------------------- |
| `value`             | `string`                 | **required** | Time in `"HH:MM"` format                 |
| `onChange`          | `(time: string) => void` | **required** | Called when time changes                 |
| `onConfirm`         | `() => void`             | -            | Called when confirm button is clicked    |
| `numerals`          | `"en" \| "fa" \| "auto"` | `"auto"`     | Controls number format AND text language |
| `hours`             | `number[]`               | `[0-23]`     | Custom hours array                       |
| `minutes`           | `number[]`               | `[0-59]`     | Custom minutes array                     |
| `showTitle`         | `boolean`                | `true`       | Show title                               |
| `showLabels`        | `boolean`                | `true`       | Show hour/minute labels                  |
| `showConfirmButton` | `boolean`                | `true`       | Show confirm button                      |
| `itemHeight`        | `number`                 | `48`         | Height of each wheel item                |
| `visibleCount`      | `number`                 | `5`          | Number of visible items                  |
| `disabled`          | `boolean`                | `false`      | Disable the picker                       |
| `classNames`        | `TimePickerClassNames`   | -            | CSS class names                          |
| `styles`            | `TimePickerStyles`       | -            | Inline styles                            |
| `localeStrings`     | `TimePickerLocale`       | -            | Custom text strings                      |

### Numerals Prop

The `numerals` prop controls both the number display format **and** the UI text language:

```tsx
// English numerals (0-9) + English text
<TimePicker numerals="en" ... />

// Persian numerals (۰-۹) + Persian text (تأیید, ساعت, دقیقه)
<TimePicker numerals="fa" ... />

// Auto-detect from browser locale (default)
<TimePicker numerals="auto" ... />
```

## Wheel Props

| Prop           | Type                                     | Default      | Description                   |
| -------------- | ---------------------------------------- | ------------ | ----------------------------- |
| `items`        | `T[]`                                    | **required** | Array of items to display     |
| `value`        | `number`                                 | **required** | Currently selected index      |
| `onChange`     | `(index: number) => void`                | **required** | Called when selection changes |
| `itemHeight`   | `number`                                 | `40`         | Height of each item in pixels |
| `visibleCount` | `number`                                 | `5`          | Number of visible items       |
| `width`        | `string \| number`                       | `"100%"`     | Width of the wheel            |
| `renderItem`   | `(item, index, isSelected) => ReactNode` | -            | Custom item renderer          |
| `disabled`     | `boolean`                                | `false`      | Disable the wheel             |
| `classNames`   | `WheelClassNames`                        | -            | CSS class names               |
| `styles`       | `WheelStyles`                            | -            | Inline styles                 |
| `aria-label`   | `string`                                 | -            | Accessible label              |
| `getItemLabel` | `(item, index) => string`                | -            | Accessible item labels        |

## Styling

### Tailwind CSS

Works out of the box with Tailwind - just pass your classes via `classNames`:

```tsx
<TimePicker
  value={time}
  onChange={setTime}
  classNames={{
    root: "bg-slate-900 rounded-2xl p-6 shadow-xl",
    title: "text-white font-bold text-xl",
    wheelLabel: "text-slate-400 text-sm",
    separator: "text-blue-400",
    confirmButton:
      "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition-opacity rounded-xl",
    wheel: {
      root: "bg-slate-800 rounded-lg",
      indicator: "bg-slate-700/50 rounded-md",
    },
  }}
/>
```

### CSS Variables

Customize colors using CSS variables:

```css
:root {
  --time-picker-primary: #3b82f6;
  --time-picker-text-primary: #1f2937;
  --time-picker-text-secondary: #9ca3af;
}
```

### Class Names

Both components accept `classNames` for CSS class targeting:

```tsx
<TimePicker
  classNames={{
    root: "my-picker",
    title: "my-title",
    wheelsContainer: "my-wheels",
    wheelColumn: "my-column",
    separator: "my-separator",
    confirmButton: "my-button",
    wheel: {
      root: "my-wheel",
      viewport: "my-viewport",
      item: "my-item",
      selectedItem: "my-selected",
      indicator: "my-indicator",
    },
  }}
/>
```

### Inline Styles

For dynamic styling, use the `styles` prop:

```tsx
<TimePicker
  styles={{
    root: { background: "#1a1a2e" },
    confirmButton: { background: "#e94560" },
  }}
/>
```

## React Hook Form Integration

Works seamlessly with React Hook Form:

```tsx
import { Controller, useForm } from "react-hook-form";
import { TimePicker } from "react-ios-time-picker";

function MyForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { appointmentTime: "09:00" },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="appointmentTime"
        control={control}
        render={({ field }) => (
          <TimePicker
            value={field.value}
            onChange={field.onChange}
            showConfirmButton={false}
          />
        )}
      />
      <button type="submit">Book Appointment</button>
    </form>
  );
}
```

## Accessibility

- Full keyboard navigation: Arrow keys, Home, End, Page Up/Down
- ARIA `listbox` pattern with `option` roles
- Screen reader announcements via `aria-label` and `getItemLabel`
- Focus management and visible focus indicators

## Browser Support

- Chrome, Edge, Safari, Firefox (latest 2 versions)
- iOS Safari 13+
- Android Chrome 80+

## License

MIT © Poursha98
