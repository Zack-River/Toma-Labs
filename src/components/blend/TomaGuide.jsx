export function TomaGuide({ guide, profile, step }) {
  const bars = [['Body', profile.body], ['Roast', profile.roast], ['Aroma', profile.aroma], ['Bitterness', profile.bitterness]];
  return <aside className={`guide-card${guide.tone === 'warning' ? ' warning' : ''}`} aria-labelledby="guide-title" aria-live="polite">
    <div className="guide-header"><span className="guide-led" aria-hidden="true"></span><span>TOMA GUIDE</span><span className="guide-step">{String(['moment', 'coffee', 'character', 'pack'].indexOf(step) + 1).padStart(2, '0')} / 04</span></div>
    <h2 id="guide-title">{guide.title}</h2>
    <div className="guide-block"><span className="guide-label">WHAT CHANGED</span><p>{guide.whatChanged}</p></div>
    <div className="guide-block"><span className="guide-label">WHAT IT MEANS</span><p>{guide.meaning}</p></div>
    <div className="guide-block recommendation-block"><span className="guide-label">TOMA RECOMMENDATION</span><p>{guide.recommendation}</p></div>
    <div className="guide-next"><span className="guide-label">SAFE NEXT ACTION</span><p>{guide.nextAction}</p></div>
    <div className="profile-bars" aria-label="Live flavor profile">{bars.map(([label, value]) => <div key={label}><span>{label}</span><i><b style={{ width: `${value}%` }}></b></i></div>)}</div>
  </aside>;
}
