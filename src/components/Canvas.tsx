/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo } from 'react';
import { BookmarkIcon, CheckCircleIcon, PlusIcon, SparklesIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { useLocalization } from '../contexts/LocalizationContext';
import type { PoseKey } from '../lib/translations';
import { LookbookItemRecord } from '../lib/db';

interface CanvasProps {
  displayImageUrl: string | null;
  poseImages: Partial<Record<PoseKey, string>> | null;
  currentPoseKey: PoseKey;
  onSelectPose: (poseKey: PoseKey) => void;
  isLoading: boolean;
  loadingMessage: string;
  onSavePoseToLookbook: (imageUrl: string) => Promise<boolean>;
  lookbookItems: LookbookItemRecord[];
  onAddMorePoses?: () => void;
}

const POSE_ORDER: PoseKey[] = [
  'pose_default',
  'pose_3_4',
  'pose_profile',
  'pose_walking',
  'pose_bust_closeup',
  'pose_sitting',
  'pose_hips',
  'pose_leaning',
  'pose_arms_crossed',
  'pose_leaning_back',
];

const ATTITUDE_LABELS: Record<PoseKey, { fr: string; en: string; icon: string }> = {
  pose_default: { fr: "Face Studio", en: "Front Studio", icon: "✨" },
  pose_3_4: { fr: "Profil 3/4", en: "3/4 Profile", icon: "📐" },
  pose_profile: { fr: "Profil Net", en: "Side Profile", icon: "👤" },
  pose_walking: { fr: "En Mouvement", en: "Walking", icon: "🚶" },
  pose_bust_closeup: { fr: "Détail Buste", en: "Bust Detail", icon: "🔍" },
  pose_sitting: { fr: "Pose Assise", en: "Seated Pose", icon: "🪑" },
  pose_hips: { fr: "Allure Hanches", en: "Hands on Hips", icon: "💎" },
  pose_leaning: { fr: "Pose Appuyée", en: "Leaning Pose", icon: "🛋️" },
  pose_arms_crossed: { fr: "Posture Assurée", en: "Arms Crossed", icon: "⚡" },
  pose_leaning_back: { fr: "Allure Détente", en: "Relaxed", icon: "☕" },
};

const Canvas: React.FC<CanvasProps> = ({ 
  displayImageUrl, 
  poseImages, 
  currentPoseKey, 
  onSelectPose, 
  isLoading, 
  loadingMessage, 
  onSavePoseToLookbook,
  lookbookItems,
  onAddMorePoses
}) => {
  const { t, language } = useLocalization();
  const [savedStates, setSavedStates] = useState<Record<string, boolean>>({});

  const lookbookUrls = useMemo(() => new Set(lookbookItems.map(item => item.dataUrl)), [lookbookItems]);

  const handleSaveClick = async (imageUrl: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isLoading || savedStates[imageUrl] || lookbookUrls.has(imageUrl)) return;
    
    const success = await onSavePoseToLookbook(imageUrl);
    if (success) {
      setSavedStates(prev => ({ ...prev, [imageUrl]: true }));
      setTimeout(() => {
        setSavedStates(prev => ({ ...prev, [imageUrl]: false }));
      }, 2000);
    }
  };
  
  const loadingOverlayAnimation: MotionProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const sortedPoseEntries = useMemo(() => {
    if (!poseImages) return [];
    const entries = Object.entries(poseImages).sort(([keyA], [keyB]) => {
      const idxA = POSE_ORDER.indexOf(keyA as PoseKey);
      const idxB = POSE_ORDER.indexOf(keyB as PoseKey);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    }) as [PoseKey, string][];
    
    return entries.slice(0, 8);
  }, [poseImages]);

  const showAddMore = useMemo(() => {
    return displayImageUrl && !isLoading && sortedPoseEntries.length < 8 && onAddMorePoses;
  }, [displayImageUrl, isLoading, sortedPoseEntries.length, onAddMorePoses]);

  const activeAttitude = ATTITUDE_LABELS[currentPoseKey] || {
    fr: t(currentPoseKey),
    en: t(currentPoseKey),
    icon: "✨",
  };

  const currentAttitudeName = language === 'fr' ? activeAttitude.fr : activeAttitude.en;

  return (
    <div className="w-full flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 lg:gap-8">
      
      {/* CADRE DU MIROIR VIRTUEL PRINCIPAL */}
      <div className="relative w-full max-w-[340px] sm:max-w-[440px] aspect-[3/4] flex flex-col items-center justify-center bg-[#FAF7F2] rounded-3xl overflow-hidden shadow-xl border border-[#EAE2D5] transition-all duration-500">
        
        {/* Bandeau d'état supérieur dans le miroir */}
        <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-xs">
            <span className="text-xs">{activeAttitude.icon}</span>
            <span className="text-[11px] font-bold text-stone-900 tracking-wide uppercase">
              {currentAttitudeName}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-950/80 backdrop-blur-md text-white border border-stone-800 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-medium tracking-wider uppercase">Miroir Virtuel</span>
          </div>
        </div>

        {/* Visuel principal avec transition douce */}
        {displayImageUrl ? (
          <div className="relative w-full h-full">
            <img
              key={displayImageUrl}
              src={displayImageUrl}
              alt={currentAttitudeName}
              className="w-full h-full object-cover object-center transition-opacity duration-300 select-none"
            />

            {/* Bouton de favori rapide discret sur le miroir */}
            <button
              onClick={(e) => handleSaveClick(displayImageUrl, e)}
              disabled={lookbookUrls.has(displayImageUrl)}
              className={`absolute bottom-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all z-10 ${
                lookbookUrls.has(displayImageUrl) || savedStates[displayImageUrl]
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-white/90 text-stone-800 hover:bg-white hover:text-stone-950 hover:scale-105'
              }`}
              title={lookbookUrls.has(displayImageUrl) ? t('outfitSaved') : t('saveOutfit')}
            >
              {lookbookUrls.has(displayImageUrl) || savedStates[displayImageUrl] ? (
                <CheckCircleIcon className="w-4 h-4 text-white" />
              ) : (
                <BookmarkIcon className="w-4 h-4" />
              )}
            </button>
          </div>
        ) : (
          <div className="w-full h-full bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
            <Spinner />
            <p className="text-xs font-serif text-stone-500 mt-4 tracking-widest uppercase">
              {t('loadingModel')}
            </p>
          </div>
        )}
      
        {/* Overlay de chargement haute fidélité */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-md flex flex-col items-center justify-center z-20 text-white p-6 text-center"
              {...loadingOverlayAnimation}
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-4 shadow-lg">
                <Spinner className="w-6 h-6 text-amber-300" />
              </div>
              {loadingMessage && (
                <div className="space-y-1 max-w-xs">
                  <p className="text-base font-serif font-bold text-white tracking-wide">
                    {loadingMessage}
                  </p>
                  <p className="text-[11px] text-stone-300 font-sans tracking-wider uppercase">
                    Ajustement de la silhouette en haute définition
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PANNEAU DES VIGNETTES MULTI-PROFILS ET ATTITUDES */}
      {displayImageUrl && sortedPoseEntries.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full xl:w-72 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100/80 shadow-lg shadow-stone-950/5 p-3.5 space-y-3"
        >
          {/* En-tête des vignettes */}
          <div className="flex items-center justify-between border-b border-rose-100 pb-2">
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                Attitudes & Profils
              </h3>
              <p className="text-[10px] text-stone-500">
                Prévisualisation multi-angles de la tenue
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-stone-100/80 text-stone-700 text-[10px] font-bold">
              {sortedPoseEntries.length} vues
            </span>
          </div>

          {/* Grille responsive de vignettes */}
          <div className="grid grid-cols-4 xl:grid-cols-2 gap-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-0.5">
            {sortedPoseEntries.map(([key, url]) => {
              const isSaved = lookbookUrls.has(url);
              const isCurrent = key === currentPoseKey;
              const attitude = ATTITUDE_LABELS[key] || {
                fr: t(key),
                en: t(key),
                icon: "✨",
              };
              const label = language === 'fr' ? attitude.fr : attitude.en;

              return (
                <div 
                  key={key} 
                  className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer ${
                    isCurrent 
                      ? 'border-emerald-500 ring-2 ring-emerald-400/30 shadow-md scale-[1.02] z-10' 
                      : 'border-rose-100/80 hover:border-emerald-300 hover:shadow-xs'
                  }`}
                  onClick={() => onSelectPose(key)}
                >
                  {/* Image miniature avec ratio portrait */}
                  <div className="aspect-[3/4] w-full bg-[#FAF7F2] relative">
                    <img 
                      src={url} 
                      alt={label} 
                      className="w-full h-full object-cover object-center"
                    />

                    {/* Pastille d'état actif */}
                    {isCurrent && (
                      <div className="absolute top-1.5 left-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                        <CheckCircleIcon className="w-2.5 h-2.5" />
                        <span>Actif</span>
                      </div>
                    )}

                    {/* Bouton de sauvegarde rapide dans Lookbook */}
                    <button
                      onClick={(e) => handleSaveClick(url, e)}
                      disabled={isSaved}
                      className={`absolute top-1.5 right-1.5 p-1 rounded-full backdrop-blur-md transition-all ${
                        isSaved 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-stone-950'
                      }`}
                      title={isSaved ? t('outfitSaved') : t('saveOutfit')}
                    >
                      <BookmarkIcon className="w-3 h-3" />
                    </button>

                    {/* Titre de l'attitude en bas de vignette */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-transparent pt-3 pb-1 px-1.5 text-center">
                      <p className="text-[10px] font-bold text-white leading-tight truncate">
                        {label}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bouton d'ajout d'angles supplémentaires si applicable */}
            {showAddMore && (
              <button
                onClick={onAddMorePoses}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 hover:border-stone-400 transition-all text-stone-500 p-2 text-center group"
                aria-label="Ajouter un angle"
              >
                <div className="w-7 h-7 rounded-full bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-700 group-hover:scale-110 transition-transform mb-1">
                  <PlusIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-stone-700">Autre angle</span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Canvas;
