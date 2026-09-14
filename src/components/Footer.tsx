/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface FooterProps {
  isOnDressingScreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false }) => {
  const { t } = useLocalization();

  const linkClasses = "text-stone-600 hover:text-stone-950 transition-colors uppercase tracking-[0.12em] font-medium text-[11px]";

  return (
    <footer className="w-full bg-white/60 backdrop-blur-md border-t border-rose-100/50 py-2.5 px-4 sm:px-6 md:px-8 mt-auto z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <p className="text-stone-600 text-[11px] font-medium tracking-wide">
            {t('footerCredit')}
          </p>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end items-center gap-x-5 gap-y-1">
          <a href="#" className={linkClasses}>Conditions</a>
          <a href="#" className={linkClasses}>Confidentialité</a>
          <div className="h-3 w-px bg-stone-300 hidden sm:block"></div>
          <a href="https://facebook.com/pixelshoot" target="_blank" rel="noopener noreferrer" className={linkClasses}>Facebook</a>
          <a href="https://instagram.com/pixelshoot" target="_blank" rel="noopener noreferrer" className={linkClasses}>Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
