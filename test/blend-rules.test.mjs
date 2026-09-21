import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BLEND_CONFIG,
  buildQuote,
  createDefaultDraft,
  getGuide,
  getProfile,
  getStarterDraft,
  validateDraft,
} from '../src/lib/blend-rules.js';

test('each approved goal loads a complete starter draft', () => {
  const draft = getStarterDraft('quiet');

  assert.equal(draft.goalId, 'quiet');
  assert.equal(draft.formatId, 'turkish');
  assert.equal(draft.body, 'balanced');
  assert.equal(draft.roast, 'light');
  assert.equal(draft.packSizeGrams, 50);
  assert.equal(validateDraft(draft).valid, true);
});

test('a draft above the configured addition cap cannot be quoted', () => {
  const draft = { ...createDefaultDraft(), additionPercent: BLEND_CONFIG.addition.maxPercent + 1 };
  const quote = buildQuote(draft);

  assert.equal(quote.valid, false);
  assert.match(quote.errors.join(' '), /balanced range/i);
});

test('TOMA Guide warns when body and roast would create a heavy cup', () => {
  const guide = getGuide({ ...createDefaultDraft(), body: 'full', roast: 'dark' });

  assert.equal(guide.tone, 'warning');
  assert.match(guide.title, /restrained/i);
  assert.match(guide.recommendation, /plain|light/i);
});

test('TOMA Guide warns near the configured aromatic maximum', () => {
  const guide = getGuide({ ...createDefaultDraft(), additionPercent: BLEND_CONFIG.addition.recommendedMaxPercent });

  assert.equal(guide.tone, 'warning');
  assert.match(guide.title, /maximum balanced amount/i);
});

test('profile values stay within simple customer-facing scales', () => {
  const profile = getProfile({ ...createDefaultDraft(), body: 'full', roast: 'dark', additionPercent: 8 });

  for (const value of Object.values(profile)) {
    assert.ok(value >= 0 && value <= 100);
  }
  assert.ok(profile.body > profile.aroma / 2);
});

test('MVP quote exposes a temporary showcase price while live pricing is pending', () => {
  const quote = buildQuote(createDefaultDraft());

  assert.equal(quote.valid, true);
  assert.equal(quote.priceLabel, 'EGP 600');
  assert.equal(quote.serverValidated, false);
  assert.equal(quote.preparationTime, '2–3 working days');
});
