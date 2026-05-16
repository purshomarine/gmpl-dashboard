import { useState, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { supabase, DEMO_MODE } from '../lib/supabase.js'

const EXPECTED_SHEETS = [
  { tab:'01 Fleet Register',       label:'Fleet Register',      required:true  },
  { tab:'02 Vessel Operations',    label:'Vessel Operations',   required:true  },
  { tab:'03 Crew (Masters)',        label:'Crew Roster',         required:false },
  { tab:'04 Certificates',         label:'Certificates',        required:false },
  { tab:'05 Technical Defects',    label:'Technical Defects',   required:false },
  { tab:'06 Financials',           label:'Monthly Financials',  required:true  },
  { tab:'07 Legal Matters',        label:'Legal Matters',       required:false },
  { tab:'08 Active Deals',         label:'Active Deals',        required:false },
  { tab:'09 Inspections',          label:'Inspections',         required:false },
  { tab:'10 HSE',                  label:'HSE Incidents',       required:false },
  { tab:'11 Nura Shipco Charters', label:'Nura Shipco Charters',required:false },
]

function sheetToRows(wb, tabName, headerRow=3) {
  const sheet = wb.Sheets[tabName]
  if (!sheet) return []
  const data = XLSX.utils.sheet_to_json(sheet, { header:1, defval:'' })
  if (data.length <= headerRow) return []
  const headers = data[headerRow-1].map(h => String(h||'').trim())
  return data.slice(headerRow).filter(row => row.some(c=>c!=='')).map(row => {
    const obj = {}
    headers.forEach((h,i) => { if(h) obj[h] = row[i] ?? '' })
    return obj
  })
}

function mapVessels(rows) {
  return rows.filter(r=>r['Vessel Name']).map(r => ({
    id: 'V' + String(r['IMO Number'] || Math.random().toString(36).slice(2,8)).replace(/\D/g,'').slice(0,6),
    name: r['Vessel Name'], type: r['Vessel Type'], flag: r['Flag State'],
    class_society: r['Classification'], dwt: parseInt(r['DWT'])||0,
    built: parseInt(r['Year Built'])||0, imo: String(r['IMO Number']||''),
    updated_at: new Date().toISOString(),
  }))
}

function mapOperations(rows) {
  return rows.filter(r=>r['Vessel Name']).map(r => ({
    name:            r['Vessel Name'],
    position:        r['Current Position']||'',
    route:           r['Current Route / Voyage']||'',
    commercial_mode: (r['Charter Type']||'').toLowerCase().includes('pool')?'pool':(r['Charter Type']||'').toLowerCase().includes('bareboat')?'bbc':(r['Charter Type']||'').toLowerCase().includes('idle')?'captive':'tc',
    charterer:       r['Charterer Name']||'',
    day_rate:        parseFloat(r['Day Rate (USD/day)'])||0,
    utilisation:     parseFloat(r['Utilisation % (MTD)'])||0,
    target_util:     parseFloat(r['Target Util %'])||85,
    pl_mtd:          parseFloat(r['P&L MTD (USD)'])||0,
    lat:             parseFloat(r['Latitude'])||null,
    lng:             parseFloat(r['Longitude'])||null,
    status:          parseFloat(r['Utilisation % (MTD)'])>=parseFloat(r['Target Util %']||85)?'green':parseFloat(r['Utilisation % (MTD)'])>=parseFloat(r['Target Util %']||85)-10?'amber':'red',
    updated_at:      new Date().toISOString(),
  }))
}

function mapFinancials(rows) {
  const months = ['Jun-25','Jul-25','Aug-25','Sep-25','Oct-25','Nov-25','Dec-25','Jan-26','Feb-26','Mar-26','Apr-26','May-26']
  const verticals = ['Ship Owning','Ship Management','River Barges','Ship Repairing']
  const result = []
  const revRows = rows.filter(r => String(r['Metric']||'').includes('Revenue'))
  const ebtRows = rows.filter(r => String(r['Metric']||'').includes('EBITDA'))
  verticals.forEach((vert, vi) => {
    const rev = revRows.find(r => String(r['Metric']||'').includes(vert.replace('Ship ','')))
    const ebt = ebtRows.find(r => String(r['Metric']||'').includes(vert.replace('Ship ','')))
    if (!rev && !ebt) return
    months.forEach(m => {
      result.push({
        period: m,
        period_date: null,
        vertical: vert,
        revenue:  parseFloat(rev?.[m]||0)*1000 || 0,
        ebitda:   parseFloat(ebt?.[m]||0)*1000 || 0,
      })
    })
  })
  return result
}

function mapDeals(rows) {
  return rows.filter(r=>r['Deal Name']).map(r => ({
    deal_name:          r['Deal Name'],
    acquisition_cost:   parseFloat(r['Deal Size (USD)'])||0,
    equity_amount:      parseFloat(r['Equity Required (USD)'])||0,
    loan_ltv:           parseFloat(String(r['Leverage %']||'').replace('%',''))/100||0.7,
    project_irr:        parseFloat(String(r['Project IRR %']||'').replace('%',''))/100||null,
    equity_irr:         parseFloat(String(r['Equity IRR %']||'').replace('%',''))/100||null,
    stage:              r['Deal Stage']||'Origination',
    status:             (r['Status']||'pipeline').toLowerCase(),
    counterparty:       r['Counterparty']||'',
    purpose:            r['Deal Purpose']||'',
  }))
}

export default function FileUpload({ A }) {
  const [file,     setFile]    = useState(null)
  const [preview,  setPreview] = useState(null)
  const [uploading,setUploading]=useState(false)
  const [result,   setResult]  = useState(null)
  const [dragging, setDragging]=useState(false)

  const processFile = useCallback((f) => {
    setFile(f); setResult(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type:'array' })
        const sheets = {}
        const found = []
        const missing = []
        EXPECTED_SHEETS.forEach(s => {
          if (wb.SheetNames.includes(s.tab)) {
            const rows = sheetToRows(wb, s.tab)
            sheets[s.tab] = rows
            found.push({ ...s, rows: rows.length })
          } else {
            missing.push(s)
          }
        })
        setPreview({ wb, sheets, found, missing, fileName:f.name })
      } catch (err) {
        setResult({ error: 'Could not read file: ' + err.message })
      }
    }
    reader.readAsArrayBuffer(f)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  async function upload() {
    if (!preview) return
    setUploading(true)
    const log = { vessels:0, operations:0, financials:0, deals:0, errors:[] }
    try {
      const { wb, sheets } = preview

      // Vessels + Operations
      if (sheets['01 Fleet Register'] && sheets['02 Vessel Operations']) {
        const vessels = mapVessels(sheets['01 Fleet Register'])
        const ops     = mapOperations(sheets['02 Vessel Operations'])
        // Merge
        const merged = vessels.map(v => {
          const op = ops.find(o => o.name === v.name) || {}
          return { ...v, ...op, name:v.name }
        })
        if (!DEMO_MODE && supabase) {
          const { error } = await supabase.from('vessels').upsert(merged)
          if (error) log.errors.push('Vessels: ' + error.message)
          else log.vessels = merged.length
        } else { log.vessels = merged.length }
      }

      // Financials
      if (sheets['06 Financials']) {
        const rows = mapFinancials(sheets['06 Financials'])
        if (!DEMO_MODE && supabase) {
          for (const chunk of [rows.slice(0,20), rows.slice(20,40), rows.slice(40)].filter(c=>c.length)) {
            const { error } = await supabase.from('monthly_financials').upsert(chunk, { onConflict:'period,vertical' })
            if (error) log.errors.push('Financials: ' + error.message)
          }
          log.financials = rows.length
        } else { log.financials = rows.length }
      }

      // Deals
      if (sheets['08 Active Deals']) {
        const rows = mapDeals(sheets['08 Active Deals'])
        if (!DEMO_MODE && supabase) {
          const { error } = await supabase.from('deals').insert(rows)
          if (error) log.errors.push('Deals: ' + error.message)
          else log.deals = rows.length
        } else { log.deals = rows.length }
      }

      // Log the upload
      if (!DEMO_MODE && supabase) {
        await supabase.from('upload_log').insert({
          filename: preview.fileName,
          rows_vessels: log.vessels,
          rows_ops: log.operations,
          rows_deals: log.deals,
          status: log.errors.length ? 'partial' : 'success',
          notes: log.errors.join('; '),
        })
      }

      setResult(log)
    } catch (err) {
      setResult({ error: err.message })
    }
    setUploading(false)
  }

  return (
    <div style={{ maxWidth:900 }}>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:A.text, marginBottom:4 }}>Data Upload</div>
      <div style={{ fontSize:13, color:A.muted, marginBottom:20 }}>Upload the Goodearth data template. The system parses each tab and pushes data directly to Supabase. The Chairman's dashboard updates in real time.</div>

      {/* Drop zone */}
      <div onDrop={onDrop} onDragOver={e=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)}
        style={{ border:`2px dashed ${dragging?A.gold:A.border}`, borderRadius:14, padding:'40px 24px', textAlign:'center', background:dragging?'rgba(201,164,87,0.05)':'transparent', transition:'all 0.2s', marginBottom:16, cursor:'pointer' }}
        onClick={()=>document.getElementById('file-input').click()}>
        <input id="file-input" type="file" accept=".xlsx,.xls" style={{ display:'none' }} onChange={e=>e.target.files[0]&&processFile(e.target.files[0])}/>
        <div style={{ fontSize:32, marginBottom:12 }}>📊</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, color:A.text, marginBottom:8 }}>
          {file ? file.name : 'Drop GMPL Data Template here or click to browse'}
        </div>
        <div style={{ fontSize:12, color:A.muted }}>Accepts GMPL_Data_Template.xlsx · All 11 tabs supported</div>
      </div>

      {/* Preview */}
      {preview && (
        <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:12, padding:'20px', marginBottom:16 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:A.gold, marginBottom:14 }}>File Parsed — Preview</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:8, marginBottom:16 }}>
            {preview.found.map(s=>(
              <div key={s.tab} style={{ background:'#0A1828', borderRadius:8, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', border:`1px solid ${A.green}33` }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:A.text }}>{s.label}</div>
                  <div style={{ fontSize:11, color:A.muted }}>{s.rows} data rows found</div>
                </div>
                <span style={{ color:A.green, fontSize:16 }}>✓</span>
              </div>
            ))}
            {preview.missing.map(s=>(
              <div key={s.tab} style={{ background:'#0A1828', borderRadius:8, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', border:`1px solid ${s.required?A.red:A.border}33`, opacity:0.6 }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:A.text }}>{s.label}</div>
                  <div style={{ fontSize:11, color:s.required?A.red:A.muted }}>{s.required?'Required tab missing':'Optional — skipped'}</div>
                </div>
                <span style={{ color:s.required?A.red:A.muted, fontSize:16 }}>{s.required?'✗':'—'}</span>
              </div>
            ))}
          </div>
          <button onClick={upload} disabled={uploading||preview.missing.some(s=>s.required)} style={{
            padding:'13px 32px', background:`linear-gradient(135deg,${A.gold},${A.goldL})`,
            border:'none', borderRadius:8, color:A.bg, fontSize:14, fontWeight:700,
            cursor:uploading?'not-allowed':'pointer', fontFamily:'inherit',
          }}>
            {uploading ? '⟳ Uploading to Supabase…' : '⊕ Push to Dashboard →'}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ background:result.error?'#3A0A14':A.greenDim, border:`1px solid ${result.error?A.red:A.green}44`, borderRadius:12, padding:'16px 20px' }}>
          {result.error ? (
            <div style={{ color:A.red, fontSize:13 }}>⚠ Upload failed: {result.error}</div>
          ) : (
            <>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:A.green, marginBottom:10 }}>✓ Upload Complete</div>
              <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
                {[{l:'Vessels Updated',v:result.vessels},{l:'Financials Updated',v:result.financials},{l:'Deals Added',v:result.deals}].map(r=>(
                  <div key={r.l}>
                    <div style={{ fontSize:22, fontWeight:700, color:A.green, fontFamily:"'Playfair Display',serif" }}>{r.v}</div>
                    <div style={{ fontSize:11, color:A.muted }}>{r.l}</div>
                  </div>
                ))}
              </div>
              {DEMO_MODE && <div style={{ marginTop:10, fontSize:12, color:A.amber }}>Demo mode: data processed in browser only. Add Supabase credentials to .env to persist.</div>}
              {result.errors?.length>0 && <div style={{ marginTop:10, fontSize:12, color:A.amber }}>Partial errors: {result.errors.join(' · ')}</div>}
            </>
          )}
        </div>
      )}

      {/* Instructions */}
      <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:12, padding:'20px', marginTop:16 }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, color:A.gold, marginBottom:12 }}>How it works</div>
        {[
          ['1. Download the template', 'Use the GMPL_Data_Template.xlsx provided. Fill in all blue cells.'],
          ['2. Add vessel coordinates', 'Tab 02 columns Q & R: look up each vessel on MarineTraffic.com (free) and enter lat/long.'],
          ['3. Upload here',           'Drag & drop or browse. The system validates all tabs before uploading.'],
          ['4. Review preview',        'Confirm row counts match expectations before pushing to the database.'],
          ['5. Push to dashboard',     "Click 'Push to Dashboard'. All charts, KPIs, and fleet maps update within seconds."],
        ].map(([step,desc])=>(
          <div key={step} style={{ display:'flex', gap:14, marginBottom:10 }}>
            <span style={{ fontSize:12, fontWeight:700, color:A.gold, minWidth:160, flexShrink:0 }}>{step}</span>
            <span style={{ fontSize:12, color:A.sub }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
