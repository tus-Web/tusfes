import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'ja' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻訳辞書
const translations = {
  ja: {
    // ボトムバー
    'bottomBar.map': 'マップ',
    'bottomBar.calendar': 'カレンダー',
    'bottomBar.settings': '設定',
    
    // 設定画面
    'settings.title': '設定',
    'settings.darkMode': 'ダークモード',
    'settings.lightMode': 'ライトモード',
    'settings.language': '言語',
    'settings.appearance': '外観',
    'settings.general': '一般',
    
    // 言語選択
    'language.japanese': '日本語',
    'language.english': 'English',
    
    // マップ画面
    'map.filter': '絞り込み',
    'map.clear': 'クリア',
    'map.results': '件の施設が見つかりました',
    
    // カレンダー画面
    'calendar.title': 'イベントスケジュール',
    'calendar.date': '2024年11月2日(土)',
    'calendar.kidFriendly': '子供向け',
    'calendar.showing': '件表示中',
    
    // 共通
    'common.close': '閉じる',
    'common.cancel': 'キャンセル',
    'common.save': '保存',
  },
  en: {
    // ボトムバー
    'bottomBar.map': 'Map',
    'bottomBar.calendar': 'Calendar',
    'bottomBar.settings': 'Settings',
    
    // 設定画面
    'settings.title': 'Settings',
    'settings.darkMode': 'Dark Mode',
    'settings.lightMode': 'Light Mode',
    'settings.language': 'Language',
    'settings.appearance': 'Appearance',
    'settings.general': 'General',
    
    // 言語選択
    'language.japanese': '日本語',
    'language.english': 'English',
    
    // マップ画面
    'map.filter': 'Filter',
    'map.clear': 'Clear',
    'map.results': ' facilities found',
    
    // カレンダー画面
    'calendar.title': 'Event Schedule',
    'calendar.date': 'November 2, 2024 (Sat)',
    'calendar.kidFriendly': 'Kid Friendly',
    'calendar.showing': ' items shown',
    
    // 共通
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
  },
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageState = () => {
  const [language, setLanguageState] = useState<Language>('ja');

  useEffect(() => {
    // localStorage から言語設定を読み込み
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ja' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    } else {
      // ブラウザの言語設定を確認
      const browserLanguage = navigator.language.toLowerCase();
      const detectedLanguage = browserLanguage.startsWith('ja') ? 'ja' : 'en';
      setLanguageState(detectedLanguage);
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return {
    language,
    setLanguage,
    t,
  };
};

export { LanguageContext };