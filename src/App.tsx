/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import StartScreen from './components/StartScreen';
import Canvas from './components/Canvas';
import WardrobePanel from './components/WardrobePanel';
import OutfitStack from './components/OutfitStack';
import { OutfitLayer, WardrobeItem, WardrobeCategory } from './types';
import { defaultWardrobe } from './wardrobe';
import Footer from './components/Footer';
import { getFriendlyErrorMessage } from './lib/utils';
import { useLocalization } from './contexts/LocalizationContext';
import Header from './components/Header';
import ShareModal from './components/ShareModal';
import OccasionStylingPanel from './components/OccasionStylingPanel';
import LookbookPanel from './components/LookbookPanel';
import { OccasionKey } from './occasions';
import { translations } from './lib/translations';
import type { TranslationKey, PoseKey } from './lib/translations';
import ImageModificationPanel from './components/ImageModificationPanel';
import { addLookbookItem, getLookbookItems, deleteLookbookItem, LookbookItemRecord, getWardrobeItems, addWardrobeItem, deleteWardrobeItem as deleteWardrobeItemFromDb } from './lib/db';
import Toolbar from './components/Toolbar';
import { buildOccasionBrief, type StylingPreferences } from './styleCatalog';

import * as realGeminiService from './services/geminiService';
import * as mockGeminiService from './services/geminiService.mock';

const USE_MOCK_API = false;
const apiService = USE_MOCK_API ? mockGeminiService : realGeminiService;

const viewVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

const viewAnimation: MotionProps = {
  variants: viewVariants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  transition: { duration: 0.5, ease: 'easeInOut' },
};

type Tab = 'stylist' | 'outfit' | 'wardrobe' | 'lookbook';

const POSE_KEYS_TO_GENERATE: PoseKey[] = [
  'pose_3_4',
  'pose_profile',
  'pose_hips',
  'pose_leaning',
  'pose_walking',
  'pose_bust_closeup',
  'pose_sitting',
  'pose_arms_crossed',
  'pose_leaning_back',
];

const App: React.FC = () => {
  const { t, language } = useLocalization();

  const [outfitHistory, setOutfitHistory] = useState<OutfitLayer[]>([]);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPoseKey, setCurrentPoseKey] = useState<PoseKey>('pose_default');
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('stylist');
  const [lookbookItems, setLookbookItems] = useState<LookbookItemRecord[]>([]);
  const [numImagesToGenerate, setNumImagesToGenerate] = useState<number>(4);

  const hasModel = useMemo(() => outfitHistory.length > 0, [outfitHistory]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const savedLookbookItems = await getLookbookItems();
        setLookbookItems(savedLookbookItems);
        const savedWardrobeItems = await getWardrobeItems();
        const transformedItems: WardrobeItem[] = savedWardrobeItems.map(item => ({
          id: `custom-${item.createdAt.getTime()}`,
          dbId: item.id,
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          color: item.color,
          material: item.material,
          description: item.description,
          file: item.file,
          url: URL.createObjectURL(item.file),
          isCustom: true,
        }));
        setWardrobe([...transformedItems, ...defaultWardrobe]);
      } catch (e) {
        console.error("Failed to load items from IndexedDB", e);
        setWardrobe(defaultWardrobe);
      }
    };
    loadItems();
    return () => {
      wardrobe.forEach(item => {
        if (item.isCustom && item.url.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, []);

  const activeOutfitLayers = useMemo(() => 
    outfitHistory.slice(0, currentOutfitIndex + 1), 
    [outfitHistory, currentOutfitIndex]
  );
  
  const activeGarmentIds = useMemo(() => 
    activeOutfitLayers.map(layer => layer.garment?.id).filter(Boolean) as string[], 
    [activeOutfitLayers]
  );

  const currentPoseImages = useMemo(() => {
    if (!hasModel) return null;
    return outfitHistory[currentOutfitIndex].poseImages;
  }, [outfitHistory, currentOutfitIndex, hasModel]);
  
  const displayImageUrl = useMemo(() => {
    if (!currentPoseImages) return null;
    return currentPoseImages[currentPoseKey] ?? Object.values(currentPoseImages)[0];
  }, [currentPoseImages, currentPoseKey]);

  const generateAllPoseVariationsForNewLook = useCallback(async (baseImageUrl: string, numToGenerate: number, existingPoses: Partial<Record<PoseKey, string>> = {}): Promise<Partial<Record<PoseKey, string>>> => {
    if (numToGenerate <= 1 && Object.keys(existingPoses).length === 0) {
      return { 'pose_default': baseImageUrl };
    }
    
    // Base object containing the default pose
    const allPoseImages: Partial<Record<PoseKey, string>> = { 'pose_default': baseImageUrl };
    
    // Populate with existing poses up to the requested number
    let currentCount = 1; // We already have pose_default
    for (const key of POSE_KEYS_TO_GENERATE) {
      if (currentCount >= numToGenerate) break;
      if (key !== 'pose_default' && existingPoses[key]) {
        allPoseImages[key] = existingPoses[key];
        currentCount++;
      }
    }
    
    // If we still need more, fetch from API
    const posesToGenerate = POSE_KEYS_TO_GENERATE.filter(key => !allPoseImages[key]).slice(0, numToGenerate - currentCount);
    
    if (posesToGenerate.length === 0) return allPoseImages;

    const BATCH_SIZE = 3;

    for (let i = 0; i < posesToGenerate.length; i += BATCH_SIZE) {
      const batch = posesToGenerate.slice(i, i + BATCH_SIZE);
      const posePrompts = batch.map(key => t(key));
      const promises = posePrompts.map(prompt => apiService.generatePoseVariation(baseImageUrl, prompt));
      
      const results = await Promise.allSettled(promises);

      results.forEach((result, index) => {
        const key = batch[index];
        if (result.status === 'fulfilled' && result.value) {
          allPoseImages[key] = result.value;
        } else if (result.status === 'rejected') {
          console.warn(`Failed to generate pose variation for ${key}:`, result.reason);
        }
      });
    }

    return allPoseImages;
  }, [t]);

  const executeGenerateOutfitForOccasion = useCallback(async (baseModelLayer: OutfitLayer, occasionKey: OccasionKey, preferences: StylingPreferences = {}) => {
    setError(null);
    setIsLoading(true);
    setLoadingMessage(language === 'fr' ? 'Conception haute couture du look...' : t('generatingLook'));

    try {
      const occasionLabel = t(occasionKey) || occasionKey;
      const baseImage = baseModelLayer.poseImages['pose_default'];
      
      if (!baseImage) throw new Error('errorStylingMissingPhoto');
      const brief = buildOccasionBrief(occasionKey, occasionLabel, preferences);
      const newDefaultPoseUrl = await apiService.generateOutfitForOccasion(baseImage, brief);
      const existingPoses: Partial<Record<PoseKey, string>> = {};

      setLoadingMessage(language === 'fr' ? 'Génération des angles & attitudes...' : t('generatingVariations'));

      // Fetch or generate the variations up to numImagesToGenerate
      const generatedPoses = await generateAllPoseVariationsForNewLook(newDefaultPoseUrl, numImagesToGenerate, existingPoses);

      const newLayer: OutfitLayer = {
        garment: {
          id: `generated-${Date.now()}`,
          name: occasionLabel,
          url: newDefaultPoseUrl,
          isCustom: true,
        },
        poseImages: generatedPoses,
      };

      setOutfitHistory([baseModelLayer, newLayer]);
      setCurrentOutfitIndex(1);
      setCurrentPoseKey('pose_default');
      setActiveTab('stylist');
    } catch (err) {
      console.error("Error generating outfit:", err);
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [t, language, generateAllPoseVariationsForNewLook, numImagesToGenerate]);

  const handleModelFinalized = (allPoseImages: Partial<Record<PoseKey, string>>, directOccasion?: OccasionKey) => {
    const baseLayer: OutfitLayer = {
      garment: null,
      poseImages: allPoseImages
    };
    setOutfitHistory([baseLayer]);
    setCurrentOutfitIndex(0);
    setCurrentPoseKey('pose_default');
    setActiveTab('stylist');

    if (directOccasion) {
      executeGenerateOutfitForOccasion(baseLayer, directOccasion);
    }
  };

  const handleStartOver = () => {
    setOutfitHistory([]);
    setCurrentOutfitIndex(0);
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setCurrentPoseKey('pose_default');
  };

  const handleOpenShareModal = () => {
    if (displayImageUrl) {
      setIsShareModalOpen(true);
    }
  };
  const handleCloseShareModal = () => setIsShareModalOpen(false);

  const handleAddMorePoses = useCallback(async () => {
    const currentLayer = outfitHistory[currentOutfitIndex];
    if (!currentLayer || isLoading) return;

    const baseImage = currentLayer.poseImages['pose_default'];
    if (!baseImage) return;

    const existingCount = Object.keys(currentLayer.poseImages).length;
    if (existingCount >= 8) return;

    setIsLoading(true);
    setLoadingMessage(t('generatingVariations'));

    try {
      // Add 2 more if possible
      const updatedPoses = await generateAllPoseVariationsForNewLook(baseImage, existingCount + 2, currentLayer.poseImages);
      
      setOutfitHistory(prev => {
        const newHistory = [...prev];
        newHistory[currentOutfitIndex] = { ...currentLayer, poseImages: updatedPoses };
        return newHistory;
      });
    } catch (err) {
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [outfitHistory, currentOutfitIndex, isLoading, t, generateAllPoseVariationsForNewLook]);

  const handleGarmentSelect = useCallback(async (garmentFile: File, garmentInfo: WardrobeItem) => {
    const baseImageForTryOn = outfitHistory[currentOutfitIndex]?.poseImages['pose_default'];

    if (!baseImageForTryOn || isLoading) {
      console.warn("Garment selected but no default pose image is available on the current layer.");
      return;
    }

    const nextLayer = outfitHistory[currentOutfitIndex + 1];
    if (nextLayer && nextLayer.garment?.id === garmentInfo.id) {
      setCurrentOutfitIndex(prev => prev + 1);
      setCurrentPoseKey('pose_default');
      return;
    }

    setError(null);
    setIsLoading(true);
    const garmentName = garmentInfo.isCustom ? garmentInfo.name : t(garmentInfo.name as TranslationKey);
    setLoadingMessage(t('addingGarment', { garmentName }));

    try {
      const newDefaultPoseUrl = await apiService.generateVirtualTryOnImage(baseImageForTryOn, garmentFile);
      
      setLoadingMessage(t('generatingVariations'));
      const allPoseImages = await generateAllPoseVariationsForNewLook(newDefaultPoseUrl, numImagesToGenerate);

      const newLayer: OutfitLayer = { 
        garment: garmentInfo, 
        poseImages: allPoseImages
      };

      setOutfitHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, currentOutfitIndex + 1);
        return [...newHistory, newLayer];
      });
      setCurrentOutfitIndex(prev => prev + 1);
      setCurrentPoseKey('pose_default');
      
    } catch (err) {
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [isLoading, outfitHistory, currentOutfitIndex, t, generateAllPoseVariationsForNewLook, numImagesToGenerate]);

  const handleAddNewItemToWardrobe = useCallback(async (details: {
    name: string;
    category: WardrobeCategory;
    subcategory?: string;
    color?: string;
    material?: string;
    description?: string;
  }, file: File) => {
    try {
      const newItemFromDb = await addWardrobeItem({ ...details, file });
      const newItem: WardrobeItem = {
        id: `custom-${newItemFromDb.createdAt.getTime()}`,
        dbId: newItemFromDb.id,
        name: newItemFromDb.name,
        category: newItemFromDb.category,
        subcategory: newItemFromDb.subcategory,
        color: newItemFromDb.color,
        material: newItemFromDb.material,
        description: newItemFromDb.description,
        file: newItemFromDb.file,
        url: URL.createObjectURL(newItemFromDb.file),
        isCustom: true,
      };
      setWardrobe(prev => [newItem, ...prev]);
    } catch (e) {
      console.error("Failed to save wardrobe item to IndexedDB", e);
      setError(getFriendlyErrorMessage(e, t));
    }
  }, [t]);

  const handleRemoveLastGarment = () => {
    if (currentOutfitIndex > 0) {
      setCurrentOutfitIndex(prevIndex => prevIndex - 1);
      setCurrentPoseKey('pose_default');
    }
  };
  
  const handlePoseSelect = (newPoseKey: PoseKey) => {
    if (isLoading || newPoseKey === currentPoseKey || !currentPoseImages?.[newPoseKey]) return;
    setCurrentPoseKey(newPoseKey);
  };

  const handleGenerateOutfitForOccasion = useCallback(async (occasionKey: OccasionKey, preferences: StylingPreferences = {}) => {
    if (isLoading || outfitHistory.length === 0) return;
    const baseModelLayer = outfitHistory[0];
    await executeGenerateOutfitForOccasion(baseModelLayer, occasionKey, preferences);
  }, [isLoading, outfitHistory, executeGenerateOutfitForOccasion]);

  const handleImageModification = useCallback(async (prompt: string) => {
    const imageToModify = outfitHistory[currentOutfitIndex]?.poseImages['pose_default'];

    if (isLoading || !imageToModify) {
      console.warn("Modification requested but no default pose image is available on the current layer.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingMessage(t('modifyingLook'));

    try {
      const modifiedDefaultUrl = await apiService.editImageWithText(imageToModify, prompt);
      
      setLoadingMessage(t('generatingVariations'));
      const allPoseImages = await generateAllPoseVariationsForNewLook(modifiedDefaultUrl, numImagesToGenerate);

      const newLayer: OutfitLayer = {
        garment: {
          id: `modified-${Date.now()}`,
          name: t('modifiedLook'),
          url: modifiedDefaultUrl,
          isCustom: true,
        },
        poseImages: allPoseImages
      };

      setOutfitHistory(prev => [...prev.slice(0, currentOutfitIndex + 1), newLayer]);
      setCurrentOutfitIndex(prev => prev + 1);
      setCurrentPoseKey('pose_default');

    } catch (err) {
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [isLoading, t, currentOutfitIndex, outfitHistory, generateAllPoseVariationsForNewLook, numImagesToGenerate]);

  const handleSavePoseToLookbook = useCallback(async (imageUrlToSave: string) => {
    if (!lookbookItems.some(item => item.dataUrl === imageUrlToSave)) {
      try {
        const newItem = await addLookbookItem(imageUrlToSave);
        setLookbookItems(prevItems => [newItem, ...prevItems]);
        return true;
      } catch (e) {
        console.error("Failed to save lookbook to IndexedDB", e);
        setError(getFriendlyErrorMessage(e, t));
        return false;
      }
    }
    return true;
  }, [lookbookItems, t]);

  const handleDeleteFromLookbook = useCallback(async (itemId: number) => {
    try {
      await deleteLookbookItem(itemId);
      setLookbookItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (e) {
      console.error("Failed to delete from lookbook in IndexedDB", e);
      setError(getFriendlyErrorMessage(e, t));
    }
  }, [t]);

  const handleDeleteWardrobeItem = useCallback(async (itemId: number) => {
    try {
      const itemToDelete = wardrobe.find(item => item.dbId === itemId);
      if (itemToDelete?.isCustom) {
        URL.revokeObjectURL(itemToDelete.url);
      }
      await deleteWardrobeItemFromDb(itemId);
      setWardrobe(prev => prev.filter(item => item.dbId !== itemId));
    } catch(e) {
      console.error("Failed to delete from wardrobe in IndexedDB", e);
      setError(getFriendlyErrorMessage(e, t));
    }
  }, [wardrobe, t]);
  
  const lookbookUrls = useMemo(() => new Set(lookbookItems.map(item => item.dataUrl)), [lookbookItems]);

  const TABS: { id: Tab, label: TranslationKey }[] = [
    { id: 'stylist', label: 'aiStylist' },
    { id: 'outfit', label: 'myOutfit' },
    { id: 'wardrobe', label: 'wardrobe' },
    { id: 'lookbook', label: 'lookbook' },
  ];

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col overflow-x-auto overflow-y-auto">
      <AnimatePresence mode="wait">
        {!hasModel ? (
          <motion.div
            key="start-screen"
            className="w-full min-h-screen flex flex-col justify-between bg-gradient-to-br from-rose-50/70 via-stone-50/80 to-emerald-50/60 relative overflow-hidden"
            {...viewAnimation}
          >
            {/* Voiles d'ambiance pastel subtils et transparents */}
            <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl" />
            <Header isMockMode={USE_MOCK_API} onGoHome={handleStartOver} />
            <main className="flex-grow flex items-center justify-center w-full">
              <StartScreen onModelFinalized={handleModelFinalized} apiService={apiService} />
            </main>
            <Footer isOnDressingScreen={false} />
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            className="relative flex flex-col h-auto min-h-screen bg-gradient-to-br from-rose-50/70 via-stone-50/80 to-emerald-50/60 overflow-hidden"
            {...viewAnimation}
          >
            {/* Voiles d'ambiance pastel subtils et transparents */}
            <div className="pointer-events-none fixed -top-32 -left-32 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl" />
            <div className="pointer-events-none fixed -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-200/20 blur-3xl" />
            
            <Header isMockMode={USE_MOCK_API} onGoHome={handleStartOver} />
            <main className="flex-grow h-auto grid grid-cols-1 md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_480px] gap-6 p-4 md:p-6 lg:max-w-[1600px] lg:mx-auto w-full relative z-10">
              <div className="flex flex-col items-center justify-start gap-6">
                <Toolbar
                  onStartOver={handleStartOver}
                  onOpenShareModal={handleOpenShareModal}
                  onSave={() => displayImageUrl && handleSavePoseToLookbook(displayImageUrl)}
                  isActionDisabled={!displayImageUrl}
                  isSaveDisabled={isLoading || !displayImageUrl || lookbookUrls.has(displayImageUrl ?? '')}
                />
                <Canvas 
                  displayImageUrl={displayImageUrl}
                  poseImages={currentPoseImages}
                  currentPoseKey={currentPoseKey}
                  onSelectPose={handlePoseSelect}
                  isLoading={isLoading}
                  loadingMessage={loadingMessage}
                  onSavePoseToLookbook={handleSavePoseToLookbook}
                  lookbookItems={lookbookItems}
                  onAddMorePoses={handleAddMorePoses}
                />
              </div>

              <aside className="w-full bg-white/90 backdrop-blur-md border border-rose-100/80 rounded-3xl flex flex-col shadow-xl shadow-stone-950/5 md:sticky md:top-6 md:h-[calc(100vh-3rem)] overflow-hidden">
                <div className='flex-shrink-0 flex items-center border-b border-rose-100/80 overflow-x-auto bg-gradient-to-r from-rose-50/30 via-white to-emerald-50/30 px-2 custom-scrollbar'>
                  {TABS.map(tab => (
                    <button 
                      key={tab.id} 
                      onClick={() => setActiveTab(tab.id)} 
                      className={`relative px-4 py-4 text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'text-stone-950' : 'text-stone-400 hover:text-stone-600'}`}
                    >
                      <span className="relative z-10">{t(tab.label)}</span>
                      {activeTab === tab.id && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 to-emerald-400 mx-4 rounded-t-full" 
                          layoutId="tab-underline" 
                        />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6 rounded-xl flex items-start gap-3 shadow-sm" role="alert">
                      <div className="font-bold text-[10px] uppercase tracking-widest bg-red-100 text-red-800 px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0">Erreur</div>
                      <p className="text-sm">{error}</p>
                    </div>
                  )}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeTab === 'stylist' && (
                        <OccasionStylingPanel 
                          onGenerateOutfit={handleGenerateOutfitForOccasion} 
                          isLoading={isLoading} 
                          numImagesToGenerate={numImagesToGenerate} 
                          onNumImagesChange={setNumImagesToGenerate} 
                        />
                      )}
                      {activeTab === 'outfit' && (
                        <div className="space-y-8">
                          <OutfitStack outfitHistory={activeOutfitLayers} onRemoveLastGarment={handleRemoveLastGarment} />
                          {outfitHistory.length > 0 && (
                            <ImageModificationPanel
                              onApplyModification={handleImageModification}
                              isLoading={isLoading}
                              numImagesToGenerate={numImagesToGenerate}
                              onNumImagesChange={setNumImagesToGenerate}
                            />
                          )}
                        </div>
                      )}
                      {activeTab === 'wardrobe' && <WardrobePanel onGarmentSelect={handleGarmentSelect} onAddNewItem={handleAddNewItemToWardrobe} onDeleteItem={handleDeleteWardrobeItem} activeGarmentIds={activeGarmentIds} isLoading={isLoading} wardrobe={wardrobe} />}
                      {activeTab === 'lookbook' && <LookbookPanel items={lookbookItems} onDeleteItem={handleDeleteFromLookbook} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </aside>
            </main>
            <Footer isOnDressingScreen={hasModel} />
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={handleCloseShareModal}
              imageUrl={displayImageUrl}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
