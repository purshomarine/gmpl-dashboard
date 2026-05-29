# GMPL Chairman's Executive Intelligence Dashboard
## UI/UX Specification — Claude Code Build Brief
**Version 1.0 — May 2026 | Prepared by KJ | Confidential**

---

## 1. Project Context

This document is the complete UI/UX specification for the Good Earth Maritime Private Limited (GMPL) Chairman's Executive Intelligence Dashboard. It covers design system, layout, component behaviour, and responsive rules across three target devices. This brief is written for Claude Code and should be treated as the single source of truth for all frontend decisions.

The dashboard serves one primary user: the Chairman of Archean Group / GMPL. He accesses it across three contexts with three distinct needs:

| Device | Context | Job to be Done |
|--------|---------|----------------|
| iPhone | Pre-meeting, back of car, 90 seconds | Know the group status. Nothing needs explaining. |
| iPad | Away from desk, lounge, flight | Review performance. Tap into anything. |
| Laptop | Desk, 1:1 meetings, board prep | Control. Drill. Interrogate. Present. |

These are not three sizes of the same layout. They are three different products sharing one design system.

---

## 2. Design Language

### 2.1 Aesthetic Direction

**Refined Dark Intelligence.** This dashboard sits in the same visual space as a Bloomberg Terminal redesigned by a luxury consultancy. It is not a generic SaaS product. It is a tool built for one person who runs a serious business.

- Dark backgrounds that feel like carbon fibre, not developer mode
- Gold/amber as the primary accent — maritime, authoritative, warm
- Data that breathes — generous spacing, nothing crammed
- Typography that feels like a financial newspaper, not a startup
- Zero decoration that doesn't carry information

### 2.2 Colour Tokens

```css
/* Core Palette */
--bg-base:        #0A0D12;   /* Page background — near black with blue undertone */
--bg-surface:     #111620;   /* Card backgrounds */
--bg-elevated:    #1A2030;   /* Hover states, active panels */
--bg-border:      #252D3D;   /* All borders and dividers */

/* Accent */
--gold:           #C9A84C;   /* Primary accent — amber gold */
--gold-muted:     #8A6A2A;   /* Secondary gold, used sparingly */
--gold-glow:      rgba(201,168,76,0.12); /* Hover glow on gold elements */

/* Status */
--status-green:   #2ECC71;   /* On track / healthy */
--status-amber:   #F39C12;   /* Watch / warning */
--status-red:     #E74C3C;   /* Critical / action required */
--status-blue:    #3498DB;   /* Informational */

/* Text */
--text-primary:   #F0F4FC;   /* Headings and primary values */
--text-secondary: #8B98B8;   /* Labels, captions, metadata */
--text-muted:     #4A5568;   /* Disabled, placeholder */
--text-gold:      #C9A84C;   /* Accent text on dark bg */

/* Data Viz */
--chart-1:        #C9A84C;   /* Gold — primary series */
--chart-2:        #3498DB;   /* Blue — secondary series */
--chart-3:        #2ECC71;   /* Green — positive variance */
--chart-4:        #E74C3C;   /* Red — negative variance */
--chart-5:        #9B59B6;   /* Purple — external data */
```

### 2.3 Typography

```css
/* Display / Hero numbers */
--font-display:   'DM Serif Display', Georgia, serif;

/* UI / Labels / Navigation */
--font-ui:        'IBM Plex Mono', 'Courier New', monospace;

/* Body / Descriptions */
--font-body:      'Inter', system-ui, sans-serif;

/* Sizing Scale */
--text-xs:   0.65rem;   /* 10.4px — timestamps, metadata */
--text-sm:   0.75rem;   /* 12px — labels, captions */
--text-base: 0.875rem;  /* 14px — body, table rows */
--text-md:   1rem;      /* 16px — card values */
--text-lg:   1.25rem;   /* 20px — section headings */
--text-xl:   1.75rem;   /* 28px — KPI numbers, iPhone */
--text-2xl:  2.5rem;    /* 40px — hero numbers, laptop */
--text-3xl:  3.5rem;    /* 56px — full-screen callouts */
```

**Rules:**
- KPI numbers always use `--font-display` in `--text-xl` or larger
- All labels, tab names, and navigation use `--font-ui` in caps-lock with `letter-spacing: 0.1em`
- All descriptive text, briefings, and AI summaries use `--font-body`
- Never mix more than two font families in one component

### 2.4 Spacing System

```css
/* 8px base grid — all values are multiples of 8 */
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   24px;
--space-6:   32px;
--space-7:   48px;
--space-8:   64px;
```

### 2.5 Border Radius

```css
--radius-sm:   4px;    /* Tags, badges */
--radius-md:   8px;    /* Cards */
--radius-lg:   12px;   /* Panels */
--radius-xl:   16px;   /* Modal sheets (mobile) */
--radius-full: 9999px; /* Pills */
```

### 2.6 Elevation / Shadow

```css
--shadow-card:   0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6);
--shadow-panel:  0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08);
--shadow-modal:  0 24px 64px rgba(0,0,0,0.8);
--glow-gold:     0 0 20px rgba(201,168,76,0.2);
```

### 2.7 Status Indicators

Every metric that has a status shows it via a 6px solid left-border on the card plus a dot badge:

```
🟢  Green  — on track vs target, no action required
🟡  Amber  — within 10% of threshold, monitor
🔴  Red    — threshold breached, action required
⚫  Grey   — no data / not applicable
```

Traffic light dots are always 8px circles, never emoji. Use `background-color` from status tokens.

---

## 3. Navigation Architecture

### 3.1 Laptop — Persistent Left Sidebar

```
Width: 220px collapsed / 64px icon-only when minimised
Position: fixed left, full height

Sections:
  ━━━━━━━━━━━━━━━━━━━━
  [GMPL Logo + "Chairman"]
  ━━━━━━━━━━━━━━━━━━━━
  GROUP
    ◉  Overview
    ◉  Group Structure
    ◉  Active Deals

  FLEET
    ◉  Fleet Map
    ◉  Fleet Status
    ◉  Bunkering
    ◉  Pool Earnings

  PEOPLE
    ◉  Crewing
    ◉  HSE

  COMPLIANCE
    ◉  Inspections
    ◉  Certificates

  INTELLIGENCE
    ◉  Market Intel
    ◉  Scenario Mapper
    ◉  Zoho ERP

  GOVERNANCE
    ◉  Legal & Risk
    ◉  Red Flags
    ◉  Awards
  ━━━━━━━━━━━━━━━━━━━━
  [AI Briefing pulse indicator]
```

Active tab: gold left border, `--bg-elevated` background, text `--text-gold`
Inactive tab: `--text-secondary`, hover `--bg-elevated`
Icon + label below 1024px width — collapse to icon-only

### 3.2 iPad — Top Tab Bar + Bottom Nav

Primary navigation: horizontal scrollable tab bar at the top
- Tabs grouped in 5 clusters (same groups as laptop sidebar)
- Active tab: gold underline (2px), gold text
- Scroll indicator: fade gradient on right edge when tabs overflow

Bottom navigation bar (fixed): 5 most used tabs as icon+label:
```
[Overview] [Fleet] [Red Flags] [Scenarios] [Briefing]
```

### 3.3 iPhone — No Persistent Navigation

Navigation is contextual:
- Home screen has 4 large vertical tiles (one per business unit) — tap to drill in
- Back arrow top-left, always visible
- Bottom sheet for secondary details — slides up from bottom, 60% height
- No tab bar. No sidebar. Gesture-driven only.

---

## 4. Screen-by-Screen Specification

---

### 4.1 iPhone — Morning Briefing Screen (Home)

**This is the only screen the iPhone user needs 90% of the time.**

**Layout (top to bottom):**

```
┌─────────────────────────────┐
│  [Date / Time]  [●●● Alerts]│  ← Header: 48px, --bg-surface
├─────────────────────────────┤
│                             │
│  AI BRIEFING                │  ← Section label, --font-ui, --text-gold
│  ─────────────────────────  │
│  "3 vessels on voyage.      │  ← 3–4 sentences, --font-body
│   MT Nura Bright flagged    │
│   for cert expiry in 12     │
│   days. BDI up 4% this wk." │
│                             │
├─────────────────────────────┤
│  STATUS                     │  ← Section label
│  ┌──────────┐ ┌──────────┐  │
│  │Ship Own  │ │Ship Mgmt │  │  ← 2×2 grid of vertical tiles
│  │  🟢      │ │  🟡      │  │  ← Each 140px wide, 80px tall
│  └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐  │
│  │  Barges  │ │ Repairing│  │
│  │  🟢      │ │  🔴      │  │
│  └──────────┘ └──────────┘  │
├─────────────────────────────┤
│  NEEDS ATTENTION            │  ← Section label
│  ┌─────────────────────────┐│
│  │ 🔴 MT Nura Bright cert  ││  ← Tappable row, chevron right
│  │    expires in 12 days   ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 🟡 Bunker stem overdue  ││
│  │    MT Anael — Mumbai    ││
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 🔴 PSC deficiency open  ││
│  │    MT Prelude — 18 days ││
│  └─────────────────────────┘│
├─────────────────────────────┤
│  MARKET                     │  ← 5 horizontal scrollable pills
│  [BDI +4%] [Brent $81] ...  │
└─────────────────────────────┘
```

**Interaction rules:**
- Tapping a vertical tile opens a bottom sheet with that vertical's top 3 KPIs + top 2 red flags
- Tapping a "Needs Attention" row opens a full-screen detail sheet with action context
- Market pills are read-only. No drill-down.
- Pull-to-refresh at top triggers AI briefing regeneration
- Long-press on AI briefing opens "Share briefing" sheet (copy text / email)

**No bottom tab bar on iPhone home. This is the complete view.**

---

### 4.2 iPad — Group Overview (Home Tab)

**Two-column layout in landscape. Single column in portrait (rare — this device is mostly landscape).**

**Landscape layout:**

```
┌──────────────────────────────────────────────────┐
│ [AI Briefing — expandable banner, 1 paragraph]   │ ← Dismissable after read
├──────────────┬───────────────────────────────────┤
│              │ REVENUE (MTD)        EBITDA (MTD) │
│  VERTICALS   │  $12.4M  +8%         $3.1M  +12% │
│              ├───────────────────────────────────┤
│ Ship Owning  │ FLEET UTILISATION    CASH POSITION│
│    🟢        │  82% ▲               $8.2M        │
│  $8.2M TCE   ├───────────────────────────────────┤
│              │ OVERDUE RECEIVABLES  OPEN DEFECTS │
│ Ship Mgmt    │  $420K 🟡            14 🔴         │
│    🟡        ├───────────────────────────────────┤
│  4 managed   │ 12-MONTH REVENUE TREND             │
│              │ [Line chart, gold line, 12 pts]   │
│ River Barges │                                   │
│    🟢        ├───────────────────────────────────┤
│  5 vessels   │ CRITICAL ITEMS (3)                 │
│              │ [Same 3 cards as iPhone, larger]  │
│ Repairing    │                                   │
│    🔴        └───────────────────────────────────┘
│  2 dry docks │
└──────────────┘
```

**Portrait layout:** Stack verticals row at top (2×2 grid), KPIs below as 2-column grid, chart full-width.

**Interaction rules:**
- Tapping a vertical tile navigates to that vertical's detail tab
- KPI cards tap to show sparkline + 12-month detail in a popover
- Critical items are full tappable cards — slide up a detail sheet
- AI briefing: tap to expand full text. Tap again to collapse.

---

### 4.3 iPad — Fleet Status Tab

```
┌─────────────────────────────────────────────────────┐
│  FLEET STATUS  [9 vessels]  ●Live  [Filter ▼]       │
├──────┬──────────────┬────────┬────────┬──────┬──────┤
│Status│Vessel        │Type    │Position│TCE/d │Util% │
├──────┼──────────────┼────────┼────────┼──────┼──────┤
│ 🟢  │MT Prelude    │MR Tkr  │STS     │$18.2K│ 94% │
│ 🟡  │MT Anael      │MR Tkr  │Waiting │$15.1K│ 78% │
│ 🟢  │MT Nura Kara  │MR Tkr  │Laden   │$19.4K│ 97% │
│ 🔴  │MT Nura Bright│MR Tkr  │Port    │$0    │  0% │
│ 🟢  │Cosmos 1      │Barge   │River   │–     │ 88% │
│ ... │              │        │        │      │      │
└──────┴──────────────┴────────┴────────┴──────┴──────┘
[Map toggle ↗] [Chart view ↗]
```

Tapping any vessel row opens a bottom sheet — the vessel card:

```
┌─────────────────────────────────┐
│ MT NURA BRIGHT          🔴 IDLE │
│ MR Product Tanker · 45,000 DWT  │
├─────────────────────────────────┤
│ Current voyage:  —              │
│ Last port:       Fujairah        │
│ Open defects:    3 (1 critical) │
│ Cert expiry:     12 days 🔴     │
│ P&I insurer:     UK P&I Club    │
│ Commercial mode: Captive        │
├─────────────────────────────────┤
│ [View full vessel brief →]      │
└─────────────────────────────────┘
```

---

### 4.4 Laptop — Red Flags Tab

**This is the Chairman's most powerful tool in a 1:1 meeting.**

```
┌────────────────────────────────────────────────────────────────────┐
│  RED FLAGS & NON-COMPLIANCES                    [Export PDF] [⚙]  │
│  Last updated: Today 09:14                                         │
├───────────────────────────┬────────────────────────────────────────┤
│  FILTER BY:               │                                        │
│  [All] [Critical] [Watch] │  SUMMARY                              │
│  [Fleet] [Crew] [Legal]   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [Compliance] [Finance]   │  🔴 Critical    7   (↑3 this week)    │
│                           │  🟡 Watch      14   (↓2 this week)    │
│                           │  Total open    21                      │
├───────────────────────────┴────────────────────────────────────────┤
│                                                                    │
│  🔴  CERTIFICATE EXPIRY — MT Nura Bright DOC Cert        12 days  │
│      Target: Renewed before expiry | Actual: Pending renewal       │
│      Owner: Technical Supt.  [Raise query] [Mark resolved]         │
│                                                                    │
│  🔴  PSC DEFICIENCY OPEN — MT Prelude, Fujairah Port     18 days  │
│      Target: Close within 14 days | Actual: Response pending       │
│      Owner: Fleet Manager    [Raise query] [Mark resolved]         │
│                                                                    │
│  🔴  OVERDUE RECEIVABLE — Charterer XYZ Ltd              $180K    │
│      Target: 30-day terms | Actual: 61 days overdue                │
│      Owner: Finance Mgr.     [Raise query] [Mark resolved]         │
│                                                                    │
│  🟡  BUNKER STEM PENDING — MT Anael, Mumbai              3 days   │
│      ... (etc)                                                     │
└────────────────────────────────────────────────────────────────────┘
```

**Interaction rules:**
- "Raise query" opens a pre-composed WhatsApp/email template to the owner, with the flag detail pre-filled
- "Mark resolved" triggers a confirmation dialog, logs timestamp and user, removes from list
- Clicking anywhere on a flag row expands a full-width detail drawer below it
- Filter buttons are multi-select. "All" deselects filters.
- Export PDF generates a one-page flags summary (printable)

---

### 4.5 Laptop — Scenario Mapper Tab

```
┌─────────────────────────────────────────────────────────────────────┐
│  SCENARIO MAPPER — Group P&L Sensitivity                            │
├──────────────────────────┬──────────────────────────────────────────┤
│  ASSUMPTIONS             │  GROUP P&L IMPACT                        │
│                          │  ┌──────────────────────────────────────┐│
│  Fleet Utilisation       │  │ Base Revenue:    $12.4M / month      ││
│  [━━━━●──────] 82%       │  │ Modelled Rev:    $14.2M / month  ↑   ││
│                          │  │                                      ││
│  Avg TCE Rate ($/day)    │  │ Base EBITDA:     $3.1M              ││
│  [━━━━━━●────] $18,500   │  │ Modelled EBITDA: $4.0M          ↑   ││
│                          │  │                                      ││
│  Bunker Price ($/MT)     │  │ Delta:  +$0.9M EBITDA  (+29%)       ││
│  [━━●────────] $580      │  └──────────────────────────────────────┘│
│                          │                                          │
│  Vessels Under Mgmt      │  SENSITIVITY RANKING                     │
│  [●──────────] 4         │  1. Fleet Utilisation    ████████ HIGH   │
│                          │  2. TCE Rate             ██████   MED    │
│  USD/INR Rate            │  3. Vessels Managed      █████    MED    │
│  [━━━━━●─────] 83.5      │  4. Bunker Price         ██       LOW    │
│                          │  5. USD/INR              █        LOW    │
│  PRE-BUILT SCENARIOS     │                                          │
│  [Base] [Bull] [Bear]    │  [Save Scenario ▼] [Compare Two ▼]      │
│  [Red Sea] [Bunker Spike]│                                          │
└──────────────────────────┴──────────────────────────────────────────┘
```

**Rules:**
- Sliders update the P&L impact in real-time (no submit button)
- Sensitivity ranking re-calculates on every slider change
- "Save Scenario" prompts for a name, stores to local session
- "Compare Two" allows side-by-side of any two saved or pre-built scenarios
- Pre-built scenario buttons are pills — clicking one sets all sliders simultaneously with an animation

---

### 4.6 Laptop — Fleet Map Tab

Full-width map (Leaflet.js or Mapbox GL) with:

```
Dark basemap (Mapbox dark-v11 or CartoDB DarkMatter)
Vessel markers:
  - MR Tankers: 🔵 circle with vessel name label
  - Barges: 🟤 triangle with vessel name
  - Colour ring = status (green / amber / red)
  - Hover: show vessel card tooltip
  - Click: fly to vessel, open right panel

Right panel (280px, slides in on click):
  [Vessel Name]
  [Type + DWT]
  [Current position + coords]
  [Route: Last port → Next port]
  [ETA]
  [Status]
  [TCE this voyage]
  [Open defects badge]
  [View full brief →]

Top-left controls:
  [🗺 Satellite / Dark toggle]
  [All vessels / MR Tankers / Barges]
  [Show voyage routes toggle]

Top-right:
  [Fleet summary card — 9 vessels, 3 laden, 2 idle, 4 waiting]
```

---

## 5. Component Library — Reusable Patterns

### 5.1 KPI Card

```
┌──────────────────────────┐
│  LABEL            🟢 ●  │  ← --font-ui, 11px, uppercase + status dot
│                          │
│  $18,500                 │  ← --font-display, --text-2xl on laptop
│                          │    --text-xl on iPad, --text-xl on iPhone
│  ▲ 4.2%  vs last month  │  ← --font-body, --text-sm, --status-green
│                          │
│  ▂▃▄▅▆▇  sparkline      │  ← Optional 8-week sparkline (laptop only)
└──────────────────────────┘
Border-left: 3px solid --status-green (or amber/red)
Background: --bg-surface
```

### 5.2 Alert / Flag Row

```
┌──────────────────────────────────────────────────────────┐
│ ● [DOMAIN TAG]  Title of the flag           [Age] [Owner]│
│   Detail line — target vs actual                         │
│   [Action 1] [Action 2]                         [Expand ▼]
└──────────────────────────────────────────────────────────┘
```

### 5.3 Vessel Status Row (table)

```
● | Vessel Name | Type | Position | TCE/day | Utilisation | [→]
```
Row hover: `--bg-elevated`. Row tap/click: open vessel detail.

### 5.4 AI Briefing Block

```
┌──────────────────────────────────────────────────────┐
│  AI BRIEFING  ·  [Date]  ·  [Refresh ↺]             │
│  ──────────────────────────────────────────────────  │
│  [Body text, --font-body, --text-base,               │
│   line-height: 1.6, --text-primary]                  │
│                                                      │
│  Generated at 07:32  ·  [Read full brief →]          │
└──────────────────────────────────────────────────────┘
Background: linear-gradient from --bg-elevated to --bg-surface
Top border: 2px solid --gold
```

### 5.5 Market Pill

```
[BDI  1,842  ▲4.2%]
```
Background: `--bg-elevated`. Border: `--bg-border`. Text: label `--text-secondary`, value `--text-primary`, change `--status-green / red`.

---

## 6. Responsive Breakpoints

```css
/* iPhone — portrait primary */
@media (max-width: 430px) { /* iPhone layout rules */ }

/* iPad — landscape primary */
@media (min-width: 431px) and (max-width: 1024px) { /* iPad layout rules */ }

/* Laptop / Desktop */
@media (min-width: 1025px) { /* Full layout rules */ }
```

**Rules by breakpoint:**

| Element | iPhone | iPad | Laptop |
|---------|--------|------|--------|
| Sidebar | Hidden | Hidden | Fixed 220px |
| Tab bar | None | Top + bottom fixed | None |
| Home layout | Single column | Two-column landscape | Sidebar + main area |
| KPI numbers | --text-xl | --text-xl | --text-2xl |
| Charts | Hidden | Simplified (no legend) | Full with legend |
| Tables | Card list view | Scrollable table | Full table |
| Sparklines | Hidden | Hidden | Visible |
| Hover states | Disabled | Disabled | Active |

---

## 7. Motion & Interaction Design

### Principles
- Every number that updates should count up (not flash). Duration: 600ms, ease-out.
- Page transitions: fade + 8px upward translate. Duration: 200ms.
- Drawer/sheet open: slide up from bottom (mobile), slide in from right (laptop). Duration: 280ms, cubic-bezier(0.16, 1, 0.3, 1).
- Status dot pulse: 2-second CSS pulse animation on red dots only (urgent).
- Slider handle: smooth drag with live value update. No debounce — update on every frame.

### Loading States
- Skeleton screens, not spinners. Skeleton blocks use `--bg-elevated` with shimmer animation.
- AI briefing: show "Generating briefing..." with a pulsing gold dot while loading.
- Never block the entire screen. Load sections independently.

### Alerts / Toast Notifications
- Critical alerts (oil spill, MOB, PSC detention) slide in from top, red border, auto-dismiss after 8 seconds
- Warning alerts slide in from top, amber border, auto-dismiss after 5 seconds
- Tap to dismiss immediately
- Stack up to 3 alerts; 4th pushes oldest off

---

## 8. Data Display Conventions

### Numbers
- Revenue: `$12.4M` (never `$12,400,000` at summary level)
- TCE rates: `$18,500/day` (always with /day)
- Percentages: `82%` (no decimal unless variance, then `+4.2%`)
- Days: `12 days` (never `12d`)
- Dates: `12 Jun 2026` (never MM/DD/YY)
- Ages of alerts: `3 days`, `2 weeks`, `1 month` (human-readable, not exact dates)

### Variance Indicators
- Positive: `▲ 4.2%` in `--status-green`
- Negative: `▼ 3.1%` in `--status-red`
- Flat: `→ 0%` in `--text-muted`

### Empty States
- "No data" always shows as: `— ` (em dash, not blank, not N/A, not null)
- Empty flag list: "No open items. All systems green." in `--text-secondary`

---

## 9. Accessibility & Performance

### Accessibility
- All interactive elements minimum 44×44px tap target (iOS HIG compliance)
- Status always conveyed by colour + shape (dot) + label — never colour alone
- All charts have a data table fallback accessible via long-press / right-click
- Font size minimum 14px on mobile (system zoom must not break layout)

### Performance Targets
- Initial page load (iPhone, 4G): under 3 seconds
- Tab switch: under 150ms (client-side only, no refetch)
- AI briefing generation: show streaming output as it arrives
- Map tile load: progressive — show low-res then sharpen
- Data refresh: every 60 seconds, background — no loading state shown unless data is stale > 5 minutes

---

## 10. What This Build Does NOT Include (Phase 1 Scope Boundary)

The following are out of scope for this UI build and should not be built or stubbed in Phase 1:

- User authentication / login screen (handled separately)
- Admin panel / data upload interface
- Push notification configuration UI
- Multi-user role management screen
- Settings / preferences panel
- Any financial transaction flows (read-only dashboard only)

These will be specced in Phase 2.

---

## 11. Deliverable Checklist for Claude Code

Before considering any screen complete, verify:

- [ ] All colour values reference CSS tokens (no hardcoded hex)
- [ ] All spacing values are multiples of 8px
- [ ] Status indicators show colour + dot shape + label (never colour alone)
- [ ] All KPI numbers use `--font-display`
- [ ] All navigation labels use `--font-ui` uppercase
- [ ] iPhone layout has no sidebar, no tab bar, no hover states
- [ ] iPad layout loads in landscape-first orientation
- [ ] Laptop layout has persistent left sidebar
- [ ] Empty state is em dash `—` not blank/null/N/A
- [ ] Tap targets are minimum 44×44px on mobile
- [ ] Number animations count-up on load (not flash)
- [ ] Red status dots pulse, amber and green do not

---

*Document owner: KJ | For internal build use only | Not for client distribution*
*Dashboard live reference: https://gmpl-dashboard.vercel.app/*
