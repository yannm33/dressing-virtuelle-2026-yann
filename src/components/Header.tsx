/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon } from './icons';
import LanguageSwitcher from './LanguageSwitcher';
import RotatingHeaderText from './RotatingHeaderText';
import { useLocalization } from '../contexts/LocalizationContext';

interface HeaderProps {
  isMockMode?: boolean;
  onGoHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMockMode = false, onGoHome }) => {
  const { t } = useLocalization();
  return (
    <header className="w-full py-2.5 px-4 sm:px-6 md:px-8 bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-rose-100/50 shadow-sm shadow-rose-900/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <div 
          onClick={onGoHome}
          className={`flex items-center gap-3.5 flex-1 min-w-0 ${onGoHome ? 'cursor-pointer select-none group' : ''}`}
          title={onGoHome ? "Page d'accueil" : undefined}
          role={onGoHome ? "button" : undefined}
        >
          <div className="w-8 h-8 rounded-lg bg-stone-950 text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:bg-stone-800 transition-colors">
            <ShirtIcon className="w-4.5 h-4.5" />
          </div>
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-serif font-bold text-stone-950 text-xs sm:text-sm md:text-base tracking-wider uppercase whitespace-nowrap">
              Dressing Virtuel Pixelprod
            </span>
            <span className="hidden lg:inline-block h-3.5 w-px bg-stone-300"></span>
            <div className="hidden lg:block flex-1 min-w-0">
              <RotatingHeaderText />
            </div>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <LanguageSwitcher />
        </div>
      </div>

      {isMockMode && (
        <div className="absolute top-full left-0 right-0 bg-amber-400 text-stone-950 text-[11px] font-bold tracking-wide uppercase text-center py-0.5 shadow-xs">
          {t('mockModeActive')}
        </div>
      )}
    </header>
  );
};

export default Header;