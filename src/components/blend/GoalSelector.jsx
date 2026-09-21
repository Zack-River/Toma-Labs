export function GoalSelector({ goals, selectedGoal, onSelect }) {
  return <>
    <div className="step-heading"><p className="eyebrow">Step 01 / Moment</p><h2>What are you making coffee for today?</h2><p>Start with the moment. TOMA will load a balanced place to begin.</p></div>
    <div className="goal-grid" role="list">{goals.map((item) => <button className={`goal-card${item.id === selectedGoal ? ' active' : ''}`} type="button" key={item.id} onClick={() => onSelect(item.id)} aria-pressed={item.id === selectedGoal}><span>{item.number}</span><strong>{item.label}</strong><small>{item.shortLabel}</small></button>)}</div>
  </>;
}
