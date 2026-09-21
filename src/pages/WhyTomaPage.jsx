import { Link } from 'react-router-dom';
import { StoreFooter } from '../components/StoreFooter.jsx';
import { StoreHeader } from '../components/StoreHeader.jsx';
import { SHOP_PROOF } from '../lib/shop-data.js';
import { TomaIcon } from '../components/TomaIcon.jsx';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const STANDARD_STEPS = Object.freeze([
  { number: '01', title: 'Select with intent', copy: 'Every ingredient and product earns its place through aroma, clarity, and character.' },
  { number: '02', title: 'Test before release', copy: 'Experience matters when it becomes a standard customers can feel in every cup.' },
  { number: '03', title: 'Make choosing easier', copy: 'Clear details and guided suggestions remove guesswork from the shelf.' },
]);

export function WhyTomaPage() {
  return <div className="route-page toma-destination-page why-toma-page">
    <StoreHeader />
    <main id="main-content">
      <section className="destination-hero why-hero">
        <div className="destination-hero-copy"><p className="destination-eyebrow">TOMA / Why TOMA</p><h1>Good coffee<br /><em>with a point of view.</em></h1><p>TOMA is shaped by around twelve years of making, testing, and refining coffee. The website turns that experience into something useful at the moment of choice.</p><div className="destination-actions"><Link className="destination-button destination-button-brass" to="/shop">See the collection <TomaIcon icon={faArrowUpRightFromSquare} /></Link><Link className="destination-button destination-button-line" to="/find-your-coffee">Find your coffee <TomaIcon icon={faArrowUpRightFromSquare} /></Link></div></div>
        <div className="why-hero-stamp" aria-label="TOMA has twelve years of experience in coffee"><strong>12</strong><span>years<br />in coffee</span><small>EXPERIENCE / STANDARD / RETURN</small></div>
      </section>

      <section className="why-proof-section" aria-labelledby="proof-title"><div className="destination-section-heading"><div><p className="destination-eyebrow">What the standard protects</p><h2 id="proof-title">A better cup is<br /><em>felt in the details.</em></h2></div><p>Good coffee is not only a flavour. It is a set of decisions that keep showing up in the cup, the shelf, and the next order.</p></div><div className="why-proof-grid">{SHOP_PROOF.map((item) => <article key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>

      <section className="why-standard-section" aria-labelledby="standard-title"><div className="why-standard-art"><img src="/assets/toma-turbo-editorial.png" alt="TOMA coffee package and prepared cup" /><span className="why-standard-label">THE TOMA<br />STANDARD / 01</span></div><div className="why-standard-copy"><p className="destination-eyebrow">From experience to shelf</p><h2 id="standard-title">Every choice should<br /><em>earn its place.</em></h2><p>We keep the catalogue legible: what it is, how it tastes, what format it comes in, and why it might belong in your routine. When the ready-made shelf is not enough, the Blend Lab explains the next move instead of leaving you alone with ingredients.</p><div className="why-standard-list">{STANDARD_STEPS.map((step) => <div key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></div>)}</div><Link className="text-link" to="/blend-lab">See the Blend Lab <TomaIcon icon={faArrowUpRightFromSquare} /></Link></div></section>

      <section className="why-principles-section"><div className="destination-section-heading"><div><p className="destination-eyebrow">The TOMA promise</p><h2>Made to be clear.<br /><em>Made to come back to.</em></h2></div><p>We are building a coffee place that respects your attention: useful guidance, honest MVP prices, and products with a reason behind them.</p></div><div className="why-principles-grid"><article><strong>01</strong><h3>Useful before impressive</h3><p>We lead with the information that helps you choose and save the poetry for the cup.</p></article><article><strong>02</strong><h3>Local character, open mind</h3><p>Egyptian coffee and Turkish tradition are our centre, not a limit on where the next idea can go.</p></article><article><strong>03</strong><h3>A ritual that can move</h3><p>Morning, work, gathering, quiet, discovery: the right coffee changes with the reason you are making it.</p></article></div></section>

      <section className="destination-cta"><div><p className="destination-eyebrow">Now make a choice</p><h2>Find a cup that makes<br /><em>sense for you.</em></h2></div><div className="destination-actions"><Link className="destination-button destination-button-brass" to="/find-your-coffee">Find your coffee <TomaIcon icon={faArrowUpRightFromSquare} /></Link><Link className="destination-button destination-button-line" to="/shop">Shop TOMA <TomaIcon icon={faArrowUpRightFromSquare} /></Link></div></section>
    </main>
    <StoreFooter />
  </div>;
}
