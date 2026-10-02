/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func The function to debounce.
 * @param {number} [wait=100] The number of milliseconds to delay.
 * @param {boolean} [immediate=false] Whether to invoke on the leading edge.
 * @returns {Function} Returns the new debounced function.
 */
export function debounce(func, wait = 100, immediate = false) {
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;

  const debounced = function (...args) {
    lastArgs = args;
    lastThis = this;
    const callNow = immediate && !timeoutId;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate && lastArgs) {
        const argsToCall = lastArgs;
        const thisToCall = lastThis;
        lastArgs = null;
        lastThis = null;
        func.apply(thisToCall, argsToCall);
      }
    }, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = () => {
    if (timeoutId && !immediate && lastArgs) {
      const argsToCall = lastArgs;
      const thisToCall = lastThis;
      debounced.cancel();
      return func.apply(thisToCall, argsToCall);
    }
    debounced.cancel();
  };

  debounced.pending = () => timeoutId !== null;

  return debounced;
}
