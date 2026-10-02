import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { uuidv4 } from '../src/uuid.js';

describe('uuidv4', () => {
  it('generates a valid RFC4122 v4 UUID format', () => {
    const id = uuidv4();
    assert.equal(typeof id, 'string');
    assert.equal(id.length, 36);

    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    assert.match(id, regex);
  });

  it('generates unique identifiers across calls', () => {
    const set = new Set();
    for (let i = 0; i < 50; i++) {
      set.add(uuidv4());
    }
    assert.equal(set.size, 50);
  });
});
