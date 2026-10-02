/**
 * Restricts a number between a minimum and maximum bound.
 * Handles inverted bounds gracefully.
 *
 * @param {number} value Number to clamp.
 * @param {number} min Lower or upper bound.
 * @param {number} max Upper or lower bound.
 * @returns {number} Clamped number.
 */
export function clamp(value, min, max) {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.min(Math.max(value, lower), upper);
}

/**
 * Linear interpolation between two values.
 *
 * @param {number} start Start value.
 * @param {number} end End value.
 * @param {number} t Interpolation factor.
 * @param {boolean} [clamped=true] Whether to clamp t to [0, 1].
 * @returns {number} Interpolated value.
 */
export function lerp(start, end, t, clamped = true) {
  const factor = clamped ? clamp(t, 0, 1) : t;
  return start + (end - start) * factor;
}
