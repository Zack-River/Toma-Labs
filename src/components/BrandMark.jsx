import { Link } from 'react-router-dom';

export function BrandMark({ className = 'brand', to = '/' }) {
  return <Link className={className} to={to} aria-label="TOMA home"><img src="/assets/toma-bean-mark.png" alt="" /><span>toma</span></Link>;
}
