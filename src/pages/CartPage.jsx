import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckoutForm } from '../components/cart/CheckoutForm.jsx';
import { StoreHeader } from '../components/StoreHeader.jsx';
import { StoreFooter } from '../components/StoreFooter.jsx';
import { CartLineItem } from '../components/cart/CartLineItem.jsx';
import { CartSummary } from '../components/cart/CartSummary.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { createWhatsAppCheckoutUrl, validateCheckoutDetails } from '../lib/whatsapp-checkout.js';
import { createAdminOrderFromCheckout } from '../lib/admin-state.js';

export function CartPage() {
  const navigate = useNavigate();
  const { cart, cartCount, cartTotals: totals, session, changeQuantity, removeLine, showToast, signOut } = useStorefront();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const checkoutDefaults = useMemo(() => ({ name: [session?.firstName, session?.lastName].filter(Boolean).join(' '), phone: '', address: '', paymentMethod: 'cash-on-delivery' }), [session]);
  const itemLabel = `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your bag`;

  function handleCheckout() {
    setCheckoutError('');
    setCheckoutOpen(true);
  }

  function handleCheckoutSubmit(details) {
    const validation = validateCheckoutDetails(details);
    if (!validation.valid) {
      setCheckoutError(Object.values(validation.errors).join(' '));
      return;
    }
    createAdminOrderFromCheckout({ cart, totals, customer: validation.values, customerId: session?.userId || `guest-${validation.values.phone.replace(/\D/g, '').slice(-8)}` });
    window.location.assign(createWhatsAppCheckoutUrl({ cart, totals, customer: validation.values }));
  }

  return <div className="react-cart-shell route-page"><StoreHeader /><main className="cart-main"><section className="cart-intro" aria-labelledby="cart-title"><div><p className="eyebrow">TOMA / Review</p><h1 id="cart-title">Your<br /><em>bag.</em></h1></div><p>Your coffee, your recipe, and the next decision kept in one place.</p></section><div className="cart-grid"><section className="cart-items" aria-labelledby="cart-items-title"><p className="cart-count-label" id="cart-items-title">{itemLabel}</p>{cart.length ? cart.map((item) => <CartLineItem key={item.id} item={item} onChangeQuantity={changeQuantity} onRemove={(id) => { removeLine(id); showToast(`${item.name} removed from your bag.`); }} />) : <div className="empty-cart"><h2>Nothing here yet.</h2><p>Start with a ready-made TOMA coffee or build a blend around your next moment.</p><Link className="button" to="/blend-lab">Build your blend <span aria-hidden="true">↗</span></Link></div>}</section><div className="cart-summary-column"><CartSummary totals={totals} session={session} itemCount={cartCount} checkoutOpen={checkoutOpen} onCheckout={handleCheckout} onSignOut={signOut} />{checkoutOpen ? <CheckoutForm initialValues={checkoutDefaults} error={checkoutError} onCancel={() => { setCheckoutOpen(false); setCheckoutError(''); }} onSubmit={handleCheckoutSubmit} /> : null}</div></div></main><StoreFooter /></div>;
}
