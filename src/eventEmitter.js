/**
 * Lightweight browser & Node compatible EventEmitter (Pub/Sub).
 */
export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
    return () => this.off(event, listener);
  }

  once(event, listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };
    onceWrapper.listener = listener;
    return this.on(event, onceWrapper);
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) return;

    for (const fn of listeners) {
      if (fn === listener || fn.listener === listener) {
        listeners.delete(fn);
      }
    }

    if (listeners.size === 0) {
      this.events.delete(event);
    }
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners || listeners.size === 0) return false;

    // Snapshot iteration to prevent concurrent modification or re-entrancy issues
    const snapshot = Array.from(listeners);
    for (const fn of snapshot) {
      fn.apply(this, args);
    }
    return true;
  }

  listenerCount(event) {
    const listeners = this.events.get(event);
    return listeners ? listeners.size : 0;
  }

  rawListeners(event) {
    const listeners = this.events.get(event);
    return listeners ? Array.from(listeners) : [];
  }

  clear(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}
