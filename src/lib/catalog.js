import { SHOP_BUNDLES, SHOP_PRODUCTS } from './shop-data.js';

export const CATALOG_ITEMS = Object.freeze([...SHOP_PRODUCTS, ...SHOP_BUNDLES]);

export function getCatalogItem(id) {
  return CATALOG_ITEMS.find((item) => item.id === id) || null;
}
