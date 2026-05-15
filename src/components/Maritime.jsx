import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { VESSELS } from '../data/seed.js'
import { C, StatusDot, Card, HeroCard, KpiCard, SectionLabel, GoldButton, tooltipStyle } from './ui.jsx'
import { generateVesselBriefing } from '../lib/claude.js'

const SC = { green:C.green, amber:C.amber, red:C.red }

export default function Maritime() {
  const [selected, setSelected]   = useState(null)
  const [briefing, setBriefing]   = useState('')
  const [loading, setLoading]     = useState(false)

  const onHire   = VESSELS.filter(v => v.util > 0).length
  const avgUtil  = Math.round(VESSELS.reduce((s,v) => s+v.util, 0) / VESSELS.length)
  const totalPL  = VESSELS.reduce((s,v) => s+v.pl, 0)
  const defects  = VESSELS.reduce((s,v) => s+v.defects, 0)
  const crew     = VESSELS.reduce((s,v) => s+v.crew, 0)

  async function handleBriefing(v) {
    setSelected(v); setBriefing(''); setLoading(true)
    const txt = await generateVesselBriefing(v)
    setBriefing(txt); setLoading(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
        {[
          {label:'On Hire',          value:`${onHire} / 8`,              color:C.gold  },
          {label:'Fleet Utilisation',value:`${avgUtil}%`,                color:avgUtil>=85?C.green:C.amber },
          {label:'P&L This Month',   value:`$${(totalPL/1e6).toFixed(2)}M`, color:totalPL>0?C.green:C.red },
          {label:'Open Defects',     value:String(defects),              color:defects>10?C.red:C.amber },
          {label:'Total Crew',       value:String(crew),                 color:C.text  },
        ].map(k=>(
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontWeight:600, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Fleet table */}
      <Card>
        <SectionLabel accent>Fleet Status — All Vessels</SectionLabel>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['','Vessel','Type','Position & Route','Utilisation','P&L MTD','Day Rate','Crew','Certs'].map(h=>(
                  <th key={h} style={{ padding:'8px 10px', textAlign:'left', color:C.textMuted, fontWeight:600, letterSpacing:'0.04em', whiteSpace:'nowrap', fontSize:11, textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VESSELS.map(v=>(
                <tr key={v.id} onClick={()=>setSelected(selected?.id===v.id?null:v)}
                  style={{ borderBottom:`1px solid ${C.border}22`, cursor:'pointer',
                    background:selected?.id===v.id?'rgba(201,164,87,0.06)':'transparent',
                    transition:'background 0.15s' }}
                >
                  <td style={{ padding:'10px 10px' }}><StatusDot s={v.status} animate size={8}/></td>
                  <td style={{ padding:'10px 10px' }}>
                    <div style={{ fontWeight:600, color:C.text, whiteSpace:'nowrap' }}>{v.name}</div>
                    <div style={{ fontSize:10, color:C.textMuted }}>IMO {v.imo}</div>
                  </td>
                  <td style={{ padding:'10px 10px', color:C.textSub }}>{v.type}</td>
                  <td style={{ padding:'10px 10px' }}>
                    <div style={{ color:'#C8D8EC', fontSize:12 }}>{v.pos}</div>
                    <div style={{ color:C.textMuted, fontSize:11 }}>{v.route}</div>
                  </td>
                  <td style={{ padding:'10px 10px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:56, height:5, background:C.border, borderRadius:3 }}>
                        <div style={{ width:`${v.util}%`, height:'100%', borderRadius:3, background:v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red }}/>
                      </div>
                      <span style={{ fontWeight:700, color:v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red }}>{v.util}%</span>
                    </div>
                  </td>
                  <td style={{ padding:'10px 10px', fontWeight:700, color:v.pl>=0?C.green:C.red }}>
                    {v.pl>=0?'+':''}${(v.pl/1000).toFixed(0)}K
                  </td>
                  <td style={{ padding:'10px 10px', color:v.dayRate?C.textSub:C.textMuted }}>
                    {v.dayRate?'$'+v.dayRate.toLocaleString():'—'}
                  </td>
                  <td style={{ padding:'10px 10px', color:C.textSub }}>{v.crew}</td>
                  <td style={{ padding:'10px 10px' }}>
                    <span style={{ fontSize:11, fontWeight:600, color:v.certs==='ok'?C.green:v.certs==='warning'?C.amber:C.red }}>
                      {v.certs==='ok'?'✓ Current':v.certs==='warning'?'⚠ Expiring':'✗ Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drill-through */}
      {selected && (
        <Card accent={SC[selected.status]} style={{ animation:'fade-up 0.3s ease' }} className="fade-up">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <div style={{ width:44, height:44, background:`${SC[selected.status]}22`, border:`2px solid ${SC[selected.status]}`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>⚓</div>
              <div>
                <div style={{ fontFamily:"'Playfair Display', serif", fontSize:18, fontWeight:600, color:C.text }}>{selected.name}</div>
                <div style={{ fontSize:12, color:C.textMuted }}>{selected.type} · {selected.flag} · {selected.dwt.toLocaleString()} DWT · Built {selected.built} · Class: {selected.class} · IMO {selected.imo}</div>
              </div>
            </div>
            <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', color:C.textMuted, fontSize:22, lineHeight:1, padding:4 }}>×</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:16 }}>
            {[
              {l:'Position',        v:selected.pos},
              {l:'Current Route',   v:selected.route},
              {l:'Voyage Days',     v:selected.voyageDays?selected.voyageDays+' days':'Idle'},
              {l:'Utilisation',     v:`${selected.util}% (target ${selected.target}%)`},
              {l:'Day Rate',        v:selected.dayRate?`$${selected.dayRate.toLocaleString()}/day`:'Idle — no charter'},
              {l:'P&L This Month',  v:`${selected.pl>=0?'+':''}$${selected.pl.toLocaleString()}`},
              {l:'Crew On Board',   v:`${selected.crew} persons`},
              {l:'Open Defects',    v:`${selected.defects} items`},
              {l:'Certificates',    v:selected.certs==='ok'?'✓ All current':selected.certs==='warning'?'⚠ Expiring soon':'✗ Action required'},
            ].map(r=>(
              <div key={r.l} style={{ background:C.cardAlt, borderRadius:8, padding:'10px 12px', border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:3 }}>{r.l}</div>
                <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{r.v}</div>
              </div>
            ))}
          </div>

          {/* AI Briefing */}
          <div style={{ background:C.cardAlt, borderRadius:8, padding:'14px 16px', border:`1px solid ${C.borderGold}`, marginBottom:12 }}>
            {loading ? (
              <div style={{ color:C.textMuted, fontSize:13 }}>✦ Generating vessel briefing…</div>
            ) : briefing ? (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.gold, marginBottom:8, letterSpacing:'0.06em' }}>✦ AI VESSEL BRIEFING</div>
                <div style={{ fontSize:12, color:'#C8D8EC', lineHeight:1.75, whiteSpace:'pre-wrap' }}>{briefing}</div>
              </div>
            ) : (
              <div style={{ textAlign:'center' }}>
                <GoldButton onClick={()=>handleBriefing(selected)}>✦ Generate AI Vessel Briefing →</GoldButton>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Utilisation chart */}
      <Card>
        <SectionLabel accent>Utilisation by Vessel vs Target</SectionLabel>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={VESSELS.map(v=>({n:v.name.replace('MV ',''), u:v.util, t:v.target}))} margin={{top:0,right:8,left:-18,bottom:44}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="n" tick={{fill:C.textMuted,fontSize:10}} angle={-28} textAnchor="end" interval={0}/>
            <YAxis tick={{fill:C.textMuted,fontSize:10}} domain={[0,100]} tickFormatter={v=>v+'%'}/>
            <Tooltip {...tooltipStyle} formatter={v=>[v+'%']}/>
            <Bar dataKey="u" name="Utilisation" radius={[4,4,0,0]}>
              {VESSELS.map((v,i)=><Cell key={i} fill={v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red}/>)}
            </Bar>
            <Bar dataKey="t" name="Target" fill={C.border} radius={[4,4,0,0]} opacity={0.6}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
