import { sleep } from './sleep.js';

/**
 * Retries an asynchronous operation with exponential backoff, jitter, and cancellation.
 *
 * @param {Function} fn The async operation to perform. Receives (attempt) as argument.
 * @param {object} [options] Retry options.
 * @param {number} [options.retries=3] Number of retry attempts.
 * @param {number} [options.delay=200] Initial delay in milliseconds.
 * @param {number} [options.factor=2] Exponential backoff factor.
 * @param {number} [options.maxDelay=5000] Maximum delay threshold.
 * @param {Function} [options.shouldRetry] Predicate returning boolean whether to retry.
 * @param {Function} [options.onRetry] Hook called before each retry sleep.
 * @param {AbortSignal} [options.signal] AbortSignal to cancel retrying.
 * @returns {Promise<*>} Result of the operation.
 */
export async function retry(fn, {
  retries = 3,
  delay = 200,
  factor = 2,
  maxDelay = 5000,
  shouldRetry = () => true,
  onRetry = null,
  signal = null,
} = {}) {
  let attempt = 0;
  let currentDelay = delay;

  while (true) {
    if (signal?.aborted) {
      throw signal.reason ?? new DOMException('Aborted', 'AbortError');
    }

    try {
      return await fn(attempt);
    } catch (err) {
      attempt++;
      if (attempt > retries || !shouldRetry(err, attempt)) {
        throw err;
      }

      const jitter = Math.random() * 0.3 + 0.85; // 85% - 115% jitter
      const waitTime = Math.min(currentDelay * jitter, maxDelay);

      if (typeof onRetry === 'function') {
        onRetry(err, attempt, waitTime);
      }

      await sleep(waitTime, signal);
      currentDelay *= factor;
    }
  }
}
