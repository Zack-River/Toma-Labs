import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
};
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) { this.type = type; this.detail = init.detail; }
};
globalThis.window = { dispatchEvent: () => true };

const admin = await import(`../src/lib/admin-state.js?test=${Date.now()}`);

test('admin overview derives EGP revenue and order health from shared order data', () => {
  const data = admin.getAdminData();
  const stats = admin.getAdminStats(data.orders);

  assert.equal(stats.totalOrders, 11);
  assert.equal(stats.completedOrders, 7);
  assert.equal(stats.revenue, 5100);
  assert.equal(admin.getTopSoldProducts(data.orders, data.products, data.bundles)[0].name, 'TOMA Turbo Mode');
  assert.equal(admin.getRevenueSeries(data.orders).length, 6);
});

test('checkout creates a pending admin order before the WhatsApp handoff', () => {
  const data = admin.getAdminData();
  const next = admin.createAdminOrderFromCheckout({
    cart: [{ id: 'turbo-mode-50g', name: 'TOMA Turbo Mode', quantity: 2 }],
    totals: { knownTotal: 500, hasPendingQuote: false },
    customer: { name: 'Test Customer', phone: '+201000000000', paymentMethod: 'instapay' },
    customerId: 'client-test',
  });

  assert.equal(next.orders.length, data.orders.length + 1);
  assert.equal(next.orders[0].status, 'pending');
  assert.equal(next.orders[0].total, 500);
  assert.equal(next.orders[0].payment, 'InstaPay');
});
