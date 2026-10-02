import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { curry } from '../src/curry.js';

describe('curry', () => {
  it('curries a function until all arguments are provided', () => {
    const sum3 = (a, b, c) => a + b + c;
    const curried = curry(sum3);

    assert.equal(curried(1)(2)(3), 6);
    assert.equal(curried(1, 2)(3), 6);
    assert.equal(curried(1)(2, 3), 6);
    assert.equal(curried(1, 2, 3), 6);
  });

  it('supports custom arity', () => {
    const variadic = (...args) => args.reduce((a, b) => a + b, 0);
    const curried = curry(variadic, 3);

    assert.equal(curried(10)(20)(30), 60);
  });

  it('preserves execution context (this)', () => {
    const greeter = {
      greeting: 'hi',
      greet: curry(function (name, punctuation) {
        return `${this.greeting} ${name}${punctuation}`;
      }),
    };

    assert.equal(greeter.greet('rishii')('!'), 'hi rishii!');
  });

  it('throws TypeError if target is not a function', () => {
    assert.throws(() => curry(null), TypeError);
    assert.throws(() => curry(42), TypeError);
  });
});
