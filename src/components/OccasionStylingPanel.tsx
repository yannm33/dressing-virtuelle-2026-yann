/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { occasionOptions, OccasionKey } from '../occasions';
import Spinner from './Spinner';
import { SparklesIcon, CheckCircleIcon } from './icons';
import { motion } from 'framer-motion';

interface OccasionStylingPanelProps {
  onGenerateOutfit: (occasionKey: OccasionKey) => void;
  isLoading: boolean;
  numImagesToGenerate: number;
  onNumImagesChange: (num: number) => void;
}

type StyleCategory = 'all' | 'cat_noel' | 'cat_plongee' | 'cat_fitness' | 'cat_yoga' | 'cat_running' | 'cat_raquette' | 'cat_velo' | 'cat_montagne' | 'cat_rando' | 'cat_nautisme' | 'cat_equitation' | 'cat_danse' | 'cat_festival' | 'cat_mariage' | 'cat_rendezvous' | 'cat_voyage' | 'cat_maison' | 'cat_jardin' | 'cat_culture' | 'cat_pro' | 'cat_fete' | 'cat_grossesse' | 'cat_adapte';

const CATEGORY_MAP: Record<StyleCategory, { label: string; icon: string; keys: OccasionKey[] }> = {
  all: {
    label: "Tous les styles",
    icon: "✨",
    keys: [...occasionOptions],
  },
  cat_noel: {
    label: "Noël & fêtes",
    icon: "🎄",
    keys: [
      'cat_noel_reveillon_elegant',
      'cat_noel_repas_familial',
      'cat_noel_chalet_cosy',
      'cat_noel_pull_de_noel',
      'cat_noel_noel_glamour'
    ],
  },
  cat_plongee: {
    label: "Activités aquatiques",
    icon: "🤿",
    keys: [
      'cat_plongee_plongee_sous_marine',
      'cat_plongee_snorkeling',
      'cat_plongee_apnee',
      'cat_plongee_surf',
      'cat_plongee_paddle'
    ],
  },
  cat_fitness: {
    label: "Fitness & salle",
    icon: "🏋️‍♀️",
    keys: [
      'cat_fitness_musculation',
      'cat_fitness_cardio',
      'cat_fitness_training_fonctionnel',
      'cat_fitness_tenue_sportive_sobre',
      'cat_fitness_ensemble_colore'
    ],
  },
  cat_yoga: {
    label: "Yoga & Pilates",
    icon: "🧘‍♀️",
    keys: [
      'cat_yoga_minimaliste',
      'cat_yoga_tons_naturels',
      'cat_yoga_studio_elegant',
      'cat_yoga_pratique_douce',
      'cat_yoga_exterieur'
    ],
  },
  cat_running: {
    label: "Running",
    icon: "🏃‍♀️",
    keys: [
      'cat_running_course_urbaine',
      'cat_running_trail',
      'cat_running_piste',
      'cat_running_footing_hivernal',
      'cat_running_course_estivale'
    ],
  },
  cat_raquette: {
    label: "Sports de raquette",
    icon: "🎾",
    keys: [
      'cat_raquette_tennis_classique',
      'cat_raquette_tennis_contemporain',
      'cat_raquette_padel',
      'cat_raquette_badminton',
      'cat_raquette_squash'
    ],
  },
  cat_velo: {
    label: "Vélo & mobilité",
    icon: "🚴‍♀️",
    keys: [
      'cat_velo_cyclisme_sur_route',
      'cat_velo_vtt',
      'cat_velo_gravel',
      'cat_velo_velo_urbain',
      'cat_velo_trajet_domicile_travail'
    ],
  },
  cat_montagne: {
    label: "Sports d’hiver",
    icon: "⛷️",
    keys: [
      'cat_montagne_ski',
      'cat_montagne_snowboard',
      'cat_montagne_ski_de_fond',
      'cat_montagne_raquettes',
      'cat_montagne_apres_ski'
    ],
  },
  cat_rando: {
    label: "Randonnée",
    icon: "🥾",
    keys: [
      'cat_rando_balade_nature',
      'cat_rando_randonnee_estivale',
      'cat_rando_trekking',
      'cat_rando_camping',
      'cat_rando_exploration_sous_la_pluie'
    ],
  },
  cat_nautisme: {
    label: "Nautisme",
    icon: "⛵",
    keys: [
      'cat_nautisme_voile',
      'cat_nautisme_croisiere',
      'cat_nautisme_yacht_chic',
      'cat_nautisme_marin_classique',
      'cat_nautisme_promenade_cotiere'
    ],
  },
  cat_equitation: {
    label: "Équitation",
    icon: "🐎",
    keys: [
      'cat_equitation_entrainement_equestre',
      'cat_equitation_concours',
      'cat_equitation_campagne_chic',
      'cat_equitation_country',
      'cat_equitation_western'
    ],
  },
  cat_danse: {
    label: "Danse",
    icon: "💃",
    keys: [
      'cat_danse_danse_classique',
      'cat_danse_contemporaine',
      'cat_danse_hip_hop',
      'cat_danse_salsa',
      'cat_danse_tango'
    ],
  },
  cat_festival: {
    label: "Festivals",
    icon: "🎪",
    keys: [
      'cat_festival_boheme',
      'cat_festival_rock',
      'cat_festival_electro',
      'cat_festival_festival_sous_la_pluie'
    ],
  },
  cat_mariage: {
    label: "Mariage",
    icon: "💍",
    keys: [
      'cat_mariage_marie_ou_mariee',
      'cat_mariage_temoin',
      'cat_mariage_cortege',
      'cat_mariage_invite',
      'cat_mariage_brunch_du_lendemain'
    ],
  },
  cat_rendezvous: {
    label: "Rendez-vous amoureux",
    icon: "🌹",
    keys: [
      'cat_rendezvous_premier_cafe',
      'cat_rendezvous_diner_romantique',
      'cat_rendezvous_promenade',
      'cat_rendezvous_soiree_elegante',
      'cat_rendezvous_week_end_a_deux'
    ],
  },
  cat_voyage: {
    label: "Voyage",
    icon: "✈️",
    keys: [
      'cat_voyage_avion_longue_distance',
      'cat_voyage_train',
      'cat_voyage_road_trip',
      'cat_voyage_voyage_professionnel',
      'cat_voyage_arrivee_en_station_balneaire'
    ],
  },
  cat_maison: {
    label: "Maison & détente",
    icon: "🛋️",
    keys: [
      'cat_maison_loungewear',
      'cat_maison_teletravail_confortable',
      'cat_maison_dimanche_cosy',
      'cat_maison_recevoir_chez_soi',
      'cat_maison_tenue_de_nuit'
    ],
  },
  cat_jardin: {
    label: "Jardinage & bricolage",
    icon: "🪴",
    keys: [
      'cat_jardin_jardinage_leger',
      'cat_jardin_potager',
      'cat_jardin_atelier_creatif',
      'cat_jardin_peinture',
      'cat_jardin_petit_bricolage'
    ],
  },
  cat_culture: {
    label: "Culture & sorties",
    icon: "🎭",
    keys: [
      'cat_culture_musee',
      'cat_culture_vernissage',
      'cat_culture_theatre',
      'cat_culture_opera',
      'cat_culture_soiree_litteraire'
    ],
  },
  cat_pro: {
    label: "Événements pro",
    icon: "💼",
    keys: [
      'cat_pro_entretien_d_embauche',
      'cat_pro_conference',
      'cat_pro_salon',
      'cat_pro_presentation_sur_scene',
      'cat_pro_cocktail_professionnel'
    ],
  },
  cat_fete: {
    label: "Fêtes à thème",
    icon: "🥳",
    keys: [
      'cat_fete_halloween',
      'cat_fete_carnaval',
      'cat_fete_bal_masque',
      'cat_fete_soiree_disco',
      'cat_fete_soiree_retro'
    ],
  },
  cat_grossesse: {
    label: "Grossesse",
    icon: "🤰",
    keys: [
      'cat_grossesse_quotidien_evolutif',
      'cat_grossesse_bureau',
      'cat_grossesse_ceremonie',
      'cat_grossesse_detente',
      'cat_grossesse_acces_pratique_pour_allaiter'
    ],
  },
  cat_adapte: {
    label: "Vêtements adaptés",
    icon: "🦽",
    keys: [
      'cat_adapte_habillage_assis',
      'cat_adapte_fermetures_faciles',
      'cat_adapte_coupes_amples',
      'cat_adapte_acces_aux_dispositifs_medicaux',
      'cat_adapte_confort_sensoriel'
    ],
  },
};
const OccasionStylingPanel: React.FC<OccasionStylingPanelProps> = ({ 
  onGenerateOutfit, 
  isLoading, 
  numImagesToGenerate, 
  onNumImagesChange 
}) => {
  const { t } = useLocalization();
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionKey>('cat_noel_reveillon_elegant');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('cat_noel');

  const filteredOccasions = useMemo(() => {
    let list = activeCategory === 'all' 
      ? CATEGORY_MAP.all.keys 
      : CATEGORY_MAP[activeCategory].keys;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((key) => {
        const translated = t(key).toLowerCase();
        return translated.includes(q) || key.toLowerCase().includes(q);
      });
    }

    return list;
  }, [activeCategory, searchQuery, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateOutfit(selectedOccasion);
  };
  const currentOccasionLabel = t(selectedOccasion);

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
          Sélectionnez un univers ou une occasion parmi plus de 75 styles pour concevoir une tenue sur-mesure adaptée à votre morphologie.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Catégories de styles en pilules horizontales */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            Univers & Thèmes de Style
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CATEGORY_MAP) as StyleCategory[]).map((cat) => {
              const info = CATEGORY_MAP[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                  }`}
                >
                  <span className="text-xs">{info.icon}</span>
                  <span>{info.label}</span>
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
            placeholder="Rechercher un style (ex: Gala, Plage, Mariage, Cocktail, Yacht...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-rose-100/80 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-300 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-xs text-stone-400 hover:text-stone-700"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Grille de sélection des styles disponibles */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>Styles disponibles ({filteredOccasions.length})</span>
            <span className="text-[10px] text-stone-400">Cliquez pour choisir</span>
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
                    onClick={() => setSelectedOccasion(key)}
                    className={`flex items-center justify-between p-2.5 text-left rounded-lg text-xs transition-all ${
                      isSelected
                        ? 'bg-stone-950 text-white font-bold shadow-xs'
                        : isFavorite
                        ? 'bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 border border-amber-200/80 font-semibold'
                        : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200/70 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate mr-1">
                      {isFavorite && <span className="text-[10px] text-amber-500 font-bold">★</span>}
                      <span className="truncate">{t(key)}</span>
                    </div>
                    {isSelected && (
                      <CheckCircleIcon className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 py-4 text-center text-xs text-stone-500">
                Aucun style ne correspond à « {searchQuery} ».
              </div>
            )}
          </div>
        </div>

        {/* Aperçu du style sélectionné */}
        <div className="p-3 bg-gradient-to-r from-emerald-50/50 to-rose-50/30 rounded-xl border border-emerald-100/80 flex items-center justify-between shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]">
          <div>
            <div className="text-[10px] font-bold text-emerald-800/70 uppercase tracking-wider">
              Style sélectionné
            </div>
            <div className="text-sm font-bold text-stone-950">
              {currentOccasionLabel}
            </div>
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
                Générer le look : {currentOccasionLabel}
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
