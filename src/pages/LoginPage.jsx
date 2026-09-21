import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { getSession, safeReturnPath, signIn } from '../lib/storefront-state.js';
import { TomaIcon } from '../components/TomaIcon.jsx';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh } = useStorefront();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const returnPath = safeReturnPath(searchParams.get('return') || '/cart');
  const existingSession = getSession();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const formData = new FormData(event.currentTarget);
    try {
      await signIn({ email: formData.get('email'), password: formData.get('password') });
      refresh();
      navigate(returnPath);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not complete that request.');
      setBusy(false);
    }
  }

  const switchPath = `/signup?return=${encodeURIComponent(returnPath)}`;
  return <AuthLayout mode="login">
    <p className="eyebrow">TOMA account / Sign in</p>
    <h2 id="auth-title">Welcome back<br /><em>to the ritual.</em></h2>
    <p className="auth-lede">Your saved blends and current bag stay together across the store.</p>
    <div className="prototype-note"><TomaIcon icon={faCircleInfo} /><p><strong>Demo account flow.</strong> This static MVP keeps your session on this device until a real auth service is connected.</p></div>
    {existingSession ? <p className="field-help">Already signed in as {existingSession.email}. Signing in again will switch the demo session.</p> : null}
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="field"><label htmlFor="login-email">Email address</label><input id="login-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>
      <div className="field"><label htmlFor="login-password">Password</label><input id="login-password" name="password" type="password" autoComplete="current-password" required placeholder="Your password" /></div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="auth-switch">New to TOMA? <Link to={switchPath}>Create an account</Link></p>
  </AuthLayout>;
}
