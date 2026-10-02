/**
 * Promisified delay with optional AbortSignal support and leak-free cleanup.
 *
 * @param {number} [ms=0] Milliseconds to sleep.
 * @param {AbortSignal} [signal] Optional abort signal to cancel delay early.
 * @returns {Promise<void>}
 */
export function sleep(ms = 0, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    }

    const duration = Math.max(0, Number(ms) || 0);
    let timer = null;

    const onAbort = () => {
      if (timer) clearTimeout(timer);
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
    };

    timer = setTimeout(() => {
      if (signal) {
        signal.removeEventListener('abort', onAbort);
      }
      resolve();
    }, duration);

    if (signal) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}
