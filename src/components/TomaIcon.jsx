import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function TomaIcon({ icon, label, className = '', ...props }) {
  return <FontAwesomeIcon icon={icon} className={`toma-icon${className ? ` ${className}` : ''}`} aria-hidden={label ? undefined : true} title={label} {...props} />;
}
