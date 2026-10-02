import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { retry } from '../src/retry.js';

describe('retry', () => {
  it('resolves on first try if successful', async () => {
    let attempts = 0;
    const result = await retry(async (att) => {
      attempts++;
      return 'success';
    });

    assert.equal(result, 'success');
    assert.equal(attempts, 1);
  });

  it('retries until success within attempt limit', async () => {
    let attempts = 0;
    const result = await retry(
      async (att) => {
        attempts++;
        if (attempts < 3) throw new Error('Transient error');
        return 'recovered';
      },
      { retries: 4, delay: 10, factor: 1.5 }
    );

    assert.equal(result, 'recovered');
    assert.equal(attempts, 3);
  });

  it('throws error when retries are exhausted', async () => {
    let attempts = 0;
    await assert.rejects(
      async () =>
        retry(
          async () => {
            attempts++;
            throw new Error('Permanent failure');
          },
          { retries: 2, delay: 10 }
        ),
      (err) => err.message === 'Permanent failure'
    );
    assert.equal(attempts, 3); // initial attempt + 2 retries
  });

  it('aborts retrying if shouldRetry returns false', async () => {
    let attempts = 0;
    await assert.rejects(
      async () =>
        retry(
          async () => {
            attempts++;
            const err = new Error('Unauthorized');
            err.status = 401;
            throw err;
          },
          {
            retries: 5,
            delay: 10,
            shouldRetry: (err) => err.status !== 401,
          }
        ),
      (err) => err.status === 401
    );
    assert.equal(attempts, 1); // Should not retry on 401
  });

  it('calls onRetry hook before each delay', async () => {
    const logs = [];
    await retry(
      async (att) => {
        if (att < 2) throw new Error(`fail ${att}`);
        return 'ok';
      },
      {
        retries: 3,
        delay: 10,
        onRetry: (err, attempt, waitTime) => {
          logs.push({ msg: err.message, attempt, waitTime: Math.round(waitTime) });
        },
      }
    );

    assert.equal(logs.length, 2);
    assert.equal(logs[0].msg, 'fail 0');
    assert.equal(logs[1].msg, 'fail 1');
  });
});
