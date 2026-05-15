// ─── Goodearth Maritime — Dashboard Seed Data ─────────────────────────────
// Real fleet structure as at May 2026
// Dummy financials — replace with actual Zoho Books data via template

// ─── VESSELS ─────────────────────────────────────────────────────────────────
// MR Product Tankers — operated under Nura Shipco LLC / Goodearth Maritime
// Inland River Barges — operated under Goodearth Maritime directly (captive)

export const VESSELS = [
  // ── MR PRODUCT TANKERS ──────────────────────────────────────────────────
  {
    id:'V001', name:'MT Prelude', type:'MR Product Tanker', flag:'Marshall Islands',
    util:88, target:85, status:'amber',
    pos:'Arabian Gulf', route:'Fujairah → Jubail',
    crew:24, defects:1, certs:'ok',
    dwt:47200, built:2018, class:'DNV', imo:'9823041',
    mgr:'Capt. Ahmed Hassan', dayRate:20400, voyageDays:12,
    pl:214000,
    commercialMode:'pool',
    pool:'Hafnia Pool → transferring to Maersk Tankers Pool',
    poolEarningsEst:20400,
    acquired:'Aug 2025',
    lat:25.5, lng:56.1,
    note:'Transferring from Hafnia Pool to Maersk Tankers Pool — transition in progress',
  },
  {
    id:'V002', name:'MT Anael', type:'MR Product Tanker', flag:'Marshall Islands',
    util:95, target:88, status:'green',
    pos:'Red Sea', route:'Jeddah → Suez',
    crew:23, defects:0, certs:'ok',
    dwt:46800, built:2019, class:'BV', imo:'9871234',
    mgr:'Capt. Pradeep Nair', dayRate:19500, voyageDays:18,
    pl:312000,
    commercialMode:'tc',
    charterer:'Trafigura Pte Ltd',
    tcRate:19500,
    tcStart:'2026-01-15', tcEnd:'2027-01-14',
    acquired:'Jan 2026',
    lat:22.5, lng:38.2,
    note:'Time Charter to Trafigura — fixed rate $19,500/day until Jan 2027',
  },
  {
    id:'V003', name:'MT Nura Kara', type:'MR Product Tanker', flag:'Malta',
    util:92, target:88, status:'green',
    pos:'Persian Gulf', route:'Ras Tanura → Hamriyah',
    crew:24, defects:2, certs:'ok',
    dwt:47500, built:2017, class:'LR', imo:'9756123',
    mgr:'Capt. Liu Wei', dayRate:21200, voyageDays:8,
    pl:298000,
    commercialMode:'pool',
    pool:'Maersk Tankers Pool',
    poolEarningsEst:21200,
    acquired:'Mar 2026',
    lat:26.8, lng:50.8,
    note:'Operating in Maersk Tankers Pool — pool points allocation confirmed',
  },
  {
    id:'V004', name:'MT Nura Bright', type:'MR Product Tanker', flag:'Malta',
    util:82, target:80, status:'green',
    pos:'Gulf of Oman', route:'Hamriyah → Mumbai',
    crew:23, defects:1, certs:'ok',
    dwt:46500, built:2020, class:'DNV', imo:'9912345',
    mgr:'Capt. K. Menon', dayRate:0, voyageDays:14,
    pl:178000,
    commercialMode:'captive',
    charterer:'Goodearth Captive Cargoes',
    tcRate:0,
    acquired:'Apr 2026',
    lat:23.2, lng:59.1,
    note:'Dedicated to captive cargo operations — internal freight programme',
  },

  // ── INLAND RIVER BARGES ─────────────────────────────────────────────────
  {
    id:'B001', name:'Cosmos 1', type:'Inland River Barge', flag:'India',
    util:90, target:85, status:'green',
    pos:'Mandovi River, Goa', route:'Captive — Internal Cargo',
    crew:8, defects:0, certs:'ok',
    dwt:2100, built:2024, class:'IACS', imo:'N/A',
    mgr:'Barge Master', dayRate:0, voyageDays:0,
    pl:42000,
    commercialMode:'captive',
    charterer:'Goodearth Internal',
    acquired:'2024',
    lat:15.5, lng:73.8,
    note:'Inland River Barge — 2100 MT class IACS. Captive operations.',
  },
  {
    id:'B002', name:'Cosmos 2', type:'Inland River Barge', flag:'India',
    util:88, target:85, status:'green',
    pos:'Mandovi River, Goa', route:'Captive — Internal Cargo',
    crew:8, defects:0, certs:'ok',
    dwt:2100, built:2024, class:'IACS', imo:'N/A',
    mgr:'Barge Master', dayRate:0, voyageDays:0,
    pl:40000,
    commercialMode:'captive',
    charterer:'Goodearth Internal',
    acquired:'2024',
    lat:15.48, lng:73.82,
    note:'Inland River Barge — 2100 MT class IACS. Captive operations.',
  },
  {
    id:'B003', name:'Cosmos 3', type:'Inland River Barge', flag:'India',
    util:85, target:85, status:'green',
    pos:'Mandovi River, Goa', route:'Captive — Internal Cargo',
    crew:8, defects:1, certs:'ok',
    dwt:2100, built:2025, class:'IACS', imo:'N/A',
    mgr:'Barge Master', dayRate:0, voyageDays:0,
    pl:38000,
    commercialMode:'captive',
    charterer:'Goodearth Internal',
    acquired:'2025',
    lat:15.46, lng:73.84,
    note:'Inland River Barge — 2100 MT class IACS. Captive operations.',
  },
  {
    id:'B004', name:'Cosmos 4', type:'Inland River Barge', flag:'India',
    util:82, target:85, status:'amber',
    pos:'Mandovi River, Goa', route:'Captive — Internal Cargo',
    crew:8, defects:2, certs:'ok',
    dwt:2100, built:2025, class:'IACS', imo:'N/A',
    mgr:'Barge Master', dayRate:0, voyageDays:0,
    pl:35000,
    commercialMode:'captive',
    charterer:'Goodearth Internal',
    acquired:'2025',
    lat:15.44, lng:73.86,
    note:'Inland River Barge — 2100 MT class IACS. Captive operations.',
  },
  {
    id:'B005', name:'Cosmos 5', type:'Inland River Barge', flag:'India',
    util:78, target:85, status:'amber',
    pos:'Mandovi River, Goa', route:'Captive — Internal Cargo',
    crew:8, defects:0, certs:'warning',
    dwt:2100, built:2026, class:'IACS', imo:'N/A',
    mgr:'Barge Master', dayRate:0, voyageDays:0,
    pl:28000,
    commercialMode:'captive',
    charterer:'Goodearth Internal',
    acquired:'2026',
    lat:15.42, lng:73.88,
    note:'Inland River Barge — 2100 MT class IACS. Newest vessel — 2026 build.',
  },
]

// Commercial mode labels
export const COMMERCIAL_MODE_LABELS = {
  pool:    'Pool',
  tc:      'Time Charter',
  captive: 'Captive',
  spot:    'Spot',
}

// ─── EARNINGS WATERFALL ─────────────────────────────────────────────────────
// Per-vessel monthly P&L structure — amounts in USD
// Replace with actual Zoho Books data

export const VESSEL_EARNINGS = {
  'V001': {
    grossIncome:     612000,  // Pool earnings (est. $20,400/day × 30)
    brokerageComm:   7650,    // 1.25% of gross
    poolCommission:  30600,   // 5% pool commission
    opex:            225000,  // $7,500/day × 30
    insurancePnI:    18000,
    warRisk:         6000,
    shoreCosts:      12000,
    interest:        48000,
    repayment:       60000,
  },
  'V002': {
    grossIncome:     585000,  // TC $19,500/day × 30
    brokerageComm:   7313,    // 1.25%
    poolCommission:  0,       // No pool on TC
    opex:            225000,
    insurancePnI:    16500,
    warRisk:         8500,    // Higher — Red Sea exposure
    shoreCosts:      12000,
    interest:        46000,
    repayment:       58000,
  },
  'V003': {
    grossIncome:     636000,  // Pool earnings (est. $21,200/day × 30)
    brokerageComm:   7950,
    poolCommission:  31800,   // 5% Maersk Tankers pool commission
    opex:            225000,
    insurancePnI:    17000,
    warRisk:         5500,
    shoreCosts:      12000,
    interest:        49000,
    repayment:       62000,
  },
  'V004': {
    grossIncome:     420000,  // Captive — notional internal transfer price
    brokerageComm:   0,
    poolCommission:  0,
    opex:            225000,
    insurancePnI:    15500,
    warRisk:         4500,
    shoreCosts:      12000,
    interest:        44000,
    repayment:       55000,
  },
}

export const BREAKEVEN_PER_DAY = 7500   // USD/day all-in OPEX including DD + Insurance
export const BREAKEVEN_PER_MONTH = BREAKEVEN_PER_DAY * 30

export function calcWaterfall(e) {
  if (!e) return null
  const netOpIncome  = e.grossIncome - e.brokerageComm - e.poolCommission - e.opex - e.insurancePnI - e.warRisk - e.shoreCosts
  const netCashFlow  = netOpIncome - e.interest - e.repayment
  const dailyEarnings = e.grossIncome / 30
  const aboveBreakeven = dailyEarnings >= BREAKEVEN_PER_DAY
  return { ...e, netOpIncome, netCashFlow, dailyEarnings, aboveBreakeven }
}

// ─── VERTICALS ───────────────────────────────────────────────────────────────
export const VERTICALS = [
  { id:'shipown',  name:'Ship Owning',     rev:8.2,  ebitda:2.1,  prevRev:7.8,  trend:+5.1, status:'green', margin:'25.6', vessels:4, budget:8.0,  cash:4.2, receivables:1.8 },
  { id:'shipmgmt', name:'Ship Management', rev:4.5,  ebitda:1.8,  prevRev:4.3,  trend:+4.7, status:'green', margin:'40.0', vessels:4, budget:4.2,  cash:2.1, receivables:0.6 },
  { id:'barges',   name:'River Barges',    rev:1.8,  ebitda:0.9,  prevRev:1.5,  trend:+20.0,status:'green', margin:'50.0', vessels:5, budget:1.6,  cash:0.8, receivables:0.2 },
  { id:'shiprep',  name:'Ship Repairing',  rev:1.4,  ebitda:0.3,  prevRev:1.5,  trend:-6.7, status:'amber', margin:'21.4', vessels:0, budget:1.6,  cash:0.4, receivables:0.8 },
]

export const REVENUE_TREND = [
  {m:'Jun 25',r:14.2,e:3.8},{m:'Jul 25',r:15.8,e:4.2},{m:'Aug 25',r:13.1,e:3.1},
  {m:'Sep 25',r:16.4,e:4.6},{m:'Oct 25',r:17.2,e:5.1},{m:'Nov 25',r:18.1,e:5.4},
  {m:'Dec 25',r:19.4,e:6.1},{m:'Jan 26',r:16.8,e:4.8},{m:'Feb 26',r:15.3,e:4.1},
  {m:'Mar 26',r:17.9,e:5.3},{m:'Apr 26',r:18.6,e:5.7},{m:'May 26',r:15.9,e:5.0},
]

export const MARKET_DATA = [
  { label:'Baltic Dirty Tanker Index', value:'854',      delta:'+2.1%', up:true,  warn:false, context:'MR tanker proxy' },
  { label:'VLSFO Bunker (Fujairah)',   value:'$612/MT',  delta:'+2.8%', up:false, warn:false, context:'Main bunkering port' },
  { label:'Maersk Pool Rate (MR)',     value:'~$21,200', delta:'+4.2%', up:true,  warn:false, context:'Estimated pool TCE' },
  { label:'USD / INR',                 value:'₹83.4',    delta:'+0.3%', up:false, warn:false, context:'Mid-market' },
  { label:'Red Sea Risk',              value:'ELEVATED', delta:'Rerouting active', up:false, warn:true, context:'+12–15 days/voyage' },
]

export const CRITICAL_ITEMS = [
  { id:1, urg:'high',   title:'MT Prelude — Pool Transfer Pending',        detail:'Transferring from Hafnia to Maersk Tankers pool. Confirm allocation date with commercial team.',   action:'Confirm Transfer', assignee:'fleet_mgr' },
  { id:2, urg:'medium', title:'Cosmos 4 & 5 — Below Utilisation Target',   detail:'Both barges at 78–82% vs 85% target. Review cargo schedule with operations.',                     action:'Review Schedule',  assignee:'ops' },
  { id:3, urg:'medium', title:'Cosmos 5 — Certificate Expiry Warning',     detail:'Newest barge Cosmos 5 has expiring certification. Inland waterways authority renewal required.',   action:'Renew Certs',      assignee:'tech_supt' },
  { id:4, urg:'medium', title:'MT Nura Bright — Captive Cargo Utilisation','detail':'Captive cargo programme utilisation at 82%. Confirm forward cargo commitments.',                 action:'Review Programme', assignee:'ops' },
]

// ─── LEGAL MATTERS ───────────────────────────────────────────────────────────
export const LEGAL_MATTERS = [
  { id:'L001', type:'Charter Party Dispute',        party:'Petrochemical Corp Ltd', pos:'Claimant',   exp:2400000, next:'2026-06-14', event:'Arbitration Hearing',  status:'red',   spend:85000,  counsel:'Hill Dickinson LLP' },
  { id:'L002', type:'P&I Cargo Claim',              party:'Asian Chemical Holdings',pos:'Respondent', exp:890000,  next:'2026-07-02', event:'Pleadings Deadline',   status:'amber', spend:32000,  counsel:'Ince & Co' },
  { id:'L003', type:'Crew Personal Injury',         party:'Chief Engineer Ramirez', pos:'Respondent', exp:320000,  next:'2026-05-28', event:'Medical Assessment',   status:'red',   spend:18500,  counsel:'P&I Club' },
  { id:'L004', type:'Newbuilding Contract Dispute', party:'Timblo Drydocks Pvt Ltd',pos:'Claimant',   exp:4100000, next:'2026-08-19', event:'Expert Determination', status:'amber', spend:127000, counsel:'Watson Farley & Williams' },
]

export const HEARING_EVENTS = [
  { date:'2026-05-28', matter:'L003', label:'Crew Injury — Medical Assessment',    type:'red'   },
  { date:'2026-06-14', matter:'L001', label:'Petrochemical Corp — Arbitration',    type:'red'   },
  { date:'2026-07-02', matter:'L002', label:'Asian Chemical — Pleadings Due',      type:'amber' },
  { date:'2026-08-19', matter:'L004', label:'Timblo Drydocks — Expert Det.',       type:'amber' },
]

export const CERTIFICATES = [
  { vessel:'MT Prelude',   cert:'IOPP Certificate',              expires:'2026-06-20', days:38,  status:'amber' },
  { vessel:'Cosmos 5',     cert:'Inland Waterways Certificate',  expires:'2026-06-28', days:46,  status:'amber' },
  { vessel:'MT Anael',     cert:'MLC Certificate',               expires:'2026-07-10', days:58,  status:'amber' },
  { vessel:'MT Nura Kara', cert:'Class Renewal Survey',          expires:'2026-08-01', days:80,  status:'green' },
  { vessel:'MT Nura Bright',cert:'Safety Management Certificate',expires:'2026-09-15', days:125, status:'green' },
  { vessel:'Cosmos 1',     cert:'Port State Control',            expires:'2026-10-01', days:141, status:'green' },
]

export const RED_FLAGS = [
  { domain:'Fleet Operations',  item:'MT Prelude — Pool transition unconfirmed',     actual:'Hafnia',    target:'Maersk',      gap:'Transfer pending', status:'amber', vessel:'V001' },
  { domain:'Fleet Operations',  item:'Cosmos 4 — Below utilisation target',         actual:'82%',       target:'85%',         gap:'-3%',              status:'amber', vessel:'B004' },
  { domain:'Fleet Operations',  item:'Cosmos 5 — Below utilisation target',         actual:'78%',       target:'85%',         gap:'-7%',              status:'amber', vessel:'B005' },
  { domain:'Financial',         item:'MT Nura Bright — Captive vs breakeven',       actual:'$14K/d',    target:'$7.5K/d',     gap:'+$6.5K above',     status:'green', vessel:'V004' },
  { domain:'Financial',         item:'Ship Repairing revenue vs budget',            actual:'$1.4M',     target:'$1.6M',       gap:'-$0.2M',           status:'amber', vessel:null   },
  { domain:'Compliance',        item:'Cosmos 5 — Inland cert expiry 46 days',       actual:'46 days',   target:'60d buffer',  gap:'-14 days',         status:'amber', vessel:'B005' },
  { domain:'Compliance',        item:'MT Prelude — IOPP cert expiry 38 days',       actual:'38 days',   target:'60d buffer',  gap:'-22 days',         status:'amber', vessel:'V001' },
  { domain:'Legal',             item:'Arbitration briefing unconfirmed — 14 Jun',   actual:'Pending',   target:'7d prior',    gap:'—',                status:'red',   vessel:null   },
  { domain:'Legal',             item:'Timblo Drydocks — $4.1M exposure — Aug',      actual:'Active',    target:'Resolved',    gap:'3 months',         status:'amber', vessel:null   },
]

export const CREW = [
  { vesselId:'V001', vessel:'MT Prelude',    rank:'Master', name:'Capt. Ahmed Hassan',       nation:'Egypt',        signOn:'2026-02-14', signOff:'2026-08-14', certs:'ok',     relief:'Ready'   },
  { vesselId:'V002', vessel:'MT Anael',      rank:'Master', name:'Capt. Pradeep Nair',       nation:'India',        signOn:'2026-01-10', signOff:'2026-07-10', certs:'warning',relief:'Sourcing' },
  { vesselId:'V003', vessel:'MT Nura Kara',  rank:'Master', name:'Capt. Liu Wei',            nation:'China',        signOn:'2026-04-01', signOff:'2026-10-01', certs:'ok',     relief:'Ready'   },
  { vesselId:'V004', vessel:'MT Nura Bright',rank:'Master', name:'Capt. K. Menon',           nation:'India',        signOn:'2026-02-28', signOff:'2026-08-28', certs:'ok',     relief:'Ready'   },
  { vesselId:'B001', vessel:'Cosmos 1',      rank:'Master', name:'Barge Master Rodrigo S.',  nation:'Philippines',  signOn:'2026-03-01', signOff:'2026-09-01', certs:'ok',     relief:'N/A'     },
  { vesselId:'B002', vessel:'Cosmos 2',      rank:'Master', name:'Barge Master R. Kumar',    nation:'India',        signOn:'2026-01-15', signOff:'2026-07-15', certs:'ok',     relief:'Sourcing'},
  { vesselId:'B003', vessel:'Cosmos 3',      rank:'Master', name:'Barge Master J. Fernandez',nation:'Philippines',  signOn:'2026-04-10', signOff:'2026-10-10', certs:'ok',     relief:'Ready'   },
  { vesselId:'B004', vessel:'Cosmos 4',      rank:'Master', name:'Barge Master S. Singh',    nation:'India',        signOn:'2026-02-20', signOff:'2026-08-20', certs:'ok',     relief:'Ready'   },
  { vesselId:'B005', vessel:'Cosmos 5',      rank:'Master', name:'Barge Master A. Pillai',   nation:'India',        signOn:'2026-03-15', signOff:'2026-09-15', certs:'warning',relief:'Ready'   },
]

export const CREW_SIGNOFFS = [
  { vessel:'MT Anael',     name:'Capt. Pradeep Nair',        rank:'Master', date:'2026-07-10', days:58,  status:'amber', action:'Relief crew being sourced'    },
  { vessel:'Cosmos 2',     name:'Barge Master R. Kumar',     rank:'Master', date:'2026-07-15', days:63,  status:'amber', action:'Sourcing India-based relief'  },
  { vessel:'MT Nura Kara', name:'Capt. Liu Wei',             rank:'Master', date:'2026-10-01', days:141, status:'green', action:'On schedule'                  },
  { vessel:'MT Prelude',   name:'Capt. Ahmed Hassan',        rank:'Master', date:'2026-08-14', days:93,  status:'green', action:'On schedule'                  },
]

// ─── SCENARIO MAPPER ─────────────────────────────────────────────────────────
export const SCENARIO_PRESETS = {
  base:       { label:'Base Case',            util:88,  poolRate:21000, tcRate:19500, bunker:612, inr:83.4, extra:0, opex:7500 },
  bull:       { label:'Bull Case',            util:95,  poolRate:26000, tcRate:21000, bunker:580, inr:82.0, extra:1, opex:7300 },
  bear:       { label:'Bear Case',            util:72,  poolRate:14000, tcRate:16000, bunker:680, inr:86.0, extra:0, opex:7800 },
  redsea:     { label:'Red Sea Disruption',   util:80,  poolRate:23000, tcRate:19500, bunker:720, inr:84.5, extra:0, opex:8200 },
  bunkerspike:{ label:'Bunker Spike',         util:88,  poolRate:21000, tcRate:19500, bunker:850, inr:83.4, extra:0, opex:7500 },
}

export const SENSITIVITY = [
  { n:'Pool / TC Rate',   v:4.2 },
  { n:'Fleet Utilisation',v:3.6 },
  { n:'Fleet Size',       v:3.1 },
  { n:'Bunker Price',     v:2.8 },
  { n:'OPEX / Day',       v:1.9 },
  { n:'USD / INR',        v:1.4 },
]

export function calcPL(a) {
  const tankers = 4 + (a.extra || 0)
  const poolVessels = 2, tcVessels = 1, captiveVessels = 1
  const poolRev   = poolVessels * (a.util/100) * (a.poolRate||21000) * 365 / 1e6
  const tcRev     = tcVessels   * (a.util/100) * (a.tcRate||19500)   * 365 / 1e6
  const capRev    = captiveVessels * (a.util/100) * 14000             * 365 / 1e6
  const rev       = poolRev + tcRev + capRev
  const bunkCost  = tankers * (a.bunker * 25 * 365) / 1e6
  const opexCost  = tankers * a.opex * 365 / 1e6
  const ebitda    = rev - bunkCost - opexCost
  return {
    rev:    rev.toFixed(1),
    ebitda: ebitda.toFixed(1),
    margin: ((ebitda/rev)*100).toFixed(1),
    bunk:   bunkCost.toFixed(1),
    opex:   opexCost.toFixed(1),
    vessels: tankers,
  }
}

// ─── ACTIVE DEALS ────────────────────────────────────────────────────────────
export const ACTIVE_DEALS = [
  {
    id:'D001', name:'MT Prelude Acquisition', type:'Vessel Acquisition', status:'closed',
    purpose:'First MR tanker acquisition — entry into Hafnia pool with forward transfer to Maersk Tankers pool',
    highlights:'47,200 DWT MR Product Tanker, 2018 build, DNV class. Acquired August 2025. Immediately deployed into Hafnia pool. Pool transfer to Maersk Tankers in progress.',
    dealSize:28500000, equity:8550000, debt:19950000, leverage:70,
    projectIRR:13.8, equityIRR:21.4, cashRequired:8550000,
    stage:'Closed', counterparty:'Undisclosed Seller', lead:'Chairman / Finance Controller',
    targetClose:'2025-08-31', paybackYears:6.8, currency:'USD', vertical:'Ship Owning',
  },
  {
    id:'D002', name:'MT Anael Acquisition', type:'Vessel Acquisition', status:'closed',
    purpose:'Second MR tanker — secured with Trafigura TC providing immediate cash flow certainty',
    highlights:'46,800 DWT MR Product Tanker, 2019 build, BV class. TC with Trafigura Pte Ltd at $19,500/day until January 2027. Acquired January 2026.',
    dealSize:30200000, equity:9060000, debt:21140000, leverage:70,
    projectIRR:14.6, equityIRR:22.8, cashRequired:9060000,
    stage:'Closed', counterparty:'Undisclosed Seller / Trafigura Pte Ltd', lead:'Chairman / Finance Controller',
    targetClose:'2026-01-31', paybackYears:6.4, currency:'USD', vertical:'Ship Owning',
  },
  {
    id:'D003', name:'MT Nura Kara Acquisition', type:'Vessel Acquisition', status:'closed',
    purpose:'Third MR tanker — direct entry into Maersk Tankers pool at higher pool point allocation',
    highlights:'47,500 DWT MR Product Tanker, 2017 build, LR class. Deployed directly into Maersk Tankers pool. Acquired March 2026.',
    dealSize:27800000, equity:8340000, debt:19460000, leverage:70,
    projectIRR:13.2, equityIRR:20.6, cashRequired:8340000,
    stage:'Closed', counterparty:'Undisclosed Seller', lead:'Chairman / Finance Controller',
    targetClose:'2026-03-31', paybackYears:7.1, currency:'USD', vertical:'Ship Owning',
  },
  {
    id:'D004', name:'MT Nura Bright Acquisition', type:'Vessel Acquisition', status:'closed',
    purpose:'Fourth MR tanker — dedicated to captive cargo programme serving group trading operations',
    highlights:'46,500 DWT MR Product Tanker, 2020 build, DNV class. Dedicated captive cargo vessel. Acquired April 2026.',
    dealSize:32100000, equity:9630000, debt:22470000, leverage:70,
    projectIRR:12.8, equityIRR:19.4, cashRequired:9630000,
    stage:'Closed', counterparty:'Undisclosed Seller', lead:'Chairman / Finance Controller',
    targetClose:'2026-04-30', paybackYears:7.4, currency:'USD', vertical:'Ship Owning',
  },
  {
    id:'D005', name:'Fifth MR Tanker — Pipeline', type:'Vessel Acquisition', status:'pipeline',
    purpose:'Fleet expansion — fifth MR tanker to increase pool allocation and group earning power',
    highlights:'Target: 2018–2021 build MR Product Tanker, 45,000–50,000 DWT. Brokers engaged. Term sheet expected Q3 2026. Pool placement confirmed with Maersk Tankers.',
    dealSize:29000000, equity:8700000, debt:20300000, leverage:70,
    projectIRR:14.1, equityIRR:22.0, cashRequired:8700000,
    stage:'Origination', counterparty:'Various — broker-sourced', lead:'Chairman / Finance Controller',
    targetClose:'2026-09-30', paybackYears:6.6, currency:'USD', vertical:'Ship Owning',
  },
]

export const DEAL_STAGES = ['Origination','Indicative Terms','Due Diligence','Credit Approval','Documentation','Closed']

// ─── INSPECTIONS ─────────────────────────────────────────────────────────────
export const INSPECTIONS = [
  { id:'INS-001', vessel:'MT Nura Kara',  type:'PSC',       port:'Fujairah',     authority:'UAE MCA',           date:'2026-04-20', result:'pass', deficiencies:0,  detained:false, score:null, next:'2026-10-20' },
  { id:'INS-002', vessel:'MT Prelude',    type:'SIRE',      port:'Hamriyah',     authority:'Vetting Inspector', date:'2026-04-05', result:'pass', deficiencies:2,  detained:false, score:91,   next:'2026-10-05' },
  { id:'INS-003', vessel:'MT Anael',      type:'PSC',       port:'Jeddah',       authority:'Saudi MAWANI',      date:'2026-03-28', result:'pass', deficiencies:1,  detained:false, score:null, next:'2026-09-28' },
  { id:'INS-004', vessel:'MT Nura Bright',type:'Oil Major', port:'Hamriyah',     authority:'Shell Vetting',     date:'2026-03-15', result:'pass', deficiencies:1,  detained:false, score:89,   next:'2026-09-15' },
  { id:'INS-005', vessel:'MT Nura Kara',  type:'SIRE',      port:'Ras Tanura',   authority:'Vetting Inspector', date:'2026-02-20', result:'pass', deficiencies:0,  detained:false, score:94,   next:'2026-08-20' },
  { id:'INS-006', vessel:'MT Prelude',    type:'Oil Major', port:'Fujairah',     authority:'BP Vetting',        date:'2026-01-28', result:'pass', deficiencies:2,  detained:false, score:87,   next:'2026-07-28' },
]

// ─── HSE ─────────────────────────────────────────────────────────────────────
export const HSE_INCIDENTS = [
  { id:'HSE-001', vessel:'MT Prelude',    type:'Near Miss', desc:'Slip on wet deck during night cargo watch — no injury',   date:'2026-05-08', severity:'low',  status:'closed', rootCause:'Inadequate lighting',    corrective:'LED lighting installed' },
  { id:'HSE-002', vessel:'MT Anael',      type:'Injury',    desc:'AB hand laceration during mooring — minor',              date:'2026-04-22', severity:'medium',status:'open',  rootCause:'PPE non-compliance',     corrective:'Safety training scheduled' },
  { id:'HSE-003', vessel:'Cosmos 4',      type:'Near Miss', desc:'Barge — rope caught on winch drum — no injury',          date:'2026-04-10', severity:'low',  status:'closed', rootCause:'Winch guard missing',    corrective:'Guard fitted' },
  { id:'HSE-004', vessel:'MT Nura Bright',type:'Near Miss', desc:'Cargo manifold valve open before hose connection',       date:'2026-03-30', severity:'high', status:'open',  rootCause:'Checklist not completed',corrective:'Dual-sign checklist enforced' },
]

export const HSE_KPI = {
  LTIF: 0.38, TRCF: 1.62, nearMisses: 4, openActions: 2,
  auditScore: 89, daysWithoutLTI: 156, industryLTIF: 0.68,
}

// ─── ALERTS ──────────────────────────────────────────────────────────────────
export const ALERTS = [
  { id:'AL001', ts:'09:38 GST', level:'critical', msg:'MT Prelude — IOPP Certificate expires in 38 days. Renewal survey required.',        vessel:'V001', dismissed:false },
  { id:'AL002', ts:'08:15 GST', level:'high',     msg:'Pool transfer briefing unconfirmed — Maersk Tankers allocation pending',            vessel:null,   dismissed:false },
  { id:'AL003', ts:'Yesterday', level:'medium',   msg:'Cosmos 5 — Inland Waterways Certificate expiring in 46 days',                      vessel:'B005', dismissed:false },
  { id:'AL004', ts:'Yesterday', level:'medium',   msg:'Cosmos 4 & 5 utilisation below 85% target — review cargo schedule',                vessel:null,   dismissed:false },
]

// ─── ACTION ITEMS ─────────────────────────────────────────────────────────────
export const ACTION_ITEMS = [
  { id:'A001', item:'Confirm MT Prelude pool transfer date — Maersk Tankers allocation', owner:'fleet_mgr', ownerName:'Ravi Kumar',    due:'2026-05-20', status:'open',    priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A002', item:'Book IOPP renewal survey for MT Prelude — expires 20 Jun',          owner:'tech_supt', ownerName:'S. Mehta',      due:'2026-05-25', status:'open',    priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A003', item:'Review Cosmos 4 & 5 cargo utilisation — optimise programme',        owner:'ops',       ownerName:'P. Singh',      due:'2026-05-22', status:'open',    priority:'medium', meeting:'BOD Meeting 08 May 2026' },
  { id:'A004', item:'Confirm Hill Dickinson briefing for 14 Jun arbitration',             owner:'legal',     ownerName:'Legal Counsel', due:'2026-06-07', status:'open',    priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A005', item:'Submit MT Anael relief master nomination to Trafigura',              owner:'manning',   ownerName:'J. Fernandez',  due:'2026-06-10', status:'open',    priority:'medium', meeting:'Ops Review 12 May 2026'  },
  { id:'A006', item:'Obtain broker shortlist for fifth MR tanker acquisition',            owner:'fleet_mgr', ownerName:'Ravi Kumar',    due:'2026-06-01', status:'open',    priority:'medium', meeting:'BOD Meeting 08 May 2026' },
]

// ─── GROUP ENTITIES ──────────────────────────────────────────────────────────
export const GROUP_ENTITIES = [
  {
    id:'gmpl', name:'Goodearth Maritime Private Limited', short:'Goodearth',
    type:'Parent Holding Company', jurisdiction:'India / UAE',
    role:'Group parent — Ship Owning, Ship Management, River Barge Operations, Ship Repairing',
    vessels:['V001','V002','V003','V004','B001','B002','B003','B004','B005'],
    pl:{ rev:15.9, ebitda:5.1 }, status:'active', established:2004,
  },
  {
    id:'nura', name:'Nura Shipco LLC', short:'Nura Shipco',
    type:'Ship Owning SPV', jurisdiction:'UAE (Ras Al Khaimah FTZ)',
    role:'SPV holding MR tanker mortgages and charter contracts — ring-fencing for lender security and tax efficiency',
    vessels:['V001','V002','V003','V004'],
    pl:{ rev:8.6, ebitda:2.4 }, status:'active', established:2022,
  },
  {
    id:'nura_mgmt', name:'Nura ShipCo Management Pte Ltd', short:'Nura ShipCo Mgmt',
    type:'Ship Management Company', jurisdiction:'Singapore',
    role:'Technical and commercial ship management — crewing, maintenance, compliance, and commercial operations for all Goodearth tankers',
    vessels:['V001','V002','V003','V004'],
    pl:{ rev:4.5, ebitda:1.8 }, status:'active', established:2023,
  },
]

// ─── NURA SHIPCO CHARTER CONTRACTS ───────────────────────────────────────────
export const NURA_CHARTERS = [
  {
    id:'CP-001', vessel:'MT Anael', charterer:'Trafigura Pte Ltd',
    type:'Time Charter', rate:19500, currency:'USD/day',
    start:'2026-01-15', end:'2027-01-14',
    status:'active', paymentStatus:'Current', netTCE:18200, nextHire:'1 Jun 2026',
    notes:'Fixed rate TC — no pool exposure. Trafigura redelivery at expiry.',
  },
  {
    id:'CP-002', vessel:'MT Prelude', charterer:'Hafnia Pool (→ Maersk Tankers)',
    type:'Pool Agreement', rate:20400, currency:'USD/day (est.)',
    start:'2025-09-01', end:'Ongoing',
    status:'active', paymentStatus:'Current', netTCE:18900, nextHire:'Monthly distribution',
    notes:'Transferring to Maersk Tankers pool. Transition date TBC with commercial team.',
  },
  {
    id:'CP-003', vessel:'MT Nura Kara', charterer:'Maersk Tankers Pool',
    type:'Pool Agreement', rate:21200, currency:'USD/day (est.)',
    start:'2026-03-20', end:'Ongoing',
    status:'active', paymentStatus:'Current', netTCE:19600, nextHire:'Monthly distribution',
    notes:'Pool points allocation confirmed. Monthly earnings distributed by Maersk Tankers.',
  },
  {
    id:'CP-004', vessel:'MT Nura Bright', charterer:'Goodearth Internal Cargo Programme',
    type:'Captive Cargo', rate:0, currency:'Internal transfer price',
    start:'2026-04-20', end:'Ongoing',
    status:'active', paymentStatus:'Current', netTCE:14000, nextHire:'N/A — Internal',
    notes:'Dedicated captive cargo vessel. Earnings based on internal freight programme economics.',
  },
]

// ─── CONNECTORS ──────────────────────────────────────────────────────────────
export const CONNECTORS = [
  { name:'Zoho Books',              status:'connected', org:'Goodearth Finance Suite', detail:'P&L, invoices & bank accounts live',     module:'finance' },
  { name:'Zoho Expense',            status:'connected', org:'Goodearth Finance Suite', detail:'Expense reports synced',                  module:'expense' },
  { name:'Zoho Payroll',            status:'connected', org:'Goodearth Finance Suite', detail:'Crew & staff payroll',                    module:'payroll' },
  { name:'FURUNO / MarineTraffic',  status:'pending',   org:'AIS Fleet Tracking',      detail:'Subscription procurement in progress',   module:'ais'     },
  { name:'P&I Club API',            status:'connected', org:'UK P&I Club',             detail:'Claims module live',                      module:'pi'      },
]

export const ZOHO_SUITE = {
  label:'Zoho Finance Suite',
  description:"Goodearth's primary ERP — Zoho Books, Expense, and Payroll are connected as the single source of financial truth across all group entities.",
  modules:['Zoho Books','Zoho Expense','Zoho Payroll','Zoho CRM'],
  orgId:'10229182', region:'UAE (zoho.com)',
}

// ─── TEAM ────────────────────────────────────────────────────────────────────
export const TEAM = [
  { id:'fleet_mgr', name:'Ravi Kumar',         role:'Fleet Manager',            email:'ravi.kumar@goodearth-maritime.com' },
  { id:'tech_supt', name:'S. Mehta',           role:'Technical Superintendent', email:'s.mehta@goodearth-maritime.com'    },
  { id:'finance',   name:'N. Pillai',          role:'Finance Controller',       email:'n.pillai@goodearth-maritime.com'   },
  { id:'ops',       name:'P. Singh',           role:'Operations Manager',       email:'p.singh@goodearth-maritime.com'    },
  { id:'manning',   name:'J. Fernandez',       role:'Manning Superintendent',   email:'j.fernandez@goodearth-maritime.com'},
  { id:'legal',     name:'Hill Dickinson LLP', role:'External Legal Counsel',   email:'gmpl@hilldickinson.com'            },
]
