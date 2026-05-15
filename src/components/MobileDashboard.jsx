import { useState, useRef, useEffect } from 'react'
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  LineChart, Line, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis
} from 'recharts'
import {
  VESSELS, VERTICALS, REVENUE_TREND, MARKET_DATA,
  CRITICAL_ITEMS, LEGAL_MATTERS, CERTIFICATES, RED_FLAGS,
  ACTIVE_DEALS, ALERTS, CONNECTORS, CREW_SIGNOFFS, HSE_KPI,
  INSPECTIONS, NURA_CHARTERS
} from '../data/seed.js'
import { chatWithAssistant } from '../lib/claude.js'

// ─── Mobile Design Tokens ───────────────────────────────────────────────────
const M = {
  bg:       '#091828',
  card:     '#112236',
  cardAlt:  '#0C1C30',
  border:   '#1A3050',
  gold:     '#D4AC5A',
  goldDim:  'rgba(212,172,90,0.12)',
  green:    '#0FD49A',
  greenDim: '#0A2E22',
  red:      '#F43F5E',
  redDim:   '#3A0A14',
  amber:    '#F59E0B',
  amberDim: '#2E1A04',
  blue:     '#3B9EFF',
  blueDim:  '#0A1E38',
  purple:   '#A78BFA',
  text:     '#FFFFFF',
  sub:      '#B8D0E8',
  muted:    '#6A8FAA',
  nav:      '#071120',
}

const SC = { green: M.green, amber: M.amber, red: M.red }

// ─── Utility Components ──────────────────────────────────────────────────────

function Dot({ s, size = 8, pulse }) {
  return (
    <span className={pulse ? `pulse-${s}` : ''} style={{
      width: size, height: size, borderRadius: '50%',
      background: SC[s] || M.muted,
      display: 'inline-block', flexShrink: 0,
    }} />
  )
}

function MCard({ children, style = {}, accent, onTap }) {
  return (
    <div onClick={onTap} style={{
      background: M.card,
      border: `1px solid ${accent ? accent + '44' : M.border}`,
      borderLeft: accent ? `3px solid ${accent}` : undefined,
      borderRadius: 14,
      padding: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function Tag({ label, color }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
      background: (color || M.gold) + '20', color: color || M.gold,
      border: `1px solid ${(color || M.gold)}44`,
      letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

function BigNum({ value, label, color, sub }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 700, color: color || M.gold, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 5 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: M.sub, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

// Ring/donut for utilisation
function Ring({ value, max = 100, size = 70, color, label, sub }) {
  const pct = Math.min((value / max) * 100, 100)
  const r = (size / 2) - 7
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <div style={{ textAlign: 'center', width: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={M.border} strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color || M.gold}
          strokeWidth={6} strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color || M.gold})` }}
        />
        <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: `${size/2}px ${size/2}px` }}
          fill={color || M.gold} fontSize={14} fontWeight={700} fontFamily="'Playfair Display',serif">
          {value}{max === 100 ? '%' : ''}
        </text>
      </svg>
      {label && <div style={{ fontSize: 10, fontWeight: 700, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 2 }}>{label}</div>}
      {sub && <div style={{ fontSize: 11, color: M.sub }}>{sub}</div>}
    </div>
  )
}

// Bottom sheet overlay
function Sheet({ title, children, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(4,10,20,0.75)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: M.card, borderRadius: '20px 20px 0 0',
        padding: '0 0 40px 0',
        maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
        animation: 'fade-up 0.25s ease',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, background: M.border, borderRadius: 2 }}/>
        </div>
        <div style={{ padding: '8px 20px 16px', borderBottom: `1px solid ${M.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 600, color: M.text }}>{title}</div>
          <button onClick={onClose} style={{ background: M.cardAlt, border: `1px solid ${M.border}`, color: M.muted, width: 30, height: 30, borderRadius: 15, fontSize: 18, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
        <div style={{ padding: '16px 20px' }}>{children}</div>
      </div>
    </div>
  )
}

// ─── TAB: SITUATION ROOM ─────────────────────────────────────────────────────

function SituationRoom({ onNavigate }) {
  const totalRev = VERTICALS.reduce((s, v) => s + v.rev, 0).toFixed(1)
  const totalEbitda = VERTICALS.reduce((s, v) => s + v.ebitda, 0).toFixed(1)
  const avgUtil = Math.round(VESSELS.reduce((s, v) => s + v.util, 0) / VESSELS.length)
  const redCount = RED_FLAGS.filter(f => f.status === 'red').length
  const legalExp = (LEGAL_MATTERS.reduce((s, m) => s + m.exp, 0) / 1e6).toFixed(1)
  const activeDeals = ACTIVE_DEALS.filter(d => d.status === 'active').length

  const domains = [
    { icon: '⚓', label: 'Fleet',    status: avgUtil >= 85 ? 'green' : avgUtil >= 75 ? 'amber' : 'red',   val: avgUtil + '%',  sub: 'utilisation',  tab: 'fleet'   },
    { icon: '⊞',  label: 'Finance',  status: 'green',                                                       val: '$' + totalRev + 'M', sub: 'revenue MTD', tab: 'finance' },
    { icon: '⚖',  label: 'Risk',     status: redCount > 3 ? 'red' : redCount > 0 ? 'amber' : 'green',      val: String(redCount),sub: 'red flags',   tab: 'risk'    },
    { icon: '◈',  label: 'Deals',    status: 'amber',                                                        val: String(activeDeals), sub: 'in progress', tab: 'deals'  },
  ]

  return (
    <div style={{ paddingBottom: 8 }}>

      {/* Date + greeting */}
      <div style={{ padding: '20px 20px 0', marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Good Morning — 13 May 2026</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: M.text }}>Goodearth Maritime</div>
        <div style={{ fontSize: 12, color: M.sub, marginTop: 2 }}>Chairman's Intelligence Dashboard</div>
      </div>

      {/* P&L Hero */}
      <div style={{ margin: '0 16px 16px', background: `linear-gradient(135deg, #0E2240 0%, #142E4A 100%)`, borderRadius: 18, padding: '20px', border: `1px solid rgba(212,172,90,0.25)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,172,90,0.1) 0%, transparent 70%)' }}/>
        <div style={{ fontSize: 10, fontWeight: 700, color: M.gold, letterSpacing: '0.12em', marginBottom: 12 }}>GROUP P&L THIS MONTH</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <BigNum value={`$${totalRev}M`} label="Revenue" color={M.gold}/>
          <div style={{ width: 1, height: 50, background: M.border }}/>
          <BigNum value={`$${totalEbitda}M`} label="EBITDA" color={M.green} sub={((totalEbitda / totalRev) * 100).toFixed(0) + '% margin'}/>
          <div style={{ width: 1, height: 50, background: M.border }}/>
          <BigNum value="82%" label="Fleet Util" color={M.amber}/>
        </div>
      </div>

      {/* Domain status grid */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Domain Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {domains.map(d => (
            <div key={d.label} onClick={() => onNavigate(d.tab)} style={{
              background: M.card, borderRadius: 14, padding: '14px',
              border: `1px solid ${SC[d.status]}33`,
              borderTop: `3px solid ${SC[d.status]}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: `${SC[d.status]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{d.icon}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: M.sub, letterSpacing: '0.04em' }}>{d.label}</div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: SC[d.status], lineHeight: 1.2 }}>{d.val}</div>
                <div style={{ fontSize: 10, color: M.muted }}>{d.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue sparkline */}
      <div style={{ margin: '0 16px 16px' }}>
        <MCard>
          <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Revenue Trend — 12 Months</div>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={REVENUE_TREND} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={M.gold} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={M.gold} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fill: M.muted, fontSize: 9 }} interval={2}/>
              <Tooltip contentStyle={{ background: M.card, border: `1px solid ${M.border}`, borderRadius: 8, fontSize: 12, color: M.text }} formatter={v => ['$' + v + 'M']}/>
              <Area type="monotone" dataKey="r" stroke={M.gold} strokeWidth={2} fill="url(#goldFill)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </MCard>
      </div>

      {/* AI Briefing */}
      <div style={{ margin: '0 16px 16px' }}>
        <MCard accent={M.gold}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, background: `linear-gradient(135deg,${M.gold},#E8C97A)`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#071120', fontWeight: 800 }}>✦</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: M.gold }}>AI Briefing — This Morning</div>
          </div>
          {[
            { c: M.red,   icon: '⚠', txt: 'MV Saffron Star SMC expires 11 days — immediate approval needed' },
            { c: M.amber, icon: '◎', txt: 'Petrochemical Corp arbitration 14 Jun — briefing unconfirmed' },
            { c: M.green, icon: '✓', txt: 'Fleet utilisation 82% — 3rd consecutive month above 80% target' },
            { c: M.blue,  icon: '↗', txt: 'Baltic Dry +3.2% — chemical tanker demand strengthening Gulf' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{ color: b.c, fontSize: 14, marginTop: 1, flexShrink: 0 }}>{b.icon}</span>
              <span style={{ fontSize: 13, color: M.sub, lineHeight: 1.5 }}>{b.txt}</span>
            </div>
          ))}
        </MCard>
      </div>

      {/* Critical items */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Decisions Required Today</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CRITICAL_ITEMS.slice(0, 3).map(item => (
            <div key={item.id} style={{ background: M.card, borderRadius: 12, padding: '13px 15px', borderLeft: `3px solid ${item.urg === 'high' ? M.red : M.amber}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Dot s={item.urg === 'high' ? 'red' : 'amber'} size={9} pulse/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: M.text, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: M.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</div>
              </div>
              <div style={{ fontSize: 12, color: M.gold, flexShrink: 0 }}>›</div>
            </div>
          ))}
        </div>
      </div>

      {/* Market data */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10, marginTop: 16 }}>Live Market</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {MARKET_DATA.map(m => (
            <div key={m.label} style={{ background: M.card, borderRadius: 10, padding: '11px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: m.warn ? `1px solid ${M.amber}33` : `1px solid ${M.border}` }}>
              <span style={{ fontSize: 13, color: M.sub }}>{m.label}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: m.warn ? M.amber : M.text }}>{m.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: m.warn ? M.amber : m.up ? M.green : M.red }}>{m.delta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TAB: FLEET ──────────────────────────────────────────────────────────────

function FleetTab() {
  const [selected, setSelected] = useState(null)
  const scrollRef = useRef(null)
  const avgUtil = Math.round(VESSELS.reduce((s, v) => s + v.util, 0) / VESSELS.length)
  const totalPL = VESSELS.reduce((s, v) => s + v.pl, 0)
  const onHire  = VESSELS.filter(v => v.util > 0).length

  const STATUS_EMOJI = { green: '🟢', amber: '🟡', red: '🔴' }

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Fleet Operations</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: M.text }}>Maritime</div>
      </div>

      {/* Fleet health rings */}
      <div style={{ margin: '0 16px 16px', background: `linear-gradient(135deg, #0E2240, #122A42)`, borderRadius: 18, padding: '18px 16px', border: `1px solid ${M.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <Ring value={avgUtil} color={avgUtil >= 85 ? M.green : M.amber} label="Utilisation"/>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: M.gold }}>{onHire}/{VESSELS.length}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>On Hire</div>
          </div>
          <Ring value={Math.round((VESSELS.filter(v => v.certs === 'ok').length / VESSELS.length) * 100)} color={M.green} label="Compliant"/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${M.border}` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: totalPL >= 0 ? M.green : M.red }}>{totalPL >= 0 ? '+' : ''}${(totalPL / 1e6).toFixed(2)}M</div>
            <div style={{ fontSize: 10, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>P&L MTD</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: M.amber }}>{VESSELS.reduce((s, v) => s + v.defects, 0)}</div>
            <div style={{ fontSize: 10, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Open Defects</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 600, color: M.text }}>{VESSELS.reduce((s, v) => s + v.crew, 0)}</div>
            <div style={{ fontSize: 10, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Crew on Board</div>
          </div>
        </div>
      </div>

      {/* Vessel cards — scrollable horizontal */}
      <div style={{ padding: '0 16px', marginBottom: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Vessels — Tap to Drill Down</div>
      </div>
      <div ref={scrollRef} style={{ paddingBottom: 4 }}>
        {VESSELS.map(v => (
          <div key={v.id} style={{ margin: '0 16px 10px' }}>
            <div onClick={() => setSelected(v)} style={{
              background: M.card, borderRadius: 14, padding: '14px 16px',
              border: `1px solid ${SC[v.status]}33`,
              borderLeft: `4px solid ${SC[v.status]}`,
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 15 }}>{STATUS_EMOJI[v.status]}</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: M.text }}>{v.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: M.muted }}>{v.type} · {v.flag} · {v.dwt.toLocaleString()} DWT</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: v.pl >= 0 ? M.green : M.red }}>{v.pl >= 0 ? '+' : ''}${(v.pl / 1000).toFixed(0)}K</div>
                  <div style={{ fontSize: 10, color: M.muted }}>P&L MTD</div>
                </div>
              </div>
              {/* Utilisation bar */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: M.muted }}>Utilisation</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: v.util >= v.target ? M.green : v.util >= v.target - 10 ? M.amber : M.red }}>{v.util}% <span style={{ color: M.muted, fontWeight: 400 }}>/ {v.target}% target</span></span>
                </div>
                <div style={{ height: 6, background: M.cardAlt, borderRadius: 3 }}>
                  <div style={{ width: `${v.util}%`, height: '100%', borderRadius: 3, background: v.util >= v.target ? M.green : v.util >= v.target - 10 ? M.amber : M.red, boxShadow: `0 0 6px ${v.util >= v.target ? M.green : M.amber}` }}/>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Tag label={v.pos} color={M.blue}/>
                {v.dayRate > 0 && <Tag label={`$${v.dayRate.toLocaleString()}/day`} color={M.gold}/>}
                <Tag label={v.certs === 'ok' ? '✓ Certs' : v.certs === 'warning' ? '⚠ Certs' : '✗ Certs'} color={v.certs === 'ok' ? M.green : v.certs === 'warning' ? M.amber : M.red}/>
                {v.defects > 0 && <Tag label={`${v.defects} defects`} color={v.defects > 5 ? M.red : M.amber}/>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate expiry */}
      <div style={{ padding: '8px 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Certificate Expiry — 90 Days</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CERTIFICATES.slice(0, 4).map((c, i) => (
            <div key={i} style={{ background: M.card, borderRadius: 10, padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `3px solid ${SC[c.status]}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: M.text }}>{c.cert}</div>
                <div style={{ fontSize: 11, color: M.muted }}>{c.vessel}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: SC[c.status] }}>{c.days}d</div>
                <div style={{ fontSize: 10, color: M.muted }}>{c.expires}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vessel drill-through sheet */}
      {selected && (
        <Sheet title={selected.name} onClose={() => setSelected(null)}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <Tag label={selected.type} color={M.blue}/>
            <Tag label={selected.flag} color={M.muted}/>
            <Tag label={selected.certs === 'ok' ? '✓ Certs Current' : '⚠ Certs Expiring'} color={selected.certs === 'ok' ? M.green : M.amber}/>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
            {[
              { l: 'Position',    v: selected.pos },
              { l: 'Route',       v: selected.route },
              { l: 'Utilisation', v: `${selected.util}% (tgt ${selected.target}%)` },
              { l: 'P&L MTD',     v: `${selected.pl >= 0 ? '+' : ''}$${selected.pl.toLocaleString()}` },
              { l: 'Day Rate',    v: selected.dayRate ? `$${selected.dayRate.toLocaleString()}/day` : 'Idle' },
              { l: 'Crew',        v: `${selected.crew} on board` },
              { l: 'Open Defects',v: `${selected.defects} items` },
              { l: 'DWT / Built', v: `${selected.dwt.toLocaleString()} / ${selected.built}` },
              { l: 'Class',       v: `${selected.class} · IMO ${selected.imo}` },
              { l: 'Voyage Days', v: selected.voyageDays ? `${selected.voyageDays} days` : 'Idle' },
            ].map(r => (
              <div key={r.l} style={{ background: M.cardAlt, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{r.l}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: M.text }}>{r.v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: M.goldDim, border: `1px solid ${M.gold}44`, borderRadius: 10, padding: '12px 16px', textAlign: 'center', color: M.gold, fontSize: 13, fontWeight: 600 }}>
            ✦ Generate AI Vessel Briefing →
          </div>
        </Sheet>
      )}
    </div>
  )
}

// ─── TAB: FINANCE ────────────────────────────────────────────────────────────

function FinanceTab() {
  const totalRev    = VERTICALS.reduce((s, v) => s + v.rev, 0)
  const totalEbitda = VERTICALS.reduce((s, v) => s + v.ebitda, 0)
  const COLORS = [M.gold, M.green, M.amber, M.blue]

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Zoho ERP · Finance</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: M.text }}>Group Financials</div>
      </div>

      {/* Hero numbers */}
      <div style={{ margin: '0 16px 16px', background: `linear-gradient(135deg, #0E2240, #122A42)`, borderRadius: 18, padding: '20px', border: `1px solid ${M.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <BigNum value={`$${totalRev.toFixed(1)}M`} label="Revenue" color={M.gold} sub="+4.2% MoM"/>
          <div style={{ width: 1, background: M.border }}/>
          <BigNum value={`$${totalEbitda.toFixed(1)}M`} label="EBITDA" color={M.green} sub={((totalEbitda/totalRev)*100).toFixed(0)+'% margin'}/>
        </div>
      </div>

      {/* Revenue donut */}
      <div style={{ margin: '0 16px 16px' }}>
        <MCard>
          <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 12 }}>Revenue by Vertical</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <PieChart width={130} height={130}>
              <Pie data={VERTICALS} dataKey="rev" cx="50%" cy="50%" outerRadius={58} innerRadius={36} paddingAngle={3}>
                {VERTICALS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1 }}>
              {VERTICALS.map((v, i) => (
                <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i], display: 'inline-block' }}/>
                    <span style={{ fontSize: 12, color: M.sub }}>{v.name.replace('Ship ', '')}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: M.text }}>${v.rev}M</span>
                    <span style={{ fontSize: 10, color: v.trend >= 0 ? M.green : M.red, marginLeft: 4 }}>{v.trend >= 0 ? '▲' : '▼'}{Math.abs(v.trend)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MCard>
      </div>

      {/* Vertical cards */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Vertical Breakdown</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {VERTICALS.map((v, i) => (
            <div key={v.id} style={{ background: M.card, borderRadius: 12, padding: '14px', border: `1px solid ${M.border}`, borderTop: `3px solid ${COLORS[i]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: M.text, marginBottom: 2 }}>{v.name}</div>
                  <div style={{ fontSize: 11, color: M.muted }}>Margin {v.margin}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: COLORS[i] }}>${v.rev}M</div>
                  <div style={{ fontSize: 11, color: v.trend >= 0 ? M.green : M.red, fontWeight: 600 }}>{v.trend >= 0 ? '▲' : '▼'} ${Math.abs(v.trend)}M MoM</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: M.cardAlt, borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Cash</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: M.blue }}>${v.cash}M</div>
                </div>
                <div style={{ flex: 1, background: M.cardAlt, borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>AR</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: v.receivables > 1.5 ? M.red : M.amber }}>${v.receivables}M</div>
                </div>
                <div style={{ flex: 1, background: M.cardAlt, borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>EBITDA</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: M.green }}>${v.ebitda}M</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connectors status */}
      <div style={{ padding: '8px 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>System Connections</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CONNECTORS.map(c => (
            <div key={c.name} style={{ background: M.card, borderRadius: 10, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${M.border}` }}>
              <Dot s={c.status === 'connected' ? 'green' : 'amber'} size={8} pulse={c.status === 'connected'}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: M.text }}>{c.name}</div>
                <div style={{ fontSize: 11, color: M.muted }}>{c.detail}</div>
              </div>
              <Tag label={c.status} color={c.status === 'connected' ? M.green : M.amber}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── TAB: RISK ───────────────────────────────────────────────────────────────

function RiskTab() {
  const [expanded, setExpanded] = useState(null)
  const redFlags = RED_FLAGS.filter(f => f.status === 'red')
  const amberFlags = RED_FLAGS.filter(f => f.status === 'amber')
  const totalExp = LEGAL_MATTERS.reduce((s, m) => s + m.exp, 0)

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Legal · Compliance · HSE</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: M.text }}>Risk &amp; Red Flags</div>
      </div>

      {/* Risk summary */}
      <div style={{ margin: '0 16px 16px', borderRadius: 18, padding: '18px', background: `linear-gradient(135deg, #1A0808, #2A0E14)`, border: `1px solid ${M.red}33` }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <BigNum value={String(redFlags.length)} label="Red Flags" color={M.red}/>
          <div style={{ width: 1, background: M.border }}/>
          <BigNum value={String(amberFlags.length)} label="Warnings" color={M.amber}/>
          <div style={{ width: 1, background: M.border }}/>
          <BigNum value={`$${(totalExp / 1e6).toFixed(1)}M`} label="Legal Exp." color={M.text}/>
        </div>
      </div>

      {/* Red flags */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Active Red Flags</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RED_FLAGS.map((f, i) => (
            <div key={i} style={{ background: M.card, borderRadius: 12, borderLeft: `4px solid ${SC[f.status]}`, padding: '12px 14px', cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: expanded === i ? 10 : 0 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Tag label={f.domain} color={SC[f.status]}/>
                  <div style={{ fontSize: 13, fontWeight: 600, color: M.text, marginTop: 6, marginBottom: 2 }}>{f.item}</div>
                </div>
                <span style={{ color: M.muted, fontSize: 16, marginLeft: 8, transform: expanded === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
              </div>
              {expanded === i && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  {[{ l: 'Actual', v: f.actual, c: SC[f.status] }, { l: 'Target', v: f.target, c: M.green }, { l: 'Gap', v: f.gap, c: SC[f.status] }].map(m => (
                    <div key={m.l} style={{ flex: 1, background: M.cardAlt, borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{m.l}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: m.c }}>{m.v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legal matters */}
      <div style={{ padding: '0 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>Active Legal Matters</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LEGAL_MATTERS.map(m => (
            <div key={m.id} style={{ background: M.card, borderRadius: 12, padding: '14px', borderLeft: `4px solid ${SC[m.status]}`, border: `1px solid ${SC[m.status]}33` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: M.text, marginBottom: 2 }}>{m.type}</div>
                  <div style={{ fontSize: 11, color: M.muted }}>vs {m.party}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: M.red }}>${(m.exp / 1e6).toFixed(2)}M</div>
                  <div style={{ fontSize: 10, color: M.muted }}>exposure</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Tag label={m.pos} color={M.blue}/>
                <Tag label={`Next: ${m.next}`} color={SC[m.status]}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HSE quick view */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>HSE Performance</div>
        <MCard>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <Ring value={Math.round((1 - HSE_KPI.LTIF / 2) * 100)} color={M.green} label="Safety" size={70}/>
            <div>
              {[
                { l: 'LTIF', v: String(HSE_KPI.LTIF), c: M.green, note: 'vs 0.68 industry' },
                { l: 'Days LTI-Free', v: String(HSE_KPI.daysWithoutLTI), c: M.green },
                { l: 'Open Actions', v: String(HSE_KPI.openActions), c: HSE_KPI.openActions > 0 ? M.amber : M.green },
              ].map(r => (
                <div key={r.l} style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: M.muted }}>{r.l}: </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: r.c }}>{r.v}</span>
                  {r.note && <span style={{ fontSize: 10, color: M.muted }}> {r.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </MCard>
      </div>
    </div>
  )
}

// ─── TAB: DEALS ──────────────────────────────────────────────────────────────

function DealsTab() {
  const [selected, setSelected] = useState(null)
  const totalSize = ACTIVE_DEALS.reduce((s, d) => s + d.dealSize, 0)
  const TYPE_COL = { 'Vessel Acquisition': M.gold, 'Newbuilding': M.green, 'Debt Financing': M.blue, 'Project Finance': M.purple }
  const TYPE_ICON = { 'Vessel Acquisition': '⚓', 'Newbuilding': '🏗', 'Debt Financing': '🏦', 'Project Finance': '📊' }

  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>M&A · Newbuilding · Finance</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 600, color: M.text }}>Active Deals</div>
      </div>

      {/* Summary */}
      <div style={{ margin: '0 16px 16px', background: `linear-gradient(135deg, #141C0E, #1C2A12)`, borderRadius: 18, padding: '18px', border: `1px solid ${M.green}22` }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <BigNum value={`$${(totalSize / 1e6).toFixed(0)}M`} label="Pipeline" color={M.gold}/>
          <div style={{ width: 1, background: M.border }}/>
          <BigNum value={String(ACTIVE_DEALS.filter(d => d.status === 'active').length)} label="Active" color={M.green}/>
          <div style={{ width: 1, background: M.border }}/>
          <BigNum value={`${(ACTIVE_DEALS.filter(d => d.projectIRR).reduce((s, d) => s + d.projectIRR, 0) / ACTIVE_DEALS.filter(d => d.projectIRR).length).toFixed(1)}%`} label="Avg IRR" color={M.green}/>
        </div>
      </div>

      {/* Deal cards */}
      <div style={{ padding: '0 16px', marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: M.muted, letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 10 }}>All Deals — Tap to Expand</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ACTIVE_DEALS.map(deal => {
            const col = TYPE_COL[deal.type] || M.gold
            const isOpen = selected?.id === deal.id
            return (
              <div key={deal.id} onClick={() => setSelected(isOpen ? null : deal)} style={{ background: M.card, borderRadius: 14, padding: '16px', border: `1px solid ${col}33`, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, background: `${col}18`, border: `2px solid ${col}44`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{TYPE_ICON[deal.type]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 600, color: M.text, marginBottom: 4 }}>{deal.name}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Tag label={deal.type} color={col}/>
                      <Tag label={deal.stage} color={M.muted}/>
                      <Tag label={deal.status} color={deal.status === 'active' ? M.green : M.purple}/>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: col }}>${(deal.dealSize / 1e6).toFixed(1)}M</div>
                    <div style={{ fontSize: 10, color: M.muted }}>deal size</div>
                  </div>
                </div>

                {/* Financial metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                  {[
                    { l: 'Project IRR', v: deal.projectIRR ? deal.projectIRR + '%' : '—', c: deal.projectIRR > 15 ? M.green : M.amber },
                    { l: 'Equity IRR',  v: deal.equityIRR  ? deal.equityIRR  + '%' : '—', c: deal.equityIRR > 20  ? M.green : M.amber },
                    { l: 'Leverage',    v: deal.leverage   + '%',                           c: M.text },
                    { l: 'Equity Req.', v: `$${(deal.cashRequired / 1e6).toFixed(1)}M`,    c: M.amber },
                    { l: 'Debt',        v: `$${(deal.debt / 1e6).toFixed(1)}M`,            c: M.text },
                    { l: 'Payback',     v: deal.paybackYears ? deal.paybackYears + 'y' : '—', c: M.text },
                  ].map(m => (
                    <div key={m.l} style={{ background: M.cardAlt, borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: M.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>{m.l}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: m.c }}>{m.v}</div>
                    </div>
                  ))}
                </div>

                {isOpen && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${M.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: col, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Purpose</div>
                    <div style={{ fontSize: 13, color: M.sub, lineHeight: 1.6, marginBottom: 12 }}>{deal.purpose}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: col, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Highlights</div>
                    <div style={{ fontSize: 13, color: M.sub, lineHeight: 1.6, marginBottom: 12 }}>{deal.highlights}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { l: 'Counterparty', v: deal.counterparty },
                        { l: 'Deal Lead',    v: deal.lead },
                        { l: 'Target Close', v: deal.targetClose },
                        { l: 'Vertical',     v: deal.vertical },
                      ].map(r => (
                        <div key={r.l} style={{ background: M.cardAlt, borderRadius: 8, padding: '8px 10px' }}>
                          <div style={{ fontSize: 10, color: M.muted, marginBottom: 2 }}>{r.l}</div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: M.text }}>{r.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, background: M.goldDim, border: `1px solid ${M.gold}44`, borderRadius: 10, padding: '11px', textAlign: 'center', color: M.gold, fontSize: 13, fontWeight: 600 }}>
                      ✦ Generate Investment Memo →
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── FLOATING AI ASSISTANT ───────────────────────────────────────────────────

function MobileAssistant({ onClose }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Good morning. Ask me anything about GMPL — fleet status, financials, legal matters, or active deals." }])
  const [input, setInput]       = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send() {
    if (!input.trim()) return
    const msg = { role: 'user', content: input }
    const hist = [...messages, msg]
    setMessages(hist); setInput(''); setThinking(true)
    const reply = await chatWithAssistant(messages, input)
    setMessages(p => [...p, { role: 'assistant', content: reply }])
    setThinking(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: M.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #0A1C32, #0F2444)`, borderBottom: `1px solid ${M.border}`, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, background: `linear-gradient(135deg,${M.gold},#E8C97A)`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#071120', fontWeight: 800 }}>✦</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: M.gold }}>Chairman's Assistant</div>
            <div style={{ fontSize: 10, color: M.muted }}>AI-powered · Goodearth Maritime</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: M.card, border: `1px solid ${M.border}`, color: M.muted, width: 32, height: 32, borderRadius: 16, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${M.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
          {['What needs my attention?', 'Saffron Star status?', 'Legal exposure?', 'Fleet utilisation?', 'Active deals IRR?'].map(q => (
            <button key={q} onClick={() => setInput(q)} style={{ background: M.card, border: `1px solid ${M.border}`, color: M.sub, fontSize: 11, padding: '6px 12px', borderRadius: 20, whiteSpace: 'nowrap', fontFamily: 'inherit', flexShrink: 0 }}>{q}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            <div style={{
              maxWidth: '88%', padding: '12px 16px', borderRadius: 16,
              background: m.role === 'user' ? M.goldDim : M.card,
              border: `1px solid ${m.role === 'user' ? M.gold + '44' : M.border}`,
              fontSize: 14, color: M.text, lineHeight: 1.75,
              borderBottomRightRadius: m.role === 'user' ? 4 : 16,
              borderBottomLeftRadius: m.role === 'assistant' ? 4 : 16,
              whiteSpace: 'pre-wrap',
            }}>{m.content}</div>
          </div>
        ))}
        {thinking && (
          <div style={{ display: 'flex', gap: 5, padding: '12px 16px', background: M.card, borderRadius: 16, width: 70, border: `1px solid ${M.border}` }}>
            {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: M.muted, display: 'inline-block', animation: `pulse-amber 1.2s ease ${i * 0.2}s infinite` }}/>)}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', paddingBottom: 32, background: M.nav, borderTop: `1px solid ${M.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about fleet, finance, deals…"
            style={{ flex: 1, background: M.card, border: `1px solid ${M.border}`, borderRadius: 24, color: M.text, padding: '12px 18px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
          />
          <button onClick={send} style={{ width: 46, height: 46, background: `linear-gradient(135deg,${M.gold},#E8C97A)`, border: 'none', borderRadius: 23, color: '#071120', fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>›</button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN MOBILE SHELL ───────────────────────────────────────────────────────

const TABS = [
  { k: 'home',    icon: '⌂',  label: 'Home'    },
  { k: 'fleet',   icon: '⚓',  label: 'Fleet'   },
  { k: 'finance', icon: '⊞',  label: 'Finance' },
  { k: 'risk',    icon: '⚑',  label: 'Risk'    },
  { k: 'deals',   icon: '◈',  label: 'Deals'   },
]

export default function MobileDashboard() {
  const [tab,       setTab]       = useState('home')
  const [assistant, setAssistant] = useState(false)
  const [alert,     setAlert]     = useState(true)

  const redCount = RED_FLAGS.filter(f => f.status === 'red').length

  const screens = {
    home:    <SituationRoom onNavigate={setTab}/>,
    fleet:   <FleetTab/>,
    finance: <FinanceTab/>,
    risk:    <RiskTab/>,
    deals:   <DealsTab/>,
  }

  return (
    <div style={{ background: M.bg, minHeight: '100vh', color: M.text, fontFamily: "'DM Sans', sans-serif", position: 'relative' }}>

      {/* Alert banner */}
      {alert && (
        <div style={{ background: `linear-gradient(90deg, #3D0A14, #5A0E1E)`, padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${M.red}44` }}>
          <span className="pulse-red" style={{ width: 7, height: 7, borderRadius: '50%', background: M.red, display: 'inline-block', flexShrink: 0 }}/>
          <span style={{ fontSize: 12, color: '#FCA5A5', flex: 1, lineHeight: 1.4 }}>MV Saffron Star — SMC expires 11 days. Action required.</span>
          <button onClick={() => setAlert(false)} style={{ background: 'none', border: 'none', color: '#FCA5A5', fontSize: 20, lineHeight: 1, flexShrink: 0, padding: '0 4px' }}>×</button>
        </div>
      )}

      {/* Scrollable content */}
      <div style={{ paddingBottom: 82, overflowY: 'auto', minHeight: 'calc(100vh - 82px)' }}>
        {screens[tab]}
      </div>

      {/* Floating AI button */}
      {!assistant && (
        <button onClick={() => setAssistant(true)} style={{
          position: 'fixed', right: 18, bottom: 92, zIndex: 100,
          width: 52, height: 52, borderRadius: 26,
          background: `linear-gradient(135deg,${M.gold},#E8C97A)`,
          border: 'none', color: '#071120', fontSize: 20, fontWeight: 800,
          boxShadow: '0 4px 20px rgba(212,172,90,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✦</button>
      )}

      {/* Bottom navigation */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: M.nav, borderTop: `1px solid ${M.border}`,
        display: 'flex', paddingBottom: 'env(safe-area-inset-bottom, 8px)',
        boxShadow: '0 -4px 30px rgba(0,0,0,0.5)',
      }}>
        {TABS.map(t => {
          const isActive = tab === t.k
          return (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              flex: 1, padding: '10px 4px 8px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, background: 'none', border: 'none', position: 'relative',
            }}>
              <span style={{ fontSize: 20, opacity: isActive ? 1 : 0.45, transition: 'all 0.2s' }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? M.gold : M.muted, letterSpacing: '0.04em', transition: 'all 0.2s' }}>{t.label}</span>
              {isActive && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 3, background: M.gold, borderRadius: '2px 2px 0 0' }}/>}
              {t.k === 'risk' && redCount > 0 && (
                <span style={{ position: 'absolute', top: 6, right: '22%', width: 15, height: 15, background: M.red, borderRadius: '50%', fontSize: 9, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{redCount}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* AI Assistant full screen */}
      {assistant && <MobileAssistant onClose={() => setAssistant(false)}/>}
    </div>
  )
}
