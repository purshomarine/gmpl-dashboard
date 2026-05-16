import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { MARKET_DATA } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, GoldButton, tooltipStyle } from './ui.jsx'

// Simulated 30-day BDTI/BCTI/BDI trend data
const genTrend = (base, vol, n=30) => Array.from({length:n},(_,i)=>({
  day:`${i+1}`,
  v: Math.round(base + (Math.sin(i/3)+Math.cos(i/5)) * vol + (i*vol*0.03))
}))

const BDTI_TREND = genTrend(820, 40)
const BCTI_TREND = genTrend(690, 35)
const BDI_TREND  = genTrend(1750, 120)
const VLSFO_TREND= genTrend(595, 20)

const MARKET_REPORTS = [
  { id:'R001', title:'Maersk Tankers Pool Report — April 2026',     source:'Maersk Tankers',   date:'08 May 2026',  type:'Pool Statement',    tag:'pool',    summary:'MR TCE averaged $21,280/day in April. Pool points +3.2% vs March. Red Sea premium maintained.' },
  { id:'R002', title:'Gibson Shipbrokers — Weekly Tanker Report',    source:'Gibson & Co',      date:'12 May 2026',  type:'Weekly Report',     tag:'market',  summary:'MR markets firm on AG/East trade. VLSFO spread widening. Suez rerouting adding ~$4,500/day premium.' },
  { id:'R003', title:'Clarksons Shipping Intelligence — May 2026',   source:'Clarksons',        date:'01 May 2026',  type:'Monthly Report',    tag:'market',  summary:'Product tanker demand strong driven by refinery dislocation. MR spot rates expected to hold above $20K through Q3.' },
  { id:'R004', title:'Baltic Exchange Weekly — 9 May 2026',          source:'Baltic Exchange',  date:'09 May 2026',  type:'Market Data',       tag:'baltic',  summary:'BDTI rose 2.1% WoW. BCTI +1.8%. MR AG/Japan route TD12 assessed at $28.5/MT.' },
  { id:'R005', title:'Poten & Partners — Monthly Tanker Outlook',    source:'Poten & Partners', date:'05 May 2026',  type:'Monthly Report',    tag:'market',  summary:'Ongoing Red Sea disruptions supporting ton-mile demand. New delivery order book thin through 2027.' },
  { id:'R006', title:'UK P&I Club — War Risk Circular — May 2026',   source:'UK P&I Club',      date:'06 May 2026',  type:'Regulatory Circular',tag:'pi',     summary:'Red Sea / Gulf of Aden: Voluntary Reporting Area extended. Additional premium applicable for transits.' },
]

const TAG_COL = { pool:C.gold, market:C.blue, baltic:C.green, pi:C.red }

export default function MarketIntel() {
  const [activeIndex, setActiveIndex] = useState('bdti')
  const [filterTag,   setFilterTag]   = useState('all')

  const indices = [
    { k:'bdti',  l:'BDTI',   value:'854', delta:'+2.1%', color:C.gold,  data:BDTI_TREND },
    { k:'bcti',  l:'BCTI',   value:'712', delta:'+1.8%', color:C.green, data:BCTI_TREND },
    { k:'bdi',   l:'BDI',    value:'1,842',delta:'+3.2%',color:C.blue,  data:BDI_TREND  },
    { k:'vlsfo', l:'VLSFO',  value:'$612',delta:'+2.8%', color:C.amber, data:VLSFO_TREND},
  ]
  const active = indices.find(i=>i.k===activeIndex)
  const filteredReports = MARKET_REPORTS.filter(r => filterTag==='all' || r.tag===filterTag)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Market summary hero */}
      <HeroCard>
        <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:'0.12em', marginBottom:14 }}>LIVE MARKET INTELLIGENCE · 13 MAY 2026</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
          {MARKET_DATA.map(m=>(
            <div key={m.label} style={{ background:'rgba(6,12,24,0.6)', borderRadius:10, padding:'12px 14px', border:`1px solid ${m.warn?C.amber+'44':C.border}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:m.warn?C.amber:C.textMuted, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:5 }}>{m.label}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:m.warn?C.amber:C.text, lineHeight:1.2 }}>{m.value}</div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                <span style={{ fontSize:12, fontWeight:600, color:m.warn?C.amber:m.up?C.green:C.red }}>{m.delta}</span>
                <span style={{ fontSize:10, color:C.textMuted }}>{m.context}</span>
              </div>
            </div>
          ))}
        </div>
      </HeroCard>

      {/* Baltic indices charts */}
      <Card>
        <SectionLabel accent>Baltic Indices — 30 Day Trend</SectionLabel>
        <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' }}>
          {indices.map(idx=>(
            <button key={idx.k} onClick={()=>setActiveIndex(idx.k)} style={{
              padding:'7px 16px', borderRadius:8, fontSize:12, fontWeight:600,
              background:activeIndex===idx.k?idx.color+'22':'transparent',
              border:`1px solid ${activeIndex===idx.k?idx.color:C.border}`,
              color:activeIndex===idx.k?idx.color:C.textMuted,
              fontFamily:'inherit', cursor:'pointer', transition:'all 0.2s',
            }}>
              {idx.l} <span style={{ color:activeIndex===idx.k?idx.color:C.textMuted }}>{idx.value}</span>
              <span style={{ fontSize:10, marginLeft:4, color:C.green }}>{idx.delta}</span>
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={active.data} margin={{top:4,right:8,left:-18,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
            <XAxis dataKey="day" tick={{fill:C.textMuted,fontSize:10}} interval={4}/>
            <YAxis tick={{fill:C.textMuted,fontSize:10}}/>
            <Tooltip {...tooltipStyle} formatter={v=>[v, active.l]}/>
            <Line type="monotone" dataKey="v" stroke={active.color} strokeWidth={2.5} dot={false} name={active.l}/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop:8, fontSize:11, color:C.textMuted }}>
          Source: Baltic Exchange · Updated daily at 14:00 UTC · {active.l} = {active.k==='bdti'?'Baltic Dirty Tanker Index':active.k==='bcti'?'Baltic Clean Tanker Index':active.k==='bdi'?'Baltic Dry Index':'VLSFO bunker price Fujairah'}
        </div>
      </Card>

      {/* Currencies */}
      <Card>
        <SectionLabel accent>Currency Rates — Mid Market</SectionLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:8 }}>
          {[
            {pair:'USD / INR', rate:'₹83.42', chg:'+0.3%', up:false, note:'Remittance rate'},
            {pair:'USD / EUR', rate:'€0.924',  chg:'-0.2%', up:true,  note:'ECB reference'},
            {pair:'USD / SGD', rate:'S$1.344', chg:'+0.1%', up:false, note:'MAS reference'},
            {pair:'USD / AED', rate:'AED 3.671',chg:'Pegged',up:true, note:'Fixed peg'},
            {pair:'USD / GBP', rate:'£0.790',  chg:'+0.4%', up:false, note:'BoE mid-rate'},
            {pair:'EUR / INR', rate:'₹90.28',  chg:'+0.1%', up:false, note:'Cross rate'},
          ].map(c=>(
            <div key={c.pair} style={{ background:C.cardAlt, borderRadius:8, padding:'12px 14px', border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:4 }}>{c.pair}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.text, marginBottom:3 }}>{c.rate}</div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:10 }}>
                <span style={{ color:c.chg==='Pegged'?C.textMuted:c.up?C.green:C.red, fontWeight:600 }}>{c.chg}</span>
                <span style={{ color:C.textMuted }}>{c.note}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Market reports */}
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, flexWrap:'wrap', gap:10 }}>
          <SectionLabel accent>Market Reports & Circulars</SectionLabel>
          <div style={{ display:'flex', gap:6 }}>
            {['all','pool','market','baltic','pi'].map(t=>(
              <button key={t} onClick={()=>setFilterTag(t)} style={{
                padding:'4px 12px', borderRadius:6, fontSize:11, fontWeight:600,
                background:filterTag===t?(TAG_COL[t]||C.gold)+'22':'transparent',
                border:`1px solid ${filterTag===t?(TAG_COL[t]||C.gold):C.border}`,
                color:filterTag===t?(TAG_COL[t]||C.gold):C.textMuted,
                fontFamily:'inherit', cursor:'pointer',
              }}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filteredReports.map(r=>(
            <div key={r.id} style={{ background:C.cardAlt, borderRadius:10, padding:'14px 16px', border:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:10, marginBottom:8 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:`${TAG_COL[r.tag]||C.gold}20`, color:TAG_COL[r.tag]||C.gold, border:`1px solid ${TAG_COL[r.tag]||C.gold}33`, textTransform:'uppercase', letterSpacing:'0.05em' }}>{r.type}</span>
                    <span style={{ fontSize:11, color:C.textMuted }}>{r.date}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:2 }}>{r.title}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>Source: {r.source}</div>
                </div>
                <GoldButton outline style={{ flexShrink:0, fontSize:11 }}>View Report →</GoldButton>
              </div>
              <div style={{ fontSize:12, color:C.textSub, lineHeight:1.6 }}>{r.summary}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
