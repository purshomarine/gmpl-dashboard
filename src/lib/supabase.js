import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// If no env vars set, we operate in mock/demo mode — no real DB calls
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const DEMO_MODE = !supabaseUrl

/**
 * Fetch a table from Supabase, or return mock data if in demo mode.
 * @param {string} table - Supabase table name
 * @param {any[]} mockData - fallback data for demo mode
 */
export async function fetchTable(table, mockData) {
  if (DEMO_MODE || !supabase) return mockData
  const { data, error } = await supabase.from(table).select('*').order('id')
  if (error) { console.error(`[Supabase] ${table}:`, error.message); return mockData }
  return data
}
