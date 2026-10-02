import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SafeStorage } from '../src/storage.js';
import { sleep } from '../src/sleep.js';

describe('SafeStorage', () => {
  it('instantiates safely in Node.js without localStorage errors', () => {
    const storage = new SafeStorage();
    assert.ok(storage);
    assert.equal(typeof storage.get, 'function');
  });

  it('stores and retrieves primitives and complex objects', () => {
    const storage = new SafeStorage();
    storage.set('num', 42);
    storage.set('str', 'hello');
    storage.set('obj', { a: 1, b: [2, 3] });

    assert.equal(storage.get('num'), 42);
    assert.equal(storage.get('str'), 'hello');
    assert.deepEqual(storage.get('obj'), { a: 1, b: [2, 3] });
  });

  it('handles TTL expiration properly', async () => {
    const storage = new SafeStorage();
    storage.set('temp', 'fleeting', 40);

    assert.equal(storage.get('temp'), 'fleeting');
    assert.equal(storage.has('temp'), true);

    await sleep(60);
    assert.equal(storage.get('temp'), null);
    assert.equal(storage.has('temp'), false);
  });

  it('returns defaultValue for missing or expired keys', () => {
    const storage = new SafeStorage();
    assert.equal(storage.get('nonexistent', 'default-val'), 'default-val');
  });

  it('supports remove and clear operations', () => {
    const storage = new SafeStorage();
    storage.set('k1', 'v1');
    storage.set('k2', 'v2');

    storage.remove('k1');
    assert.equal(storage.get('k1'), null);
    assert.equal(storage.get('k2'), 'v2');

    storage.clear();
    assert.equal(storage.get('k2'), null);
  });
});
