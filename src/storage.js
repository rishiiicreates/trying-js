/**
 * Type-safe storage wrapper with JSON serialization and TTL expiration.
 */
export class SafeStorage {
  constructor(storage = localStorage) {
    this.storage = storage;
  }

  set(key, value, ttlMs) {
    const item = {
      value,
      expiry: ttlMs ? Date.now() + ttlMs : null,
    };
    this.storage.setItem(key, JSON.stringify(item));
  }

  get(key, defaultValue = null) {
    const raw = this.storage.getItem(key);
    if (!raw) return defaultValue;

    try {
      const item = JSON.parse(raw);
      if (item.expiry && Date.now() > item.expiry) {
        this.storage.removeItem(key);
        return defaultValue;
      }
      return item.value;
    } catch {
      return defaultValue;
    }
  }

  remove(key) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }
}
