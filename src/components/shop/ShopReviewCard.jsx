import { TomaIcon } from '../TomaIcon.jsx';
import { faStar } from '@fortawesome/free-solid-svg-icons';

export function ShopReviewCard({ review }) {
  return <article className="shop-review-card"><div className="shop-stars" aria-label="5 out of 5 stars">{[1, 2, 3, 4, 5].map((star) => <TomaIcon icon={faStar} key={star} />)}</div><blockquote>“{review.quote}”</blockquote><p><strong>{review.name}</strong><span>{review.detail}</span></p></article>;
}
