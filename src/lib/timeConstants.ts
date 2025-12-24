// Built-in arrays - developers don't need to create these
export const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
export const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
export const MINUTES = Array.from({ length: 60 }, (_, i) => i);
export const MINUTES_5 = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ...
export const MINUTES_15 = [0, 15, 30, 45];
