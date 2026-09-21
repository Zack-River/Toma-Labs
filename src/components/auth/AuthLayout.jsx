import { StoreHeader } from '../StoreHeader.jsx';
import { StoreFooter } from '../StoreFooter.jsx';

export function AuthLayout({ mode, children }) {
  const isLogin = mode === 'login';
  return <div className="react-auth-shell route-page">
    <StoreHeader />
    <main id="main-content" className="account-layout">
      <section className="account-art" aria-label="TOMA account introduction">
        <p className="art-topline">TOMA / Your coffee, remembered</p>
        <div className="art-copy"><h1>{isLogin ? <>Keep your<br /><em>ritual close.</em></> : <>Make room<br /><em>for yours.</em></>}</h1><p>{isLogin ? 'Save your blends, return to your bag, and pick up the next cup from where you left it.' : 'One account for your saved direction, your current bag, and the coffee you come back to.'}</p></div>
        <div className="art-cup" aria-hidden="true"></div>
        <div className="art-bottomline"><span>{isLogin ? '12 years in coffee' : 'Guided by experience'}</span><strong>{isLogin ? 'good coffee · good vibes' : 'built around taste'}</strong></div>
      </section>
      <section className="auth-panel" aria-labelledby="auth-title">{children}</section>
    </main>
    <StoreFooter />
  </div>;
}
