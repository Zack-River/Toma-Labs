import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { AccountMenu } from './AccountMenu.jsx';
import { BrandMark } from './BrandMark.jsx';

function BagLink() {
  const { cartCount } = useStorefront();
  return <Link className="toma-bag-link" to="/cart" aria-label={`Open bag, ${cartCount} item${cartCount === 1 ? '' : 's'}`}><span>Bag</span><b>{cartCount}</b></Link>;
}

export function StoreHeader() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return <header className={`toma-header${scrolled ? ' is-scrolled' : ''}`}>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="toma-header-inner">
      <BrandMark className="toma-brand" />
      <nav id="toma-main-navigation" className={`toma-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        <NavLink to="/shop" onClick={closeMenu}>Shop</NavLink>
        <NavLink to="/find-your-coffee" onClick={closeMenu}>Find your coffee</NavLink>
        <NavLink to="/blend-lab" onClick={closeMenu}>Build your blend</NavLink>
        <NavLink to="/why-toma" onClick={closeMenu}>Why TOMA</NavLink>
      </nav>
      <div className="toma-header-actions">
        <AccountMenu />
        <BagLink />
        <button className="toma-menu-button" type="button" aria-expanded={menuOpen} aria-controls="toma-main-navigation" onClick={() => setMenuOpen((current) => !current)}>Menu</button>
      </div>
    </div>
  </header>;
}
