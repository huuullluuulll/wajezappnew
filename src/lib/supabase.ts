import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tgpfgdlntbhkshpybnrj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRncGZnZGxudGJoa3NocHlibnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExOTE4NDQsImV4cCI6MjA0Njc2Nzg0NH0.req6xo04kpE0SZZiv7F2G7973_nUQBhz3kULFZj6jH4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);