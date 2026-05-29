# GMPL Chairman's Intelligence Dashboard

**Good Earth Maritime Private Limited — Executive Intelligence Dashboard**
Confidential. For internal use only.

---

## What This Is

A fully interactive React web application delivering the Chairman's executive intelligence dashboard across all four GMPL verticals:
- Group Overview with AI briefing, P&L, and market data
- Maritime fleet status with vessel drill-through
- Legal & Risk — litigation tracker, certificate expiry
- Assumption Mapper — live scenario modelling
- Zoho Expense connector (demo mode → live with one env variable)

Runs on desktop, iPad, and mobile. No app store required — just a URL.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Recharts + Vite |
| Hosting | Vercel (free tier) |
| Database | Supabase (PostgreSQL) |
| Zoho Connector | Zoho Expense API v1 — OAuth 2.0 |
| Auth (Phase 2) | Supabase Auth or Azure AD SSO |

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env template and fill in your values (or leave blank for demo mode)
cp .env.example .env

# 3. Start dev server
npm run dev
# → Open http://localhost:3000
```

The app runs fully in **demo mode** with no environment variables — all data is seeded locally. No Supabase or Zoho account needed for the demo.

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
# Follow prompts — framework: Vite, output: dist
```

### Option B — GitHub + Vercel Dashboard

1. Push this folder to a GitHub repository
2. Go to https://vercel.com → Add New Project → Import your repo
3. Framework: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables (Settings → Environment Variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ZOHO_TOKEN` (optional — leave blank for demo mode)
   - `VITE_ZOHO_ORG_ID` (optional)
   - `VITE_CLAUDE_API_KEY` (optional — leave blank to run the AI assistant in demo/placeholder mode)
   - `VITE_CLAUDE_MODEL` (optional, defaults to `claude-sonnet-4-20250514`)
## Provision Supabase

1. Create a free project at https://supabase.com
2. Go to SQL Editor → paste the contents of `supabase/seed.sql` → Run
3. Copy your project URL and anon key from Settings → API
4. Paste into `.env` (local) or Vercel environment variables (production)

The app will automatically switch from mock data to live Supabase data once the env vars are set.

---

## Connect Zoho Expense (Live Mode)

1. Go to https://api-console.zoho.com → Self Client
2. Create credentials with these scopes:
   ```
   ZohoExpense.orgsettings.READ,ZohoExpense.expensereports.READ,ZohoExpense.expenses.READ
   ```
3. Generate access token
4. Add `VITE_ZOHO_TOKEN` and `VITE_ZOHO_ORG_ID` to your environment
5. Redeploy — the Zoho tab will show real data immediately

**Demo mode**: If `VITE_ZOHO_TOKEN` is not set, all Zoho data comes from the local mock (same field structure as the real API). The connector status badge shows "DEMO" instead of "CONNECTED".

---

## Project Structure

```
gmpl-dashboard/
├── src/
│   ├── components/
│   │   ├── Overview.jsx       ← Group overview screen
│   │   ├── Maritime.jsx       ← Fleet status + drill-through
│   │   ├── Legal.jsx          ← Litigation + cert expiry
│   │   ├── Assumptions.jsx    ← Scenario mapper
│   │   ├── ZohoConnector.jsx  ← Zoho Expense live feed
│   │   └── ui.jsx             ← Shared tokens + atoms
│   ├── data/
│   │   └── seed.js            ← All mock data (matches DB schema)
│   ├── lib/
│   │   ├── supabase.js        ← Supabase client + fetchTable helper
│   │   └── zoho.js            ← Zoho Expense connector (demo + live)
│   ├── App.jsx                ← Shell, nav, tab routing
│   └── main.jsx               ← React entry point
├── supabase/
│   └── seed.sql               ← DB schema + demo data
├── .env.example               ← Environment variable template
├── vercel.json                ← SPA routing config
└── vite.config.js
```

---

## Phase 2 Additions (when ready)

- Replace mock AI briefing with a real Claude API call (`/v1/messages`)
- Add Supabase Auth with RBAC (Chairman sees all; department heads see their vertical only)
- Wire AIS vessel positions to a live MarineTraffic API call
- Add WebSocket-based real-time critical alert push notifications
- Connect Internal ERP (Oracle NetSuite) via REST connector

---

*Prepared by ATS — Confidential — Good Earth Maritime Private Limited — May 2026*
# Production Deployment Sat May 16 19:45:09 +04 2026
