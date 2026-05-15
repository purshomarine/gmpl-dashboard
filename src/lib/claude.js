// ─── Claude AI Integration ───────────────────────────────────────────────────
// Powers: Chairman briefing, talking points, vessel notes, AI assistant chat

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL   = 'claude-sonnet-4-20250514'

const SYSTEM_CONTEXT = `You are the Chairman's AI executive assistant for Good Earth Maritime Private Limited (GMPL), a leading UAE-based maritime group operating four verticals: Ship Owning, Ship Management, Ship Building, and Ship Repairing.

Current dashboard data (13 May 2026):
- Fleet: 8 vessels. 7 on hire. Average utilisation 82%. MV Saffron Star laid up 18 days — OPEX burn $8,400/day.
- Group revenue this month: $17.1M. EBITDA: $5.0M.
- Ship Building below target: $2.8M actual vs $3.4M budget.
- Critical: MV Saffron Star SMC expires 24 May 2026.
- Legal: 4 active matters. Total exposure $7.71M. Petrochemical Corp arbitration 14 Jun (Hill Dickinson).
- Market: VLSFO $612/MT. Baltic Dry +3.2%. Red Sea rerouting adding 12-15 days per voyage.

You write in a direct, senior executive style. Keep responses concise. Use bullet points sparingly. When drafting communications, write professionally but personally — the Chairman is a senior industry figure.`

export async function callClaude(messages, maxTokens = 800) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  return callClaude([{
    role: 'user',
    content: `Generate structured talking points for the Chairman for this legal matter:\n\nType: ${matter.type}\nCounterparty: ${matter.party}\nGMPL Position: ${matter.pos}\nExposure: $${(matter.exp/1e6).toFixed(2)}M\nNext Event: ${matter.event} on ${matter.next}\nCounsel: ${matter.counsel}\n\nProvide: (1) one-line summary, (2) GMPL's key arguments, (3) risk if we lose, (4) what the Chairman should say/not say in conversations about this matter.`,
  }])
}

export async function generateVesselBriefing(vessel) {
  return callClaude([{
    role: 'user',
    content: `Generate a 30-second vessel briefing for the Chairman before a call with the Fleet Manager or Technical Superintendent.\n\nVessel: ${vessel.name}\nType: ${vessel.type} | DWT: ${vessel.dwt.toLocaleString()}\nPosition: ${vessel.pos}\nRoute: ${vessel.route}\nUtilisation: ${vessel.util}% (target ${vessel.target}%)\nP&L MTD: $${vessel.pl.toLocaleString()}\nOpen Defects: ${vessel.defects}\nCertificate Status: ${vessel.certs}\nCrew: ${vessel.crew} on board\n\nFormat: headline status, what's going well, what needs attention, one question the Chairman might ask.`,
  }])
}

export async function draftEmail(recipient, subject, context) {
  return callClaude([{
    role: 'user',
    content: `Draft a concise, professional email from the Chairman of Good Earth Maritime to ${recipient.name} (${recipient.role}).\n\nSubject: ${subject}\nContext: ${context}\n\nTone: Direct, authoritative but respectful. The Chairman expects results. Keep it under 150 words. Include a clear action required and deadline if applicable.`,
  }])
}

export async function chatWithAssistant(history, userMessage) {
  const messages = [
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]
  return callClaude(messages, 600)
}
