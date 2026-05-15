import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ACTIVE_DEALS, DEAL_STAGES } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, GoldButton, Badge, tooltipStyle, MetricRow } from './ui.jsx'

const TYPE_COLOR = {
  'Vessel Acquisition': C.gold,
  'Newbuilding':        C.green,
  'Debt Financing':     C.blue,
  'Project Finance':    C.purple,
}

const STATUS_COL = { active: C.green, pipeline: C.purple, closed: C.textMuted }

function fmt(n) { return n ? '$' + (n/1e6).toFixed(1) + 'M' : '—' }
function pct(n)  { return n ? n.toFixed(1) + '%' : '—' }

export default function ActiveDeals() {
  const [selected, setSelected] = useState(null)

  const active   = ACTIVE_DEALS.filter(d => d.status === 'active')
  const pipeline = ACTIVE_DEALS.filter(d => d.status === 'pipeline')
  const totalSize = ACTIVE_DEALS.reduce((s,d) => s + d.dealSize, 0)
  const totalEquity= ACTIVE_DEALS.reduce((s,d) => s + d.equity, 0)
  const avgProjIRR = (ACTIVE_DEALS.filter(d=>d.projectIRR).reduce((s,d)=>s+(d.projectIRR||0),0) / ACTIVE_DEALS.filter(d=>d.projectIRR).length).toFixed(1)
  const avgEqIRR   = (ACTIVE_DEALS.filter(d=>d.equityIRR).reduce((s,d)=>s+(d.equityIRR||0),0) / ACTIVE_DEALS.filter(d=>d.equityIRR).length).toFixed(1)

  // Pipeline stage count
  const stageCounts = DEAL_STAGES.map(s => ({
    stage: s,
    count: ACTIVE_DEALS.filter(d => d.stage === s).length,
    value: ACTIVE_DEALS.filter(d => d.stage === s).reduce((a,b)=>a+b.dealSize,0),
  }))

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Hero summary */}
      <HeroCard>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:14, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:'0.12em', marginBottom:4 }}>GOOD EARTH MARITIME — DEAL PIPELINE · MAY 2026</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:13, color:C.textSub }}>Active Deals · Acquisitions · Newbuildings · Financing</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <div style={{ background:C.greenDim, border:`1px solid ${C.green}44`, borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:C.green }}>{active.length} Active</div>
            <div style={{ background:C.purpleDim, border:`1px solid ${C.purple}44`, borderRadius:20, padding:'5px 14px', fontSize:11, fontWeight:700, color:C.purple }}>{pipeline.length} In Pipeline</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12 }}>
          {[
            { label:'Total Deal Value',    value: fmt(totalSize),     color:C.gold  },
            { label:'Total Equity Required',value: fmt(totalEquity),  color:C.amber },
            { label:'Avg Project IRR',     value: avgProjIRR + '%',   color:C.green },
            { label:'Avg Equity IRR',      value: avgEqIRR + '%',     color:C.green },
            { label:'Deals in Active Stage',value:String(active.length), color:C.text },
          ].map(k=>(
            <div key={k.label} style={{ background:'rgba(6,12,24,0.6)', borderRadius:10, padding:'14px 16px', border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{k.label}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:600, color:k.color }}>{k.value}</div>
            </div>
          ))}
        </div>
      </HeroCard>

      {/* Deal stage pipeline visual */}
      <Card>
        <SectionLabel accent>Deal Pipeline — Stage Tracker</SectionLabel>
        <div style={{ display:'flex', gap:0, overflowX:'auto' }}>
          {DEAL_STAGES.map((stage, i) => {
            const deals = ACTIVE_DEALS.filter(d => d.stage === stage)
            const isLast = i === DEAL_STAGES.length - 1
            return (
              <div key={stage} style={{ flex:1, minWidth:110, position:'relative' }}>
                <div style={{
                  background: deals.length > 0 ? `${C.gold}15` : C.cardAlt,
                  border: `1px solid ${deals.length > 0 ? C.gold + '44' : C.border}`,
                  borderRight: isLast ? undefined : 'none',
                  padding:'14px 12px', textAlign:'center',
                  borderRadius: i===0 ? '8px 0 0 8px' : isLast ? '0 8px 8px 0' : 0,
                }}>
                  <div style={{ fontSize:10, fontWeight:700, color: deals.length>0 ? C.gold : C.textMuted, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:6 }}>{stage}</div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:600, color: deals.length>0 ? C.gold : C.textMuted }}>{deals.length}</div>
                  <div style={{ fontSize:11, color:C.textMuted, marginTop:4 }}>
                    {deals.length > 0 ? fmt(deals.reduce((a,b)=>a+b.dealSize,0)) : 'No deals'}
                  </div>
                  {deals.length > 0 && (
                    <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:3 }}>
                      {deals.map(d=>(
                        <div key={d.id} style={{ fontSize:10, color:C.textSub, background:C.card, borderRadius:3, padding:'2px 6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {d.name.split(' ').slice(0,3).join(' ')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!isLast && (
                  <div style={{ position:'absolute', right:-10, top:'50%', transform:'translateY(-50%)', zIndex:2, color: deals.length>0 ? C.gold : C.border, fontSize:18 }}>›</div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Deal cards */}
      <SectionLabel accent>All Active &amp; Pipeline Deals</SectionLabel>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {ACTIVE_DEALS.map(deal => {
          const isOpen = selected?.id === deal.id
          const typeCol = TYPE_COLOR[deal.type] || C.gold
          return (
            <Card key={deal.id} style={{ cursor:'pointer', border:`1px solid ${isOpen ? C.gold+'66' : C.border}`, boxShadow: isOpen ? `0 0 20px rgba(201,164,87,0.15)` : undefined }} onClick={()=>setSelected(isOpen ? null : deal)}>
              {/* Header row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:44, height:44, background:`${typeCol}18`, border:`2px solid ${typeCol}55`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                    {deal.type==='Vessel Acquisition'?'⚓':deal.type==='Newbuilding'?'🏗':deal.type==='Debt Financing'?'🏦':'🏗'}
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:600, color:C.text, marginBottom:3 }}>{deal.name}</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <Badge status={deal.status}/>
                      <span style={{ fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:4, background:`${typeCol}15`, color:typeCol, border:`1px solid ${typeCol}33` }}>{deal.type}</span>
                      <span style={{ fontSize:11, color:C.textMuted }}>Stage: <span style={{ color:C.gold, fontWeight:600 }}>{deal.stage}</span></span>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:600, color:C.gold }}>{fmt(deal.dealSize)}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>Total Deal Size</div>
                </div>
              </div>

              {/* Purpose */}
              <div style={{ fontSize:13, color:C.textSub, marginBottom:12, lineHeight:1.6 }}>{deal.purpose}</div>

              {/* Financial metrics grid */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:8, marginBottom: isOpen ? 14 : 0 }}>
                {[
                  { l:'Project IRR',   v:pct(deal.projectIRR), c: deal.projectIRR > 15 ? C.green : C.amber },
                  { l:'Equity IRR',    v:pct(deal.equityIRR),  c: deal.equityIRR > 20  ? C.green : C.amber },
                  { l:'Leverage',      v:deal.leverage + '%',   c: C.text },
                  { l:'Cash / Equity', v:fmt(deal.cashRequired),c: C.amber },
                  { l:'Debt',          v:fmt(deal.debt),        c: C.text },
                  { l:'Payback',       v:deal.paybackYears ? deal.paybackYears + ' yrs' : '—', c: C.text },
                ].map(m=>(
                  <div key={m.l} style={{ background:C.cardAlt, borderRadius:8, padding:'10px 12px', border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{m.l}</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:m.c }}>{m.v}</div>
                  </div>
                ))}
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.gold, letterSpacing:'0.08em', marginBottom:10 }}>DEAL HIGHLIGHTS</div>
                  <div style={{ fontSize:13, color:C.textSub, lineHeight:1.75, marginBottom:14 }}>{deal.highlights}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {[
                      {l:'Counterparty',   v:deal.counterparty},
                      {l:'Deal Lead',      v:deal.lead},
                      {l:'Target Close',   v:deal.targetClose},
                      {l:'Vertical',       v:deal.vertical},
                    ].map(r=>(
                      <div key={r.l} style={{ background:C.cardAlt, borderRadius:6, padding:'10px 12px', border:`1px solid ${C.border}` }}>
                        <div style={{ fontSize:11, color:C.textMuted, marginBottom:2 }}>{r.l}</div>
                        <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:10, display:'flex', gap:8 }}>
                    <GoldButton outline style={{ flex:1, textAlign:'center' }}>✦ Generate Investment Memo →</GoldButton>
                    <GoldButton outline style={{ flex:1, textAlign:'center' }}>Compose to Finance Controller →</GoldButton>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
