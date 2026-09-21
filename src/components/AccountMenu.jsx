import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStorefront } from '../context/StorefrontContext.jsx';

export function AccountMenu() {
  const navigate = useNavigate();
  const { session, signOut } = useStorefront();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        menuRef.current?.querySelector('button')?.focus();
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!session) return <Link className="toma-account-trigger toma-signin-link" to="/login">Sign in</Link>;

  const initials = `${session.firstName?.[0] || ''}${session.lastName?.[0] || ''}`.toUpperCase();

  function handleSignOut() {
    setOpen(false);
    signOut();
    navigate('/');
  }

  return <div
    ref={menuRef}
    className={`toma-account-menu${open ? ' is-open' : ''}`}
  >
    <button
      className="toma-account-trigger"
      type="button"
      aria-expanded={open}
      aria-haspopup="menu"
      aria-label={`Account menu for ${session.firstName} ${session.lastName}`}
      onClick={() => setOpen((current) => !current)}
    >
      <span className="toma-account-avatar" aria-hidden="true">{initials || 'U'}</span>
      <span className="toma-account-name">Hi, {session.firstName}</span>
      <span className="toma-account-chevron" aria-hidden="true">⌄</span>
    </button>
    {open ? <div className="toma-account-dropdown" role="menu" aria-label="Account options">
      <Link role="menuitem" to="/profile" onClick={() => setOpen(false)}>Profile <span aria-hidden="true">↗</span></Link>
      <Link role="menuitem" to="/profile#settings" onClick={() => setOpen(false)}>Settings <span aria-hidden="true">↗</span></Link>
      <Link role="menuitem" to="/admin" onClick={() => setOpen(false)}>Admin panel <span aria-hidden="true">↗</span></Link>
      <button role="menuitem" type="button" onClick={handleSignOut}>Log out <span aria-hidden="true">↗</span></button>
    </div> : null}
  </div>;
}
