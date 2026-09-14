/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  RotateCcwIcon, 
  UploadCloudIcon, 
  ArrowRightIcon,
  ShirtIcon,
  SparklesIcon
} from './icons';
import CustomImageSlider from './CustomImageSlider';
import { useLocalization } from '../contexts/LocalizationContext';
import type { PoseKey } from '../lib/translations';
import { OccasionKey } from '../occasions';

interface StartScreenProps {
  onModelFinalized: (allPoseImages: Partial<Record<PoseKey, string>>, directOccasion?: OccasionKey) => void;
  apiService: {
    generateModelImage: (userImage: File) => Promise<string>;
    generatePoseVariation: (baseImage: string, poseInstruction: string) => Promise<string>;
  };
}

const DEMO_BEFORE = "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=1000&auto=format&fit=crop"; 
const DEMO_AFTER = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop"; 

const StartScreen: React.FC<StartScreenProps> = ({ onModelFinalized }) => {
  const { t } = useLocalization();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [userPhotoDataUrl, setUserPhotoDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  const activeBeforeImage = userPhotoDataUrl || DEMO_BEFORE;
  const activeAfterImage = userPhotoDataUrl ? DEMO_AFTER : DEMO_AFTER;

  const handleFileProcess = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Format de fichier non pris en charge. Veuillez sélectionner une image (JPG, PNG ou WEBP).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("Le fichier est trop volumineux (limite : 20 Mo).");
      return;
    }

    setError(null);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} Mo`);
    setIsReading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setUserPhotoDataUrl(result);
      }
      setIsReading(false);
    };
    reader.onerror = () => {
      setError("Erreur lors de la lecture du fichier. Veuillez réessayer.");
      setIsReading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleResetPhoto = () => {
    setUserPhotoDataUrl(null);
    setFileName('');
    setFileSize('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEnterDressingWithUserPhoto = (occasionKey?: OccasionKey) => {
    if (userPhotoDataUrl) {
      onModelFinalized({
        pose_default: userPhotoDataUrl,
        pose_3_4: userPhotoDataUrl,
      }, occasionKey);
    }
  };

  const handleEnterDressingWithDemo = (occasionKey?: OccasionKey) => {
    onModelFinalized({
      pose_default: DEMO_BEFORE,
      pose_3_4: DEMO_AFTER,
    }, occasionKey);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-center items-center">
      
      {/* Input de fichier caché */}
      <input 
        ref={fileInputRef}
        type="file" 
        id="home-photo-file-input"
        style={{ display: 'none' }}
        className="hidden" 
        accept="image/png, image/jpeg, image/webp" 
        onChange={handleFileChange} 
      />

      {/* Cadre Maître Format A4 Paysage / Editorial Board */}
      <div 
        id="home-landscape-board"
        className="w-full bg-white/90 backdrop-blur-md rounded-3xl border border-rose-100/80 shadow-xl shadow-stone-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch"
      >
        
        {/* COLONNE GAUCHE (7/12) : ATELIER DE CRÉATION & IMPORT SILHOUETTE */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-gradient-to-br from-rose-50/25 via-white/50 to-emerald-50/20">
          
          {/* En-tête éditorial */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-rose-100/70 via-white to-emerald-100/70 text-stone-800 border border-rose-200/60 text-[11px] font-bold uppercase tracking-widest shadow-xs">
              <SparklesIcon className="w-3.5 h-3.5 text-rose-500" />
              <span>Dressing Virtuel Pixelprod • Atelier & Styliste IA</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-950 tracking-tight leading-[1.2]">
              Créez votre cabine virtuelle pour n'importe quel look.
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
              Importez votre silhouette pour essayer des tenues complètes en temps réel. Associez vos pièces favorites, composez avec le styliste IA et visualisez chaque tombé avec précision.
            </p>
          </div>

          {/* Module Interactif d'Upload ou Confirmation */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {!userPhotoDataUrl ? (
                <div className="space-y-3">
                  
                  {/* Cadre d'action "Cliquez ici" : Pastel Rose et Pastel Vert Subtil et Transparent */}
                  <div
                    id="dropzone-atelier"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleTriggerUpload}
                    className={`group relative w-full rounded-2xl border-2 border-dashed p-5 sm:p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2.5 backdrop-blur-xs ${
                      isDragOver 
                        ? 'border-emerald-500 bg-gradient-to-br from-rose-50/60 via-white/80 to-emerald-50/60 ring-4 ring-emerald-500/10' 
                        : 'border-rose-300/70 hover:border-emerald-400/80 bg-gradient-to-br from-rose-50/35 via-white/60 to-emerald-50/25 hover:from-rose-50/55 hover:via-white/75 hover:to-emerald-50/45 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100/90 to-emerald-100/90 shadow-xs border border-rose-200/80 flex items-center justify-center text-rose-900 group-hover:scale-105 group-hover:text-emerald-900 transition-all duration-300">
                      <UploadCloudIcon className="w-6 h-6" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-stone-950 group-hover:text-black">
                        Cliquez ici ou déposez votre photo
                      </div>
                      <div className="text-xs text-stone-600">
                        Photo en pied recommandée (corps entier) pour un tombé de vêtement optimal
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider bg-rose-100/60 px-2.5 py-0.5 rounded-full border border-rose-200/70">
                        JPG • PNG • WEBP
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100/60 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                        Max 20 Mo
                      </span>
                    </div>
                  </div>

                  {/* Cadre d'action "Accédez directement" : Pastel Vert et Pastel Rose Subtil et Transparent */}
                  <button
                    id="btn-atelier-demo"
                    type="button"
                    onClick={handleEnterDressingWithDemo}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50/40 via-white/50 to-rose-50/35 hover:from-emerald-50/70 hover:via-white/70 hover:to-rose-50/60 border border-emerald-200/70 hover:border-emerald-300 transition-all duration-300 text-left group active:scale-[0.99] shadow-xs hover:shadow-md backdrop-blur-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-200/80 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform">
                        <ShirtIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-950 transition-colors">
                          Accéder directement avec le mannequin démo
                        </div>
                        <div className="text-[11px] text-stone-600">
                          Essayez la cabine sans télécharger de fichier
                        </div>
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-rose-100/80 border border-rose-200/70 flex items-center justify-center text-rose-800 group-hover:bg-emerald-100 group-hover:text-emerald-900 group-hover:translate-x-0.5 transition-all">
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </div>
                  </button>

                </div>
              ) : (
                /* État quand la photo de l'utilisateur est chargée */
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-3"
                >
                  {/* Fiche silhouette */}
                  <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0 border border-stone-300">
                      <img 
                        src={userPhotoDataUrl} 
                        alt="Silhouette enregistrée" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                        <CheckCircleIcon className="w-3 h-3" />
                        <span>Silhouette enregistrée</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {fileName || "Photo de votre silhouette prête"}
                      </p>
                      <p className="text-[11px] text-stone-600">
                        {fileSize ? `${fileSize} • ` : ''}Prête pour l'essayage de vêtements
                      </p>
                    </div>
                  </div>

                  {/* Boutons d'action : Style direct Lancement de Produit ou Entrée complète */}
                  <div className="space-y-2">
                    <button
                      id="btn-direct-launch-product"
                      type="button"
                      onClick={() => handleEnterDressingWithUserPhoto('occasion_lancement')}
                      className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-stone-950 via-stone-900 to-black hover:from-black hover:to-stone-950 text-white shadow-md hover:shadow-xl transition-all duration-200 group active:scale-[0.99] border border-amber-400/40"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                          <SparklesIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                              Générer le look : Lancement de Produit
                            </span>
                            <span className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold uppercase">
                              Direct
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-300">
                            Tailleur business haute couture appliqué immédiatement
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </button>

                    <button
                      id="btn-enter-dressing-cta"
                      type="button"
                      onClick={() => handleEnterDressingWithUserPhoto()}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 border border-stone-200/90 shadow-xs hover:shadow-sm transition-all duration-200 group active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                          <ShirtIcon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            Ou entrer dans le dressing complet
                          </div>
                          <div className="text-[10px] text-stone-500">
                            Choisir parmi les 75+ styles et la garde-robe
                          </div>
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 group-hover:translate-x-0.5 transition-transform">
                        <ArrowRightIcon className="w-3 h-3" />
                      </div>
                    </button>
                  </div>

                  {/* Actions secondaires */}
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-change-user-photo"
                      type="button"
                      onClick={handleTriggerUpload}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-700 transition-colors shadow-xs"
                    >
                      <UploadCloudIcon className="w-3.5 h-3.5" />
                      <span>Changer de photo</span>
                    </button>

                    <button
                      id="btn-reset-user-photo"
                      type="button"
                      onClick={handleResetPhoto}
                      className="flex items-center justify-center p-2 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-900 transition-colors shadow-xs"
                      title="Réinitialiser"
                    >
                      <RotateCcwIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
                {error}
              </div>
            )}
          </div>

          {/* 3 Pilliers Atelier (Format compact horizontal) */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-3 gap-3 text-left">
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-stone-900 flex items-center gap-1">
                <ShirtIcon className="w-3 h-3 text-stone-600" />
                <span>Garde-robe</span>
              </div>
              <p className="text-[10px] text-stone-600 leading-tight">
                Hauts, bas, robes, vestes & accessoires.
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-stone-900 flex items-center gap-1">
                <SparklesIcon className="w-3 h-3 text-amber-500" />
                <span>Styliste IA</span>
              </div>
              <p className="text-[10px] text-stone-600 leading-tight">
                Suggestions de tenues selon chaque humeur.
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-stone-900 flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                <span>Superposition</span>
              </div>
              <p className="text-[10px] text-stone-600 leading-tight">
                Gestion des calques et retrait individuel.
              </p>
            </div>
          </div>

        </div>

        {/* COLONNE DROITE (5/12) : DÉMONSTRATEUR AVANT / APRÈS INTERACTIF (Arrière-plan Beige Clair) */}
        <div className="lg:col-span-5 bg-[#F9F6F0] border-t lg:border-t-0 lg:border-l border-[#EBE3D7] p-6 sm:p-8 flex flex-col justify-between items-center">
          
          {/* Header du visualiseur */}
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6455]">
              Miroir Virtuel
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EFE9DF] text-[#554D40] border border-[#DDD5C7]">
              Avant • Après
            </span>
          </div>

          {/* Slider Interactif dimensionné au format compact avec contour blanc sur fond beige chaud */}
          <div className="w-full flex-grow flex items-center justify-center my-1">
            <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-[#EFE9DF]">
              <CustomImageSlider
                leftImage={activeBeforeImage}
                rightImage={activeAfterImage}
                className="w-full h-full"
                isLoading={isReading}
                loadingMessage="Traitement de votre silhouette..."
              />
            </div>
          </div>

          {/* Légende bas de miroir */}
          <div className="w-full text-center mt-3 pt-2 border-t border-[#E8DFCFA0]">
            <p className="text-[11px] text-[#786E5F] font-medium">
              {userPhotoDataUrl 
                ? "Faites glisser la réglette pour tester le rendu de transformation" 
                : "Faites glisser la réglette pour observer la métamorphose de tenue"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default StartScreen;
