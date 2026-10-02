/**
 * Memoizes an expensive function with custom resolver support and cache clearing.
 *
 * @param {Function} func The function whose output should be cached.
 * @param {Function} [resolver] Optional key resolver function.
 * @returns {Function} Returns the memoized function.
 */
export function memoize(func, resolver) {
  const cache = new Map();

  const memoized = function (...args) {
    const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  return memoized;
}
