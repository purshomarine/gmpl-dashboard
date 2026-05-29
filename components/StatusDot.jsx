import React from 'react';

export default function StatusDot({ status = 'grey', title }) {
  const tokenMap = {
    green: 'var(--status-green)',
    amber: 'var(--status-amber)',
    red: 'var(--status-red)',
    blue: 'var(--status-blue)',
    grey: 'var(--text-muted)'
  };

  const bg = tokenMap[status] || tokenMap.grey;
  const style = {
    backgroundColor: bg,
    width: 'var(--space-2)',
    height: 'var(--space-2)',
    borderRadius: '50%'
  };

  if (status === 'red') {
    // Use global `pulse` keyframes defined in base.css
    style.animation = 'pulse 2s infinite';
  }

  return (
    <span
      className="status-dot"
      style={style}
      role="img"
      aria-label={title || `${status} status`}
    />
  );
}
