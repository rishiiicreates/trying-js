import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { clamp, lerp } from '../src/mathUtils.js';

describe('mathUtils', () => {
  describe('clamp', () => {
    it('clamps values within bounds', () => {
      assert.equal(clamp(5, 0, 10), 5);
      assert.equal(clamp(-5, 0, 10), 0);
      assert.equal(clamp(15, 0, 10), 10);
    });

    it('handles inverted min and max bounds safely', () => {
      assert.equal(clamp(5, 10, 0), 5);
      assert.equal(clamp(15, 10, 0), 10);
      assert.equal(clamp(-5, 10, 0), 0);
    });
  });

  describe('lerp', () => {
    it('interpolates linearly between start and end', () => {
      assert.equal(lerp(10, 20, 0), 10);
      assert.equal(lerp(10, 20, 0.5), 15);
      assert.equal(lerp(10, 20, 1), 20);
    });

    it('clamps interpolation factor by default', () => {
      assert.equal(lerp(0, 100, 1.5), 100);
      assert.equal(lerp(0, 100, -0.5), 0);
    });

    it('allows unclamped extrapolation when specified', () => {
      assert.equal(lerp(0, 100, 1.5, false), 150);
      assert.equal(lerp(0, 100, -0.5, false), -50);
    });
  });
});
