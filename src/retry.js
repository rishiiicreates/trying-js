import { sleep } from './sleep.js';

/**
 * Retries an asynchronous operation with exponential backoff and jitter.
 *
 * @param {Function} fn The async operation to perform.
 * @param {object} [options] Retry options.
 * @param {number} [options.retries=3] Number of retry attempts.
 * @param {number} [options.delay=200] Initial delay in milliseconds.
 * @param {number} [options.factor=2] Exponential backoff factor.
 * @param {number} [options.maxDelay=5000] Maximum delay threshold.
 * @returns {Promise<*>} Result of the operation.
 */
export async function retry(fn, { retries = 3, delay = 200, factor = 2, maxDelay = 5000 } = {}) {
  let attempt = 0;
  let currentDelay = delay;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;

      const jitter = Math.random() * 0.3 + 0.85; // 85% - 115% jitter
      const waitTime = Math.min(currentDelay * jitter, maxDelay);
      await sleep(waitTime);
      currentDelay *= factor;
    }
  }
}
