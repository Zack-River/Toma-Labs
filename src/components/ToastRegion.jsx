import { useStorefront } from '../context/StorefrontContext.jsx';

export function ToastRegion() {
  const { toast } = useStorefront();
  return <div className={`react-toast${toast ? ' show' : ''}`} role="status" aria-live="polite">{toast}</div>;
}
