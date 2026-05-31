import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { SCENARIO_PRESETS, SENSITIVITY, calcPL } from '../data/seed.js'
import { C, Card, SectionLabel, GoldButton, tooltipStyle } from './ui.jsx'



const SLIDERS = [
  {k:'util',   l:'Fleet Utilisation',   min:40, max:100,  step:1,   unit:'%'},
  {k:'poolRate',   l:'Pool Rate (USD/day)',       min:8000,max:35000,step:500, unit:''},
  {k:'bunker', l:'VLSFO Bunker ($/MT)', min:400,max:1200, step:10,  unit:''},
  {k:'inr',    l:'USD / INR Exchange Rate', min:70, max:120,  step:0.5, unit:''},
  {k:'extra',  l:'Additional Vessels',  min:0,  max:6,    step:1,   unit:''},
  {k:'opex',   l:'OPEX / Day (USD)',    min:6000,max:14000,step:100, unit:''},
]

const COLORS = {base:C.blue, bull:C.green, bear:C.red, redsea:C.amber, bunkerspike:C.amber}

export default function Assumptions() {
  const [assumptions, setAssumptions] = useState(SCENARIO_PRESETS.base)
  const [active,   setActive]    = useState('base')
  const [saved,    setSaved]     = useState({})
  const [compareA, setCompareA]  = useState('base')
  const [compareB, setCompareB]  = useState('bull')

  const pl   = calcPL(assumptions)
  const pos  = parseFloat(pl.ebitda) > 0

  const set = (k,v) => { setActive('custom'); setAssumptions(p=>({...p,[k]:parseFloat(v)})) }
  const applyScenario = k => { setActive(k); setAssumptions(SCENARIO_PRESETS[k]) }
  const saveScenario  = () => { setSaved(p => ({...p,['Custom '+(Object.keys(p).length+1)]: {...assumptions}})) }

  const plA = calcPL(SCENARIO_PRESETS[compareA])
  const plB = calcPL(SCENARIO_PRESETS[compareB])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Preset buttons */}
      <Card>
        <SectionLabel accent>Scenario Presets</SectionLabel>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {Object.entries(SCENARIO_PRESETS).map(([k,v])=>(
            <button key={k} onClick={()=>applyScenario(k)} style={{
              padding:'8px 16px', borderRadius:8,
              border:`1px solid ${active===k ? COLORS[k] : C.border}`,
              background:active===k ? COLORS[k]+'22' : 'transparent',
              color:active===k ? COLORS[k] : C.textMuted,
              fontSize:12, fontWeight:600, transition:'all 0.2s', fontFamily:'inherit',
            }}>
              {v.label}
            </button>
          ))}
          {active==='custom' && (
            <GoldButton outline onClick={saveScenario}>Save Current →</GoldButton>
          )}
        </div>
        {Object.keys(saved).length > 0 && (
          <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap' }}>
            <div style={{ fontSize:11, color:C.textMuted, width:'100%', marginBottom:4 }}>Saved Scenarios:</div>
            {Object.entries(saved).map(([name, vals])=>(
              <button key={name} onClick={()=>{setActive(name);setAssumptions(vals)}} style={{
                padding:'6px 12px', borderRadius:6, border:`1px solid ${C.gold}44`,
                background:active===name?C.goldGlow:'transparent', color:C.gold, fontSize:11, fontFamily:'inherit',
              }}>★ {name}</button>
            ))}
          </div>
        )}
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>

        {/* Sliders */}
        <Card>
          <SectionLabel accent>Adjust Assumptions</SectionLabel>
          {SLIDERS.map(s=>(
            <div key={s.k} style={{ marginBottom:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:12, color:C.textSub }}>{s.l}</span>
                <span style={{ fontSize:14, fontWeight:700, color:C.gold }}>
                  {s.unit ? assumptions[s.k]+s.unit : Number(assumptions[s.k]).toLocaleString()}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={assumptions[s.k]} onChange={e=>set(s.k,e.target.value)} style={{ width:'100%' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:C.textMuted, marginTop:3 }}>
                <span>{s.unit ? s.min+s.unit : s.min.toLocaleString()}</span>
                <span>{s.unit ? s.max+s.unit : s.max.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* P&L output */}
          <Card>
            <SectionLabel accent>P&L Output — {pl.vessels} Vessels (Annualised)</SectionLabel>
            {[
              {l:'Revenue',     v:'$'+pl.rev+'M',    c:C.text,  sz:14},
              {l:'Bunker Cost', v:'-$'+pl.bunk+'M',  c:C.red,   sz:13},
              {l:'OPEX',        v:'-$'+pl.opex+'M',  c:C.red,   sz:13},
              {l:'EBITDA',      v:'$'+pl.ebitda+'M', c:pos?C.green:C.red, sz:28, serif:true},
              {l:'Margin',      v:pl.margin+'%',     c:pos?C.green:C.red, sz:14},
            ].map(r=>(
              <div key={r.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}22` }}>
                <span style={{ fontSize:12, color:C.textMuted }}>{r.l}</span>
                <span style={{ fontFamily:r.serif?"'Playfair Display',serif":'inherit', fontSize:r.sz, fontWeight:r.serif?600:600, color:r.c }}>{r.v}</span>
              </div>
            ))}
          </Card>

          {/* Sensitivity */}
          <Card>
            <SectionLabel accent>Sensitivity — Variables That Move the Needle</SectionLabel>
            <div style={{ fontSize:11, color:C.textMuted, marginBottom:10 }}>P&L impact (USD M) per 10% change</div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={SENSITIVITY} layout="vertical" margin={{top:0,right:16,left:110,bottom:0}}>
                <XAxis type="number" tick={{fill:C.textMuted,fontSize:10}} tickFormatter={v=>'$'+v+'M'}/>
                <YAxis type="category" dataKey="n" tick={{fill:'#C8D8EC',fontSize:11}}/>
                <Tooltip {...tooltipStyle} formatter={v=>['$'+v+'M impact']}/>
                <Bar dataKey="v" fill={C.gold} radius={[0,4,4,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Side-by-side compare */}
      <Card>
        <SectionLabel accent>Side-by-Side Scenario Comparison</SectionLabel>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:16 }}>
          {['A','B'].map((side,idx)=>(
            <div key={side} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:12, color:C.textMuted }}>Scenario {side}:</span>
              <select value={idx===0?compareA:compareB} onChange={e=>idx===0?setCompareA(e.target.value):setCompareB(e.target.value)}
                style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:'6px 10px', fontSize:12, fontFamily:'inherit' }}>
                {Object.entries(SCENARIO_PRESETS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {[{key:compareA,pl:plA,col:COLORS[compareA]},{key:compareB,pl:plB,col:COLORS[compareB]}].map(({key,pl,col})=>(
            <div key={key} style={{ background:C.cardAlt, borderRadius:10, padding:'16px', border:`1px solid ${col}44`, borderTop:`3px solid ${col}` }}>
              <div style={{ fontSize:12, fontWeight:700, color:col, marginBottom:12 }}>{SCENARIO_PRESETS[key]?.label||key}</div>
              {[['Revenue','$'+pl.rev+'M'],['EBITDA','$'+pl.ebitda+'M'],['Margin',pl.margin+'%'],['Vessels',pl.vessels]].map(([l,v])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${C.border}22`, fontSize:13 }}>
                  <span style={{ color:C.textMuted }}>{l}</span>
                  <span style={{ fontWeight:600, color:C.text }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Delta */}
        <div style={{ marginTop:12, background:C.cardAlt, borderRadius:8, padding:'12px 16px', border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.gold, marginBottom:8 }}>DELTA — {SCENARIO_PRESETS[compareA]?.label} vs {SCENARIO_PRESETS[compareB]?.label}</div>
          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            {[
              {l:'Revenue Δ', v:(parseFloat(plB.rev)-parseFloat(plA.rev)).toFixed(1)},
              {l:'EBITDA Δ',  v:(parseFloat(plB.ebitda)-parseFloat(plA.ebitda)).toFixed(1)},
              {l:'Margin Δ',  v:(parseFloat(plB.margin)-parseFloat(plA.margin)).toFixed(1)+'%'},
            ].map(d=>(
              <div key={d.l}>
                <div style={{ fontSize:10, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em' }}>{d.l}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:parseFloat(d.v)>=0?C.green:C.red }}>
                  {parseFloat(d.v)>=0?'+':''}{d.v}
                  {!d.v.includes('%')&&'M'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
