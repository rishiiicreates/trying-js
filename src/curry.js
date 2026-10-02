/**
 * Transforms a multi-argument function into a chain of unary/curried functions.
 *
 * @param {Function} fn The function to curry.
 * @param {number} [arity=fn.length] Arity of the target function.
 * @returns {Function} The curried function.
 */
export function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    return function (...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}
