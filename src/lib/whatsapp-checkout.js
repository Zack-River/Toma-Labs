export const TOMA_WHATSAPP_NUMBER = '201553677070';
import { formatCurrency } from './pricing.js';

export function createWhatsAppQuestionUrl(message) {
  const question = typeof message === 'string' && message.trim()
    ? message.trim()
    : 'Hi TOMA, I have a question about my coffee.';
  return `https://wa.me/${TOMA_WHATSAPP_NUMBER}?text=${encodeURIComponent(question)}`;
}

export const PAYMENT_METHODS = Object.freeze([
  { id: 'instapay', label: 'InstaPay' },
  { id: 'online-wallet', label: 'Online wallet' },
  { id: 'cash-on-delivery', label: 'Cash on delivery' },
]);

function cleanMessageValue(value, maxLength) {
  return typeof value === 'string'
    ? value.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength)
    : '';
}

function paymentLabel(paymentMethod) {
  return PAYMENT_METHODS.find((option) => option.id === paymentMethod)?.label || '';
}

export function validateCheckoutDetails(details = {}) {
  const values = {
    name: cleanMessageValue(details.name, 120),
    phone: cleanMessageValue(details.phone, 30),
    address: cleanMessageValue(details.address, 240),
    paymentMethod: typeof details.paymentMethod === 'string' ? details.paymentMethod : '',
  };
  const errors = {};

  if (values.name.length < 2) errors.name = 'Enter the name for the delivery.';
  if (!/^[0-9+() .-]{7,30}$/.test(values.phone)) errors.phone = 'Enter a valid phone number.';
  if (values.address.length < 8) errors.address = 'Enter the full delivery address.';
  if (!paymentLabel(values.paymentMethod)) errors.paymentMethod = 'Choose a payment method.';

  return { valid: Object.keys(errors).length === 0, errors, values };
}

function formatItemPrice(item) {
  if (!item.priceKnown || !Number.isFinite(Number(item.unitPrice))) return 'price to confirm';
  const unitPrice = formatCurrency(item.unitPrice);
  const lineTotal = formatCurrency(Number(item.unitPrice) * item.quantity);
  return `${unitPrice} each = ${lineTotal}`;
}

export function buildWhatsAppOrderMessage({ cart, totals, customer }) {
  const checked = validateCheckoutDetails(customer);
  const lines = [
    'Hi TOMA, I would like to place an order.',
    '',
    'CUSTOMER DETAILS',
    `Name: ${checked.values.name}`,
    `Phone: ${checked.values.phone}`,
    `Delivery address: ${checked.values.address}`,
    `Payment method: ${paymentLabel(checked.values.paymentMethod)}`,
    '',
    'ORDER',
    ...cart.map((item) => `- ${cleanMessageValue(item.name, 120)} × ${item.quantity} — ${formatItemPrice(item)}`),
    '',
    `TOTAL: ${totals.hasPendingQuote ? 'Quote required for custom blend items' : formatCurrency(totals.knownTotal)}`,
  ];
  return lines.join('\n');
}

export function createWhatsAppCheckoutUrl({ cart, totals, customer }) {
  const message = buildWhatsAppOrderMessage({ cart, totals, customer });
  return `https://wa.me/${TOMA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
