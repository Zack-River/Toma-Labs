import { CatalogLink } from '../catalog/CatalogLink.jsx';

export function ShopProductCard({ product, onAdd }) {
  return <article className="shop-product-card">
    <div className="shop-product-visual" style={{ '--product-tone': product.tone }}>
      <CatalogLink className="shop-product-visual-link" item={product} ariaLabel={`View ${product.name}`}>
        {product.image ? <><img src={product.image} alt={`${product.name} product scene`} /><span className="shop-product-logo" aria-hidden="true"><img src="/assets/toma-bean-mark.png" alt="" /></span></> : <div className="shop-mock-pack" aria-hidden="true"><img src="/assets/toma-bean-mark.png" alt="" /><strong>toma</strong><span>{product.name.toUpperCase()}</span><i></i></div>}
      </CatalogLink>
      <span className="shop-product-badge">{product.badge}</span>
      <button className="shop-quick-add" type="button" onClick={() => onAdd(product)} aria-label={`Quick add ${product.name}`}>Quick add <span aria-hidden="true">+</span></button>
    </div>
    <div className="shop-product-info"><div className="shop-product-title"><div><p className="shop-card-kicker">{product.categoryLabel}</p><h3><CatalogLink item={product}>{product.name}</CatalogLink></h3></div><strong>{product.priceLabel}</strong></div><p className="shop-product-subtitle">{product.subtitle}</p><p className="shop-product-description">{product.description}</p><div className="shop-product-footer"><small>{product.sizeLabel} · {product.notes}</small><button type="button" onClick={() => onAdd(product)}>Add to bag <span aria-hidden="true">↗</span></button></div></div>
  </article>;
}
