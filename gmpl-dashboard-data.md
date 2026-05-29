# GMPL Dashboard Data Reference

This file captures the core GMPL dashboard data model from `src/data/seed.js` and the mock Zoho connector data in `src/lib/zoho.js`.

## Source Files
- `src/data/seed.js` — primary seeded dashboard data for Goodearth Maritime Private Limited (GMPL)
- `src/lib/zoho.js` — mock Zoho Finance Suite connector data for live/demo mode

## Key GMPL Data Sections

### 1. Corporate Structure
- `GROUP_ENTITIES`
  - Parent holding company: `gmpl`
  - Intermediate holding: `nis` (Nura International Shipping Pte Ltd)
  - Ship management: `nsm` (Nura ShipCo Management Pte Ltd)
  - Ship owning SPV: `nura_shipco`
  - Dedicated vessel SPVs: `nura_kara_spv`, `nura_bright_spv`
  - Each entity includes: `id`, `name`, `short`, `type`, `jurisdiction`, `role`, `level`, `parentId`, vessel assignments, P&L summary, establishment year, color, dormant state

### 2. Charter and Commercial Data
- `NURA_CHARTERS`
  - Time charter: `MT Anael` to Trafigura Pte Ltd at $19,500/day
  - Pool agreements: `MT Prelude` and `MT Nura Kara`
  - Captive cargo: `MT Nura Bright`
  - Each charter includes: `id`, `vessel`, `charterer`, `type`, `rate`, `currency`, `start`, `end`, `status`, `paymentStatus`, `netTCE`, `nextHire`, `notes`

- `SHIPPING_PARTNERS`
  - Pool operators, charterers, insurers, and partners such as Maersk Tankers, Hafnia, Trafigura, UK P&I Club, Skuld, Norwegian Hull Club, Gard

### 3. Fleet and Vessel Data
- `VESSELS`
  - Four MR product tankers: `MT Prelude`, `MT Anael`, `MT Nura Kara`, `MT Nura Bright`
  - Five inland river barges: `Cosmos 1` through `Cosmos 5`
  - Vessel fields include: `id`, `name`, `type`, `flag`, `util`, `target`, `status`, `pos`, `route`, `crew`, `defects`, `certs`, `dwt`, `built`, `class`, `imo`, `mgr`, `dayRate`, `voyageDays`, `pl`, `commercialMode`, `pool`, `charterer`, `acquired`, `entity`, `lat`, `lng`, `note`

- `COMMERCIAL_MODE_LABELS`
  - `pool`, `tc`, `captive`, `spot`

- `BREAKEVEN_PER_DAY` and `BREAKEVEN_PER_MONTH`
  - Breakeven daily operating cost is `$7,500`

- `VESSEL_EARNINGS`
  - Per-vessel gross income and cost breakdowns for `V001`–`V004`

- `calcWaterfall(e)` function
  - Computes net operating income, cash flow, daily earnings, and breakeven status

### 4. Fleet Growth and Trend Data
- `FLEET_GROWTH`
  - Historical milestones from 2004 to 2026, including vessel count and DWT

- `REVENUE_TREND`
  - Monthly revenue and EBITDA trend data from Jun 2025 through May 2026

### 5. Insurance and Risk Management
- `INSURANCE`
  - H&M, P&I, war risk policies for tankers and fleet-wide coverage
  - Includes insurer, broker, policy number, sum insured, premium, inception/expiry, days to renewal, status, coverage details

- `RENEWAL_ITEMS`
  - Upcoming insurance, certificate, class renewal, provisions, lubes, bunkering
  - Includes due dates, days left, status, responsible owner, vessel

### 6. Bunkering and Pool Earnings
- `BUNKERING`
  - Recent and planned bunker purchases for MR tankers
  - Includes port, grade, quantity, price, supplier, sample status, planned/completed state

- `POOL_EARNINGS`
  - Monthly pool earnings for Maersk Tankers and Hafnia pools
  - Includes gross/net earnings, pool deductions, points, TCE, statements, upload dates

### 7. Market Data
- `MARKET_DATA`
  - Baltic indices, bunker prices, exchange rates, Maersk pool TCE estimate, Red Sea risk indicator

### 8. Business Verticals
- `VERTICALS`
  - Ship Owning, Ship Management, River Barges, Ship Repairing
  - Metrics: revenue, EBITDA, previous revenue, trend, status, margin, vessels, budget, cash, receivables

### 9. Legal, Critical, and Red Flag Monitoring
- `CRITICAL_ITEMS`
  - High-priority operational issues such as MT Prelude pool transfer, IOPP certificate, bunkering RFQ, Cosmos utilisation

- `LEGAL_MATTERS`
  - Active matters: charter party dispute, cargo claim, crew injury, newbuilding contract dispute
  - Includes exposure, next event, status, spend, counsel

- `HEARING_EVENTS`
  - Scheduled legal events with dates and matter references

- `CERTIFICATES`
  - Vessel certificates and expiry tracking

- `RED_FLAGS`
  - Fleet operations, compliance, financial, legal, bunkering issues with actual vs target gap data

### 10. Crew Data
- `CREW`
  - Master and barge master assignments for vessels and barges
  - Includes rank, name, nationality, sign-on/off dates, certification status, relief readiness

## Zoho Mock Data (GMPL Finance Demo)

The Zoho connector mock data in `src/lib/zoho.js` includes:
- `MOCK_ORG` — organisation metadata for Goodearth Maritime Private Limited
- `MOCK_INVOICES` — demo invoices and receivables
- `MOCK_BANK_ACCOUNTS` — bank balances and account details
- `MOCK_PL` — vertical profit & loss summary
- `MOCK_EXPENSES` — expense items for port charges, travel, spares, drydock, bunkers, crew welfare, insurance
- `MOCK_REPORTS` — expense report summaries

## Notes
- The dashboard data model is primarily seeded in `src/data/seed.js` and is designed for GMPL's maritime fleet, commercial, financial, legal, and operational dashboards.
- The Zoho mock connector supports a live/demo switch using environment variables and mirrors the same financial data structures for the dashboard.
