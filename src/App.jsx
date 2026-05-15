import { useState, lazy, Suspense } from 'react'
import { C } from './components/ui.jsx'
import { ALERTS } from './data/seed.js'

const Overview       = lazy(()=>import('./components/Overview.jsx'))
const FleetMap       = lazy(()=>import('./components/FleetMap.jsx'))
const Maritime       = lazy(()=>import('./components/Maritime.jsx'))
const Legal          = lazy(()=>import('./components/Legal.jsx'))
const Crewing        = lazy(()=>import('./components/Crewing.jsx'))
const RedFlags       = lazy(()=>import('./components/RedFlags.jsx'))
const Assumptions    = lazy(()=>import('./components/Assumptions.jsx'))
const ZohoConnector  = lazy(()=>import('./components/ZohoConnector.jsx'))
const ActiveDeals    = lazy(()=>import('./components/ActiveDeals.jsx'))
const HSE            = lazy(()=>import('./components/HSE.jsx'))
const Inspections    = lazy(()=>import('./components/Inspections.jsx'))
const GroupCompanies = lazy(()=>import('./components/GroupCompanies.jsx'))
const AIAssistant    = lazy(()=>import('./components/AIAssistant.jsx'))

// Tab groups keep the nav scannable
const TAB_GROUPS = [
  { label: null, tabs: [
    { k:'overview',   l:'Group Overview', icon:'⬡' },
    { k:'deals',      l:'Active Deals',   icon:'◈' },
    { k:'group',      l:'Group Companies',icon:'◎' },
  ]},
  { label: 'Maritime', tabs: [
    { k:'fleetmap',   l:'Fleet Map',      icon:'◉' },
    { k:'maritime',   l:'Fleet Status',   icon:'⚓' },
    { k:'crewing',    l:'Crewing',        icon:'◷' },
    { k:'inspections',l:'Inspections',    icon:'✦' },
    { k:'hse',        l:'HSE',            icon:'⊕' },
  ]},
  { label: 'Finance', tabs: [
    { k:'zoho',       l:'Zoho ERP',       icon:'⊞' },
    { k:'assumptions',l:'Scenario Mapper',icon:'⊟' },
  ]},
  { label: 'Risk', tabs: [
    { k:'legal',      l:'Legal & Risk',   icon:'⚖' },
    { k:'redflags',   l:'Red Flags',      icon:'⚑' },
  ]},
]

const ALL_TABS = TAB_GROUPS.flatMap(g => g.tabs)
const criticalCount = ALERTS.filter(a => a.level === 'critical').length

function Loader() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:300 }}>
      <div style={{ fontSize:13, color:C.textMuted, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ color:C.gold }}>✦</span> Loading…
      </div>
    </div>
  )
}

const SCREENS = {
  overview:    <Overview/>,
  deals:       <ActiveDeals/>,
  group:       <GroupCompanies/>,
  fleetmap:    <FleetMap/>,
  maritime:    <Maritime/>,
  crewing:     <Crewing/>,
  inspections: <Inspections/>,
  hse:         <HSE/>,
  zoho:        <ZohoConnector/>,
  assumptions: <Assumptions/>,
  legal:       <Legal/>,
  redflags:    <RedFlags/>,
}

export default function App() {
  const [tab,       setTab]       = useState('overview')
  const [alert,     setAlert]     = useState(true)
  const [assistant, setAssistant] = useState(false)

  return (
    <div style={{ background:C.bg, minHeight:'100vh', color:C.text }}>

      {/* Critical alert bar */}
      {alert && (
        <div style={{ background:`linear-gradient(90deg, #3D0A14, #5A0E1E)`, borderBottom:`1px solid ${C.red}44`, padding:'8px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span className="pulse-red" style={{ width:8, height:8, borderRadius:'50%', background:C.red, display:'inline-block', flexShrink:0 }}/>
            <span style={{ fontWeight:700, color:C.red, fontSize:12, letterSpacing:'0.04em', flexShrink:0 }}>CRITICAL</span>
            <span style={{ fontSize:13, color:'#FCA5A5' }}>MV Saffron Star — Safety Management Certificate expires in 11 days. Immediate Chairman approval required.</span>
          </div>
          <button onClick={()=>setAlert(false)} style={{ background:'none', border:'none', color:'#FCA5A5', fontSize:22, lineHeight:1, flexShrink:0 }}>×</button>
        </div>
      )}

      {/* Header */}
      <div style={{ background:`linear-gradient(180deg, #0A1C32 0%, #0C1E34 100%)`, borderBottom:`1px solid ${C.border}`, padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div className="glow-gold" style={{ width:38, height:38, background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:17, color:C.bg, flexShrink:0 }}>G</div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:C.text, letterSpacing:'0.03em' }}>Good Earth Maritime</div>
            <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:'0.12em', textTransform:'uppercase' }}>Chairman's Executive Intelligence Dashboard</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ fontSize:12, color:C.textMuted }}>13 May 2026 · 09:42 GST</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, background:C.greenDim, border:`1px solid ${C.green}44`, borderRadius:20, padding:'5px 14px' }}>
            <span className="pulse-green" style={{ width:6, height:6, borderRadius:'50%', background:C.green, display:'inline-block' }}/>
            <span style={{ fontSize:10, fontWeight:700, color:C.green, letterSpacing:'0.06em' }}>6 SYSTEMS LIVE</span>
          </div>
          <button onClick={()=>setAssistant(p=>!p)} style={{
            display:'flex', alignItems:'center', gap:7, position:'relative',
            background: assistant ? C.goldGlow : 'transparent',
            border:`1px solid ${assistant ? C.gold : C.border}`,
            borderRadius:20, padding:'7px 16px', color: assistant ? C.gold : C.textMuted,
            fontSize:12, fontWeight:600, transition:'all 0.2s', fontFamily:'inherit',
          }}>
            ✦ Assistant
            {criticalCount > 0 && (
              <span style={{ position:'absolute', top:-4, right:-4, width:16, height:16, borderRadius:'50%', background:C.red, fontSize:9, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{criticalCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Grouped tab navigation */}
      <div style={{ background:'#09131F', borderBottom:`1px solid ${C.border}`, padding:'0 24px', display:'flex', gap:0, overflowX:'auto', alignItems:'stretch' }}>
        {TAB_GROUPS.map((group, gi) => (
          <div key={gi} style={{ display:'flex', alignItems:'stretch', borderRight: gi < TAB_GROUPS.length-1 ? `1px solid ${C.border}22` : 'none', paddingRight: gi < TAB_GROUPS.length-1 ? 4 : 0, marginRight: gi < TAB_GROUPS.length-1 ? 4 : 0 }}>
            {group.tabs.map(t => {
              const isActive = tab === t.k
              return (
                <button key={t.k} onClick={()=>setTab(t.k)} style={{
                  padding:'0 14px', height:44,
                  borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
                  borderTop:'none', borderLeft:'none', borderRight:'none',
                  color: isActive ? C.gold : C.textMuted,
                  background:'none', fontFamily:'inherit',
                  fontSize:12, fontWeight: isActive ? 600 : 400,
                  letterSpacing:'0.02em', whiteSpace:'nowrap', cursor:'pointer',
                  transition:'color 0.15s',
                  display:'flex', alignItems:'center', gap:6,
                }}>
                  <span style={{ fontSize:12, opacity: isActive ? 1 : 0.5 }}>{t.icon}</span>
                  {t.l}
                  {(t.k === 'redflags') && criticalCount > 0 && (
                    <span style={{ background:C.red, color:'#fff', fontSize:9, fontWeight:700, padding:'1px 5px', borderRadius:10, marginLeft:2 }}>{criticalCount}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:'22px 24px', maxWidth:1440, margin:'0 auto', paddingRight: assistant ? 430 : 24, transition:'padding-right 0.3s' }}>
        <Suspense fallback={<Loader/>}>
          {SCREENS[tab]}
        </Suspense>
      </div>

      {/* AI Assistant */}
      {assistant && (
        <Suspense fallback={null}>
          <AIAssistant onClose={()=>setAssistant(false)}/>
        </Suspense>
      )}
    </div>
  )
}
