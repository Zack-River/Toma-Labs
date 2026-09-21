import test from 'node:test';
import assert from 'node:assert/strict';

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
};
globalThis.window = {
  location: { href: 'https://toma.test/profile', origin: 'https://toma.test' },
  dispatchEvent: () => true,
};

const profile = await import(`../src/lib/profile-state.js?test=${Date.now()}`);

test('profile data is scoped to the signed-in user and exposes demo history', () => {
  const session = { userId: 'user-profile-test', email: 'profile@example.com', firstName: 'Profile', lastName: 'Tester' };
  const data = profile.getProfileData(session);

  assert.equal(data.userId, session.userId);
  assert.equal(data.customBlends.length, 2);
  assert.equal(data.orders.length, 3);
  assert.equal(profile.getMostOrderedProducts(data.orders)[0].name, 'TOMA Turbo Mode');
});

test('preference changes persist for the same profile', () => {
  const session = { userId: 'user-preference-test', email: 'preference@example.com' };
  profile.updateProfilePreferences(session, { roast: 'dark', additionPercent: 3 });

  const saved = profile.getProfileData(session);
  assert.equal(saved.preferences.roast, 'dark');
  assert.equal(saved.preferences.additionPercent, 3);
});

test('a new custom blend is added to the signed-in profile record', () => {
  const session = { userId: 'user-blend-test', email: 'blend@example.com' };
  profile.addCustomBlend(session, { id: 'blend-new', name: 'Afterglow', subtitle: 'Full body / Dark roast / Plain coffee', packSizeGrams: 250 });

  const saved = profile.getProfileData(session);
  assert.equal(saved.customBlends[0].name, 'Afterglow');
  assert.equal(saved.customBlends[0].packSizeGrams, 250);
});
