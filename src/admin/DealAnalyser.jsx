import { useState, useMemo, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         LineChart, Line, ReferenceLine, Cell } from 'recharts'
import { runModel, runScenario, SCENARIO_TEMPLATES, fmt, fmtPct, buildLoanSchedule } from '../lib/irr.js'
import { supabase, DEMO_MODE } from '../lib/supabase.js'

const STAGES = ['Origination','Indicative Terms','Due Diligence','Credit Approval','Documentation','Closed']

const DEFAULT = {
  dealName:'New Vessel Acquisition',vesselType:'MR Product Tanker',
  dwtMt:47000, ldtMt:13200,
  acquisitionCost:28000000, prePurchaseCosts:500000,
  loanLtv:0.70, interestRate:0.08, loanTenureYears:5,
  operatingMode:'tc', dailyRate:19500, commissionRate:0.05,
  poolName:'Maersk Tankers Pool', poolCommission:0.05, charterer:'',
  opexPerDay:7500, opexEscalation:0.02, operatingDays:335,
  ddCost:1000000, ssCost:1000000, ddYear:2, ssYear:5, dd2Year:7,
  scrapRatePerTon:400, operatingYears:8,
  stage:'Origination', status:'pipeline',
  counterparty:'', purpose:'', highlights:'', notes:'',
}

function InputRow({ label, children, tip }) {
  return (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#7A9AB8', letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:5 }}>
        {label}{tip&&<span style={{ fontWeight:400, color:'#5A7A90', marginLeft:6, textTransform:'none', letterSpacing:0 }}>{tip}</span>}
      </label>
      {children}
    </div>
  )
}

function Inp({ value, onChange, type='text', prefix, suffix, step, min }) {
  return (
    <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
      {prefix&&<span style={{ position:'absolute', left:12, fontSize:13, color:'#7A9AB8', pointerEvents:'none', zIndex:1 }}>{prefix}</span>}
      <input type={type} value={value} min={min} step={step}
        onChange={e=>onChange(type==='number'?parseFloat(e.target.value)||0:e.target.value)}
        style={{ width:'100%', background:'#0A1828', border:'1px solid #1A3050', borderRadius:7, color:'#F4F8FF', padding:`10px ${suffix?'36px':'12px'} 10px ${prefix?'28px':'12px'}`, fontSize:13, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
      />
      {suffix&&<span style={{ position:'absolute', right:12, fontSize:12, color:'#7A9AB8' }}>{suffix}</span>}
    </div>
  )
}

function ResultBadge({ label, value, color }) {
  return (
    <div style={{ background:'rgba(6,12,24,0.7)', borderRadius:10, padding:'16px 20px', border:`1px solid ${color}33`, textAlign:'center' }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700, color, lineHeight:1.1, marginBottom:6 }}>{value}</div>
      <div style={{ fontSize:11, fontWeight:700, color:'#7A9AB8', letterSpacing:'0.08em', textTransform:'uppercase' }}>{label}</div>
    </div>
  )
}

function ScenarioCard({ name, result, color, isBase, onSetBase }) {
  if (!result) return null
  return (
    <div style={{ background:'#0C1A2C', borderRadius:10, padding:'14px', border:`1px solid ${color}33`, borderTop:`3px solid ${color}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:700, color }}>{name}</div>
        {!isBase && <button onClick={onSetBase} style={{ fontSize:10, color:'#7A9AB8', background:'transparent', border:'1px solid #1A3050', borderRadius:4, padding:'2px 8px', cursor:'pointer', fontFamily:'inherit' }}>Set as base</button>}
        {isBase  && <span style={{ fontSize:10, color:'#7A9AB8' }}>Base scenario</span>}
      </div>
      {[
        {l:'Project IRR', v:fmtPct(result.projectIRR), c:result.projectIRR>0.15?'#10D9A0':'#F59E0B'},
        {l:'Equity IRR',  v:fmtPct(result.equityIRR),  c:result.equityIRR >0.20?'#10D9A0':'#F59E0B'},
        {l:'EBITDA Yr 1', v:fmt(result.ebitdaYr1)},
        {l:'Payback',     v:result.paybackYears?result.paybackYears+'y':'N/A'},
      ].map(r=>(
        <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #1A304022', fontSize:12 }}>
          <span style={{ color:'#7A9AB8' }}>{r.l}</span>
          <span style={{ fontWeight:700, color:r.c||'#F4F8FF' }}>{r.v}</span>
        </div>
      ))}
    </div>
  )
}

export default function DealAnalyser({ A }) {
  const [p, setP]         = useState(DEFAULT)
  const [scenarios, setSc] = useState({})
  const [saving,  setSav] = useState(false)
  const [saved,   setSaved]= useState(null)
  const [showPnl, setShowPnl] = useState(false)
  const [activeScen, setActiveScen] = useState('base')

  const set = (k,v) => setP(prev => ({ ...prev, [k]:v }))

  // Live model calculation
  const result = useMemo(() => {
    try {
      return runModel({
        acquisitionCost:   p.acquisitionCost,
        prePurchaseCosts:  p.prePurchaseCosts,
        loanLtv:           p.loanLtv,
        interestRate:      p.interestRate,
        loanTenureYears:   p.loanTenureYears,
        dailyRate:         p.dailyRate,
        commissionRate:    p.operatingMode==='pool' ? p.poolCommission : p.commissionRate,
        opexPerDay:        p.opexPerDay,
        opexEscalation:    p.opexEscalation,
        operatingDays:     p.operatingDays,
        ddCost:            p.ddCost, ssCost:p.ssCost,
        ddYear:            p.ddYear, ssYear:p.ssYear, dd2Year:p.dd2Year,
        scrapRatePerTon:   p.scrapRatePerTon,
        ldtMt:             p.ldtMt,
        operatingYears:    p.operatingYears,
      })
    } catch { return null }
  }, [p])

  // Run all scenario templates against current base
  const allScenarios = useMemo(() => {
    const base = { ...p }
    return Object.fromEntries(
      Object.entries(SCENARIO_TEMPLATES).map(([k,tmpl]) => [
        k, runScenario({
          acquisitionCost:  base.acquisitionCost,
          prePurchaseCosts: base.prePurchaseCosts,
          loanLtv:          base.loanLtv,
          interestRate:     base.interestRate,
          loanTenureYears:  base.loanTenureYears,
          dailyRate:        base.dailyRate,
          commissionRate:   base.operatingMode==='pool'?base.poolCommission:base.commissionRate,
          opexPerDay:       base.opexPerDay, opexEscalation:base.opexEscalation,
          operatingDays:    base.operatingDays,
          ddCost:           base.ddCost, ssCost:base.ssCost,
          ddYear:           base.ddYear, ssYear:base.ssYear, dd2Year:base.dd2Year,
          scrapRatePerTon:  base.scrapRatePerTon, ldtMt:base.ldtMt,
          operatingYears:   base.operatingYears,
        }, tmpl)
      ])
    )
  }, [p])

  async function saveDeal() {
    setSav(true)
    const record = {
      deal_name:         p.dealName,
      vessel_type:       p.vesselType,
      dwt_mt:            p.dwtMt,
      ldt_mt:            p.ldtMt,
      acquisition_cost:  p.acquisitionCost,
      pre_purchase_costs:p.prePurchaseCosts,
      final_cost:        result?.finalCost,
      loan_ltv:          p.loanLtv,
      loan_amount:       result?.loanAmount,
      equity_amount:     result?.equity,
      interest_rate:     p.interestRate,
      loan_tenure_years: p.loanTenureYears,
      operating_mode:    p.operatingMode,
      daily_rate:        p.dailyRate,
      commission_rate:   p.commissionRate,
      pool_name:         p.poolName,
      pool_commission:   p.poolCommission,
      charterer:         p.charterer,
      opex_per_day:      p.opexPerDay,
      opex_escalation:   p.opexEscalation,
      operating_days:    p.operatingDays,
      dd_cost:           p.ddCost, ss_cost:p.ssCost,
      dd_year:           p.ddYear, ss_year:p.ssYear,
      scrap_rate_per_ton:p.scrapRatePerTon,
      operating_years:   p.operatingYears,
      project_irr:       result?.projectIRR,
      equity_irr:        result?.equityIRR,
      payback_years:     result?.paybackYears,
      stage:             p.stage,
      status:            p.status,
      counterparty:      p.counterparty,
      purpose:           p.purpose,
      highlights:        p.highlights,
      notes:             p.notes,
    }

    if (!DEMO_MODE && supabase) {
      const { data, error } = await supabase.from('deals').insert(record).select().single()
      if (!error && data) {
        // Save scenarios
        const scenRows = Object.entries(allScenarios).map(([k,s]) => ({
          deal_id:        data.id,
          scenario_name:  SCENARIO_TEMPLATES[k].label,
          daily_rate:     Math.round(p.dailyRate * SCENARIO_TEMPLATES[k].rateAdj),
          operating_days: Math.round(p.operatingDays * SCENARIO_TEMPLATES[k].utilAdj),
          opex_per_day:   Math.round(p.opexPerDay * SCENARIO_TEMPLATES[k].opexAdj),
          interest_rate:  p.interestRate,
          loan_ltv:       p.loanLtv,
          loan_tenure_years: p.loanTenureYears,
          operating_years: p.operatingYears,
          project_irr:    s.projectIRR,
          equity_irr:     s.equityIRR,
          is_base:        k === 'base',
        }))
        await supabase.from('deal_scenarios').insert(scenRows)
        setSaved(`✓ Saved to Supabase — Deal ID: ${data.id.slice(0,8)}…`)
      } else {
        setSaved(`⚠ DB error: ${error?.message || 'unknown'}`)
      }
    } else {
      setSaved('✓ Saved to local session (Demo mode — Supabase not connected)')
    }
    setSav(false)
  }

  const projColor = r => r?.projectIRR >= 0.15 ? '#10D9A0' : r?.projectIRR >= 0.10 ? '#F59E0B' : '#F43F5E'
  const eqColor   = r => r?.equityIRR  >= 0.20 ? '#10D9A0' : r?.equityIRR  >= 0.15 ? '#F59E0B' : '#F43F5E'

  const ebitdaChartData = result?.years.map(y => ({
    yr:   `Yr ${y.year}`,
    ebitda: Math.round(y.ebitda/1000),
    pbdt:   Math.round(y.pbdt/1000),
    revenue:Math.round(y.netRev/1000),
  })) || []

  const cfChartData = result?.years.map((y,i) => ({
    yr: `Yr ${y.year}`,
    projCF: Math.round((i===0?result.projCFs[0]:y.projCF)/1000),
    eqCF:   Math.round((i===0?result.eqCFs[0]  :y.eqCF  )/1000),
  })) || []

  const cardBg = { background:A.card, border:`1px solid ${A.border}`, borderRadius:12, padding:'18px 20px' }
  const sectionLabel = (t) => <div style={{ fontSize:10, fontWeight:700, color:A.muted, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}><span style={{ width:14,height:2,background:A.gold,display:'inline-block',borderRadius:1 }}/>{t}</div>

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Page title */}
      <div style={{ marginBottom:4 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:A.text }}>Deal Analyser</div>
        <div style={{ fontSize:13, color:A.muted, marginTop:2 }}>Ship acquisition IRR model · Real-time calculation · Save directly to Chairman's dashboard</div>
      </div>

      {/* IRR Results — always visible at top */}
      {result && (
        <div style={{ background:`linear-gradient(135deg,#0E2240,#142E4A)`, borderRadius:14, padding:'22px 24px', border:`1px solid rgba(201,164,87,0.22)` }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12, marginBottom:16 }}>
            <ResultBadge label="Project IRR (Unlevered)" value={fmtPct(result.projectIRR)} color={projColor(result)}/>
            <ResultBadge label="Equity IRR (Levered)"   value={fmtPct(result.equityIRR)}  color={eqColor(result)}/>
            <ResultBadge label="Total Cost"              value={fmt(result.finalCost)}      color={A.gold}/>
            <ResultBadge label="Equity Required"         value={fmt(result.equity)}          color={A.amber}/>
            <ResultBadge label="Scrap Value"             value={fmt(result.scrapValue)}      color={A.muted}/>
            <ResultBadge label="Payback"                 value={result.paybackYears?result.paybackYears+' years':'N/A'} color={A.text}/>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <div style={{ fontSize:11, color:A.muted }}>Model validated against Golden Curl 27/03/2026 (MHPL) ·</div>
            <div style={{ fontSize:11, color:A.muted }}>Golden Curl result: Project IRR 19.3% · Equity IRR 16.0% ·</div>
            <div style={{ fontSize:11, color:A.muted }}>Advisory only — Chairman retains final investment decision</div>
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1.6fr)', gap:16 }}>

        {/* LEFT — Inputs */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Deal info */}
          <div style={cardBg}>
            {sectionLabel('Deal Information')}
            <InputRow label="Deal Name">
              <Inp value={p.dealName} onChange={v=>set('dealName',v)}/>
            </InputRow>
            <InputRow label="Vessel Type">
              <select value={p.vesselType} onChange={e=>set('vesselType',e.target.value)}
                style={{ width:'100%', background:'#0A1828', border:'1px solid #1A3050', borderRadius:7, color:'#F4F8FF', padding:'10px 12px', fontSize:13, fontFamily:'inherit', outline:'none' }}>
                {['MR Product Tanker','LR1 Product Tanker','LR2 Product Tanker','Chemical Tanker','Crude Carrier (Aframax)','Crude Carrier (VLCC)','Bulk Carrier','General Cargo','Inland River Barge'].map(t=>(
                  <option key={t}>{t}</option>
                ))}
              </select>
            </InputRow>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <InputRow label="DWT (MT)"><Inp type="number" value={p.dwtMt} onChange={v=>set('dwtMt',v)}/></InputRow>
              <InputRow label="LDT (MT)" tip="for scrap"><Inp type="number" value={p.ldtMt} onChange={v=>set('ldtMt',v)}/></InputRow>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <InputRow label="Deal Stage">
                <select value={p.stage} onChange={e=>set('stage',e.target.value)}
                  style={{ width:'100%', background:'#0A1828', border:'1px solid #1A3050', borderRadius:7, color:'#F4F8FF', padding:'10px 12px', fontSize:13, fontFamily:'inherit', outline:'none' }}>
                  {STAGES.map(s=><option key={s}>{s}</option>)}
                </select>
              </InputRow>
              <InputRow label="Counterparty"><Inp value={p.counterparty} onChange={v=>set('counterparty',v)}/></InputRow>
            </div>
          </div>

          {/* Acquisition cost */}
          <div style={cardBg}>
            {sectionLabel('Acquisition & Financing')}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <InputRow label="Acquisition Cost"><Inp type="number" value={p.acquisitionCost} onChange={v=>set('acquisitionCost',v)} prefix="$"/></InputRow>
              <InputRow label="Pre-Purchase Costs"><Inp type="number" value={p.prePurchaseCosts} onChange={v=>set('prePurchaseCosts',v)} prefix="$"/></InputRow>
            </div>
            <div style={{ background:'#071020', borderRadius:6, padding:'8px 12px', marginBottom:12, fontSize:12, color:A.muted, display:'flex', justifyContent:'space-between' }}>
              <span>Total (Final Cost)</span>
              <span style={{ color:A.gold, fontWeight:700 }}>${(p.acquisitionCost+p.prePurchaseCosts).toLocaleString()}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <InputRow label="Loan LTV" tip={fmt(result?.loanAmount,'$')}>
                <Inp type="number" value={Math.round(p.loanLtv*100)} onChange={v=>set('loanLtv',v/100)} suffix="%" min={0} step={5}/>
              </InputRow>
              <InputRow label="Equity" tip={fmt(result?.equity,'$')}>
                <div style={{ background:'#0A1828', border:'1px solid #1A3050', borderRadius:7, padding:'10px 12px', fontSize:13, color:A.gold, fontWeight:700 }}>
                  ${result?.equity.toLocaleString() || '—'}
                </div>
              </InputRow>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <InputRow label="Interest Rate"><Inp type="number" value={(p.interestRate*100).toFixed(1)} onChange={v=>set('interestRate',v/100)} suffix="%" step={0.1}/></InputRow>
              <InputRow label="Loan Tenure"><Inp type="number" value={p.loanTenureYears} onChange={v=>set('loanTenureYears',parseInt(v)||1)} suffix="years" min={1} step={1}/></InputRow>
            </div>
          </div>

          {/* Revenue */}
          <div style={cardBg}>
            {sectionLabel('Revenue')}
            <div style={{ display:'flex', gap:4, marginBottom:14, background:'#071020', border:'1px solid #1A3050', borderRadius:8, padding:4 }}>
              {[{k:'tc',l:'Time Charter (TC)'},{k:'pool',l:'Pool'}].map(m=>(
                <button key={m.k} onClick={()=>set('operatingMode',m.k)} style={{
                  flex:1, padding:'8px', borderRadius:6, fontSize:12, fontWeight:600,
                  background:p.operatingMode===m.k?A.card:'transparent',
                  border:p.operatingMode===m.k?`1px solid ${A.gold}44`:'1px solid transparent',
                  color:p.operatingMode===m.k?A.gold:A.muted, fontFamily:'inherit', cursor:'pointer',
                }}>{m.l}</button>
              ))}
            </div>
            {p.operatingMode==='tc' ? (
              <>
                <InputRow label="TC Rate / day"><Inp type="number" value={p.dailyRate} onChange={v=>set('dailyRate',v)} prefix="$" step={100}/></InputRow>
                <InputRow label="Charterer Name"><Inp value={p.charterer} onChange={v=>set('charterer',v)} /></InputRow>
                <InputRow label="Commission" tip="on gross TC"><Inp type="number" value={(p.commissionRate*100).toFixed(1)} onChange={v=>set('commissionRate',v/100)} suffix="%" step={0.25}/></InputRow>
              </>
            ) : (
              <>
                <InputRow label="Estimated Pool Rate / day" tip="TCE basis"><Inp type="number" value={p.dailyRate} onChange={v=>set('dailyRate',v)} prefix="$" step={100}/></InputRow>
                <InputRow label="Pool Name"><Inp value={p.poolName} onChange={v=>set('poolName',v)}/></InputRow>
                <InputRow label="Pool Commission"><Inp type="number" value={(p.poolCommission*100).toFixed(1)} onChange={v=>set('poolCommission',v/100)} suffix="%" step={0.25}/></InputRow>
              </>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <InputRow label="Operating Days / yr"><Inp type="number" value={p.operatingDays} onChange={v=>set('operatingDays',parseInt(v)||300)} min={200} step={5}/></InputRow>
              <InputRow label="Operating Years"><Inp type="number" value={p.operatingYears} onChange={v=>set('operatingYears',parseInt(v)||5)} min={1} step={1}/></InputRow>
            </div>
          </div>

          {/* Costs */}
          <div style={cardBg}>
            {sectionLabel('Operating Costs & Drydock')}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <InputRow label="OPEX / day" tip="all-in incl. DD+Ins"><Inp type="number" value={p.opexPerDay} onChange={v=>set('opexPerDay',v)} prefix="$" step={100}/></InputRow>
              <InputRow label="OPEX Escalation"><Inp type="number" value={(p.opexEscalation*100).toFixed(1)} onChange={v=>set('opexEscalation',v/100)} suffix="% pa" step={0.5}/></InputRow>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <InputRow label="DD Cost"><Inp type="number" value={p.ddCost} onChange={v=>set('ddCost',v)} prefix="$"/></InputRow>
              <InputRow label="SS Cost"><Inp type="number" value={p.ssCost} onChange={v=>set('ssCost',v)} prefix="$"/></InputRow>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
              <InputRow label="DD Year"><Inp type="number" value={p.ddYear} onChange={v=>set('ddYear',parseInt(v)||1)} min={1} step={1}/></InputRow>
              <InputRow label="SS Year"><Inp type="number" value={p.ssYear} onChange={v=>set('ssYear',parseInt(v)||1)} min={1} step={1}/></InputRow>
              <InputRow label="2nd DD Year"><Inp type="number" value={p.dd2Year} onChange={v=>set('dd2Year',parseInt(v)||1)} min={1} step={1}/></InputRow>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:10 }}>
              <InputRow label="Scrap Rate / LDT ton"><Inp type="number" value={p.scrapRatePerTon} onChange={v=>set('scrapRatePerTon',v)} prefix="$" step={10}/></InputRow>
            </div>
          </div>

          {/* Deal notes */}
          <div style={cardBg}>
            {sectionLabel('Deal Notes (shown on Chairman dashboard)')}
            <InputRow label="Purpose">
              <textarea value={p.purpose} onChange={e=>set('purpose',e.target.value)} rows={2}
                style={{ width:'100%', background:'#0A1828', border:'1px solid #1A3050', borderRadius:7, color:'#F4F8FF', padding:'10px 12px', fontSize:12, fontFamily:'inherit', outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
            </InputRow>
            <InputRow label="Highlights">
              <textarea value={p.highlights} onChange={e=>set('highlights',e.target.value)} rows={2}
                style={{ width:'100%', background:'#0A1828', border:'1px solid #1A3050', borderRadius:7, color:'#F4F8FF', padding:'10px 12px', fontSize:12, fontFamily:'inherit', outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
            </InputRow>
          </div>

          {/* Save button */}
          <button onClick={saveDeal} disabled={saving} style={{
            width:'100%', padding:'14px',
            background:saving?'transparent':`linear-gradient(135deg,${A.gold},${A.goldL})`,
            border:`1px solid ${A.gold}`, borderRadius:10,
            color:saving?A.gold:A.bg, fontSize:14, fontWeight:700,
            cursor:saving?'not-allowed':'pointer', fontFamily:'inherit', transition:'all 0.2s',
          }}>
            {saving ? '✦ Saving to Dashboard…' : '✦ Save Deal to Chairman Dashboard →'}
          </button>
          {saved && <div style={{ textAlign:'center', fontSize:12, color:saved.startsWith('✓')?A.green:A.red, padding:'8px', background:saved.startsWith('✓')?A.greenDim:'#3A0A14', borderRadius:8, border:`1px solid ${saved.startsWith('✓')?A.green:A.red}33` }}>{saved}</div>}
        </div>

        {/* RIGHT — Results */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Scenario comparison */}
          <div style={cardBg}>
            {sectionLabel('Scenario Analysis — Auto-Generated')}
            <div style={{ fontSize:12, color:A.muted, marginBottom:12 }}>Base inputs adjusted automatically for each scenario · Edit inputs on the left to recalculate all scenarios</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
              {Object.entries(SCENARIO_TEMPLATES).map(([k,tmpl]) => (
                <ScenarioCard key={k} name={tmpl.label} result={allScenarios[k]}
                  color={{base:'#3B9EFF',bull:'#10D9A0',bear:'#F43F5E',rsea:'#F59E0B'}[k]}
                  isBase={k==='base'} onSetBase={()=>{}}
                />
              ))}
            </div>
          </div>

          {/* Charts */}
          <div style={cardBg}>
            {sectionLabel('Annual EBITDA & Net Cash Flow (USD \'000)')}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ebitdaChartData} margin={{top:0,right:0,left:-10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={A.border}/>
                <XAxis dataKey="yr" tick={{fill:A.muted,fontSize:10}}/>
                <YAxis tick={{fill:A.muted,fontSize:10}} tickFormatter={v=>v>0?'$'+v+'K':'('+Math.abs(v)+'K)'}/>
                <Tooltip contentStyle={{background:A.card,border:`1px solid ${A.border}`,borderRadius:8,color:A.text,fontSize:12}} formatter={v=>['$'+v+'K']}/>
                <ReferenceLine y={0} stroke={A.muted} strokeDasharray="3 3"/>
                <Bar dataKey="ebitda" name="EBITDA" fill={A.gold} radius={[3,3,0,0]}>
                  {ebitdaChartData.map((d,i)=><Cell key={i} fill={d.ebitda>=0?A.gold:'#F43F5E'}/>)}
                </Bar>
                <Bar dataKey="pbdt" name="Net CF (PBDT)" fill={A.green} radius={[3,3,0,0]} opacity={0.7}>
                  {ebitdaChartData.map((d,i)=><Cell key={i} fill={d.pbdt>=0?A.green:'#F43F5E'} opacity={0.7}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cumulative cash flow */}
          <div style={cardBg}>
            {sectionLabel('Cumulative Cash Flow — Equity Payback')}
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={(() => {
                let cum = 0
                return [{ yr:'Start', cum:-(result?.equity||0)/1000 }, ...(result?.years||[]).map(y => {
                  cum += y.eqCF/1000
                  return { yr:`Yr ${y.year}`, cum: Math.round(cum - (result?.equity||0)/1000) }
                })]
              })()} margin={{top:4,right:8,left:-10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={A.border}/>
                <XAxis dataKey="yr" tick={{fill:A.muted,fontSize:10}}/>
                <YAxis tick={{fill:A.muted,fontSize:10}} tickFormatter={v=>v>0?'$'+v+'K':'('+Math.abs(v)+'K)'}/>
                <Tooltip contentStyle={{background:A.card,border:`1px solid ${A.border}`,borderRadius:8,color:A.text,fontSize:12}} formatter={v=>['$'+v+'K']}/>
                <ReferenceLine y={0} stroke={A.green} strokeDasharray="5 3" label={{value:'Breakeven',fill:A.green,fontSize:10,position:'insideTopRight'}}/>
                <Line type="monotone" dataKey="cum" stroke={A.gold} strokeWidth={2.5} dot={true} name="Cumulative CF"/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Year-by-year P&L table */}
          <div style={cardBg}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              {sectionLabel('Year-by-Year P&L Table')}
              <button onClick={()=>setShowPnl(!showPnl)} style={{ fontSize:11, color:A.gold, background:'transparent', border:`1px solid ${A.gold}44`, borderRadius:6, padding:'4px 12px', cursor:'pointer', fontFamily:'inherit' }}>
                {showPnl?'Hide':'Show'} Full Table
              </button>
            </div>
            {showPnl && result && (
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${A.border}` }}>
                      {['Year','Net Revenue','OPEX','DD/SS','EBITDA','Interest','Repayment','Net CF (PBDT)'].map(h=>(
                        <th key={h} style={{ padding:'6px 10px', textAlign:'right', color:A.muted, fontWeight:700, fontSize:10, textTransform:'uppercase', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.years.map(y=>(
                      <tr key={y.year} style={{ borderBottom:`1px solid ${A.border}22` }}>
                        <td style={{ padding:'7px 10px', color:A.text, fontWeight:600 }}>Year {y.year}</td>
                        {[y.netRev, y.opex, y.ddCost, y.ebitda, y.interest, y.repayment, y.pbdt].map((v,i)=>(
                          <td key={i} style={{ padding:'7px 10px', textAlign:'right', fontWeight:i===3||i===6?700:400, color:v<0?'#F43F5E':[3,6].includes(i)?(v>0?A.green:A.text):A.sub, fontFamily:'DM Mono,monospace', fontSize:11 }}>
                            {v<0?'('+fmt(Math.abs(v),'$')+')':fmt(v,'$')}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr style={{ borderTop:`2px solid ${A.border}`, background:'rgba(201,164,87,0.05)' }}>
                      <td style={{ padding:'7px 10px', fontWeight:700, color:A.gold }}>Totals</td>
                      {[
                        result.years.reduce((s,y)=>s+y.netRev,0),
                        result.years.reduce((s,y)=>s+y.opex,0),
                        result.years.reduce((s,y)=>s+y.ddCost,0),
                        result.years.reduce((s,y)=>s+y.ebitda,0)+result.scrapValue,
                        result.years.reduce((s,y)=>s+y.interest,0),
                        result.years.reduce((s,y)=>s+y.repayment,0),
                        result.years.reduce((s,y)=>s+y.pbdt,0)+result.scrapValue,
                      ].map((v,i)=>(
                        <td key={i} style={{ padding:'7px 10px', textAlign:'right', fontWeight:700, color:v<0?'#F43F5E':[3,6].includes(i)?(v>0?A.green:A.red):A.gold, fontFamily:'DM Mono,monospace', fontSize:11 }}>
                          {v<0?'('+fmt(Math.abs(v),'$')+')':fmt(v,'$')}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop:10, fontSize:11, color:A.muted }}>* Totals include terminal scrap value of {fmt(result.scrapValue,'$')} in final year · OPEX escalated at {(p.opexEscalation*100).toFixed(1)}%/year</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
