import { supabase } from './supabase';

/**
 * ユーザーセッションを取得
 */
export async function getUserSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Session error:', error);
    return null;
  }
  return data;
}

/**
 * 匿名ログイン
 */
export async function signInAnonymously() {
  const { error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error('Sign in error:', error);
    return { success: false, error };
  }
  return { success: true, error: null };
}
