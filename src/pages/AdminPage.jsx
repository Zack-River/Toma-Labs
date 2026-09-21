import { useMemo, useState } from 'react';
import { AdminConfirmModal, AdminModal } from '../components/admin/AdminModal.jsx';
import { ADMIN_TABS, AdminShell } from '../components/admin/AdminShell.jsx';
import { AdminTable } from '../components/admin/AdminTable.jsx';
import { AdminTrendChart } from '../components/admin/AdminTrendChart.jsx';
import { useStorefront } from '../context/StorefrontContext.jsx';
import { TomaIcon } from '../components/TomaIcon.jsx';
import { faArrowUpRightFromSquare, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';
import { createAdminId, formatAdminDate, formatCurrency, getAdminData, getAdminStats, getOrderStatusLabel, getRevenueSeries, getTopSoldProducts, ORDER_STATUSES, saveAdminData } from '../lib/admin-state.js';

function StatusBadge({ status }) {
  return <span className={`admin-status ${status}`}>{status === 'active' || status === 'inactive' ? (status === 'active' ? 'Active' : 'Inactive') : getOrderStatusLabel(status)}</span>;
}

function StatCard({ label, value, note, accent = false }) {
  return <article className={`admin-stat-card${accent ? ' accent' : ''}`}><span className="admin-stat-card-label">{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function SectionHeader({ eyebrow, title, copy, action }) {
  return <div className="admin-section-toolbar"><div><p className="admin-eyebrow">{eyebrow}</p><h3>{title}</h3>{copy ? <p>{copy}</p> : null}</div>{action}</div>;
}

function OverviewTab({ data, stats, onOpenTab }) {
  const series = getRevenueSeries(data.orders);
  const topProducts = getTopSoldProducts(data.orders, data.products, data.bundles, 5);
  const orderMix = [
    { id: 'completed', label: 'Completed', count: stats.completedOrders },
    { id: 'pending', label: 'Pending', count: stats.pendingOrders },
    { id: 'canceled', label: 'Canceled', count: stats.canceledOrders },
  ];
  const maxMix = Math.max(...orderMix.map((item) => item.count), 1);
  return <>
    <div className="admin-main-header"><div><p className="admin-eyebrow">TOMA / Admin overview</p><h2>Numbers with<br /><em>a direction.</em></h2></div><p className="admin-main-header-copy">A live-feeling MVP view of revenue, orders, customer activity, and the shelf. All amounts are shown in EGP.</p></div>
    <div className="admin-stat-grid"><StatCard label="Revenue" value={formatCurrency(stats.revenue)} note={`Average ${formatCurrency(stats.averageOrderValue)} / completed order`} accent /><StatCard label="Total orders" value={stats.totalOrders} note="Across all order states" /><StatCard label="Completed" value={stats.completedOrders} note="Ready to count as revenue" /><StatCard label="Pending" value={stats.pendingOrders} note={`${formatCurrency(stats.pendingValue)} awaiting action`} /><StatCard label="Canceled" value={stats.canceledOrders} note="Keep an eye on the reason" /></div>
    <div className="admin-dashboard-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Completed order value</p><h3>Revenue trend.</h3></div><span className="admin-link">EGP / monthly</span></div><AdminTrendChart series={series} /></section><section className="admin-panel admin-panel-dark"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Order health</p><h3>Current mix.</h3></div><span className="admin-link">{stats.totalOrders} total</span></div><div className="admin-order-mix">{orderMix.map((item) => <div className="admin-mix-row" key={item.id}><span>{item.label}</span><div className="admin-mix-track"><i style={{ width: `${(item.count / maxMix) * 100}%` }}></i></div><strong>{item.count}</strong></div>)}</div></section></div>
    <section className="admin-panel"><div className="admin-panel-heading"><div><p className="admin-eyebrow">Shelf performance</p><h3>Top selling products.</h3></div><button className="admin-button admin-button-ghost admin-button-small" type="button" onClick={() => onOpenTab('products')}>Manage products <TomaIcon icon={faArrowUpRightFromSquare} /></button></div><div className="admin-top-products">{topProducts.length ? topProducts.map((item, index) => <div className="admin-top-product" key={item.productId}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.name}</strong><small>{item.type === 'bundle' ? 'Bundle' : 'Ready-made product'} · {formatCurrency(item.revenue)} revenue</small></div><b>{item.quantity} sold</b></div>) : <p className="admin-confirm-copy">No completed sales yet.</p>}</div></section>
  </>;
}

function OrdersTab({ orders, onStatusChange }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const visibleOrders = orders.filter((order) => (filter === 'all' || order.status === filter) && `${order.id} ${order.customer} ${order.payment}`.toLowerCase().includes(query.trim().toLowerCase()));
  const filters = [{ id: 'all', label: 'All orders', count: orders.length }, ...ORDER_STATUSES.map((status) => ({ ...status, count: orders.filter((order) => order.status === status.id).length }))];
  const columns = [
    { key: 'order', label: 'Order', render: (order) => <><strong>{order.id}</strong><small>{formatAdminDate(order.date)}</small></> },
    { key: 'customer', label: 'Client', render: (order) => <><span>{order.customer}</span><small>{order.payment}</small></> },
    { key: 'items', label: 'Items', render: (order) => <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {order.items[0]?.name}{order.items.length > 1 ? ` + ${order.items.length - 1}` : ''}</span> },
    { key: 'total', label: 'Total', render: (order) => <strong>{order.quoteRequired ? 'Quote required' : formatCurrency(order.total)}</strong> },
    { key: 'status', label: 'Status', render: (order) => <StatusBadge status={order.status} /> },
    { key: 'action', label: 'Update', render: (order) => <select className="admin-inline-select" aria-label={`Change status for ${order.id}`} value={order.status} onChange={(event) => onStatusChange(order, event.target.value)}>{ORDER_STATUSES.map((status) => <option value={status.id} key={status.id}>{status.label}</option>)}</select> },
  ];
  return <><SectionHeader eyebrow="TOMA / Order lifecycle" title="Orders." copy="Move orders through pending, completed, and canceled states with a confirmation step." /><div className="admin-section-toolbar"><div className="admin-filter-row">{filters.map((item) => <button className={`admin-filter${filter === item.id ? ' is-active' : ''}`} type="button" key={item.id} onClick={() => setFilter(item.id)}>{item.label} · {item.count}</button>)}</div><label className="admin-search"><TomaIcon icon={faMagnifyingGlass} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" aria-label="Search orders" /></label></div><AdminTable columns={columns} rows={visibleOrders} emptyMessage="No orders match this view." /></>;
}

function AccountsTab({ accounts, orders, onCreate, onEdit }) {
  const spending = useMemo(() => orders.reduce((map, order) => { if (order.status === 'completed') map.set(order.customerId, (map.get(order.customerId) || 0) + Number(order.total || 0)); return map; }, new Map()), [orders]);
  const columns = [
    { key: 'client', label: 'Client', render: (client) => <><strong>{client.firstName} {client.lastName}</strong><small>{client.email}</small></> },
    { key: 'contact', label: 'Contact', render: (client) => <><span>{client.phone}</span><small>Joined {formatAdminDate(client.joined)}</small></> },
    { key: 'orders', label: 'Orders', render: (client) => <span>{orders.filter((order) => order.customerId === client.id).length}</span> },
    { key: 'spend', label: 'Completed spend', render: (client) => <strong>{formatCurrency(spending.get(client.id) || 0)}</strong> },
    { key: 'status', label: 'Status', render: (client) => <StatusBadge status={client.status} /> },
    { key: 'action', label: 'Action', render: (client) => <button className="admin-button admin-button-ghost admin-button-small" type="button" onClick={() => onEdit(client)}>Edit details</button> },
  ];
  return <><SectionHeader eyebrow="TOMA / Customer records" title="Accounts & clients." copy="Keep the people behind the orders easy to understand and ready for a follow-up." action={<button className="admin-button admin-button-primary" type="button" onClick={onCreate}><TomaIcon icon={faPlus} /> Add client</button>} /><AdminTable columns={columns} rows={accounts} emptyMessage="No client accounts yet." /></>;
}

function ProductsTab({ products, categories, onCreate, onEdit, onDelete }) {
  const [query, setQuery] = useState('');
  const visible = products.filter((product) => `${product.name} ${product.subtitle} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const categoryLabel = (id) => categories.find((category) => category.id === id)?.label || id;
  const columns = [
    { key: 'product', label: 'Product', render: (product) => <><strong>{product.name}</strong><small>{product.subtitle}</small></> },
    { key: 'category', label: 'Category', render: (product) => <span>{categoryLabel(product.category)}</span> },
    { key: 'price', label: 'Price', render: (product) => <strong>{formatCurrency(product.unitPrice)}</strong> },
    { key: 'pack', label: 'Pack', render: (product) => <span>{product.sizeLabel || `${product.packSizeGrams}g`}</span> },
    { key: 'action', label: 'Action', render: (product) => <div className="admin-row-actions"><button className="admin-button admin-button-ghost admin-button-small" type="button" onClick={() => onEdit(product)}>Edit</button><button className="admin-button admin-button-danger admin-button-small" type="button" onClick={() => onDelete(product)}>Delete</button></div> },
  ];
  return <><SectionHeader eyebrow="TOMA / Ready-made shelf" title="Products." copy="Edit what customers see on the ready-made shelf, including pricing and pack details." action={<div className="admin-actions"><label className="admin-search"><TomaIcon icon={faMagnifyingGlass} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" /></label><button className="admin-button admin-button-primary" type="button" onClick={onCreate}><TomaIcon icon={faPlus} /> Add product</button></div>} /><AdminTable columns={columns} rows={visible} emptyMessage="No products match this search." /></>;
}

function BundlesTab({ bundles, onCreate, onEdit, onDelete }) {
  const columns = [
    { key: 'bundle', label: 'Bundle', render: (bundle) => <><strong>{bundle.name}</strong><small>{bundle.subtitle}</small></> },
    { key: 'contents', label: 'Contents', render: (bundle) => <span>{bundle.itemsLabel}</span> },
    { key: 'price', label: 'Price', render: (bundle) => <><strong>{formatCurrency(bundle.unitPrice)}</strong><small>{bundle.compareLabel}</small></> },
    { key: 'badge', label: 'Shelf label', render: (bundle) => <span>{bundle.badge}</span> },
    { key: 'action', label: 'Action', render: (bundle) => <div className="admin-row-actions"><button className="admin-button admin-button-ghost admin-button-small" type="button" onClick={() => onEdit(bundle)}>Edit</button><button className="admin-button admin-button-danger admin-button-small" type="button" onClick={() => onDelete(bundle)}>Delete</button></div> },
  ];
  return <><SectionHeader eyebrow="TOMA / Packages & offers" title="Bundles." copy="Shape the reasons to buy more than one cup together." action={<button className="admin-button admin-button-primary" type="button" onClick={onCreate}><TomaIcon icon={faPlus} /> Add bundle</button>} /><AdminTable columns={columns} rows={bundles} emptyMessage="No bundles yet." /></>;
}

function CategoriesTab({ categories, products, onCreate, onEdit, onDelete }) {
  const columns = [
    { key: 'category', label: 'Category', render: (category) => <><strong>{category.label}</strong><small>{category.shortLabel}</small></> },
    { key: 'id', label: 'Slug', render: (category) => <span>{category.id}</span> },
    { key: 'products', label: 'Products', render: (category) => <strong>{products.filter((product) => product.category === category.id).length}</strong> },
    { key: 'tone', label: 'Tone', render: (category) => <span className="admin-color-value"><i style={{ background: category.tone }}></i>{category.tone}</span> },
    { key: 'action', label: 'Action', render: (category) => <div className="admin-row-actions"><button className="admin-button admin-button-ghost admin-button-small" type="button" onClick={() => onEdit(category)}>Edit</button><button className="admin-button admin-button-danger admin-button-small" type="button" onClick={() => onDelete(category)}>Delete</button></div> },
  ];
  return <><SectionHeader eyebrow="TOMA / Shelf directions" title="Categories." copy="Keep the navigation vocabulary aligned with the products customers can actually buy." action={<button className="admin-button admin-button-primary" type="button" onClick={onCreate}><TomaIcon icon={faPlus} /> Add category</button>} /><AdminTable columns={columns} rows={categories} emptyMessage="No categories yet." /></>;
}

function EntityField({ label, value, onChange, type = 'text', full = false, options = [], placeholder }) {
  const fieldId = `admin-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  return <div className={`admin-field${full ? ' full' : ''}`}><label htmlFor={fieldId}>{label}</label>{type === 'textarea' ? <textarea id={fieldId} value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /> : type === 'select' ? <select id={fieldId} value={value ?? ''} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select> : <input id={fieldId} type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}</div>;
}

function EntityForm({ entity, draft, categories, onChange, onSubmit, onClose }) {
  const formTitle = `${draft.id ? 'Edit' : 'Add'} ${entity}`;
  const update = (key) => (value) => onChange({ ...draft, [key]: value });
  const categoryOptions = categories.filter((category) => category.id !== 'bundles').map((category) => ({ value: category.id, label: category.label }));
  return <AdminModal title={formTitle} eyebrow={`TOMA / ${draft.id ? 'Edit details' : 'Create record'}`} onClose={onClose} footer={<><button className="admin-button admin-button-ghost" type="button" onClick={onClose}>Cancel</button><button className="admin-button admin-button-primary" type="submit" form="admin-entity-form">{draft.id ? 'Save changes' : 'Create record'}</button></>}>
    <form className="admin-form" id="admin-entity-form" onSubmit={onSubmit}>
      {entity === 'product' ? <div className="admin-form-grid"><EntityField label="Product name" value={draft.name} onChange={update('name')} /><EntityField label="Price / EGP" type="number" value={draft.unitPrice} onChange={update('unitPrice')} /><EntityField label="Category" type="select" value={draft.category} options={categoryOptions} onChange={update('category')} /><EntityField label="Pack size / grams" type="number" value={draft.packSizeGrams} onChange={update('packSizeGrams')} /><EntityField label="Shelf badge" value={draft.badge} onChange={update('badge')} /><EntityField label="Size label" value={draft.sizeLabel} onChange={update('sizeLabel')} /><EntityField label="Subtitle" value={draft.subtitle} onChange={update('subtitle')} full /><EntityField label="Description" type="textarea" value={draft.description} onChange={update('description')} full /><EntityField label="Tasting notes" value={draft.notes} onChange={update('notes')} full /><EntityField label="Image path" value={draft.image} onChange={update('image')} full placeholder="/assets/toma-product.png" /><EntityField label="Tone" value={draft.tone} onChange={update('tone')} /></div> : null}
      {entity === 'bundle' ? <div className="admin-form-grid"><EntityField label="Bundle name" value={draft.name} onChange={update('name')} /><EntityField label="Price / EGP" type="number" value={draft.unitPrice} onChange={update('unitPrice')} /><EntityField label="Shelf badge" value={draft.badge} onChange={update('badge')} /><EntityField label="Contents label" value={draft.itemsLabel} onChange={update('itemsLabel')} /><EntityField label="Subtitle" value={draft.subtitle} onChange={update('subtitle')} full /><EntityField label="Description" type="textarea" value={draft.description} onChange={update('description')} full /><EntityField label="Compared value" value={draft.compareLabel} onChange={update('compareLabel')} /><EntityField label="Image path" value={draft.image} onChange={update('image')} /><EntityField label="Tone" value={draft.tone} onChange={update('tone')} /></div> : null}
      {entity === 'category' ? <div className="admin-form-grid"><EntityField label="Category name" value={draft.label} onChange={update('label')} /><EntityField label="Slug" value={draft.id} onChange={update('id')} /><EntityField label="Short description" value={draft.shortLabel} onChange={update('shortLabel')} full /><EntityField label="Tone" value={draft.tone} onChange={update('tone')} /></div> : null}
      {entity === 'account' ? <div className="admin-form-grid"><EntityField label="First name" value={draft.firstName} onChange={update('firstName')} /><EntityField label="Last name" value={draft.lastName} onChange={update('lastName')} /><EntityField label="Email" type="email" value={draft.email} onChange={update('email')} /><EntityField label="Phone" value={draft.phone} onChange={update('phone')} /><EntityField label="Status" type="select" value={draft.status} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} onChange={update('status')} /></div> : null}
    </form>
  </AdminModal>;
}

function getFormDraft(entity, item) {
  if (item) return { ...item };
  if (entity === 'product') return { name: '', category: 'everyday', badge: 'New product', subtitle: '', description: '', notes: '', packSizeGrams: 100, sizeLabel: '100g pack', unitPrice: 0, image: '/assets/toma-turbo-editorial.png', tone: '#7b4326' };
  if (entity === 'bundle') return { name: '', badge: 'New bundle', subtitle: '', description: '', itemsLabel: '2 products', unitPrice: 0, compareLabel: 'Compared value to confirm', image: '/assets/toma-bundle-editorial.png', tone: '#7b4326' };
  if (entity === 'category') return { id: '', label: '', shortLabel: '', tone: '#7b4326' };
  return { firstName: '', lastName: '', email: '', phone: '', status: 'active', joined: new Date().toISOString().slice(0, 10) };
}

export function AdminPage() {
  const { showToast } = useStorefront();
  const [data, setData] = useState(() => getAdminData());
  const [activeTab, setActiveTab] = useState('overview');
  const [formModal, setFormModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const stats = getAdminStats(data.orders);

  function persist(next, message) {
    setData(saveAdminData(next));
    if (message) showToast(message);
  }

  function openForm(entity, item = null) {
    setFormModal({ entity, draft: getFormDraft(entity, item) });
  }

  function handleSave(event) {
    event.preventDefault();
    const { entity, draft } = formModal;
    const collection = entity === 'product' ? 'products' : entity === 'bundle' ? 'bundles' : entity === 'category' ? 'categories' : 'accounts';
    const prefix = entity === 'product' ? 'product' : entity === 'bundle' ? 'bundle' : entity === 'category' ? 'category' : 'client';
    const nextItem = { ...draft, id: draft.id || createAdminId(prefix) };
    if (entity === 'product' || entity === 'bundle') {
      nextItem.type = 'product';
      nextItem.unitPrice = Number(nextItem.unitPrice) || 0;
      nextItem.priceLabel = formatCurrency(nextItem.unitPrice);
      nextItem.currency = 'EGP';
      if (entity === 'product') nextItem.packSizeGrams = Number(nextItem.packSizeGrams) || 0;
    }
    if (entity === 'category' && !draft.id) nextItem.id = nextItem.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || createAdminId('category');
    const nextCollection = draft.id ? data[collection].map((item) => item.id === draft.id ? nextItem : item) : [nextItem, ...data[collection]];
    persist({ ...data, [collection]: nextCollection }, `${draft.id ? 'Changes saved' : 'Record created'} in ${entity}.`);
    setFormModal(null);
  }

  function requestDelete(entity, item) {
    const collection = entity === 'product' ? 'products' : entity === 'bundle' ? 'bundles' : 'categories';
    setConfirmModal({ title: `Delete ${entity}?`, message: `${item.name || item.label} will be removed from this demo admin catalog. This can be restored only by resetting the local demo data.`, confirmLabel: 'Delete record', danger: true, onConfirm: () => { persist({ ...data, [collection]: data[collection].filter((entry) => entry.id !== item.id) }, `${entity} deleted.`); setConfirmModal(null); } });
  }

  function requestStatusChange(order, status) {
    if (status === order.status) return;
    setConfirmModal({ title: `Mark ${order.id} ${getOrderStatusLabel(status).toLowerCase()}?`, message: `This changes ${order.customer}'s order from ${getOrderStatusLabel(order.status).toLowerCase()} to ${getOrderStatusLabel(status).toLowerCase()}.`, confirmLabel: `Mark ${getOrderStatusLabel(status)}`, danger: status === 'canceled', onConfirm: () => { persist({ ...data, orders: data.orders.map((entry) => entry.id === order.id ? { ...entry, status } : entry) }, `${order.id} marked ${getOrderStatusLabel(status).toLowerCase()}.`); setConfirmModal(null); } });
  }

  const activeLabel = ADMIN_TABS.find((tab) => tab.id === activeTab)?.label || 'Overview';
  return <AdminShell activeTab={activeTab} onTabChange={setActiveTab}>
    <div className="admin-context-bar"><span>Admin workspace / {activeLabel}</span><span>Currency: EGP · Local MVP data</span></div>
    {activeTab === 'overview' ? <OverviewTab data={data} stats={stats} onOpenTab={setActiveTab} /> : null}
    {activeTab === 'orders' ? <OrdersTab orders={data.orders} onStatusChange={requestStatusChange} /> : null}
    {activeTab === 'accounts' ? <AccountsTab accounts={data.accounts} orders={data.orders} onCreate={() => openForm('account')} onEdit={(item) => openForm('account', item)} /> : null}
    {activeTab === 'products' ? <ProductsTab products={data.products} categories={data.categories} onCreate={() => openForm('product')} onEdit={(item) => openForm('product', item)} onDelete={(item) => requestDelete('product', item)} /> : null}
    {activeTab === 'bundles' ? <BundlesTab bundles={data.bundles} onCreate={() => openForm('bundle')} onEdit={(item) => openForm('bundle', item)} onDelete={(item) => requestDelete('bundle', item)} /> : null}
    {activeTab === 'categories' ? <CategoriesTab categories={data.categories} products={data.products} onCreate={() => openForm('category')} onEdit={(item) => openForm('category', item)} onDelete={(item) => requestDelete('category', item)} /> : null}
    {formModal ? <EntityForm entity={formModal.entity} draft={formModal.draft} categories={data.categories} onChange={(draft) => setFormModal((current) => ({ ...current, draft }))} onSubmit={handleSave} onClose={() => setFormModal(null)} /> : null}
    {confirmModal ? <AdminConfirmModal title={confirmModal.title} message={confirmModal.message} confirmLabel={confirmModal.confirmLabel} danger={confirmModal.danger} onClose={() => setConfirmModal(null)} onConfirm={confirmModal.onConfirm} /> : null}
  </AdminShell>;
}
