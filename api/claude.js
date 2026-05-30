export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    res.status(500).json({ error: { message: err.message } })
  }
}
