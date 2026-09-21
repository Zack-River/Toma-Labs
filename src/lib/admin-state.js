import { formatCurrency } from './pricing.js';
import { SHOP_BUNDLES, SHOP_CATEGORIES, SHOP_PRODUCTS } from './shop-data.js';

export const ADMIN_STORAGE_KEY = 'toma-admin-v1';

export const ORDER_STATUSES = Object.freeze([
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'canceled', label: 'Canceled' },
]);

const ADMIN_PRODUCTS = SHOP_PRODUCTS.map((product) => ({ ...product }));
const ADMIN_BUNDLES = SHOP_BUNDLES.map((bundle) => ({ ...bundle }));
const ADMIN_CATEGORIES = SHOP_CATEGORIES.filter((category) => category.id !== 'all').map((category) => ({ ...category }));

const ADMIN_ORDERS = [
  { id: 'TOMA-1042', date: '2026-09-18', customerId: 'client-mariam', customer: 'Mariam Hassan', status: 'completed', total: 950, payment: 'Cash on delivery', items: [{ productId: 'turbo-mode-50g', name: 'TOMA Turbo Mode', quantity: 2 }, { productId: 'cardamom-ritual-100g', name: 'Cardamom Ritual', quantity: 1 }] },
  { id: 'TOMA-1038', date: '2026-09-15', customerId: 'client-omar', customer: 'Omar Adel', status: 'pending', total: 750, payment: 'InstaPay', items: [{ productId: 'house-medium-100g', name: 'House Medium', quantity: 1 }, { productId: 'gold-instant-100g', name: 'Gold Instant', quantity: 1 }] },
  { id: 'TOMA-1031', date: '2026-09-11', customerId: 'client-salma', customer: 'Salma Nabil', status: 'completed', total: 600, payment: 'Online wallet', items: [{ productId: 'morning-classic-100g', name: 'Morning Classic', quantity: 1 }, { productId: 'turbo-mode-50g', name: 'TOMA Turbo Mode', quantity: 1 }] },
  { id: 'TOMA-1027', date: '2026-09-05', customerId: 'client-youssef', customer: 'Youssef Samir', status: 'canceled', total: 950, payment: 'Cash on delivery', items: [{ productId: 'cacao-night-100g', name: 'Cacao Night', quantity: 1 }, { productId: 'rose-cinnamon-100g', name: 'Rose Cinnamon', quantity: 1 }] },
  { id: 'TOMA-1022', date: '2026-08-28', customerId: 'client-nour', customer: 'Nour Tarek', status: 'completed', total: 550, payment: 'Cash on delivery', items: [{ productId: 'bundle-morning-mode', name: 'Morning Mode', quantity: 1 }] },
  { id: 'TOMA-1018', date: '2026-08-17', customerId: 'client-mariam', customer: 'Mariam Hassan', status: 'completed', total: 900, payment: 'InstaPay', items: [{ productId: 'quiet-decaf-100g', name: 'Quiet Decaf', quantity: 2 }] },
  { id: 'TOMA-1014', date: '2026-08-09', customerId: 'client-omar', customer: 'Omar Adel', status: 'pending', total: 1000, payment: 'Online wallet', items: [{ productId: 'bundle-discovery-three', name: 'Discovery Three', quantity: 1 }] },
  { id: 'TOMA-1009', date: '2026-07-26', customerId: 'client-salma', customer: 'Salma Nabil', status: 'completed', total: 750, payment: 'Cash on delivery', items: [{ productId: 'turbo-mode-50g', name: 'TOMA Turbo Mode', quantity: 3 }] },
  { id: 'TOMA-1003', date: '2026-06-19', customerId: 'client-youssef', customer: 'Youssef Samir', status: 'completed', total: 900, payment: 'InstaPay', items: [{ productId: 'orange-mocha-100g', name: 'Orange Mocha', quantity: 1 }, { productId: 'velvet-instant-100g', name: 'Velvet Instant', quantity: 1 }] },
  { id: 'TOMA-0998', date: '2026-05-13', customerId: 'client-nour', customer: 'Nour Tarek', status: 'canceled', total: 680, payment: 'Cash on delivery', items: [{ productId: 'bundle-instant-backup', name: 'Instant Backup', quantity: 1 }] },
  { id: 'TOMA-0991', date: '2026-04-21', customerId: 'client-mariam', customer: 'Mariam Hassan', status: 'completed', total: 450, payment: 'Cash on delivery', items: [{ productId: 'cardamom-ritual-100g', name: 'Cardamom Ritual', quantity: 1 }] },
];

const ADMIN_ACCOUNTS = [
  { id: 'client-mariam', firstName: 'Mariam', lastName: 'Hassan', email: 'mariam@example.com', phone: '+20 100 234 5678', joined: '2026-05-18', status: 'active' },
  { id: 'client-omar', firstName: 'Omar', lastName: 'Adel', email: 'omar@example.com', phone: '+20 101 345 6789', joined: '2026-06-02', status: 'active' },
  { id: 'client-salma', firstName: 'Salma', lastName: 'Nabil', email: 'salma@example.com', phone: '+20 102 456 7890', joined: '2026-06-15', status: 'active' },
  { id: 'client-youssef', firstName: 'Youssef', lastName: 'Samir', email: 'youssef@example.com', phone: '+20 103 567 8901', joined: '2026-07-01', status: 'active' },
  { id: 'client-nour', firstName: 'Nour', lastName: 'Tarek', email: 'nour@example.com', phone: '+20 104 678 9012', joined: '2026-07-22', status: 'inactive' },
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJson() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(value) {
  try { localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(value)); } catch { /* Storage may be disabled. */ }
}

export function createAdminSeedData() {
  return clone({ products: ADMIN_PRODUCTS, bundles: ADMIN_BUNDLES, categories: ADMIN_CATEGORIES, orders: ADMIN_ORDERS, accounts: ADMIN_ACCOUNTS });
}

export function getAdminData() {
  const seed = createAdminSeedData();
  const stored = readJson();
  if (!stored || typeof stored !== 'object') return seed;
  return {
    products: Array.isArray(stored.products) ? stored.products : seed.products,
    bundles: Array.isArray(stored.bundles) ? stored.bundles : seed.bundles,
    categories: Array.isArray(stored.categories) ? stored.categories : seed.categories,
    orders: Array.isArray(stored.orders) ? stored.orders : seed.orders,
    accounts: Array.isArray(stored.accounts) ? stored.accounts : seed.accounts,
  };
}

export function saveAdminData(data) {
  const next = clone(data);
  writeJson(next);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('toma:admin-updated', { detail: { data: next } }));
  return next;
}

export function createAdminOrderFromCheckout({ cart = [], totals = {}, customer = {}, customerId = 'guest' }) {
  const data = getAdminData();
  const paymentLabels = { instapay: 'InstaPay', 'online-wallet': 'Online wallet', 'cash-on-delivery': 'Cash on delivery' };
  const nextOrder = {
    id: `TOMA-${String(Date.now()).slice(-6)}`,
    date: new Date().toISOString().slice(0, 10),
    customerId,
    customer: customer.name || 'Guest customer',
    phone: customer.phone || '',
    status: 'pending',
    total: Number(totals.knownTotal) || 0,
    quoteRequired: Boolean(totals.hasPendingQuote),
    payment: paymentLabels[customer.paymentMethod] || 'Payment to confirm',
    items: cart.map((item) => ({ productId: item.id, name: item.name, quantity: item.quantity })),
  };
  return saveAdminData({ ...data, orders: [nextOrder, ...data.orders] });
}

export function createAdminId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getOrderStatusLabel(status) {
  return ORDER_STATUSES.find((item) => item.id === status)?.label || 'Pending';
}

export function getAdminStats(orders = []) {
  const completedOrders = orders.filter((order) => order.status === 'completed');
  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const canceledOrders = orders.filter((order) => order.status === 'canceled');
  const revenue = completedOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  return {
    revenue,
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    pendingOrders: pendingOrders.length,
    canceledOrders: canceledOrders.length,
    averageOrderValue: completedOrders.length ? Math.round(revenue / completedOrders.length) : 0,
    pendingValue: pendingOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0),
  };
}

export function getRevenueSeries(orders = []) {
  const totals = new Map();
  orders.filter((order) => order.status === 'completed').forEach((order) => {
    const month = String(order.date || '').slice(0, 7);
    if (month) totals.set(month, (totals.get(month) || 0) + (Number(order.total) || 0));
  });
  const orderedKeys = [...totals.keys()].sort();
  const anchor = orderedKeys.length ? new Date(`${orderedKeys[orderedKeys.length - 1]}-01T00:00:00`) : new Date();
  const keys = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(anchor);
    date.setMonth(anchor.getMonth() - (5 - index));
    return date.toISOString().slice(0, 7);
  });
  return keys.map((key) => ({
    key,
    label: new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(`${key}-01T00:00:00`)),
    value: totals.get(key) || 0,
  }));
}

export function getTopSoldProducts(orders = [], products = [], bundles = [], limit = 5) {
  const catalog = new Map([...products, ...bundles].map((item) => [item.id, item]));
  const counts = new Map();
  orders.filter((order) => order.status === 'completed').forEach((order) => {
    order.items?.forEach((item) => {
      const current = counts.get(item.productId) || { productId: item.productId, name: item.name, quantity: 0, revenue: 0, type: item.productId?.startsWith('bundle-') ? 'bundle' : 'product' };
      const quantity = Number(item.quantity) || 0;
      current.quantity += quantity;
      current.revenue += quantity * (Number(catalog.get(item.productId)?.unitPrice) || 0);
      current.name = catalog.get(item.productId)?.name || current.name;
      counts.set(item.productId, current);
    });
  });
  return [...counts.values()].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue).slice(0, limit);
}

export function formatAdminDate(date) {
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export { formatCurrency };
