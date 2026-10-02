import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { memoize } from '../src/memoize.js';

describe('memoize', () => {
  it('caches computation results for identical inputs', () => {
    let executions = 0;
    const square = memoize((n) => {
      executions++;
      return n * n;
    });

    assert.equal(square(4), 16);
    assert.equal(square(4), 16);
    assert.equal(executions, 1);

    assert.equal(square(5), 25);
    assert.equal(executions, 2);
  });

  it('handles BigInt arguments without serialization error', () => {
    const fn = memoize((bi) => bi + 1n);
    assert.equal(fn(10n), 11n);
    assert.equal(fn(10n), 11n);
  });

  it('handles circular objects gracefully without throwing', () => {
    let runs = 0;
    const fn = memoize((obj) => {
      runs++;
      return obj.val;
    });

    const circular = { val: 99 };
    circular.self = circular;

    assert.equal(fn(circular), 99);
    assert.equal(fn(circular), 99);
    assert.equal(runs, 1);
  });

  it('supports custom resolver function', () => {
    let runs = 0;
    const sum = memoize((a, b) => {
      runs++;
      return a + b;
    }, (a, b) => `${a}:${b}`);

    assert.equal(sum(2, 3), 5);
    assert.equal(sum(2, 3), 5);
    assert.equal(runs, 1);

    assert.equal(sum(3, 2), 5);
    assert.equal(runs, 2);
  });

  it('supports cache inspection and clearing', () => {
    const fn = memoize((x) => x * 10);
    fn(5);
    assert.equal(fn.has(5), true);

    fn.delete(5);
    assert.equal(fn.has(5), false);

    fn(6);
    assert.equal(fn.has(6), true);
    fn.clear();
    assert.equal(fn.has(6), false);
  });
});
