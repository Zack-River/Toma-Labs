import { Link } from 'react-router-dom';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { BrandMark } from './BrandMark.jsx';
import { TomaIcon } from './TomaIcon.jsx';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export function StoreFooter() {
  const { session } = useStorefront();
  const accountPath = session ? '/profile' : '/login';
  const accountLabel = session ? 'Profile' : 'Sign in';

  return <footer className="toma-footer">
    <div className="toma-footer-inner">
      <div className="toma-footer-brand">
        <BrandMark className="toma-footer-brand-mark" />
        <p>Built around taste.<br />Made to return to.</p>
      </div>
      <nav className="toma-footer-nav" aria-label="Footer navigation">
        <span className="toma-footer-label">Explore</span>
        <Link to="/shop">Shop</Link>
        <Link to="/blend-lab">Build a blend</Link>
        <Link to="/find-your-coffee">Find your coffee</Link>
      </nav>
      <nav className="toma-footer-nav" aria-label="Account navigation">
        <span className="toma-footer-label">Your TOMA</span>
        <Link to={accountPath}>{accountLabel}</Link>
        <Link to="/cart">Bag</Link>
        {session ? <Link to="/profile#settings">Settings</Link> : <Link to="/signup">Create an account</Link>}
      </nav>
      <div className="toma-footer-contact">
        <span className="toma-footer-label">Talk to TOMA</span>
        <a href="tel:+201553677070">015 53677070</a>
        <span>Ismailia · Egypt</span>
        <a href="https://wa.me/201553677070?text=Hi%20TOMA%2C%20I%20have%20a%20question%20about%20my%20coffee." target="_blank" rel="noreferrer"><TomaIcon icon={faWhatsapp} /> WhatsApp <TomaIcon icon={faArrowUpRightFromSquare} /></a>
      </div>
    </div>
    <div className="toma-footer-bottom">
      <span>TOMA / Coffee built with experience</span>
      <span>© TOMA Coffee</span>
      <a href="https://www.instagram.com/tomacofee/" target="_blank" rel="noreferrer"><TomaIcon icon={faInstagram} /> Instagram <TomaIcon icon={faArrowUpRightFromSquare} /></a>
    </div>
  </footer>;
}
