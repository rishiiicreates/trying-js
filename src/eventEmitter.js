/**
 * Lightweight browser & Node compatible EventEmitter (Pub/Sub).
 */
export class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);
    return () => this.off(event, listener);
  }

  once(event, listener) {
    const onceWrapper = (...args) => {
      this.off(event, onceWrapper);
      listener.apply(this, args);
    };
    return this.on(event, onceWrapper);
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) return;
    listeners.delete(listener);
    if (listeners.size === 0) this.events.delete(event);
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners) return false;
    listeners.forEach(fn => fn.apply(this, args));
    return true;
  }

  clear(event) {
    if (event) this.events.delete(event);
    else this.events.clear();
  }
}
