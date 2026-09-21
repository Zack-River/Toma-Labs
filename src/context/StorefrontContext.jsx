import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { addToCart, cartCount, cartTotals, clearSession, getCart, getSession, removeFromCart, updateCartQuantity } from '../lib/storefront-state.js';
import { addCustomBlend, getProfileData, updateProfilePreferences } from '../lib/profile-state.js';

const StorefrontContext = createContext(null);

export function StorefrontProvider({ children }) {
  const [cart, setCart] = useState(() => getCart());
  const [session, setSession] = useState(() => getSession());
  const [profileData, setProfileData] = useState(() => getProfileData(getSession()));
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const refresh = useCallback(() => {
    const nextSession = getSession();
    setCart(getCart());
    setSession(nextSession);
    setProfileData(getProfileData(nextSession));
  }, []);

  useEffect(() => {
    window.addEventListener('toma:cart-updated', refresh);
    window.addEventListener('toma:auth-updated', refresh);
    window.addEventListener('toma:profile-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('toma:cart-updated', refresh);
      window.removeEventListener('toma:auth-updated', refresh);
      window.removeEventListener('toma:profile-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 3200);
  }, []);

  const addLine = useCallback((item) => {
    const next = addToCart(item);
    setCart(next);
    return next;
  }, []);

  const changeQuantity = useCallback((id, quantity) => {
    const next = updateCartQuantity(id, quantity);
    setCart(next);
    return next;
  }, []);

  const removeLine = useCallback((id) => {
    const next = removeFromCart(id);
    setCart(next);
    return next;
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
    setProfileData(null);
    showToast('You are signed out of this demo session.');
  }, [showToast]);

  const updatePreferences = useCallback((changes) => {
    if (!session) return null;
    const next = updateProfilePreferences(session, changes);
    setProfileData(next);
    return next;
  }, [session]);

  const saveCustomBlend = useCallback((blend) => {
    if (!session) return null;
    const next = addCustomBlend(session, blend);
    setProfileData(next);
    return next;
  }, [session]);

  const value = useMemo(() => ({
    cart,
    cartCount: cartCount(cart),
    cartTotals: cartTotals(cart),
    session,
    profileData,
    toast,
    addLine,
    changeQuantity,
    removeLine,
    refresh,
    showToast,
    signOut,
    saveCustomBlend,
    updatePreferences,
  }), [addLine, cart, changeQuantity, profileData, refresh, removeLine, saveCustomBlend, session, showToast, signOut, toast, updatePreferences]);

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) throw new Error('useStorefront must be used inside StorefrontProvider');
  return context;
}
