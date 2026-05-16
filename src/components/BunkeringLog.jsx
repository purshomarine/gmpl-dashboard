import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BUNKERING, VESSELS } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, GoldButton, Badge, tooltipStyle } from './ui.jsx'

const GRADES = ['VLSFO','ULSFO','MGO','MDO','LNG']
const SUPPLIERS = ['ENOC Marine','Saudi Aramco Bunkers','Peninsula Petroleum','Shell Marine','BP Marine','Total Marine Fuels','Vivo Energy']

const EMPTY_ENTRY = { vessel:'MT Prelude', date:'', port:'', grade:'VLSFO', qty:'', pricePerTon:'', supplier:'ENOC Marine', terms:'30 days net', quality:'ISO 8217 RMG380', notes:'' }

export default function BunkeringLog() {
  const [log,       setLog]      = useState(BUNKERING)
  const [showForm,  setShowForm] = useState(false)
  const [entry,     setEntry]    = useState({...EMPTY_ENTRY})
  const [filterV,   setFilterV]  = useState('all')

  const totalCost    = log.filter(b=>b.status==='completed').reduce((s,b)=>s+b.totalCost,0)
  const avgPrice     = Math.round(log.filter(b=>b.pricePerTon>0).reduce((s,b)=>s+b.pricePerTon,0) / log.filter(b=>b.pricePerTon>0).length)
  const totalQty     = log.reduce((s,b)=>s+b.qty,0)
  const upcoming     = log.filter(b=>b.status==='planned').length

  const vesselNames  = ['all', ...new Set(log.map(b=>b.vessel))]
  const filtered     = filterV==='all' ? log : log.filter(b=>b.vessel===filterV)

  const spendByVessel = VESSELS.filter(v=>v.id.startsWith('V')).map(v=>({
    name: v.name.replace('MT ',''),
    cost: Math.round(log.filter(b=>b.vessel===v.name&&b.status==='completed').reduce((s,b)=>s+b.totalCost,0)/1000),
  }))

  function addEntry() {
    if (!entry.date || !entry.port || !entry.qty) return
    const qty  = parseFloat(entry.qty)||0
    const price= parseFloat(entry.pricePerTon)||0
    setLog(prev=>[{
      id:`BNK-${Date.now()}`, ...entry, qty, pricePerTon:price,
      totalCost:qty*price, sampleRetained:true, status:'completed'
    }, ...prev])
    setEntry({...EMPTY_ENTRY}); setShowForm(false)
  }

  const inp = (label, field, type='text', opts={}) => (
    <div style={{ marginBottom:12 }}>
      <label style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:'0.07em', textTransform:'uppercase', display:'block', marginBottom:5 }}>{label}</label>
      {opts.select ? (
        <select value={entry[field]} onChange={e=>setEntry(p=>({...p,[field]:e.target.value}))}
          style={{ width:'100%', background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, padding:'9px 12px', fontSize:13, fontFamily:'inherit', outline:'none' }}>
          {opts.select.map(o=><option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={entry[field]} onChange={e=>setEntry(p=>({...p,[field]:e.target.value}))}
          placeholder={opts.placeholder}
          style={{ width:'100%', background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, padding:'9px 12px', fontSize:13, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
        />
      )}
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      <HeroCard>
        <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:'0.12em', marginBottom:14 }}>BUNKERING LOG · ALL VESSELS</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
          {[
            {l:'Total Bunker Spend YTD', v:`$${(totalCost/1000).toFixed(0)}K`,   c:C.gold  },
            {l:'Total Qty Lifted (MT)',  v:totalQty.toLocaleString()+'MT',        c:C.text  },
            {l:'Avg VLSFO Price',        v:`$${avgPrice}/MT`,                     c:C.amber },
            {l:'Upcoming Bunkerings',    v:String(upcoming),                      c:upcoming>0?C.amber:C.green },
          ].map(k=>(
            <div key={k.l} style={{ background:'rgba(6,12,24,0.6)', borderRadius:10, padding:'12px 14px', border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5 }}>{k.l}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
      </HeroCard>

      {/* Spend chart */}
      <Card>
        <SectionLabel accent>Bunker Spend by Vessel (YTD, USD '000)</SectionLabel>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={spendByVessel} margin={{top:0,right:8,left:-10,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="name" tick={{fill:C.textMuted,fontSize:11}}/>
            <YAxis tick={{fill:C.textMuted,fontSize:11}} tickFormatter={v=>'$'+v+'K'}/>
            <Tooltip {...tooltipStyle} formatter={v=>['$'+v+'K']}/>
            <Bar dataKey="cost" radius={[4,4,0,0]}>
              {spendByVessel.map((_,i)=><Cell key={i} fill={[C.gold,C.green,C.blue,C.amber][i%4]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Log header + add button */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {vesselNames.map(v=>(
            <button key={v} onClick={()=>setFilterV(v)} style={{
              padding:'5px 12px', borderRadius:6, fontSize:11, fontWeight:600,
              background:filterV===v?C.card:'transparent',
              border:`1px solid ${filterV===v?C.gold:C.border}`,
              color:filterV===v?C.gold:C.textMuted, fontFamily:'inherit', cursor:'pointer',
            }}>{v==='all'?'All Vessels':v.replace('MT ','')}</button>
          ))}
        </div>
        <GoldButton onClick={()=>setShowForm(!showForm)}>+ Log Bunkering</GoldButton>
      </div>

      {/* Add form */}
      {showForm && (
        <Card accent={C.gold}>
          <SectionLabel accent>New Bunkering Entry</SectionLabel>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0 14px' }}>
            {inp('Vessel',      'vessel',      'text', {select:VESSELS.filter(v=>v.id.startsWith('V')).map(v=>v.name)})}
            {inp('Date',        'date',        'date')}
            {inp('Port',        'port',        'text', {placeholder:'e.g. Fujairah'})}
            {inp('Fuel Grade',  'grade',       'text', {select:GRADES})}
            {inp('Quantity (MT)','qty',        'number',{placeholder:'e.g. 800'})}
            {inp('Price ($/MT)','pricePerTon', 'number',{placeholder:'e.g. 612'})}
            {inp('Supplier',    'supplier',    'text', {select:SUPPLIERS})}
            {inp('Payment Terms','terms',      'text', {placeholder:'e.g. 30 days net'})}
            {inp('Spec / Quality','quality',   'text', {placeholder:'ISO 8217 RMG380'})}
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:'0.07em', textTransform:'uppercase', display:'block', marginBottom:5 }}>Notes / Agreement Reference</label>
            <textarea value={entry.notes} onChange={e=>setEntry(p=>({...p,notes:e.target.value}))} rows={2}
              style={{ width:'100%', background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, padding:'9px 12px', fontSize:12, fontFamily:'inherit', outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
          </div>
          {/* Calculated total */}
          {entry.qty && entry.pricePerTon && (
            <div style={{ background:C.cardAlt, borderRadius:8, padding:'10px 14px', marginBottom:12, display:'flex', justifyContent:'space-between', fontSize:13 }}>
              <span style={{ color:C.textMuted }}>Estimated total cost</span>
              <span style={{ fontWeight:700, color:C.gold, fontFamily:"'Playfair Display',serif", fontSize:16 }}>
                ${(parseFloat(entry.qty)*parseFloat(entry.pricePerTon)).toLocaleString()}
              </span>
            </div>
          )}
          <div style={{ display:'flex', gap:10 }}>
            <GoldButton onClick={addEntry} style={{ flex:1, textAlign:'center', padding:'11px' }}>✓ Add to Log</GoldButton>
            <button onClick={()=>setShowForm(false)} style={{ padding:'11px 20px', background:'transparent', border:`1px solid ${C.border}`, borderRadius:8, color:C.textMuted, fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
          </div>
        </Card>
      )}

      {/* Log table */}
      <Card>
        <SectionLabel accent>Bunkering History</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(b=>(
            <div key={b.id} style={{ background:C.cardAlt, borderRadius:10, padding:'14px 16px', border:`1px solid ${b.status==='planned'?C.amber+'44':C.border}`, borderLeft:`3px solid ${b.status==='planned'?C.amber:b.grade==='VLSFO'?C.gold:C.blue}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:10 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:C.gold, fontFamily:'DM Mono,monospace' }}>{b.id}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:4, background:`${b.grade==='VLSFO'?C.gold:C.blue}18`, color:b.grade==='VLSFO'?C.gold:C.blue, border:`1px solid ${b.grade==='VLSFO'?C.gold:C.blue}33` }}>{b.grade}</span>
                    {b.status==='planned' && <Badge status="pending" label="Planned"/>}
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, color:C.text, marginBottom:2 }}>{b.vessel} — {b.port}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>{b.supplier} · {b.date} · {b.quality}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:b.totalCost>0?C.gold:C.textMuted }}>{b.totalCost>0?'$'+b.totalCost.toLocaleString():'TBD'}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>{b.qty} MT @ {b.pricePerTon>0?'$'+b.pricePerTon+'/MT':'TBD'}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <div style={{ background:C.card, borderRadius:5, padding:'4px 10px', fontSize:11, color:C.textSub }}>{b.terms}</div>
                {b.sampleRetained && <div style={{ background:C.greenDim, border:`1px solid ${C.green}33`, borderRadius:5, padding:'4px 10px', fontSize:11, color:C.green }}>✓ Sample retained</div>}
                {b.notes && <div style={{ background:C.card, borderRadius:5, padding:'4px 10px', fontSize:11, color:C.textMuted, fontStyle:'italic' }}>{b.notes}</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
