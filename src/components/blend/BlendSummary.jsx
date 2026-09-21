import { TomaIcon } from '../TomaIcon.jsx';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export function BlendSummary({ draft, labels, quote, onAdd, onShare }) {
  const name = draft.blendName?.trim() || 'Your Blend';
  return <aside className="summary-card" aria-labelledby="summary-title" aria-live="polite">
    <div className="summary-heading"><div className="summary-top"><p className="eyebrow">Your product</p><span className="summary-status">{quote.valid ? 'Ready to quote' : 'Needs attention'}</span></div><h2 id="summary-title">{name}</h2></div>
    <dl className="recipe-list">
      <div><dt>Format</dt><dd>Turkish coffee</dd></div>
      <div><dt>Character</dt><dd>{labels.body} body / {labels.roast} roast</dd></div>
      <div><dt>Addition</dt><dd>{labels.addition}</dd></div>
      <div><dt>Pack</dt><dd>{draft.packSizeGrams}g</dd></div>
    </dl>
    <div className="summary-total"><span>Current blend price</span><strong>{quote.priceLabel}</strong><small>{quote.currencyLabel} · guide estimate</small></div>
    <div className="summary-logistics"><span>Preparation <b>{quote.preparationTime}</b></span><span>Delivery <b>{quote.deliveryRule}</b></span></div>
    <div className="summary-actions"><button className="button summary-button" type="button" disabled={!quote.valid} onClick={onAdd}>Add my blend to bag <TomaIcon icon={faArrowUpRightFromSquare} /></button><button className="secondary-action" type="button" onClick={onShare}>Share this draft <TomaIcon icon={faArrowUpRightFromSquare} /></button></div>
    {!quote.valid ? <p className="summary-footnote" role="alert">{quote.errors.join(' ')}</p> : null}
  </aside>;
}
