-- ═══════════════════════════════════════════════════════════════════════════
-- GOODEARTH MARITIME — SUPABASE DATABASE SCHEMA
-- Run this entire script in: Supabase Dashboard → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensions ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── DEALS ──────────────────────────────────────────────────────────────────
-- Stores vessel acquisition / newbuilding / financing deals from the Deal Analyser
CREATE TABLE IF NOT EXISTS deals (
  id                    UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  deal_name             TEXT NOT NULL,
  vessel_type           TEXT DEFAULT 'MR Product Tanker',
  dwt_mt                NUMERIC,
  ldt_mt                NUMERIC,
  acquisition_cost      NUMERIC NOT NULL,
  pre_purchase_costs    NUMERIC DEFAULT 0,
  final_cost            NUMERIC,
  loan_ltv              NUMERIC DEFAULT 0.70,
  loan_amount           NUMERIC,
  equity_amount         NUMERIC,
  interest_rate         NUMERIC DEFAULT 0.08,
  loan_tenure_years     INTEGER DEFAULT 5,
  operating_mode        TEXT DEFAULT 'tc',         -- 'tc' or 'pool'
  daily_rate            NUMERIC,                   -- TC rate or pool estimated rate
  commission_rate       NUMERIC DEFAULT 0.05,
  pool_name             TEXT,
  pool_commission       NUMERIC DEFAULT 0.05,
  charterer             TEXT,
  tc_start              DATE,
  tc_end                DATE,
  opex_per_day          NUMERIC DEFAULT 7500,
  opex_escalation       NUMERIC DEFAULT 0.02,
  operating_days        INTEGER DEFAULT 335,
  dd_cost               NUMERIC DEFAULT 1000000,
  ss_cost               NUMERIC DEFAULT 1000000,
  dd_year               INTEGER DEFAULT 2,
  ss_year               INTEGER DEFAULT 5,
  scrap_rate_per_ton    NUMERIC DEFAULT 400,
  operating_years       INTEGER DEFAULT 8,
  project_irr           NUMERIC,
  equity_irr            NUMERIC,
  net_op_income_yr1     NUMERIC,
  payback_years         NUMERIC,
  stage                 TEXT DEFAULT 'Origination',
  status                TEXT DEFAULT 'pipeline',   -- 'pipeline','active','closed','withdrawn'
  counterparty          TEXT,
  deal_lead             TEXT,
  target_close_date     DATE,
  vertical              TEXT DEFAULT 'Ship Owning',
  purpose               TEXT,
  highlights            TEXT,
  notes                 TEXT
);

-- ─── DEAL SCENARIOS ──────────────────────────────────────────────────────────
-- Multiple scenarios (Base/Bull/Bear/Custom) per deal
CREATE TABLE IF NOT EXISTS deal_scenarios (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id          UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  scenario_name    TEXT NOT NULL,           -- 'Base Case', 'Bull Case', etc.
  daily_rate       NUMERIC,
  operating_days   INTEGER,
  opex_per_day     NUMERIC,
  interest_rate    NUMERIC,
  loan_ltv         NUMERIC,
  loan_tenure_years INTEGER,
  dd_cost          NUMERIC,
  ss_cost          NUMERIC,
  operating_years  INTEGER,
  project_irr      NUMERIC,
  equity_irr       NUMERIC,
  ebitda_yr1       NUMERIC,
  pbdt_yr1         NUMERIC,
  notes            TEXT,
  is_base          BOOLEAN DEFAULT FALSE
);

-- ─── VESSELS ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vessels (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  type                TEXT,
  flag                TEXT,
  utilisation         INTEGER,
  target_util         INTEGER DEFAULT 85,
  status              TEXT DEFAULT 'green',
  position            TEXT,
  route               TEXT,
  crew                INTEGER,
  defects             INTEGER DEFAULT 0,
  cert_status         TEXT DEFAULT 'ok',
  dwt                 INTEGER,
  built               INTEGER,
  class_society       TEXT,
  imo                 TEXT,
  day_rate            NUMERIC DEFAULT 0,
  voyage_days         INTEGER DEFAULT 0,
  pl_mtd              NUMERIC DEFAULT 0,
  commercial_mode     TEXT DEFAULT 'tc',
  pool_name           TEXT,
  charterer           TEXT,
  tc_rate             NUMERIC,
  tc_start            DATE,
  tc_end              DATE,
  acquired            TEXT,
  lat                 NUMERIC,
  lng                 NUMERIC,
  note                TEXT,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VESSEL EARNINGS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vessel_earnings (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vessel_id        TEXT NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
  period           TEXT NOT NULL,           -- e.g. 'May-2026'
  gross_income     NUMERIC DEFAULT 0,
  brokerage_comm   NUMERIC DEFAULT 0,
  pool_commission  NUMERIC DEFAULT 0,
  opex             NUMERIC DEFAULT 0,
  insurance_pi     NUMERIC DEFAULT 0,
  war_risk         NUMERIC DEFAULT 0,
  shore_costs      NUMERIC DEFAULT 0,
  interest         NUMERIC DEFAULT 0,
  repayment        NUMERIC DEFAULT 0,
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vessel_id, period)
);

-- ─── MONTHLY FINANCIALS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS monthly_financials (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  period       TEXT NOT NULL,
  period_date  DATE,
  vertical     TEXT NOT NULL,
  revenue      NUMERIC DEFAULT 0,
  ebitda       NUMERIC DEFAULT 0,
  cash         NUMERIC DEFAULT 0,
  receivables  NUMERIC DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(period, vertical)
);

-- ─── LEGAL MATTERS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS legal_matters (
  id            TEXT PRIMARY KEY,
  type          TEXT,
  party         TEXT,
  gmpl_position TEXT DEFAULT 'Respondent',
  exposure      NUMERIC DEFAULT 0,
  next_date     DATE,
  next_event    TEXT,
  status        TEXT DEFAULT 'Active — Medium',
  legal_spend   NUMERIC DEFAULT 0,
  counsel       TEXT,
  notes         TEXT,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CERTIFICATES ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vessel          TEXT NOT NULL,
  cert_name       TEXT NOT NULL,
  expires         DATE NOT NULL,
  issuing_authority TEXT,
  status          TEXT DEFAULT 'green',
  action_required TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INSPECTIONS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inspections (
  id              TEXT PRIMARY KEY,
  vessel          TEXT NOT NULL,
  type            TEXT,
  port            TEXT,
  authority       TEXT,
  date            DATE,
  result          TEXT,
  deficiencies    INTEGER,
  score           NUMERIC,
  detained        BOOLEAN DEFAULT FALSE,
  next_due        TEXT,
  observations    TEXT,
  action_taken    TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── HSE INCIDENTS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hse_incidents (
  id              TEXT PRIMARY KEY,
  vessel          TEXT,
  type            TEXT,
  description     TEXT,
  date            DATE,
  severity        TEXT DEFAULT 'low',
  status          TEXT DEFAULT 'open',
  root_cause      TEXT,
  corrective      TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ADMIN UPLOAD LOG ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS upload_log (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uploaded_at  TIMESTAMPTZ DEFAULT NOW(),
  filename     TEXT,
  uploaded_by  TEXT DEFAULT 'advisor',
  rows_vessels INTEGER DEFAULT 0,
  rows_ops     INTEGER DEFAULT 0,
  rows_deals   INTEGER DEFAULT 0,
  status       TEXT DEFAULT 'success',
  notes        TEXT
);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════════════════
ALTER TABLE deals              ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_scenarios     ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessels            ENABLE ROW LEVEL SECURITY;
ALTER TABLE vessel_earnings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_matters      ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE hse_incidents      ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_log         ENABLE ROW LEVEL SECURITY;

-- Public read + insert policies (anon key — tighten for production with auth)
DO $$ DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['deals','deal_scenarios','vessels','vessel_earnings',
    'monthly_financials','legal_matters','certificates','inspections','hse_incidents','upload_log']
  LOOP
    EXECUTE format('CREATE POLICY "anon_select_%s" ON %s FOR SELECT USING (true)', tbl, tbl);
    EXECUTE format('CREATE POLICY "anon_insert_%s" ON %s FOR INSERT WITH CHECK (true)', tbl, tbl);
    EXECUTE format('CREATE POLICY "anon_update_%s" ON %s FOR UPDATE USING (true)', tbl, tbl);
    EXECUTE format('CREATE POLICY "anon_delete_%s" ON %s FOR DELETE USING (true)', tbl, tbl);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED — Goodearth real fleet (matches seed.js)
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO vessels (id,name,type,flag,utilisation,target_util,status,position,route,crew,defects,cert_status,dwt,built,class_society,imo,day_rate,voyage_days,pl_mtd,commercial_mode,pool_name,charterer,tc_rate,tc_start,tc_end,acquired,lat,lng,note)
VALUES
('V001','MT Prelude','MR Product Tanker','Marshall Islands',88,85,'amber','Arabian Gulf','Fujairah → Jubail',24,1,'ok',47200,2018,'DNV','9823041',20400,12,214000,'pool','Hafnia Pool → Maersk Tankers Pool',NULL,NULL,NULL,NULL,'Aug 2025',25.5,56.1,'Transferring from Hafnia to Maersk Tankers Pool'),
('V002','MT Anael','MR Product Tanker','Marshall Islands',95,88,'green','Red Sea','Jeddah → Suez',23,0,'ok',46800,2019,'BV','9871234',19500,18,312000,'tc',NULL,'Trafigura Pte Ltd',19500,'2026-01-15','2027-01-14','Jan 2026',22.5,38.2,'Time Charter to Trafigura Pte Ltd at $19,500/day until Jan 2027'),
('V003','MT Nura Kara','MR Product Tanker','Malta',92,88,'green','Persian Gulf','Ras Tanura → Hamriyah',24,2,'ok',47500,2017,'LR','9756123',21200,8,298000,'pool','Maersk Tankers Pool',NULL,NULL,NULL,NULL,'Mar 2026',26.8,50.8,'Operating in Maersk Tankers Pool'),
('V004','MT Nura Bright','MR Product Tanker','Malta',82,80,'green','Gulf of Oman','Hamriyah → Mumbai',23,1,'ok',46500,2020,'DNV','9912345',0,14,178000,'captive',NULL,'Goodearth Captive Cargoes',NULL,NULL,NULL,NULL,'Apr 2026',23.2,59.1,'Dedicated captive cargo operations'),
('B001','Cosmos 1','Inland River Barge','India',90,85,'green','Mandovi River, Goa','Captive — Internal Cargo',8,0,'ok',2100,2024,'IACS','N/A',0,0,42000,'captive',NULL,'Goodearth Internal',NULL,NULL,NULL,NULL,'2024',15.5,73.8,'2100 MT class IACS. Captive operations.'),
('B002','Cosmos 2','Inland River Barge','India',88,85,'green','Mandovi River, Goa','Captive — Internal Cargo',8,0,'ok',2100,2024,'IACS','N/A',0,0,40000,'captive',NULL,'Goodearth Internal',NULL,NULL,NULL,NULL,'2024',15.48,73.82,'2100 MT class IACS. Captive operations.'),
('B003','Cosmos 3','Inland River Barge','India',85,85,'green','Mandovi River, Goa','Captive — Internal Cargo',8,1,'ok',2100,2025,'IACS','N/A',0,0,38000,'captive',NULL,'Goodearth Internal',NULL,NULL,NULL,NULL,'2025',15.46,73.84,'2100 MT class IACS. Captive operations.'),
('B004','Cosmos 4','Inland River Barge','India',82,85,'amber','Mandovi River, Goa','Captive — Internal Cargo',8,2,'ok',2100,2025,'IACS','N/A',0,0,35000,'captive',NULL,'Goodearth Internal',NULL,NULL,NULL,NULL,'2025',15.44,73.86,'2100 MT class IACS. Captive operations.'),
('B005','Cosmos 5','Inland River Barge','India',78,85,'amber','Mandovi River, Goa','Captive — Internal Cargo',8,0,'warning',2100,2026,'IACS','N/A',0,0,28000,'captive',NULL,'Goodearth Internal',NULL,NULL,NULL,NULL,'2026',15.42,73.88,'Newest vessel — 2026 build. Cert renewal required.')
ON CONFLICT (id) DO UPDATE SET
  utilisation=EXCLUDED.utilisation, position=EXCLUDED.position,
  route=EXCLUDED.route, pl_mtd=EXCLUDED.pl_mtd,
  day_rate=EXCLUDED.day_rate, updated_at=NOW();

-- Monthly financials seed (last 12 months)
INSERT INTO monthly_financials (period, period_date, vertical, revenue, ebitda) VALUES
('Jun-25','2025-06-01','Ship Owning',7800000,1900000),('Jun-25','2025-06-01','Ship Management',4100000,1600000),('Jun-25','2025-06-01','River Barges',1200000,600000),('Jun-25','2025-06-01','Ship Repairing',1100000,220000),
('Jul-25','2025-07-01','Ship Owning',8200000,2100000),('Jul-25','2025-07-01','Ship Management',4300000,1800000),('Jul-25','2025-07-01','River Barges',1400000,700000),('Jul-25','2025-07-01','Ship Repairing',1200000,260000),
('Aug-25','2025-08-01','Ship Owning',6900000,1600000),('Aug-25','2025-08-01','Ship Management',3800000,1500000),('Aug-25','2025-08-01','River Barges',1300000,650000),('Aug-25','2025-08-01','Ship Repairing',1000000,200000),
('Sep-25','2025-09-01','Ship Owning',8500000,2100000),('Sep-25','2025-09-01','Ship Management',4400000,1800000),('Sep-25','2025-09-01','River Barges',1500000,750000),('Sep-25','2025-09-01','Ship Repairing',1300000,280000),
('Oct-25','2025-10-01','Ship Owning',9100000,2300000),('Oct-25','2025-10-01','Ship Management',4700000,1900000),('Oct-25','2025-10-01','River Barges',1600000,800000),('Oct-25','2025-10-01','Ship Repairing',1400000,300000),
('Nov-25','2025-11-01','Ship Owning',9400000,2400000),('Nov-25','2025-11-01','Ship Management',4900000,2000000),('Nov-25','2025-11-01','River Barges',1700000,850000),('Nov-25','2025-11-01','Ship Repairing',1500000,320000),
('Dec-25','2025-12-01','Ship Owning',10200000,2800000),('Dec-25','2025-12-01','Ship Management',5200000,2200000),('Dec-25','2025-12-01','River Barges',1800000,900000),('Dec-25','2025-12-01','Ship Repairing',1600000,350000),
('Jan-26','2026-01-01','Ship Owning',8800000,2200000),('Jan-26','2026-01-01','Ship Management',4600000,1900000),('Jan-26','2026-01-01','River Barges',1700000,850000),('Jan-26','2026-01-01','Ship Repairing',1300000,280000),
('Feb-26','2026-02-01','Ship Owning',8000000,1900000),('Feb-26','2026-02-01','Ship Management',4200000,1700000),('Feb-26','2026-02-01','River Barges',1500000,750000),('Feb-26','2026-02-01','Ship Repairing',1200000,250000),
('Mar-26','2026-03-01','Ship Owning',9400000,2400000),('Mar-26','2026-03-01','Ship Management',4700000,1900000),('Mar-26','2026-03-01','River Barges',1700000,850000),('Mar-26','2026-03-01','Ship Repairing',1400000,290000),
('Apr-26','2026-04-01','Ship Owning',9800000,2500000),('Apr-26','2026-04-01','Ship Management',4900000,2000000),('Apr-26','2026-04-01','River Barges',1800000,900000),('Apr-26','2026-04-01','Ship Repairing',1500000,310000),
('May-26','2026-05-01','Ship Owning',8200000,2100000),('May-26','2026-05-01','Ship Management',4500000,1800000),('May-26','2026-05-01','River Barges',1800000,900000),('May-26','2026-05-01','Ship Repairing',1400000,300000)
ON CONFLICT (period, vertical) DO NOTHING;
