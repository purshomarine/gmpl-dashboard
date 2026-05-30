import { useState, useEffect, lazy, Suspense } from 'react'
import { C } from './components/ui.jsx'
import { ALERTS } from './data/seed.js'
import Sidebar from './components/Sidebar.jsx'
import { TAB_GROUPS } from './data/tabs.js'

const Overview      = lazy(()=>import('./components/Overview.jsx'))
const FleetMap      = lazy(()=>import('./components/FleetMap.jsx'))
const Maritime      = lazy(()=>import('./components/Maritime.jsx'))
const Legal         = lazy(()=>import('./components/Legal.jsx'))
const Crewing       = lazy(()=>import('./components/Crewing.jsx'))
const RedFlags      = lazy(()=>import('./components/RedFlags.jsx'))
const Assumptions   = lazy(()=>import('./components/Assumptions.jsx'))
const ZohoConnector = lazy(()=>import('./components/ZohoConnector.jsx'))
const ActiveDeals   = lazy(()=>import('./components/ActiveDeals.jsx'))
const HSE           = lazy(()=>import('./components/HSE.jsx'))
const Inspections   = lazy(()=>import('./components/Inspections.jsx'))
const GroupCompanies= lazy(()=>import('./components/GroupCompanies.jsx'))
const MarketIntel   = lazy(()=>import('./components/MarketIntel.jsx'))
const PoolEarnings  = lazy(()=>import('./components/PoolEarnings.jsx'))
const BunkeringLog  = lazy(()=>import('./components/BunkeringLog.jsx'))
const Awards        = lazy(()=>import('./components/Awards.jsx'))
const AIAssistant   = lazy(()=>import('./components/AIAssistant.jsx'))

const SCREENS = {
  overview:    <Overview/>,
  deals:       <ActiveDeals/>,
  group:       <GroupCompanies/>,
  fleetmap:    <FleetMap/>,
  maritime:    <Maritime/>,
  crewing:     <Crewing/>,
  inspections: <Inspections/>,
  hse:         <HSE/>,
  pool:        <PoolEarnings/>,
  bunker:      <BunkeringLog/>,
  awards:      <Awards/>,
  zoho:        <ZohoConnector/>,
  assumptions: <Assumptions/>,
  market:      <MarketIntel/>,
  legal:       <Legal/>,
  redflags:    <RedFlags/>,
}

const criticalCount = ALERTS.filter(a=>a.level==='critical').length

export default function App() {
  const [tab,              setTab]              = useState('overview')
  const [alert,            setAlert]            = useState(true)
  const [assistant,        setAssistant]        = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [now,              setNow]              = useState(new Date())

  useEffect(()=>{
    const t = setInterval(()=>setNow(new Date()), 60000)
    return ()=>clearInterval(t)
  },[])

  const dateStr = now.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})
  const timeStr = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})

  return (
    <div style={{ background:C.bg, minHeight:'100vh', color:C.text }}>

      <Sidebar
        activeTab={tab}
        onTabChange={setTab}
        actionItemCount={criticalCount}
        collapsed={sidebarCollapsed}
        onToggleCollapse={()=>setSidebarCollapsed(p=>!p)}
      />

      <div className={`app-shell${sidebarCollapsed?' app-shell--collapsed':''}`}>

        {alert && (
          <div style={{ background:`linear-gradient(90deg,#3D0A14,#5A0E1E)`, borderBottom:`1px solid ${C.red}44`, padding:'8px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span className="pulse-red" style={{ width:8,height:8,borderRadius:'50%',background:C.red,display:'inline-block',flexShrink:0 }}/>
              <span style={{ fontWeight:700,color:C.red,fontSize:12,letterSpacing:'0.04em',flexShrink:0 }}>CRITICAL</span>
              <span style={{ fontSize:13,color:'#FCA5A5' }}>MT Prelude — IOPP Certificate expires in 38 days. Renewal survey must be booked immediately.</span>
            </div>
            <button onClick={()=>setAlert(false)} style={{ background:'none',border:'none',color:'#FCA5A5',fontSize:22,lineHeight:1,flexShrink:0 }}>×</button>
          </div>
        )}

        <div style={{ background:`linear-gradient(180deg,#0A1C32,#0C1E34)`, borderBottom:`1px solid ${C.border}`, padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div className="glow-gold" style={{ width:38,height:38,background:`linear-gradient(135deg,${C.gold},${C.goldLight})`,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:17,color:C.bg,flexShrink:0 }}>G</div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:C.text,letterSpacing:'0.03em' }}>Goodearth Maritime</div>
              <div style={{ fontSize:10,fontWeight:700,color:C.textMuted,letterSpacing:'0.12em',textTransform:'uppercase' }}>Chairman's Executive Intelligence Dashboard</div>
            </div>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <div style={{ fontSize:12,color:C.textMuted }}>{dateStr} · {timeStr} GST</div>
            <div style={{ display:'flex',alignItems:'center',gap:6,background:C.greenDim,border:`1px solid ${C.green}44`,borderRadius:20,padding:'5px 14px' }}>
              <span className="pulse-green" style={{ width:6,height:6,borderRadius:'50%',background:C.green,display:'inline-block' }}/>
              <span style={{ fontSize:10,fontWeight:700,color:C.green,letterSpacing:'0.06em' }}>6 SYSTEMS LIVE</span>
            </div>
            <button onClick={()=>setAssistant(p=>!p)} style={{ display:'flex',alignItems:'center',gap:7,position:'relative',background:assistant?C.goldGlow:'transparent',border:`1px solid ${assistant?C.gold:C.border}`,borderRadius:20,padding:'7px 16px',color:assistant?C.gold:C.textMuted,fontSize:12,fontWeight:600,transition:'all 0.2s',fontFamily:'inherit',cursor:'pointer' }}>
              ✦ Assistant
              {criticalCount>0&&<span style={{ position:'absolute',top:-4,right:-4,width:16,height:16,borderRadius:'50%',background:C.red,fontSize:9,fontWeight:700,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center' }}>{criticalCount}</span>}
            </button>
          </div>
        </div>

        <div className="top-tabs" style={{ background:'#09131F',borderBottom:`1px solid ${C.border}`,padding:'0 24px',gap:0,overflowX:'auto',alignItems:'stretch' }}>
          {TAB_GROUPS.map((group,gi)=>(
            <div key={gi} style={{ display:'flex',alignItems:'stretch',borderRight:gi<TAB_GROUPS.length-1?`1px solid ${C.border}22`:'none',paddingRight:gi<TAB_GROUPS.length-1?4:0,marginRight:gi<TAB_GROUPS.length-1?4:0 }}>
              {group.tabs.map(t=>{
                const isActive=tab===t.k
                return (
                  <button key={t.k} onClick={()=>setTab(t.k)} style={{ padding:'0 12px',height:44,borderBottom:isActive?`2px solid ${C.gold}`:'2px solid transparent',borderTop:'none',borderLeft:'none',borderRight:'none',color:isActive?C.gold:C.textMuted,background:'none',fontFamily:'inherit',fontSize:11,fontWeight:isActive?600:400,letterSpacing:'0.02em',whiteSpace:'nowrap',cursor:'pointer',transition:'color 0.15s',display:'flex',alignItems:'center',gap:5 }}>
                    <span style={{ fontSize:11,opacity:isActive?1:0.5 }}>{t.icon}</span>{t.l}
                    {t.k==='redflags'&&criticalCount>0&&<span style={{ background:C.red,color:'#fff',fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:10,marginLeft:2 }}>{criticalCount}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{ padding:'20px 24px',maxWidth:1440,paddingRight:assistant?430:24,transition:'padding-right 0.3s' }}>
          <Suspense fallback={<div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:300,color:C.textMuted,fontSize:13 }}>✦ Loading…</div>}>
            {SCREENS[tab]}
          </Suspense>
        </div>

        {assistant&&<Suspense fallback={null}><AIAssistant onClose={()=>setAssistant(false)}/></Suspense>}

      </div>
    </div>
  )
}
