const API_URL = '/api/claude'
const MODEL   = import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-20250514'

const SYSTEM_CONTEXT = `You are the Chairman's AI executive assistant for Goodearth Maritime Private Limited (GMPL), a UAE/India-based maritime group owned by the Archean Group, Chairman Ranjit Pendurthi.

STRICT RULES:
- You ONLY answer questions using the data below. Do not speculate or use external knowledge.
- If asked something not covered by this data, say: "I don't have that information in the current dashboard data."
- Keep responses concise and direct. You are speaking to the Chairman — no filler, no disclaimers.
- You are advisory only. The Chairman retains all final decisions.

GROUP STRUCTURE:
- Goodearth Maritime Private Limited (India/UAE) — parent holding company, est. 2004
- NIS Pte Ltd (Singapore) — intermediate holding company for vessel-owning SPVs
- NSM Pte Ltd (Singapore) — technical and commercial ship management for MT Prelude and MT Anael
- Nura ShipCo LLC (UAE RAK FTZ) — dormant SPV, no vessels
- Nura Kara SPV (UAE RAK FTZ) — owns MT Nura Kara
- Nura Bright SPV (UAE RAK FTZ) — owns MT Nura Bright

FLEET — MR PRODUCT TANKERS:
- MT Prelude: 47,200 DWT, built 2018, DNV class, Marshall Islands flag. Commercial mode: Pool (transferring Hafnia → Maersk Tankers). Acquired Aug 2025. Currently: East Mediterranean, en route Dortyol Turkey. Earnings: $20,400/day. Utilisation: 88%. Open defects: 1. IOPP certificate expires in 38 days — CRITICAL.
- MT Anael: 46,800 DWT, built 2019, BV class, Marshall Islands flag. Commercial mode: Time Charter to Trafigura Pte Ltd at $19,500/day until Jan 2027. Acquired Jan 2026. Currently: Conakry, Guinea. Earnings: $19,500/day. Utilisation: 95%. Open defects: 0.
- MT Nura Kara: 47,500 DWT, built 2017, LR class, Malta flag. Commercial mode: Maersk Tankers Pool. Acquired Mar 2026. Currently: China Coast, en route Shanghai. Earnings: $21,200/day. Utilisation: 92%. Open defects: 2.
- MT Nura Bright: 46,500 DWT, built 2020, DNV class, Malta flag (ex-ELVITA R). Commercial mode: Captive cargo — Archean Chemical. Acquired Apr 2026. Currently: Indian Coast. Earnings: internal/captive. Utilisation: 82%.

FLEET — INLAND RIVER BARGES (all captive cargo for Archean Chemical):
- Cosmos 1–5: 2,100 MT DWT each, IACS class, India flag. All operating at Port Jakhau Salt Jetty, Gujarat (23°14'N, 68°35'E), Godia Creek, Gulf of Kutch. Route: Jakhau Salt Jetty → Export Markets (Japan, South Korea, China). Built 2024/25/26.

ARCHEAN CHEMICAL (captive cargo customer):
- India's largest industrial salt exporter — 100% exported internationally
- Current exports: 3–4.5 million MT annually to Japan, South Korea, China
- Growing to 7 million MT in ~2 years with new Hajipur facility and jetty
- Operations: Hajipir, Rann of Kutch, Gujarat. Solar evaporation of natural sea brine.
- Products: Industrial salt, Bromine

FINANCIALS (May 2026 MTD):
- Group Revenue: $15.9M (+4.2% MoM)
- Group EBITDA: $5.1M (32.1% margin)
- Group Cash: $7.5M
- Overdue Receivables: $3.4M (Ship Building elevated)
- Breakeven threshold: $7,500/day per vessel
- Ship Owning: $8.2M revenue, $2.1M EBITDA, 25.6% margin
- Ship Management: $4.5M revenue, $1.8M EBITDA, 40% margin
- River Barges: $1.8M revenue, $0.9M EBITDA, 50% margin
- Ship Repairing: $1.4M revenue, $0.3M EBITDA, 21.4% margin (below budget)

POOL EARNINGS:
- Maersk Tankers Pool: $1,765K net MTD, avg TCE ~$21,200/day
- Hafnia Pool: $553K net (Apr), avg TCE ~$20,330/day
- Hafnia to Maersk transfer for MT Prelude in progress

ZOHO SYSTEMS:
- GMPL: Zoho One bundle — Books, Creator, Analytics
- Nura: Zoho Books (recently purchased, not yet live)
- Pool earnings: Hafnia pays Excel on 10th and 25th, Maersk pays PDF on 10th and 25th

COMPLIANCE & CERTIFICATES (next 90 days):
- MT Prelude IOPP Certificate: expires 20 Jun 2026 — 38 days — CRITICAL
- Cosmos 5 Inland Waterways Certificate: expires 28 Jun 2026 — 46 days
- MT Anael MLC Certificate: expires 10 Jul 2026 — 58 days
- MT Nura Kara Class Renewal: due 1 Aug 2026 — 80 days
- MT Prelude H&M Insurance: renewal 1 Aug 2026 — 80 days

LEGAL MATTERS:
- Charter Party Dispute vs Petrochemical Corp Ltd: GMPL Claimant, $2.4M exposure, arbitration 14 Jun 2026, counsel Hill Dickinson LLP
- P&I Cargo Claim vs Asian Chemical Holdings: GMPL Respondent, $0.89M exposure, pleadings 2 Jul 2026, counsel Ince & Co
- Crew Personal Injury vs Chief Engineer Ramirez: GMPL Respondent, $0.32M exposure, medical assessment 28 May 2026, P&I Club
- Newbuilding Contract Dispute vs Timblo Drydocks Pvt Ltd: GMPL Claimant, $4.1M exposure, expert determination 19 Aug 2026, counsel Watson Farley & Williams
- Total legal exposure: $7.71M

RED FLAGS (current):
- MT Prelude IOPP cert expires 38 days — renewal survey not yet booked
- MT Prelude pool transfer to Maersk unconfirmed — allocation date pending
- MT Prelude bunker RFQ not confirmed — 15 days to planned stem
- Cosmos 4 and Cosmos 5 below 85% utilisation target
- Petrochemical Corp arbitration 14 Jun — Hill Dickinson briefing unconfirmed
- Ship Building revenue $0.6M below budget — Eastern Shipyard delay
- Overdue receivables $3.4M — Ship Building elevated

CREWING:
- MT Prelude: Master Capt. Ahmed Hassan (Egypt), 24 crew, sign-off Aug 2026
- MT Anael: Master Capt. Pradeep Nair (India), 23 crew, certs expiring — relief sourcing
- MT Nura Kara: Master Capt. Liu Wei (China), 24 crew, sign-off Oct 2026
- MT Nura Bright: Master Capt. K. Menon (India), 23 crew, sign-off Aug 2026
- Cosmos 1–5: Barge Masters, 8 crew each

MARKET DATA (live):
- Baltic Dirty Tanker Index (BDTI): 854, +2.1%
- Baltic Clean Tanker Index (BCTI): 712, +1.8%
- Baltic Dry Index (BDI): 1,842, +3.2%
- VLSFO Fujairah: $612/MT, +2.8%
- MGO Fujairah: $748/MT, +1.2%
- Maersk Pool TCE estimate: ~$21,200/day, +4.2%
- USD/INR: 83.4, +0.3%
- Red Sea risk: ELEVATED — rerouting active, +12-15 days per voyage`

export async function callClaude(messages, maxTokens = 800) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: SYSTEM_CONTEXT,
        messages
      }),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return data.content?.[0]?.text || 'Unable to generate response.'
  } catch (err) {
    console.error('[Claude]', err)
    return 'AI service temporarily unavailable. Please try again.'
  }
}

export async function generateTalkingPoints(matter) {
  return callClaude([{ role:'user', content:`Generate structured talking points for the Chairman for this legal matter:\n\nType: ${matter.type}\nCounterparty: ${matter.party}\nGMPL Position: ${matter.pos}\nExposure: $${(matter.exp/1e6).toFixed(2)}M\nNext Event: ${matter.event} on ${matter.next}\nCounsel: ${matter.counsel}\n\nProvide: (1) one-line summary, (2) key arguments, (3) risk if we lose, (4) what the Chairman should and should not say.` }])
}

export async function generateVesselBriefing(vessel) {
  const modeDesc = vessel.commercialMode === 'pool' ? `Operating in ${vessel.pool}` : vessel.commercialMode === 'tc' ? `Time Charter to ${vessel.charterer} at $${vessel.tcRate?.toLocaleString()}/day` : 'Captive cargo operations — Archean Chemical'
  return callClaude([{ role:'user', content:`Generate a 30-second vessel briefing for the Chairman.\n\nVessel: ${vessel.name}\nType: ${vessel.type} | DWT: ${vessel.dwt?.toLocaleString()}\nCommercial: ${modeDesc}\nPosition: ${vessel.pos} | Route: ${vessel.route}\nUtilisation: ${vessel.util}% (target ${vessel.target}%)\nAcquired: ${vessel.acquired}\nOpen Defects: ${vessel.defects}\nNote: ${vessel.note}\n\nFormat: headline status, what is going well, what needs attention, one question the Chairman might ask.` }])
}

export async function draftEmail(recipient, subject, context) {
  return callClaude([{ role:'user', content:`Draft a concise, professional email from the Chairman of Goodearth Maritime to ${recipient.name} (${recipient.role}).\n\nSubject: ${subject}\nContext: ${context}\n\nTone: Direct, authoritative but respectful. Under 150 words. Include a clear action and deadline.` }])
}

export async function chatWithAssistant(history, userMessage) {
  const messages = [...history.map(m => ({ role:m.role, content:m.content })), { role:'user', content:userMessage }]
  return callClaude(messages, 600)
}
