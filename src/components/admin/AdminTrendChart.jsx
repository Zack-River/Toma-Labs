import { formatCurrency } from '../../lib/admin-state.js';

export function AdminTrendChart({ series }) {
  const max = Math.max(...series.map((item) => item.value), 1);
  return <div className="admin-chart" aria-label="Completed revenue by month" role="img">
    <div className="admin-chart-axis"><span>{formatCurrency(max)}</span><span>{formatCurrency(Math.round(max / 2))}</span><span>EGP 0</span></div>
    <div className="admin-chart-bars">{series.map((item) => <div className="admin-chart-column" key={item.key}><div className="admin-chart-bar-track"><div className="admin-chart-bar" style={{ height: `${Math.max(4, (item.value / max) * 100)}%` }} title={`${item.label}: ${formatCurrency(item.value)}`}></div></div><span>{item.label}</span></div>)}</div>
  </div>;
}
