import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { getExpenses, getExpenseReports, getOrganisation, getInvoices, getBankAccounts, getPLSummary, zohoConnectorStatus } from '../lib/zoho.js'
import { CONNECTORS, ZOHO_SUITE } from '../data/seed.js'
import { C, Card, HeroCard, SectionLabel, Badge, GoldButton, StatusDot, tooltipStyle } from './ui.jsx'

const MODULE_ICON = { finance:'⊞', expense:'⊟', payroll:'⊕', crm:'◎', ais:'◉', pi:'⊗' }

export default function ZohoConnector() {
  const [expenses,    setExpenses]    = useState([])
  const [reports,     setReports]     = useState([])
  const [org,         setOrg]         = useState(null)
  const [invoices,    setInvoices]    = useState([])
  const [banks,       setBanks]       = useState([])
  const [pl,          setPl]          = useState([])
  const [syncing,     setSyncing]     = useState(false)
  const [lastSync,    setLastSync]    = useState('2 mins ago')
  const [loading,     setLoading]     = useState(true)
  const [activeTab,   setActiveTab]   = useState('finance')

  async function load() {
    setLoading(true)
    const [e, r, o, inv, bk, plData] = await Promise.all([
      getExpenses(), getExpenseReports(), getOrganisation(),
      getInvoices(), getBankAccounts(), getPLSummary(),
    ])
    setExpenses(e); setReports(r); setOrg(o)
    setInvoices(inv); setBanks(bk); setPl(plData)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSync() {
    setSyncing(true); await load(); setSyncing(false); setLastSync('just now')
  }

  // Derived
  const spendByVessel = {}
  expenses.forEach(e => { spendByVessel[e.vessel||'Other'] = (spendByVessel[e.vessel||'Other']||0) + e.amount })
  const spendData = Object.entries(spendByVessel).map(([v,a]) => ({ v:v.replace('MV ','').replace('Corporate','Corp.'), a })).sort((a,b)=>b.a-a.a)

  const overdueInvoices  = invoices.filter(i => i.status === 'overdue')
  const overdueTotal     = overdueInvoices.reduce((s,i) => s + i.balance, 0)
  const totalCash        = banks.reduce((s,b) => s + (b.currency_code==='USD' ? b.current_balance : b.current_balance/3.67), 0)
  const totalRevenue     = pl.reduce((s,p) => s + p.revenue, 0)
  const totalEbitda      = pl.reduce((s,p) => s + p.net_profit, 0)

  const PIE_COLORS = [C.gold, C.green, C.amber, C.blue]

  const INNER_TABS = [
    { k:'finance', l:'Books & P&L'    },
    { k:'invoices',l:'Invoices'       },
    { k:'banks',   l:'Bank Accounts'  },
    { k:'expenses',l:'Expenses'       },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      {/* ERP Identity card */}
      <HeroCard>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:14, marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:48, height:48, background:`linear-gradient(135deg,${C.gold},${C.goldLight})`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:C.bg, fontWeight:700, flexShrink:0 }}>Z</div>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:600, color:C.gold }}>Zoho Finance Suite</div>
              <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>GMPL's Primary ERP · {ZOHO_SUITE.region} · Org {zohoConnectorStatus.orgId}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{ZOHO_SUITE.description}</div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:11, color:C.textMuted }}>Last sync: {lastSync}</span>
              <GoldButton onClick={handleSync}>{syncing ? '⟳ Syncing…' : '⟳ Sync Now'}</GoldButton>
            </div>
            <div style={{ background:zohoConnectorStatus.status==='demo'?C.amberDim:C.greenDim, border:`1px solid ${zohoConnectorStatus.status==='demo'?C.amber:C.green}44`, borderRadius:6, padding:'4px 12px', fontSize:11, fontWeight:600, color:zohoConnectorStatus.status==='demo'?C.amber:C.green }}>
              {zohoConnectorStatus.status==='demo' ? '⚠ DEMO MODE — set VITE_ZOHO_TOKEN to go live' : '✓ LIVE — OAuth 2.0 Connected'}
            </div>
          </div>
        </div>

        {/* Module status pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {CONNECTORS.map(conn => (
            <div key={conn.name} style={{ display:'flex', alignItems:'center', gap:7, background:'rgba(6,12,24,0.55)', border:`1px solid ${conn.status==='connected'?C.green+'33':C.amber+'33'}`, borderRadius:20, padding:'5px 12px' }}>
              <StatusDot s={conn.status==='connected'?'green':'amber'} animate size={6}/>
              <span style={{ fontSize:11, fontWeight:600, color:C.text }}>{conn.name}</span>
              <span style={{ fontSize:10, color:C.textMuted }}>· {conn.detail}</span>
            </div>
          ))}
        </div>

        {/* API scope strip */}
        <div style={{ marginTop:14, padding:'8px 12px', background:'rgba(6,12,24,0.5)', borderRadius:6, fontSize:10, color:C.textMuted, borderLeft:`3px solid ${C.green}`, fontFamily:'DM Mono, monospace' }}>
          Scopes: {zohoConnectorStatus.scopes.join(' · ')}
        </div>
      </HeroCard>

      {/* KPI summary row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:10 }}>
        {[
          { label:'Group Revenue MTD',  value:`$${(totalRevenue/1e6).toFixed(1)}M`,   color:C.gold  },
          { label:'Group EBITDA MTD',   value:`$${(totalEbitda/1e6).toFixed(1)}M`,    color:C.green },
          { label:'Total Cash (USD eq)',value:`$${(totalCash/1e6).toFixed(2)}M`,      color:C.blue  },
          { label:'Overdue Receivables',value:`$${(overdueTotal/1e6).toFixed(2)}M`,   color:overdueTotal>1e6?C.red:C.amber },
          { label:'Open Invoices',      value:String(invoices.filter(i=>i.status!=='paid').length), color:C.text },
        ].map(k=>(
          <div key={k.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{k.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:600, color:k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Inner tab nav */}
      <div style={{ display:'flex', gap:4, background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:10, padding:4 }}>
        {INNER_TABS.map(t=>(
          <button key={t.k} onClick={()=>setActiveTab(t.k)} style={{
            flex:1, padding:'8px', borderRadius:8, fontSize:12, fontWeight:600,
            background:activeTab===t.k?C.card:'transparent',
            border:activeTab===t.k?`1px solid ${C.borderGold}`:'1px solid transparent',
            color:activeTab===t.k?C.gold:C.textMuted, fontFamily:'inherit', cursor:'pointer', transition:'all 0.2s',
          }}>{t.l}</button>
        ))}
      </div>

      {/* BOOKS & P&L */}
      {activeTab==='finance' && (
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,3fr) minmax(0,2fr)', gap:14 }}>
          <Card>
            <SectionLabel accent>P&L by Vertical (Zoho Books — MTD)</SectionLabel>
            {pl.map((p,i) => {
              const margin = ((p.net_profit/p.revenue)*100).toFixed(1)
              return (
                <div key={p.vertical} style={{ padding:'12px 0', borderBottom:`1px solid ${C.border}22` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{p.vertical}</span>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:600, color:C.green }}>${(p.net_profit/1e6).toFixed(2)}M</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8 }}>
                    {[
                      {l:'Revenue',     v:'$'+(p.revenue/1e6).toFixed(2)+'M', c:C.text },
                      {l:'COGS',        v:'-$'+(p.cogs/1e6).toFixed(2)+'M',   c:C.red  },
                      {l:'Gross Profit',v:'$'+(p.gross_profit/1e6).toFixed(2)+'M', c:C.blue},
                      {l:'EBITDA '+margin+'%', v:'$'+(p.net_profit/1e6).toFixed(2)+'M', c:C.green},
                    ].map(r=>(
                      <div key={r.l} style={{ background:C.cardAlt, borderRadius:6, padding:'7px 10px' }}>
                        <div style={{ fontSize:10, color:C.textMuted, marginBottom:2 }}>{r.l}</div>
                        <div style={{ fontSize:12, fontWeight:700, color:r.c }}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </Card>
          <Card>
            <SectionLabel accent>Revenue Mix</SectionLabel>
            <PieChart width={220} height={220} style={{ margin:'0 auto' }}>
              <Pie data={pl} dataKey="revenue" nameKey="vertical" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                {pl.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={v=>['$'+(v/1e6).toFixed(2)+'M']}/>
            </PieChart>
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
              {pl.map((p,i)=>(
                <div key={p.vertical} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:7, color:C.textSub }}>
                    <span style={{ width:10, height:10, borderRadius:2, background:PIE_COLORS[i%PIE_COLORS.length], display:'inline-block' }}/>
                    {p.vertical}
                  </span>
                  <span style={{ fontWeight:600, color:C.text }}>${(p.revenue/1e6).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* INVOICES */}
      {activeTab==='invoices' && (
        <Card>
          <SectionLabel accent>Outstanding Invoices (Zoho Books)</SectionLabel>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                  {['Invoice #','Customer','Vertical','Amount','Due Date','Status'].map(h=>(
                    <th key={h} style={{ padding:'8px 10px', textAlign:'left', color:C.textMuted, fontWeight:600, fontSize:10, textTransform:'uppercase', letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv=>(
                  <tr key={inv.invoice_id} style={{ borderBottom:`1px solid ${C.border}22` }}>
                    <td style={{ padding:'10px 10px', fontFamily:'DM Mono,monospace', fontSize:11, color:C.gold }}>{inv.invoice_number}</td>
                    <td style={{ padding:'10px 10px', color:C.text, fontWeight:500 }}>{inv.customer_name}</td>
                    <td style={{ padding:'10px 10px', color:C.textSub }}>{inv.vertical}</td>
                    <td style={{ padding:'10px 10px', fontWeight:700, color:inv.status==='paid'?C.green:C.text }}>${inv.total.toLocaleString()}</td>
                    <td style={{ padding:'10px 10px', color:inv.status==='overdue'?C.red:C.textMuted }}>{inv.due_date}</td>
                    <td style={{ padding:'10px 10px' }}><Badge status={inv.status}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {overdueTotal > 0 && (
            <div style={{ marginTop:12, padding:'10px 14px', background:C.redDim, border:`1px solid ${C.red}44`, borderRadius:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:12, color:'#FCA5A5' }}>⚠ Total overdue receivables: <strong>${overdueTotal.toLocaleString()}</strong> across {overdueInvoices.length} invoices</span>
              <GoldButton outline>Chase Debtors →</GoldButton>
            </div>
          )}
        </Card>
      )}

      {/* BANK ACCOUNTS */}
      {activeTab==='banks' && (
        <Card>
          <SectionLabel accent>Bank Accounts (Zoho Books — Live Balances)</SectionLabel>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:12 }}>
            {banks.map(b=>(
              <div key={b.account_id} style={{ background:C.cardAlt, border:`1px solid ${C.border}`, borderRadius:10, padding:'16px 18px' }}>
                <div style={{ fontSize:11, fontWeight:600, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>{b.bank_name}</div>
                <div style={{ fontSize:13, color:C.textSub, marginBottom:10 }}>{b.account_name.split('—').slice(1).join('—').trim()}</div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:600, color:C.gold, marginBottom:6 }}>
                  {b.currency_code} {b.current_balance.toLocaleString()}
                </div>
                <div style={{ fontSize:11, color:C.textMuted }}>Last imported: {b.last_imported_date}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14, padding:'10px 14px', background:C.cardAlt, border:`1px solid ${C.borderGold}`, borderRadius:8, fontSize:12, color:C.textSub }}>
            <span style={{ color:C.gold, fontWeight:600 }}>Total USD-equivalent: </span>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:C.gold }}>${(totalCash/1e6).toFixed(3)}M</span>
            <span style={{ color:C.textMuted }}> · AED converted at 3.67</span>
          </div>
        </Card>
      )}

      {/* EXPENSES */}
      {activeTab==='expenses' && (
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,3fr) minmax(0,2fr)', gap:14 }}>
          <Card>
            <SectionLabel accent>Zoho Expense — Live Feed</SectionLabel>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {expenses.map(e=>(
                <div key={e.expense_id} style={{ background:C.cardAlt, borderRadius:8, padding:'10px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:8, border:`1px solid ${C.border}` }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:C.gold, fontFamily:'DM Mono,monospace' }}>{e.expense_id}</span>
                      <span style={{ fontSize:10, color:C.textMuted }}>{e.date}</span>
                    </div>
                    <div style={{ fontSize:12, fontWeight:600, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:2 }}>{e.category_name} — {e.expense_item_name}</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>{e.submitted_by} · {e.vessel}</div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontWeight:600, color:C.text, marginBottom:4 }}>${e.amount.toLocaleString()}</div>
                    <Badge status={e.report_status}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <Card>
              <SectionLabel accent>Spend by Vessel (MTD)</SectionLabel>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={spendData} layout="vertical" margin={{top:0,right:10,left:55,bottom:0}}>
                  <XAxis type="number" tick={{fill:C.textMuted,fontSize:10}} tickFormatter={v=>'$'+(v/1000).toFixed(0)+'K'}/>
                  <YAxis type="category" dataKey="v" tick={{fill:'#C8D8EC',fontSize:11}}/>
                  <Tooltip {...tooltipStyle} formatter={v=>['$'+v.toLocaleString()]}/>
                  <Bar dataKey="a" fill={C.gold} radius={[0,4,4,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <SectionLabel accent>Expense Reports</SectionLabel>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {reports.map(r=>(
                  <div key={r.report_id} style={{ background:C.cardAlt, borderRadius:8, padding:'10px 12px', border:`1px solid ${C.border}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:C.gold, fontFamily:'DM Mono,monospace' }}>{r.report_id}</span>
                      <Badge status={r.report_status}/>
                    </div>
                    <div style={{ fontSize:12, color:C.text, marginBottom:3 }}>{r.report_name}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11 }}>
                      <span style={{ color:C.textMuted }}>{r.submitted_by}</span>
                      <span style={{ fontWeight:600, color:C.text }}>${r.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
