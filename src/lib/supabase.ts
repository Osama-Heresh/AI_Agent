import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vabtwudyapklnxaenrii.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhYnR3dWR5YXBrbG54YWVucmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzOTA3NzYsImV4cCI6MjA4MDk2Njc3Nn0.s4vTV98pNW8OPKM7CCsi1hpXKYcpLcQSYb3gesyFsMM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
