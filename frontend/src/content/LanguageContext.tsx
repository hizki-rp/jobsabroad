import React, { createContext, useContext, useState, ReactNode } from 'react';
import websiteContent from './websiteContent';

type Language = 'en' | 'am';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  content: typeof websiteContent.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const content = websiteContent[currentLanguage];

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};