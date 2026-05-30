import React from 'react';
import StatusDot from './StatusDot';

export default function AlertRow({ status = 'grey', domain, title, age, owner, detail, onExpand }) {
  return (
    <div className="alert-row" role="listitem">
      <div className="alert-row__status">
        <StatusDot status={status} title={`${domain} status`} />
      </div>

      <div className="alert-row__content">
        <div className="alert-row__domain">{domain}</div>
        <div className="alert-row__title">{title}</div>
        <div className="alert-row__meta">
          <span className="alert-row__owner">{owner}</span>
          <span className="alert-row__age">{age}</span>
        </div>
        {detail ? <div className="alert-row__detail">{detail}</div> : null}
      </div>

      <button type="button" className="alert-row__expand tap-target" onClick={onExpand} aria-label="Expand">
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden focusable="false"><path d="M12 16l-6-6h12z"/></svg>
      </button>
    </div>
  );
}
