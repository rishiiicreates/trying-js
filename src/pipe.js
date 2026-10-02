/**
 * Composes functions from left to right (pipeline).
 * The first function can accept multiple arguments; subsequent functions receive the prior result.
 *
 * @param {...Function} fns Functions to compose.
 * @returns {Function} The composed pipeline function.
 */
export function pipe(...fns) {
  for (const fn of fns) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function in pipe pipeline');
    }
  }
  if (fns.length === 0) return (arg) => arg;

  return function (...args) {
    return fns.slice(1).reduce(
      (acc, fn) => fn.call(this, acc),
      fns[0].apply(this, args)
    );
  };
}

/**
 * Composes async functions from left to right.
 * The first function can accept multiple arguments; subsequent functions receive the prior resolved result.
 *
 * @param {...Function} fns Async or sync functions to compose.
 * @returns {Function} Async pipeline function.
 */
export function pipeAsync(...fns) {
  for (const fn of fns) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function in pipeAsync pipeline');
    }
  }
  if (fns.length === 0) return async (arg) => arg;

  return async function (...args) {
    let result = await fns[0].apply(this, args);
    for (let i = 1; i < fns.length; i++) {
      result = await fns[i].call(this, result);
    }
    return result;
  };
}
