-- ─────────────────────────────────────────────────────────────────────────────
-- GMPL Chairman Dashboard — Supabase Seed
-- Run this in your Supabase SQL Editor to provision all tables and demo data.
-- ─────────────────────────────────────────────────────────────────────────────

-- Vessels
CREATE TABLE IF NOT EXISTS vessels (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT,
  flag        TEXT,
  util        INT,
  target      INT,
  pl          INT,
  status      TEXT,
  pos         TEXT,
  route       TEXT,
  crew        INT,
  defects     INT,
  certs       TEXT,
  dwt         INT,
  built       INT,
  class       TEXT
);

INSERT INTO vessels VALUES
  ('V001','MV Sea Empress','Chemical Tanker','Malta',92,88,485000,'green','Arabian Gulf','Hamriyah → Jebel Ali',24,2,'ok',19800,2014,'BV'),
  ('V002','MV Good Earth Alpha','Product Tanker','Panama',78,85,312000,'amber','Red Sea','Suez → Aden',22,5,'warning',47500,2011,'DNV'),
  ('V003','MV Neptune Glory','Chemical Tanker','Marshall Is.',95,88,623000,'green','Persian Gulf','Jubail → Fujairah',26,0,'ok',22400,2017,'LR'),
  ('V004','MV Saffron Star','Crude Carrier','Panama',65,80,-48000,'red','Laid Up — Dubai','Awaiting charter',18,12,'expired',105000,2006,'ABS'),
  ('V005','MV Indian Ocean','Product Tanker','Malta',88,85,398000,'green','Gulf of Oman','Muscat → Mumbai',23,1,'ok',51200,2015,'BV'),
  ('V006','MV Gulf Pioneer','Chemical Tanker','Cyprus',82,85,291000,'amber','Indian Ocean','Mangalore → Yanbu',25,3,'ok',17600,2013,'DNV'),
  ('V007','MV Maritime Crown','Bulk Carrier','Marshall Is.',91,88,445000,'green','South China Sea','Singapore → Kolkata',21,0,'ok',81000,2018,'NK'),
  ('V008','MV Emerald Wave','Product Tanker','Panama',70,80,128000,'amber','Bay of Bengal','Chennai → Colombo',22,4,'warning',39800,2010,'BV')
ON CONFLICT (id) DO NOTHING;

-- Legal matters
CREATE TABLE IF NOT EXISTS legal_matters (
  id      TEXT PRIMARY KEY,
  type    TEXT,
  party   TEXT,
  pos     TEXT,
  exp     INT,
  next    DATE,
  event   TEXT,
  status  TEXT,
  spend   INT,
  counsel TEXT
);

INSERT INTO legal_matters VALUES
  ('L001','Charter Party Dispute','Petrochemical Corp Ltd','Claimant',2400000,'2026-06-14','Arbitration Hearing','red',85000,'Hill Dickinson LLP'),
  ('L002','P&I Cargo Claim','Asian Chemical Holdings','Respondent',890000,'2026-07-02','Pleadings Deadline','amber',32000,'Ince & Co'),
  ('L003','Crew Injury Claim','Chief Engineer Ramirez','Respondent',320000,'2026-05-28','Medical Assessment','red',18500,'P&I Club'),
  ('L004','Newbuilding Contract Dispute','Eastern Shipyard Ltd','Claimant',4100000,'2026-08-19','Expert Determination','amber',127000,'Watson Farley & Williams')
ON CONFLICT (id) DO NOTHING;

-- Revenue trend (monthly)
CREATE TABLE IF NOT EXISTS revenue_trend (
  id   SERIAL PRIMARY KEY,
  m    TEXT NOT NULL,
  r    NUMERIC(6,1),
  e    NUMERIC(6,1)
);

INSERT INTO revenue_trend (m, r, e) VALUES
  ('Jun 25',14.2,3.8),('Jul 25',15.8,4.2),('Aug 25',13.1,3.1),
  ('Sep 25',16.4,4.6),('Oct 25',17.2,5.1),('Nov 25',18.1,5.4),
  ('Dec 25',19.4,6.1),('Jan 26',16.8,4.8),('Feb 26',15.3,4.1),
  ('Mar 26',17.9,5.3),('Apr 26',18.6,5.7),('May 26',17.1,5.0);

-- Zoho expenses (cached copy from Zoho API)
CREATE TABLE IF NOT EXISTS zoho_expenses (
  expense_id        TEXT PRIMARY KEY,
  expense_item_name TEXT,
  category_name     TEXT,
  merchant_name     TEXT,
  amount            NUMERIC(12,2),
  currency_code     TEXT,
  date              DATE,
  report_status     TEXT,
  submitted_by      TEXT,
  vessel            TEXT,
  payment_mode      TEXT
);

INSERT INTO zoho_expenses VALUES
  ('EXP-10291','Port Dues & Pilotage','Port Charges','Hamriyah Free Zone Authority',18400,'USD','2026-05-12','submitted','Capt. Ahmed Hassan','MV Neptune Glory','Corporate Card'),
  ('EXP-10290','Travel & Accommodation','Corporate Travel','Marriott Al Barsha',4230,'USD','2026-05-11','approved','Fleet Manager Ravi Kumar','Corporate','Corporate Card'),
  ('EXP-10289','Spare Parts & Stores','Technical','Wilhelmsen Ships Service',67800,'USD','2026-05-10','approved','Ch. Engr. Santos','MV Sea Empress','Bank Transfer'),
  ('EXP-10288','Dry Dock & Repairs','Drydock','Dubai Drydocks World',245000,'USD','2026-05-09','pending','Technical Supt. Mehta','MV Saffron Star','Bank Transfer'),
  ('EXP-10287','Bunker Purchase','Bunkers','ENOC Marine',189300,'USD','2026-05-08','approved','Capt. Liu Wei','MV Maritime Crown','Bank Transfer'),
  ('EXP-10286','Agency Fees','Port Agency','Gulf Agency Company',8900,'USD','2026-05-07','submitted','Operations — Singh','MV Good Earth Alpha','Corporate Card'),
  ('EXP-10285','Crew Welfare','Crew','Various',3200,'USD','2026-05-06','approved','Manning Supt. Fernandez','MV Indian Ocean','Cash'),
  ('EXP-10284','Insurance Premium','Insurance','UK P&I Club',42000,'USD','2026-05-05','approved','Finance Controller','Corporate','Bank Transfer')
ON CONFLICT (expense_id) DO NOTHING;

-- Row Level Security — enable on all tables so each user only sees permitted data
ALTER TABLE vessels         ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_matters   ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_trend   ENABLE ROW LEVEL SECURITY;
ALTER TABLE zoho_expenses   ENABLE ROW LEVEL SECURITY;

-- Anon read policy (demo mode — tighten for production)
CREATE POLICY "anon read vessels"        ON vessels         FOR SELECT USING (true);
CREATE POLICY "anon read legal"          ON legal_matters   FOR SELECT USING (true);
CREATE POLICY "anon read revenue"        ON revenue_trend   FOR SELECT USING (true);
CREATE POLICY "anon read expenses"       ON zoho_expenses   FOR SELECT USING (true);
