/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useMemo, useState } from 'react';
import type { WardrobeItem, WardrobeCategory, AccessorySubcategory } from '../types';
import { UploadCloudIcon, CheckCircleIcon, XIcon, Trash2Icon } from './icons';
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
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
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

const WardrobePanel: React.FC<WardrobePanelProps> = ({ 
  onGarmentSelect, 
  onAddNewItem, 
  onDeleteItem, 
  activeGarmentIds, 
  isLoading, 
  wardrobe 
}) => {
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
        file = item.file;
      } else {
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
      e.target.value = '';
    }
  };

  const handleSaveNewItem = (details: Parameters<WardrobePanelProps['onAddNewItem']>[0], file: File) => {
    onAddNewItem(details, file);
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

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('myWardrobe')}</h3>
        <button
          onClick={() => {
            setItemToAdd(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-sm"
        >
          <UploadCloudIcon className="w-3.5 h-3.5" />
          {t('addItem')}
        </button>
      </div>

      {/* Category Tabs - Scrollbar enabled */}
      <div className='flex items-center gap-1 border-b border-gray-100 pb-2 overflow-x-auto custom-scrollbar'>
        {categories.map((cat) => {
          const isDefault = defaultCats.includes(cat);
          const label = cat === 'All' 
            ? t('category_all') 
            : (isDefault ? t(`category_${cat.toLowerCase()}` as TranslationKey) : cat);

          return (
            <button 
              key={cat} 
              onClick={() => handleCategoryChange(cat)} 
              className={`relative py-3 px-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeCategory === cat ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {label}
              {activeCategory === cat && <motion.div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gray-900" layoutId="cat-underline" />}
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills - Scrollbar enabled */}
      <AnimatePresence>
        {activeCategory === 'Accessories' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-2"
          >
            <button 
              onClick={() => setActiveSubCategory('All')} 
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeSubCategory === 'All' ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {t('category_all')}
            </button>
            {ACCESSORY_SUBCATEGORIES.map(({key, value}) => (
              <button 
                key={key} 
                onClick={() => setActiveSubCategory(value)} 
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeSubCategory === value ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {t(key)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <motion.div 
        className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Upload Trigger */}
        <motion.label 
          variants={itemVariants}
          htmlFor="custom-garment-upload" 
          className={`relative aspect-[3/4] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 transition-all ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-900 hover:text-gray-900 hover:bg-white cursor-pointer group'}`}
        >
          <div className="p-4 rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
            <UploadCloudIcon className="w-6 h-6"/>
          </div>
          <span className="mt-4 text-[10px] font-bold uppercase tracking-widest">{t('upload')}</span>
          <input id="custom-garment-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading}/>
        </motion.label>
        
        {filteredWardrobe.map((item) => {
          const isActive = activeGarmentIds.includes(item.id);
          const itemName = item.isCustom ? item.name : t(item.name as TranslationKey);
          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="relative group aspect-[3/4]"
            >
              <button
                onClick={() => handleGarmentClick(item)}
                disabled={isLoading || isActive}
                className={`w-full h-full border rounded-2xl overflow-hidden transition-all duration-300 relative shadow-sm ${isActive ? 'ring-2 ring-gray-900 ring-offset-2 scale-95 opacity-60' : 'hover:shadow-lg hover:-translate-y-1'}`}
              >
                <img src={item.url} alt={itemName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest line-clamp-1">{itemName}</p>
                </div>
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
                    <CheckCircleIcon className="w-10 h-10 text-gray-900" />
                  </div>
                )}
              </button>
              {item.isCustom && !isLoading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.dbId !== undefined) onDeleteItem(item.dbId);
                  }}
                  className="absolute -top-1 -right-1 z-10 p-2 bg-white text-red-500 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all transform scale-0 group-hover:scale-100"
                  aria-label={`${t('deleteAction')} ${itemName}`}
                >
                  <Trash2Icon className="w-3.5 h-3.5" />
                </button>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {wardrobe.length === 0 && (
        <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-400 text-sm font-medium">{t('uploadedItemsAppearHere')}</p>
        </div>
      )}

      <AddWardrobeItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveNewItem}
        initialImagePreviewUrl={itemToAdd?.previewUrl || null}
        initialFile={itemToAdd?.file || null}
        existingCategories={categories.filter((c): c is WardrobeCategory => c !== 'All')}
      />
    </div>
  );
};

export default WardrobePanel;