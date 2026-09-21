import { BODY_OPTIONS, GOALS, ROAST_OPTIONS } from './blend-rules.js';
import { formatCurrency } from './pricing.js';
import { SHOP_PRODUCTS } from './shop-data.js';

const PROFILE_KEY_PREFIX = 'toma-profile-v1';

const PRODUCT_CATALOG = Object.freeze(Object.fromEntries(SHOP_PRODUCTS.map((product) => [product.id, {
  name: product.name,
  subtitle: product.subtitle,
  image: product.image,
  tone: product.tone,
}])));

const LEGACY_PRODUCT_IDS = Object.freeze({
  'house-ritual-100g': 'house-medium-100g',
  'cardamom-ritual-50g': 'cardamom-ritual-100g',
});

function normalizeOrders(orders) {
  return orders.map((order) => ({
    ...order,
    items: (order.items || []).map((item) => {
      const productId = LEGACY_PRODUCT_IDS[item.productId] || item.productId;
      return { ...item, productId, name: PRODUCT_CATALOG[productId]?.name || item.name };
    }),
  }));
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage may be disabled. */ }
}

function profileKey(session) {
  return `${PROFILE_KEY_PREFIX}-${session.userId || session.email}`;
}

function createSeedProfile(session) {
  return {
    userId: session.userId,
    isMock: true,
    preferences: {
      momentId: 'morning',
      body: 'balanced',
      roast: 'medium',
      additionPercent: 0,
      formatId: 'turkish',
    },
    customBlends: [
      { id: 'blend-morning-ember', name: 'Morning Ember', subtitle: 'Balanced body / Medium roast / Cardamom · 2%', packSizeGrams: 100, status: 'Saved blend', createdAt: 'Aug 18, 2026', tone: '#b77b43' },
      { id: 'blend-soft-hour', name: 'Soft Hour', subtitle: 'Light body / Light roast / Plain coffee', packSizeGrams: 50, status: 'Saved blend', createdAt: 'Jul 30, 2026', tone: '#e0bd7b' },
    ],
    orders: [
      { id: 'TOMA-1042', date: 'Aug 29, 2026', status: 'Delivered', totalLabel: formatCurrency(950), items: [{ productId: 'turbo-mode-50g', name: 'TOMA Turbo Mode', quantity: 2 }, { productId: 'cardamom-ritual-100g', name: 'Cardamom Ritual', quantity: 1 }] },
      { id: 'TOMA-1018', date: 'Aug 11, 2026', status: 'Delivered', totalLabel: formatCurrency(650), items: [{ productId: 'turbo-mode-50g', name: 'TOMA Turbo Mode', quantity: 1 }, { productId: 'house-medium-100g', name: 'House Medium', quantity: 1 }] },
      { id: 'TOMA-0984', date: 'Jul 21, 2026', status: 'Delivered', totalLabel: formatCurrency(250), items: [{ productId: 'turbo-mode-50g', name: 'TOMA Turbo Mode', quantity: 1 }] },
    ],
  };
}

function normalizeProfile(profile, session) {
  const seed = createSeedProfile(session);
  return {
    ...seed,
    ...profile,
    userId: session.userId,
    preferences: { ...seed.preferences, ...(profile?.preferences || {}) },
    customBlends: Array.isArray(profile?.customBlends) ? profile.customBlends : seed.customBlends,
    orders: normalizeOrders(Array.isArray(profile?.orders) ? profile.orders : seed.orders),
  };
}

export function getProfileData(session) {
  if (!session?.userId && !session?.email) return null;
  const seed = createSeedProfile(session);
  return normalizeProfile(readJson(profileKey(session), seed), session);
}

export function saveProfileData(session, profile) {
  if (!session?.userId && !session?.email) return null;
  const next = normalizeProfile(profile, session);
  writeJson(profileKey(session), next);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('toma:profile-updated', { detail: { profile: next } }));
  return next;
}

export function updateProfilePreferences(session, changes) {
  const current = getProfileData(session);
  return current ? saveProfileData(session, { ...current, preferences: { ...current.preferences, ...changes } }) : null;
}

export function addCustomBlend(session, blend) {
  const current = getProfileData(session);
  if (!current || !blend?.id) return current;
  const nextBlend = {
    id: blend.id,
    name: blend.name || 'Your TOMA Blend',
    subtitle: blend.subtitle || 'Custom TOMA blend',
    packSizeGrams: blend.packSizeGrams || 50,
    status: 'Saved blend',
    createdAt: 'Just now',
    tone: blend.tone || '#b77b43',
  };
  return saveProfileData(session, { ...current, customBlends: [nextBlend, ...current.customBlends.filter((item) => item.id !== nextBlend.id)] });
}

export function getMostOrderedProducts(orders = []) {
  const counts = new Map();
  orders.forEach((order) => order.items?.forEach((item) => {
    const current = counts.get(item.productId) || { productId: item.productId, quantity: 0, ordersCount: 0 };
    current.quantity += Number(item.quantity) || 0;
    current.ordersCount += 1;
    counts.set(item.productId, current);
  }));
  return [...counts.values()]
    .sort((a, b) => b.quantity - a.quantity || b.ordersCount - a.ordersCount)
    .slice(0, 3)
    .map((item, index) => ({
      rank: index + 1,
      ...item,
      ...(PRODUCT_CATALOG[item.productId] || { name: item.productId, subtitle: 'TOMA coffee', tone: '#6e3b21' }),
    }));
}

export function getPreferenceLabels(preferences) {
  return {
    moment: GOALS.find((goal) => goal.id === preferences.momentId)?.label || 'Start my day',
    body: BODY_OPTIONS.find((option) => option.id === preferences.body)?.label || 'Balanced',
    roast: ROAST_OPTIONS.find((option) => option.id === preferences.roast)?.label || 'Medium',
    addition: preferences.additionPercent ? `Cardamom · ${preferences.additionPercent}%` : 'Plain coffee',
  };
}
