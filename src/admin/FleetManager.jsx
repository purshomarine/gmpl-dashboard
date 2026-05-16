import { useState, useEffect } from 'react'
import { supabase, DEMO_MODE } from '../lib/supabase.js'
import { VESSELS } from '../data/seed.js'

export default function FleetManager({ A }) {
  const [vessels, setVessels] = useState([])
  const [editing, setEditing] = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [tab,     setTab]     = useState('status') // 'status' | 'earnings'

  useEffect(() => {
    async function load() {
      if (!DEMO_MODE && supabase) {
        const { data, error } = await supabase.from('vessels').select('*').order('id')
        if (!error && data?.length) { setVessels(data); return }
      }
      setVessels(VESSELS.map(v => ({
        id:v.id, name:v.name, type:v.type, flag:v.flag,
        utilisation:v.util, target_util:v.target, status:v.status,
        position:v.pos, route:v.route, crew:v.crew, defects:v.defects,
        cert_status:v.certs, day_rate:v.dayRate, pl_mtd:v.pl,
        commercial_mode:v.commercialMode, pool_name:v.pool||v.poolName||'',
        charterer:v.charterer||'', lat:v.lat, lng:v.lng, note:v.note||'',
      })))
    }
    load()
  }, [])

  async function saveVessel(v) {
    setSaving(true)
    if (!DEMO_MODE && supabase) {
      const { error } = await supabase.from('vessels').upsert({ ...v, updated_at: new Date().toISOString() })
      setMsg(error ? `⚠ ${error.message}` : '✓ Saved to Supabase')
    } else {
      setVessels(p => p.map(x => x.id===v.id ? v : x))
      setMsg('✓ Updated in session (Demo mode)')
    }
    setSaving(false)
    setEditing(null)
    setTimeout(() => setMsg(''), 3000)
  }

  const inp = (label, field, type='text', opts={}) => {
    const v = editing[field] ?? ''
    return (
      <div style={{ marginBottom:12 }}>
        <label style={{ fontSize:10, fontWeight:700, color:A.muted, letterSpacing:'0.07em', textTransform:'uppercase', display:'block', marginBottom:5 }}>{label}</label>
        {opts.select ? (
          <select value={v} onChange={e => setEditing(p=>({...p,[field]:e.target.value}))}
            style={{ width:'100%', background:'#0A1828', border:`1px solid ${A.border}`, borderRadius:7, color:A.text, padding:'9px 12px', fontSize:13, fontFamily:'inherit', outline:'none' }}>
            {opts.select.map(o=><option key={o}>{o}</option>)}
          </select>
        ) : (
          <input type={type} value={v}
            onChange={e=>setEditing(p=>({...p,[field]:type==='number'?parseFloat(e.target.value)||0:e.target.value}))}
            style={{ width:'100%', background:'#0A1828', border:`1px solid ${A.border}`, borderRadius:7, color:A.text, padding:'9px 12px', fontSize:13, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
          />
        )}
      </div>
    )
  }

  const SC = { green:'#10D9A0', amber:'#F59E0B', red:'#F43F5E' }

  return (
    <div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:A.text, marginBottom:4 }}>Fleet Manager</div>
      <div style={{ fontSize:13, color:A.muted, marginBottom:20 }}>Update vessel status, positions, earnings, and utilisation. Changes reflect immediately on the Chairman's dashboard when Supabase is connected.</div>

      {msg && <div style={{ padding:'10px 16px', background:msg.startsWith('✓')?A.greenDim:'#3A0A14', border:`1px solid ${msg.startsWith('✓')?A.green:A.red}44`, borderRadius:8, fontSize:13, color:msg.startsWith('✓')?A.green:A.red, marginBottom:16 }}>{msg}</div>}

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {[{k:'status',l:'Vessel Status & Operations'},{k:'earnings',l:'Monthly Earnings'}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{
            padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:600, fontFamily:'inherit', cursor:'pointer',
            background:tab===t.k?A.card:'transparent', border:`1px solid ${tab===t.k?A.gold:A.border}`,
            color:tab===t.k?A.gold:A.muted, transition:'all 0.2s',
          }}>{t.l}</button>
        ))}
      </div>

      {tab==='status' && (
        <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:12, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${A.border}` }}>
                {['Vessel','Commercial','Position','Utilisation','P&L MTD','Status',''].map(h=>(
                  <th key={h} style={{ padding:'12px 14px', textAlign:'left', color:A.muted, fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vessels.map(v=>(
                <tr key={v.id} style={{ borderBottom:`1px solid ${A.border}22` }}>
                  <td style={{ padding:'12px 14px', fontWeight:600, color:A.text }}>{v.name}</td>
                  <td style={{ padding:'12px 14px', color:A.sub }}>
                    <div style={{ fontSize:12 }}>{v.commercial_mode?.toUpperCase()}</div>
                    <div style={{ fontSize:11, color:A.muted }}>{v.pool_name||v.charterer||'—'}</div>
                  </td>
                  <td style={{ padding:'12px 14px', color:A.sub, fontSize:12 }}>{v.position}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ fontWeight:700, color:(v.utilisation||0)>=(v.target_util||85)?A.green:(v.utilisation||0)>=(v.target_util||85)-10?A.amber:A.red }}>{v.utilisation}%</span>
                    <span style={{ color:A.muted, fontSize:11 }}> / {v.target_util}%</span>
                  </td>
                  <td style={{ padding:'12px 14px', fontWeight:700, color:(v.pl_mtd||0)>=0?A.green:A.red }}>
                    {(v.pl_mtd||0)>=0?'+':''}${Math.round((v.pl_mtd||0)/1000)}K
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:SC[v.status]||A.muted, display:'inline-block' }}/>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <button onClick={()=>setEditing({...v})} style={{ fontSize:11, color:A.gold, background:'transparent', border:`1px solid ${A.gold}44`, borderRadius:6, padding:'5px 12px', cursor:'pointer', fontFamily:'inherit' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='earnings' && (
        <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:12, padding:'18px', fontSize:13, color:A.muted }}>
          Vessel earnings waterfall (pool income, OPEX, interest, repayment) can be updated here once Supabase is connected. In demo mode, earnings are calculated from the Deal Analyser inputs in seed.js.
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position:'fixed', inset:0, background:'rgba(4,10,20,0.8)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:16, padding:'24px', width:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 60px rgba(0,0,0,0.7)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:600, color:A.text }}>{editing.name}</div>
              <button onClick={()=>setEditing(null)} style={{ background:'none', border:`1px solid ${A.border}`, color:A.muted, width:30, height:30, borderRadius:15, fontSize:18, cursor:'pointer', fontFamily:'inherit' }}>×</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 14px' }}>
              {inp('Position', 'position')}
              {inp('Route',    'route')}
              {inp('Utilisation %','utilisation','number')}
              {inp('Target Util %','target_util','number')}
              {inp('P&L MTD (USD)','pl_mtd','number')}
              {inp('Day Rate (USD/day)','day_rate','number')}
              {inp('Status','status',undefined,{select:['green','amber','red']})}
              {inp('Cert Status','cert_status',undefined,{select:['ok','warning','expired']})}
              {inp('Commercial Mode','commercial_mode',undefined,{select:['tc','pool','captive','spot']})}
              {inp('Pool Name','pool_name')}
              {inp('Charterer','charterer')}
              {inp('Latitude','lat','number')}
              {inp('Longitude','lng','number')}
              {inp('Open Defects','defects','number')}
            </div>
            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:10, fontWeight:700, color:A.muted, letterSpacing:'0.07em', textTransform:'uppercase', display:'block', marginBottom:5 }}>Note</label>
              <textarea value={editing.note||''} onChange={e=>setEditing(p=>({...p,note:e.target.value}))} rows={2}
                style={{ width:'100%', background:'#0A1828', border:`1px solid ${A.border}`, borderRadius:7, color:A.text, padding:'9px 12px', fontSize:12, fontFamily:'inherit', outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>saveVessel(editing)} disabled={saving} style={{ flex:1, background:`linear-gradient(135deg,${A.gold},${A.goldL})`, border:'none', borderRadius:8, color:A.bg, padding:'12px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
                {saving?'Saving…':'Save Changes →'}
              </button>
              <button onClick={()=>setEditing(null)} style={{ padding:'12px 20px', background:'transparent', border:`1px solid ${A.border}`, borderRadius:8, color:A.muted, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
