'use client';

import { useState, useEffect, createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeState = () => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // システムのダークモード設定を監視
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme as ResolvedTheme);
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme]);

  // テーマをDOMに適用
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    
    // CSS変数を更新
    if (resolvedTheme === 'dark') {
      root.style.setProperty('--color-bg-primary', '#1A1A1A');
      root.style.setProperty('--color-bg-secondary', '#2D2D2D');
      root.style.setProperty('--color-text-primary', '#F9F9F9');
      root.style.setProperty('--color-text-secondary', '#CCCCCC');
      root.style.setProperty('--color-text-muted', '#999999');
      root.style.setProperty('--color-border-light', '#404040');
      root.style.setProperty('--color-border-medium', '#525252');
    } else {
      root.style.setProperty('--color-bg-primary', '#FFFFFF');
      root.style.setProperty('--color-bg-secondary', '#FFFFFF');
      root.style.setProperty('--color-text-primary', '#000000');
      root.style.setProperty('--color-text-secondary', '#333333');
      root.style.setProperty('--color-text-muted', '#666666');
      root.style.setProperty('--color-border-light', '#E2E8F0');
      root.style.setProperty('--color-border-medium', '#CBD5E0');
    }
  }, [resolvedTheme]);

  // 初期化時にlocalStorageから読み込み
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
};

export { ThemeContext };