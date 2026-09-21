import { Navigate, Link } from 'react-router-dom';
import { CustomBlendCard } from '../components/profile/CustomBlendCard.jsx';
import { MostOrderedProducts } from '../components/profile/MostOrderedProducts.jsx';
import { OrderRow } from '../components/profile/OrderRow.jsx';
import { PreferencePanel } from '../components/profile/PreferencePanel.jsx';
import { StoreHeader } from '../components/StoreHeader.jsx';
import { StoreFooter } from '../components/StoreFooter.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { getMostOrderedProducts, getPreferenceLabels } from '../lib/profile-state.js';
import { TomaIcon } from '../components/TomaIcon.jsx';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export function ProfilePage() {
  const { session, profileData, showToast, updatePreferences } = useStorefront();
  if (!session) return <Navigate to="/login?return=%2Fprofile" replace />;
  if (!profileData) return null;

  const preferenceLabels = getPreferenceLabels(profileData.preferences);
  const topProduct = getMostOrderedProducts(profileData.orders)[0];
  function handlePreferenceChange(changes) {
    updatePreferences(changes);
    showToast('Your coffee preferences were saved.');
  }

  return <div className="profile-shell route-page">
    <StoreHeader />
    <main id="main-content" className="profile-main">
      <section className="profile-hero"><div className="profile-hero-copy"><p className="eyebrow">TOMA / Your account</p><h1>Your coffee<br /><em>record.</em></h1><p>Everything you return to, collected in one place: the blends you shaped, the coffee you reordered, and the preferences that make the next cup easier.</p></div></section>
      <section className="profile-stats" aria-label="Profile summary"><div><span>01</span><strong>{profileData.customBlends.length}</strong><p>saved blends</p></div><div><span>02</span><strong>{profileData.orders.length}</strong><p>recent orders</p></div><div><span>03</span><strong>{topProduct?.name || '—'}</strong><p>most ordered</p></div></section>
      <div className="profile-content-grid">
        <section className="profile-panel blends-panel" aria-labelledby="blends-title"><div className="profile-panel-heading"><div><p className="eyebrow">Made around your taste</p><h2 id="blends-title">Your custom blends.</h2></div><Link className="profile-text-link" to="/blend-lab">Build another <TomaIcon icon={faArrowUpRightFromSquare} /></Link></div><p className="profile-panel-lede">Samples of the directions you have kept close. Your next blend starts from the preferences beside them.</p><div className="profile-blend-grid">{profileData.customBlends.map((blend) => <CustomBlendCard blend={blend} key={blend.id} />)}</div></section>
        <PreferencePanel preferences={profileData.preferences} onChange={handlePreferenceChange} />
        <section className="profile-panel orders-panel" aria-labelledby="orders-title"><div className="profile-panel-heading"><div><p className="eyebrow">Your coffee trail</p><h2 id="orders-title">Last orders.</h2></div><span className="profile-panel-note">Sample activity / MVP</span></div><p className="profile-panel-lede">A lightweight order history mockup until TOMA’s checkout service is connected.</p><div className="profile-order-list">{profileData.orders.map((order) => <OrderRow order={order} key={order.id} />)}</div></section>
        <MostOrderedProducts orders={profileData.orders} />
      </div>
    </main>
    <StoreFooter />
  </div>;
}
