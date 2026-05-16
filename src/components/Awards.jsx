import { useState, useMemo } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { AWARD_CRITERIA_MASTER, AWARD_CRITERIA_CREW, AWARD_NOMINEES } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, GoldButton, tooltipStyle } from './ui.jsx'

function calcTotal(nominee, criteria) {
  return criteria.reduce((s,c) => s + (nominee.scores[c.id] || 0), 0)
}
function calcMax(criteria) {
  return criteria.reduce((s,c) => s + c.weight, 0)
}

export default function Awards() {
  const [tab, setTab]           = useState('master')
  const [editNominee, setEdit]  = useState(null)
  const [nominees, setNominees] = useState(AWARD_NOMINEES)

  const criteria = tab === 'master' ? AWARD_CRITERIA_MASTER : AWARD_CRITERIA_CREW
  const maxScore = calcMax(criteria)

  const ranked = useMemo(() => {
    return nominees
      .filter(n => n.type === tab)
      .map(n => ({ ...n, total: calcTotal(n, criteria), pct: Math.round((calcTotal(n, criteria)/maxScore)*100) }))
      .sort((a,b) => b.total - a.total)
  }, [nominees, tab, criteria])

  const winner = ranked[0]

  function updateScore(nomineeId, criterionId, val) {
    setNominees(prev => prev.map(n =>
      n.id === nomineeId ? { ...n, scores: { ...n.scores, [criterionId]: Math.min(parseFloat(val)||0, criteria.find(c=>c.id===criterionId)?.weight||0) }} : n
    ))
  }

  const radarData = winner ? criteria.map(c => ({
    category: c.category.replace(' & ',' &\n').replace('Performance','Perf.').replace('Leadership','Lead.').replace('Management','Mgmt').replace('Compliance','Comp.').replace('Stewardship','Stwrd.'),
    [winner.name]: winner.scores[c.id] || 0,
    max: c.weight,
  })) : []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* Header */}
      <HeroCard>
        <div style={{ fontSize:10, fontWeight:700, color:C.gold, letterSpacing:'0.12em', marginBottom:14 }}>GOODEARTH MARITIME · ANNUAL EXCELLENCE AWARDS · 2026</div>
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          {[{k:'master',l:'Best Master of the Year'},{k:'crew',l:'Best Crew of the Year'}].map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{
              flex:1, padding:'10px', borderRadius:10, fontSize:13, fontWeight:600,
              background:tab===t.k?`linear-gradient(135deg,${C.gold},${C.goldL})`:'transparent',
              border:`1px solid ${tab===t.k?C.gold:C.border}`,
              color:tab===t.k?C.bg:C.textMuted, fontFamily:'inherit', cursor:'pointer',
            }}>{t.l}</button>
          ))}
        </div>
        {winner && (
          <div style={{ display:'flex', alignItems:'center', gap:16, background:'rgba(201,164,87,0.08)', borderRadius:12, padding:'16px 20px', border:`1px solid ${C.gold}33` }}>
            <div style={{ width:60, height:60, borderRadius:'50%', background:`linear-gradient(135deg,${C.gold},${C.goldL})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>🏆</div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:C.gold, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Current Leader</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:C.text, marginBottom:2 }}>{winner.name}</div>
              <div style={{ fontSize:12, color:C.textSub }}>{winner.vessel} · {winner.pct}% score ({winner.total}/{maxScore} points)</div>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:C.gold }}>{winner.pct}%</div>
              <div style={{ fontSize:11, color:C.textMuted }}>Overall score</div>
            </div>
          </div>
        )}
      </HeroCard>

      {/* Criteria */}
      <Card>
        <SectionLabel accent>Scoring Criteria — Industry Best Practice (OCIMF/INTERTANKO)</SectionLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {criteria.map(c=>(
            <div key={c.id} style={{ display:'flex', alignItems:'flex-start', gap:14, background:C.cardAlt, borderRadius:8, padding:'12px 14px', border:`1px solid ${C.border}` }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, color:C.gold, minWidth:48, textAlign:'center', flexShrink:0 }}>{c.weight}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:2 }}>{c.category}</div>
                <div style={{ fontSize:12, color:C.textMuted }}>{c.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ fontSize:11, color:C.textMuted, padding:'8px 14px' }}>
            Total: {maxScore} points · Minimum qualifying tenure: 4 months on Goodearth vessel in award year · Criteria based on OCIMF, INTERTANKO, and flag state best practice
          </div>
        </div>
      </Card>

      {/* Rankings + Radar */}
      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.2fr) minmax(0,1fr)', gap:14 }}>
        <Card>
          <SectionLabel accent>Rankings</SectionLabel>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {ranked.map((n,i)=>(
              <div key={n.id} style={{ background:i===0?`${C.gold}10`:C.cardAlt, borderRadius:10, padding:'14px 16px', border:`1px solid ${i===0?C.gold+'44':C.border}`, cursor:'pointer' }}
                onClick={()=>setEdit(editNominee?.id===n.id?null:n)}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:i===0?`linear-gradient(135deg,${C.gold},${C.goldL})`:C.card, border:`2px solid ${i===0?C.gold:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:i===0?C.bg:C.textMuted, flexShrink:0 }}>
                      {i===0?'🥇':i===1?'🥈':'🥉'}
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{n.name}</div>
                      <div style={{ fontSize:11, color:C.textMuted }}>{n.vessel}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:600, color:i===0?C.gold:C.text }}>{n.pct}%</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{n.total}/{maxScore} pts</div>
                  </div>
                </div>
                {/* Score bar */}
                <div style={{ height:6, background:C.border, borderRadius:3 }}>
                  <div style={{ width:`${n.pct}%`, height:'100%', borderRadius:3, background:i===0?C.gold:i===1?C.textSub:C.textMuted, transition:'width 0.5s' }}/>
                </div>
                {/* Edit scoring inline */}
                {editNominee?.id===n.id && (
                  <div style={{ marginTop:14, borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:C.gold, letterSpacing:'0.07em', textTransform:'uppercase', marginBottom:10 }}>Edit Scores</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {criteria.map(c=>(
                        <div key={c.id} style={{ background:C.card, borderRadius:6, padding:'8px 10px' }}>
                          <div style={{ fontSize:10, fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>{c.category} <span style={{ color:C.gold }}>/{c.weight}</span></div>
                          <input type="number" min={0} max={c.weight} value={n.scores[c.id]||0}
                            onChange={e=>updateScore(n.id, c.id, e.target.value)}
                            style={{ width:'100%', background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:5, color:C.text, padding:'6px 10px', fontSize:13, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionLabel accent>{winner?.name} — Performance Radar</SectionLabel>
          {winner && (
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={C.border}/>
                <PolarAngleAxis dataKey="category" tick={{fill:C.textMuted,fontSize:9,dy:2}}/>
                <Radar name="Max" dataKey="max" stroke={C.border} fill={C.border} fillOpacity={0.15}/>
                <Radar name={winner.name} dataKey={winner.name} stroke={C.gold} fill={C.gold} fillOpacity={0.3} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
          )}
          <div style={{ marginTop:8 }}>
            {criteria.map(c=>(
              <div key={c.id} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:`1px solid ${C.border}22`, fontSize:11 }}>
                <span style={{ color:C.textSub }}>{c.category}</span>
                <span style={{ color:C.gold, fontWeight:600 }}>{winner?.scores[c.id]||0}/{c.weight}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Note */}
      <div style={{ background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:8, padding:'12px 16px', fontSize:12, color:C.textMuted }}>
        ✦ Scores are advisory inputs — Chairman retains final decision on award. Criteria aligned to OCIMF TMSA, INTERTANKO best practice, and Goodearth internal standards. Minimum qualifying tenure 4 months in award year.
      </div>
    </div>
  )
}
