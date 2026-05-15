import { useState, useRef, useEffect } from 'react'
import { ACTION_ITEMS, TEAM, ALERTS } from '../data/seed.js'
import { C, Card, GoldButton, Badge, StatusDot, SectionLabel } from './ui.jsx'
import { chatWithAssistant, draftEmail } from '../lib/claude.js'

const SC = {open:C.blue, overdue:C.red, complete:C.green}

export default function AIAssistant({ onClose }) {
  const [tab,        setTab]     = useState('tasks')
  const [messages,   setMessages]= useState([{role:'assistant',content:"Good morning. I'm your executive intelligence assistant. I have access to GMPL's live dashboard — fleet status, financials, legal matters, and your action items. How can I assist you today?"}])
  const [input,      setInput]   = useState('')
  const [thinking,   setThinking]= useState(false)
  const [items,      setItems]   = useState(ACTION_ITEMS)
  const [composeTo,  setComposeTo]  = useState(null)
  const [composeSubj,setComposeSubj]= useState('')
  const [composeCtx, setComposeCtx] = useState('')
  const [draftText,  setDraftText]  = useState('')
  const [drafting,   setDrafting]   = useState(false)
  const bottomRef = useRef(null)

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}) }, [messages])

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = { role:'user', content:input }
    const newHist = [...messages, userMsg]
    setMessages(newHist); setInput(''); setThinking(true)
    const reply = await chatWithAssistant(messages, input)
    setMessages(p => [...p, {role:'assistant', content:reply}])
    setThinking(false)
  }

  async function handleDraftEmail() {
    if (!composeTo) return
    setDrafting(true)
    const recipient = TEAM.find(t=>t.id===composeTo)
    const txt = await draftEmail(recipient, composeSubj, composeCtx)
    setDraftText(txt); setDrafting(false)
  }

  function toggleItem(id) {
    setItems(p => p.map(i => i.id===id ? {...i, status:i.status==='complete'?'open':'complete'} : i))
  }

  const openItems   = items.filter(i=>i.status!=='complete')
  const closedItems = items.filter(i=>i.status==='complete')

  const TABS = [{k:'tasks',l:'Action Items'},{k:'chat',l:'Ask AI'},{k:'compose',l:'Compose'}]

  return (
    <div style={{
      position:'fixed', top:0, right:0, width:400, height:'100vh',
      background:C.surface, borderLeft:`1px solid ${C.border}`,
      display:'flex', flexDirection:'column', zIndex:1000,
      boxShadow:'-8px 0 40px rgba(0,0,0,0.6)',
      animation:'slide-right 0.3s ease',
    }}>

      {/* Header */}
      <div style={{ padding:'16px 18px', borderBottom:`1px solid ${C.border}`, background:`linear-gradient(135deg, #0A1828, #0F2040)`, flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:C.bg }}>✦</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:C.gold }}>Chairman's Assistant</div>
              <div style={{ fontSize:10, color:C.textMuted }}>AI-powered · Goodearth Maritime</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${C.border}`, color:C.textMuted, width:28, height:28, borderRadius:6, fontSize:16, lineHeight:1, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4 }}>
          {TABS.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} style={{
              flex:1, padding:'6px', borderRadius:6, fontSize:11, fontWeight:600,
              background:tab===t.k?C.goldGlow:'transparent',
              border:`1px solid ${tab===t.k?C.gold:C.border}`,
              color:tab===t.k?C.gold:C.textMuted, fontFamily:'inherit', transition:'all 0.2s',
            }}>{t.l}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 16px' }}>

        {/* ACTION ITEMS */}
        {tab==='tasks' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ fontSize:11, color:C.textMuted, marginBottom:2 }}>
              {openItems.length} open · {items.filter(i=>i.status==='overdue').length} overdue · from BOD &amp; Tech Reviews
            </div>
            {openItems.map(item=>(
              <div key={item.id} style={{
                background:C.card, border:`1px solid ${item.status==='overdue'?C.red+'44':C.border}`,
                borderLeft:`3px solid ${item.status==='overdue'?C.red:C.blue}`,
                borderRadius:8, padding:'12px 14px',
              }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <input type="checkbox" checked={false} onChange={()=>toggleItem(item.id)} style={{ marginTop:2, accentColor:C.gold, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:3 }}>{item.item}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{item.ownerName} · Due {item.due}</div>
                    <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>From: {item.meeting}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, marginTop:8 }}>
                  <Badge status={item.status}/>
                  <Badge status={item.priority} label={item.priority}/>
                </div>
              </div>
            ))}
            {closedItems.length > 0 && (
              <div style={{ marginTop:8 }}>
                <div style={{ fontSize:11, color:C.textMuted, marginBottom:8 }}>Completed</div>
                {closedItems.map(item=>(
                  <div key={item.id} style={{ background:C.cardAlt, borderRadius:6, padding:'10px 12px', marginBottom:6, opacity:0.6, display:'flex', gap:10, alignItems:'flex-start' }}>
                    <input type="checkbox" checked={true} onChange={()=>toggleItem(item.id)} style={{ marginTop:2, accentColor:C.gold }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12, color:C.textMuted, textDecoration:'line-through' }}>{item.item}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI CHAT */}
        {tab==='chat' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {messages.map((m,i)=>(
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:m.role==='user'?'flex-end':'flex-start' }}>
                <div style={{
                  maxWidth:'88%', padding:'10px 14px', borderRadius:10, fontSize:12, lineHeight:1.75,
                  background:m.role==='user'?C.goldGlow:C.card,
                  border:`1px solid ${m.role==='user'?C.borderGold:C.border}`,
                  color:C.text, whiteSpace:'pre-wrap',
                  borderBottomRightRadius:m.role==='user'?2:10,
                  borderBottomLeftRadius:m.role==='assistant'?2:10,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display:'flex', gap:4, padding:'10px 14px', background:C.card, borderRadius:10, width:60, border:`1px solid ${C.border}` }}>
                {[0,1,2].map(i=>(
                  <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.textMuted, display:'inline-block', animation:`pulse-amber 1.2s ease ${i*0.2}s infinite` }}/>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
            {/* Quick prompts */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:4 }}>
              {['What needs my attention today?','Status of Saffron Star?','Summarise legal exposure','Fleet utilisation trend'].map(q=>(
                <button key={q} onClick={()=>setInput(q)} style={{ fontSize:10, padding:'5px 10px', borderRadius:15, border:`1px solid ${C.border}`, background:'transparent', color:C.textMuted, fontFamily:'inherit', cursor:'pointer' }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {/* COMPOSE */}
        {tab==='compose' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ fontSize:11, color:C.textMuted }}>Draft an email or message to a team member with AI assistance.</div>
            <div>
              <div style={{ fontSize:11, color:C.textMuted, marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>To</div>
              <select value={composeTo||''} onChange={e=>setComposeTo(e.target.value)} style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:6, color:composeTo?C.text:C.textMuted, padding:'9px 12px', fontSize:12, fontFamily:'inherit' }}>
                <option value="">Select recipient…</option>
                {TEAM.map(t=><option key={t.id} value={t.id}>{t.name} — {t.role}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:11, color:C.textMuted, marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>Subject</div>
              <input value={composeSubj} onChange={e=>setComposeSubj(e.target.value)} placeholder="e.g. MV Saffron Star — Drydock Schedule" style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:'9px 12px', fontSize:12, fontFamily:'inherit', outline:'none' }}/>
            </div>
            <div>
              <div style={{ fontSize:11, color:C.textMuted, marginBottom:6, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>Context / Key Points</div>
              <textarea value={composeCtx} onChange={e=>setComposeCtx(e.target.value)} rows={3} placeholder="What should the email cover? What action is required?" style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:'9px 12px', fontSize:12, fontFamily:'inherit', outline:'none', resize:'vertical' }}/>
            </div>
            <GoldButton onClick={handleDraftEmail} style={{ width:'100%', justifyContent:'center', display:'flex', padding:'10px' }}>
              {drafting ? '✦ Drafting…' : '✦ Draft with AI →'}
            </GoldButton>
            {draftText && (
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.gold, letterSpacing:'0.06em', marginBottom:8 }}>AI DRAFT</div>
                <textarea value={draftText} onChange={e=>setDraftText(e.target.value)} rows={10} style={{ width:'100%', background:C.card, border:`1px solid ${C.borderGold}`, borderRadius:8, color:C.text, padding:'12px 14px', fontSize:12, fontFamily:'inherit', outline:'none', resize:'vertical', lineHeight:1.7 }}/>
                <div style={{ display:'flex', gap:8, marginTop:8 }}>
                  <GoldButton outline onClick={()=>navigator.clipboard.writeText(draftText)} style={{ flex:1, justifyContent:'center', display:'flex' }}>Copy →</GoldButton>
                  <button onClick={()=>{setDraftText('');setComposeSubj('');setComposeCtx('');setComposeTo(null)}} style={{ flex:1, background:'transparent', border:`1px solid ${C.border}`, borderRadius:6, color:C.textMuted, fontSize:11, padding:'7px', fontFamily:'inherit' }}>Clear</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat input (only on chat tab) */}
      {tab==='chat' && (
        <div style={{ padding:'12px 14px', borderTop:`1px solid ${C.border}`, flexShrink:0, background:C.surface }}>
          <div style={{ display:'flex', gap:8 }}>
            <input value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMessage()}
              placeholder="Ask about fleet, finance, legal…"
              style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:'10px 14px', fontSize:12, fontFamily:'inherit', outline:'none' }}
            />
            <GoldButton onClick={sendMessage} style={{ padding:'10px 14px', flexShrink:0 }}>→</GoldButton>
          </div>
        </div>
      )}
    </div>
  )
}
