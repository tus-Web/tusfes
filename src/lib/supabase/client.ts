import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,  // ブラウザのlocalStorageにセッションを保存
    autoRefreshToken: true, // トークンを自動更新
    detectSessionInUrl: true, // URLからセッション情報を検出
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
