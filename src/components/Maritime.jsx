import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { VESSELS, VESSEL_EARNINGS, BREAKEVEN_PER_DAY, BREAKEVEN_PER_MONTH, calcWaterfall, COMMERCIAL_MODE_LABELS } from '../data/seed.js'
import { C, StatusDot, Card, HeroCard, KpiCard, SectionLabel, GoldButton, AIOutput, tooltipStyle } from './ui.jsx'
import { generateVesselBriefing } from '../lib/claude.js'

const SC = { green:C.green, amber:C.amber, red:C.red }

const MODE_COLOR = { pool:C.gold, tc:C.green, captive:C.blue, spot:C.amber }
const MODE_ICON  = { pool:'◎', tc:'⊞', captive:'⊟', spot:'◈' }

const tankers = VESSELS.filter(v => v.id.startsWith('V'))
const barges  = VESSELS.filter(v => v.id.startsWith('B'))

export default function Maritime() {
  const [selected, setSelected] = useState(null)
  const [briefing, setBriefing] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [section,  setSection]  = useState('tankers') // 'tankers' | 'barges'

  const avgUtil  = Math.round(VESSELS.reduce((s,v) => s+v.util, 0) / VESSELS.length)
  const totalPL  = VESSELS.reduce((s,v) => s+v.pl, 0)
  const defects  = VESSELS.reduce((s,v) => s+v.defects, 0)
  const crew     = VESSELS.reduce((s,v) => s+v.crew, 0)
  const aboveBreakeven = tankers.filter(v => {
    const w = calcWaterfall(VESSEL_EARNINGS[v.id])
    return w && w.aboveBreakeven
  }).length

  async function handleBriefing(v) {
    setSelected(v); setBriefing(''); setLoading(true)
    const txt = await generateVesselBriefing(v)
    setBriefing(txt); setLoading(false)
  }

  const displayVessels = section === 'tankers' ? tankers : barges

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:10 }}>
        {[
          { label:'MR Tankers',         value:`4 active`,           color:C.gold },
          { label:'River Barges',        value:`5 operating`,        color:C.blue },
          { label:'Fleet Utilisation',   value:`${avgUtil}%`,        color:avgUtil>=85?C.green:C.amber },
          { label:'Above Breakeven',     value:`${aboveBreakeven}/4 tankers`, color:aboveBreakeven===4?C.green:C.amber },
          { label:'Breakeven Threshold', value:`$7,500/day`,         color:C.textMuted },
          { label:'Open Defects',        value:String(defects),      color:defects>5?C.red:C.amber },
        ].map(k=>(
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:'0.09em', textTransform:'uppercase', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:600, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Section toggle */}
      <div style={{ display:'flex', gap:4, background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:10, padding:4 }}>
        {[{k:'tankers',l:'MR Product Tankers (4)',icon:'🚢'},{k:'barges',l:'Inland River Barges — Cosmos 1–5',icon:'⛵'}].map(t=>(
          <button key={t.k} onClick={()=>{setSection(t.k);setSelected(null)}} style={{
            flex:1, padding:'9px', borderRadius:8, fontSize:12, fontWeight:600,
            background:section===t.k?C.card:'transparent',
            border:section===t.k?`1px solid ${C.borderGold}`:'1px solid transparent',
            color:section===t.k?C.gold:C.textMuted, fontFamily:'inherit', cursor:'pointer', transition:'all 0.2s',
          }}>{t.icon} {t.l}</button>
        ))}
      </div>

      {/* Fleet table */}
      <Card>
        <SectionLabel accent>{section==='tankers'?'MR Product Tanker Fleet — Commercial Overview':'Inland River Barge Fleet — Cosmos Series'}</SectionLabel>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {section==='tankers'
                  ? ['','Vessel','Commercial Mode','Position & Route','Utilisation','Earnings/Day','P&L MTD','Certs','Acquired'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', textAlign:'left', color:C.textMuted, fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{h}</th>
                    ))
                  : ['','Vessel','Build','Position','Utilisation','P&L MTD','Defects','Certs'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', textAlign:'left', color:C.textMuted, fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{h}</th>
                    ))
                }
              </tr>
            </thead>
            <tbody>
              {displayVessels.map(v => {
                const wf    = calcWaterfall(VESSEL_EARNINGS[v.id])
                const modeCol = MODE_COLOR[v.commercialMode] || C.gold
                return (
                  <tr key={v.id} onClick={()=>setSelected(selected?.id===v.id?null:v)}
                    style={{ borderBottom:`1px solid ${C.border}22`, cursor:'pointer', background:selected?.id===v.id?'rgba(201,164,87,0.06)':'transparent', transition:'background 0.15s' }}>
                    <td style={{ padding:'10px 10px' }}><StatusDot s={v.status} animate size={9}/></td>
                    <td style={{ padding:'10px 10px' }}>
                      <div style={{ fontWeight:700, color:C.text, whiteSpace:'nowrap' }}>{v.name}</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>{v.dwt.toLocaleString()} DWT · {v.class}</div>
                    </td>
                    {section==='tankers' ? <>
                      <td style={{ padding:'10px 10px' }}>
                        <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:20, background:`${modeCol}18`, color:modeCol, border:`1px solid ${modeCol}33` }}>
                          {MODE_ICON[v.commercialMode]} {COMMERCIAL_MODE_LABELS[v.commercialMode]}
                        </span>
                        <div style={{ fontSize:11, color:C.textMuted, marginTop:4, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {v.commercialMode==='pool' ? v.pool : v.commercialMode==='tc' ? `${v.charterer}` : 'Internal programme'}
                        </div>
                      </td>
                      <td style={{ padding:'10px 10px' }}>
                        <div style={{ color:'#C8D8EC', fontSize:13 }}>{v.pos}</div>
                        <div style={{ color:C.textMuted, fontSize:11 }}>{v.route}</div>
                      </td>
                      <td style={{ padding:'10px 10px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:56, height:5, background:C.border, borderRadius:3 }}>
                            <div style={{ width:`${v.util}%`, height:'100%', borderRadius:3, background:v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red }}/>
                          </div>
                          <span style={{ fontWeight:700, fontSize:13, color:v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red }}>{v.util}%</span>
                        </div>
                      </td>
                      <td style={{ padding:'10px 10px' }}>
                        {wf ? (
                          <div>
                            <div style={{ fontWeight:700, fontSize:13, color:wf.aboveBreakeven?C.green:C.red }}>${Math.round(wf.dailyEarnings).toLocaleString()}/d</div>
                            <div style={{ fontSize:11, color:C.textMuted }}>BEP: $7,500/d {wf.aboveBreakeven?'✓':' ✗'}</div>
                          </div>
                        ) : <span style={{ color:C.textMuted, fontSize:12 }}>Captive</span>}
                      </td>
                      <td style={{ padding:'10px 10px', fontWeight:700, color:v.pl>=0?C.green:C.red }}>{v.pl>=0?'+':''}${(v.pl/1000).toFixed(0)}K</td>
                      <td style={{ padding:'10px 10px' }}>
                        <span style={{ fontSize:11, fontWeight:600, color:v.certs==='ok'?C.green:v.certs==='warning'?C.amber:C.red }}>
                          {v.certs==='ok'?'✓ Current':v.certs==='warning'?'⚠ Expiring':'✗ Expired'}
                        </span>
                      </td>
                      <td style={{ padding:'10px 10px', color:C.textMuted, fontSize:12 }}>{v.acquired}</td>
                    </> : <>
                      <td style={{ padding:'10px 10px', color:C.textSub, fontSize:12 }}>{v.built}</td>
                      <td style={{ padding:'10px 10px' }}>
                        <div style={{ color:'#C8D8EC', fontSize:13 }}>{v.pos}</div>
                        <div style={{ color:C.textMuted, fontSize:11 }}>Captive cargo</div>
                      </td>
                      <td style={{ padding:'10px 10px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:56, height:5, background:C.border, borderRadius:3 }}>
                            <div style={{ width:`${v.util}%`, height:'100%', borderRadius:3, background:v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red }}/>
                          </div>
                          <span style={{ fontWeight:700, fontSize:13, color:v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red }}>{v.util}%</span>
                        </div>
                      </td>
                      <td style={{ padding:'10px 10px', fontWeight:700, color:v.pl>=0?C.green:C.red }}>${(v.pl/1000).toFixed(0)}K</td>
                      <td style={{ padding:'10px 10px', color:v.defects>3?C.red:v.defects>0?C.amber:C.green, fontWeight:600, fontSize:13 }}>{v.defects}</td>
                      <td style={{ padding:'10px 10px' }}>
                        <span style={{ fontSize:11, fontWeight:600, color:v.certs==='ok'?C.green:v.certs==='warning'?C.amber:C.red }}>
                          {v.certs==='ok'?'✓ Current':v.certs==='warning'?'⚠ Expiring':'✗ Expired'}
                        </span>
                      </td>
                    </>}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Vessel drill-through */}
      {selected && (
        <Card accent={SC[selected.status]} style={{ animation:'fade-up 0.3s ease' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <div style={{ width:46, height:46, background:`${SC[selected.status]}18`, border:`2px solid ${SC[selected.status]}`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>
                {selected.id.startsWith('B')?'⛵':'🚢'}
              </div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.text }}>{selected.name}</div>
                <div style={{ fontSize:12, color:C.textMuted }}>{selected.type} · {selected.flag} · {selected.dwt.toLocaleString()} DWT · Built {selected.built} · {selected.class}{selected.imo!=='N/A'?` · IMO ${selected.imo}`:''}</div>
                <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>{selected.note}</div>
              </div>
            </div>
            <button onClick={()=>{setSelected(null);setBriefing('')}} style={{ background:'none', border:'none', color:C.textMuted, fontSize:22, lineHeight:1, padding:4 }}>×</button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:16 }}>
            {[
              { l:'Position',      v:selected.pos },
              { l:'Route',         v:selected.route },
              { l:'Utilisation',   v:`${selected.util}% (target ${selected.target}%)` },
              { l:'Acquired',      v:selected.acquired },
              { l:'Open Defects',  v:`${selected.defects} items` },
              { l:'Crew On Board', v:`${selected.crew} persons` },
            ].map(r=>(
              <div key={r.l} style={{ background:C.cardAlt, borderRadius:8, padding:'10px 12px', border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:3 }}>{r.l}</div>
                <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{r.v}</div>
              </div>
            ))}
          </div>

          {/* Earnings Waterfall — tankers only */}
          {selected.id.startsWith('V') && VESSEL_EARNINGS[selected.id] && (() => {
            const wf = calcWaterfall(VESSEL_EARNINGS[selected.id])
            const rows = [
              { l:'Gross Income (Pool/TC/Captive)',         v:wf.grossIncome,     c:C.text,   top:true  },
              { l:'— Brokerage Commission',                 v:-wf.brokerageComm,  c:C.red,    indent:true},
              { l:'— Pool Commission / Share',              v:-wf.poolCommission, c:wf.poolCommission>0?C.red:C.textMuted, indent:true},
              { l:'— OPEX (all-in incl. DD + Insurance)',   v:-wf.opex,           c:C.red,    indent:true},
              { l:'— P&I Insurance',                        v:-wf.insurancePnI,   c:C.red,    indent:true},
              { l:'— War Risk Insurance',                   v:-wf.warRisk,        c:C.red,    indent:true},
              { l:'— Shore-Based Costs',                    v:-wf.shoreCosts,     c:C.red,    indent:true},
              { l:'NET OPERATING INCOME',                   v:wf.netOpIncome,     c:wf.netOpIncome>0?C.green:C.red, bold:true},
              { l:'— Interest',                             v:-wf.interest,       c:C.red,    indent:true},
              { l:'— Loan Repayment',                       v:-wf.repayment,      c:C.red,    indent:true},
              { l:'NET CASH FLOW',                          v:wf.netCashFlow,     c:wf.netCashFlow>0?C.green:C.red, bold:true},
            ]
            return (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.gold, letterSpacing:'0.08em', marginBottom:10 }}>MONTHLY EARNINGS WATERFALL (USD)</div>
                <div style={{ background:C.cardAlt, borderRadius:8, padding:'12px 14px', border:`1px solid ${C.border}` }}>
                  {rows.map((r,i)=>(
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:r.bold?`1px solid ${C.border}`:'none', marginBottom:r.bold?4:0 }}>
                      <span style={{ fontSize:r.bold?12:11, fontWeight:r.bold?700:400, color:r.bold?C.text:C.textSub, paddingLeft:r.indent?14:0 }}>{r.l}</span>
                      <span style={{ fontSize:r.bold?14:12, fontWeight:r.bold?700:500, color:r.c, fontFamily:r.bold?"'Playfair Display',serif":'DM Mono,monospace' }}>
                        {r.v>=0?'$':'−$'}{Math.abs(r.v).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div style={{ marginTop:10, padding:'8px 12px', background:wf.aboveBreakeven?C.greenDim:C.redDim, borderRadius:6, fontSize:12, color:wf.aboveBreakeven?C.green:C.red, fontWeight:700, textAlign:'center' }}>
                    {wf.aboveBreakeven?'✓':'⚠'} Daily earnings ${Math.round(wf.dailyEarnings).toLocaleString()} vs breakeven $7,500 — {wf.aboveBreakeven?`$${(Math.round(wf.dailyEarnings)-7500).toLocaleString()}/day above`:`$${(7500-Math.round(wf.dailyEarnings)).toLocaleString()}/day below`}
                  </div>
                </div>
              </div>
            )
          })()}

          <AIOutput loading={loading} loadingText="Generating vessel briefing…">{briefing}</AIOutput>
          {!loading && !briefing && (
            <GoldButton onClick={()=>handleBriefing(selected)} style={{ width:'100%', textAlign:'center', padding:'10px', marginTop:10 }}>★ Generate AI Vessel Briefing →</GoldButton>
          )}
        </Card>
      )}

      {/* Utilisation chart with breakeven reference */}
      {section==='tankers' && (
        <Card>
          <SectionLabel accent>Tanker Fleet Utilisation vs Target · Breakeven $7,500/day</SectionLabel>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tankers.map(v=>({ n:v.name.replace('MT ',''), u:v.util, t:v.target }))} margin={{top:0,right:8,left:-18,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="n" tick={{fill:C.textMuted,fontSize:11}}/>
              <YAxis tick={{fill:C.textMuted,fontSize:11}} domain={[0,100]} tickFormatter={v=>v+'%'}/>
              <Tooltip {...tooltipStyle} formatter={v=>[v+'%']}/>
              <Bar dataKey="u" name="Utilisation" radius={[4,4,0,0]}>
                {tankers.map((v,i)=><Cell key={i} fill={v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red}/>)}
              </Bar>
              <Bar dataKey="t" name="Target" fill={C.border} radius={[4,4,0,0]} opacity={0.6}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

    </div>
  )
}
