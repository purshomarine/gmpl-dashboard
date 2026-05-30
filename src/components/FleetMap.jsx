import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { VESSELS } from '../data/seed.js'
import { C, Card, SectionLabel, GoldButton, StatusDot } from './ui.jsx'

const STATUS_COLOR = { green: C.green, amber: C.amber, red: C.red }

function vesselIcon(status, laid_up) {
  const col = laid_up ? '#666' : STATUS_COLOR[status] || C.textMuted
  const pulse = status === 'red' && !laid_up
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${col};border:2px solid ${C.bg};box-shadow:0 0 ${pulse?'10px':'6px'} ${col};position:relative">
      ${pulse ? `<div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${col};opacity:0.4;animation:pulse-red 1.5s infinite"></div>` : ''}
    </div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

// Ship route lines (simplified great-circle approximation)
const ROUTES = [
  { id:'V001', path:[[26.1,55.6],[25.5,55.4],[25.2,55.3]] },
  { id:'V002', path:[[29.5,32.5],[25.0,37.0],[20.5,37.8]] },
  { id:'V003', path:[[26.9,50.5],[27.0,51.5]] },
  { id:'V005', path:[[23.6,58.2],[21.5,62.0],[19.0,67.0],[18.9,72.8]] },
  { id:'V006', path:[[12.9,74.8],[12.5,68.0],[16.5,54.0],[22.0,39.0]] },
  { id:'V007', path:[[1.3,103.8],[5.0,106.0],[9.5,109.0]] },
  { id:'V008', path:[[13.1,80.3],[13.5,82.0]] },
]

function FitBounds({ vessels }) {
  const map = useMap()
  useEffect(() => {
    const latlngs = vessels.filter(v => v.lat && v.lng).map(v => [v.lat, v.lng])
    if (latlngs.length) map.fitBounds(latlngs, { padding: [40, 40] })
  }, [])
  return null
}

export default function FleetMap() {
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Legend + stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
        {[
          { label:'On Hire', value:'7 / 8', color:C.gold },
          { label:'Avg Utilisation', value:'82%', color:C.green },
          { label:'Fleet P&L MTD', value:'+$2.6M', color:C.green },
          { label:'Vessels in Distress', value:'0', color:C.textMuted },
          { label:'Open Defects', value:'27', color:C.amber },
        ].map(k => (
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 14px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:600, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Map */}
      <Card style={{ padding:0, overflow:'hidden', borderRadius:14 }}>
        <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <SectionLabel accent>Live Fleet Positions — AIS Data Feed</SectionLabel>
          <div style={{ display:'flex', gap:14, fontSize:11 }}>
            {[{c:C.green,l:'On hire — on target'},{c:C.amber,l:'Below target'},{c:C.red,l:'Requires attention'},{c:'#555',l:'Laid up'}].map(l=>(
              <span key={l.l} style={{ display:'flex', alignItems:'center', gap:5, color:C.textMuted }}>
                <span style={{ width:10, height:10, borderRadius:'50%', background:l.c, display:'inline-block', boxShadow:`0 0 6px ${l.c}` }}/>
                {l.l}
              </span>
            ))}
          </div>
        </div>
        <div style={{ height:480 }}>
          <MapContainer center={[20, 70]} zoom={4} style={{ height:'100%', width:'100%', background:'#060C18' }} zoomControl={true}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              subdomains="abcd"
              maxZoom={18}
            />
            <FitBounds vessels={VESSELS} />
            {ROUTES.map(r => {
              const v = VESSELS.find(v => v.id === r.id)
              if (!v) return null
              return (
                <Polyline key={r.id} positions={r.path}
                  pathOptions={{ color: STATUS_COLOR[v.status] || C.textMuted, weight:1.5, opacity:0.4, dashArray:'6 4' }}
                />
              )
            })}
            {VESSELS.map(v => (
              <Marker key={v.id} position={[v.lat, v.lng]} icon={vesselIcon(v.status, v.util === 0)} eventHandlers={{ click: () => setSelected(selected?.id===v.id?null:v) }}>
                <Popup>
                  <div style={{ minWidth:220, fontFamily:'DM Sans, sans-serif' }}>
                    <div style={{ fontWeight:700, fontSize:13, color:C.gold, marginBottom:6 }}>{v.name}</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 12px', fontSize:12 }}>
                      {[
                        ['Type', v.type], ['Flag', v.flag],
                        ['Position', v.pos], ['Route', v.route],
                        ['Utilisation', v.util + '% (tgt ' + v.target + '%)'],
                        ['P&L MTD', (v.pl>=0?'+':'')+'$'+(v.pl/1000).toFixed(0)+'K'],
                        ['Crew', v.crew + ' on board'],
                        ['Defects', v.defects + ' open'],
                        ['Day Rate', v.dayRate?'$'+v.dayRate.toLocaleString()+'/day':'Idle'],
                        ['IMO', v.imo],
                        ['Noon Position', v.latDisplay && v.lngDisplay ? v.latDisplay + ' / ' + v.lngDisplay : '—'],
                        ['VLSFO ROB', v.rob_vlsfo ? v.rob_vlsfo + ' MT' : '—'],
                        ['MDO ROB', v.rob_mdo ? v.rob_mdo + ' MT' : '—'],
                        ['Next Port', v.nextPort || '—'],
                        ['ETA', v.eta || '—'],
                        ['H&M Insurer', v.insurer_hm || '—'],
                        ['P&I Club', v.insurer_pi || '—'],
                        ['Insured Value', v.insured_value ? '$' + (v.insured_value/1e6).toFixed(1) + 'M' : '—'],
                      ].map(([k,val]) => (
                        <div key={k} style={{ display:'contents' }}>
                          <span style={{ color:'#7A95B8', fontWeight:500 }}>{k}</span>
                          <span style={{ color:'#EEF5FF' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:10, padding:'6px 10px', background:'rgba(201,164,87,0.1)', borderRadius:5, border:'1px solid rgba(201,164,87,0.3)', fontSize:11, color:C.gold, textAlign:'center', cursor:'pointer' }}>
                      ★ Generate Vessel Briefing →
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </Card>

      {/* Vessel quick-status grid */}
      <SectionLabel accent>Fleet Quick Status</SectionLabel>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:12 }}>
        {VESSELS.map(v => (
          <div key={v.id} onClick={() => setSelected(selected?.id===v.id?null:v)} style={{
            background:C.card, border:`1px solid ${selected?.id===v.id ? C.gold+'66' : C.border}`,
            borderLeft:`3px solid ${STATUS_COLOR[v.status]}`,
            borderRadius:10, padding:'14px 16px', cursor:'pointer',
            transition:'border-color 0.2s, box-shadow 0.2s',
            boxShadow: selected?.id===v.id ? `0 0 16px rgba(201,164,87,0.15)` : 'none',
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{v.name}</div>
                <div style={{ fontSize:11, color:C.textMuted }}>{v.type} · {v.flag}</div>
              </div>
              <StatusDot s={v.status} animate size={9}/>
            </div>
            <div style={{ fontSize:12, color:C.textSub, marginBottom:8 }}>{v.pos} · {v.route}</div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ flex:1, height:4, background:C.border, borderRadius:2 }}>
                <div style={{ width:`${v.util}%`, height:'100%', borderRadius:2, background:v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red, transition:'width 0.5s' }}/>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:v.util>=v.target?C.green:v.util>=v.target-10?C.amber:C.red, minWidth:30 }}>{v.util}%</span>
              <span style={{ fontSize:12, fontWeight:600, color:v.pl>=0?C.green:C.red, minWidth:60, textAlign:'right' }}>
                {v.pl>=0?'+':''}${(v.pl/1000).toFixed(0)}K
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
