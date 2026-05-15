import { INSPECTIONS } from '../data/seed.js'
import { C, Card, SectionLabel, GoldButton, Badge, KpiCard, tooltipStyle } from './ui.jsx'

const TYPE_COL = { PSC:C.blue, SIRE:C.gold, 'Oil Major':C.green, Tank:C.amber }
const TYPE_ICON = { PSC:'🏛', SIRE:'🔍', 'Oil Major':'🛢', Tank:'⚗' }

export default function Inspections() {
  const psc   = INSPECTIONS.filter(i=>i.type==='PSC')
  const sire  = INSPECTIONS.filter(i=>i.type==='SIRE')
  const oilMaj= INSPECTIONS.filter(i=>i.type==='Oil Major')
  const tank  = INSPECTIONS.filter(i=>i.type==='Tank')

  const pscDefRate = ((psc.filter(i=>i.deficiencies>0).length / psc.length)*100).toFixed(0)
  const sireAvg    = (sire.reduce((s,i)=>s+(i.score||0),0) / sire.length).toFixed(0)
  const detained   = INSPECTIONS.filter(i=>i.detained).length

  const tankFailed = INSPECTIONS.filter(i=>i.type==='Tank' && i.result==='fail')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:10 }}>
        {[
          { label:'PSC Deficiency Rate',  value:pscDefRate+'%',            color: parseInt(pscDefRate)>30?C.red:C.green,   sub:psc.length+' PSC inspections' },
          { label:'SIRE Avg Score',       value:sireAvg+'/100',            color: parseInt(sireAvg)>=90?C.green:C.amber,   sub:sire.length+' SIRE inspections' },
          { label:'Vessels Detained',     value:String(detained),          color: detained>0?C.red:C.green,                sub:'Year to date' },
          { label:'Oil Major Approved',   value:String(oilMaj.filter(i=>i.result==='pass').length)+'/'+oilMaj.length, color:C.gold, sub:'Vetting approvals' },
          { label:'Tank Inspections',     value:String(tank.length),       color:C.text,                                   sub:tankFailed.length+' rejection(s)' },
        ].map(k=>(
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'16px 18px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textMuted, letterSpacing:'0.09em', textTransform:'uppercase', marginBottom:8 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:600, color:k.color, lineHeight:1.1 }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tank rejection alert */}
      {tankFailed.length > 0 && (
        <div style={{ background:C.amberDim, border:`1px solid ${C.amber}44`, borderRadius:10, padding:'14px 18px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.amber, marginBottom:6 }}>⚠ Tank Inspection Rejection — Action Required</div>
          {tankFailed.map(t=>(
            <div key={t.id} style={{ fontSize:13, color:C.textSub }}>{t.vessel} — {t.tankResult}</div>
          ))}
        </div>
      )}

      {/* Inspections by type */}
      {[
        { type:'PSC', label:'Port State Control Inspections', desc:'Mandatory flag-state authority inspections at ports. Deficiencies can lead to detention.' },
        { type:'SIRE', label:'SIRE Vetting Inspections', desc:'OCIMF Ship Inspection Report Programme — required by oil majors before loading.' },
        { type:'Oil Major', label:'Oil Major Vetting', desc:'Shell, BP, Aramco vetting approvals — required to trade with major charterers.' },
        { type:'Tank', label:'Tank Inspections — Cleaning &amp; Rejection Log', desc:'Pre-cargo tank inspections. Rejections require cleaning and re-inspection before loading.' },
      ].map(section => {
        const items = INSPECTIONS.filter(i => i.type === section.type)
        const col = TYPE_COL[section.type] || C.gold
        return (
          <Card key={section.type} accent={col}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <span style={{ fontSize:20 }}>{TYPE_ICON[section.type]}</span>
              <SectionLabel accent={false}><span style={{ fontSize:13, fontWeight:700, color:C.text }}>{section.label}</span></SectionLabel>
            </div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:14 }}>{section.desc}</div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                    {['Vessel','Port','Authority','Date','Result',section.type==='SIRE'||section.type==='Oil Major'?'Score':'Deficiencies','Next Due'].map(h=>(
                      <th key={h} style={{ padding:'8px 10px', textAlign:'left', color:C.textMuted, fontWeight:700, fontSize:11, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map(ins=>(
                    <tr key={ins.id} style={{ borderBottom:`1px solid ${C.border}22` }}>
                      <td style={{ padding:'10px 10px', fontWeight:600, color:C.text, whiteSpace:'nowrap' }}>{ins.vessel.replace('MV ','')}</td>
                      <td style={{ padding:'10px 10px', color:C.textSub }}>{ins.port}</td>
                      <td style={{ padding:'10px 10px', color:C.textMuted, fontSize:12 }}>{ins.authority}</td>
                      <td style={{ padding:'10px 10px', color:C.textMuted, fontFamily:'DM Mono,monospace', fontSize:12 }}>{ins.date}</td>
                      <td style={{ padding:'10px 10px' }}>
                        <Badge status={ins.result} label={ins.result==='pass'?'✓ Pass':'✗ Fail/Rejected'}/>
                      </td>
                      <td style={{ padding:'10px 10px', fontWeight:700, color: (ins.deficiencies||0)>2 ? C.red : (ins.deficiencies||0)>0 ? C.amber : C.green }}>
                        {section.type==='SIRE'||section.type==='Oil Major' ? (ins.score ? ins.score+'/100' : '—') : (ins.deficiencies ?? '—')}
                      </td>
                      <td style={{ padding:'10px 10px', fontSize:12, color: ins.next?.includes('required') ? C.red : C.textMuted }}>{ins.next}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
