import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CatalogLink } from '../components/catalog/CatalogLink.jsx';
import { ShopBundleCard } from '../components/shop/ShopBundleCard.jsx';
import { ShopCategoryNav } from '../components/shop/ShopCategoryNav.jsx';
import { ShopHeroCarousel } from '../components/shop/ShopHeroCarousel.jsx';
import { ShopProductCard } from '../components/shop/ShopProductCard.jsx';
import { ShopReviewCard } from '../components/shop/ShopReviewCard.jsx';
import { StoreFooter } from '../components/StoreFooter.jsx';
import { StoreHeader } from '../components/StoreHeader.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { formatCurrency } from '../lib/pricing.js';
import { SHOP_BUNDLES, SHOP_CATEGORIES, SHOP_HERO_SLIDES, SHOP_OFFERS, SHOP_PRODUCTS, SHOP_PROOF, SHOP_REVIEWS } from '../lib/shop-data.js';
import { TomaIcon } from '../components/TomaIcon.jsx';
import { faArrowDown, faArrowUpRightFromSquare, faCircleInfo, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export function ShopPage() {
  const { addLine, showToast } = useStorefront();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  const visibleProducts = useMemo(() => SHOP_PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'bundles' || product.category === selectedCategory;
    const query = search.trim().toLowerCase();
    return matchesCategory && (!query || `${product.name} ${product.subtitle} ${product.notes}`.toLowerCase().includes(query));
  }), [search, selectedCategory]);

  function addProduct(item) {
    addLine(item);
    showToast(`${item.name} added to your bag.`);
  }

  function selectCategory(categoryId) {
    setSelectedCategory(categoryId);
    if (categoryId === 'bundles') document.querySelector('#bundles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else document.querySelector('#collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return <div className="shop-shell route-page">
    <StoreHeader />
    <main id="main-content">
      <ShopHeroCarousel slides={SHOP_HERO_SLIDES} />
      <section className="shop-category-section" id="categories"><div className="shop-wrap"><div className="shop-section-heading"><div><p className="shop-eyebrow">Choose a starting point</p><h2>Shop by<br /><em>direction.</em></h2></div><p>Some days call for a dependable first cup. Some call for a new note. Start with the direction, and TOMA will keep the shelf easy to read.</p></div><ShopCategoryNav categories={SHOP_CATEGORIES} selectedCategory={selectedCategory} onSelect={selectCategory} /></div></section>
      <section className="shop-collection-section" id="collection"><div className="shop-wrap"><div className="shop-collection-heading"><div><p className="shop-eyebrow">The TOMA shelf</p><h2>Ready-made<br /><em>coffee.</em></h2></div><div className="shop-collection-tools"><label className="shop-search"><TomaIcon icon={faMagnifyingGlass} /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the shelf" aria-label="Search the product shelf" /></label><div className="shop-filter-row" aria-label="Filter products">{SHOP_CATEGORIES.filter((category) => category.id !== 'bundles').map((category) => <button className={selectedCategory === category.id ? 'active' : ''} type="button" key={category.id} onClick={() => setSelectedCategory(category.id)}>{category.id === 'all' ? 'All' : category.label}</button>)}</div></div></div><div className="shop-catalog-note"><TomaIcon icon={faCircleInfo} /><p>MVP collection / prices and availability are configured placeholders until TOMA’s live catalog is connected.</p><span>Showing {visibleProducts.length} of {SHOP_PRODUCTS.length}</span></div>{selectedCategory === 'bundles' ? <div className="shop-no-products"><p className="shop-eyebrow">You are on the bundle path</p><h3>Good things are better together.</h3><p>Keep scrolling to see the current TOMA bundles.</p></div> : <div className="shop-product-grid">{visibleProducts.length ? visibleProducts.map((product) => <ShopProductCard key={product.id} product={product} onAdd={addProduct} />) : <div className="shop-empty-state"><h3>No cup found.</h3><p>Try a shorter search or return to the full shelf.</p><button type="button" onClick={() => { setSearch(''); setSelectedCategory('all'); }}>Show everything</button></div>}</div>}</div></section>
      <section className="shop-spotlight-section"><div className="shop-wrap"><div className="shop-spotlight"><CatalogLink className="shop-spotlight-art" item={SHOP_PRODUCTS[0]} ariaLabel={`View ${SHOP_PRODUCTS[0].name}`}><img src="/assets/toma-turbo-editorial.png" alt="TOMA Turbo Mode coffee package and cup" /><span className="spotlight-seal">THE<br />FIRST<br />DROP</span><span className="spotlight-logo" aria-hidden="true"><img src="/assets/toma-bean-mark-128.png" alt="" /></span></CatalogLink><div className="shop-spotlight-copy"><p className="shop-eyebrow">The product to know first</p><h2><CatalogLink item={SHOP_PRODUCTS[0]}>Turbo Mode<br /><em>for a little more drive.</em></CatalogLink></h2><p>Freshly ground Egyptian Turkish coffee with Korean red ginseng. The first TOMA product is made for a stronger daily ritual, without asking you to give up the care in the cup.</p><div className="shop-spotlight-details"><span><small>FORMAT</small>Turkish coffee</span><span><small>PACK</small>50g</span><span><small>PRICE</small>{formatCurrency(SHOP_PRODUCTS[0].unitPrice)}</span></div><button className="button button-brass" type="button" onClick={() => addProduct(SHOP_PRODUCTS[0])}>Add Turbo Mode <TomaIcon icon={faArrowUpRightFromSquare} /></button></div></div></div></section>
      <section className="shop-bundles-section" id="bundles"><div className="shop-wrap"><div className="shop-section-heading"><div><p className="shop-eyebrow">Built for more than one moment</p><h2>Bundles with<br /><em>a reason.</em></h2></div><p>Buy the cup you already love and leave room for the cup you have not met yet. Every bundle is selected around a real coffee rhythm.</p></div><div className="shop-bundle-grid">{SHOP_BUNDLES.map((bundle) => <ShopBundleCard key={bundle.id} bundle={bundle} onAdd={addProduct} />)}</div></div></section>
      <section className="shop-proof-section"><div className="shop-wrap"><div className="shop-section-heading proof-heading"><div><p className="shop-eyebrow">Why TOMA</p><h2>Good coffee<br /><em>with a point of view.</em></h2></div><p>Experience matters when it becomes something you can feel, repeat, and trust in the next cup.</p></div><div className="shop-proof-grid">{SHOP_PROOF.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></div></section>
      <section className="shop-offers-section" id="offers"><div className="shop-wrap"><div className="shop-offer-main"><p className="shop-eyebrow">A little more to take home</p><h2>Choose your next<br /><em>three cups.</em></h2><p>Discovery Three brings three distinct TOMA directions together, so the next favourite can find you.</p><Link className="button button-brass" to="#bundles">See the bundles <TomaIcon icon={faArrowDown} /></Link><div className="shop-offer-list">{SHOP_OFFERS.map((offer) => <article key={offer.label}><strong>{offer.label}</strong><span>{offer.detail}</span></article>)}</div></div><div className="shop-offer-side"><span className="offer-mark">TOMA<br /><small>OFFER / 01</small></span><p>Save when your coffee moments travel together.</p><strong>Up to 10%<br />in bundle value</strong></div></div></section>
      <section className="shop-reviews-section"><div className="shop-wrap"><div className="shop-section-heading"><div><p className="shop-eyebrow">From the people drinking it</p><h2>Good cups<br /><em>come back.</em></h2></div><p>Sample customer notes for the MVP. Connect these cards to verified reviews when the order service is live.</p></div><div className="shop-review-grid">{SHOP_REVIEWS.map((review) => <ShopReviewCard key={review.name} review={review} />)}</div></div></section>
      <section className="shop-contact-section" id="contact"><div className="shop-wrap shop-contact-inner"><div><p className="shop-eyebrow">Need a second opinion?</p><h2>Ask TOMA<br /><em>which cup fits.</em></h2></div><p>Tell us what you usually drink, how you brew it, and what you want to feel next. We’ll point you to a starting place.</p><a className="shop-whatsapp-button" href="https://wa.me/201553677070?text=Hi%20TOMA%2C%20help%20me%20choose%20my%20next%20coffee." target="_blank" rel="noreferrer" aria-label="Chat with TOMA on WhatsApp">Chat on WhatsApp <TomaIcon icon={faArrowUpRightFromSquare} /></a></div></section>
    </main>
    <a className="whatsapp-cta" href="https://wa.me/201553677070?text=Hi%20TOMA%2C%20help%20me%20choose%20my%20next%20coffee." target="_blank" rel="noreferrer" aria-label="Chat with TOMA on WhatsApp"><span className="whatsapp-icon" aria-hidden="true"><TomaIcon icon={faWhatsapp} /></span><span>Talk to TOMA</span></a>
    <StoreFooter />
  </div>;
}
