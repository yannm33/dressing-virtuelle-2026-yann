/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useMemo, useState } from 'react';
import type { WardrobeItem, WardrobeCategory, AccessorySubcategory } from '../types';
import { UploadCloudIcon, CheckCircleIcon, XIcon } from './icons';
import { useLocalization } from '../contexts/LocalizationContext';
import { urlToFile } from '../lib/utils';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { TranslationKey } from '../lib/translations';
import AddWardrobeItemModal from './AddProductModal';
import { defaultWardrobe } from '../wardrobe';

interface WardrobePanelProps {
  onGarmentSelect: (garmentFile: File, garmentInfo: WardrobeItem) => void;
  onAddNewItem: (details: { name: string; category: WardrobeCategory; subcategory?: string; color?: string; material?: string; description?: string; }, file: File) => void;
  onDeleteItem: (itemId: number) => void;
  activeGarmentIds: string[];
  isLoading: boolean;
  wardrobe: WardrobeItem[];
}

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const ACCESSORY_SUBCATEGORIES: { key: TranslationKey, value: AccessorySubcategory }[] = [
    { key: 'subcategory_hats', value: 'Hats' },
    { key: 'subcategory_glasses', value: 'Glasses' },
    { key: 'subcategory_bags', value: 'Bags' },
    { key: 'subcategory_jewelry', value: 'Jewelry' },
    { key: 'subcategory_belts', value: 'Belts' },
    { key: 'subcategory_watches', value: 'Watches' },
    { key: 'subcategory_scarves', value: 'Scarves' },
];

const WardrobePanel: React.FC<WardrobePanelProps> = ({ onGarmentSelect, onAddNewItem, onDeleteItem, activeGarmentIds, isLoading, wardrobe }) => {
    const { t } = useLocalization();
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<WardrobeCategory | 'All'>('All');
    const [activeSubCategory, setActiveSubCategory] = useState<string | 'All'>('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [itemToAdd, setItemToAdd] = useState<{ file: File, previewUrl: string } | null>(null);

    const handleGarmentClick = async (item: WardrobeItem) => {
        if (isLoading || activeGarmentIds.includes(item.id)) return;
        setError(null);
        try {
            let file: File;
            if (item.isCustom && item.file) {
                // For custom items, use the stored file object directly.
                file = item.file;
            } else {
                // For default items, convert the URL to a file.
                const filename = item.isCustom ? item.name : t(item.name as TranslationKey);
                file = await urlToFile(item.url, filename);
            }
            onGarmentSelect(file, item);
        } catch (err) {
            setError(t('errorWardrobeLoad'));
            console.error(`Failed to handle garment click for item: ${item.name}`, err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError(t('pleaseSelectImage'));
                return;
            }
            setItemToAdd({ file, previewUrl: URL.createObjectURL(file) });
            setIsAddModalOpen(true);
            e.target.value = ''; // Reset file input
        }
    };

    const handleSaveNewItem = (details: Parameters<WardrobePanelProps['onAddNewItem']>[0], file: File) => {
        onAddNewItem(details, file);
        if (itemToAdd) URL.revokeObjectURL(itemToAdd.previewUrl);
        setItemToAdd(null);
    };
    
    const handleCategoryChange = (category: WardrobeCategory | 'All') => {
        setActiveCategory(category);
        setActiveSubCategory('All');
    }

    const defaultCats = useMemo(() => ['Tops', 'Bottoms', 'Outerwear', 'Dresses', 'Accessories', 'Streetwear', 'Chic', 'Sport', 'Boho', 'Business'], []);

    const categories = useMemo(() => {
        const allCats = wardrobe.map(item => item.category).filter((c): c is WardrobeCategory => !!c);
        return ['All', ...[...new Set([...defaultCats, ...allCats])].sort()];
    }, [wardrobe, defaultCats]);

    const filteredWardrobe = useMemo(() => {
      let items = wardrobe;
      if (activeCategory !== 'All') {
        items = items.filter(item => item.category === activeCategory);
      }
      if (activeCategory === 'Accessories' && activeSubCategory !== 'All') {
        items = items.filter(item => item.subcategory === activeSubCategory);
      }
      return items;
    }, [wardrobe, activeCategory, activeSubCategory]);

    const itemsToDisplay = useMemo(() => {
        const uploadButton = { id: 'upload-button' };
        // We typecast to any because the button is not a real WardrobeItem
        return [uploadButton, ...filteredWardrobe] as any[];
    }, [filteredWardrobe]);

  return (
    <div>
      <div className='flex items-center space-x-2 border-b border-gray-300/80 mb-4 overflow-x-auto'>
        {categories.map((cat) => {
            const isDefault = defaultCats.includes(cat);
            const label = cat === 'All' 
                ? t('category_all') 
                : (isDefault ? t(`category_${cat.toLowerCase()}` as TranslationKey) : cat);

            return (
                <button key={cat} onClick={() => handleCategoryChange(cat)} className={`relative pb-2 px-2 text-sm font-medium whitespace-nowrap capitalize ${activeCategory === cat ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}>
                    {label}
                    {activeCategory === cat && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" layoutId="category-underline" />}
                </button>
            );
        })}
      </div>

      <AnimatePresence>
        {activeCategory === 'Accessories' && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center space-x-2 mb-4 overflow-x-auto"
            >
                <button onClick={() => setActiveSubCategory('All')} className={`text-xs font-semibold px-3 py-1 rounded-full ${activeSubCategory === 'All' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {t('category_all')}
                </button>
                {ACCESSORY_SUBCATEGORIES.map(({key, value}) => (
                    <button key={key} onClick={() => setActiveSubCategory(value)} className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${activeSubCategory === value ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {t(key)}
                    </button>
                ))}
            </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
          className="grid grid-cols-3 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
      >
          <motion.label 
              key="upload-button"
              variants={itemVariants}
              htmlFor="custom-garment-upload" 
              className={`relative aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 transition-colors animate-glow ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-gray-400 hover:text-gray-600 cursor-pointer'}`}
          >
              <UploadCloudIcon className="w-6 h-6 mb-1"/>
              <span className="text-xs text-center">{t('upload')}</span>
              <input id="custom-garment-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
          </motion.label>
          
          {filteredWardrobe.map((item) => {
            const isActive = activeGarmentIds.includes(item.id);
            const itemName = item.isCustom ? item.name : t(item.name as TranslationKey);
            return (
                <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="relative group"
                >
                    <button
                        onClick={() => handleGarmentClick(item)}
                        disabled={isLoading || isActive}
                        className="w-full aspect-square border rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                        aria-label={t('selectGarment', { garmentName: itemName })}
                    >
                        <img src={item.url} alt={itemName} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-bold text-center p-1">{itemName}</p>
                        </div>
                        {isActive && (
                            <motion.div 
                            className="absolute inset-0 bg-gray-900/70 flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            >
                                <CheckCircleIcon className="w-8 h-8 text-white" />
                            </motion.div>
                        )}
                    </button>
                    {item.isCustom && !isLoading && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.dbId !== undefined) {
                                    onDeleteItem(item.dbId);
                                }
                            }}
                            className="absolute top-1 right-1 z-10 p-1 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-red-600 transition-colors"
                            aria-label={`${t('deleteAction')} ${itemName}`}
                        >
                            <XIcon className="w-3 h-3" />
                        </button>
                    )}
                </motion.div>
            );
          })}
      </motion.div>
      {wardrobe.length === defaultWardrobe.length && (
            <p className="text-center text-sm text-gray-500 mt-4">{t('uploadedItemsAppearHere')}</p>
      )}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      <AddWardrobeItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewItem}
        initialImagePreviewUrl={itemToAdd?.previewUrl || null}
        initialFile={itemToAdd?.file || null}
        existingCategories={categories.filter(c => c !== 'All')}
      />
    </div>
  );
};

export default WardrobePanel;