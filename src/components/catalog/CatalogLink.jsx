import { Link } from 'react-router-dom';

export function catalogPath(itemOrId) {
  const id = typeof itemOrId === 'string' ? itemOrId : itemOrId?.id;
  return id ? `/product/${id}` : '/shop';
}

export function CatalogLink({ item, id, className, ariaLabel, children, ...props }) {
  const linkClassName = ['catalog-link', className].filter(Boolean).join(' ');
  return <Link className={linkClassName} to={catalogPath(item || id)} aria-label={ariaLabel} {...props}>{children}</Link>;
}
