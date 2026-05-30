import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { VERTICALS, REVENUE_TREND, MARKET_DATA, CRITICAL_ITEMS, ALERTS } from '../data/seed.js'
import { C, StatusDot, Card, HeroCard, KpiCard, SectionLabel, GoldButton, tooltipStyle } from './ui.jsx'

export default function Overview() {
  const totalRev   = VERTICALS.reduce((s,v) => s + v.rev, 0).toFixed(1)
  const totalEbitda= VERTICALS.reduce((s,v) => s + v.ebitda, 0).toFixed(1)
  const totalCash  = VERTICALS.reduce((s,v) => s + v.cash, 0).toFixed(1)
  const totalAR    = VERTICALS.reduce((s,v) => s + v.receivables, 0).toFixed(1)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

      {/* Hero KPIs */}
      <HeroCard>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16, marginBottom:20 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:600, color:C.gold, letterSpacing:'0.12em', marginBottom:4 }}>GOOD EARTH MARITIME — GROUP PERFORMANCE · MAY 2026</div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:13, color:C.textSub }}>{'Chairman\'s Morning Briefing · ' + new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:C.greenDim, border:`1px solid ${C.green}44`, borderRadius:20, padding:'5px 14px' }}>
            <StatusDot s="green" animate size={7}/>
            <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>8 Systems Connected</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:12 }}>
          {[
            { label:'Group Revenue MTD',  value:`$${totalRev}M`,   color:C.gold,  trend:'+4.2% MoM' },
            { label:'Group EBITDA MTD',   value:`$${totalEbitda}M`,color:C.green, trend:`${((totalEbitda/totalRev)*100).toFixed(1)}% margin` },
            { label:'Group Cash Position',value:`$${totalCash}M`,  color:C.blue,  trend:'Across all verticals' },
            { label:'Overdue Receivables',value:`$${totalAR}M`,    color:parseFloat(totalAR)>3?C.red:C.amber, trend:'Ship Building elevated' },
          ].map(k => (
            <div key={k.label} style={{ background:'rgba(6,12,24,0.6)', borderRadius:10, padding:'14px 16px', border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{k.label}</div>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:26, fontWeight:600, color:k.color, lineHeight:1.1 }}>{k.value}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:4 }}>{k.trend}</div>
            </div>
          ))}
        </div>
      </HeroCard>

      {/* AI Briefing */}
      <Card accent={C.gold} glow>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ width:28, height:28, borderRadius:6, background:`linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:C.bg }}>✦</div>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:C.gold }}>AI Chairman Briefing</div>
            <div style={{ fontSize:10, color:C.textMuted }}>Generated 06:00 {new Date().toLocaleTimeString('en-GB',{timeZoneName:'short'}).split(' ').pop()} · Auto-refreshes daily</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:16 }}>
          <BriefCol color={C.red}   icon="⚠" label="Needs Attention" items={[
            'MT Prelude IOPP Certificate expires in 38 days — renewal survey must be booked immediately',
            'Petrochemical Corp arbitration 14 Jun — Hill Dickinson briefing still unconfirmed',
            'MT Prelude pool transfer to Maersk Tankers — allocation date still unconfirmed',
          ]}/>
          <BriefCol color={C.green} icon="✓" label="On Track" items={[
            'Fleet utilisation at 87% — above 80% target for third consecutive month',
            'Ship Management margin 40% — strongest performing vertical this quarter',
            'MT Nura Kara and MT Anael both above 91% utilised this month',
          ]}/>
          <BriefCol color={C.blue}  icon="◎" label="Market Intelligence" items={[
            'VLSFO $612/MT Fujairah — Red Sea rerouting adding 12–15 days per voyage; monitor freight rate impact',
            'Baltic Clean Tanker Index +1.8% — product tanker spot demand strengthening in Arabian Gulf',
          ]}/>
        </div>
      </Card>

      {/* Vertical tiles */}
      <div>
        <SectionLabel accent>Industry Verticals — Group P&L Snapshot</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:12 }}>
          {VERTICALS.map(v => (
            <Card key={v.id} style={{ borderTop:`3px solid ${{green:C.green,amber:C.amber,red:C.red}[v.status]}`, padding:'16px 18px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:'0.1em', textTransform:'uppercase' }}>{v.name}</div>
                <StatusDot s={v.status} animate size={8}/>
              </div>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:28, fontWeight:600, color:C.text, marginBottom:2 }}>${v.rev}M</div>
              <div style={{ fontSize:11, color:C.textMuted, marginBottom:10 }}>Revenue · EBITDA <span style={{ color:C.green }}>${v.ebitda}M</span> · Margin {v.margin}%</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:10 }}>
                <div style={{ background:C.cardAlt, borderRadius:6, padding:'7px 10px' }}>
                  <div style={{ fontSize:10, color:C.textMuted }}>Cash</div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.blue }}>${v.cash}M</div>
                </div>
                <div style={{ background:C.cardAlt, borderRadius:6, padding:'7px 10px' }}>
                  <div style={{ fontSize:10, color:C.textMuted }}>Receivables</div>
                  <div style={{ fontSize:13, fontWeight:600, color:v.receivables > 1.5 ? C.red : C.amber }}>${v.receivables}M</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:12, fontWeight:600, color:v.trend>=0?C.green:C.red }}>
                  {v.trend>=0?'▲':'▼'} {Math.abs(v.trend)}% MoM
                </span>
                <span style={{ fontSize:11, color:C.textMuted }}>vs ${v.budget}M budget</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Revenue chart + Market data */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr)', gap:16 }}>
        <Card>
          <SectionLabel accent>Group Revenue &amp; EBITDA — 12 Month Trend</SectionLabel>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={REVENUE_TREND} margin={{top:4,right:8,left:-18,bottom:0}}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={C.gold}  stopOpacity={0.15}/>
                  <stop offset="95%" stopColor={C.gold}  stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="m" tick={{fill:C.textMuted, fontSize:10}}/>
              <YAxis tick={{fill:C.textMuted, fontSize:10}}/>
              <Tooltip {...tooltipStyle} formatter={v => ['$' + v + 'M']}/>
              <Line type="monotone" dataKey="r" stroke={C.gold}  strokeWidth={2.5} dot={false} name="Revenue"/>
              <Line type="monotone" dataKey="e" stroke={C.green} strokeWidth={2}   dot={false} strokeDasharray="5 3" name="EBITDA"/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', gap:20, marginTop:8, paddingTop:8, borderTop:`1px solid ${C.border}` }}>
            {[{col:C.gold,label:'Revenue',val:'$17.1M'},{col:C.green,label:'EBITDA',val:'$5.0M'}].map(l=>(
              <span key={l.label} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12 }}>
                <span style={{ width:16, height:2, background:l.col, display:'inline-block', borderRadius:1 }}/>
                <span style={{ color:C.textMuted }}>{l.label}</span>
                <span style={{ fontWeight:600, color:l.col }}>{l.val}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <SectionLabel accent>Live Market Intelligence</SectionLabel>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {MARKET_DATA.map(m => (
              <div key={m.label} style={{ background:C.cardAlt, borderRadius:8, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', border:`1px solid ${m.warn ? C.amber + '33' : C.border}` }}>
                <div>
                  <div style={{ fontSize:12, color:C.textSub, fontWeight:500 }}>{m.label}</div>
                  <div style={{ fontSize:10, color:C.textMuted, marginTop:1 }}>{m.context}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:14, fontWeight:700, color:m.warn?C.amber:C.text }}>{m.value}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:m.warn?C.amber:m.up?C.green:C.red }}>{m.delta}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Critical items */}
      <Card>
        <SectionLabel accent>Critical Items — Chairman Action Required</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {CRITICAL_ITEMS.map((item,i) => (
            <div key={item.id} style={{
              display:'flex', alignItems:'flex-start', gap:14,
              background:C.cardAlt, borderRadius:8, padding:'14px 16px',
              border:`1px solid ${item.urg==='high' ? C.red+'44' : C.amber+'33'}`,
              borderLeft:`3px solid ${item.urg==='high' ? C.red : C.amber}`,
            }}>
              <StatusDot s={item.urg==='high'?'red':'amber'} animate size={9}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:3 }}>{item.title}</div>
                <div style={{ fontSize:12, color:C.textSub }}>{item.detail}</div>
              </div>
              <GoldButton outline style={{ flexShrink:0 }}>{item.action} →</GoldButton>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}

function BriefCol({ color, icon, label, items }) {
  return (
    <div style={{ background:'rgba(6,12,24,0.5)', borderRadius:8, padding:'14px', border:`1px solid ${color}22` }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
        <span style={{ fontSize:13, color }}>{icon}</span>
        <span style={{ fontSize:11, fontWeight:700, color, letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</span>
      </div>
      <ul style={{ margin:0, paddingLeft:14, listStyle:'disc' }}>
        {items.map((t,i) => <li key={i} style={{ fontSize:12, color:'#C8D8EC', lineHeight:1.8, marginBottom:2 }}>{t}</li>)}
      </ul>
    </div>
  )
}
