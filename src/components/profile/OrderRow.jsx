import { CatalogLink } from '../catalog/CatalogLink.jsx';

export function OrderRow({ order }) {
  return <article className="profile-order-row"><div><p className="profile-card-kicker">{order.id} / {order.date}</p><h3>{order.items.map((item, index) => <span key={item.productId}>{index ? ' · ' : ''}<CatalogLink id={item.productId}>{item.quantity} × {item.name}</CatalogLink></span>)}</h3><p className="profile-order-meta">{order.status} · {order.items.length} {order.items.length === 1 ? 'product' : 'products'}</p></div><strong>{order.totalLabel}</strong></article>;
}
