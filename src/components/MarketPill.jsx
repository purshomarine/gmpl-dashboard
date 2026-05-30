import React from 'react';

export default function MarketPill({ label, value, change, changeDirection = 'neutral' }) {
  const variant = changeDirection === 'up' ? 'market-pill--positive' : changeDirection === 'down' ? 'market-pill--negative' : 'market-pill--neutral';

  const Arrow = ({ dir }) => {
    if (dir === 'up') return (
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M12 5l7 7h-4v7h-6v-7H5z"/></svg>
    );
    if (dir === 'down') return (
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M12 19l-7-7h4V5h6v7h4z"/></svg>
    );
    return (
      <svg width="12" height="2" viewBox="0 0 12 2" aria-hidden focusable="false"><rect width="12" height="2" rx="1"/></svg>
    );
  };

  return (
    <div className={`market-pill ${variant}`} role="group" aria-label={`${label} ${value}`}>
      <div className="market-pill__label">{label}</div>
      <div className="market-pill__value">{value}</div>
      <div className="market-pill__change" aria-hidden>
        <span className="market-pill__change-icon"><Arrow dir={changeDirection === 'up' ? 'up' : changeDirection === 'down' ? 'down' : 'neutral'} /></span>
        <span className="market-pill__change-value">{change}</span>
      </div>
    </div>
  );
}
