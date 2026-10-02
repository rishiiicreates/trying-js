/**
 * Promisified delay with optional AbortSignal support.
 *
 * @param {number} ms Milliseconds to sleep.
 * @param {AbortSignal} [signal] Optional abort signal to cancel delay early.
 * @returns {Promise<void>}
 */
export function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    const timer = setTimeout(() => resolve(), ms);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      }, { once: true });
    }
  });
}
