/**
 * Composes functions from left to right (pipeline).
 *
 * @param {...Function} fns Functions to compose.
 * @returns {Function} The composed pipeline function.
 */
export function pipe(...fns) {
  return (initialValue) => fns.reduce((acc, fn) => fn(acc), initialValue);
}

/**
 * Composes async functions from left to right.
 *
 * @param {...Function} fns Async or sync functions to compose.
 * @returns {Function} Async pipeline function.
 */
export function pipeAsync(...fns) {
  return async (initialValue) => {
    let result = initialValue;
    for (const fn of fns) {
      result = await fn(result);
    }
    return result;
  };
}
