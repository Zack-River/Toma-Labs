export function ShopReviewCard({ review }) {
  return <article className="shop-review-card"><div className="shop-stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“{review.quote}”</blockquote><p><strong>{review.name}</strong><span>{review.detail}</span></p></article>;
}
