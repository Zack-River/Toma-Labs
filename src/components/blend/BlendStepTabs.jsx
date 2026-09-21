const STEPS = Object.freeze([
  ['moment', 'Moment', 'Start with a reason'],
  ['coffee', 'Coffee', 'Choose the format'],
  ['character', 'Character', 'Shape the cup'],
  ['pack', 'Pack', 'Make it yours'],
]);

export function BlendStepTabs({ step, onStepChange }) {
  const activeIndex = Math.max(0, STEPS.findIndex(([id]) => id === step));

  return <div className="blend-tabs-shell">
    <div className="blend-tabs-meta" aria-hidden="true">
      <span className="blend-tabs-kicker">BUILD YOUR BLEND</span>
      <span className="blend-tabs-count">{String(activeIndex + 1).padStart(2, '0')} / 04</span>
    </div>
    <h1 className="blend-tabs-title" id="blend-page-title">Your cup. <em>Your signature.</em></h1>
    <nav className="blend-step-tabs" aria-label="Blend builder steps" role="tablist">
      {STEPS.map(([id, label, hint], index) => {
        const isActive = step === id;
        const isComplete = index < activeIndex;
        return <button className={`blend-step-tab${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`} id={`blend-tab-${id}`} type="button" role="tab" aria-selected={isActive} aria-controls="blend-builder-panel" key={id} onClick={() => onStepChange(id)}>
          <span className="blend-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="blend-step-copy"><strong>{label}</strong><small>{hint}</small></span>
        </button>;
      })}
    </nav>
  </div>;
}
