/**
 * Deep clones an object supporting primitives, Dates, RegExps, Arrays, Maps, Sets,
 * and circular references.
 *
 * @param {*} value The value to deep clone.
 * @param {WeakMap} [hash=new WeakMap()] Circular reference tracking hash.
 * @returns {*} The deeply cloned value.
 */
export function deepClone(value, hash = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  if (hash.has(value)) return hash.get(value);

  if (value instanceof Set) {
    const copy = new Set();
    hash.set(value, copy);
    value.forEach(item => copy.add(deepClone(item, hash)));
    return copy;
  }

  if (value instanceof Map) {
    const copy = new Map();
    hash.set(value, copy);
    value.forEach((v, k) => copy.set(deepClone(k, hash), deepClone(v, hash)));
    return copy;
  }

  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  hash.set(value, copy);

  for (const key of Reflect.ownKeys(value)) {
    copy[key] = deepClone(value[key], hash);
  }

  return copy;
}
