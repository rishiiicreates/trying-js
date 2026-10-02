import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { pipe, pipeAsync } from '../src/pipe.js';

describe('pipe & pipeAsync', () => {
  it('composes synchronous functions left-to-right', () => {
    const double = (x) => x * 2;
    const addTen = (x) => x + 10;
    const toString = (x) => `val: ${x}`;

    const pipeline = pipe(double, addTen, toString);
    assert.equal(pipeline(5), 'val: 20');
  });

  it('supports multiple arguments in initial pipeline function', () => {
    const sum = (a, b, c) => a + b + c;
    const square = (x) => x * x;

    const pipeline = pipe(sum, square);
    assert.equal(pipeline(1, 2, 3), 36);
  });

  it('preserves execution context (this) in pipe', () => {
    const context = { multiplier: 3 };
    const multiply = function (x) {
      return x * this.multiplier;
    };
    const addOne = (x) => x + 1;

    const pipeline = pipe(multiply, addOne);
    assert.equal(pipeline.call(context, 4), 13);
  });

  it('composes async functions with pipeAsync', async () => {
    const fetchUser = async (id) => ({ id, name: 'rishii' });
    const addRole = async (user) => ({ ...user, role: 'maintainer' });
    const format = (user) => `${user.name} (${user.role})`;

    const pipeline = pipeAsync(fetchUser, addRole, format);
    const result = await pipeline(1);
    assert.equal(result, 'rishii (maintainer)');
  });

  it('supports multi-arg initial function in pipeAsync', async () => {
    const asyncAdd = async (a, b) => a + b;
    const double = async (x) => x * 2;

    const pipeline = pipeAsync(asyncAdd, double);
    const result = await pipeline(10, 20);
    assert.equal(result, 60);
  });

  it('throws TypeError if non-function is passed', () => {
    assert.throws(() => pipe(() => {}, null), TypeError);
    assert.throws(() => pipeAsync(() => {}, 'not a function'), TypeError);
  });
});
