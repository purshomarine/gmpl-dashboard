import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { HSE_INCIDENTS, HSE_KPI } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, GoldButton, Badge, KpiCard, MetricRow, tooltipStyle } from './ui.jsx'

const TREND_DATA = [
  {m:'Jun 25',ltif:0.91,nm:2},{m:'Jul 25',ltif:0.74,nm:3},{m:'Aug 25',ltif:0.68,nm:1},
  {m:'Sep 25',ltif:0.62,nm:2},{m:'Oct 25',ltif:0.55,nm:3},{m:'Nov 25',ltif:0.51,nm:1},
  {m:'Dec 25',ltif:0.49,nm:2},{m:'Jan 26',ltif:0.47,nm:2},{m:'Feb 26',ltif:0.45,nm:3},
  {m:'Mar 26',ltif:0.44,nm:1},{m:'Apr 26',ltif:0.43,nm:2},{m:'May 26',ltif:0.42,nm:1},
]

export default function HSE() {
  const open = HSE_INCIDENTS.filter(i=>i.status==='open')
  const high = HSE_INCIDENTS.filter(i=>i.severity==='high')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* KPI row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:10 }}>
        {[
          { label:'LTIF',             value:String(HSE_KPI.LTIF),       color: HSE_KPI.LTIF < HSE_KPI.industryLTIF ? C.green : C.red,  sub:'Industry avg '+HSE_KPI.industryLTIF },
          { label:'TRCF',             value:String(HSE_KPI.TRCF),       color:C.amber,  sub:'Total recordable cases' },
          { label:'Days Since LTI',   value:String(HSE_KPI.daysWithoutLTI), color:C.green,  sub:'Last LTI: Dec 2025' },
          { label:'Near Misses YTD',  value:String(HSE_KPI.nearMisses), color:C.amber,  sub:'Reported this year' },
          { label:'Open Actions',     value:String(HSE_KPI.openActions),color: open.length > 0 ? C.red : C.green, sub:'Corrective actions' },
          { label:'Audit Score',      value:HSE_KPI.auditScore + '%',   color: HSE_KPI.auditScore >= 85 ? C.green : C.amber, sub:'Dubai Office — Mar 2026' },
        ].map(k=>(
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'16px 18px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:'0.09em', textTransform:'uppercase', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:600, color:k.color, lineHeight:1.1 }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* LTIF trend vs industry */}
      <Card>
        <SectionLabel accent>LTIF Trend — 12 Months vs INTERTANKO Industry Benchmark (0.68)</SectionLabel>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={TREND_DATA} margin={{top:4,right:8,left:-18,bottom:0}}>
            <XAxis dataKey="m" tick={{fill:C.textMuted,fontSize:11}}/>
            <YAxis tick={{fill:C.textMuted,fontSize:11}} domain={[0,1.2]}/>
            <Tooltip {...tooltipStyle}/>
            <ReferenceLine y={HSE_KPI.industryLTIF} stroke={C.red} strokeDasharray="5 3" label={{value:'Industry avg 0.68',fill:C.red,fontSize:10,position:'insideTopRight'}}/>
            <Bar dataKey="ltif" name="LTIF" fill={C.green} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ marginTop:8, fontSize:12, color:C.textSub }}>GMPL LTIF <span style={{ color:C.green, fontWeight:700 }}>0.42</span> — <span style={{ color:C.green }}>38% better than industry benchmark</span>. Improving trend over 12 months.</div>
      </Card>

      {/* Incident log */}
      <Card>
        <SectionLabel accent>Incident &amp; Near-Miss Log</SectionLabel>
        {high.length > 0 && (
          <div style={{ background:C.redDim, border:`1px solid ${C.red}44`, borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#FCA5A5' }}>
            ⚠ {high.length} high-severity item{high.length>1?'s':''} requiring Chairman awareness — open corrective action pending
          </div>
        )}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {HSE_INCIDENTS.map(inc => {
            const sc = {low:C.green,medium:C.amber,high:C.red,info:C.blue}
            return (
              <div key={inc.id} style={{ background:C.cardAlt, borderRadius:8, padding:'14px 16px', border:`1px solid ${sc[inc.severity]||C.border}22`, borderLeft:`3px solid ${sc[inc.severity]||C.border}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:8 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:C.gold, fontFamily:'DM Mono,monospace' }}>{inc.id}</span>
                      <Badge status={inc.severity}/>
                      <Badge status={inc.status}/>
                      <span style={{ fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:4, background:`${C.blue}18`, color:C.blue, border:`1px solid ${C.blue}33` }}>{inc.type}</span>
                    </div>
                    <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:2 }}>{inc.desc}</div>
                    <div style={{ fontSize:12, color:C.textMuted }}>{inc.vessel} · {inc.date}</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <div style={{ background:C.card, borderRadius:6, padding:'8px 12px' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>Root Cause</div>
                    <div style={{ fontSize:12, color:C.textSub }}>{inc.rootCause}</div>
                  </div>
                  <div style={{ background:C.card, borderRadius:6, padding:'8px 12px', border: inc.status==='open'?`1px solid ${C.amber}33`:undefined }}>
                    <div style={{ fontSize:10, fontWeight:700, color:inc.status==='open'?C.amber:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>Corrective Action</div>
                    <div style={{ fontSize:12, color:inc.status==='open'?C.amber:C.textSub }}>{inc.corrective}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* MARPOL/Environmental note */}
      <div style={{ background:C.cardAlt, border:`1px solid ${C.teal}33`, borderRadius:10, padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:C.teal, marginBottom:3 }}>🌿 Environmental Compliance</div>
          <div style={{ fontSize:13, color:C.textSub }}>CII ratings: 5 vessels rated A/B · 3 vessels rated C (requires improvement plan) · EEXI documentation complete for all vessels</div>
        </div>
        <GoldButton outline>Open Environmental Module →</GoldButton>
      </div>

    </div>
  )
}
