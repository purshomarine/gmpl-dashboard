import { useState } from 'react'
import { GROUP_ENTITIES, NURA_CHARTERS, VESSELS, SHIPPING_PARTNERS, FLEET_GROWTH } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, GoldButton, Badge, StatusDot } from './ui.jsx'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function GroupCompanies() {
  const [activeEntity, setActiveEntity] = useState(null)
  const tankers = VESSELS.filter(v => v.id.startsWith('V'))

  const level2 = GROUP_ENTITIES.filter(e => e.level === 2)
  const level3 = GROUP_ENTITIES.filter(e => e.level === 3)

  // vessel ownership map
  const entityForVessel = v => GROUP_ENTITIES.find(e => e.vessels?.includes(v.id))

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Org chart */}
      <HeroCard>
        <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:'0.12em', marginBottom:16 }}>GOODEARTH MARITIME — CORPORATE STRUCTURE</div>

        {/* Level 1 — GMPL */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:0 }}>
          <EntityBox entity={GROUP_ENTITIES[0]} active={activeEntity?.id===GROUP_ENTITIES[0].id} onTap={setActiveEntity} wide/>
        </div>
        {/* Connector line down */}
        <div style={{ display:'flex', justifyContent:'center' }}>
          <div style={{ width:2, height:24, background:C.border }}/>
        </div>

        {/* Level 2 — NIS */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:0 }}>
          <EntityBox entity={level2[0]} active={activeEntity?.id===level2[0].id} onTap={setActiveEntity} wide/>
        </div>

        {/* Branch lines to level 3 */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:0 }}>
          <div style={{ width:2, height:16, background:C.border }}/>
        </div>
        <div style={{ position:'relative', marginBottom:0 }}>
          {/* Horizontal line */}
          <div style={{ height:2, background:C.border, margin:'0 48px' }}/>
        </div>

        {/* Level 3 — all subsidiaries */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:10, marginTop:0 }}>
          {level3.map(e => (
            <div key={e.id} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:2, height:16, background:C.border }}/>
              <EntityBox entity={e} active={activeEntity?.id===e.id} onTap={setActiveEntity}/>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {activeEntity && (
          <div style={{ marginTop:16, background:'rgba(6,12,24,0.6)', borderRadius:10, padding:'14px 16px', border:`1px solid ${activeEntity.color}44` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:activeEntity.color }}>{activeEntity.name}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{activeEntity.type} · {activeEntity.jurisdiction} · Est. {activeEntity.established}</div>
              </div>
              <button onClick={()=>setActiveEntity(null)} style={{ background:'none', border:'none', color:C.textMuted, fontSize:18, cursor:'pointer' }}>×</button>
            </div>
            <div style={{ fontSize:12, color:C.textSub, marginBottom:10 }}>{activeEntity.role}</div>
            {activeEntity.dormant && (
              <div style={{ background:C.amberDim, border:`1px solid ${C.amber}33`, borderRadius:6, padding:'6px 12px', fontSize:11, color:C.amber, marginBottom:10 }}>
                ⚠ No vessel assets currently assigned — entity exists independently
              </div>
            )}
            {activeEntity.vessels?.length > 0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {activeEntity.vessels.map(vid => {
                  const v = VESSELS.find(x => x.id===vid)
                  if (!v) return null
                  return (
                    <div key={vid} style={{ background:C.card, borderRadius:6, padding:'6px 12px', fontSize:11, color:C.text, border:`1px solid ${C.border}` }}>
                      <span style={{ color:activeEntity.color, marginRight:5 }}>⚓</span>{v.name}
                    </div>
                  )
                })}
              </div>
            )}
            {!activeEntity.dormant && (
              <div style={{ display:'flex', gap:16, marginTop:10 }}>
                <div><div style={{ fontSize:10, color:C.textMuted }}>Revenue MTD</div><div style={{ fontSize:16, fontWeight:700, color:C.gold, fontFamily:"'Playfair Display',serif" }}>${activeEntity.pl.rev}M</div></div>
                <div><div style={{ fontSize:10, color:C.textMuted }}>EBITDA MTD</div><div style={{ fontSize:16, fontWeight:700, color:C.green, fontFamily:"'Playfair Display',serif" }}>${activeEntity.pl.ebitda}M</div></div>
              </div>
            )}
          </div>
        )}
      </HeroCard>

      {/* Fleet growth charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card>
          <SectionLabel accent>Fleet Growth — Vessel Count</SectionLabel>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={FLEET_GROWTH} margin={{top:4,right:8,left:-18,bottom:0}}>
              <defs>
                <linearGradient id="vesselGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.gold} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.gold} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="label" tick={{fill:C.textMuted,fontSize:9}} interval={1}/>
              <YAxis tick={{fill:C.textMuted,fontSize:9}}/>
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:11}} formatter={(v,n,p)=>[v+' vessels',p.payload.event]}/>
              <Area type="monotone" dataKey="vessels" stroke={C.gold} strokeWidth={2.5} fill="url(#vesselGrad)" dot={{fill:C.gold,strokeWidth:0,r:4}}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <SectionLabel accent>DWT Growth (MT '000)</SectionLabel>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={FLEET_GROWTH.map(d=>({...d,dwtK:Math.round(d.dwt/1000)}))} margin={{top:4,right:8,left:-18,bottom:0}}>
              <defs>
                <linearGradient id="dwtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.blue} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="label" tick={{fill:C.textMuted,fontSize:9}} interval={1}/>
              <YAxis tick={{fill:C.textMuted,fontSize:9}} tickFormatter={v=>v+'K'}/>
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,fontSize:11}} formatter={v=>[v+'K DWT']}/>
              <Area type="monotone" dataKey="dwtK" stroke={C.blue} strokeWidth={2.5} fill="url(#dwtGrad)" dot={{fill:C.blue,strokeWidth:0,r:4}}/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ fontSize:11, color:C.textMuted, marginTop:6 }}>Total fleet: <span style={{ color:C.blue, fontWeight:700 }}>283,000 MT DWT</span> across 4 MR tankers + 5 river barges</div>
        </Card>
      </div>

      {/* Vessel ownership table */}
      <Card>
        <SectionLabel accent>Vessel Ownership Structure</SectionLabel>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['Vessel','Type','Owning Entity','Jurisdiction','Acquired','Commercial Mode'].map(h=>(
                  <th key={h} style={{ padding:'8px 12px', textAlign:'left', color:C.textMuted, fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tankers.map(v => {
                const entity = GROUP_ENTITIES.find(e => e.id === v.entity)
                return (
                  <tr key={v.id} style={{ borderBottom:`1px solid ${C.border}22` }}>
                    <td style={{ padding:'10px 12px', fontWeight:600, color:C.text }}>{v.name}</td>
                    <td style={{ padding:'10px 12px', color:C.textSub }}>{v.type}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:12, fontWeight:600, padding:'3px 9px', borderRadius:20, background:`${entity?.color||C.gold}18`, color:entity?.color||C.gold, border:`1px solid ${entity?.color||C.gold}33` }}>
                        {entity?.short||'—'}
                      </span>
                    </td>
                    <td style={{ padding:'10px 12px', color:C.textMuted, fontSize:12 }}>{entity?.jurisdiction||'—'}</td>
                    <td style={{ padding:'10px 12px', color:C.textMuted, fontSize:12 }}>{v.acquired}</td>
                    <td style={{ padding:'10px 12px' }}>
                      <span style={{ fontSize:11, fontWeight:600, color:v.commercialMode==='pool'?C.gold:v.commercialMode==='tc'?C.green:C.blue }}>
                        {v.commercialMode==='pool'?`Pool (${v.pool?.split(' →')[0]})`:v.commercialMode==='tc'?`TC — ${v.charterer}`:'Captive'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Shipping partners */}
      <Card>
        <SectionLabel accent>Shipping Partners</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
          {SHIPPING_PARTNERS.map(p => (
            <div key={p.name} style={{ background:C.cardAlt, borderRadius:10, padding:'14px 16px', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:14 }}>
              {/* Logo placeholder — coloured initial block */}
              <div style={{ width:44, height:44, borderRadius:10, background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'#fff', flexShrink:0 }}>
                {p.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:2 }}>{p.name}</div>
                <div style={{ fontSize:11, fontWeight:600, color:C.textMuted, marginBottom:3 }}>{p.role}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{p.vessels.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charter contracts */}
      <Card>
        <SectionLabel accent>Charter Contracts — All Entities</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {NURA_CHARTERS.map(cp => (
            <div key={cp.id} style={{ background:C.cardAlt, borderRadius:10, padding:'14px 16px', border:`1px solid ${cp.paymentStatus==='Overdue'?C.red+'44':C.border}`, borderLeft:`3px solid ${cp.paymentStatus==='Overdue'?C.red:cp.type==='Time Charter'?C.green:cp.type==='Pool Agreement'?C.gold:C.blue}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:10 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:C.gold, fontFamily:'DM Mono,monospace' }}>{cp.id}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:4, background:`${C.blue}18`, color:C.blue, border:`1px solid ${C.blue}33` }}>{cp.type}</span>
                  </div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:C.text, marginBottom:2 }}>{cp.vessel}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>{cp.charterer}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:C.gold }}>
                    {cp.rate>0?`$${cp.rate.toLocaleString()}/day`:'Internal'}
                  </div>
                  <div style={{ fontSize:11, color:C.textMuted }}>Net TCE: ${cp.netTCE.toLocaleString()}/day</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:8 }}>
                {[
                  {l:'Start',    v:cp.start},
                  {l:'End',      v:cp.end},
                  {l:'Payment',  v:cp.paymentStatus, c:cp.paymentStatus==='Current'?C.green:C.red},
                  {l:'Next Hire',v:cp.nextHire},
                ].map(m=>(
                  <div key={m.l} style={{ background:C.card, borderRadius:6, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{m.l}</div>
                    <div style={{ fontSize:12, fontWeight:500, color:m.c||C.text }}>{m.v}</div>
                  </div>
                ))}
              </div>
              {cp.notes && <div style={{ marginTop:8, fontSize:11, color:C.textMuted, fontStyle:'italic' }}>{cp.notes}</div>}
            </div>
          ))}
        </div>
      </Card>

      {/* Product roadmap */}
      <Card>
        <SectionLabel accent>Platform Roadmap — What's Coming</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:10 }}>
          {[
            { phase:'Phase 1 — Now',   color:C.green,  items:['Group Structure & Org Chart','Fleet Map & AIS','Legal & Risk','Crewing & Relief','Active Deals Tracker','HSE & Inspections','Zoho ERP Integration','Scenario Mapper','Pool Earnings Upload','Bunkering Log','Market Intelligence','Best Master / Crew Awards'] },
            { phase:'Phase 2 — Q3 2026',color:C.gold,  items:['Crew Cycle Analytics AI','Psychoanalytic Flags','AI Interview & Assessment','Medical Cert Automation','INTERTANKO Benchmarking','Azure AD SSO Login','RBAC — Role-Based Access','Python Backend (FastAPI)','MarineTraffic Live AIS'] },
            { phase:'Phase 3 — Q4 2026+',color:'#A78BFA',items:['AI Counselling Module','Predictive Maintenance','Real-time P&L per Voyage','Pool API Integration','EDS & Insurance Sub-verticals','Mobile PWA Push Alerts','Document Management System'] },
          ].map(r=>(
            <div key={r.phase} style={{ background:C.cardAlt, borderRadius:10, padding:'14px', border:`1px solid ${r.color}33`, borderTop:`3px solid ${r.color}` }}>
              <div style={{ fontSize:12, fontWeight:700, color:r.color, marginBottom:10 }}>{r.phase}</div>
              {r.items.map((item,i)=>(
                <div key={i} style={{ display:'flex', gap:6, fontSize:12, color:C.textSub, marginBottom:5, lineHeight:1.5, alignItems:'flex-start' }}>
                  <span style={{ color:r.color, flexShrink:0, marginTop:1 }}>✓</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function EntityBox({ entity, active, onTap, wide }) {
  return (
    <div onClick={()=>onTap(active?null:entity)} style={{
      background: active ? `${entity.color}18` : 'rgba(6,12,24,0.6)',
      border:`2px solid ${active?entity.color:entity.color+'44'}`,
      borderRadius:10, padding:'12px 16px',
      width: wide ? '100%' : '100%', maxWidth: wide ? 420 : 200,
      cursor:'pointer', transition:'all 0.2s',
      textAlign:'center',
    }}>
      <div style={{ fontSize:12, fontWeight:700, color:entity.color, marginBottom:2 }}>{entity.short}</div>
      <div style={{ fontSize:10, color:C.textMuted }}>{entity.jurisdiction}</div>
      {entity.dormant && <div style={{ fontSize:9, color:C.amber, marginTop:2 }}>No assets</div>}
      {!entity.dormant && entity.pl.rev > 0 && (
        <div style={{ fontSize:11, color:C.gold, marginTop:4, fontWeight:600 }}>${entity.pl.rev}M rev</div>
      )}
    </div>
  )
}
