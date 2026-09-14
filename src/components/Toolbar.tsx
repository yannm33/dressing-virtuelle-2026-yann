/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { RotateCcwIcon, Share2Icon, BookmarkIcon } from './icons';
import { useLocalization } from '../contexts/LocalizationContext';

interface ToolbarProps {
  onStartOver: () => void;
  onOpenShareModal: () => void;
  onSave: () => void;
  isActionDisabled: boolean;
  isSaveDisabled: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onStartOver,
  onOpenShareModal,
  onSave,
  isActionDisabled,
  isSaveDisabled
}) => {
  const { t } = useLocalization();

  return (
    <div className="flex-shrink-0 flex items-center justify-between w-full max-w-[760px] px-2 py-1">
      {/* Badge atelier haute couture */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span className="text-xs font-serif font-bold text-stone-900 tracking-wider uppercase">
          Cabine Stylisme Privée
        </span>
      </div>

      {/* Boutons d'action rapides */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button 
          onClick={onStartOver}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white/70 hover:bg-white text-stone-700 border border-stone-200/90 shadow-2xs transition-all active:scale-95 backdrop-blur-md"
          title="Importer une nouvelle silhouette"
        >
          <RotateCcwIcon className="w-3.5 h-3.5 shrink-0 text-stone-500" />
          <span>Nouvelle photo</span>
        </button>

        <button 
          onClick={onOpenShareModal}
          disabled={isActionDisabled}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white/70 hover:bg-white text-stone-700 border border-stone-200/90 shadow-2xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
          title={t('share')}
        >
          <Share2Icon className="w-3.5 h-3.5 shrink-0 text-stone-500" />
          <span>{t('share')}</span>
        </button>

        <button
          onClick={onSave}
          disabled={isSaveDisabled}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-950 hover:bg-black text-white shadow-xs transition-all active:scale-95 disabled:bg-stone-300 disabled:text-stone-100 disabled:cursor-not-allowed"
          title={t('saveOutfit')}
        >
          <BookmarkIcon className="w-3.5 h-3.5 shrink-0 text-amber-300" />
          <span>Enregistrer le look</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
