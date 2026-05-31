import { C, Card } from './ui.jsx'
import { CRITICAL_ITEMS, MARKET_DATA } from '../data/seed.js'

function getBriefingMode() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  return 'review'
}

function ts() {
  const n = new Date()
  return (
    n.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' +
    n.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) +
    ' ' +
    n.toLocaleTimeString('en-GB', { timeZoneName: 'short' }).split(' ').pop()
  )
}

const DEADLINES = [
  { date: '3 Jun', item: 'Petrochemical Corp — payment due $240K' },
  { date: '5 Jun', item: 'Crew rotation — MT Anael, 3 officers off' },
  { date: '7 Jun', item: 'D005 broker bids deadline' },
]

const AM_UPDATES = [
  { col: '#0FD49A', icon: '✓', txt: 'Hill Dickinson confirmed for 14 Jun — 10:42 AM' },
  { col: '#0FD49A', icon: '↑', txt: 'Payment received: Nura Ship Mgmt $85K — 11:15 AM' },
  { col: '#F59E0B', icon: '⚠', txt: 'MT Prelude ETA shifted — now 6 Jun (was 4 Jun)' },
]

const STILL_OPEN = [
  'IOPP renewal survey not yet booked — Day 2 unactioned',
  'Maersk Tankers pool alloc. date — no response',
]

const REVIEW_RESOLVED = [
  'Hill Dickinson briefing confirmed for 14 Jun',
  '$85K payment received from Nura Ship Mgmt',
]

const REVIEW_PENDING = [
  'IOPP survey booking (Day 2 unactioned)',
  'Maersk pool alloc. — no response (Day 3)',
]

const TOMORROW = [
  { urg: 'high', txt: 'Book IOPP survey — now 37 days, escalating' },
  { urg: 'high', txt: 'Call Maersk Tankers — 3 days no response' },
  { urg: 'med',  txt: 'D005 broker bids close — review by 09:00' },
]

// BCTI, VLSFO, Maersk Pool TCE
const MKT = MARKET_DATA.filter((_, i) => [1, 3, 5].includes(i))

function SectionHd({ label, col }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 700, color: col, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
      {label}
    </div>
  )
}

function BriefHeader({ icon, label, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: `linear-gradient(135deg,${color},${color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: C.bg }}>{icon}</div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color }}>{label}</div>
        <div style={{ fontSize: 10, color: C.textMuted }}>{ts()}</div>
      </div>
    </div>
  )
}

function MorningBrief() {
  const high = CRITICAL_ITEMS.filter(i => i.urg === 'high')
  return (
    <Card accent={C.gold} glow>
      <BriefHeader icon="✦" label="Chairman's Morning Brief" color={C.gold} />

      <div style={{ marginBottom: 16 }}>
        <SectionHd label="Today's Priority Actions" col={C.red} />
        <div style={{ background: 'rgba(244,63,94,0.06)', borderRadius: 8, border: `1px solid ${C.red}22`, overflow: 'hidden' }}>
          {high.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: i < high.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'flex-start' }}>
              <span style={{ color: C.red, fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>⚠ {i + 1}</span>
              <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{item.title} — {item.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <SectionHd label="Overnight Market" col={C.blue} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {MKT.map(m => (
              <div key={m.label} style={{ background: C.cardAlt, borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: m.warn ? C.amber : C.text }}>
                  {m.value}{' '}
                  <span style={{ fontSize: 10, fontWeight: 600, color: m.up ? C.green : C.red }}>{m.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHd label="This Week's Deadlines" col={C.amber} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {DEADLINES.map(d => (
              <div key={d.date} style={{ background: C.cardAlt, borderRadius: 6, padding: '8px 10px', border: `1px solid ${C.amber}22` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.amber }}>{d.date}</div>
                <div style={{ fontSize: 11, color: C.textSub, lineHeight: 1.4, marginTop: 1 }}>{d.item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionHd label="On Track" col={C.green} />
        {[
          'Fleet utilisation 87% — above 80% target for third consecutive month',
          'Ship Management margin 40% — strongest performing vertical this quarter',
          'MT Nura Kara and MT Anael above 91% utilised this month',
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
            <span style={{ color: C.green, fontSize: 12, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function AfternoonPulse() {
  return (
    <Card accent={C.blue}>
      <BriefHeader icon="◎" label={`Afternoon Pulse — ${AM_UPDATES.length} updates since morning`} color={C.blue} />

      <div style={{ marginBottom: 16 }}>
        <SectionHd label="Since This Morning" col={C.blue} />
        <div style={{ background: C.cardAlt, borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}` }}>
          {AM_UPDATES.map((u, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: i < AM_UPDATES.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'flex-start' }}>
              <span style={{ color: u.col, fontSize: 13, flexShrink: 0 }}>{u.icon}</span>
              <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{u.txt}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionHd label="Still Open From Morning" col={C.amber} />
        {STILL_OPEN.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
            <span style={{ color: C.amber, fontSize: 12, flexShrink: 0 }}>⚠</span>
            <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>

      <div>
        <SectionHd label="Financial Pulse — Today" col={C.gold} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Receipts Today',      val: '$85K',    col: C.green },
            { label: 'Outstanding Today',   val: '$0',      col: C.textSub },
            { label: 'Invoices Raised',     val: '2',       col: C.blue },
            { label: 'Overdue (unchanged)', val: '$1.38M',  col: C.amber },
          ].map(s => (
            <div key={s.label} style={{ background: C.cardAlt, borderRadius: 6, padding: '9px 12px' }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: s.col }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function DayInReview() {
  return (
    <Card accent={C.amber}>
      <BriefHeader icon="◑" label="Day in Review" color={C.amber} />

      <div style={{ marginBottom: 16 }}>
        <SectionHd label="Today's Scorecard" col={C.gold} />
        <div style={{ background: C.cardAlt, borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.border}` }}>
          {REVIEW_RESOLVED.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: `1px solid ${C.border}`, alignItems: 'flex-start' }}>
              <span style={{ color: C.green, fontSize: 12, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
          {REVIEW_PENDING.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: i < REVIEW_PENDING.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'flex-start' }}>
              <span style={{ color: C.amber, fontSize: 12, flexShrink: 0 }}>○</span>
              <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <SectionHd label="Today in Numbers" col={C.textMuted} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { label: 'Fleet Util',      val: '87% ↔',     col: C.amber },
            { label: 'Payments In',     val: '$85K',       col: C.green },
            { label: 'Invoices Raised', val: '2',          col: C.blue },
            { label: 'Market Close',    val: 'BCTI +0.6%', col: C.textSub },
          ].map(s => (
            <div key={s.label} style={{ background: C.cardAlt, borderRadius: 6, padding: '9px 12px' }}>
              <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: s.col }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHd label="First Thing Tomorrow" col={C.gold} />
        <div style={{ background: 'rgba(212,172,90,0.07)', borderRadius: 8, border: `1px solid ${C.gold}33`, overflow: 'hidden' }}>
          {TOMORROW.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: i < TOMORROW.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'flex-start' }}>
              <span style={{ color: t.urg === 'high' ? C.red : C.amber, fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{t.txt}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function getBriefingTitle(modeOverride) {
  const mode = modeOverride || getBriefingMode()
  return mode === 'morning' ? "Chairman's Morning Brief"
    : mode === 'afternoon' ? 'Afternoon Pulse'
    : 'Day in Review'
}

export default function ExecutiveBriefing({ mode: modeOverride }) {
  const mode = modeOverride || getBriefingMode()
  if (mode === 'morning')   return <MorningBrief />
  if (mode === 'afternoon') return <AfternoonPulse />
  return <DayInReview />
}
