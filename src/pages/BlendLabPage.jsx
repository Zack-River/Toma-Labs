import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlendSummary } from '../components/blend/BlendSummary.jsx';
import { BaseCoffeeStep } from '../components/blend/BaseCoffeeStep.jsx';
import { CharacterControls } from '../components/blend/CharacterControls.jsx';
import { BlendStepTabs } from '../components/blend/BlendStepTabs.jsx';
import { GoalSelector } from '../components/blend/GoalSelector.jsx';
import { LiveBlendStage } from '../components/blend/LiveBlendStage.jsx';
import { PackCustomizer } from '../components/blend/PackCustomizer.jsx';
import { StoreFooter } from '../components/StoreFooter.jsx';
import { TomaGuide } from '../components/blend/TomaGuide.jsx';
import { StoreHeader } from '../components/StoreHeader.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { useBlendBuilder } from '../hooks/useBlendBuilder.js';
import { MVP_PRICING } from '../lib/pricing.js';

export function BlendLabPage() {
  const { addLine, saveCustomBlend, session, showToast } = useStorefront();
  const { BLEND_CONFIG, BODY_OPTIONS, GOALS, ROAST_OPTIONS, draft, goal, guide, labels, profile, quote, selectGoal, setStep, step, updateDraft } = useBlendBuilder();
  const [added, setAdded] = useState(false);

  const addBlendToBag = () => {
    const blendId = `custom-blend-${Date.now()}`;
    const blend = {
      id: blendId,
      name: draft.blendName?.trim() || 'Your TOMA Blend',
      subtitle: `${labels.body} body / ${labels.roast} roast / ${labels.addition}`,
      packSizeGrams: draft.packSizeGrams,
      tone: draft.roast === 'light' ? '#e0bd7b' : draft.roast === 'dark' ? '#7b4326' : '#b77b43',
    };
    addLine({
      ...blend,
      type: 'custom-blend',
      quantity: 1,
      priceKnown: true,
      unitPrice: MVP_PRICING.customBlendUnitPrice,
      priceLabel: quote.priceLabel,
      currency: MVP_PRICING.currency,
      metadata: { draft: { ...draft }, quote },
    });
    if (session) saveCustomBlend(blend);
    setAdded(true);
    showToast('Your custom blend was added to the bag.');
  };

  const shareDraft = async () => {
    const shareText = `My TOMA blend: ${draft.blendName?.trim() || 'Your TOMA Blend'} — ${labels.body} body, ${labels.roast} roast, ${labels.addition}.`;
    try {
      if (navigator.share) await navigator.share({ title: 'My TOMA blend', text: shareText, url: window.location.href });
      else await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      showToast(navigator.share ? 'Draft ready to share.' : 'Draft link copied.');
    } catch {
      showToast('Your draft is ready whenever you are.');
    }
  };

  const handleGoal = (goalId) => selectGoal(goalId);
  const handleMobileAction = () => {
    if (quote.valid) addBlendToBag();
    else { setStep('pack'); showToast('Complete the blend details before adding it to the bag.'); }
  };

  return <div className="react-blend-shell route-page">
    <StoreHeader />
    <main id="main-content">
      <section className="blend-step-section" aria-label="Blend recipe steps"><BlendStepTabs step={step} onStepChange={setStep} /></section>
      <section className="workbench" aria-label="TOMA Blend Builder">
        <div className="builder-column" id="blend-builder-panel" role="tabpanel" aria-labelledby={`blend-tab-${step}`}>
          {step === 'moment' ? <GoalSelector goals={GOALS} selectedGoal={draft.goalId} onSelect={handleGoal} /> : null}
          {step === 'coffee' ? <BaseCoffeeStep onNext={setStep} onBack={setStep} /> : null}
          {step === 'character' ? <CharacterControls draft={draft} bodyOptions={BODY_OPTIONS} roastOptions={ROAST_OPTIONS} onUpdate={updateDraft} onNext={setStep} onBack={setStep} config={BLEND_CONFIG} /> : null}
          {step === 'pack' ? <PackCustomizer draft={draft} onUpdate={updateDraft} onReview={() => setStep('pack')} onBack={setStep} config={BLEND_CONFIG} goalMessage={goal.message} /> : null}
        </div>
        <LiveBlendStage draft={draft} labels={labels} />
      </section>
      <section className="blend-guide-band" aria-label="TOMA Guide"><TomaGuide guide={guide} profile={profile} step={step} /></section>
      <section className="blend-summary-band" aria-label="Your blend summary"><BlendSummary draft={draft} labels={labels} quote={quote} onAdd={addBlendToBag} onShare={shareDraft} /></section>
      {added ? <section className="confirmation" aria-live="polite"><div className="confirmation-mark" aria-hidden="true">✓</div><div><p className="eyebrow">Draft added</p><h2>Your blend is in the bag.</h2><p>We kept the recipe explicit so you know exactly what will be quoted.</p></div><div className="confirmation-actions"><Link className="button button-brass" to="/cart">View bag <span aria-hidden="true">↗</span></Link><button className="text-link muted" type="button" onClick={() => setAdded(false)}>Keep exploring</button></div></section> : null}
    </main>
    <StoreFooter />
    <div className="mobile-cta" aria-label="Blend bag action"><div><span>Current quote</span><strong>{quote.priceLabel}</strong></div><button className="button" type="button" onClick={handleMobileAction}>{quote.valid ? 'Add my blend to bag' : 'Complete your blend'} <span aria-hidden="true">↗</span></button></div>
  </div>;
}
