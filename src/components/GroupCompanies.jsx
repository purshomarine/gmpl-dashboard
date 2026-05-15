import { GROUP_ENTITIES, NURA_CHARTERS, VESSELS } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, GoldButton, Badge, MetricRow } from './ui.jsx'

const STATUS_COL = { active: C.green, pending: C.amber, Current: C.green, Overdue: C.red }

export default function GroupCompanies() {
  const gmpl = GROUP_ENTITIES.find(e => e.id === 'gmpl')
  const nura = GROUP_ENTITIES.find(e => e.id === 'nura')
  const nuraVessels = VESSELS.filter(v => nura.vessels.includes(v.id))
  const overdueCharters = NURA_CHARTERS.filter(c => c.paymentStatus === 'Overdue')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Group Structure header */}
      <HeroCard>
        <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:'0.12em', marginBottom:12 }}>GOOD EARTH MARITIME — GROUP CORPORATE STRUCTURE</div>
        <div style={{ display:'flex', alignItems:'stretch', gap:0, overflowX:'auto' }}>

          {/* GMPL parent */}
          <div style={{ flex:1, minWidth:220, background:'rgba(201,164,87,0.08)', border:`1px solid ${C.gold}44`, borderRadius:'10px 0 0 10px', padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:40, height:40, background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:C.bg }}>G</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:C.text }}>{gmpl.name}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{gmpl.type} · {gmpl.jurisdiction}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:C.textSub, marginBottom:12, lineHeight:1.6 }}>{gmpl.role}</div>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1, background:'rgba(6,12,24,0.5)', borderRadius:6, padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em' }}>Revenue</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.gold }}>${gmpl.pl.rev}M</div>
              </div>
              <div style={{ flex:1, background:'rgba(6,12,24,0.5)', borderRadius:6, padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em' }}>EBITDA</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.green }}>${gmpl.pl.ebitda}M</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display:'flex', alignItems:'center', padding:'0 8px', flexShrink:0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{ width:2, height:30, background:`${C.gold}44` }}/>
              <span style={{ color:C.gold, fontSize:12 }}>→</span>
              <div style={{ fontSize:10, color:C.textMuted, whiteSpace:'nowrap' }}>SPV</div>
            </div>
          </div>

          {/* Nura Shipco */}
          <div style={{ flex:1, minWidth:220, background:`${C.blue}08`, border:`1px solid ${C.blue}33`, borderRadius:'0 10px 10px 0', padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:40, height:40, background:`${C.blue}22`, border:`2px solid ${C.blue}55`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:C.blue }}>N</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:C.text }}>{nura.name}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{nura.type} · {nura.jurisdiction}</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:C.textSub, marginBottom:12, lineHeight:1.6 }}>{nura.role}</div>
            <div style={{ display:'flex', gap:10 }}>
              <div style={{ flex:1, background:'rgba(6,12,24,0.5)', borderRadius:6, padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em' }}>Revenue</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.gold }}>${nura.pl.rev}M</div>
              </div>
              <div style={{ flex:1, background:'rgba(6,12,24,0.5)', borderRadius:6, padding:'8px 10px', textAlign:'center' }}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em' }}>EBITDA</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.green }}>${nura.pl.ebitda}M</div>
              </div>
            </div>
          </div>
        </div>
      </HeroCard>

      {/* Nura Shipco — Vessels owned */}
      <Card>
        <SectionLabel accent>Nura Shipco — Vessels Under SPV Ownership</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:10 }}>
          {nuraVessels.map(v=>(
            <div key={v.id} style={{ background:C.cardAlt, borderRadius:10, padding:'14px 16px', border:`1px solid ${v.status==='green'?C.green+'33':v.status==='amber'?C.amber+'33':C.red+'33'}`, borderLeft:`3px solid ${{green:C.green,amber:C.amber,red:C.red}[v.status]}` }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:C.text, marginBottom:4 }}>{v.name}</div>
              <div style={{ fontSize:12, color:C.textMuted, marginBottom:10 }}>{v.type} · {v.flag} · {v.dwt.toLocaleString()} DWT</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {[
                  {l:'Utilisation', v:v.util+'%', c:v.util>=v.target?C.green:C.amber},
                  {l:'P&L MTD',     v:(v.pl>=0?'+':'')+'$'+(v.pl/1000).toFixed(0)+'K', c:v.pl>=0?C.green:C.red},
                  {l:'Position',    v:v.pos, c:C.textSub},
                  {l:'Day Rate',    v:v.dayRate?'$'+v.dayRate.toLocaleString():'-', c:C.gold},
                ].map(m=>(
                  <div key={m.l} style={{ background:C.card, borderRadius:5, padding:'6px 8px' }}>
                    <div style={{ fontSize:10, color:C.textMuted, marginBottom:2 }}>{m.l}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:m.c, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charter contracts */}
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:14 }}>
          <SectionLabel accent>Nura Shipco — Charter Contracts</SectionLabel>
          {overdueCharters.length > 0 && (
            <div style={{ background:C.redDim, border:`1px solid ${C.red}44`, borderRadius:6, padding:'6px 12px', fontSize:12, color:C.red, fontWeight:600 }}>
              ⚠ {overdueCharters.length} overdue payment{overdueCharters.length>1?'s':''}
            </div>
          )}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {NURA_CHARTERS.map(cp=>(
            <div key={cp.id} style={{ background:C.cardAlt, borderRadius:10, padding:'16px 18px', border:`1px solid ${cp.paymentStatus==='Overdue'?C.red+'44':C.border}`, borderLeft:`3px solid ${STATUS_COL[cp.paymentStatus]||C.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:12 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:C.gold, fontFamily:'DM Mono,monospace' }}>{cp.id}</span>
                    <Badge status={cp.status}/>
                    <span style={{ fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:4, background:`${C.blue}18`, color:C.blue, border:`1px solid ${C.blue}33` }}>{cp.type}</span>
                  </div>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:C.text, marginBottom:2 }}>{cp.vessel}</div>
                  <div style={{ fontSize:13, color:C.textSub }}>{cp.charterer}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:C.gold }}>${cp.rate.toLocaleString()}<span style={{ fontSize:12, fontWeight:400, color:C.textMuted }}>/day</span></div>
                  <div style={{ fontSize:11, color:C.textMuted }}>Net TCE: ${cp.netTCE.toLocaleString()}/day</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:8 }}>
                {[
                  {l:'Charter Start',   v:cp.start},
                  {l:'Charter End',     v:cp.end},
                  {l:'Payment Status',  v:cp.paymentStatus, c:STATUS_COL[cp.paymentStatus]},
                  {l:'Next Hire Due',   v:cp.nextHire, c: cp.paymentStatus==='Overdue'?C.red:C.textSub},
                ].map(m=>(
                  <div key={m.l} style={{ background:C.card, borderRadius:6, padding:'8px 12px' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{m.l}</div>
                    <div style={{ fontSize:13, fontWeight:500, color:m.c||C.text }}>{m.v}</div>
                  </div>
                ))}
              </div>
              {cp.paymentStatus === 'Overdue' && (
                <div style={{ marginTop:10 }}>
                  <GoldButton outline style={{ width:'100%', textAlign:'center' }}>⚠ Chase Outstanding Hire Payment →</GoldButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Product Roadmap */}
      <Card>
        <SectionLabel accent>Platform Roadmap — What's Coming</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:10 }}>
          {[
            { phase:'Phase 1 (Now)',  color:C.green,  items:['Group Overview & AI Briefing','Fleet Map & AIS Live','Legal & Risk Module','Crewing & Relief Planning','Active Deals Tracker','HSE & Inspections','Zoho ERP Integration','Assumption Mapper','Nura Shipco Charter Panel'] },
            { phase:'Phase 2 (Q3 2026)', color:C.gold, items:['Crew Cycle Analytics AI','Psychoanalytic Profiling Flags','AI Interview & Assessment','Medical Certificate Automation','SIRE/PSC Score Tracking','INTERTANKO Benchmarking','Azure AD SSO','Role-Based Access Control'] },
            { phase:'Phase 3 (Q4 2026+)', color:C.purple, items:['AI Counselling Module','Interviewer KPI Monitoring','Multi-industry Expansion','Tank Inspection AI Scoring','Predictive Maintenance','Real-time P&L by Voyage','EDS & Insurance Sub-verticals'] },
          ].map(r=>(
            <div key={r.phase} style={{ background:C.cardAlt, borderRadius:10, padding:'16px', border:`1px solid ${r.color}33`, borderTop:`3px solid ${r.color}` }}>
              <div style={{ fontSize:12, fontWeight:700, color:r.color, marginBottom:12 }}>{r.phase}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {r.items.map((item,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:7, fontSize:12, color:C.textSub, lineHeight:1.5 }}>
                    <span style={{ color:r.color, marginTop:1, flexShrink:0 }}>✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
