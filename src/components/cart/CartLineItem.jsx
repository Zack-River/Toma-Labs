import { CatalogLink } from '../catalog/CatalogLink.jsx';

export function CartLineItem({ item, onChangeQuantity, onRemove }) {
  const priceValue = item.priceKnown ? `${item.currency}${item.unitPrice.toFixed(2)}` : item.priceLabel;
  const catalogItem = item.type === 'custom-blend' ? null : item;
  return <article className="cart-line">
    {catalogItem ? <CatalogLink className="cart-thumb" item={catalogItem} ariaLabel={`View ${item.name}`}><img src={item.image || '/assets/toma-turbo-mode.jpg'} alt="" /></CatalogLink> : <div className="cart-thumb custom"><img src="/assets/toma-bean-mark.png" alt="" /><strong>toma</strong><span>BLEND LAB</span></div>}
    <div className="cart-line-details"><p className="eyebrow">{item.type === 'custom-blend' ? 'CUSTOM BLEND' : 'READY-MADE COFFEE'}</p><h2>{catalogItem ? <CatalogLink item={catalogItem}>{item.name}</CatalogLink> : item.name}</h2><p>{item.subtitle}</p><p className="cart-line-meta">{item.packSizeGrams ? `${item.packSizeGrams}g pack` : 'TOMA product'}</p></div>
    <div className="cart-price"><strong>{priceValue}</strong><small>{item.priceKnown ? 'Unit price' : 'Quote required before checkout'}</small><div className="quantity-control"><button type="button" onClick={() => onChangeQuantity(item.id, item.quantity - 1)} aria-label={`Decrease quantity of ${item.name}`}>−</button><output aria-live="polite">{item.quantity}</output><button type="button" onClick={() => onChangeQuantity(item.id, item.quantity + 1)} aria-label={`Increase quantity of ${item.name}`}>+</button></div><button className="remove-line" type="button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name} from bag`}>Remove</button></div>
  </article>;
}
