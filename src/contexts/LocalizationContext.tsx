/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { translations } from '../lib/translations';
import type { TranslationKey } from '../lib/translations';

type Language = 'fr' | 'en';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: Record<string, string>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = useCallback((key: TranslationKey, replacements: Record<string, string> = {}) => {
    let translation = translations[language][key] || translations['en'][key];
    
    if (!translation) {
      console.warn(`Translation key not found: "${key}"`);
      return key; // Return the key itself as a fallback to prevent crashes
    }

    Object.keys(replacements).forEach(placeholder => {
        const value = replacements[placeholder];
        translation = translation.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
    });

    return translation;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, t]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};