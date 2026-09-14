/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { OutfitLayer } from '../types';
import { Trash2Icon } from './icons';
import { useLocalization } from '../contexts/LocalizationContext';
import type { TranslationKey } from '../lib/translations';

interface OutfitStackProps {
  outfitHistory: OutfitLayer[];
  onRemoveLastGarment: () => void;
}

const OutfitStack: React.FC<OutfitStackProps> = ({ outfitHistory, onRemoveLastGarment }) => {
  const { t } = useLocalization();

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-serif tracking-wider text-gray-800 border-b border-gray-400/50 pb-2 mb-3">{t('myOutfit')}</h2>
      <div className="space-y-2">
        {outfitHistory.map((layer, index) => {
          const garmentName = layer.garment 
            ? (layer.garment.isCustom ? layer.garment.name : t(layer.garment.name as TranslationKey)) 
            : t('baseModel');
            
          return (
            <div
              key={layer.garment?.id || 'base'}
              className="flex items-center justify-between bg-white/50 p-2 rounded-lg animate-fade-in border border-gray-200/80"
            >
              <div className="flex items-center overflow-hidden">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold text-gray-600 bg-gray-200 rounded-full">
                    {index + 1}
                  </span>
                  {layer.garment && (
                      <img src={layer.garment.url} alt={garmentName} className="flex-shrink-0 w-12 h-12 object-cover rounded-md mr-3" />
                  )}
                  <span className="font-semibold text-gray-800 truncate" title={garmentName}>
                    {garmentName}
                  </span>
              </div>
              {index > 0 && index === outfitHistory.length - 1 && (
                 <button
                  onClick={onRemoveLastGarment}
                  className="flex-shrink-0 text-gray-500 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                  aria-label={t('removeGarment', { garmentName: garmentName })}
                >
                  <Trash2Icon className="w-5 h-5" />
                </button>
              )}
            </div>
          );
        })}
        {outfitHistory.length === 1 && (
            <p className="text-center text-sm text-gray-500 pt-4">{t('stackedItemsAppearHere')}</p>
        )}
      </div>
    </div>
  );
};

export default OutfitStack;