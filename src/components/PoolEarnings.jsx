import { useState, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts'
import { POOL_EARNINGS } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, GoldButton, Badge, tooltipStyle } from './ui.jsx'

// ─── CSV PARSER — Maersk Tankers / Hafnia format ─────────────────────────────
function parsePoolCSV(text, pool) {
  const lines = text.trim().split('\n').map(l => l.split(',').map(c => c.replace(/"/g,'').trim()))
  const result = { pool, rows:[], raw:lines }

  // Auto-detect Maersk Tankers format
  // Expected columns: Vessel, Period, Gross Earnings, Deductions, Net Earnings, Pool Points, TCE
  const header = lines[0].map(h => h.toLowerCase())
  const colIdx = (names) => names.map(n => header.findIndex(h => h.includes(n))).find(i => i >= 0) ?? -1

  const vesselCol  = colIdx(['vessel','ship'])
  const periodCol  = colIdx(['period','month'])
  const grossCol   = colIdx(['gross'])
  const dedCol     = colIdx(['deduction','commission'])
  const netCol     = colIdx(['net earnings','net income'])
  const ptsCol     = colIdx(['pool point','points'])
  const tceCol     = colIdx(['tce','time charter'])

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i]
    if (!row[0] || row.every(c => !c)) continue
    result.rows.push({
      vessel:         vesselCol  >= 0 ? row[vesselCol]  : `Vessel ${i}`,
      period:         periodCol  >= 0 ? row[periodCol]  : 'Unknown',
      grossEarnings:  grossCol   >= 0 ? parseFloat(row[grossCol]?.replace(/[$,]/g,'')) || 0 : 0,
      poolDeductions: dedCol     >= 0 ? parseFloat(row[dedCol]?.replace(/[$,]/g,'')) || 0 : 0,
      netEarnings:    netCol     >= 0 ? parseFloat(row[netCol]?.replace(/[$,]/g,'')) || 0 : 0,
      poolPoints:     ptsCol     >= 0 ? parseFloat(row[ptsCol]) || 0 : 0,
      tce:            tceCol     >= 0 ? parseFloat(row[tceCol]?.replace(/[$,]/g,'')) || 0 : 0,
    })
  }
  return result
}

// Trend data from seed
const trendData = [
  { period:'Jan-26', maersk:19800, hafnia:18900 },
  { period:'Feb-26', maersk:20400, hafnia:19200 },
  { period:'Mar-26', maersk:20700, hafnia:19400 },
  { period:'Apr-26', maersk:21280, hafnia:19940 },
]

export default function PoolEarnings() {
  const [earnings,  setEarnings]  = useState(POOL_EARNINGS)
  const [uploading, setUploading] = useState(false)
  const [parsed,    setParsed]    = useState(null)
  const [pool,      setPool]      = useState('maersk')
  const [dragOver,  setDragOver]  = useState(false)
  const [pdfFiles,  setPdfFiles]  = useState([])
  const [showApiDocs, setShowApiDocs] = useState(false)

  const totalNetMaersk = earnings.filter(e=>e.pool==='Maersk Tankers').reduce((s,e)=>s+e.netEarnings, 0)
  const totalNetHafnia  = earnings.filter(e=>e.pool==='Hafnia').reduce((s,e)=>s+e.netEarnings, 0)
  const avgTCE = Math.round(earnings.reduce((s,e)=>s+e.tce,0)/earnings.length)

  const handleCSV = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = e => {
      const result = parsePoolCSV(e.target.result, pool==='maersk'?'Maersk Tankers':'Hafnia')
      setParsed(result)
    }
    reader.readAsText(file)
  }, [pool])

  const handlePDF = useCallback((file) => {
    setPdfFiles(prev => [...prev, { name:file.name, size:(file.size/1024).toFixed(0)+'KB', date:new Date().toLocaleDateString(), pool:pool==='maersk'?'Maersk Tankers':'Hafnia' }])
  }, [pool])

  function onDrop(e, type) {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (!file) return
    if (type==='csv') handleCSV(file)
    else handlePDF(file)
  }

  function confirmUpload() {
    if (!parsed) return
    const newRows = parsed.rows.map((r,i) => ({
      id: `PE-${Date.now()}-${i}`,
      pool:          parsed.pool,
      vessel:        r.vessel,
      period:        r.period,
      grossEarnings: r.grossEarnings,
      poolDeductions:r.poolDeductions,
      netEarnings:   r.netEarnings || r.grossEarnings - r.poolDeductions,
      poolPoints:    r.poolPoints,
      tce:           r.tce,
      statement:     'Uploaded via CSV',
      uploadDate:    new Date().toISOString().split('T')[0],
    }))
    setEarnings(prev => [...newRows, ...prev])
    setParsed(null)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Summary hero */}
      <HeroCard>
        <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:'0.12em', marginBottom:14 }}>POOL EARNINGS — MONTHLY STATEMENT DATA</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:10 }}>
          {[
            { l:'Maersk Tankers Net (MTD)',  v:`$${(totalNetMaersk/1000).toFixed(0)}K`,  c:C.gold  },
            { l:'Hafnia Pool Net (Apr)',      v:`$${(totalNetHafnia/1000).toFixed(0)}K`,  c:C.blue  },
            { l:'Average Pool TCE',           v:`$${avgTCE.toLocaleString()}/day`,        c:C.green },
            { l:'Statements on File',         v:String(earnings.length),                  c:C.text  },
          ].map(k=>(
            <div key={k.l} style={{ background:'rgba(6,12,24,0.6)', borderRadius:10, padding:'12px 14px', border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5 }}>{k.l}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:k.c }}>{k.v}</div>
            </div>
          ))}
        </div>
      </HeroCard>

      {/* TCE trend */}
      <Card>
        <SectionLabel accent>Pool TCE Trend — Maersk Tankers vs Hafnia (USD/day)</SectionLabel>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trendData} margin={{top:4,right:8,left:-10,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="period" tick={{fill:C.textMuted,fontSize:11}}/>
            <YAxis tick={{fill:C.textMuted,fontSize:11}} tickFormatter={v=>'$'+v.toLocaleString()}/>
            <Tooltip {...tooltipStyle} formatter={v=>['$'+v.toLocaleString()+'/day']}/>
            <Line type="monotone" dataKey="maersk" stroke={C.gold}  strokeWidth={2.5} dot={{fill:C.gold,r:4}}  name="Maersk Tankers"/>
            <Line type="monotone" dataKey="hafnia"  stroke={C.blue}  strokeWidth={2.5} dot={{fill:C.blue,r:4}}  name="Hafnia Pool"/>
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Upload section */}
      <Card>
        <SectionLabel accent>Upload Pool Statement</SectionLabel>
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {[{k:'maersk',l:'Maersk Tankers'},{k:'hafnia',l:'Hafnia Pool'}].map(p=>(
            <button key={p.k} onClick={()=>setPool(p.k)} style={{
              flex:1, padding:'8px', borderRadius:8, fontSize:12, fontWeight:600,
              background:pool===p.k?C.card:'transparent',
              border:`1px solid ${pool===p.k?C.gold:C.border}`,
              color:pool===p.k?C.gold:C.textMuted, fontFamily:'inherit', cursor:'pointer',
            }}>{p.l}</button>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          {/* CSV drop */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:8 }}>CSV Statement (auto-parse)</div>
            <div onDrop={e=>onDrop(e,'csv')} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
              style={{ border:`2px dashed ${dragOver?C.gold:C.border}`, borderRadius:10, padding:'24px', textAlign:'center', cursor:'pointer', background:dragOver?C.goldGlow:'transparent' }}
              onClick={()=>document.getElementById('csv-input').click()}>
              <input id="csv-input" type="file" accept=".csv" style={{ display:'none' }} onChange={e=>e.target.files[0]&&handleCSV(e.target.files[0])}/>
              <div style={{ fontSize:24, marginBottom:8 }}>📊</div>
              <div style={{ fontSize:12, color:C.textSub }}>Drop CSV or click to browse</div>
              <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>Maersk & Hafnia CSV format supported</div>
            </div>
          </div>

          {/* PDF drop */}
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:8 }}>PDF Statement (archive)</div>
            <div onDrop={e=>onDrop(e,'pdf')} onDragOver={e=>{e.preventDefault();setDragOver(true)}} onDragLeave={()=>setDragOver(false)}
              style={{ border:`2px dashed ${dragOver?C.gold:C.border}`, borderRadius:10, padding:'24px', textAlign:'center', cursor:'pointer', background:dragOver?C.goldGlow:'transparent' }}
              onClick={()=>document.getElementById('pdf-input').click()}>
              <input id="pdf-input" type="file" accept=".pdf" style={{ display:'none' }} onChange={e=>e.target.files[0]&&handlePDF(e.target.files[0])}/>
              <div style={{ fontSize:24, marginBottom:8 }}>📄</div>
              <div style={{ fontSize:12, color:C.textSub }}>Drop PDF or click to browse</div>
              <div style={{ fontSize:10, color:C.textMuted, marginTop:4 }}>Stored as read-only archive</div>
            </div>
          </div>
        </div>

        {/* CSV preview */}
        {parsed && (
          <div style={{ background:C.cardAlt, borderRadius:10, padding:'14px', border:`1px solid ${C.green}44`, marginBottom:12 }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.green, marginBottom:10 }}>✓ CSV parsed — {parsed.rows.length} rows from {parsed.pool}</div>
            <div style={{ overflowX:'auto', marginBottom:12 }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                    {['Vessel','Period','Gross','Deductions','Net','Pool Points','TCE'].map(h=>(
                      <th key={h} style={{ padding:'6px 10px', textAlign:'left', color:C.textMuted, fontWeight:700, fontSize:10, textTransform:'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.map((r,i)=>(
                    <tr key={i} style={{ borderBottom:`1px solid ${C.border}22` }}>
                      <td style={{ padding:'7px 10px', color:C.text, fontWeight:500 }}>{r.vessel}</td>
                      <td style={{ padding:'7px 10px', color:C.textSub }}>{r.period}</td>
                      <td style={{ padding:'7px 10px', color:C.gold,  fontFamily:'DM Mono,monospace', fontSize:11 }}>${r.grossEarnings.toLocaleString()}</td>
                      <td style={{ padding:'7px 10px', color:C.red,   fontFamily:'DM Mono,monospace', fontSize:11 }}>${r.poolDeductions.toLocaleString()}</td>
                      <td style={{ padding:'7px 10px', color:C.green, fontFamily:'DM Mono,monospace', fontSize:11, fontWeight:700 }}>${(r.netEarnings||r.grossEarnings-r.poolDeductions).toLocaleString()}</td>
                      <td style={{ padding:'7px 10px', color:C.textSub }}>{r.poolPoints||'—'}</td>
                      <td style={{ padding:'7px 10px', color:C.textSub }}>{r.tce?'$'+r.tce.toLocaleString():'-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <GoldButton onClick={confirmUpload} style={{ flex:1, textAlign:'center' }}>✓ Confirm &amp; Add to Dashboard →</GoldButton>
              <button onClick={()=>setParsed(null)} style={{ padding:'8px 16px', background:'transparent', border:`1px solid ${C.border}`, borderRadius:6, color:C.textMuted, fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>Discard</button>
            </div>
          </div>
        )}

        {/* PDF archive */}
        {pdfFiles.length > 0 && (
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:8 }}>PDF Archive</div>
            {pdfFiles.map((f,i)=>(
              <div key={i} style={{ background:C.cardAlt, borderRadius:8, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6, border:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:20 }}>📄</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{f.name}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{f.pool} · {f.size} · Uploaded {f.date}</div>
                  </div>
                </div>
                <GoldButton outline style={{ fontSize:11 }}>View →</GoldButton>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Earnings history */}
      <Card>
        <SectionLabel accent>Earnings History — All Pool Statements</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {earnings.map(e=>(
            <div key={e.id} style={{ background:C.cardAlt, borderRadius:10, padding:'14px 16px', border:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:10 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:C.gold, fontFamily:'DM Mono,monospace' }}>{e.id}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:4, background:`${C.gold}18`, color:C.gold, border:`1px solid ${C.gold}33` }}>{e.pool}</span>
                    <span style={{ fontSize:11, color:C.textMuted }}>{e.period}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{e.vessel}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:C.green }}>${e.netEarnings.toLocaleString()}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>Net earnings · TCE ${e.tce.toLocaleString()}/day</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:8 }}>
                {[
                  {l:'Gross',       v:'$'+e.grossEarnings.toLocaleString(),  c:C.text },
                  {l:'Deductions',  v:'-$'+e.poolDeductions.toLocaleString(), c:C.red  },
                  {l:'Net Earnings',v:'$'+e.netEarnings.toLocaleString(),    c:C.green},
                  {l:'Pool Points', v:e.poolPoints,                           c:C.gold },
                ].map(m=>(
                  <div key={m.l} style={{ background:C.card, borderRadius:6, padding:'8px 10px' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>{m.l}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:m.c, fontFamily:'DM Mono,monospace' }}>{m.v}</div>
                  </div>
                ))}
              </div>
              {e.note && <div style={{ marginTop:8, fontSize:11, color:C.amber, fontStyle:'italic' }}>{e.note}</div>}
            </div>
          ))}
        </div>
      </Card>

      {/* Future API documentation */}
      <div style={{ background:C.cardAlt, border:`1px solid ${C.blue}33`, borderRadius:10, padding:'14px 18px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:showApiDocs?14:0 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:C.blue, marginBottom:2 }}>⊕ Future API Integration — Maersk Tankers &amp; Hafnia</div>
            <div style={{ fontSize:12, color:C.textMuted }}>When pool operators provide API access, replace manual upload with live data feed</div>
          </div>
          <GoldButton outline onClick={()=>setShowApiDocs(!showApiDocs)} style={{ flexShrink:0, fontSize:11 }}>
            {showApiDocs?'Hide':'View'} API Docs
          </GoldButton>
        </div>
        {showApiDocs && (
          <div style={{ background:C.card, borderRadius:8, padding:'14px', fontFamily:'DM Mono, monospace', fontSize:11, color:C.textSub, lineHeight:1.9 }}>
            <div style={{ color:C.gold, fontWeight:700, marginBottom:8 }}>// Step 1 — Obtain API credentials from pool operator</div>
            <div>// Maersk Tankers: Request API access via partner portal at partners.maersktankers.com</div>
            <div>// Hafnia: Request via commercial contact — API available for pool members</div>
            <div style={{ color:C.gold, fontWeight:700, marginTop:12, marginBottom:8 }}>// Step 2 — Add to .env</div>
            <div>VITE_MAERSK_POOL_API_KEY=your_key_here</div>
            <div>VITE_MAERSK_POOL_VESSEL_ID=your_vessel_id</div>
            <div>VITE_HAFNIA_POOL_API_KEY=your_key_here</div>
            <div style={{ color:C.gold, fontWeight:700, marginTop:12, marginBottom:8 }}>// Step 3 — Replace CSV upload with live fetch in src/lib/poolApi.js</div>
            <div>{'export async function fetchMaerskEarnings(vesselId, period) {'}</div>
            <div>{'  const res = await fetch('}</div>
            <div>{'    `https://api.maersktankers.com/v1/pool/earnings?vessel=${vesselId}&period=${period}`,'}</div>
            <div>{'    { headers: { Authorization: `Bearer ${import.meta.env.VITE_MAERSK_POOL_API_KEY}` } }'}</div>
            <div>{'  )'}</div>
            <div>{'  return res.json() // Returns same structure as CSV parser output'}</div>
            <div>{'}'}</div>
            <div style={{ color:C.green, marginTop:10 }}>// CSV structure remains as fallback — no other code changes needed</div>
          </div>
        )}
      </div>
    </div>
  )
}
