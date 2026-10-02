import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from '../src/eventEmitter.js';

describe('EventEmitter', () => {
  it('registers listeners and emits with arguments', () => {
    const ee = new EventEmitter();
    const calls = [];
    ee.on('greet', (name) => calls.push(`hello ${name}`));

    const emitted = ee.emit('greet', 'rishii');
    assert.equal(emitted, true);
    assert.deepEqual(calls, ['hello rishii']);
  });

  it('unregisters listeners via off', () => {
    const ee = new EventEmitter();
    let count = 0;
    const fn = () => count++;

    ee.on('tick', fn);
    ee.emit('tick');
    assert.equal(count, 1);

    ee.off('tick', fn);
    ee.emit('tick');
    assert.equal(count, 1);
  });

  it('returns unsubscribe function from on()', () => {
    const ee = new EventEmitter();
    let count = 0;
    const unsub = ee.on('ping', () => count++);

    ee.emit('ping');
    assert.equal(count, 1);

    unsub();
    ee.emit('ping');
    assert.equal(count, 1);
  });

  it('handles once listeners correctly', () => {
    const ee = new EventEmitter();
    let count = 0;
    ee.once('single', () => count++);

    ee.emit('single');
    assert.equal(count, 1);

    ee.emit('single');
    assert.equal(count, 1);
  });

  it('unregisters once listener when off is called before emit', () => {
    const ee = new EventEmitter();
    let count = 0;
    const fn = () => count++;

    ee.once('custom', fn);
    assert.equal(ee.listenerCount('custom'), 1);

    ee.off('custom', fn);
    assert.equal(ee.listenerCount('custom'), 0);

    ee.emit('custom');
    assert.equal(count, 0);
  });

  it('safely handles listener set mutations during emit', () => {
    const ee = new EventEmitter();
    const order = [];

    const fn1 = () => {
      order.push(1);
      ee.on('cascade', () => order.push(3)); // Added during emit, should not fire this tick
    };
    const fn2 = () => order.push(2);

    ee.on('cascade', fn1);
    ee.on('cascade', fn2);

    ee.emit('cascade');
    assert.deepEqual(order, [1, 2]);

    ee.emit('cascade');
    assert.deepEqual(order, [1, 2, 1, 2, 3]);
  });

  it('clears specific or all events', () => {
    const ee = new EventEmitter();
    ee.on('a', () => {});
    ee.on('b', () => {});
    assert.equal(ee.listenerCount('a'), 1);

    ee.clear('a');
    assert.equal(ee.listenerCount('a'), 0);
    assert.equal(ee.listenerCount('b'), 1);

    ee.clear();
    assert.equal(ee.listenerCount('b'), 0);
  });
});
