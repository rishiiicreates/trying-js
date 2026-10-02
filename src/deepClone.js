/**
 * Deep clones an object supporting primitives, Dates, RegExps, Arrays, Maps, Sets,
 * TypedArrays, Error objects, and circular references.
 *
 * @param {*} value The value to deep clone.
 * @param {WeakMap} [hash=new WeakMap()] Circular reference tracking hash.
 * @returns {*} The deeply cloned value.
 */
export function deepClone(value, hash = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  if (hash.has(value)) {
    return hash.get(value);
  }

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

  if (ArrayBuffer.isView(value)) {
    if (value instanceof DataView) {
      const copyBuffer = value.buffer.slice(0);
      return new DataView(copyBuffer, value.byteOffset, value.byteLength);
    }
    const copy = new value.constructor(value);
    hash.set(value, copy);
    return copy;
  }

  if (value instanceof ArrayBuffer) {
    return value.slice(0);
  }

  if (value instanceof Error) {
    const copy = new value.constructor(value.message);
    copy.stack = value.stack;
    if (value.cause !== undefined) {
      copy.cause = deepClone(value.cause, hash);
    }
    hash.set(value, copy);
    return copy;
  }

  const isArray = Array.isArray(value);
  const copy = isArray ? [] : Object.create(Object.getPrototypeOf(value));
  hash.set(value, copy);

  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const key of Reflect.ownKeys(descriptors)) {
    const desc = descriptors[key];
    if ('value' in desc) {
      desc.value = deepClone(desc.value, hash);
    }
    try {
      Object.defineProperty(copy, key, desc);
    } catch {
      // Fallback for special non-configurable array properties
      copy[key] = desc.value;
    }
  }

  return copy;
}
