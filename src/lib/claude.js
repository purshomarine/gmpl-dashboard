const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL   = import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-20250514'
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY
const LIVE_MODE = !!API_KEY

const SYSTEM_CONTEXT = `You are the Chairman's AI executive assistant for Goodearth Maritime Private Limited, a UAE/India-based maritime group.

GROUP STRUCTURE:
- Goodearth Maritime Private Limited (India/UAE) — parent holding company
- Nura Shipco LLC (UAE RAK FTZ) — vessel owning SPV holding tanker mortgages
- Nura ShipCo Management Pte Ltd (Singapore) — technical and commercial ship management

FLEET (as at May 2026):
MR PRODUCT TANKERS (operated via Nura Shipco / Nura ShipCo Management):
- MT Prelude (47,200 DWT, 2018, DNV) — Hafnia Pool, transferring to Maersk Tankers Pool. Acquired Aug 2025.
- MT Anael (46,800 DWT, 2019, BV) — Time Charter to Trafigura Pte Ltd at $19,500/day until Jan 2027. Acquired Jan 2026.
- MT Nura Kara (47,500 DWT, 2017, LR) — Maersk Tankers Pool. Acquired Mar 2026.
- MT Nura Bright (46,500 DWT, 2020, DNV) — Captive cargo operations. Acquired Apr 2026.

INLAND RIVER BARGES (operated directly under Goodearth, captive):
- Cosmos 1–5: 2100 MT class, IACS, built 2024/25/26. Operating on Mandovi River, Goa.

FINANCIAL CONTEXT (May 2026):
- Fleet OPEX all-in (including DD + Insurance): $7,500/day per vessel (breakeven threshold)
- Pool earnings estimate: Maersk Tankers ~$21,200/day, Hafnia ~$20,400/day
- MT Anael TC fixed at $19,500/day
- Group revenue MTD: ~$15.9M. Group EBITDA: ~$5.0M.
- Active deal: Fifth MR tanker acquisition in origination stage

KEY ISSUES TODAY:
- MT Prelude IOPP cert expires 38 days — renewal survey needed
- Pool transfer (Hafnia → Maersk Tankers) unconfirmed — allocation date pending
- Cosmos 4 & 5 below 85% utilisation target
- Arbitration hearing 14 Jun — Hill Dickinson briefing unconfirmed
- Timblo Drydocks dispute — $4.1M exposure — August hearing

Write in a direct, senior executive style. Keep responses concise. Human always retains final decision — AI is advisory only.`

export async function callClaude(messages, maxTokens = 800) {
  if (!LIVE_MODE) {
    console.warn('[Claude] VITE_CLAUDE_API_KEY is not configured')
    return 'Claude AI is unavailable. Set VITE_CLAUDE_API_KEY in your .env file to enable live AI.'
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system: SYSTEM_CONTEXT, messages }),
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
  const modeDesc = vessel.commercialMode === 'pool' ? `Operating in ${vessel.pool}` : vessel.commercialMode === 'tc' ? `Time Charter to ${vessel.charterer} at $${vessel.tcRate?.toLocaleString()}/day` : 'Captive cargo operations'
  return callClaude([{ role:'user', content:`Generate a 30-second vessel briefing for the Chairman.\n\nVessel: ${vessel.name}\nType: ${vessel.type} | DWT: ${vessel.dwt?.toLocaleString()}\nCommercial: ${modeDesc}\nPosition: ${vessel.pos} | Route: ${vessel.route}\nUtilisation: ${vessel.util}% (target ${vessel.target}%)\nAcquired: ${vessel.acquired}\nOpen Defects: ${vessel.defects}\nNote: ${vessel.note}\n\nFormat: headline status, what's going well, what needs attention, one question the Chairman might ask.` }])
}

export async function draftEmail(recipient, subject, context) {
  return callClaude([{ role:'user', content:`Draft a concise, professional email from the Chairman of Goodearth Maritime to ${recipient.name} (${recipient.role}).\n\nSubject: ${subject}\nContext: ${context}\n\nTone: Direct, authoritative but respectful. Under 150 words. Include a clear action and deadline.` }])
}

export async function chatWithAssistant(history, userMessage) {
  const messages = [...history.map(m => ({ role:m.role, content:m.content })), { role:'user', content:userMessage }]
  return callClaude(messages, 600)
}
