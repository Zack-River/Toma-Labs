import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
};
globalThis.window = {
  location: { href: 'https://toma.test/cart.html', origin: 'https://toma.test' },
  dispatchEvent: () => true,
};

const store = await import(`../src/lib/storefront-state.js?test=${Date.now()}`);

test('cart state merges ready-made products and applies temporary custom blend pricing', () => {
  const turbo = { ...store.PRODUCTS.turboMode };
  store.addToCart(turbo);
  store.addToCart(turbo);
  store.addToCart({ id: 'custom-1', type: 'custom-blend', name: 'Morning Blend', quantity: 1, priceKnown: false, priceLabel: '[CUSTOM BLEND PRICE]' });

  const cart = store.getCart();
  assert.equal(cart.length, 2);
  assert.equal(cart.find((item) => item.id === turbo.id).quantity, 2);
  assert.equal(store.cartCount(cart), 3);
  assert.equal(cart.find((item) => item.id === 'custom-1').unitPrice, 600);
  assert.equal(store.cartTotals(cart).hasPendingQuote, false);
  assert.equal(store.cartTotals(cart).knownTotal, 1100);
});

test('ready-made products with a unit price are checkout-priced without an explicit flag', () => {
  store.addToCart({ id: 'house-medium', type: 'product', name: 'House Medium', unitPrice: 8, currency: '$' });
  const item = store.getCart().find((line) => line.id === 'house-medium');
  assert.equal(item.priceKnown, true);
  assert.equal(store.cartTotals(store.getCart()).knownTotal, 1108);
});

test('legacy ready-made cart labels recover a numeric unit price', () => {
  store.addToCart({ id: 'legacy-product', type: 'product', name: 'Legacy Coffee', priceLabel: '$7', currency: '$' });
  const item = store.getCart().find((line) => line.id === 'legacy-product');
  assert.equal(item.unitPrice, 7);
  assert.equal(item.priceKnown, true);
});

test('null legacy unit prices do not become zero', () => {
  store.addToCart({ id: 'null-price-product', type: 'product', name: 'Null Price Coffee', unitPrice: null, priceLabel: '$8', currency: '$' });
  const item = store.getCart().find((line) => line.id === 'null-price-product');
  assert.equal(item.unitPrice, 8);
  assert.notEqual(item.unitPrice, 0);
});

test('cart quantity updates and removal persist through the shared store', () => {
  store.updateCartQuantity('custom-1', 2);
  assert.equal(store.getCart().find((item) => item.id === 'custom-1').quantity, 2);
  store.removeFromCart('custom-1');
  assert.equal(store.getCart().some((item) => item.id === 'custom-1'), false);
});

test('demo account flow stores a hash, not the raw password, and signs in', async () => {
  const session = await store.signUp({ firstName: 'Zack', lastName: 'River', email: 'zack@example.com', password: 'coffee123' });
  assert.equal(session.email, 'zack@example.com');
  const users = JSON.parse(storage.get(store.STORAGE_KEYS.users));
  assert.equal(users[0].password, undefined);
  assert.notEqual(users[0].passwordHash, 'coffee123');
  store.clearSession();
  const signedIn = await store.signIn({ email: 'zack@example.com', password: 'coffee123' });
  assert.equal(signedIn.firstName, 'Zack');
});

test('return paths are restricted to same-origin storefront pages', () => {
  assert.equal(store.safeReturnPath('cart.html'), 'cart.html');
  assert.equal(store.safeReturnPath('/cart'), '/cart');
  assert.equal(store.safeReturnPath('https://example.com/steal'), '/');
  assert.equal(store.safeReturnPath('javascript:alert(1)'), '/');
});
