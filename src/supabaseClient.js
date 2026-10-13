import { createClient } from '@supabase/supabase-js';

// Safe environment accessor supporting Vite (import.meta.env), Next.js, and Node.js (process.env)
const env = (typeof import.meta !== 'undefined' && import.meta.env) 
  ? import.meta.env 
  : (typeof process !== 'undefined' && process.env ? process.env : {});

export const SUPABASE_URL = 
  env.NEXT_PUBLIC_SUPABASE_URL || 
  env.VITE_SUPABASE_URL || 
  'https://npjmcwjpfuxhcyvczitx.supabase.co';

export const SUPABASE_ANON_KEY = 
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  env.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_iGa1xQ95bT2Lj4meMsmtPg_xRLYHBmX';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

/**
 * Health check helper to test connection & table availability
 */
export async function testSupabaseConnection() {
  const start = performance.now();
  try {
    // 1. Test Auth health or basic query
    const res = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      headers: { apikey: SUPABASE_ANON_KEY }
    });
    const latency = Math.round(performance.now() - start);

    if (!res.ok) {
      return { ok: false, latency, message: `HTTP status ${res.status}` };
    }

    // 2. Check which School tables are available in the schema cache
    const tablesToCheck = ['schools', 'students', 'classes', 'subjects', 'staff', 'assessments', 'scores', 'attendance_records', 'announcements', 'audit_logs'];
    const tableStatus = {};

    for (const tbl of tablesToCheck) {
      try {
        const { error } = await supabase.from(tbl).select('*').limit(1);
        tableStatus[tbl] = !error;
      } catch {
        tableStatus[tbl] = false;
      }
    }

    const availableCount = Object.values(tableStatus).filter(Boolean).length;

    return {
      ok: true,
      latency,
      tableStatus,
      availableCount,
      totalTables: tablesToCheck.length,
      hasAllTables: availableCount === tablesToCheck.length
    };
  } catch (err) {
    return {
      ok: false,
      latency: Math.round(performance.now() - start),
      message: err.message || 'Connection failed'
    };
  }
}
