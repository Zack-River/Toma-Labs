import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CatalogLink } from '../components/catalog/CatalogLink.jsx';
import { StoreFooter } from '../components/StoreFooter.jsx';
import { StoreHeader } from '../components/StoreHeader.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { GOALS } from '../lib/blend-rules.js';
import { SHOP_PRODUCTS } from '../lib/shop-data.js';
import { TomaIcon } from '../components/TomaIcon.jsx';
import { faArrowDown, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const RECOMMENDATIONS = Object.freeze({
  morning: 'turbo-mode-50g',
  work: 'cacao-night-100g',
  'after-lunch': 'gold-instant-100g',
  gathering: 'house-medium-100g',
  quiet: 'quiet-decaf-100g',
  discover: 'rose-cinnamon-100g',
});

const PROCESS_STEPS = Object.freeze([
  { number: '01', title: 'Name the moment', copy: 'Start with what the cup needs to do for you, not an intimidating list of tasting notes.' },
  { number: '02', title: 'Choose a direction', copy: 'TOMA points you toward a roast, body, and format that make sense for the moment.' },
  { number: '03', title: 'Make it yours', copy: 'Stay with the ready-made recommendation or carry the direction into the Blend Lab.' },
]);

export function FindYourCoffeePage() {
  const { addLine, showToast } = useStorefront();
  const [selectedGoalId, setSelectedGoalId] = useState('morning');
  const goal = GOALS.find((item) => item.id === selectedGoalId) || GOALS[0];
  const recommendation = SHOP_PRODUCTS.find((product) => product.id === RECOMMENDATIONS[goal.id]);

  function addRecommendation() {
    if (!recommendation) return;
    addLine(recommendation);
    showToast(`${recommendation.name} added to your bag.`);
  }

  return <div className="route-page toma-destination-page find-coffee-page">
    <StoreHeader />
    <main id="main-content">
      <section className="destination-hero finder-hero">
        <div className="destination-hero-copy">
          <p className="destination-eyebrow">TOMA / Find your coffee</p>
          <h1>Find the cup<br /><em>that fits.</em></h1>
          <p>Tell TOMA what the moment feels like. We’ll point you toward a starting cup with a clear reason behind it.</p>
          <div className="destination-actions"><Link className="destination-button destination-button-brass" to="#coffee-finder">Start with a moment <TomaIcon icon={faArrowDown} /></Link><Link className="destination-button destination-button-line" to="/blend-lab">Make a custom blend <TomaIcon icon={faArrowUpRightFromSquare} /></Link></div>
        </div>
        <div className="destination-hero-art" aria-hidden="true"><div className="finder-orbit"></div><div className="finder-cup"><span></span></div><span className="finder-art-note">MOMENT / TASTE / DIRECTION</span><strong>01</strong></div>
      </section>

      <section className="coffee-finder-section" id="coffee-finder" aria-labelledby="finder-title">
        <div className="destination-section-heading"><div><p className="destination-eyebrow">A useful first question</p><h2 id="finder-title">What are you making<br /><em>coffee for?</em></h2></div><p>There’s no wrong answer. Choose the closest moment and TOMA will make the next decision easier.</p></div>
        <div className="finder-choice-grid" role="group" aria-label="Coffee moments">
          {GOALS.map((item) => <button className={`finder-choice${item.id === goal.id ? ' is-selected' : ''}`} type="button" key={item.id} aria-pressed={item.id === goal.id} onClick={() => setSelectedGoalId(item.id)}><span>{item.number}</span><strong>{item.label}</strong><small>{item.shortLabel}</small><TomaIcon icon={faArrowUpRightFromSquare} /></button>)}
        </div>
        <article className="finder-result" aria-live="polite">
          <div className="finder-result-copy"><p className="destination-eyebrow">{goal.number} / TOMA starting point</p><h2>{goal.message}</h2><p>{goal.recommendation}</p><p className="finder-result-note"><strong>Recommended direction</strong><CatalogLink item={recommendation}>{recommendation?.name}</CatalogLink> · {recommendation?.priceLabel} · {recommendation?.subtitle}</p><div className="destination-actions"><button className="destination-button destination-button-brass" type="button" onClick={addRecommendation}>Add {recommendation?.name} <TomaIcon icon={faArrowUpRightFromSquare} /></button><Link className="destination-button destination-button-line-dark" to="/blend-lab">Customize this direction <TomaIcon icon={faArrowUpRightFromSquare} /></Link></div></div>
          <CatalogLink className="finder-result-art" item={recommendation} ariaLabel={`View ${recommendation?.name}`} style={{ '--finder-tone': recommendation?.tone || '#7b4326' }}><img src={recommendation?.image} alt="" /><span>{recommendation?.categoryLabel}</span><strong>{recommendation?.priceLabel}</strong></CatalogLink>
        </article>
      </section>

      <section className="destination-process" aria-labelledby="process-title"><div className="destination-section-heading"><div><p className="destination-eyebrow">The TOMA approach</p><h2 id="process-title">Less guesswork.<br /><em>More recognition.</em></h2></div><p>We use experience to turn a broad coffee decision into three small, useful moves.</p></div><div className="destination-process-grid">{PROCESS_STEPS.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div></section>

      <section className="destination-cta"><div><p className="destination-eyebrow">Ready for the next cup?</p><h2>Start with a direction.<br /><em>Leave room to explore.</em></h2></div><div className="destination-actions"><Link className="destination-button destination-button-brass" to="/shop">Shop the collection <TomaIcon icon={faArrowUpRightFromSquare} /></Link><Link className="destination-button destination-button-line" to="/blend-lab">Open Blend Lab <TomaIcon icon={faArrowUpRightFromSquare} /></Link></div></section>
    </main>
    <StoreFooter />
  </div>;
}
