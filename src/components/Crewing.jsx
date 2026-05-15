import { CREW, CREW_SIGNOFFS, VESSELS } from '../data/seed.js'
import { C, Card, SectionLabel, GoldButton, StatusDot, Badge } from './ui.jsx'

const SC = { green:C.green, amber:C.amber, red:C.red }
const NATIONS = {}
CREW.forEach(c => { NATIONS[c.nation] = (NATIONS[c.nation]||0)+1 })

export default function Crewing() {
  const totalCrew   = VESSELS.reduce((s,v) => s+v.crew, 0)
  const urgentRelief= CREW_SIGNOFFS.filter(c => c.status==='red').length
  const certWarnings= CREW.filter(c => c.certs!=='ok').length

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
        {[
          {label:'Total Crew On Board',  value:String(totalCrew), color:C.gold},
          {label:'Vessels Manned',       value:'8 / 8',           color:C.green},
          {label:'Urgent Reliefs',       value:String(urgentRelief), color:urgentRelief>0?C.red:C.green},
          {label:'Cert Warnings',        value:String(certWarnings), color:certWarnings>0?C.amber:C.green},
          {label:'Nationalities',        value:String(Object.keys(NATIONS).length), color:C.text},
        ].map(k=>(
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontWeight:600, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Sign-off schedule */}
      <Card>
        <SectionLabel accent>Upcoming Sign-offs &amp; Relief Planning</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {CREW_SIGNOFFS.map((s,i)=>(
            <div key={i} style={{ background:C.cardAlt, border:`1px solid ${SC[s.status]}33`, borderLeft:`3px solid ${SC[s.status]}`, borderRadius:8, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{s.name}</div>
                <div style={{ fontSize:12, color:C.textSub }}>{s.rank} · {s.vessel}</div>
                <div style={{ fontSize:11, color:s.status==='red'?C.red:s.status==='amber'?C.amber:C.textMuted, marginTop:4, fontWeight:600 }}>{s.action}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:SC[s.status] }}>{s.days}d</div>
                <div style={{ fontSize:11, color:C.textMuted }}>Sign-off {s.date}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Master roster */}
      <Card>
        <SectionLabel accent>Master Roster — All Vessels</SectionLabel>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['Vessel','Master','Nationality','Sign-on','Sign-off','Certs','Relief Status'].map(h=>(
                  <th key={h} style={{ padding:'8px 10px', textAlign:'left', color:C.textMuted, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', fontSize:10, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CREW.map((c,i)=>(
                <tr key={i} style={{ borderBottom:`1px solid ${C.border}22` }}>
                  <td style={{ padding:'10px 10px', color:C.text, fontWeight:500 }}>{c.vessel.replace('MV ','')}</td>
                  <td style={{ padding:'10px 10px', color:'#C8D8EC', fontWeight:600, whiteSpace:'nowrap' }}>{c.name}</td>
                  <td style={{ padding:'10px 10px', color:C.textSub }}>{c.nation}</td>
                  <td style={{ padding:'10px 10px', color:C.textMuted, fontFamily:'DM Mono, monospace', fontSize:11 }}>{c.signOn}</td>
                  <td style={{ padding:'10px 10px', color:C.textMuted, fontFamily:'DM Mono, monospace', fontSize:11 }}>{c.signOff}</td>
                  <td style={{ padding:'10px 10px' }}>
                    <span style={{ fontSize:11, fontWeight:600, color:c.certs==='ok'?C.green:C.amber }}>
                      {c.certs==='ok'?'✓ Valid':'⚠ Expiring'}
                    </span>
                  </td>
                  <td style={{ padding:'10px 10px' }}>
                    <span style={{ fontSize:11, fontWeight:600, color:c.relief==='Ready'?C.green:c.relief==='Urgent'?C.red:C.amber }}>
                      {c.relief}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Nationality breakdown */}
      <Card>
        <SectionLabel accent>Crew Nationality Breakdown</SectionLabel>
        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          {Object.entries(NATIONS).sort((a,b)=>b[1]-a[1]).map(([nat,count])=>(
            <div key={nat} style={{ background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:8, padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:C.gold }}>{count}</div>
              <div style={{ fontSize:12, color:C.textSub }}>{nat}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
