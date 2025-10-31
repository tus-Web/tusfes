'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/src/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  isAnonymous: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // 匿名ユーザーかどうかを判定
  const isAnonymous = user?.is_anonymous ?? false;

  // 初回マウント時: 既存セッションをチェック & 自動匿名ログイン
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 既存のセッションを確認
        const { data: { session: existingSession } } = await supabase.auth.getSession();

        if (existingSession) {
          // セッションがあればそのまま使用
          setSession(existingSession);
          setUser(existingSession.user);
          // console.log('既存セッションを復元しました:', existingSession.user.id);
        } else {
          // セッションがなければ自動的に匿名ログイン
          // console.log('セッションがないため、自動匿名ログインを実行します');
          await signInAnonymously();
        }
      } catch (error) {
        console.error('認証初期化エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // セッション変更を監視
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // console.log('Auth状態変更:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // セッションが切れた場合は自動で匿名ログイン
        if (event === 'SIGNED_OUT') {
          // console.log('サインアウトされました。自動匿名ログインを実行します');
          await signInAnonymously();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * 匿名ログイン
   */
  const signInAnonymously = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('匿名ログインエラー:', error);
        throw error;
      }
      
      // console.log('匿名ログイン成功:', data.user?.id);
      setUser(data.user);
      setSession(data.session);
    } catch (error) {
      console.error('匿名ログイン失敗:', error);
      throw error;
    }
  };

  /**
   * サインアウト
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('サインアウトエラー:', error);
        throw error;
      }
      
      // console.log('サインアウト成功');
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('サインアウト失敗:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading, 
        signInAnonymously, 
        signOut, 
        isAnonymous 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 認証コンテキストを使用するためのカスタムフック
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
