import test from 'node:test';
import assert from 'node:assert/strict';
import { createShoppingItem, isMarket, parseHmProductUrl, purchaseUrl, sameShoppingVariant, validateGarmentImage } from '../src/commerce/hm.ts';

// Synthetic references: these are not advertised products or live stock fixtures.
const url = 'https://www2.hm.com/fr_fr/productpage.0000000001.html';
const file = new File([new Uint8Array([1, 2, 3])], 'fixture.png', { type: 'image/png' });
const input = { url, market: 'FR', name: 'Test garment', size: 'M', color: 'Blue', image: file };
const make = (patch = {}) => createShoppingItem({ ...input, ...patch }, 'fixture-id', new Date('2026-09-14T00:00:00Z'));

test('official product links lose tracking parameters, preserving reference and market', () => {
  assert.deepEqual(parseHmProductUrl(url + '?tracking=example#size', 'FR'), { url, productId: '0000000001' });
});
test('reject unsafe hosts, credentials, ports, protocols and non-product paths', () => {
  for (const invalid of ['https://www2.hm.com.evil.example/fr_fr/productpage.1.html',
    'https://www2.hm.com@evil.example/fr_fr/productpage.1.html',
    'http://www2.hm.com/fr_fr/productpage.1.html', 'javascript:alert(1)',
    'https://user:password@www2.hm.com/fr_fr/productpage.1.html',
    'https://www2.hm.com:444/fr_fr/productpage.1.html', 'https://www2.hm.com/fr_fr/index.html']) {
    assert.throws(() => parseHmProductUrl(invalid, 'FR'), /url/);
  }
});
test('country choice never rewrites a product into another market', () => {
  assert.throws(() => parseHmProductUrl(url, 'ES'), /marketMismatch/);
  assert.equal(purchaseUrl(make(), 'ES'), null);
  assert.equal(purchaseUrl(make(), 'FR'), url);
  assert.equal(purchaseUrl({ ...make(), url: 'https://evil.example/' }, 'FR'), null);
});
test('unknown countries and inherited object properties are rejected', () => {
  assert.equal(isMarket('FR'), true);
  for (const value of ['US', '__proto__', 'constructor', undefined, null]) assert.equal(isMarket(value), false);
});
test('manual imports cannot claim stock or a price', () => {
  const item = make({ availability: 'in_stock', price: 1 });
  assert.equal(item.availability, 'unknown');
  assert.equal(item.source, 'manual');
  assert.equal('price' in item, false);
});
test('required variant details are validated', () => {
  for (const patch of [{ name: ' ' }, { size: '' }, { color: '' }, { name: 'x'.repeat(121) }])
    assert.throws(() => make(patch), /details/);
});
test('same product may have different sizes, colors or markets', () => {
  assert.equal(sameShoppingVariant(make(), make({ size: ' m ', color: ' blue ' })), true);
  assert.equal(sameShoppingVariant(make(), make({ size: 'L' })), false);
  assert.equal(sameShoppingVariant(make(), make({ color: 'Black' })), false);
});
test('reject unsuitable or oversized image uploads', () => {
  assert.throws(() => validateGarmentImage(new File([], 'empty.png', { type: 'image/png' })), /image/);
  assert.throws(() => validateGarmentImage(new File(['<svg/>'], 'image.svg', { type: 'image/svg+xml' })), /image/);
  assert.throws(() => validateGarmentImage(new File([new Uint8Array(8 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' })), /image/);
});
