import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { deepClone } from '../src/deepClone.js';

describe('deepClone', () => {
  it('returns primitives as-is', () => {
    assert.equal(deepClone(42), 42);
    assert.equal(deepClone('abc'), 'abc');
    assert.equal(deepClone(null), null);
    assert.equal(deepClone(undefined), undefined);
    assert.equal(deepClone(true), true);
  });

  it('clones Dates and RegExps', () => {
    const date = new Date('2026-10-02T12:00:00Z');
    const cloneDate = deepClone(date);
    assert.notEqual(cloneDate, date);
    assert.equal(cloneDate.getTime(), date.getTime());

    const regex = /antigravity/gi;
    const cloneRegex = deepClone(regex);
    assert.notEqual(cloneRegex, regex);
    assert.equal(cloneRegex.source, regex.source);
    assert.equal(cloneRegex.flags, regex.flags);
  });

  it('clones nested objects and arrays', () => {
    const original = {
      nested: { a: 1, b: [2, 3] },
      list: [{ x: 10 }],
    };

    const copy = deepClone(original);
    assert.deepEqual(copy, original);
    assert.notEqual(copy, original);
    assert.notEqual(copy.nested, original.nested);
    assert.notEqual(copy.nested.b, original.nested.b);
    assert.notEqual(copy.list[0], original.list[0]);
  });

  it('clones Maps and Sets', () => {
    const set = new Set([1, { a: 2 }]);
    const copySet = deepClone(set);
    assert.notEqual(copySet, set);
    assert.equal(copySet.size, 2);

    const map = new Map([['key', { val: 'yes' }]]);
    const copyMap = deepClone(map);
    assert.notEqual(copyMap, map);
    assert.deepEqual(copyMap.get('key'), { val: 'yes' });
    assert.notEqual(copyMap.get('key'), map.get('key'));
  });

  it('handles circular references without infinite recursion', () => {
    const obj = { name: 'root' };
    obj.self = obj;
    obj.child = { parent: obj };

    const copy = deepClone(obj);
    assert.equal(copy.name, 'root');
    assert.equal(copy.self, copy);
    assert.equal(copy.child.parent, copy);
    assert.notEqual(copy, obj);
  });

  it('preserves property descriptors (non-enumerable, non-writable)', () => {
    const obj = {};
    Object.defineProperty(obj, 'hidden', {
      value: 'secret',
      enumerable: false,
      writable: false,
      configurable: true,
    });

    const copy = deepClone(obj);
    const desc = Object.getOwnPropertyDescriptor(copy, 'hidden');
    assert.ok(desc);
    assert.equal(desc.value, 'secret');
    assert.equal(desc.enumerable, false);
    assert.equal(desc.writable, false);
  });

  it('clones Error objects and TypedArrays', () => {
    const err = new Error('boom');
    const copyErr = deepClone(err);
    assert.ok(copyErr instanceof Error);
    assert.equal(copyErr.message, 'boom');

    const u8 = new Uint8Array([1, 2, 3, 4]);
    const copyU8 = deepClone(u8);
    assert.ok(copyU8 instanceof Uint8Array);
    assert.deepEqual(Array.from(copyU8), [1, 2, 3, 4]);
    assert.notEqual(copyU8, u8);
  });
});
