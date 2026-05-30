import React from 'react';
import '../styles/base.css';

/**
 * KPI Card component
 * Props (exactly as specified):
 * - label: string
 * - value: string | number
 * - trend: string (e.g. "4.2%")
 * - trendDirection: 'up' | 'down' | 'neutral'
 * - status: 'green' | 'amber' | 'red' | 'blue'
 * - sparkline: optional React node (rendered only on laptop per spec)
 */
export default function KPICard({ label, value, trend, trendDirection, status, sparkline }) {
  const statusClass = status ? `kpi-card--status-${status}` : '';
  const trendClass = trendDirection === 'up' ? 'trend-up' : trendDirection === 'down' ? 'trend-down' : 'trend-neutral';

  return (
    <div className={`kpi-card ${statusClass}`} role="group" aria-label={`KPI ${label}`}>
      <div className="kpi-label">
        <span>{label}</span>
        <span className="status-dot" aria-hidden="true" />
      </div>

      <div className="kpi-value" aria-live="polite">{value}</div>

      {trend !== undefined && (
        <div className={`kpi-trend ${trendClass}`}>
          <span aria-hidden="true">{trendDirection === 'up' ? '▲' : trendDirection === 'down' ? '▼' : '●'}</span>
          <span>{trend}</span>
          <span className="compare" style={{ marginLeft: 'var(--space-2)', color: 'var(--text-secondary)' }}>vs last month</span>
        </div>
      )}

      {sparkline && (
        <div className="kpi-sparkline" aria-hidden="true">
          {sparkline}
        </div>
      )}
    </div>
  );
}
