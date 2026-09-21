import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppOrderMessage, createWhatsAppCheckoutUrl, validateCheckoutDetails } from '../src/lib/whatsapp-checkout.js';

const customer = {
  name: 'Mariam Toma',
  phone: '+201012345678',
  address: '12 Coffee Street, Ismailia',
  paymentMethod: 'cash-on-delivery',
};

const cart = [
  { name: 'House Medium', quantity: 2, priceKnown: true, unitPrice: 8, currency: '$' },
  { name: 'Your Custom Blend', quantity: 1, priceKnown: false },
];

test('checkout details use an allowlisted payment method and clean line breaks', () => {
  const result = validateCheckoutDetails({ ...customer, address: '12 Coffee\nStreet, Ismailia' });
  assert.equal(result.valid, true);
  assert.equal(result.values.address, '12 Coffee Street, Ismailia');
  assert.equal(validateCheckoutDetails({ ...customer, paymentMethod: 'bitcoin' }).valid, false);
});

test('WhatsApp checkout message includes customer data, quantities, prices, and total', () => {
  const message = buildWhatsAppOrderMessage({ cart, totals: { knownTotal: 16, hasPendingQuote: true }, customer });
  assert.match(message, /Hi TOMA/);
  assert.match(message, /Name: Mariam Toma/);
  assert.match(message, /Phone: \+201012345678/);
  assert.match(message, /House Medium × 2 — EGP 8 each = EGP 16/);
  assert.match(message, /Your Custom Blend × 1 — price to confirm/);
  assert.match(message, /TOTAL: Quote required for custom blend items/);
});

test('WhatsApp checkout URL keeps the fixed TOMA destination and encoded message', () => {
  const url = createWhatsAppCheckoutUrl({ cart: cart.slice(0, 1), totals: { knownTotal: 16, hasPendingQuote: false }, customer });
  assert.match(url, /^https:\/\/wa\.me\/201553677070\?text=/);
  assert.match(decodeURIComponent(url.split('?text=')[1]), /Payment method: Cash on delivery/);
  assert.match(decodeURIComponent(url.split('?text=')[1]), /TOTAL: EGP 16/);
});

test('WhatsApp checkout formats the temporary custom-blend price', () => {
  const message = buildWhatsAppOrderMessage({
    cart: [{ name: 'Morning Ember', quantity: 2, priceKnown: true, unitPrice: 12, currency: '$' }],
    totals: { knownTotal: 24, hasPendingQuote: false },
    customer,
  });

  assert.match(message, /Morning Ember × 2 — EGP 12 each = EGP 24/);
  assert.match(message, /TOTAL: EGP 24/);
});
