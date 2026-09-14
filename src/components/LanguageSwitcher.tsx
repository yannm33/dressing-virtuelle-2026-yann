/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    setLanguage(lang);
  };

  return (
    <div className="inline-flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-200">
      {(['fr', 'en'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => handleLanguageChange(lang)}
          className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all uppercase tracking-wider ${
            language === lang
              ? 'bg-stone-950 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-950 hover:bg-stone-200/60'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;