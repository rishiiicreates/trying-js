/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * Always ensures the trailing invocation executes with the latest arguments and context.
 *
 * @param {Function} func The function to throttle.
 * @param {number} [wait=100] The number of milliseconds to throttle invocations to.
 * @returns {Function} Returns the new throttled function with a .cancel() method.
 */
export function throttle(func, wait = 100) {
  let timer = null;
  let lastTime = 0;
  let lastArgs = null;
  let lastThis = null;

  const invoke = (time) => {
    lastTime = time;
    timer = null;
    const args = lastArgs;
    const context = lastThis;
    lastArgs = null;
    lastThis = null;
    func.apply(context, args);
  };

  const throttled = function (...args) {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;
    const remaining = wait - (now - lastTime);

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      invoke(now);
    } else if (!timer) {
      timer = setTimeout(() => {
        invoke(Date.now());
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastTime = 0;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}
