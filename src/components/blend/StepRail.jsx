const STEPS = [['moment', 'Moment', 'Start with a reason'], ['coffee', 'Coffee', 'Choose the format'], ['character', 'Character', 'Shape the cup'], ['pack', 'Pack', 'Make it yours']];

export function StepRail({ step, onStepChange }) {
  return <aside className="control-rail"><div className="rail-heading"><p className="eyebrow">The guided path</p><p className="rail-caption">One useful decision at a time.</p></div><nav className="step-nav" aria-label="Blend builder steps">{STEPS.map(([id, label, hint], index) => <button className={`step-button${step === id ? ' active' : ''}`} type="button" key={id} onClick={() => onStepChange(id)} aria-current={step === id ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong><small>{hint}</small></button>)}</nav><div className="rail-footer"><span className="status-led" aria-hidden="true"></span><p><strong>TOMA Guide is on.</strong><br />Every choice comes with a reason.</p></div></aside>;
}
