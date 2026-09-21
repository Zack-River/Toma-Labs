import { Link } from 'react-router-dom';

export const ADMIN_TABS = Object.freeze([
  { id: 'overview', label: 'Overview', shortLabel: 'Stats & analytics' },
  { id: 'orders', label: 'Orders', shortLabel: 'Order lifecycle' },
  { id: 'accounts', label: 'Accounts & clients', shortLabel: 'Customer records' },
  { id: 'products', label: 'Products', shortLabel: 'Ready-made shelf' },
  { id: 'bundles', label: 'Bundles', shortLabel: 'Packages & offers' },
  { id: 'categories', label: 'Categories', shortLabel: 'Shelf directions' },
]);

export function AdminShell({ activeTab, onTabChange, children }) {
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link className="admin-brand" to="/"><img src="/assets/toma-bean-mark-128.png" width="128" height="128" alt="" /><span>toma</span></Link>
      <div className="admin-sidebar-heading"><p className="admin-eyebrow">TOMA / Workspace</p><h1>Admin<br /><em>desk.</em></h1></div>
      <nav className="admin-tab-list" aria-label="Admin sections" role="tablist">
        {ADMIN_TABS.map((tab) => <button className={`admin-tab${activeTab === tab.id ? ' is-active' : ''}`} type="button" role="tab" aria-selected={activeTab === tab.id} key={tab.id} onClick={() => onTabChange(tab.id)}><span>{tab.label}</span><small>{tab.shortLabel}</small></button>)}
      </nav>
      <div className="admin-sidebar-footer"><span>Demo workspace</span><Link to="/shop">Back to storefront ↗</Link></div>
    </aside>
    <main className="admin-main" id="admin-main-content">{children}</main>
  </div>;
}
