import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { safeReturnPath, signUp, validatePassword } from '../lib/storefront-state.js';
import { TomaIcon } from '../components/TomaIcon.jsx';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refresh } = useStorefront();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const returnPath = safeReturnPath(searchParams.get('return') || '/');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    if (password !== String(formData.get('confirmPassword') || '')) { setError('Passwords do not match.'); return; }
    if (!validatePassword(password)) { setError('Use at least 8 characters with one letter and one number.'); return; }
    setBusy(true);
    try {
      await signUp({ firstName: formData.get('firstName'), lastName: formData.get('lastName'), email: formData.get('email'), password });
      refresh();
      navigate(returnPath);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'We could not complete that request.');
      setBusy(false);
    }
  }

  const switchPath = `/login?return=${encodeURIComponent(returnPath)}`;
  return <AuthLayout mode="signup">
    <p className="eyebrow">TOMA account / Join</p>
    <h2 id="auth-title">Start your<br /><em>coffee record.</em></h2>
    <p className="auth-lede">Create a lightweight account so your blend journey can follow you from the lab to the bag.</p>
    <div className="prototype-note"><TomaIcon icon={faCircleInfo} /><p><strong>Demo account flow.</strong> This static MVP stores only a local demo profile. Connect a real auth provider before launch.</p></div>
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="field-row"><div className="field"><label htmlFor="signup-first-name">First name</label><input id="signup-first-name" name="firstName" type="text" autoComplete="given-name" required placeholder="First name" /></div><div className="field"><label htmlFor="signup-last-name">Last name</label><input id="signup-last-name" name="lastName" type="text" autoComplete="family-name" required placeholder="Last name" /></div></div>
      <div className="field"><label htmlFor="signup-email">Email address</label><input id="signup-email" name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></div>
      <div className="field"><label htmlFor="signup-password">Password</label><input id="signup-password" name="password" type="password" autoComplete="new-password" required placeholder="8+ characters, one number" /><span className="field-help">Use at least 8 characters with one letter and one number.</span></div>
      <div className="field"><label htmlFor="signup-confirm-password">Confirm password</label><input id="signup-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required placeholder="Repeat your password" /></div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="auth-submit" type="submit" disabled={busy}>{busy ? 'Creating your account…' : 'Create account'}</button>
    </form>
    <p className="auth-switch">Already have an account? <Link to={switchPath}>Sign in</Link></p>
  </AuthLayout>;
}
