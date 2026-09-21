import { CatalogLink } from '../catalog/CatalogLink.jsx';
import { TomaIcon } from '../TomaIcon.jsx';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export function ShopBundleCard({ bundle, onAdd }) {
  return <article className="shop-bundle-card" style={{ '--bundle-tone': bundle.tone }}><CatalogLink className="shop-bundle-art-link" item={bundle} ariaLabel={`View ${bundle.name}`}><div className="shop-bundle-art">{bundle.image ? <img className="shop-bundle-image" src={bundle.image} alt="" /> : null}<span className="bundle-orbit orbit-one"></span><span className="bundle-orbit orbit-two"></span><div className="bundle-stamp"><img src="/assets/toma-bean-mark-128.png" alt="" /><strong>toma</strong><small>{bundle.name.toUpperCase()}</small></div></div></CatalogLink><div className="shop-bundle-copy"><p className="shop-card-kicker">{bundle.badge}</p><h3><CatalogLink item={bundle}>{bundle.name}</CatalogLink></h3><p className="shop-bundle-subtitle">{bundle.subtitle}</p><p>{bundle.description}</p><div className="shop-bundle-footer"><div><strong>{bundle.priceLabel}</strong><small>{bundle.compareLabel}</small></div><button className="button button-brass" type="button" onClick={() => onAdd(bundle)}>Add bundle <TomaIcon icon={faArrowUpRightFromSquare} /></button></div><small className="shop-bundle-items">{bundle.itemsLabel}</small></div></article>;
}
