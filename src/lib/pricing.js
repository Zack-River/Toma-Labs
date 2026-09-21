import { formatCurrency, STORE_CONFIG } from './store-config.js';

export const MVP_PRICING = Object.freeze({
  currency: STORE_CONFIG.currencyCode,
  customBlendUnitPrice: 600,
  customBlendPriceLabel: formatCurrency(600),
  note: 'Temporary showcase price',
});

export { formatCurrency };
