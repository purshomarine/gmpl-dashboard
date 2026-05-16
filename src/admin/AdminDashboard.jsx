import { useState, useEffect } from 'react'
import { supabase, DEMO_MODE } from '../lib/supabase.js'
import DealAnalyser from './DealAnalyser.jsx'
import FleetManager from './FleetManager.jsx'
import FileUpload   from './FileUpload.jsx'

const A = {
  bg:      '#060F1C',
  card:    '#0C1A2C',
  surface: '#101E30',
  border:  '#1A3050',
  gold:    '#C9A457',
  goldL:   '#E8C97A',
  green:   '#10D9A0',
  red:     '#F43F5E',
  amber:   '#F59E0B',
  blue:    '#3B9EFF',
  text:    '#F4F8FF',
  sub:     '#B0C8DC',
  muted:   '#6A8FAA',
}

const TABS = [
  { k:'deals',   l:'Deal Analyser',  icon:'◈', desc:'IRR calculator · Scenario comparison · Save to dashboard' },
  { k:'fleet',   l:'Fleet Manager',  icon:'⚓', desc:'Edit vessel data · Update positions & earnings' },
  { k:'upload',  l:'Data Upload',    icon:'⊕', desc:'Upload Excel template · Auto-populate dashboard' },
]

function LoginScreen({ onLogin }) {
  const [user, setUser]   = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')

  function attempt() {
    if (user === 'admin' && pass === 'admin') { onLogin(); return }
    setError('Invalid credentials. Use admin / admin for demo access.')
  }

  return (
    <div style={{ minHeight:'100vh', background:A.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ background:A.card, border:`1px solid ${A.border}`, borderRadius:16, padding:'40px 44px', width:380, boxShadow:'0 24px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:52, height:52, background:`linear-gradient(135deg,${A.gold},${A.goldL})`, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:22, color:A.bg, margin:'0 auto 16px' }}>G</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:A.text, marginBottom:4 }}>Goodearth Maritime</div>
          <div style={{ fontSize:12, color:A.muted, letterSpacing:'0.08em', textTransform:'uppercase' }}>Advisor Admin Portal</div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:A.muted, letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:6 }}>Username</label>
          <input value={user} onChange={e=>setUser(e.target.value)} placeholder="admin"
            style={{ width:'100%', background:A.surface, border:`1px solid ${A.border}`, borderRadius:8, color:A.text, padding:'11px 14px', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
          />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ fontSize:11, fontWeight:700, color:A.muted, letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:6 }}>Password</label>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="admin"
            onKeyDown={e=>e.key==='Enter'&&attempt()}
            style={{ width:'100%', background:A.surface, border:`1px solid ${A.border}`, borderRadius:8, color:A.text, padding:'11px 14px', fontSize:14, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
          />
        </div>
        {error && <div style={{ color:A.red, fontSize:12, marginBottom:14, textAlign:'center' }}>{error}</div>}
        <button onClick={attempt} style={{ width:'100%', background:`linear-gradient(135deg,${A.gold},${A.goldL})`, border:'none', borderRadius:8, color:A.bg, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
          Sign In →
        </button>
        <div style={{ marginTop:16, fontSize:11, color:A.muted, textAlign:'center' }}>Demo credentials: admin / admin</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [authed,  setAuthed]  = useState(() => sessionStorage.getItem('admin_authed') === 'yes')
  const [tab,     setTab]     = useState('deals')
  const [dbStatus,setDbStatus]= useState('checking')

  useEffect(() => {
    if (!authed) return
    if (DEMO_MODE) { setDbStatus('demo'); return }
    supabase.from('vessels').select('id', { count:'exact', head:true })
      .then(({ error }) => setDbStatus(error ? 'error' : 'connected'))
  }, [authed])

  function handleLogin() {
    sessionStorage.setItem('admin_authed','yes')
    setAuthed(true)
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_authed')
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={handleLogin}/>

  return (
    <div style={{ minHeight:'100vh', background:A.bg, fontFamily:"'DM Sans',sans-serif", color:A.text }}>

      {/* Header */}
      <div style={{ background:`linear-gradient(180deg,#0A1828,#0C1E34)`, borderBottom:`1px solid ${A.border}`, padding:'0 28px', height:58, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:34, height:34, background:`linear-gradient(135deg,${A.gold},${A.goldL})`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:15, color:A.bg }}>G</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:A.text }}>Goodearth Maritime</div>
            <div style={{ fontSize:10, color:A.muted, letterSpacing:'0.1em', textTransform:'uppercase' }}>Advisor Admin Portal</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:dbStatus==='connected'?'#0A2E22':dbStatus==='demo'?'#2E1A04':'#2E0A14', border:`1px solid ${dbStatus==='connected'?A.green:dbStatus==='demo'?A.amber:A.red}44`, borderRadius:20, padding:'4px 12px' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:dbStatus==='connected'?A.green:dbStatus==='demo'?A.amber:A.red, display:'inline-block' }}/>
            <span style={{ fontSize:10, fontWeight:700, color:dbStatus==='connected'?A.green:dbStatus==='demo'?A.amber:A.red, letterSpacing:'0.06em' }}>
              {dbStatus==='connected'?'SUPABASE LIVE':dbStatus==='demo'?'DEMO MODE':'DB ERROR'}
            </span>
          </div>
          <button onClick={()=>window.open('/','_blank')} style={{ background:'transparent', border:`1px solid ${A.border}`, color:A.muted, borderRadius:6, padding:'6px 12px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            View Dashboard ↗
          </button>
          <button onClick={handleLogout} style={{ background:'transparent', border:`1px solid ${A.border}`, color:A.muted, borderRadius:6, padding:'6px 12px', fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background:'#09131F', borderBottom:`1px solid ${A.border}`, padding:'0 28px', display:'flex', gap:4 }}>
        {TABS.map(t => {
          const active = tab === t.k
          return (
            <button key={t.k} onClick={()=>setTab(t.k)} style={{
              padding:'12px 20px', display:'flex', alignItems:'center', gap:8,
              borderBottom:active?`2px solid ${A.gold}`:'2px solid transparent',
              borderTop:'none', borderLeft:'none', borderRight:'none',
              background:'none', fontFamily:'inherit', cursor:'pointer',
              color:active?A.gold:A.muted, fontSize:13, fontWeight:active?600:400,
              transition:'color 0.15s',
            }}>
              <span style={{ fontSize:14, opacity:active?1:0.5 }}>{t.icon}</span>
              {t.l}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ padding:'24px 28px', maxWidth:1400, margin:'0 auto' }}>
        {tab==='deals'  && <DealAnalyser  A={A}/>}
        {tab==='fleet'  && <FleetManager  A={A}/>}
        {tab==='upload' && <FileUpload    A={A}/>}
      </div>
    </div>
  )
}
