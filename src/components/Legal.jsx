import { useState } from 'react'
import { LEGAL_MATTERS, LEGAL_CALENDAR, CERTIFICATES } from '../data/seed.js'
import { C, Card, KpiCard, SectionLabel, GoldButton, StatusDot, Badge } from './ui.jsx'
import { generateTalkingPoints } from '../lib/claude.js'

const SC = { green:C.green, amber:C.amber, red:C.red }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function HearingCalendar({ events }) {
  const now = new Date()
  const months = [
    { year:2026, month:4 }, // May
    { year:2026, month:5 }, // Jun
    { year:2026, month:6 }, // Jul
    { year:2026, month:7 }, // Aug
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
      {months.map(({ year, month }) => {
        const monthEvents = events.filter(e => {
          const d = new Date(e.date)
          return d.getFullYear()===year && d.getMonth()===month
        })
        return (
          <div key={`${year}-${month}`} style={{ background:C.cardAlt, borderRadius:8, padding:'12px 14px', border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.gold, letterSpacing:'0.08em', marginBottom:10 }}>{MONTHS[month]} {year}</div>
            {monthEvents.length === 0 ? (
              <div style={{ fontSize:12, color:C.textMuted }}>No hearings scheduled</div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {monthEvents.map((e,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'8px 10px', background:C.card, borderRadius:6, borderLeft:`3px solid ${SC[e.type]||C.textMuted}` }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{new Date(e.date).getDate()} {MONTHS[new Date(e.date).getMonth()]}</div>
                      <div style={{ fontSize:11, color:C.textSub, marginTop:2 }}>{e.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Legal() {
  const [talkPoints, setTalkPoints] = useState({})
  const [loading, setLoading] = useState({})

  const totalExp      = LEGAL_MATTERS.reduce((s,m) => s+m.exp, 0)
  const totalSpendUSD = LEGAL_MATTERS.reduce((s,m) => s + (m.currency === 'INR' ? (m.spendUSD || 0) : (m.spend || 0)), 0)

  const today = new Date()
  const nextEvent = LEGAL_CALENDAR
    .filter(e => new Date(e.date) > today)
    .sort((a,b) => new Date(a.date) - new Date(b.date))[0]
  const nextEventLabel = nextEvent
    ? new Date(nextEvent.date).toLocaleDateString('en-GB', { day:'numeric', month:'short' })
    : '—'

  async function handleTalkPoints(m) {
    setLoading(p => ({...p, [m.id]:true}))
    const txt = await generateTalkingPoints(m)
    setTalkPoints(p => ({...p, [m.id]:txt}))
    setLoading(p => ({...p, [m.id]:false}))
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:10 }}>
        {[
          {label:'Active Matters',  value:String(LEGAL_MATTERS.length),          color:C.gold },
          {label:'Total Exposure',  value:`$${(totalExp/1e6).toFixed(1)}M`,       color:C.red  },
          {label:'Legal Spend YTD', value:`$${(totalSpendUSD/1000).toFixed(0)}K`,  color:C.amber},
          {label:'Next Event',      value:nextEventLabel,                          color:C.text },
        ].map(k=>(
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontWeight:600, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Litigation */}
      <Card>
        <SectionLabel accent>Active Litigation &amp; Disputes</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {LEGAL_MATTERS.map(m=>(
            <div key={m.id} style={{ background:C.cardAlt, border:`1px solid ${SC[m.status]}33`, borderLeft:`3px solid ${SC[m.status]}`, borderRadius:10, padding:'16px 18px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:3 }}>{m.type}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>vs {m.party} · GMPL as {m.pos} · {m.counsel}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:2 }}>Exposure</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.red, marginBottom:4 }}>${(m.exp/1e6).toFixed(2)}M</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>Legal Spend: {m.currency==='INR' ? `₹${(m.spend/1e6).toFixed(1)}M (~$${(m.spendUSD/1000).toFixed(0)}K USD)` : `$${(m.spend/1000).toFixed(0)}K`}</div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, flexWrap:'wrap' }}>
                <div style={{ background:`${SC[m.status]}11`, border:`1px solid ${SC[m.status]}33`, borderRadius:6, padding:'6px 12px', fontSize:12 }}>
                  <span style={{ color:C.textMuted }}>Next: </span>
                  <span style={{ color:SC[m.status], fontWeight:600 }}>{m.event}</span>
                  <span style={{ color:C.textMuted }}> — {new Date(m.next).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</span>
                </div>
                <GoldButton outline onClick={()=>handleTalkPoints(m)}>
                  {loading[m.id] ? '⟳ Generating…' : '✦ Talking Points →'}
                </GoldButton>
              </div>
              {talkPoints[m.id] && (
                <div style={{ marginTop:12, background:C.card, borderRadius:8, padding:'14px', border:`1px solid ${C.borderGold}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:'0.08em', marginBottom:8 }}>AI TALKING POINTS</div>
                  <div style={{ fontSize:12, color:'#C8D8EC', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{talkPoints[m.id]}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Hearing Calendar */}
      <Card>
        <SectionLabel accent>Hearing &amp; Events Calendar — Next 90 Days</SectionLabel>
        <HearingCalendar events={LEGAL_CALENDAR}/>
      </Card>

      {/* Certificate expiry */}
      <Card>
        <SectionLabel accent>Certificate Expiry Tracker — 90-Day Horizon</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {CERTIFICATES.map((c,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 14px', background:C.cardAlt, borderRadius:8, border:`1px solid ${SC[c.status]}22`, borderLeft:`3px solid ${SC[c.status]}` }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{c.cert}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{c.vessel}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:SC[c.status] }}>{c.days}d</div>
                <div style={{ fontSize:11, color:C.textMuted }}>Expires {c.expires}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CII Banner */}
      <div style={{ background:C.amberDim, border:`1px solid ${C.amber}44`, borderRadius:10, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:C.amber }}>⚠ CII Reporting Deadline — 31 May 2026</div>
          <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>Annual Carbon Intensity Indicator report — 3 vessels not yet submitted: MT Prelude, MT Anael, MT Nura Kara</div>
        </div>
        <GoldButton outline>Open CII Tracker →</GoldButton>
      </div>
    </div>
  )
}
