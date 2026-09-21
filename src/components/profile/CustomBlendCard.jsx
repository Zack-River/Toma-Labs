export function CustomBlendCard({ blend }) {
  return <article className="profile-blend-card">
    <div className="profile-blend-visual" style={{ '--blend-tone': blend.tone || '#b77b43' }}>
      <div className="profile-mini-cup" aria-hidden="true"><span></span></div>
      <span>{blend.packSizeGrams}g</span>
    </div>
    <div className="profile-blend-copy"><div><p className="profile-card-kicker">{blend.status}</p><h3>{blend.name}</h3></div><p>{blend.subtitle}</p><small>{blend.createdAt}</small></div>
  </article>;
}
