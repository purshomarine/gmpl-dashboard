// ─── GMPL Premium Design System — v2 (High Contrast Chairman Edition) ────────
// Optimised for readability at 45+ — larger text, higher contrast, clear hierarchy

export const C = {
  // Backgrounds — slightly warmer and lighter than v1 for better daylight legibility
  bg:           '#071120',
  surface:      '#0C1A2E',
  card:         '#112236',
  cardAlt:      '#0A1828',
  cardHover:    '#162A48',
  border:       '#1E3558',
  borderGold:   'rgba(201,164,87,0.3)',
  borderActive: 'rgba(201,164,87,0.6)',

  // Brand
  gold:         '#C9A457',
  goldLight:    '#E8C97A',
  goldGlow:     'rgba(201,164,87,0.12)',

  // Semantic — unchanged
  green:        '#10D9A0',
  greenDim:     '#0A3A2E',
  red:          '#F43F5E',
  redDim:       '#3A0A14',
  amber:        '#F59E0B',
  amberDim:     '#3A2208',
  blue:         '#3B9EFF',
  blueDim:      '#0A2040',
  teal:         '#14B8A6',
  purple:       '#A78BFA',
  purpleDim:    '#1E0A3A',

  // Text — all lifted for contrast. Min 4.8:1 ratio on card bg
  text:         '#F4F8FF',   // was #EEF5FF — brighter
  textSub:      '#B0C8DC',   // was #8FAAC8 — significantly brighter
  textMuted:    '#7A9AB8',   // was #4A6A8A — much more readable
  navy:         '#0D1B2A',
}

export const STATUS_COLOR = { green: C.green, amber: C.amber, red: C.red }
export const STATUS_DIM   = { green: C.greenDim, amber: C.amberDim, red: C.redDim }
export const STATUS_PULSE = { green: 'pulse-green', amber: 'pulse-amber', red: 'pulse-red' }

// ─── Atoms ───────────────────────────────────────────────────────────────────

export function StatusDot({ s, size = 9, animate = false }) {
  const col = STATUS_COLOR[s] || C.textMuted
  return (
    <span className={animate ? STATUS_PULSE[s] || '' : ''} style={{
      width: size, height: size, borderRadius: '50%',
      background: col, display: 'inline-block', flexShrink: 0,
    }} />
  )
}

export function Badge({ status, label }) {
  const map = {
    approved:    { c: C.green,  bg: C.greenDim  },
    submitted:   { c: C.blue,   bg: C.blueDim   },
    pending:     { c: C.amber,  bg: C.amberDim  },
    connected:   { c: C.green,  bg: C.greenDim  },
    demo:        { c: C.amber,  bg: C.amberDim  },
    overdue:     { c: C.red,    bg: C.redDim    },
    open:        { c: C.blue,   bg: C.blueDim   },
    complete:    { c: C.green,  bg: C.greenDim  },
    active:      { c: C.green,  bg: C.greenDim  },
    pipeline:    { c: C.purple, bg: C.purpleDim },
    pass:        { c: C.green,  bg: C.greenDim  },
    fail:        { c: C.red,    bg: C.redDim    },
    closed:      { c: C.textMuted, bg: C.cardAlt },
    low:         { c: C.green,  bg: C.greenDim  },
    medium:      { c: C.amber,  bg: C.amberDim  },
    high:        { c: C.red,    bg: C.redDim    },
    info:        { c: C.blue,   bg: C.blueDim   },
  }
  const { c, bg } = map[status] || { c: C.textMuted, bg: C.card }
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
      background: bg, color: c, letterSpacing: '0.06em', border: `1px solid ${c}22`,
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>
      {label || status}
    </span>
  )
}

export function SectionLabel({ children, accent }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
      color: accent ? C.gold : C.textMuted,
      marginBottom: 14, textTransform: 'uppercase',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {accent && <span style={{ width: 16, height: 2, background: C.gold, display: 'inline-block', borderRadius: 1 }} />}
      {children}
    </div>
  )
}

export function Card({ children, style = {}, accent, glow, onClick }) {
  const accentStyle = accent ? {
    borderLeft: `3px solid ${accent}`,
    background: `linear-gradient(135deg, #112236 0%, #13284A 100%)`,
  } : {}
  return (
    <div onClick={onClick} style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '18px 20px',
      boxShadow: glow
        ? `0 0 24px rgba(201,164,87,0.14), 0 4px 28px rgba(0,0,0,0.45)`
        : '0 4px 24px rgba(0,0,0,0.35)',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      cursor: onClick ? 'pointer' : 'default',
      ...accentStyle,
      ...style,
    }}>
      {children}
    </div>
  )
}

export function HeroCard({ children, style = {} }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, #0A1C30 0%, #0F2444 50%, #0A1C30 100%)`,
      border: `1px solid rgba(201,164,87,0.22)`,
      borderRadius: 14,
      padding: '22px 26px',
      boxShadow: '0 0 40px rgba(201,164,87,0.08), 0 8px 40px rgba(0,0,0,0.55)',
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', top: -50, right: -50,
        width: 240, height: 240, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,164,87,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {children}
    </div>
  )
}

// KpiCard — larger numbers, clearer labels, better contrast
export function KpiCard({ label, value, sub, trend, color, large }) {
  const col = color || C.text
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: '16px 18px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: C.textMuted,
        letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 8,
      }}>{label}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: large ? 36 : 30,
        fontWeight: 600, color: col, lineHeight: 1.1,
      }}>{value}</div>
      {(sub || trend !== undefined) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          {trend !== undefined && trend !== null && (
            <span style={{ fontSize: 12, fontWeight: 700, color: trend > 0 ? C.green : C.red }}>
              {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
            </span>
          )}
          {sub && <span style={{ fontSize: 12, color: C.textMuted }}>{sub}</span>}
        </div>
      )}
    </div>
  )
}

export function GoldButton({ children, onClick, style = {}, outline }) {
  return (
    <button onClick={onClick} style={{
      fontSize: 12, fontWeight: 600,
      color: outline ? C.gold : C.bg,
      background: outline ? 'transparent' : `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
      border: `1px solid ${C.gold}`,
      padding: '8px 16px', borderRadius: 6,
      letterSpacing: '0.02em', whiteSpace: 'nowrap',
      transition: 'all 0.2s',
      boxShadow: outline ? 'none' : '0 2px 12px rgba(201,164,87,0.3)',
      ...style,
    }}>
      {children}
    </button>
  )
}

export function Divider() {
  return <div style={{ height: 1, background: C.border, margin: '14px 0' }} />
}

// Metric row inside a card — label left, value right
export function MetricRow({ label, value, color, mono }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '9px 0', borderBottom: `1px solid ${C.border}22`,
    }}>
      <span style={{ fontSize: 13, color: C.textSub }}>{label}</span>
      <span style={{
        fontSize: 14, fontWeight: 600, color: color || C.text,
        fontFamily: mono ? 'DM Mono, monospace' : 'inherit',
      }}>{value}</span>
    </div>
  )
}

export const tooltipStyle = {
  contentStyle: {
    background: '#112236',
    border: `1px solid rgba(201,164,87,0.3)`,
    borderRadius: 8, color: '#F4F8FF', fontSize: 13,
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  labelStyle: { color: C.gold, fontWeight: 600, fontSize: 12 },
  itemStyle:  { color: '#B0C8DC', fontSize: 12 },
}

// AI output wrapper with "Human in control" notice
export function AIOutput({ children, loading, loadingText = 'Generating…' }) {
  return (
    <div style={{
      background: C.cardAlt, borderRadius: 8, padding: '14px 16px',
      border: `1px solid ${C.borderGold}`,
    }}>
      {loading ? (
        <div style={{ color: C.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: C.gold }}>✦</span> {loadingText}
        </div>
      ) : children ? (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.gold, letterSpacing: '0.08em', marginBottom: 8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>✦ AI GENERATED</span>
            <span style={{ color: C.textMuted, fontWeight: 400, fontSize: 10 }}>Advisory only — Chairman retains final decision</span>
          </div>
          <div style={{ fontSize: 13, color: '#D0E0EE', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{children}</div>
        </>
      ) : null}
    </div>
  )
}
