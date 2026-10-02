import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { throttle } from '../src/throttle.js';
import { sleep } from '../src/sleep.js';

describe('throttle', () => {
  it('executes leading call immediately', () => {
    let calls = 0;
    const fn = throttle(() => calls++, 50);
    fn();
    assert.equal(calls, 1);
  });

  it('throttles rapid calls and preserves the latest arguments on trailing edge', async () => {
    const received = [];
    const fn = throttle((val) => received.push(val), 60);

    fn('call-1'); // immediate
    await sleep(15);
    fn('call-2');
    await sleep(15);
    fn('call-3'); // latest in the throttle window

    assert.deepEqual(received, ['call-1']);

    await sleep(60);
    // Trailing call should have executed with latest argument 'call-3'
    assert.deepEqual(received, ['call-1', 'call-3']);
  });

  it('preserves execution context (this)', async () => {
    const obj = {
      val: 42,
      getVal: throttle(function () {
        return this.val;
      }, 50),
    };

    let result;
    const fn = throttle(function () {
      result = this.val;
    }, 50);

    fn.call(obj);
    assert.equal(result, 42);
  });

  it('cancels pending trailing execution on .cancel()', async () => {
    const received = [];
    const fn = throttle((val) => received.push(val), 50);

    fn('call-1');
    fn('call-2');
    fn.cancel();

    await sleep(80);
    assert.deepEqual(received, ['call-1']);
  });
});
