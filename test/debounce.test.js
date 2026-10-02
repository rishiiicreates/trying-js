import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { debounce } from '../src/debounce.js';
import { sleep } from '../src/sleep.js';

describe('debounce', () => {
  it('delays execution until wait time elapses', async () => {
    let calls = 0;
    const fn = debounce(() => calls++, 50);

    fn();
    fn();
    fn();
    assert.equal(calls, 0);

    await sleep(70);
    assert.equal(calls, 1);
  });

  it('supports immediate leading-edge invocation', async () => {
    let calls = 0;
    const fn = debounce(() => calls++, 50, true);

    fn();
    assert.equal(calls, 1);

    fn();
    fn();
    assert.equal(calls, 1);

    await sleep(70);
    assert.equal(calls, 1);

    fn();
    assert.equal(calls, 2);
  });

  it('cancels scheduled invocation', async () => {
    let calls = 0;
    const fn = debounce(() => calls++, 50);

    fn();
    assert.equal(fn.pending(), true);
    fn.cancel();
    assert.equal(fn.pending(), false);

    await sleep(70);
    assert.equal(calls, 0);
  });

  it('flushes scheduled execution immediately', async () => {
    let lastArg = null;
    const fn = debounce((x) => {
      lastArg = x;
      return x * 2;
    }, 50);

    fn(21);
    assert.equal(fn.pending(), true);
    const result = fn.flush();
    assert.equal(result, 42);
    assert.equal(lastArg, 21);
    assert.equal(fn.pending(), false);
  });
});
