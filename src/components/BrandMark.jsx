import { Link } from 'react-router-dom';

export function BrandMark({ className = 'brand', to = '/' }) {
  return <Link className={className} to={to} aria-label="TOMA home"><img src="/assets/toma-bean-mark-128.png" width="128" height="128" alt="" /><span>toma</span></Link>;
}
