import { CatalogLink } from '../catalog/CatalogLink.jsx';
import { getMostOrderedProducts } from '../../lib/profile-state.js';

export function MostOrderedProducts({ orders }) {
  const products = getMostOrderedProducts(orders);
  return <section className="profile-panel most-ordered-panel" aria-labelledby="most-ordered-title"><div className="profile-panel-heading"><div><p className="eyebrow">A small pattern</p><h2 id="most-ordered-title">Most ordered.</h2></div><span className="profile-panel-note">Top 3 by quantity</span></div><div className="profile-product-grid">{products.map((product) => <CatalogLink className="profile-product-card" id={product.productId} ariaLabel={`View ${product.name}`} key={product.productId}><span className="profile-rank">0{product.rank}</span><div className="profile-product-art" style={{ '--product-tone': product.tone }} aria-hidden="true">{product.image ? <img src={product.image} alt="" /> : <span className="profile-product-cup"></span>}</div><div className="profile-product-copy"><h3>{product.name}</h3><p>{product.subtitle}</p><small>{product.quantity} total {product.quantity === 1 ? 'pack' : 'packs'} · {product.ordersCount} {product.ordersCount === 1 ? 'order' : 'orders'}</small></div></CatalogLink>)}</div></section>;
}
