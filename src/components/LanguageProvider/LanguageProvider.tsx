'use client';

import React from 'react';
import { LanguageContext, useLanguageState } from '@/hooks/use-language';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const languageState = useLanguageState();

  return (
    <LanguageContext.Provider value={languageState}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;