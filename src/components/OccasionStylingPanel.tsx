/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { occasionOptions, OccasionKey } from '../occasions';
import { CATEGORY_MAP, getOccasionCategory, normalizeStyleSearch, preferenceOptions, type StyleCategory, type StylingPreferences } from '../styleCatalog';
import Spinner from './Spinner';
import { SparklesIcon, CheckCircleIcon } from './icons';
import { motion } from 'framer-motion';

interface OccasionStylingPanelProps {
  onGenerateOutfit: (occasionKey: OccasionKey, preferences: StylingPreferences) => void;
  isLoading: boolean;
  numImagesToGenerate: number;
  onNumImagesChange: (num: number) => void;
}

const OccasionStylingPanel: React.FC<OccasionStylingPanelProps> = ({ 
  onGenerateOutfit, 
  isLoading, 
  numImagesToGenerate, 
  onNumImagesChange 
}) => {
  const { t, language } = useLocalization();
  const fr = language === 'fr';
  const [preferences, setPreferences] = useState<StylingPreferences>({});
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionKey>('cat_noel_reveillon_elegant');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('all');

  const filteredOccasions = useMemo(() => {
    let list: readonly OccasionKey[] = CATEGORY_MAP[activeCategory].keys;
    const q = normalizeStyleSearch(searchQuery);
    if (q) {
      list = list.filter(key => {
        const category = CATEGORY_MAP[getOccasionCategory(key)];
        const haystack = normalizeStyleSearch(t(key) + ' ' + key + ' ' + category.label + ' ' + category.en);
        return q.split(' ').every(term => haystack.includes(term));
      });
    }

    return list;
  }, [activeCategory, searchQuery, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onGenerateOutfit(selectedOccasion, preferences);
  };
  const selectedCategory = CATEGORY_MAP[getOccasionCategory(selectedOccasion)];
  const currentOccasionLabel = (fr ? selectedCategory.label : selectedCategory.en) + ' — ' + t(selectedOccasion);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* En-tête du styliste */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-stone-950">
            {t('generateByOccasion')}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase tracking-wider">
            Styliste IA Pro
          </span>
        </div>
        <p className="text-xs text-stone-500">
          {fr ? `Explorez ${occasionOptions.length} choix d’occasions, activités et styles. Personnalisez votre tenue selon vos préférences.` : `Explore ${occasionOptions.length} occasions, activities and styles. Personalize your outfit with your preferences.`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Catégories de styles en pilules horizontales */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            {fr ? 'Occasions, activités & styles' : 'Occasions, activities & styles'}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CATEGORY_MAP) as StyleCategory[]).map((cat) => {
              const info = CATEGORY_MAP[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setActiveCategory(cat);
                    setSearchQuery('');
                    if (cat !== 'all' && !(CATEGORY_MAP[cat].keys as readonly OccasionKey[]).includes(selectedOccasion)) {
                      setSelectedOccasion(CATEGORY_MAP[cat].keys[0]);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  
                  <span>{fr ? info.label : info.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Barre de recherche instantanée de style */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            aria-label={fr ? 'Rechercher dans les styles' : 'Search styles'}
            placeholder={fr ? 'Rechercher : Noël, plongée, gala…' : 'Search: Christmas, diving, gala…'}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory('all'); }}
            className="w-full pl-9 pr-16 py-2 bg-white border border-rose-100/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-xs text-stone-400 hover:text-stone-700"
            >
              {fr ? 'Effacer' : 'Clear'}
            </button>
          )}
        </div>

        {/* Grille de sélection des styles disponibles */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>{fr ? 'Choix disponibles' : 'Available choices'} ({filteredOccasions.length})</span>
            <span className="text-[10px] text-stone-400">{fr ? 'Cliquez pour choisir' : 'Click to select'}</span>
          </div>

          <div className="max-h-48 overflow-y-auto pr-1 grid grid-cols-2 gap-1.5 custom-scrollbar p-1.5 bg-gradient-to-b from-stone-50/50 to-white/50 rounded-xl border border-rose-100/60 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)]">
            {filteredOccasions.length > 0 ? (
              filteredOccasions.map((key) => {
                const isSelected = selectedOccasion === key;
                const isFavorite = key === 'occasion_lancement';
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isSelected}
                    title={t(key)}
                    onClick={() => setSelectedOccasion(key)}
                    className={`flex items-center justify-between p-2.5 text-left rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-stone-950 text-white font-bold shadow-xs'
                        : isFavorite
                        ? 'bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 border border-amber-200/80 font-semibold'
                        : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200/70 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 mr-1">
                      {isFavorite && <span className="text-[10px] text-amber-500 font-bold">★</span>}
                      <span className="break-words">{t(key)}</span>
                    </div>
                    {isSelected && (
                      <CheckCircleIcon className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 py-4 text-center text-xs text-stone-500">
                {fr ? "Aucun résultat pour" : "No results for"} « {searchQuery} ».
              </div>
            )}
          </div>
        </div>


        <fieldset disabled={isLoading} className="space-y-3">
          <legend className="text-xs font-bold text-stone-700 mb-2">{fr ? 'Personnalisation facultative' : 'Optional preferences'}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(preferenceOptions) as (keyof typeof preferenceOptions)[]).map(field => (
              <label key={field} className="text-xs text-stone-600 space-y-1">
                <span>{({ aesthetic: fr ? 'Esthétique' : 'Aesthetic', season: fr ? 'Saison' : 'Season', setting: fr ? 'Lieu' : 'Setting' })[field]}</span>
                <select className="w-full p-2 bg-white border border-stone-200 rounded-lg text-stone-900"
                  value={preferences[field] || ''}
                  onChange={event => setPreferences(prev => ({ ...prev, [field]: event.target.value }))}>
                  <option value="">{fr ? 'Sans préférence' : 'No preference'}</option>
                  {preferenceOptions[field].map(([labelFr, labelEn]) => (
                    <option key={labelEn} value={labelFr}>{fr ? labelFr : labelEn}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <label className="block text-xs text-stone-600 space-y-1">
            <span>{fr ? 'Couleurs, coupe, chaussures, matières, température ou besoins particuliers' : 'Colors, fit, footwear, materials, temperature or specific needs'}</span>
            <textarea maxLength={500} rows={3} value={preferences.details || ''}
              onChange={event => setPreferences(prev => ({ ...prev, details: event.target.value }))}
              placeholder={fr ? 'Ex. : bleu marine, coupe ample, chaussures plates, sans laine.' : 'E.g. navy, loose fit, flat shoes, no wool.'}
              className="w-full p-2 rounded-lg border border-stone-200 bg-white text-stone-900" />
          </label>
          <button type="button" className="text-xs underline text-stone-600"
            onClick={() => { setPreferences({}); setSearchQuery(''); setActiveCategory('all'); setSelectedOccasion('cat_noel_reveillon_elegant'); }}>
            {fr ? 'Réinitialiser les choix' : 'Reset choices'}
          </button>
        </fieldset>

        {/* Aperçu du style sélectionné */}
        <div className="p-3 bg-gradient-to-r from-emerald-50/50 to-rose-50/30 rounded-xl border border-emerald-100/80 flex items-center justify-between shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
          <div>
            <div className="text-[10px] font-bold text-emerald-800/70 uppercase tracking-wider">
              {fr ? 'Sélection complète' : 'Full selection'}
            </div>
            <div className="text-sm font-bold text-stone-950">
              {currentOccasionLabel}
            </div>
            <p className="text-xs text-stone-600 whitespace-pre-wrap break-words">{Object.values(preferences).filter(Boolean).join(' · ')}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-emerald-200/80 flex items-center justify-center text-emerald-600">
            <SparklesIcon className="w-4 h-4" />
          </div>
        </div>

        {/* Nombre de variations / poses à générer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              {t('numImagesToGenerate')}
            </label>
            <span className="text-[10px] text-stone-500">Angles & poses</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 4, 6, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onNumImagesChange(n)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
                  numImagesToGenerate === n
                    ? 'bg-stone-950 text-white border-stone-950 shadow-md'
                    : 'bg-white text-stone-600 border-rose-100/80 hover:border-emerald-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton de génération principal haute couture */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden group flex items-center justify-center gap-2.5 bg-gradient-to-r from-stone-900 to-black hover:from-black hover:to-stone-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] disabled:bg-stone-300 disabled:from-stone-300 disabled:to-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed border border-emerald-900/30"
        >
          {isLoading ? (
            <div className="relative z-10 flex items-center justify-center gap-2">
              <Spinner className="h-4 w-4 text-emerald-300" />
              <span className="text-xs uppercase tracking-wider">{t('generatingLook')}</span>
            </div>
          ) : (
            <div className="relative z-10 flex items-center justify-center gap-2">
              <SparklesIcon className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xs uppercase tracking-wider">
                {fr ? 'Générer le look' : 'Generate outfit'} : {currentOccasionLabel}
              </span>
            </div>
          )}
          {!isLoading && (
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default OccasionStylingPanel;
