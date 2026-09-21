import { Link, Navigate, useParams } from 'react-router-dom';
import { StoreFooter } from '../components/StoreFooter.jsx';
import { StoreHeader } from '../components/StoreHeader.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { getCatalogItem } from '../lib/catalog.js';
import { STORE_CONFIG } from '../lib/store-config.js';
import { TomaIcon } from '../components/TomaIcon.jsx';
import { faArrowLeft, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const BREW_GUIDANCE = Object.freeze({
  everyday: 'A dependable daily cup. Brew it the way your morning already knows.',
  turkish: 'Use a fine Turkish grind and let the cup settle before the first sip.',
  instant: 'Add hot water, stir, and keep the shortcut honest with a clean finish.',
});

function getProductDetails(product) {
  const isBundle = product.id.startsWith('bundle-');

  return {
    ingredients: isBundle ? product.subtitle : product.subtitle,
    format: product.sizeLabel || product.itemsLabel,
    brew: isBundle ? 'Choose the format that fits the moment, then brew each cup as recommended on its pack.' : BREW_GUIDANCE[product.category] || BREW_GUIDANCE.everyday,
    availability: `${STORE_CONFIG.fulfillmentLabel} · ${STORE_CONFIG.deliveryNote}`,
    notes: product.notes || 'Selected around a real coffee rhythm.',
  };
}

export function ProductPage() {
  const { productId } = useParams();
  const { addLine, showToast } = useStorefront();
  const product = getCatalogItem(productId);

  if (!product) return <Navigate to="/shop" replace />;

  const details = getProductDetails(product);

  function addProduct() {
    addLine(product);
    showToast(`${product.name} added to your bag.`);
  }

  return <div className="product-page route-page">
    <StoreHeader />
    <main id="main-content">
      <section className="product-detail-hero">
        <div className="product-detail-art"><img src={product.image} alt={`${product.name} product scene`} /><span>{product.badge}</span></div>
        <div className="product-detail-copy">
          <Link className="product-back-link" to="/shop"><TomaIcon icon={faArrowLeft} /> Back to the shelf</Link>
          <p className="shop-eyebrow">{product.categoryLabel || 'TOMA collection'}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-subtitle">{product.subtitle}</p>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-price"><strong>{product.priceLabel}</strong><span>{details.format}</span></div>
          <button className="button button-brass" type="button" onClick={addProduct}>Add to bag <TomaIcon icon={faArrowUpRightFromSquare} /></button>
        </div>
      </section>
      <section className="product-detail-information" aria-labelledby="product-information-title">
        <div className="product-detail-heading"><p className="shop-eyebrow">Know the cup</p><h2 id="product-information-title">A clear reason<br /><em>to choose it.</em></h2></div>
        <div className="product-detail-facts">
          <article><span>WHAT IS IN IT</span><h3>Ingredients</h3><p>{details.ingredients}</p></article>
          <article><span>HOW IT SHOWS UP</span><h3>Character</h3><p>{details.notes}</p></article>
          <article><span>HOW TO PREPARE</span><h3>Brew guidance</h3><p>{details.brew}</p></article>
          <article><span>DELIVERY</span><h3>Availability</h3><p>{details.availability}</p></article>
        </div>
      </section>
      <section className="product-detail-next"><div><p className="shop-eyebrow">Still deciding?</p><h2>Find the direction<br /><em>that fits your moment.</em></h2></div><div className="destination-actions"><Link className="button button-brass" to="/find-your-coffee">Find your coffee <TomaIcon icon={faArrowUpRightFromSquare} /></Link><Link className="button button-line" to="/blend-lab">Make a custom blend <TomaIcon icon={faArrowUpRightFromSquare} /></Link></div></section>
    </main>
    <StoreFooter />
  </div>;
}
