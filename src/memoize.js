function defaultKeyResolver(...args) {
  if (args.length === 0) return '__empty__';
  if (args.length === 1) {
    const arg = args[0];
    if (typeof arg !== 'object' || arg === null) {
      return typeof arg === 'undefined' ? '__undefined__' : arg;
    }
  }
  try {
    return JSON.stringify(args, (_, value) =>
      typeof value === 'bigint' ? `__bigint_${value.toString()}__` : value
    );
  } catch {
    // Graceful fallback for circular structures or non-serializable arguments
    return args[0];
  }
}

/**
 * Memoizes an expensive function with custom resolver support, BigInt / circular safety, and cache clearing.
 *
 * @param {Function} func The function whose output should be cached.
 * @param {Function} [resolver] Optional key resolver function.
 * @returns {Function} Returns the memoized function.
 */
export function memoize(func, resolver) {
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  const cache = new Map();

  const memoized = function (...args) {
    const key = resolver ? resolver.apply(this, args) : defaultKeyResolver(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();
  memoized.delete = (key) => cache.delete(key);
  memoized.has = (key) => cache.has(key);

  return memoized;
}
