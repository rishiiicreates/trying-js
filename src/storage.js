class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

function resolveStorage(preferred) {
  if (preferred && typeof preferred.getItem === 'function') {
    return preferred;
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
      return localStorage;
    }
  } catch {
    // Storage access may be blocked in iframe / private browsing
  }
  return new MemoryStorage();
}

/**
 * Type-safe storage wrapper with JSON serialization, TTL expiration, and fallback storage.
 */
export class SafeStorage {
  constructor(storage) {
    this.storage = resolveStorage(storage);
  }

  set(key, value, ttlMs) {
    try {
      const item = {
        value,
        expiry: ttlMs ? Date.now() + ttlMs : null,
      };
      this.storage.setItem(key, JSON.stringify(item));
      return true;
    } catch {
      return false;
    }
  }

  get(key, defaultValue = null) {
    let raw;
    try {
      raw = this.storage.getItem(key);
    } catch {
      return defaultValue;
    }

    if (raw === null || raw === undefined) return defaultValue;

    try {
      const item = JSON.parse(raw);
      if (typeof item === 'object' && item !== null && 'value' in item) {
        if (item.expiry && Date.now() > item.expiry) {
          this.remove(key);
          return defaultValue;
        }
        return item.value;
      }
      return item;
    } catch {
      return raw;
    }
  }

  has(key) {
    return this.get(key) !== null;
  }

  remove(key) {
    try {
      this.storage.removeItem(key);
    } catch {
      // Ignore
    }
  }

  clear() {
    try {
      this.storage.clear();
    } catch {
      // Ignore
    }
  }
}
