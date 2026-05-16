# Supabase Setup — Step-by-Step

## What you are setting up
A PostgreSQL database hosted by Supabase that stores all Goodearth Maritime fleet data, deals, and financials. Once connected, the Chairman's dashboard reads live from this database and the Advisor Admin Portal writes to it in real time.

---

## Step 1 — Create a Supabase Account
1. Go to **https://supabase.com**
2. Click **Start your project** → Sign up with GitHub or email
3. Confirm your email if prompted

---

## Step 2 — Create a New Project
1. Once logged in, click **New Project**
2. Fill in:
   - **Organisation**: Create one (e.g. "Goodearth Maritime")
   - **Project Name**: `gmpl-dashboard`
   - **Database Password**: Choose a strong password and **save it securely**
   - **Region**: Select **Singapore** (closest to Dubai for low latency)
3. Click **Create new project**
4. Wait 2–3 minutes for the project to provision

---

## Step 3 — Run the Database Schema
1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Open the file `supabase/schema.sql` from this project
4. Copy the **entire contents** and paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
6. You should see: `Success. No rows returned`
7. This creates all tables, enables Row Level Security, and seeds the initial fleet data

---

## Step 4 — Get Your API Keys
1. In the left sidebar, click **Settings** → **API**
2. You need two values:
   - **Project URL**: looks like `https://abcdefghijk.supabase.co`
   - **anon public key**: a long string starting with `eyJ...`
3. Copy both values

---

## Step 5 — Add Keys to the Dashboard

### For local development:
1. In the `gmpl-dashboard` folder, create a file called `.env` (no extension)
2. Add these two lines (replace with your actual values):
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. Restart the dev server: `npm run dev`
4. The status indicator in the Admin Portal will change from **DEMO MODE** to **SUPABASE LIVE**

### For Vercel (production):
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add both variables:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
3. Click **Save** → **Redeploy**

---

## Step 6 — Verify the Connection
1. Open the dashboard at your URL
2. Navigate to `/admin` (e.g. `http://localhost:3000/admin`)
3. Log in with: **admin / admin**
4. The green badge at the top right should show **SUPABASE LIVE**
5. If it still shows **DEMO MODE**, check your `.env` file and restart

---

## Step 7 — First Data Upload (Optional)
Once connected:
1. Go to Admin Portal → **Data Upload** tab
2. Upload the completed `GMPL_Data_Template.xlsx`
3. Click **Push to Dashboard**
4. The Chairman's dashboard will immediately reflect the real fleet data

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "DEMO MODE" after adding keys | Restart dev server. Check no typos in `.env` |
| "DB Error" in admin portal | Check the schema ran successfully (Step 3) |
| RLS policy error | Re-run the policy section of schema.sql |
| Data not appearing on dashboard | Check browser console for API errors |

---

## Security Note
The `admin/admin` password is for **demo purposes only**. Before presenting to external parties, change this in `src/admin/AdminDashboard.jsx` line where it checks `user === 'admin' && pass === 'admin'`. For production, integrate Supabase Auth with email/password login.

---

*Goodearth Maritime · Confidential · Prepared by ATS Advisory · May 2026*
