/**
 * Restricts a number between a minimum and maximum bound.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 */
export function lerp(start, end, t) {
  return start + (end - start) * clamp(t, 0, 1);
}
