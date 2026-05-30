// ─── Goodearth Maritime — Dashboard Seed Data v3 ─────────────────────────────

// ─── CORPORATE STRUCTURE ─────────────────────────────────────────────────────
export const GROUP_ENTITIES = [
  {
    id:'gmpl', name:'Goodearth Maritime Private Limited', short:'Goodearth',
    type:'Parent Holding Company', jurisdiction:'India / UAE',
    role:'Ultimate parent — Ship Owning, Ship Management, River Barge Operations, Ship Repairing',
    level:1, parentId:null, vessels:['V001','V002','V003','V004','B001','B002','B003','B004','B005'],
    pl:{ rev:15.9, ebitda:5.1 }, established:2004, color:'#C9A457', dormant:false,
  },
  {
    id:'nis', name:'Nura International Shipping Pte Ltd', short:'NIS Pte Ltd',
    type:'Intermediate Holding Company', jurisdiction:'Singapore',
    role:'Intermediate holding company for all vessel-owning SPVs and ship management entities under Goodearth group',
    level:2, parentId:'gmpl', vessels:['V001','V002','V003','V004'],
    pl:{ rev:13.2, ebitda:3.9 }, established:2021, color:'#3B9EFF', dormant:false,
  },
  {
    id:'nsm', name:'Nura ShipCo Management Pte Ltd', short:'NSM Pte Ltd',
    type:'Ship Management Company', jurisdiction:'Singapore',
    role:'Technical and commercial ship management — crewing, maintenance, vetting, compliance for MT Prelude and MT Anael',
    level:3, parentId:'nis', vessels:['V001','V002'],
    pl:{ rev:5.4, ebitda:1.6 }, established:2023, color:'#10D9A0', dormant:false,
  },
  {
    id:'nura_shipco', name:'Nura ShipCo LLC', short:'Nura ShipCo LLC',
    type:'Ship Owning SPV', jurisdiction:'UAE (Ras Al Khaimah FTZ)',
    role:'Independent entity — no vessel assets currently assigned',
    level:3, parentId:'nis', vessels:[],
    pl:{ rev:0, ebitda:0 }, established:2022, color:'#6A8FAA', dormant:true,
  },
  {
    id:'nura_kara_spv', name:'Nura Kara SPV', short:'Nura Kara SPV',
    type:'Single-Purpose Vehicle', jurisdiction:'UAE (Ras Al Khaimah FTZ)',
    role:'Dedicated SPV for MT Nura Kara — vessel mortgage and pool agreement ring-fenced for lender security',
    level:3, parentId:'nis', vessels:['V003'],
    pl:{ rev:2.1, ebitda:0.7 }, established:2026, color:'#F59E0B', dormant:false,
  },
  {
    id:'nura_bright_spv', name:'Nura Bright SPV', short:'Nura Bright SPV',
    type:'Single-Purpose Vehicle', jurisdiction:'UAE (Ras Al Khaimah FTZ)',
    role:'Dedicated SPV for MT Nura Bright — captive cargo operations',
    level:3, parentId:'nis', vessels:['V004'],
    pl:{ rev:1.4, ebitda:0.5 }, established:2026, color:'#14B8A6', dormant:false,
  },
]

export const NURA_CHARTERS = [
  { id:'CP-001', vessel:'MT Anael',      charterer:'Trafigura Pte Ltd',                  type:'Time Charter',  rate:19500, currency:'USD/day', start:'2026-01-15', end:'2027-01-14', status:'active', paymentStatus:'Current',  netTCE:18200, nextHire:'1 Jun 2026', notes:'Fixed rate TC — redelivery at expiry.' },
  { id:'CP-002', vessel:'MT Prelude',    charterer:'Hafnia Pool → Maersk Tankers Pool',  type:'Pool Agreement',rate:20400, currency:'USD/day (est.)', start:'2025-09-01', end:'Ongoing', status:'active', paymentStatus:'Current',  netTCE:18900, nextHire:'Monthly distribution', notes:'Pool transfer in progress.' },
  { id:'CP-003', vessel:'MT Nura Kara',  charterer:'Maersk Tankers Pool',                type:'Pool Agreement',rate:21200, currency:'USD/day (est.)', start:'2026-03-20', end:'Ongoing', status:'active', paymentStatus:'Current',  netTCE:19600, nextHire:'Monthly distribution', notes:'Pool points allocation confirmed.' },
  { id:'CP-004', vessel:'MT Nura Bright',charterer:'Goodearth Internal Cargo Programme', type:'Captive Cargo', rate:0,     currency:'Internal',       start:'2026-04-20', end:'Ongoing', status:'active', paymentStatus:'Current',  netTCE:14000, nextHire:'N/A — Internal', notes:'Dedicated captive cargo vessel.' },
]

// ─── SHIPPING PARTNERS ────────────────────────────────────────────────────────
export const SHIPPING_PARTNERS = [
  { name:'Maersk Tankers', role:'Pool Operator', vessels:['MT Prelude (transfer)','MT Nura Kara'], color:'#00243D', website:'https://www.maersktankers.com' },
  { name:'Hafnia',         role:'Pool Operator (outgoing)', vessels:['MT Prelude'], color:'#004B87', website:'https://www.hafnia.com' },
  { name:'Trafigura',      role:'TC Charterer',  vessels:['MT Anael'], color:'#E30613', website:'https://www.trafigura.com' },
  { name:'UK P&I Club',    role:'P&I Insurer',   vessels:['All tankers'], color:'#003366', website:'https://www.ukpandi.com' },
  { name:'Skuld',          role:'H&M Insurer',   vessels:['MT Prelude','MT Nura Bright'], color:'#1A3C6E', website:'https://www.skuld.com' },
  { name:'Norwegian Hull Club',role:'H&M Insurer',vessels:['MT Anael'], color:'#B22222', website:'https://www.norclub.no' },
  { name:'Gard',           role:'H&M Insurer',   vessels:['MT Nura Kara'], color:'#005587', website:'https://www.gard.no' },
]

// ─── VESSELS ─────────────────────────────────────────────────────────────────
export const VESSELS = [
  { id:'V001', name:'MT Prelude',     type:'MR Product Tanker', flag:'Marshall Islands', util:88, target:85, status:'amber', pos:'East Mediterranean',route:'Mediterranean → Dortyol, Turkey',crew:24, defects:1, certs:'ok',      dwt:47200, built:2018, class:'DNV', imo:'9823041', mgr:'Capt. Ahmed Hassan',        dayRate:20400, voyageDays:12, pl:214000, commercialMode:'pool',    pool:'Hafnia Pool → Maersk Tankers',   charterer:null,              acquired:'Aug 2025', entity:'nsm',            lat:36.8, lng:36.1, note:'Transferring from Hafnia to Maersk Tankers Pool', rob_vlsfo:420, rob_mdo:38, eta:'02 Jun 2026', nextPort:'Dortyol, Turkey', latDisplay:'36°14\'N', lngDisplay:'036°08\'E', insurer_hm:'Skuld', insurer_pi:'UK P&I Club', loh_covered:true, insured_value:28500000 },
  { id:'V002', name:'MT Anael',       type:'MR Product Tanker', flag:'Marshall Islands', util:95, target:88, status:'green', pos:'Conakry, Guinea', route:'Atlantic → Conakry',         crew:23, defects:0, certs:'ok',      dwt:46800, built:2019, class:'BV',  imo:'9871234', mgr:'Capt. Pradeep Nair',        dayRate:19500, voyageDays:18, pl:312000, commercialMode:'tc',      pool:null,                             charterer:'Trafigura Pte Ltd', acquired:'Jan 2026', entity:'nsm',            lat:9.5,  lng:-13.7, note:'TC to Trafigura $19,500/day until Jan 2027', rob_vlsfo:180, rob_mdo:22, eta:'04 Jun 2026', nextPort:'Conakry, Guinea — discharging', latDisplay:'09°31\'N', lngDisplay:'013°42\'W', insurer_hm:'Norwegian Hull Club', insurer_pi:'UK P&I Club', loh_covered:true, insured_value:30200000 },
  { id:'V003', name:'MT Nura Kara',   type:'MR Product Tanker', flag:'Malta',            util:92, target:88, status:'green', pos:'China Coast',     route:'En route → Shanghai',        crew:24, defects:2, certs:'ok',      dwt:47500, built:2017, class:'LR',  imo:'9756123', mgr:'Capt. Liu Wei',             dayRate:21200, voyageDays:8,  pl:298000, commercialMode:'pool',    pool:'Maersk Tankers Pool',            charterer:null,              acquired:'Mar 2026', entity:'nura_kara_spv',  lat:30.7, lng:122.4, note:'Maersk Tankers Pool — pool points confirmed', rob_vlsfo:310, rob_mdo:41, eta:'08 Jun 2026', nextPort:'Shanghai, China', latDisplay:'30°42\'N', lngDisplay:'122°24\'E', insurer_hm:'Gard', insurer_pi:'UK P&I Club', loh_covered:true, insured_value:27800000 },
  { id:'V004', name:'MT Nura Bright', type:'MR Product Tanker', flag:'Malta',            util:82, target:80, status:'green', pos:'Indian Coast',    route:'Indian Coast — slow speed',  crew:23, defects:1, certs:'ok',      dwt:46500, built:2020, class:'DNV', imo:'9912345', mgr:'Capt. K. Menon',            dayRate:0,     voyageDays:14, pl:178000, commercialMode:'captive', pool:null,                             charterer:'Goodearth Internal', acquired:'Apr 2026', entity:'nura_bright_spv',lat:15.5, lng:73.8, note:'Formerly ELVITA R. Dedicated captive cargo operations — Archean Chemical.', rob_vlsfo:95, rob_mdo:18, eta:'03 Jun 2026', nextPort:'Mumbai, India', latDisplay:'15°30\'N', lngDisplay:'073°48\'E', insurer_hm:'Skuld', insurer_pi:'UK P&I Club', loh_covered:true, insured_value:32100000 },
  { id:'B001', name:'Cosmos 1',       type:'Inland River Barge',flag:'India',            util:90, target:85, status:'green', pos:'Port Jakhau, Gujarat',route:'Jakhau Salt Jetty → Export Markets', crew:8,  defects:0, certs:'ok',      dwt:2100,  built:2024, class:'IACS',imo:'N/A',    mgr:'Barge Master',              dayRate:0,     voyageDays:0,  pl:42000,  commercialMode:'captive', pool:null, charterer:'Goodearth Internal', acquired:'2024', entity:'gmpl', lat:23.14, lng:68.35, note:'Captive cargo — Archean Chemical salt exports to Japan, South Korea, China' },
  { id:'B002', name:'Cosmos 2',       type:'Inland River Barge',flag:'India',            util:88, target:85, status:'green', pos:'Port Jakhau, Gujarat',route:'Jakhau Salt Jetty → Export Markets', crew:8,  defects:0, certs:'ok',      dwt:2100,  built:2024, class:'IACS',imo:'N/A',    mgr:'Barge Master',              dayRate:0,     voyageDays:0,  pl:40000,  commercialMode:'captive', pool:null, charterer:'Goodearth Internal', acquired:'2024', entity:'gmpl', lat:23.44, lng:68.65, note:'Captive cargo — Archean Chemical salt exports to Japan, South Korea, China' },
  { id:'B003', name:'Cosmos 3',       type:'Inland River Barge',flag:'India',            util:85, target:85, status:'green', pos:'Port Jakhau, Gujarat',route:'Jakhau Salt Jetty → Export Markets', crew:8,  defects:1, certs:'ok',      dwt:2100,  built:2025, class:'IACS',imo:'N/A',    mgr:'Barge Master',              dayRate:0,     voyageDays:0,  pl:38000,  commercialMode:'captive', pool:null, charterer:'Goodearth Internal', acquired:'2025', entity:'gmpl', lat:22.84, lng:68.65, note:'Captive cargo — Archean Chemical salt exports to Japan, South Korea, China' },
  { id:'B004', name:'Cosmos 4',       type:'Inland River Barge',flag:'India',            util:82, target:85, status:'amber', pos:'Port Jakhau, Gujarat',route:'Jakhau Salt Jetty → Export Markets', crew:8,  defects:2, certs:'ok',      dwt:2100,  built:2025, class:'IACS',imo:'N/A',    mgr:'Barge Master',              dayRate:0,     voyageDays:0,  pl:35000,  commercialMode:'captive', pool:null, charterer:'Goodearth Internal', acquired:'2025', entity:'gmpl', lat:23.44, lng:68.05, note:'Captive cargo — Archean Chemical salt exports to Japan, South Korea, China' },
  { id:'B005', name:'Cosmos 5',       type:'Inland River Barge',flag:'India',            util:78, target:85, status:'amber', pos:'Port Jakhau, Gujarat',route:'Jakhau Salt Jetty → Export Markets', crew:8,  defects:0, certs:'warning', dwt:2100,  built:2026, class:'IACS',imo:'N/A',    mgr:'Barge Master',              dayRate:0,     voyageDays:0,  pl:28000,  commercialMode:'captive', pool:null, charterer:'Goodearth Internal', acquired:'2026', entity:'gmpl', lat:22.84, lng:68.05, note:'Captive cargo — Archean Chemical salt exports to Japan, South Korea, China' },
]

export const COMMERCIAL_MODE_LABELS = { pool:'Pool', tc:'Time Charter', captive:'Captive', spot:'Spot' }
export const BREAKEVEN_PER_DAY   = 7500
export const BREAKEVEN_PER_MONTH = 7500 * 30

export const VESSEL_EARNINGS = {
  'V001':{ grossIncome:612000, brokerageComm:7650,  poolCommission:30600, opex:225000, insurancePnI:18000, warRisk:6000,  shoreCosts:12000, interest:48000, repayment:60000 },
  'V002':{ grossIncome:585000, brokerageComm:7313,  poolCommission:0,     opex:225000, insurancePnI:16500, warRisk:8500,  shoreCosts:12000, interest:46000, repayment:58000 },
  'V003':{ grossIncome:636000, brokerageComm:7950,  poolCommission:31800, opex:225000, insurancePnI:17000, warRisk:5500,  shoreCosts:12000, interest:49000, repayment:62000 },
  'V004':{ grossIncome:420000, brokerageComm:0,     poolCommission:0,     opex:225000, insurancePnI:15500, warRisk:4500,  shoreCosts:12000, interest:44000, repayment:55000 },
}

export function calcWaterfall(e) {
  if (!e) return null
  const netOpIncome = e.grossIncome - e.brokerageComm - e.poolCommission - e.opex - e.insurancePnI - e.warRisk - e.shoreCosts
  const netCashFlow = netOpIncome - e.interest - e.repayment
  const dailyEarnings = e.grossIncome / 30
  return { ...e, netOpIncome, netCashFlow, dailyEarnings, aboveBreakeven: dailyEarnings >= BREAKEVEN_PER_DAY }
}

// ─── FLEET GROWTH ─────────────────────────────────────────────────────────────
export const FLEET_GROWTH = [
  { label:'2004', vessels:1,  dwt:8000,   event:'Goodearth founded' },
  { label:'2008', vessels:2,  dwt:18000,  event:'Second vessel' },
  { label:'2012', vessels:3,  dwt:35000,  event:'Barge ops begin' },
  { label:'2016', vessels:4,  dwt:52000,  event:'First MR tanker' },
  { label:'2020', vessels:6,  dwt:88000,  event:'Cosmos 1 & 2' },
  { label:'2024', vessels:7,  dwt:95000,  event:'Cosmos 3' },
  { label:'Aug 25',vessels:8, dwt:142200, event:'MT Prelude — NIS formed' },
  { label:'Jan 26',vessels:9, dwt:189000, event:'MT Anael acquired' },
  { label:'Mar 26',vessels:10,dwt:236500, event:'MT Nura Kara' },
  { label:'Apr 26',vessels:11,dwt:283000, event:'MT Nura Bright' },
]

// ─── INSURANCE ───────────────────────────────────────────────────────────────
export const INSURANCE = [
  { id:'HM-001', category:'H&M',    vessel:'MT Prelude',     insurer:'Skuld Mutual P&I',           broker:'Inchcape Shipping', policyNo:'SKU-2025-47821', sumInsured:28500000, premium:185000, inception:'2025-08-01', expiry:'2026-08-01', daysToRenewal:80,  status:'amber', coverage:'Hull & Machinery — Total Loss, GA, Salvage' },
  { id:'HM-002', category:'H&M',    vessel:'MT Anael',       insurer:'Norwegian Hull Club',         broker:'AON Marine',        policyNo:'NHC-2026-00234', sumInsured:30200000, premium:196000, inception:'2026-01-15', expiry:'2027-01-15', daysToRenewal:247, status:'green', coverage:'Hull & Machinery — Total Loss, GA, Salvage' },
  { id:'HM-003', category:'H&M',    vessel:'MT Nura Kara',   insurer:'Gard P&I (Bermuda) Ltd',     broker:'Marsh Marine',      policyNo:'GAR-2026-58812', sumInsured:27800000, premium:178000, inception:'2026-03-20', expiry:'2027-03-20', daysToRenewal:311, status:'green', coverage:'Hull & Machinery — Total Loss' },
  { id:'HM-004', category:'H&M',    vessel:'MT Nura Bright', insurer:'Skuld Mutual P&I',           broker:'Inchcape Shipping', policyNo:'SKU-2026-52190', sumInsured:32100000, premium:208000, inception:'2026-04-20', expiry:'2027-04-20', daysToRenewal:342, status:'green', coverage:'Hull & Machinery — Total Loss, GA, Salvage' },
  { id:'PI-001',  category:'P&I',   vessel:'All Tankers',    insurer:'UK P&I Club',                broker:'Thomas Miller',     policyNo:'UK-2026-GMPL-01',sumInsured:null,     premium:320000, inception:'2026-02-20', expiry:'2027-02-20', daysToRenewal:283, status:'green', coverage:'Third party liability — cargo, crew, pollution, collision' },
  { id:'WR-001',  category:'War Risk',vessel:'MT Anael',     insurer:'Lloyd\'s of London',         broker:'AON Marine',        policyNo:'LLY-2026-WR-891',sumInsured:30200000, premium:48000,  inception:'2026-01-15', expiry:'2027-01-15', daysToRenewal:247, status:'green', coverage:'War risk including terrorism, piracy — Red Sea routing active' },
]

// ─── RENEWAL CALENDAR ────────────────────────────────────────────────────────
export const RENEWAL_ITEMS = [
  { id:'R001', category:'Insurance — H&M', item:'MT Prelude H&M',       due:'2026-08-01', daysLeft:80,  status:'amber', responsible:'Finance Controller', vessel:'MT Prelude'    },
  { id:'R002', category:'Certificate',     item:'MT Prelude IOPP Cert',  due:'2026-06-20', daysLeft:38,  status:'amber', responsible:'Tech Supt.',        vessel:'MT Prelude'    },
  { id:'R003', category:'Certificate',     item:'Cosmos 5 Inland Cert',  due:'2026-06-28', daysLeft:46,  status:'amber', responsible:'Tech Supt.',        vessel:'Cosmos 5'      },
  { id:'R004', category:'Certificate',     item:'MT Anael MLC Cert',     due:'2026-07-10', daysLeft:58,  status:'amber', responsible:'Tech Supt.',        vessel:'MT Anael'      },
  { id:'R005', category:'Class',           item:'MT Nura Kara Class Renewal',due:'2026-08-01',daysLeft:80,status:'amber', responsible:'DPA',               vessel:'MT Nura Kara'  },
  { id:'R006', category:'Insurance — P&I', item:'All Vessels P&I',       due:'2027-02-20', daysLeft:283, status:'green', responsible:'Finance Controller', vessel:'All Tankers'   },
  { id:'R007', category:'Insurance — H&M', item:'MT Anael H&M',          due:'2027-01-15', daysLeft:247, status:'green', responsible:'Finance Controller', vessel:'MT Anael'      },
  { id:'R008', category:'Provisions',      item:'MT Prelude Provisions',  due:'2026-06-15', daysLeft:33,  status:'amber', responsible:'Master',            vessel:'MT Prelude'    },
  { id:'R009', category:'Provisions',      item:'MT Anael Provisions',    due:'2026-07-01', daysLeft:49,  status:'amber', responsible:'Master',            vessel:'MT Anael'      },
  { id:'R010', category:'Lubes',           item:'MT Nura Kara Lubes',     due:'2026-06-30', daysLeft:48,  status:'amber', responsible:'Chief Engineer',    vessel:'MT Nura Kara'  },
  { id:'R011', category:'Bunkering',       item:'MT Prelude Next Bunker', due:'2026-05-28', daysLeft:15,  status:'red',   responsible:'Master',            vessel:'MT Prelude'    },
  { id:'R012', category:'Bunkering',       item:'MT Anael Next Bunker',   due:'2026-06-05', daysLeft:23,  status:'amber', responsible:'Master',            vessel:'MT Anael'      },
]

// ─── BUNKERING LOG ────────────────────────────────────────────────────────────
export const BUNKERING = [
  { id:'BNK-001', vessel:'MT Prelude',     date:'2026-05-02', port:'Fujairah',  grade:'VLSFO', qty:850, unit:'MT', pricePerTon:612, totalCost:520200, supplier:'ENOC Marine',           terms:'30 days net', quality:'ISO 8217 RMG380', sampleRetained:true, status:'completed' },
  { id:'BNK-002', vessel:'MT Anael',       date:'2026-04-28', port:'Jeddah',    grade:'VLSFO', qty:600, unit:'MT', pricePerTon:608, totalCost:364800, supplier:'Saudi Aramco Bunkers',  terms:'7 days net',  quality:'ISO 8217 RMG380', sampleRetained:true, status:'completed' },
  { id:'BNK-003', vessel:'MT Nura Kara',   date:'2026-05-08', port:'Hamriyah',  grade:'VLSFO', qty:920, unit:'MT', pricePerTon:615, totalCost:565800, supplier:'ENOC Marine',           terms:'30 days net', quality:'ISO 8217 RMG380', sampleRetained:true, status:'completed' },
  { id:'BNK-004', vessel:'MT Nura Bright', date:'2026-05-10', port:'Fujairah',  grade:'MGO',   qty:120, unit:'MT', pricePerTon:748, totalCost:89760,  supplier:'Peninsula Petroleum',   terms:'30 days net', quality:'ISO 8217 DMA',    sampleRetained:true, status:'completed' },
  { id:'BNK-005', vessel:'MT Prelude',     date:'2026-05-28', port:'Ras Tanura',grade:'VLSFO', qty:800, unit:'MT', pricePerTon:0,   totalCost:0,       supplier:'TBD — RFQ in progress', terms:'TBD',         quality:'ISO 8217 RMG380', sampleRetained:false,status:'planned'   },
]

// ─── POOL EARNINGS ────────────────────────────────────────────────────────────
export const POOL_EARNINGS = [
  { id:'PE-001', pool:'Maersk Tankers', vessel:'MT Nura Kara',  period:'Apr-26', grossEarnings:638400, poolDeductions:31920, netEarnings:606480, poolPoints:1.12, tce:21280, statement:'MT_NuraKara_Maersk_Apr2026.pdf', uploadDate:'2026-05-08' },
  { id:'PE-002', pool:'Hafnia',         vessel:'MT Prelude',     period:'Apr-26', grossEarnings:598200, poolDeductions:29910, netEarnings:568290, poolPoints:1.05, tce:19940, statement:'MT_Prelude_Hafnia_Apr2026.pdf',   uploadDate:'2026-05-10', note:'Final month in Hafnia pool' },
  { id:'PE-003', pool:'Maersk Tankers', vessel:'MT Nura Kara',   period:'Mar-26', grossEarnings:621000, poolDeductions:31050, netEarnings:589950, poolPoints:1.10, tce:20700, statement:'MT_NuraKara_Maersk_Mar2026.pdf', uploadDate:'2026-04-09' },
  { id:'PE-004', pool:'Hafnia',         vessel:'MT Prelude',     period:'Mar-26', grossEarnings:582000, poolDeductions:29100, netEarnings:552900, poolPoints:1.02, tce:19400, statement:'MT_Prelude_Hafnia_Mar2026.pdf',   uploadDate:'2026-04-11' },
  { id:'PE-005', pool:'Maersk Tankers', vessel:'MT Nura Kara',  period:'May-26', grossEarnings:654000, poolDeductions:32700, netEarnings:621300, poolPoints:1.14, tce:21710, statement:'MT_NuraKara_Maersk_May2026.pdf', uploadDate:'2026-05-10' },
  { id:'PE-006', pool:'Maersk Tankers', vessel:'MT Prelude',    period:'May-26', grossEarnings:612000, poolDeductions:30600, netEarnings:581400, poolPoints:1.08, tce:20460, statement:'MT_Prelude_Maersk_May2026.pdf',  uploadDate:'2026-05-10', note:'First month in Maersk Tankers Pool' },
]

// ─── AWARDS — BEST MASTER & CREW ─────────────────────────────────────────────
export const AWARD_CRITERIA_MASTER = [
  { id:'AM1', category:'Safety Leadership',       weight:25, desc:'Zero LTIs · Near-miss reporting rate · Drill compliance' },
  { id:'AM2', category:'Commercial Performance',  weight:20, desc:'Utilisation vs target · On-hire efficiency · Bunker vs Speed/Cons' },
  { id:'AM3', category:'Vetting & Compliance',    weight:20, desc:'SIRE score · PSC deficiencies · Oil Major vetting outcome' },
  { id:'AM4', category:'Cargo Care',              weight:15, desc:'Zero cargo claims · Tank cleaning results · Quantity disputes' },
  { id:'AM5', category:'Crew Management',         weight:10, desc:'Crew retention · Complaint rate · Crew feedback' },
  { id:'AM6', category:'Technical Stewardship',   weight:10, desc:'Defects raised proactively · Defects cleared on time' },
]
export const AWARD_CRITERIA_CREW = [
  { id:'AC1', category:'Collective Safety Record', weight:30, desc:'Zero LTIs · Near-miss frequency (higher = better culture)' },
  { id:'AC2', category:'Inspection Performance',   weight:25, desc:'Best PSC result · Best SIRE/Oil Major score' },
  { id:'AC3', category:'Operational Efficiency',   weight:20, desc:'Utilisation achievement · Bunker efficiency vs Speed/Cons' },
  { id:'AC4', category:'Cargo Record',             weight:15, desc:'Zero claims · Tank inspection first-time pass rate' },
  { id:'AC5', category:'Crew Wellbeing',           weight:10, desc:'Rest hour compliance · Shore leave · Satisfaction survey' },
]
export const AWARD_NOMINEES = [
  { id:'N001', type:'master', name:'Capt. Liu Wei',          vessel:'MT Nura Kara',  scores:{ AM1:23, AM2:19, AM3:20, AM4:14, AM5:9,  AM6:9  }, year:2026 },
  { id:'N002', type:'master', name:'Capt. Ahmed Hassan',     vessel:'MT Prelude',    scores:{ AM1:20, AM2:17, AM3:18, AM4:13, AM5:8,  AM6:8  }, year:2026 },
  { id:'N003', type:'master', name:'Capt. K. Menon',         vessel:'MT Nura Bright',scores:{ AM1:22, AM2:16, AM3:17, AM4:15, AM5:10, AM6:9  }, year:2026 },
  { id:'N004', type:'crew',   name:'MT Nura Kara Crew',      vessel:'MT Nura Kara',  scores:{ AC1:28, AC2:24, AC3:19, AC4:14, AC5:9  }, year:2026 },
  { id:'N005', type:'crew',   name:'MT Anael Crew',          vessel:'MT Anael',      scores:{ AC1:29, AC2:22, AC3:18, AC4:13, AC5:8  }, year:2026 },
]

// ─── MARKET DATA & BALTIC INDICES ────────────────────────────────────────────
export const MARKET_DATA = [
  { label:'Baltic Dirty Tanker Index (BDTI)', value:'854',      delta:'+2.1%', up:true,  warn:false, context:'MR tanker proxy'         },
  { label:'Baltic Clean Tanker Index (BCTI)', value:'712',      delta:'+1.8%', up:true,  warn:false, context:'Product tanker index'    },
  { label:'Baltic Dry Index (BDI)',           value:'1,842',    delta:'+3.2%', up:true,  warn:false, context:'Dry bulk indicator'      },
  { label:'VLSFO Bunker (Fujairah)',          value:'$612/MT',  delta:'+2.8%', up:false, warn:false, context:'Main bunkering port'     },
  { label:'MGO (Fujairah)',                   value:'$748/MT',  delta:'+1.2%', up:false, warn:false, context:'Distillate price'        },
  { label:'Maersk Pool TCE (MR est.)',        value:'~$21,200', delta:'+4.2%', up:true,  warn:false, context:'Pool earnings estimate'  },
  { label:'USD / INR',                        value:'₹83.4',    delta:'+0.3%', up:false, warn:false, context:'Mid-market'              },
  { label:'USD / EUR',                        value:'€0.924',   delta:'-0.2%', up:true,  warn:false, context:'Mid-market'              },
  { label:'USD / SGD',                        value:'S$1.344',  delta:'+0.1%', up:false, warn:false, context:'Singapore reference'     },
  { label:'Red Sea Risk',                     value:'ELEVATED', delta:'Rerouting active', up:false, warn:true, context:'+12–15 days/voyage' },
]

// ─── VERTICALS ───────────────────────────────────────────────────────────────
export const VERTICALS = [
  { id:'shipown',  name:'Ship Owning',    rev:8.2,  ebitda:2.1,  prevRev:7.8,  trend:+5.1, status:'green', margin:'25.6', vessels:4, budget:9.2, variance:-1.0, variancePct:-10.9, cash:4.2, receivables:1.8 },
  { id:'shipmgmt', name:'Ship Management',rev:4.5,  ebitda:1.8,  prevRev:4.3,  trend:+4.7, status:'green', margin:'40.0', vessels:4, budget:4.2, variance:0.3, variancePct:7.1, cash:2.1, receivables:0.6 },
  { id:'barges',   name:'River Barges',   rev:1.8,  ebitda:0.9,  prevRev:1.5,  trend:+20.0,status:'green', margin:'50.0', vessels:5, budget:1.6, variance:0.2, variancePct:12.5, cash:0.8, receivables:0.2 },
  { id:'shiprep',  name:'Ship Repairing', rev:1.4,  ebitda:0.3,  prevRev:1.5,  trend:-6.7, status:'amber', margin:'21.4', vessels:0, budget:1.6, variance:-0.2, variancePct:-12.5, cash:0.4, receivables:0.8 },
]

export const REVENUE_TREND = [
  {m:'Jun 25',r:14.2,e:3.8},{m:'Jul 25',r:15.8,e:4.2},{m:'Aug 25',r:13.1,e:3.1},
  {m:'Sep 25',r:16.4,e:4.6},{m:'Oct 25',r:17.2,e:5.1},{m:'Nov 25',r:18.1,e:5.4},
  {m:'Dec 25',r:19.4,e:6.1},{m:'Jan 26',r:16.8,e:4.8},{m:'Feb 26',r:15.3,e:4.1},
  {m:'Mar 26',r:17.9,e:5.3},{m:'Apr 26',r:18.6,e:5.7},{m:'May 26',r:15.9,e:5.0},
]

export const CRITICAL_ITEMS = [
  { id:1, urg:'high',   title:'MT Prelude — Pool Transfer Pending',      detail:'Transfer from Hafnia to Maersk Tankers pool. Confirm allocation date.',          action:'Confirm Transfer', assignee:'fleet_mgr' },
  { id:2, urg:'high',   title:'MT Prelude IOPP Cert — 38 Days',          detail:'IOPP Certificate expires 20 Jun. Renewal survey must be booked immediately.',    action:'Book Survey',      assignee:'tech_supt'  },
  { id:3, urg:'medium', title:'MT Prelude Bunker — 15 Days',             detail:'Next bunker due 28 May at Ras Tanura. RFQ in progress — confirm supplier.',      action:'Confirm RFQ',      assignee:'ops'        },
  { id:4, urg:'medium', title:'Cosmos 4 & 5 Below Utilisation Target',   detail:'Both at 78–82% vs 85% target. Review cargo schedule.',                           action:'Review Schedule',  assignee:'ops'        },
]

export const LEGAL_MATTERS = [
  { id:'L001', type:'Charter Party Dispute',        party:'Petrochemical Corp Ltd',  pos:'Claimant',   exp:2400000, next:'2026-06-14', event:'Arbitration Hearing',  status:'red',   spend:85000,  counsel:'Hill Dickinson LLP'          },
  { id:'L002', type:'P&I Cargo Claim',              party:'Asian Chemical Holdings', pos:'Respondent', exp:890000,  next:'2026-07-02', event:'Pleadings Deadline',   status:'amber', spend:32000,  counsel:'Ince & Co'                   },
  { id:'L003', type:'Crew Personal Injury',         party:'Chief Engineer Ramirez',  pos:'Respondent', exp:320000,  next:'2026-05-28', event:'Medical Assessment',   status:'red',   spend:18500,  counsel:'P&I Club'                    },
  { id:'L004', type:'Newbuilding Contract Dispute', party:'Timblo Drydocks Pvt Ltd', pos:'Claimant',   exp:4100000, next:'2026-08-19', event:'Expert Determination', status:'amber', spend:127000, counsel:'Watson Farley & Williams'     },
]

export const HEARING_EVENTS = [
  { date:'2026-05-28', matter:'L003', label:'Crew Injury — Medical Assessment',  type:'red'   },
  { date:'2026-06-14', matter:'L001', label:'Petrochemical Corp — Arbitration',  type:'red'   },
  { date:'2026-07-02', matter:'L002', label:'Asian Chemical — Pleadings',        type:'amber' },
  { date:'2026-08-19', matter:'L004', label:'Timblo Drydocks — Expert Det.',     type:'amber' },
]

export const CERTIFICATES = [
  { vessel:'MT Prelude',    cert:'IOPP Certificate',             expires:'2026-06-20', days:38,  status:'amber' },
  { vessel:'Cosmos 5',      cert:'Inland Waterways Certificate', expires:'2026-06-28', days:46,  status:'amber' },
  { vessel:'MT Anael',      cert:'MLC Certificate',              expires:'2026-07-10', days:58,  status:'amber' },
  { vessel:'MT Nura Kara',  cert:'Class Renewal Survey',         expires:'2026-08-01', days:80,  status:'green' },
  { vessel:'MT Nura Bright',cert:'Safety Management Certificate',expires:'2026-09-15', days:125, status:'green' },
]

export const RED_FLAGS = [
  { domain:'Fleet Operations', item:'MT Prelude — Pool transition unconfirmed',  actual:'Hafnia',  target:'Maersk',    gap:'Pending',   status:'amber', vessel:'V001' },
  { domain:'Fleet Operations', item:'Cosmos 4 — Below utilisation target',       actual:'82%',     target:'85%',       gap:'-3%',       status:'amber', vessel:'B004' },
  { domain:'Fleet Operations', item:'Cosmos 5 — Below utilisation target',       actual:'78%',     target:'85%',       gap:'-7%',       status:'amber', vessel:'B005' },
  { domain:'Compliance',       item:'MT Prelude IOPP cert expiry 38 days',       actual:'38 days', target:'60d buffer',gap:'-22 days',  status:'amber', vessel:'V001' },
  { domain:'Compliance',       item:'Cosmos 5 — Inland cert expiry 46 days',    actual:'46 days', target:'60d buffer',gap:'-14 days',  status:'amber', vessel:'B005' },
  { domain:'Compliance',       item:'3 vessels CII not submitted',               actual:'3',       target:'0',         gap:'+3',        status:'red',   vessel:null   },
  { domain:'Financial',        item:'Ship Repairing revenue vs budget',          actual:'$1.4M',   target:'$1.6M',     gap:'-$0.2M',    status:'amber', vessel:null   },
  { domain:'Legal',            item:'Arbitration briefing unconfirmed — 14 Jun', actual:'Pending', target:'7d prior',  gap:'—',         status:'red',   vessel:null   },
  { domain:'Bunkering',        item:'MT Prelude bunker RFQ not confirmed',       actual:'Open',    target:'Confirmed', gap:'15 days',   status:'red',   vessel:'V001' },
]

export const CREW = [
  { vesselId:'V001', vessel:'MT Prelude',    rank:'Master', name:'Capt. Ahmed Hassan',       nation:'Egypt',       signOn:'2026-02-14', signOff:'2026-08-14', certs:'ok',     relief:'Ready'   },
  { vesselId:'V002', vessel:'MT Anael',      rank:'Master', name:'Capt. Pradeep Nair',       nation:'India',       signOn:'2026-01-10', signOff:'2026-07-10', certs:'warning',relief:'Sourcing' },
  { vesselId:'V003', vessel:'MT Nura Kara',  rank:'Master', name:'Capt. Liu Wei',            nation:'China',       signOn:'2026-04-01', signOff:'2026-10-01', certs:'ok',     relief:'Ready'   },
  { vesselId:'V004', vessel:'MT Nura Bright',rank:'Master', name:'Capt. K. Menon',           nation:'India',       signOn:'2026-02-28', signOff:'2026-08-28', certs:'ok',     relief:'Ready'   },
  { vesselId:'B001', vessel:'Cosmos 1',      rank:'Master', name:'Barge Master R. Santos',   nation:'Philippines', signOn:'2026-03-01', signOff:'2026-09-01', certs:'ok',     relief:'N/A'     },
  { vesselId:'B002', vessel:'Cosmos 2',      rank:'Master', name:'Barge Master R. Kumar',    nation:'India',       signOn:'2026-01-15', signOff:'2026-07-15', certs:'ok',     relief:'Sourcing'},
  { vesselId:'B003', vessel:'Cosmos 3',      rank:'Master', name:'Barge Master J. Fernandez',nation:'Philippines', signOn:'2026-04-10', signOff:'2026-10-10', certs:'ok',     relief:'Ready'   },
  { vesselId:'B004', vessel:'Cosmos 4',      rank:'Master', name:'Barge Master S. Singh',    nation:'India',       signOn:'2026-02-20', signOff:'2026-08-20', certs:'ok',     relief:'Ready'   },
  { vesselId:'B005', vessel:'Cosmos 5',      rank:'Master', name:'Barge Master A. Pillai',   nation:'India',       signOn:'2026-03-15', signOff:'2026-09-15', certs:'warning',relief:'Ready'   },
]

export const CREW_SIGNOFFS = [
  { vessel:'MT Anael',    name:'Capt. Pradeep Nair', rank:'Master', date:'2026-07-10', days:58,  status:'amber', action:'Relief being sourced'        },
  { vessel:'Cosmos 2',    name:'Barge Master R. Kumar',rank:'Master',date:'2026-07-15', days:63,  status:'amber', action:'Sourcing India-based relief' },
  { vessel:'MT Nura Kara',name:'Capt. Liu Wei',       rank:'Master', date:'2026-10-01', days:141, status:'green', action:'On schedule'                 },
  { vessel:'MT Prelude',  name:'Capt. Ahmed Hassan',  rank:'Master', date:'2026-08-14', days:93,  status:'green', action:'On schedule'                 },
]

export const SCENARIO_PRESETS = {
  base:       { label:'Base Case',          util:88,  poolRate:21000, tcRate:19500, bunker:612, inr:83.4, extra:0, opex:7500 },
  bull:       { label:'Bull Case',          util:95,  poolRate:26000, tcRate:21000, bunker:580, inr:82.0, extra:1, opex:7300 },
  bear:       { label:'Bear Case',          util:72,  poolRate:14000, tcRate:16000, bunker:680, inr:86.0, extra:0, opex:7800 },
  redsea:     { label:'Red Sea Disruption', util:80,  poolRate:23000, tcRate:19500, bunker:720, inr:84.5, extra:0, opex:8200 },
  bunkerspike:{ label:'Bunker Spike',       util:88,  poolRate:21000, tcRate:19500, bunker:850, inr:83.4, extra:0, opex:7500 },
}
export const SENSITIVITY = [
  { n:'Pool / TC Rate',   v:4.2 }, { n:'Fleet Utilisation', v:3.6 },
  { n:'Fleet Size',       v:3.1 }, { n:'Bunker Price',      v:2.8 },
  { n:'OPEX / Day',       v:1.9 }, { n:'USD / INR',         v:1.4 },
]
export function calcPL(a) {
  const tankers = 4 + (a.extra||0)
  const rev   = (2*(a.util/100)*(a.poolRate||21000) + (a.util/100)*(a.tcRate||19500) + (a.util/100)*14000) * 365 / 1e6
  const bunk  = tankers*(a.bunker*25*365)/1e6
  const opex  = tankers*a.opex*365/1e6
  const ebitda = rev - bunk - opex
  return { rev:rev.toFixed(1), ebitda:ebitda.toFixed(1), margin:((ebitda/rev)*100).toFixed(1), bunk:bunk.toFixed(1), opex:opex.toFixed(1), vessels:tankers }
}

export const ACTIVE_DEALS = [
  { id:'D001', name:'MT Prelude Acquisition',     type:'Vessel Acquisition', status:'closed',   purpose:'Entry into Hafnia pool → Maersk Tankers', highlights:'47,200 DWT MR, 2018, DNV. Deployed into Hafnia pool. Transfer to Maersk Tankers in progress.',                        dealSize:28500000, equity:8550000,  debt:19950000, leverage:70, projectIRR:13.8, equityIRR:21.4, cashRequired:8550000, stage:'Closed',      counterparty:'Undisclosed', lead:'Chairman', targetClose:'2025-08-31', paybackYears:6.8, vertical:'Ship Owning' },
  { id:'D002', name:'MT Anael Acquisition',       type:'Vessel Acquisition', status:'closed',   purpose:'TC to Trafigura — fixed cash flow certainty', highlights:'46,800 DWT MR, 2019, BV. TC $19,500/day until Jan 2027.',                                                         dealSize:30200000, equity:9060000,  debt:21140000, leverage:70, projectIRR:14.6, equityIRR:22.8, cashRequired:9060000, stage:'Closed',      counterparty:'Trafigura Pte Ltd', lead:'Chairman', targetClose:'2026-01-31', paybackYears:6.4, vertical:'Ship Owning' },
  { id:'D003', name:'MT Nura Kara Acquisition',   type:'Vessel Acquisition', status:'closed',   purpose:'Maersk Tankers pool — higher pool points',    highlights:'47,500 DWT MR, 2017, LR. Direct entry into Maersk Tankers pool.',                                                 dealSize:27800000, equity:8340000,  debt:19460000, leverage:70, projectIRR:13.2, equityIRR:20.6, cashRequired:8340000, stage:'Closed',      counterparty:'Undisclosed', lead:'Chairman', targetClose:'2026-03-31', paybackYears:7.1, vertical:'Ship Owning' },
  { id:'D004', name:'MT Nura Bright Acquisition', type:'Vessel Acquisition', status:'closed',   purpose:'Captive cargo programme vessel',               highlights:'46,500 DWT MR, 2020, DNV. Dedicated captive cargo. Acquired Apr 2026.',                                           dealSize:32100000, equity:9630000,  debt:22470000, leverage:70, projectIRR:12.8, equityIRR:19.4, cashRequired:9630000, stage:'Closed',      counterparty:'Undisclosed', lead:'Chairman', targetClose:'2026-04-30', paybackYears:7.4, vertical:'Ship Owning' },
  { id:'D005', name:'Fifth MR Tanker — Pipeline', type:'Vessel Acquisition', status:'pipeline', purpose:'Fleet expansion — increase pool allocation',   highlights:'Target 2018–2021 build MR, 45–50K DWT. Brokers engaged. Pool placement confirmed with Maersk Tankers.',            dealSize:29000000, equity:8700000,  debt:20300000, leverage:70, projectIRR:14.1, equityIRR:22.0, cashRequired:8700000, stage:'Origination', counterparty:'Various — brokers', lead:'Chairman', targetClose:'2026-09-30', paybackYears:6.6, vertical:'Ship Owning' },
]
export const DEAL_STAGES = ['Origination','Indicative Terms','Due Diligence','Credit Approval','Documentation','Closed']

export const INSPECTIONS = [
  { id:'INS-001', vessel:'MT Nura Kara', type:'PSC',       port:'Fujairah',  authority:'UAE MCA',           date:'2026-04-20', result:'pass', deficiencies:0, detained:false, score:null, next:'2026-10-20' },
  { id:'INS-002', vessel:'MT Prelude',   type:'SIRE',      port:'Hamriyah',  authority:'Vetting Inspector', date:'2026-04-05', result:'pass', deficiencies:2, detained:false, score:91,   next:'2026-10-05' },
  { id:'INS-003', vessel:'MT Anael',     type:'PSC',       port:'Jeddah',    authority:'Saudi MAWANI',      date:'2026-03-28', result:'pass', deficiencies:1, detained:false, score:null, next:'2026-09-28' },
  { id:'INS-004', vessel:'MT Nura Bright',type:'Oil Major',port:'Hamriyah',  authority:'Shell Vetting',     date:'2026-03-15', result:'pass', deficiencies:1, detained:false, score:89,   next:'2026-09-15' },
  { id:'INS-005', vessel:'MT Nura Kara', type:'SIRE',      port:'Ras Tanura',authority:'Vetting Inspector', date:'2026-02-20', result:'pass', deficiencies:0, detained:false, score:94,   next:'2026-08-20' },
]

export const HSE_INCIDENTS = [
  { id:'HSE-001', vessel:'MT Prelude',    type:'Near Miss', desc:'Slip on wet deck during night cargo watch',           date:'2026-05-08', severity:'low',    status:'closed', rootCause:'Inadequate lighting',    corrective:'LED lighting installed'           },
  { id:'HSE-002', vessel:'MT Anael',      type:'Injury',    desc:'AB hand laceration during mooring — minor',          date:'2026-04-22', severity:'medium', status:'open',   rootCause:'PPE non-compliance',     corrective:'Safety training scheduled'        },
  { id:'HSE-003', vessel:'Cosmos 4',      type:'Near Miss', desc:'Rope caught on winch drum — no injury',              date:'2026-04-10', severity:'low',    status:'closed', rootCause:'Winch guard missing',    corrective:'Guard fitted'                     },
  { id:'HSE-004', vessel:'MT Nura Bright',type:'Near Miss', desc:'Cargo manifold valve open before hose connection',   date:'2026-03-30', severity:'high',   status:'open',   rootCause:'Checklist not completed',corrective:'Dual-sign checklist enforced'      },
]
export const HSE_KPI = { LTIF:0.38, TRCF:1.62, nearMisses:4, openActions:2, auditScore:89, daysWithoutLTI:156, industryLTIF:0.68 }

export const ALERTS = [
  { id:'AL001', ts:'09:38', level:'critical', msg:'MT Prelude — IOPP Certificate expires in 38 days. Renewal survey required immediately.',    vessel:'V001', dismissed:false },
  { id:'AL002', ts:'08:15', level:'high',     msg:'Pool transfer briefing unconfirmed — Maersk Tankers allocation date pending',               vessel:null,   dismissed:false },
  { id:'AL003', ts:'08:00', level:'high',     msg:'MT Prelude bunker RFQ not confirmed — 15 days to planned bunker date',                       vessel:'V001', dismissed:false },
  { id:'AL004', ts:'Yesterday', level:'medium',   msg:'Cosmos 4 & 5 utilisation below 85% target — review cargo schedule',                         vessel:null,   dismissed:false },
]

export const ACTION_ITEMS = [
  { id:'A001', item:'Confirm MT Prelude pool transfer date — Maersk Tankers allocation', owner:'fleet_mgr', ownerName:'Ravi Kumar',    due:'2026-05-20', status:'open',   priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A002', item:'Book IOPP renewal survey for MT Prelude — expires 20 Jun',          owner:'tech_supt', ownerName:'S. Mehta',      due:'2026-05-25', status:'open',   priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A003', item:'Confirm bunker supplier for MT Prelude — Ras Tanura 28 May',        owner:'ops',       ownerName:'P. Singh',      due:'2026-05-18', status:'overdue',priority:'high',   meeting:'Ops Review 12 May 2026'  },
  { id:'A004', item:'Review Cosmos 4 & 5 cargo utilisation — optimise programme',        owner:'ops',       ownerName:'P. Singh',      due:'2026-05-22', status:'open',   priority:'medium', meeting:'BOD Meeting 08 May 2026' },
  { id:'A005', item:'Confirm Hill Dickinson briefing for 14 Jun arbitration',             owner:'legal',     ownerName:'Legal Counsel', due:'2026-06-07', status:'open',   priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A006', item:'Submit MT Anael relief master nomination',                           owner:'manning',   ownerName:'J. Fernandez',  due:'2026-06-10', status:'open',   priority:'medium', meeting:'Ops Review 12 May 2026'  },
]

export const CONNECTORS = [
  { name:'Zoho Books',             status:'connected', org:'Goodearth Finance Suite', detail:'P&L, invoices & bank accounts live',   module:'finance' },
  { name:'Zoho Expense',           status:'connected', org:'Goodearth Finance Suite', detail:'Expense reports synced',               module:'expense' },
  { name:'Zoho Payroll',           status:'connected', org:'Goodearth Finance Suite', detail:'Crew & staff payroll',                 module:'payroll' },
  { name:'FURUNO / MarineTraffic', status:'pending',   org:'AIS Fleet Tracking',      detail:'Subscription procurement in progress', module:'ais'     },
  { name:'UK P&I Club',            status:'connected', org:'UK P&I Club',             detail:'Claims module live',                   module:'pi'      },
]

export const ZOHO_SUITE = {
  label:'Zoho Finance Suite',
  description:"Goodearth's primary ERP — Zoho Books, Expense, and Payroll connected as single source of financial truth.",
  modules:['Zoho Books','Zoho Expense','Zoho Payroll','Zoho CRM'], orgId:'10229182', region:'UAE (zoho.com)',
}

export const TEAM = [
  { id:'fleet_mgr', name:'Ravi Kumar',         role:'Fleet Manager',            email:'ravi.kumar@goodearth-maritime.com'  },
  { id:'tech_supt', name:'S. Mehta',           role:'Technical Superintendent', email:'s.mehta@goodearth-maritime.com'     },
  { id:'finance',   name:'N. Pillai',          role:'Finance Controller',       email:'n.pillai@goodearth-maritime.com'    },
  { id:'ops',       name:'P. Singh',           role:'Operations Manager',       email:'p.singh@goodearth-maritime.com'     },
  { id:'manning',   name:'J. Fernandez',       role:'Manning Superintendent',   email:'j.fernandez@goodearth-maritime.com' },
  { id:'legal',     name:'Hill Dickinson LLP', role:'External Legal Counsel',   email:'gmpl@hilldickinson.com'             },
]
