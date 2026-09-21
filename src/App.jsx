import { lazy, Suspense, useEffect, useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastRegion } from './components/ToastRegion.jsx';
import { FaqBot } from './components/FaqBot.jsx';
import { HomePage } from './pages/HomePage.jsx';

const lazyPage = (load, exportName) => lazy(() => load().then((module) => ({ default: module[exportName] })));
const CartPage = lazyPage(() => import('./pages/CartPage.jsx'), 'CartPage');
const LoginPage = lazyPage(() => import('./pages/LoginPage.jsx'), 'LoginPage');
const SignupPage = lazyPage(() => import('./pages/SignupPage.jsx'), 'SignupPage');
const BlendLabPage = lazyPage(() => import('./pages/BlendLabPage.jsx'), 'BlendLabPage');
const ProfilePage = lazyPage(() => import('./pages/ProfilePage.jsx'), 'ProfilePage');
const ShopPage = lazyPage(() => import('./pages/ShopPage.jsx'), 'ShopPage');
const FindYourCoffeePage = lazyPage(() => import('./pages/FindYourCoffeePage.jsx'), 'FindYourCoffeePage');
const WhyTomaPage = lazyPage(() => import('./pages/WhyTomaPage.jsx'), 'WhyTomaPage');
const ProductPage = lazyPage(() => import('./pages/ProductPage.jsx'), 'ProductPage');
const AdminPage = lazyPage(() => import('./pages/AdminPage.jsx'), 'AdminPage');

function RouteLoading() {
  return <div className="route-loading" role="status" aria-live="polite">Loading TOMA…</div>;
}

function PageChrome() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.hash) {
      let targetId = location.hash.slice(1);

      try {
        targetId = decodeURIComponent(targetId);
      } catch {
        // Keep the raw hash when a manually entered URL is malformed.
      }

      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ block: 'start', inline: 'nearest' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const isProductPage = location.pathname.startsWith('/product/');
    const name = location.pathname === '/admin' ? 'admin-page' : location.pathname === '/' ? 'home-page' : location.pathname === '/shop' ? 'shop-page' : location.pathname === '/blend-lab' ? 'blend-page' : location.pathname === '/find-your-coffee' ? 'find-coffee-page' : location.pathname === '/why-toma' ? 'why-toma-page' : isProductPage ? 'product-page' : location.pathname === '/cart' ? 'cart-page' : location.pathname === '/profile' ? 'profile-page' : 'account-page';
    document.body.className = name;
    document.title = location.pathname === '/admin' ? 'TOMA Admin | Workspace' : location.pathname === '/shop' ? 'Shop the collection | TOMA Coffee' : location.pathname === '/blend-lab' ? 'TOMA Blend Lab | Your cup. Your signature.' : location.pathname === '/find-your-coffee' ? 'Find your coffee | TOMA Coffee' : location.pathname === '/why-toma' ? 'Why TOMA | Coffee built with experience' : isProductPage ? 'Product details | TOMA Coffee' : location.pathname === '/cart' ? 'Your bag | TOMA Coffee' : location.pathname === '/profile' ? 'Your coffee record | TOMA Coffee' : location.pathname === '/login' ? 'Sign in | TOMA Coffee' : location.pathname === '/signup' ? 'Create an account | TOMA Coffee' : 'TOMA Coffee | Coffee built with experience';
  }, [location.pathname]);

  return <>
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/blend-lab" element={<BlendLabPage />} />
        <Route path="/find-your-coffee" element={<FindYourCoffeePage />} />
        <Route path="/why-toma" element={<WhyTomaPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
    <FaqBot />
    <ToastRegion />
  </>;
}

export function App() {
  return <PageChrome />;
}
