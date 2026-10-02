import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sleep } from '../src/sleep.js';

describe('sleep', () => {
  it('resolves after specified milliseconds', async () => {
    const start = Date.now();
    await sleep(40);
    const elapsed = Date.now() - start;
    assert.ok(elapsed >= 35, `Elapsed was ${elapsed}ms, expected >= 35ms`);
  });

  it('aborts immediately when passed an already-aborted signal', async () => {
    const ac = new AbortController();
    ac.abort(new Error('Pre-aborted'));

    await assert.rejects(
      async () => sleep(100, ac.signal),
      (err) => err.message === 'Pre-aborted'
    );
  });

  it('cancels delay mid-flight when signal is triggered', async () => {
    const ac = new AbortController();
    const start = Date.now();

    setTimeout(() => ac.abort(new Error('Stop now')), 25);

    await assert.rejects(
      async () => sleep(100, ac.signal),
      (err) => err.message === 'Stop now'
    );

    const elapsed = Date.now() - start;
    assert.ok(elapsed < 80, `Did not abort early; elapsed was ${elapsed}ms`);
  });

  it('handles negative or zero ms gracefully', async () => {
    await sleep(-50);
    await sleep(0);
    assert.ok(true);
  });
});
