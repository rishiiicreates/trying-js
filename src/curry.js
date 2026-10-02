/**
 * Transforms a multi-argument function into a chain of unary/curried functions.
 * Preserves the original `this` context across partial applications unless explicitly rebound.
 *
 * @param {Function} fn The function to curry.
 * @param {number} [arity=fn.length] Arity of the target function.
 * @returns {Function} The curried function.
 */
export function curry(fn, arity = fn?.length) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function to curry');
  }

  const targetArity = typeof arity === 'number' ? arity : fn.length;

  return function curried(...args) {
    if (args.length >= targetArity) {
      return fn.apply(this, args);
    }
    const context = this;
    return function (...moreArgs) {
      const callContext = this !== undefined && this !== globalThis ? this : context;
      return curried.apply(callContext, args.concat(moreArgs));
    };
  };
}
