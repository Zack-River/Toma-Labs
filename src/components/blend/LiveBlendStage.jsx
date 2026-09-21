const ROAST_COLORS = { light: '#e8c98f', medium: '#d9ad6f', dark: '#b77b43' };

export function LiveBlendStage({ draft, labels }) {
  const blendName = draft.blendName?.trim() || `${labels.body} ${labels.roast} Turkish blend`;
  const stageLabel = draft.blendName?.trim() || 'Your blend';
  const caption = draft.additionPercent
    ? `${labels.body} body / ${labels.roast} roast / ${labels.addition}`
    : `${labels.body} body / ${labels.roast} roast / clean finish`;

  return <section className="live-stage" aria-labelledby="stage-title">
    <p className="stage-ornament" aria-hidden="true">TOMA / YOUR SIGNATURE</p>
    <div className="stage-scene">
      <div className="tray" aria-hidden="true"><div className="bag"><img src="/assets/toma-bean-mark.png" alt="" /><strong>toma</strong><span>BLEND LAB</span><small>{stageLabel.toUpperCase()}</small></div></div>
      <div className="steam steam-one" aria-hidden="true"></div><div className="steam steam-two" aria-hidden="true"></div>
      <div className="cup" aria-label="Top-down preview of your Turkish coffee"><div className="crema" style={{ '--roast-color': ROAST_COLORS[draft.roast] || ROAST_COLORS.medium }}><span className="cup-swirl"></span></div></div>
      <div className="bean bean-a" aria-hidden="true"></div><div className="bean bean-b" aria-hidden="true"></div><div className="bean bean-c" aria-hidden="true"></div><div className="bean bean-d" aria-hidden="true"></div><div className="bean bean-e" aria-hidden="true"></div><div className="bean bean-f" aria-hidden="true"></div>
      <div className="stage-stamp" aria-hidden="true"><span>TOMA</span><small>guided / balanced / yours</small></div>
    </div>
    <div className="stage-caption"><div><p className="eyebrow">Your live recipe</p><h2 id="stage-title">{blendName}</h2><p>{caption}</p></div><span className="stage-arrow" aria-hidden="true">↘</span></div>
  </section>;
}
