export const STORE_CONFIG = Object.freeze({
  currencyCode: 'EGP',
  currencyLabel: 'EGP',
  locale: 'en-EG',
  fulfillmentLabel: 'Egypt delivery',
  deliveryRegion: 'Ismailia · Egypt',
  deliveryNote: 'Delivery confirmed in WhatsApp',
});

export function formatCurrency(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return 'Price to confirm';

  return `${STORE_CONFIG.currencyLabel} ${amount.toLocaleString(STORE_CONFIG.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
