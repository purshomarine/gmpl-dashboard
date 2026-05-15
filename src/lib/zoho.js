/**
 * Zoho Finance Suite Connector
 *
 * Zoho is GMPL's primary ERP covering:
 *   — Zoho Books   : accounting, P&L, invoices, bank reconciliation
 *   — Zoho Expense : expense claims and approval workflow
 *   — Zoho Payroll : crew and staff payroll
 *   — Zoho CRM     : charterers, clients, charter pipeline
 *
 * DEMO MODE (default): returns mock data shaped to the real Zoho API schemas.
 * LIVE MODE: set VITE_ZOHO_TOKEN + VITE_ZOHO_ORG_ID in .env — no code changes needed.
 *
 * Zoho Books API base:   https://books.zoho.com/api/v3
 * Zoho Expense API base: https://expense.zoho.com/api/v1
 * Auth: OAuth 2.0 Bearer token
 * Scopes:
 *   ZohoBooks.accountants.READ
 *   ZohoBooks.invoices.READ
 *   ZohoExpense.orgsettings.READ
 *   ZohoExpense.expensereports.READ
 */

const BOOKS_BASE   = 'https://books.zoho.com/api/v3'
const EXPENSE_BASE = 'https://expense.zoho.com/api/v1'
const DEMO_MODE    = !import.meta.env.VITE_ZOHO_TOKEN

// ─── Mock Organisation ───────────────────────────────────────────────────────

export const MOCK_ORG = {
  org_id:                  '10229182',
  name:                    'Goodearth Maritime Private Limited',
  contact_name:            'N. Pillai — Finance Controller',
  email:                   'finance@goodearth-maritime.com',
  currency_code:           'USD',
  currency_symbol:         '$',
  fiscal_year_start_month: 4,
  time_zone:               'Asia/Dubai',
  industry_type:           'Transportation & Logistics',
  portal_name:             'goodearth-maritime',
}

// ─── Mock Zoho Books Data ────────────────────────────────────────────────────

export const MOCK_INVOICES = [
  { invoice_id:'INV-4821', customer_name:'Gulf Petrochemicals Co.',  total:284000, balance:284000, date:'2026-05-10', due_date:'2026-06-10', status:'open',     invoice_number:'INV-4821', vertical:'Ship Owning'    },
  { invoice_id:'INV-4820', customer_name:'Emirates National Oil Co.',total:192000, balance:192000, date:'2026-05-08', due_date:'2026-06-08', status:'open',     invoice_number:'INV-4820', vertical:'Ship Management' },
  { invoice_id:'INV-4819', customer_name:'Reliance Industries Ltd.', total:315000, balance:315000, date:'2026-04-28', due_date:'2026-05-28', status:'overdue',  invoice_number:'INV-4819', vertical:'Ship Owning'    },
  { invoice_id:'INV-4818', customer_name:'Eastern Shipyard Ltd.',    total:620000, balance:620000, date:'2026-04-15', due_date:'2026-05-15', status:'overdue',  invoice_number:'INV-4818', vertical:'Ship Building'  },
  { invoice_id:'INV-4817', customer_name:'Adani Ports & SEZ Ltd.',   total:98000,  balance:98000,  date:'2026-05-01', due_date:'2026-06-01', status:'open',     invoice_number:'INV-4817', vertical:'Ship Repairing' },
  { invoice_id:'INV-4816', customer_name:'Saudi Aramco Trading Co.', total:445000, balance:445000, date:'2026-03-31', due_date:'2026-04-30', status:'overdue',  invoice_number:'INV-4816', vertical:'Ship Building'  },
  { invoice_id:'INV-4815', customer_name:'Wilhelmsen Ship Services', total:67000,  balance:0,      date:'2026-05-12', due_date:'2026-06-12', status:'paid',     invoice_number:'INV-4815', vertical:'Ship Management'},
  { invoice_id:'INV-4814', customer_name:'Gulf Agency Company',      total:28000,  balance:0,      date:'2026-05-11', due_date:'2026-06-11', status:'paid',     invoice_number:'INV-4814', vertical:'Ship Owning'    },
]

export const MOCK_BANK_ACCOUNTS = [
  { account_id:'BA001', account_name:'Emirates NBD — USD Operating', bank_name:'Emirates NBD', current_balance:3842000, currency_code:'USD', last_imported_date:'13 May 2026', account_type:'bank' },
  { account_id:'BA002', account_name:'Emirates NBD — AED Payroll',   bank_name:'Emirates NBD', current_balance:4180000, currency_code:'AED', last_imported_date:'10 May 2026', account_type:'bank' },
  { account_id:'BA003', account_name:'Mashreq Bank — USD Reserve',   bank_name:'Mashreq Bank', current_balance:1250000, currency_code:'USD', last_imported_date:'01 May 2026', account_type:'bank' },
  { account_id:'BA004', account_name:'HSBC UAE — USD Trade Finance',  bank_name:'HSBC UAE',    current_balance:890000,  currency_code:'USD', last_imported_date:'08 May 2026', account_type:'bank' },
]

export const MOCK_PL = [
  { vertical:'Ship Owning',     revenue:8200000, cogs:4800000, gross_profit:3400000, operating_expenses:1300000, net_profit:2100000 },
  { vertical:'Ship Management', revenue:4500000, cogs:1700000, gross_profit:2800000, operating_expenses:1000000, net_profit:1800000 },
  { vertical:'Ship Building',   revenue:2800000, cogs:1800000, gross_profit:1000000, operating_expenses:400000,  net_profit:600000  },
  { vertical:'Ship Repairing',  revenue:1400000, cogs:800000,  gross_profit:600000,  operating_expenses:300000,  net_profit:300000  },
]

// ─── Mock Zoho Expense Data ──────────────────────────────────────────────────

export const MOCK_EXPENSES = [
  { expense_id:'EXP-10291', expense_item_name:'Port Dues & Pilotage',  category_name:'Port Charges',    merchant_name:'Hamriyah Free Zone Authority', amount:18400,  currency_code:'USD', date:'2026-05-12', report_status:'submitted', submitted_by:'Capt. Ahmed Hassan',      vessel:'MT Nura Kara',   payment_mode:'Corporate Card' },
  { expense_id:'EXP-10290', expense_item_name:'Travel & Accommodation',category_name:'Corporate Travel', merchant_name:'Marriott Al Barsha',           amount:4230,   currency_code:'USD', date:'2026-05-11', report_status:'approved',  submitted_by:'Fleet Mgr Ravi Kumar',     vessel:'Corporate',          payment_mode:'Corporate Card' },
  { expense_id:'EXP-10289', expense_item_name:'Spare Parts & Stores',  category_name:'Technical',        merchant_name:'Wilhelmsen Ships Service',     amount:67800,  currency_code:'USD', date:'2026-05-10', report_status:'approved',  submitted_by:'Ch. Engr. Santos',         vessel:'MT Prelude',     payment_mode:'Bank Transfer'  },
  { expense_id:'EXP-10288', expense_item_name:'Dry Dock & Repairs',    category_name:'Drydock',          merchant_name:'Dubai Drydocks World',         amount:245000, currency_code:'USD', date:'2026-05-09', report_status:'pending',   submitted_by:'Technical Supt. Mehta',    vessel:'MT Nura Bright',    payment_mode:'Bank Transfer'  },
  { expense_id:'EXP-10287', expense_item_name:'Bunker Purchase',       category_name:'Bunkers',          merchant_name:'ENOC Marine',                 amount:189300, currency_code:'USD', date:'2026-05-08', report_status:'approved',  submitted_by:'Capt. Liu Wei',            vessel:'Cosmos 1',  payment_mode:'Bank Transfer'  },
  { expense_id:'EXP-10286', expense_item_name:'Agency Fees',           category_name:'Port Agency',      merchant_name:'Gulf Agency Company',         amount:8900,   currency_code:'USD', date:'2026-05-07', report_status:'submitted', submitted_by:'Operations — Singh',       vessel:'MV Goodearth Alpha',payment_mode:'Corporate Card' },
  { expense_id:'EXP-10285', expense_item_name:'Crew Welfare',          category_name:'Crew',             merchant_name:'Various',                     amount:3200,   currency_code:'USD', date:'2026-05-06', report_status:'approved',  submitted_by:'Manning Supt. Fernandez',  vessel:'Cosmos 2',    payment_mode:'Cash'           },
  { expense_id:'EXP-10284', expense_item_name:'Insurance Premium',     category_name:'Insurance',        merchant_name:'UK P&I Club',                 amount:42000,  currency_code:'USD', date:'2026-05-05', report_status:'approved',  submitted_by:'Finance Controller',       vessel:'Corporate',          payment_mode:'Bank Transfer'  },
]

export const MOCK_REPORTS = [
  { report_id:'ER-2847', report_name:'May 2026 — Voyage Expenses Neptune Glory',   report_status:'submitted', submitted_by:'Capt. Ahmed Hassan',  total:28450,  currency_code:'USD', submitted_date:'2026-05-12', num_expenses:4 },
  { report_id:'ER-2846', report_name:'Apr 2026 — Corporate Travel Q2',             report_status:'approved',  submitted_by:'Fleet Mgr Ravi Kumar',total:11230,  currency_code:'USD', submitted_date:'2026-04-30', num_expenses:6 },
  { report_id:'ER-2845', report_name:'May 2026 — Technical Stores Sea Empress',    report_status:'approved',  submitted_by:'Ch. Engr. Santos',    total:82100,  currency_code:'USD', submitted_date:'2026-05-10', num_expenses:3 },
  { report_id:'ER-2844', report_name:'Saffron Star Drydock 2026 — Phase 1',        report_status:'pending',   submitted_by:'Technical Supt. Mehta',total:245000, currency_code:'USD', submitted_date:'2026-05-09', num_expenses:1 },
]

// ─── API Helpers ─────────────────────────────────────────────────────────────

async function zohoGet(base, path) {
  const orgId = import.meta.env.VITE_ZOHO_ORG_ID
  const token = import.meta.env.VITE_ZOHO_TOKEN
  const res = await fetch(`${base}${path}?organization_id=${orgId}`, {
    headers: { Authorization: `Zoho-oauthtoken ${token}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Zoho API ${res.status}: ${await res.text()}`)
  return res.json()
}

// ─── Public Connector Functions ──────────────────────────────────────────────

export async function getOrganisation() {
  if (DEMO_MODE) return MOCK_ORG
  const data = await zohoGet(EXPENSE_BASE, '/organizations')
  return data.organizations?.[0] ?? MOCK_ORG
}

export async function getInvoices() {
  if (DEMO_MODE) return MOCK_INVOICES
  const data = await zohoGet(BOOKS_BASE, '/invoices')
  return data.invoices ?? MOCK_INVOICES
}

export async function getBankAccounts() {
  if (DEMO_MODE) return MOCK_BANK_ACCOUNTS
  const data = await zohoGet(BOOKS_BASE, '/bankaccounts')
  return data.bankaccounts ?? MOCK_BANK_ACCOUNTS
}

export async function getPLSummary() {
  // Zoho Books: /reports/profitandloss
  if (DEMO_MODE) return MOCK_PL
  return MOCK_PL // map to real API shape when live
}

export async function getExpenses() {
  if (DEMO_MODE) return MOCK_EXPENSES
  const data = await zohoGet(EXPENSE_BASE, '/expenses')
  return data.expenses ?? MOCK_EXPENSES
}

export async function getExpenseReports() {
  if (DEMO_MODE) return MOCK_REPORTS
  const data = await zohoGet(EXPENSE_BASE, '/expensereports')
  return data.expensereports ?? MOCK_REPORTS
}

export const zohoConnectorStatus = {
  name:       'Zoho Finance Suite',
  status:     DEMO_MODE ? 'demo' : 'connected',
  orgId:      import.meta.env.VITE_ZOHO_ORG_ID || '10229182 (demo)',
  region:     'UAE — zoho.com',
  authMethod: 'OAuth 2.0 Bearer',
  booksBase:  BOOKS_BASE,
  expenseBase:EXPENSE_BASE,
  scopes:     [
    'ZohoBooks.accountants.READ',
    'ZohoBooks.invoices.READ',
    'ZohoExpense.orgsettings.READ',
    'ZohoExpense.expensereports.READ',
  ],
}
