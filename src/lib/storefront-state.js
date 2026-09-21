/**
 * Shared state for the static storefront prototype.
 *
 * This keeps the pages connected while there is no backend yet. Replace the
 * functions that read/write storage with API calls when authentication,
 * inventory, cart pricing, and checkout are available server-side.
 */

import { formatCurrency, MVP_PRICING } from './pricing.js';

export const STORAGE_KEYS = Object.freeze({
  cart: 'toma-cart-v1',
  users: 'toma-users-v1',
  session: 'toma-session-v1',
  legacyBagCount: 'toma-bag-count',
});

export const PRODUCTS = Object.freeze({
  turboMode: Object.freeze({
    id: 'turbo-mode-50g',
    type: 'product',
    name: 'TOMA Turbo Mode',
    subtitle: 'Egyptian Turkish coffee / Korean red ginseng',
    packSizeGrams: 50,
    unitPrice: 250,
    currency: MVP_PRICING.currency,
    priceKnown: true,
    image: 'assets/toma-turbo-mode.jpg',
  }),
});

function readRaw(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function writeRaw(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Storage may be disabled. */ }
}

function readJson(key, fallback) {
  try {
    const raw = readRaw(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  writeRaw(key, JSON.stringify(value));
}

function syncLegacyBagCount() {
  writeRaw(STORAGE_KEYS.legacyBagCount, String(cartCount()));
}

function cleanText(value, maxLength = 120) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanCartItem(item) {
  if (!item || typeof item !== 'object' || !cleanText(item.id, 160)) return null;
  const quantity = Math.max(1, Math.min(99, Number.parseInt(item.quantity, 10) || 1));
  const storedUnitPrice = item.unitPrice === null || item.unitPrice === undefined || item.unitPrice === '' ? Number.NaN : Number(item.unitPrice);
  const priceLabel = cleanText(item.priceLabel, 80);
  const storedCurrency = cleanText(item.currency, 8);
  const currency = MVP_PRICING.currency;
  const legacyPriceMatch = priceLabel.match(/(?:[$€£]\s*)?(\d+(?:\.\d{1,2})?)/);
  const legacyCustomBlendPrice = item.type === 'custom-blend' && priceLabel.includes('CUSTOM BLEND PRICE') ? MVP_PRICING.customBlendUnitPrice : null;
  const unitPrice = Number.isFinite(storedUnitPrice) ? storedUnitPrice : legacyPriceMatch ? Number(legacyPriceMatch[1]) : legacyCustomBlendPrice;
  const priceKnown = Number.isFinite(unitPrice);
  const normalizedPriceLabel = priceKnown ? formatCurrency(unitPrice) : priceLabel;
  return {
    id: cleanText(item.id, 160),
    type: item.type === 'custom-blend' ? 'custom-blend' : 'product',
    name: cleanText(item.name, 120) || 'TOMA coffee',
    subtitle: cleanText(item.subtitle, 180),
    packSizeGrams: Number.parseInt(item.packSizeGrams, 10) || null,
    quantity,
    unitPrice: priceKnown ? unitPrice : null,
    currency,
    priceKnown,
    priceLabel: normalizedPriceLabel || (priceKnown ? `${currency}${unitPrice.toFixed(2)}` : '[CUSTOM BLEND PRICE]'),
    image: cleanText(item.image, 240),
    metadata: item.metadata && typeof item.metadata === 'object' ? item.metadata : {},
  };
}

export function getCart() {
  const stored = readJson(STORAGE_KEYS.cart, []);
  return Array.isArray(stored) ? stored.map(cleanCartItem).filter(Boolean) : [];
}

export function cartCount(cart = getCart()) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function cartTotals(cart = getCart()) {
  const knownTotal = cart.reduce((total, item) => total + (item.priceKnown ? item.unitPrice * item.quantity : 0), 0);
  const hasPendingQuote = cart.some((item) => !item.priceKnown);
  return {
    knownTotal,
    hasPendingQuote,
    label: hasPendingQuote ? '[QUOTE REQUIRED]' : formatCurrency(knownTotal),
  };
}

export function saveCart(cart) {
  const cleaned = cart.map(cleanCartItem).filter(Boolean);
  writeJson(STORAGE_KEYS.cart, cleaned);
  syncLegacyBagCount();
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('toma:cart-updated', { detail: { cart: cleaned } }));
  return cleaned;
}

export function addToCart(item) {
  const cleanItem = cleanCartItem({ ...item, quantity: item.quantity || 1 });
  if (!cleanItem) return getCart();
  const cart = getCart();
  const existing = cleanItem.type === 'product' ? cart.find((line) => line.id === cleanItem.id) : null;
  if (existing) existing.quantity = Math.min(99, existing.quantity + cleanItem.quantity);
  else cart.push(cleanItem);
  return saveCart(cart);
}

export function updateCartQuantity(id, quantity) {
  const nextQuantity = Math.max(0, Math.min(99, Number.parseInt(quantity, 10) || 0));
  return saveCart(getCart().map((item) => item.id === id ? { ...item, quantity: nextQuantity } : item).filter((item) => item.quantity > 0));
}

export function removeFromCart(id) {
  return saveCart(getCart().filter((item) => item.id !== id));
}

export function getSession() {
  const session = readJson(STORAGE_KEYS.session, null);
  return session && typeof session.email === 'string' ? session : null;
}

export function setSession(session) {
  const safeSession = {
    userId: cleanText(session.userId, 100),
    firstName: cleanText(session.firstName, 60),
    lastName: cleanText(session.lastName, 60),
    email: cleanText(session.email, 160).toLowerCase(),
  };
  writeJson(STORAGE_KEYS.session, safeSession);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('toma:auth-updated', { detail: { session: safeSession } }));
  return safeSession;
}

export function clearSession() {
  try { localStorage.removeItem(STORAGE_KEYS.session); } catch { /* Storage may be disabled. */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('toma:auth-updated', { detail: { session: null } }));
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(email, 160));
}

export function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}

async function hashPassword(password) {
  if (!globalThis.crypto?.subtle) throw new Error('Secure password hashing is unavailable in this browser.');
  const bytes = new TextEncoder().encode(password);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function signUp({ firstName, lastName, email, password }) {
  const normalizedEmail = cleanText(email, 160).toLowerCase();
  if (!cleanText(firstName, 60) || !cleanText(lastName, 60)) throw new Error('Enter your first and last name.');
  if (!validateEmail(normalizedEmail)) throw new Error('Enter a valid email address.');
  if (!validatePassword(password)) throw new Error('Use at least 8 characters with one letter and one number.');
  const users = readJson(STORAGE_KEYS.users, []);
  if (users.some((user) => user.email === normalizedEmail)) throw new Error('An account with this email already exists.');
  const user = { id: `user-${Date.now()}`, firstName: cleanText(firstName, 60), lastName: cleanText(lastName, 60), email: normalizedEmail, passwordHash: await hashPassword(password) };
  writeJson(STORAGE_KEYS.users, [...users, user]);
  return setSession(user);
}

export async function signIn({ email, password }) {
  const normalizedEmail = cleanText(email, 160).toLowerCase();
  if (!validateEmail(normalizedEmail) || typeof password !== 'string') throw new Error('Enter your email and password.');
  const user = readJson(STORAGE_KEYS.users, []).find((candidate) => candidate.email === normalizedEmail);
  if (!user || user.passwordHash !== await hashPassword(password)) throw new Error('We could not match those sign-in details.');
  return setSession(user);
}

export function safeReturnPath(value) {
  const allowed = new Set(['', '/', 'index.html', 'shop.html', 'blend-lab.html', 'find-your-coffee.html', 'why-toma.html', 'cart.html', 'login.html', 'signup.html', 'profile.html', 'shop', 'blend-lab', 'find-your-coffee', 'why-toma', 'cart', 'login', 'signup', 'profile']);
  try {
    const url = new URL(value || 'index.html', window.location.href);
    const route = url.pathname === '/' ? '/' : url.pathname.split('/').pop() || '/';
    if (url.origin !== window.location.origin || !allowed.has(route)) return '/';
    const target = route.endsWith('.html') || route === '/' ? route : `/${route}`;
    return `${target}${url.search}`;
  } catch {
    return '/';
  }
}
