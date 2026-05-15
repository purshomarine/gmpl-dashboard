import { RED_FLAGS, ALERTS } from '../data/seed.js'
import { C, Card, SectionLabel, GoldButton, StatusDot } from './ui.jsx'

const SC = { green:C.green, amber:C.amber, red:C.red }
const DOMAINS = [...new Set(RED_FLAGS.map(f=>f.domain))]

export default function RedFlags() {
  const critical = RED_FLAGS.filter(f=>f.status==='red').length
  const warnings = RED_FLAGS.filter(f=>f.status==='amber').length

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
        {[
          {label:'Critical Red Flags', value:String(critical), color:C.red,   bg:C.redDim},
          {label:'Amber Warnings',     value:String(warnings), color:C.amber, bg:C.amberDim},
          {label:'Domains Affected',   value:String(DOMAINS.length), color:C.gold, bg:C.goldGlow},
          {label:'All Clear Items',    value:String(0),         color:C.green, bg:C.greenDim},
        ].map(k=>(
          <div key={k.label} style={{ background:k.bg, border:`1px solid ${k.color}33`, borderRadius:10, padding:'14px 18px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:10, fontWeight:600, color:k.color, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6, opacity:0.8 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:36, fontWeight:700, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Real-time alerts */}
      <Card>
        <SectionLabel accent>Real-Time Alerts Feed</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {ALERTS.map(a=>(
            <div key={a.id} style={{
              display:'flex', alignItems:'flex-start', gap:12,
              background:a.level==='critical'?C.redDim:a.level==='high'?'#1a1200':C.cardAlt,
              border:`1px solid ${a.level==='critical'?C.red+'55':a.level==='high'?C.amber+'44':C.border}`,
              borderLeft:`3px solid ${a.level==='critical'?C.red:a.level==='high'?C.amber:C.blue}`,
              borderRadius:8, padding:'12px 14px',
            }}>
              <StatusDot s={a.level==='critical'?'red':a.level==='high'?'amber':'green'} animate size={8}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{a.msg}</div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>{a.ts}</div>
              </div>
              <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:`${a.level==='critical'?C.red:a.level==='high'?C.amber:C.blue}22`, color:a.level==='critical'?C.red:a.level==='high'?C.amber:C.blue, border:`1px solid currentColor`, flexShrink:0 }}>
                {a.level.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Domain breakdown */}
      {DOMAINS.map(domain => {
        const items = RED_FLAGS.filter(f=>f.domain===domain)
        const hasRed = items.some(f=>f.status==='red')
        return (
          <Card key={domain} accent={hasRed?C.red:C.amber}>
            <SectionLabel accent={false}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <StatusDot s={hasRed?'red':'amber'} animate size={8}/>
                <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{domain}</span>
                <span style={{ fontSize:11, color:C.textMuted }}>· {items.length} flag{items.length!==1?'s':''}</span>
              </div>
            </SectionLabel>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {items.map((f,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:0, background:C.cardAlt, borderRadius:6 }}>
                  {/* Status block */}
                  <div style={{ width:6, alignSelf:'stretch', background:SC[f.status]||C.textMuted, borderRadius:'6px 0 0 6px', flexShrink:0 }}/>
                  <div style={{ flex:1, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8, padding:'10px 14px' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{f.item}</div>
                    </div>
                    <div style={{ display:'flex', gap:16, alignItems:'center', flexShrink:0 }}>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Actual</div>
                        <div style={{ fontSize:13, fontWeight:700, color:SC[f.status] }}>{f.actual}</div>
                      </div>
                      <div style={{ color:C.textMuted, fontSize:16 }}>→</div>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Target</div>
                        <div style={{ fontSize:13, fontWeight:700, color:C.green }}>{f.target}</div>
                      </div>
                      <div style={{ textAlign:'center', minWidth:50 }}>
                        <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Gap</div>
                        <div style={{ fontSize:13, fontWeight:700, color:SC[f.status] }}>{f.gap}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
