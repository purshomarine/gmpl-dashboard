// ─── GMPL Dashboard — Complete Seed Data ─────────────────────────────────────

export const VESSELS = [
  { id:'V001', name:'MV Sea Empress',      type:'Chemical Tanker', flag:'Malta',        util:92, target:88, pl:485000,  status:'green', pos:'Arabian Gulf',    route:'Hamriyah → Jebel Ali',    crew:24, defects:2,  certs:'ok',      dwt:19800,  built:2014, class:'BV',  lat:26.1, lng:55.6, imo:'9682341', mgr:'Capt. Ahmed Hassan',     dayRate:18500, voyageDays:14 },
  { id:'V002', name:'MV Good Earth Alpha', type:'Product Tanker',  flag:'Panama',       util:78, target:85, pl:312000,  status:'amber', pos:'Red Sea',         route:'Suez → Aden',             crew:22, defects:5,  certs:'warning', dwt:47500,  built:2011, class:'DNV', lat:20.5, lng:37.8, imo:'9512834', mgr:'Capt. Pradeep Nair',     dayRate:16200, voyageDays:9  },
  { id:'V003', name:'MV Neptune Glory',    type:'Chemical Tanker', flag:'Marshall Is.', util:95, target:88, pl:623000,  status:'green', pos:'Persian Gulf',    route:'Jubail → Fujairah',       crew:26, defects:0,  certs:'ok',      dwt:22400,  built:2017, class:'LR',  lat:27.0, lng:51.5, imo:'9745120', mgr:'Capt. Liu Wei',          dayRate:21000, voyageDays:7  },
  { id:'V004', name:'MV Saffron Star',     type:'Crude Carrier',   flag:'Panama',       util:0,  target:80, pl:-48000,  status:'red',   pos:'Dubai — Laid Up', route:'Awaiting charter',        crew:18, defects:12, certs:'expired', dwt:105000, built:2006, class:'ABS', lat:25.2, lng:55.3, imo:'9234156', mgr:'Fleet Manager',          dayRate:0,     voyageDays:0  },
  { id:'V005', name:'MV Indian Ocean',     type:'Product Tanker',  flag:'Malta',        util:88, target:85, pl:398000,  status:'green', pos:'Gulf of Oman',    route:'Muscat → Mumbai',         crew:23, defects:1,  certs:'ok',      dwt:51200,  built:2015, class:'BV',  lat:23.8, lng:58.4, imo:'9623019', mgr:'Capt. Santos',           dayRate:17800, voyageDays:11 },
  { id:'V006', name:'MV Gulf Pioneer',     type:'Chemical Tanker', flag:'Cyprus',       util:82, target:85, pl:291000,  status:'amber', pos:'Indian Ocean',    route:'Mangalore → Yanbu',       crew:25, defects:3,  certs:'ok',      dwt:17600,  built:2013, class:'DNV', lat:12.5, lng:68.0, imo:'9589234', mgr:'Capt. Fernandez',        dayRate:16000, voyageDays:18 },
  { id:'V007', name:'MV Maritime Crown',   type:'Bulk Carrier',    flag:'Marshall Is.', util:91, target:88, pl:445000,  status:'green', pos:'South China Sea', route:'Singapore → Kolkata',     crew:21, defects:0,  certs:'ok',      dwt:81000,  built:2018, class:'NK',  lat:9.5,  lng:109.0,imo:'9801234', mgr:'Capt. Mohammed Al Rashid',dayRate:19200, voyageDays:21 },
  { id:'V008', name:'MV Emerald Wave',     type:'Product Tanker',  flag:'Panama',       util:70, target:80, pl:128000,  status:'amber', pos:'Bay of Bengal',   route:'Chennai → Colombo',       crew:22, defects:4,  certs:'warning', dwt:39800,  built:2010, class:'BV',  lat:13.5, lng:82.0, imo:'9456712', mgr:'Capt. Rajan Pillai',     dayRate:15500, voyageDays:6  },
]

export const VERTICALS = [
  { id:'shipown',  name:'Ship Owning',     rev:8.2,  ebitda:2.1,  prevRev:7.8,  trend:+5.1, status:'green', margin:'25.6', vessels:5, budget:8.0,  cash:4.2,  receivables:1.8 },
  { id:'shipmgmt', name:'Ship Management', rev:4.5,  ebitda:1.8,  prevRev:4.3,  trend:+4.7, status:'green', margin:'40.0', vessels:3, budget:4.2,  cash:2.1,  receivables:0.6 },
  { id:'shipbld',  name:'Ship Building',   rev:2.8,  ebitda:0.6,  prevRev:3.1,  trend:-9.7, status:'amber', margin:'21.4', vessels:0, budget:3.4,  cash:0.9,  receivables:2.3 },
  { id:'shiprep',  name:'Ship Repairing',  rev:1.4,  ebitda:0.3,  prevRev:1.5,  trend:-6.7, status:'amber', margin:'21.4', vessels:0, budget:1.6,  cash:0.4,  receivables:0.8 },
]

export const REVENUE_TREND = [
  {m:'Jun 25',r:14.2,e:3.8},{m:'Jul 25',r:15.8,e:4.2},{m:'Aug 25',r:13.1,e:3.1},
  {m:'Sep 25',r:16.4,e:4.6},{m:'Oct 25',r:17.2,e:5.1},{m:'Nov 25',r:18.1,e:5.4},
  {m:'Dec 25',r:19.4,e:6.1},{m:'Jan 26',r:16.8,e:4.8},{m:'Feb 26',r:15.3,e:4.1},
  {m:'Mar 26',r:17.9,e:5.3},{m:'Apr 26',r:18.6,e:5.7},{m:'May 26',r:17.1,e:5.0},
]

export const MARKET_DATA = [
  { label:'Baltic Dry Index',  value:'1,842',    delta:'+3.2%', up:true,  warn:false, context:'3-month high' },
  { label:'Brent Crude',       value:'$78.4/bbl', delta:'-1.1%', up:false, warn:false, context:'Week low' },
  { label:'VLSFO Bunker',      value:'$612/MT',  delta:'+2.8%', up:false, warn:false, context:'Dubai port price' },
  { label:'USD / INR',         value:'₹83.4',    delta:'+0.3%', up:false, warn:false, context:'Mid-market' },
  { label:'Red Sea Risk',      value:'ELEVATED', delta:'Rerouting active',up:false,warn:true, context:'+12–15 days/voyage' },
]

export const CRITICAL_ITEMS = [
  { id:1, urg:'high',   title:'SMC Expiry — MV Saffron Star',      detail:'Certificate expires 24 May 2026. Class suspension risk without dry dock approval.',          action:'Approve Drydock', assignee:'fleet_mgr' },
  { id:2, urg:'high',   title:'Arbitration Hearing — 14 Jun',       detail:'Petrochemical Corp. $2.4M exposure. Hill Dickinson briefing not confirmed.',               action:'Confirm Briefing', assignee:'legal' },
  { id:3, urg:'medium', title:'MV Saffron Star — 18 Days Idle',     detail:'OPEX burn $8,400/day. Total idle cost $151,200. Charter broker shortlist pending sign-off.', action:'Review Proposals', assignee:'fleet_mgr' },
  { id:4, urg:'medium', title:'Ship Building Below Target',          detail:'Revenue $2.8M vs $3.4M budget. Eastern Shipyard delay unresolved. -$0.6M variance.',       action:'Review Status', assignee:'ops' },
]

export const LEGAL_MATTERS = [
  { id:'L001', type:'Charter Party Dispute',       party:'Petrochemical Corp Ltd',  pos:'Claimant',   exp:2400000, next:'2026-06-14', event:'Arbitration Hearing',  status:'red',   spend:85000,  counsel:'Hill Dickinson LLP' },
  { id:'L002', type:'P&I Cargo Claim',             party:'Asian Chemical Holdings', pos:'Respondent', exp:890000,  next:'2026-07-02', event:'Pleadings Deadline',   status:'amber', spend:32000,  counsel:'Ince & Co' },
  { id:'L003', type:'Crew Injury Claim',           party:'Chief Engineer Ramirez',  pos:'Respondent', exp:320000,  next:'2026-05-28', event:'Medical Assessment',   status:'red',   spend:18500,  counsel:'P&I Club' },
  { id:'L004', type:'Newbuilding Contract Dispute',party:'Eastern Shipyard Ltd',    pos:'Claimant',   exp:4100000, next:'2026-08-19', event:'Expert Determination', status:'amber', spend:127000, counsel:'Watson Farley & Williams' },
]

export const HEARING_EVENTS = [
  { date:'2026-05-28', matter:'L003', label:'Crew Injury — Medical Assessment', type:'red' },
  { date:'2026-06-14', matter:'L001', label:'Petrochemical Corp — Arbitration', type:'red' },
  { date:'2026-07-02', matter:'L002', label:'Asian Chemical — Pleadings Due',   type:'amber' },
  { date:'2026-07-15', matter:'L002', label:'Asian Chemical — CMC',             type:'amber' },
  { date:'2026-08-19', matter:'L004', label:'Eastern Shipyard — Expert Det.',   type:'amber' },
]

export const CERTIFICATES = [
  { vessel:'MV Saffron Star',     cert:'Safety Management Certificate', expires:'2026-05-24', days:11, status:'red'   },
  { vessel:'MV Good Earth Alpha', cert:'IOPP Certificate',              expires:'2026-06-08', days:26, status:'amber' },
  { vessel:'MV Emerald Wave',     cert:'MLC Certificate',               expires:'2026-06-15', days:33, status:'amber' },
  { vessel:'MV Gulf Pioneer',     cert:'Class Renewal Survey',          expires:'2026-07-01', days:49, status:'amber' },
  { vessel:'MV Indian Ocean',     cert:'Port State Control',            expires:'2026-07-22', days:70, status:'green' },
  { vessel:'MV Maritime Crown',   cert:'SMC Renewal',                   expires:'2026-08-14', days:93, status:'green' },
]

export const RED_FLAGS = [
  { domain:'Fleet Operations',  item:'MV Saffron Star — Idle 18 days',          actual:'0%',    target:'80%+ util', gap:'-80%',  status:'red',   vessel:'V004' },
  { domain:'Fleet Operations',  item:'MV Good Earth Alpha — Below util target', actual:'78%',   target:'85%',       gap:'-7%',   status:'amber', vessel:'V002' },
  { domain:'Technical',         item:'MV Saffron Star — 12 open defects',       actual:'12',    target:'≤3',        gap:'+9',    status:'red',   vessel:'V004' },
  { domain:'Technical',         item:'MV Emerald Wave — 4 open defects',        actual:'4',     target:'≤3',        gap:'+1',    status:'amber', vessel:'V008' },
  { domain:'Compliance',        item:'SMC Expiry in 11 days',                   actual:'11 d',  target:'60d buffer',gap:'-49d',  status:'red',   vessel:'V004' },
  { domain:'Compliance',        item:'3 vessels CII not submitted',             actual:'3',     target:'0',         gap:'+3',    status:'red',   vessel:null   },
  { domain:'Finance',           item:'Ship Building rev vs budget',             actual:'$2.8M', target:'$3.4M',     gap:'-$0.6M',status:'amber', vessel:null   },
  { domain:'Finance',           item:'Ship Repairing rev vs budget',            actual:'$1.4M', target:'$1.6M',     gap:'-$0.2M',status:'amber', vessel:null   },
  { domain:'Finance',           item:'Overdue receivables — Ship Building',     actual:'$2.3M', target:'<$1M',      gap:'+$1.3M',status:'red',   vessel:null   },
  { domain:'Legal',             item:'Unconfirmed legal briefing — 14 Jun',     actual:'Pending',target:'7d prior', gap:'—',     status:'red',   vessel:null   },
]

export const CREW = [
  { vesselId:'V001', vessel:'MV Sea Empress',     rank:'Master',      name:'Capt. Ahmed Hassan',      nation:'Egypt',      signOn:'2026-02-14', signOff:'2026-08-14', certs:'ok',     relief:'Ready' },
  { vesselId:'V001', vessel:'MV Sea Empress',     rank:'Chief Officer',name:'Mr. Ravi Shenoy',        nation:'India',      signOn:'2026-03-01', signOff:'2026-09-01', certs:'ok',     relief:'Ready' },
  { vesselId:'V002', vessel:'MV Good Earth Alpha',rank:'Master',      name:'Capt. Pradeep Nair',      nation:'India',      signOn:'2026-01-10', signOff:'2026-07-10', certs:'warning',relief:'Sourcing' },
  { vesselId:'V003', vessel:'MV Neptune Glory',   rank:'Master',      name:'Capt. Liu Wei',           nation:'China',      signOn:'2026-04-01', signOff:'2026-10-01', certs:'ok',     relief:'Ready' },
  { vesselId:'V004', vessel:'MV Saffron Star',    rank:'Master',      name:'Capt. Rodrigo Santos',    nation:'Philippines',signOn:'2026-03-20', signOff:'2026-09-20', certs:'ok',     relief:'N/A'   },
  { vesselId:'V005', vessel:'MV Indian Ocean',    rank:'Master',      name:'Capt. K. Menon',          nation:'India',      signOn:'2026-02-28', signOff:'2026-08-28', certs:'ok',     relief:'Ready' },
  { vesselId:'V006', vessel:'MV Gulf Pioneer',    rank:'Master',      name:'Capt. J. Fernandez',      nation:'Philippines',signOn:'2026-01-15', signOff:'2026-07-15', certs:'warning',relief:'Sourcing' },
  { vesselId:'V007', vessel:'MV Maritime Crown',  rank:'Master',      name:'Capt. Mohammed Al Rashid',nation:'UAE',        signOn:'2026-04-10', signOff:'2026-10-10', certs:'ok',     relief:'Ready' },
  { vesselId:'V008', vessel:'MV Emerald Wave',    rank:'Master',      name:'Capt. Rajan Pillai',      nation:'India',      signOn:'2025-11-20', signOff:'2026-05-20', certs:'warning',relief:'Urgent' },
]

export const CREW_SIGNOFFS = [
  { vessel:'MV Emerald Wave',    name:'Capt. Rajan Pillai',   rank:'Master',       date:'2026-05-20', days:7,  status:'red',   action:'Relief required urgently' },
  { vessel:'MV Good Earth Alpha',name:'Capt. Pradeep Nair',   rank:'Master',       date:'2026-07-10', days:58, status:'amber', action:'Relief crew identified' },
  { vessel:'MV Gulf Pioneer',    name:'Capt. J. Fernandez',   rank:'Master',       date:'2026-07-15', days:63, status:'amber', action:'Sourcing relief' },
  { vessel:'MV Sea Empress',     name:'Mr. Ravi Shenoy',      rank:'Chief Officer',date:'2026-09-01', days:110,status:'green', action:'On schedule' },
]

export const SCENARIO_PRESETS = {
  base:       { label:'Base Case',         util:82,  rate:18500, bunker:612, inr:83.4, extra:0, opex:8400 },
  bull:       { label:'Bull Case',         util:92,  rate:22000, bunker:580, inr:82.0, extra:2, opex:8200 },
  bear:       { label:'Bear Case',         util:68,  rate:14000, bunker:680, inr:86.0, extra:0, opex:8800 },
  redsea:     { label:'Red Sea Disruption',util:75,  rate:16500, bunker:720, inr:84.5, extra:0, opex:9200 },
  bunkerspike:{ label:'Bunker Spike',      util:82,  rate:18500, bunker:850, inr:83.4, extra:0, opex:8400 },
}

export const SENSITIVITY = [
  { n:'Fleet Utilisation', v:3.8 },
  { n:'Day Rate',          v:3.1 },
  { n:'Fleet Size',        v:2.9 },
  { n:'Bunker Price',      v:2.4 },
  { n:'OPEX / Day',        v:1.6 },
  { n:'USD / INR',         v:1.2 },
]

export const CONNECTORS = [
  { name:'Zoho Books',     status:'connected', org:'Zoho Finance Suite', detail:'P&L, invoices & bank accounts live', module:'finance'  },
  { name:'Zoho Expense',   status:'connected', org:'Zoho Finance Suite', detail:'2,847 expenses synced',              module:'expense'  },
  { name:'Zoho Payroll',   status:'connected', org:'Zoho Finance Suite', detail:'181 crew & staff on payroll',        module:'payroll'  },
  { name:'Zoho CRM',       status:'connected', org:'Zoho Finance Suite', detail:'Charterers & clients synced',        module:'crm'      },
  { name:'AIS Fleet Track',status:'connected', org:'MarineTraffic API',  detail:'8 vessels live',                     module:'ais'      },
  { name:'P&I Club API',   status:'connected', org:'UK P&I Club',        detail:'Claims module live',                 module:'pi'       },
]

export const ZOHO_SUITE = {
  label: 'Zoho Finance Suite',
  description: 'GMPL\'s primary ERP — Zoho Books, Expense, Payroll and CRM are all connected and serve as the single source of financial truth across all four group verticals.',
  modules: ['Zoho Books', 'Zoho Expense', 'Zoho Payroll', 'Zoho CRM', 'Zoho Inventory'],
  orgId: '10229182',
  region: 'UAE (zoho.com)',
}

export const ZOHO_BOOKS_INVOICES = [
  { id:'INV-4821', customer:'Gulf Petrochemicals Co.',   amount:284000, currency:'USD', date:'2026-05-10', due:'2026-06-10', status:'open',     vertical:'Ship Owning',    aging:3   },
  { id:'INV-4820', customer:'Emirates National Oil Co.',  amount:192000, currency:'USD', date:'2026-05-08', due:'2026-06-08', status:'open',     vertical:'Ship Management',aging:5   },
  { id:'INV-4819', customer:'Reliance Industries Ltd.',   amount:315000, currency:'USD', date:'2026-04-28', due:'2026-05-28', status:'overdue',  vertical:'Ship Owning',    aging:15  },
  { id:'INV-4818', customer:'Eastern Shipyard Ltd.',      amount:620000, currency:'USD', date:'2026-04-15', due:'2026-05-15', status:'overdue',  vertical:'Ship Building',  aging:28  },
  { id:'INV-4817', customer:'Adani Ports & SEZ Ltd.',     amount:98000,  currency:'USD', date:'2026-05-01', due:'2026-06-01', status:'open',     vertical:'Ship Repairing', aging:12  },
  { id:'INV-4816', customer:'Saudi Aramco Trading Co.',   amount:445000, currency:'USD', date:'2026-03-31', due:'2026-04-30', status:'overdue',  vertical:'Ship Building',  aging:43  },
  { id:'INV-4815', customer:'Wilhelmsen Ship Services',   amount:67000,  currency:'USD', date:'2026-05-12', due:'2026-06-12', status:'paid',     vertical:'Ship Management',aging:1   },
  { id:'INV-4814', customer:'Gulf Agency Company',        amount:28000,  currency:'USD', date:'2026-05-11', due:'2026-06-11', status:'paid',     vertical:'Ship Owning',    aging:2   },
]

export const ZOHO_BOOKS_ACCOUNTS = [
  { bank:'Emirates NBD — USD Operating', balance:3842000, currency:'USD', lastTx:'13 May 2026', vertical:'Group' },
  { bank:'Emirates NBD — AED Payroll',   balance:4180000, currency:'AED', lastTx:'10 May 2026', vertical:'Group' },
  { bank:'Mashreq Bank — USD Reserve',   balance:1250000, currency:'USD', lastTx:'01 May 2026', vertical:'Ship Building' },
  { bank:'HSBC UAE — USD Trade Finance', balance:890000,  currency:'USD', lastTx:'08 May 2026', vertical:'Ship Owning' },
]

export const ZOHO_PL_SUMMARY = [
  { vertical:'Ship Owning',     revenue:8200000, cogs:4800000, grossProfit:3400000, opex:1300000, ebitda:2100000 },
  { vertical:'Ship Management', revenue:4500000, cogs:1700000, grossProfit:2800000, opex:1000000, ebitda:1800000 },
  { vertical:'Ship Building',   revenue:2800000, cogs:1800000, grossProfit:1000000, opex:400000,  ebitda:600000  },
  { vertical:'Ship Repairing',  revenue:1400000, cogs:800000,  grossProfit:600000,  opex:300000,  ebitda:300000  },
]

export const ALERTS = [
  { id:'AL001', ts:'09:38 GST', level:'critical', msg:'MV Saffron Star — Safety Management Certificate expires in 11 days', vessel:'V004', dismissed:false },
  { id:'AL002', ts:'08:15 GST', level:'high',     msg:'Arbitration briefing unconfirmed — Hill Dickinson LLP — 14 Jun hearing', vessel:null, dismissed:false },
  { id:'AL003', ts:'Yesterday', level:'medium',   msg:'MV Good Earth Alpha IOPP Certificate expiring in 26 days',  vessel:'V002', dismissed:false },
  { id:'AL004', ts:'Yesterday', level:'medium',   msg:'CII Annual Report — 3 vessels not yet submitted. Deadline 31 May 2026', vessel:null, dismissed:false },
]

export const ACTION_ITEMS = [
  { id:'A001', item:'Approve MV Saffron Star drydock at Dubai Drydocks World',    owner:'fleet_mgr', ownerName:'Ravi Kumar',      due:'2026-05-16', status:'overdue',  priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A002', item:'Confirm Hill Dickinson briefing for Petrochemical Corp case', owner:'legal',     ownerName:'Legal Counsel',   due:'2026-05-20', status:'open',     priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A003', item:'Submit AIS subscription quotes from MarineTraffic & Spire',  owner:'ops',       ownerName:'P. Singh',        due:'2026-05-22', status:'open',     priority:'medium', meeting:'BOD Meeting 08 May 2026' },
  { id:'A004', item:'Submit CII reports for 3 outstanding vessels',               owner:'tech_supt', ownerName:'S. Mehta',        due:'2026-05-31', status:'open',     priority:'high',   meeting:'Tech Review 12 May 2026' },
  { id:'A005', item:'Provide broker shortlist for MV Saffron Star charter',       owner:'fleet_mgr', ownerName:'Ravi Kumar',      due:'2026-05-19', status:'overdue',  priority:'high',   meeting:'BOD Meeting 08 May 2026' },
  { id:'A006', item:'Define RBAC access matrix for dashboard roles',              owner:'ops',       ownerName:'P. Singh',        due:'2026-05-30', status:'open',     priority:'medium', meeting:'BOD Meeting 08 May 2026' },
]

export const TEAM = [
  { id:'fleet_mgr', name:'Ravi Kumar',          role:'Fleet Manager',            email:'ravi.kumar@goodearth-maritime.com' },
  { id:'tech_supt', name:'S. Mehta',            role:'Technical Superintendent', email:'s.mehta@goodearth-maritime.com' },
  { id:'finance',   name:'N. Pillai',           role:'Finance Controller',       email:'n.pillai@goodearth-maritime.com' },
  { id:'ops',       name:'P. Singh',            role:'Operations Manager',       email:'p.singh@goodearth-maritime.com' },
  { id:'manning',   name:'J. Fernandez',        role:'Manning Superintendent',   email:'j.fernandez@goodearth-maritime.com' },
  { id:'legal',     name:'Hill Dickinson LLP',  role:'External Legal Counsel',   email:'gmpl@hilldickinson.com' },
]

// ─── Active Deals ────────────────────────────────────────────────────────────
export const ACTIVE_DEALS = [
  {
    id:'D001', name:'MV Pacific Star Acquisition', type:'Vessel Acquisition',
    purpose:'Replace MV Saffron Star — expand chemical tanker fleet with modern eco vessel',
    highlights:'15,200 DWT chemical tanker, 2019 build, DNV class, Ice-1A notation. Immediate TC available with Gulf Petrochemicals at $19,200/day. Seller motivated — must close by Q3 2026.',
    dealSize:18500000, equity:5550000, debt:12950000, leverage:70,
    projectIRR:14.2, equityIRR:22.8, cashRequired:5550000,
    stage:'Due Diligence', status:'active',
    counterparty:'Aegean Maritime Holdings', lead:'Fleet Manager / Finance Controller',
    targetClose:'2026-07-31', paybackYears:6.2, currency:'USD',
    vertical:'Ship Owning',
  },
  {
    id:'D002', name:'GEM Newbuilding NB-01 — Chemical Tanker', type:'Newbuilding',
    purpose:'New 19,000 DWT chemical tanker at Eastern Shipyard — 5-year TC with Aramco Trading',
    highlights:'LOI signed with Saudi Aramco Trading at $21,000/day for 5 years. Shipyard delivery Q4 2027. Green methanol-ready design. Export credit financing being arranged via EXIM Bank.',
    dealSize:32000000, equity:9600000, debt:22400000, leverage:70,
    projectIRR:16.8, equityIRR:27.4, cashRequired:9600000,
    stage:'Credit Approval', status:'active',
    counterparty:'Eastern Shipyard Ltd / Saudi Aramco Trading', lead:'CEO / Finance Controller',
    targetClose:'2026-09-30', paybackYears:5.8, currency:'USD',
    vertical:'Ship Building',
  },
  {
    id:'D003', name:'Nura Shipco Fleet Refinancing', type:'Debt Financing',
    purpose:'Refinance existing fleet mortgage — reduce blended cost of debt from 7.2% to 5.8%',
    highlights:'3 vessels (Sea Empress, Neptune Glory, Indian Ocean) offered as security. Emirates NBD term sheet received. Savings estimated $420K/year. Interest rate lock available for 5 years.',
    dealSize:28000000, equity:0, debt:28000000, leverage:100,
    projectIRR:null, equityIRR:null, cashRequired:0,
    stage:'Indicative Terms', status:'active',
    counterparty:'Emirates NBD — Shipping Finance', lead:'Finance Controller',
    targetClose:'2026-08-15', paybackYears:7.0, currency:'USD',
    vertical:'Ship Owning',
  },
  {
    id:'D004', name:'Good Earth Drydock SPV — MV Emerald Wave', type:'Vessel Acquisition',
    purpose:'Acquire MV Emerald Wave into dedicated SPV for tax efficiency and ring-fencing',
    highlights:'Currently managed under GMPL directly. Restructuring into SPV enables clean financing, UAE VAT efficiency, and potential minority stake sale to co-investor.',
    dealSize:9200000, equity:2760000, debt:6440000, leverage:70,
    projectIRR:11.4, equityIRR:18.2, cashRequired:2760000,
    stage:'Origination', status:'pipeline',
    counterparty:'Internal restructuring', lead:'CFO / Legal',
    targetClose:'2026-12-31', paybackYears:7.8, currency:'USD',
    vertical:'Ship Owning',
  },
  {
    id:'D005', name:'Ship Repairing Yard Expansion — Phase 2', type:'Project Finance',
    purpose:'Expand dry-dock capacity from 2 berths to 4 berths — capture Red Sea rerouting maintenance demand surge',
    highlights:'Feasibility study complete. ROI of 24% at 70% utilisation. UAE federal grant application submitted for AED 4M. Phase 2 adds LNG bunkering capability.',
    dealSize:14500000, equity:5800000, debt:8700000, leverage:60,
    projectIRR:19.4, equityIRR:31.2, cashRequired:5800000,
    stage:'Origination', status:'pipeline',
    counterparty:'Various lenders — in discussion', lead:'CEO / Operations',
    targetClose:'2027-03-31', paybackYears:4.8, currency:'USD',
    vertical:'Ship Repairing',
  },
]

export const DEAL_STAGES = ['Origination','Indicative Terms','Due Diligence','Credit Approval','Documentation','Closed']

// ─── HSE ─────────────────────────────────────────────────────────────────────
export const HSE_INCIDENTS = [
  { id:'HSE-001', vessel:'MV Sea Empress',     type:'Near Miss',  desc:'Slip on wet deck during night cargo watch — no injury',            date:'2026-05-08', severity:'low',    status:'closed',  rootCause:'Inadequate lighting at manifold area', corrective:'LED lighting installed, slip-guard matting added' },
  { id:'HSE-002', vessel:'MV Good Earth Alpha',type:'Injury',     desc:'AB sustained laceration to right hand during mooring operations',  date:'2026-04-22', severity:'medium', status:'open',    rootCause:'Non-compliance with PPE requirement', corrective:'Refresher safety training scheduled' },
  { id:'HSE-003', vessel:'MV Saffron Star',    type:'Near Miss',  desc:'Engine room — hot surface contact narrowly avoided',              date:'2026-04-15', severity:'low',    status:'closed',  rootCause:'Insulation degradation on exhaust line', corrective:'Insulation replaced, MSOC issued' },
  { id:'HSE-004', vessel:'MV Maritime Crown',  type:'Near Miss',  desc:'Incorrect chemical loaded into wrong tank — caught pre-pumping',  date:'2026-03-30', severity:'high',   status:'open',    rootCause:'Pre-loading checklist not completed', corrective:'Mandatory dual-sign checklist enforced' },
  { id:'HSE-005', vessel:'Corporate',          type:'Audit',      desc:'Annual HSE Audit — Dubai Office',                                 date:'2026-03-15', severity:'info',   status:'closed',  rootCause:'Scheduled', corrective:'3 minor observations raised, all actioned' },
]

export const HSE_KPI = {
  LTIF: 0.42,          // Lost Time Injury Frequency
  TRCF: 1.85,          // Total Recordable Case Frequency
  nearMisses: 4,
  openActions: 2,
  auditScore: 87,
  daysWithoutLTI: 143,
  industryLTIF: 0.68,  // INTERTANKO benchmark
}

// ─── Inspections ─────────────────────────────────────────────────────────────
export const INSPECTIONS = [
  { id:'INS-001', vessel:'MV Neptune Glory',    type:'PSC',       port:'Fujairah',     authority:'UAE MCA',            date:'2026-04-20', result:'pass', deficiencies:0,  detained:false, score:null,  next:'2026-10-20' },
  { id:'INS-002', vessel:'MV Sea Empress',      type:'SIRE',      port:'Hamriyah',     authority:'Vetting Inspector',  date:'2026-04-05', result:'pass', deficiencies:2,  detained:false, score:92,    next:'2026-10-05' },
  { id:'INS-003', vessel:'MV Good Earth Alpha', type:'PSC',       port:'Aden',         authority:'Yemen PMSA',         date:'2026-03-28', result:'fail', deficiencies:4,  detained:false, score:null,  next:'Rectification required' },
  { id:'INS-004', vessel:'MV Indian Ocean',     type:'Oil Major', port:'Mumbai',       authority:'Shell Vetting',      date:'2026-03-15', result:'pass', deficiencies:1,  detained:false, score:88,    next:'2026-09-15' },
  { id:'INS-005', vessel:'MV Maritime Crown',   type:'PSC',       port:'Singapore',    authority:'MPA Singapore',      date:'2026-02-20', result:'pass', deficiencies:0,  detained:false, score:null,  next:'2026-08-20' },
  { id:'INS-006', vessel:'MV Saffron Star',     type:'Tank',      port:'Dubai',        authority:'Internal Inspector', date:'2026-02-10', result:'fail', deficiencies:null,detained:false,score:null,  next:'Post-drydock re-inspection required', tankResult:'Rejected — coating breakdown Tanks 3,4,5. Cleaning required before next cargo.' },
  { id:'INS-007', vessel:'MV Gulf Pioneer',     type:'SIRE',      port:'Yanbu',        authority:'Vetting Inspector',  date:'2026-01-28', result:'pass', deficiencies:3,  detained:false, score:86,    next:'2026-07-28' },
  { id:'INS-008', vessel:'MV Emerald Wave',     type:'Oil Major', port:'Colombo',      authority:'BP Vetting',         date:'2026-01-15', result:'pass', deficiencies:2,  detained:false, score:84,    next:'2026-07-15' },
]

// ─── Nura Shipco / Group Companies ───────────────────────────────────────────
export const GROUP_ENTITIES = [
  {
    id:'gmpl', name:'Good Earth Maritime Pvt Ltd', short:'GMPL',
    type:'Parent Holding Company', jurisdiction:'India / UAE',
    role:'Group parent — Ship Owning, Management, Building, Repairing operations',
    vessels:['V001','V002','V003','V004','V005','V006','V007','V008'],
    pl:{ rev:16.9, ebitda:4.8 }, status:'active', established:2004,
  },
  {
    id:'nura', name:'Nura Shipco LLC', short:'Nura Shipco',
    type:'Ship Owning SPV', jurisdiction:'UAE (Ras Al Khaimah FTZ)',
    role:'SPV holding vessel mortgages and charter contracts for financing ring-fencing',
    vessels:['V001','V003','V005'],
    pl:{ rev:8.6, ebitda:2.4 }, status:'active', established:2018,
  },
]

export const NURA_CHARTERS = [
  { id:'CP-001', vessel:'MV Sea Empress',   charterer:'Gulf Petrochemicals Co.',  type:'Time Charter',  rate:18500, currency:'USD/day', start:'2025-09-01', end:'2026-08-31', status:'active', paymentStatus:'Current',  netTCE:17200, nextHire:'1 Jun 2026' },
  { id:'CP-002', vessel:'MV Neptune Glory', charterer:'Saudi Aramco Trading Co.', type:'Time Charter',  rate:21000, currency:'USD/day', start:'2025-12-01', end:'2026-11-30', status:'active', paymentStatus:'Current',  netTCE:19800, nextHire:'1 Jun 2026' },
  { id:'CP-003', vessel:'MV Indian Ocean',  charterer:'Reliance Industries Ltd.', type:'Voyage Charter',rate:17800, currency:'USD/day', start:'2026-04-28', end:'2026-05-20', status:'active', paymentStatus:'Overdue',  netTCE:16400, nextHire:'Fixture pending' },
]
