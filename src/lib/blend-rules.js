/**
 * TOMA Blend Lab's launch configuration boundary.
 *
 * The values in this file are deliberately shaped like catalog/API responses.
 * Replace this module with GET /blend-goals, /blend-rules, and POST /blend/quote
 * when the commerce service is connected. The browser is never the final
 * authority on price, inventory, market, or recipe validity.
 */

import { MVP_PRICING } from './pricing.js';

export const BLEND_CONFIG = Object.freeze({
  market: 'EG',
  format: {
    id: 'turkish',
    label: 'Turkish coffee',
    description: 'Fine-ground coffee prepared for a small, concentrated cup.',
    grind: 'Fine Turkish grind',
    baseSku: 'TOMA-BLEND-BASE-TURKISH',
  },
  // These pack sizes and copy are configuration placeholders until TOMA
  // confirms the live custom-blend catalog.
  packSizes: [
    { grams: 50, label: '50g', available: true },
    { grams: 100, label: '100g', available: true },
    { grams: 250, label: '250g', available: true },
    { grams: 500, label: '500g', available: true },
  ],
  addition: {
    id: 'cardamom',
    label: 'Cardamom',
    description: 'A measured aromatic addition for a warmer finish.',
    minPercent: 0,
    recommendedMinPercent: 2,
    recommendedMaxPercent: 5,
    maxPercent: 8,
    compatibleFormats: ['turkish'],
  },
  quote: {
    priceLabel: MVP_PRICING.customBlendPriceLabel,
    currencyLabel: MVP_PRICING.currency,
    preparationTime: '2–3 working days',
    deliveryRule: 'Confirm in WhatsApp',
  },
});

export const GOALS = Object.freeze([
  {
    id: 'morning',
    number: '01',
    label: 'Start my day',
    shortLabel: 'A dependable first cup',
    message: 'Start clear, then make it yours.',
    recommendation: 'Start with a medium roast and balanced body. It gives the coffee a familiar centre to build from.',
    readyMade: 'Turbo Mode is the ready-made path for this moment.',
    defaults: { body: 'balanced', roast: 'medium', additionPercent: 0 },
  },
  {
    id: 'work',
    number: '02',
    label: 'Work or a long session',
    shortLabel: 'A fuller routine',
    message: 'Build presence before adding complexity.',
    recommendation: 'Begin with fuller body and keep the roast readable. You can add aroma after the coffee has a clear shape.',
    readyMade: null,
    defaults: { body: 'full', roast: 'medium', additionPercent: 0 },
  },
  {
    id: 'after-lunch',
    number: '03',
    label: 'After lunch',
    shortLabel: 'A cleaner finish',
    message: 'Let aroma lead; keep the cup light on its feet.',
    recommendation: 'A lighter body with a medium roast keeps the finish easy to read and leaves room for a measured aromatic note.',
    readyMade: null,
    defaults: { body: 'light', roast: 'medium', additionPercent: 2 },
  },
  {
    id: 'gathering',
    number: '04',
    label: 'Gathering',
    shortLabel: 'Balanced around a table',
    message: 'A balanced cup travels well around a table.',
    recommendation: 'Balanced body and roast make a clear starting point when more than one person is sharing the cup.',
    readyMade: null,
    defaults: { body: 'balanced', roast: 'medium', additionPercent: 2 },
  },
  {
    id: 'quiet',
    number: '05',
    label: 'Quiet ritual',
    shortLabel: 'A slower sensory cup',
    message: 'Protect the finish and give character room.',
    recommendation: 'Medium roast and balanced body keep the aroma present without making the finish heavy.',
    readyMade: null,
    defaults: { body: 'balanced', roast: 'light', additionPercent: 2 },
  },
  {
    id: 'discover',
    number: '06',
    label: 'Discover a new taste',
    shortLabel: 'Change one thing at a time',
    message: 'Change one thing at a time so you can learn your taste.',
    recommendation: 'Keep the structure familiar, then use one measured addition as the clear point of difference.',
    readyMade: null,
    defaults: { body: 'balanced', roast: 'medium', additionPercent: 3 },
  },
]);

export const BODY_OPTIONS = Object.freeze([
  { id: 'light', label: 'Light', effect: 'A more lifted, easy-moving cup.' },
  { id: 'balanced', label: 'Balanced', effect: 'A clear centre with body and finish in proportion.' },
  { id: 'full', label: 'Full', effect: 'A denser cup that stays present after the first sip.' },
]);

export const ROAST_OPTIONS = Object.freeze([
  { id: 'light', label: 'Light', effect: 'Brighter roast character and a lighter cup tone.' },
  { id: 'medium', label: 'Medium', effect: 'A familiar coffee centre with room for aroma.' },
  { id: 'dark', label: 'Dark', effect: 'Deeper roast character and a more intense finish.' },
]);

const BODY_VALUES = Object.freeze({ light: 34, balanced: 56, full: 78 });
const ROAST_VALUES = Object.freeze({ light: 34, medium: 56, dark: 78 });

export function getGoal(goalId) {
  return GOALS.find((goal) => goal.id === goalId) || GOALS[0];
}

export function getStarterDraft(goalId) {
  const goal = getGoal(goalId);
  return {
    goalId: goal.id,
    formatId: BLEND_CONFIG.format.id,
    baseCoffeeSku: BLEND_CONFIG.format.baseSku,
    body: goal.defaults.body,
    roast: goal.defaults.roast,
    additionId: BLEND_CONFIG.addition.id,
    additionPercent: goal.defaults.additionPercent,
    packSizeGrams: BLEND_CONFIG.packSizes[0].grams,
    blendName: '',
  };
}

export function createDefaultDraft() {
  return getStarterDraft(GOALS[0].id);
}

export function validateDraft(draft) {
  const errors = [];
  const addition = draft.additionPercent || 0;
  const pack = BLEND_CONFIG.packSizes.find((item) => item.grams === draft.packSizeGrams);

  if (!GOALS.some((goal) => goal.id === draft.goalId)) errors.push('Choose a coffee moment to start.');
  if (draft.formatId !== BLEND_CONFIG.format.id) errors.push('This format is not available in the current catalog.');
  if (!BODY_VALUES[draft.body]) errors.push('Choose a body direction.');
  if (!ROAST_VALUES[draft.roast]) errors.push('Choose a roast direction.');
  if (addition < BLEND_CONFIG.addition.minPercent || addition > BLEND_CONFIG.addition.maxPercent) {
    errors.push('Keep the aromatic addition inside TOMA’s balanced range.');
  }
  if (!pack || !pack.available) errors.push('Choose an available pack size.');
  if (draft.blendName && (draft.blendName.length < 2 || draft.blendName.length > 24)) {
    errors.push('Blend names must be 2–24 characters.');
  }

  return { valid: errors.length === 0, errors };
}

export function getGuide(draft, previousDraft = null) {
  const addition = draft.additionPercent || 0;
  const changes = [];
  if (previousDraft && previousDraft.body !== draft.body) changes.push(`You moved from ${previousDraft.body} to ${draft.body} body.`);
  if (previousDraft && previousDraft.roast !== draft.roast) changes.push(`You moved from ${previousDraft.roast} to ${draft.roast} roast.`);
  if (previousDraft && (previousDraft.additionPercent || 0) !== addition) changes.push(`The aromatic addition is now ${addition}%.`);

  if (draft.body === 'full' && draft.roast === 'dark') {
    return {
      tone: 'warning',
      title: 'Keep aroma restrained.',
      whatChanged: changes[0] || 'Full body with a dark roast creates a heavier direction.',
      meaning: 'The cup will feel dense and intense, with a finish that stays present.',
      recommendation: 'Keep the addition plain or light so the coffee character stays readable.',
      nextAction: 'Try a lighter roast if you want more separation in the cup.',
    };
  }

  if (addition >= BLEND_CONFIG.addition.recommendedMaxPercent) {
    return {
      tone: 'warning',
      title: 'You are near TOMA’s maximum balanced amount.',
      whatChanged: changes[0] || `The addition is set to ${addition}%.`,
      meaning: 'Going further could cover the coffee rather than support it.',
      recommendation: `Stay at or below ${BLEND_CONFIG.addition.maxPercent}% for this configured format.`,
      nextAction: 'Keep this amount or return to the recommended range.',
    };
  }

  const bodyLabel = BODY_OPTIONS.find((option) => option.id === draft.body)?.label || 'Balanced';
  const roastLabel = ROAST_OPTIONS.find((option) => option.id === draft.roast)?.label || 'Medium';
  return {
    tone: 'guide',
    title: draft.additionPercent ? 'Let one warm note lead.' : 'Keep the coffee clear.',
    whatChanged: changes[0] || `Starting with ${bodyLabel.toLowerCase()} body and ${roastLabel.toLowerCase()} roast.`,
    meaning: BODY_OPTIONS.find((option) => option.id === draft.body)?.effect || 'A balanced starting point protects the coffee character.',
    recommendation: draft.roast === 'dark'
      ? 'Keep the body balanced so the roast does not crowd the finish.'
      : 'Move one direction at a time so you can tell what changed in the cup.',
    nextAction: draft.additionPercent ? 'Keep this measured addition or compare it with plain.' : 'Try a light aromatic addition if you want a warmer finish.',
  };
}

export function getProfile(draft) {
  const addition = draft.additionPercent || 0;
  const aroma = Math.min(92, 24 + addition * 7 + (draft.roast === 'light' ? 8 : 0));
  const bitterness = Math.min(88, 25 + (draft.roast === 'dark' ? 42 : draft.roast === 'medium' ? 25 : 12));
  return {
    body: BODY_VALUES[draft.body] || BODY_VALUES.balanced,
    roast: ROAST_VALUES[draft.roast] || ROAST_VALUES.medium,
    aroma,
    bitterness,
  };
}

export function buildQuote(draft) {
  const validation = validateDraft(draft);
  return {
    status: validation.valid ? 'ready' : 'invalid',
    valid: validation.valid,
    errors: validation.errors,
    priceLabel: BLEND_CONFIG.quote.priceLabel,
    currencyLabel: BLEND_CONFIG.quote.currencyLabel,
    preparationTime: BLEND_CONFIG.quote.preparationTime,
    deliveryRule: BLEND_CONFIG.quote.deliveryRule,
    // This is the seam for POST /blend/quote. Do not use a browser price at checkout.
    serverValidated: false,
  };
}

export function getReadableAddition(draft) {
  return draft.additionPercent
    ? `${BLEND_CONFIG.addition.label} · ${draft.additionPercent}%`
    : 'Plain coffee';
}
