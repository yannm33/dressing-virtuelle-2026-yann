/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { DownloadIcon, Trash2Icon, FileTextIcon, CheckCircleIcon, CircleIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import Spinner from './Spinner';
import { LookbookItemRecord } from '../lib/db';

interface LookbookPanelProps {
  items: LookbookItemRecord[];
  onDeleteItem: (itemId: number) => void;
}

const LookbookPanel: React.FC<LookbookPanelProps> = ({ items, onDeleteItem }) => {
    const { t } = useLocalization();
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const toggleSelect = (id: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const selectAll = () => {
        if (selectedIds.size === items.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map(item => item.id)));
        }
    };

    const selectedItems = useMemo(() => {
        if (selectedIds.size === 0) return items;
        return items.filter(item => selectedIds.has(item.id));
    }, [items, selectedIds]);

    const handleGeneratePdf = async () => {
        const itemsToProcess = selectedItems;
        if (itemsToProcess.length === 0) return;
        
        setIsGeneratingPdf(true);
        
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;

            // Title Page
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.text("PixelShoot", pageWidth / 2, 40, { align: 'center' });
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.text("Mon Lookbook Virtuel", pageWidth / 2, 55, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Généré le ${new Date().toLocaleDateString()}`, pageWidth / 2, 65, { align: 'center' });

            const addImageToPdf = (imgData: string, index: number) => {
                return new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.src = imgData;
                    img.onload = () => {
                        doc.addPage();
                        
                        const availableWidth = pageWidth - margin * 2;
                        const availableHeight = pageHeight - margin * 3;
                        
                        const aspect = img.width / img.height;
                        let imgWidth = availableWidth;
                        let imgHeight = imgWidth / aspect;
                        
                        if (imgHeight > availableHeight) {
                            imgHeight = availableHeight;
                            imgWidth = imgHeight * aspect;
                        }
                        
                        const x = (pageWidth - imgWidth) / 2;
                        const y = margin + 10;

                        // Add a subtle border/frame
                        doc.setDrawColor(240);
                        doc.rect(x - 2, y - 2, imgWidth + 4, imgHeight + 4);
                        
                        doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');
                        
                        doc.setFontSize(10);
                        doc.setTextColor(100);
                        doc.text(`Look #${index + 1}`, pageWidth / 2, y + imgHeight + 15, { align: 'center' });
                        
                        resolve();
                    };
                    img.onerror = () => {
                        console.error("Failed to load image for PDF", imgData);
                        resolve(); // Skip failed image instead of breaking the whole process
                    };
                });
            };

            for (let i = 0; i < itemsToProcess.length; i++) {
                await addImageToPdf(itemsToProcess[i].dataUrl, i);
            }

            doc.save('mon-lookbook-pixelshoot.pdf');
        } catch (error) {
            console.error("PDF Generation failed:", error);
            alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="relative flex flex-col h-full">
            {items.length > 0 && (
                <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm pb-4 pt-1 border-b border-gray-100 mb-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={selectAll}
                            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
                        >
                            {selectedIds.size === items.length ? (
                                <CheckCircleIcon className="w-4 h-4 text-gray-900" />
                            ) : (
                                <CircleIcon className="w-4 h-4" />
                            )}
                            {selectedIds.size === items.length ? t('deselectAll') : t('selectAll')}
                        </button>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            {selectedIds.size > 0 ? `${selectedIds.size} ${t('selected')}` : `${items.length} ${t('total')}`}
                        </span>
                    </div>
                    
                    <button
                        onClick={handleGeneratePdf}
                        disabled={isGeneratingPdf}
                        className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 ease-in-out hover:bg-black hover:shadow-lg active:scale-[0.98] text-sm uppercase tracking-widest disabled:bg-gray-300 disabled:cursor-wait shadow-md"
                    >
                        {isGeneratingPdf ? (
                            <>
                                <Spinner className="h-5 w-5 mr-3 text-white" />
                                <span>{t('generatingPDF')}</span>
                            </>
                        ) : (
                            <>
                                <FileTextIcon className="w-5 h-5 mr-3" />
                                {selectedIds.size > 0 ? `${t('downloadSelectedPDF')} (${selectedIds.size})` : t('downloadLookbookPDF')}
                            </>
                        )}
                    </button>
                </div>
            )}
            
            {items.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <FileTextIcon className="w-10 h-10 text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-serif italic text-lg">{t('lookbookEmpty')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 pb-10">
                    <AnimatePresence>
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={`relative group aspect-[2/3] rounded-2xl overflow-hidden shadow-sm border-2 transition-all duration-300 ${selectedIds.has(item.id) ? 'border-gray-900 ring-4 ring-gray-900/5' : 'border-transparent hover:border-gray-200'}`}
                        >
                            <img src={item.dataUrl} alt={`Lookbook item ${index + 1}`} className="w-full h-full object-cover" />
                            
                            {/* Selection Checkbox Overlay */}
                            <button 
                                onClick={() => toggleSelect(item.id)}
                                className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${selectedIds.has(item.id) ? 'bg-gray-900 text-white scale-110' : 'bg-white/80 text-gray-400 opacity-0 group-hover:opacity-100 backdrop-blur-md'}`}
                            >
                                {selectedIds.has(item.id) ? <CheckCircleIcon className="w-5 h-5" /> : <CircleIcon className="w-5 h-5" />}
                            </button>

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-end p-3 gap-2">
                                <div className="w-full flex flex-col gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <a
                                        href={item.dataUrl}
                                        download={`pixelshoot-look-${index + 1}.png`}
                                        className="w-full flex items-center justify-center text-center bg-white text-gray-900 font-bold py-2.5 px-2 rounded-xl transition-all hover:bg-gray-100 text-[10px] uppercase tracking-widest shadow-xl"
                                    >
                                        <DownloadIcon className="w-3.5 h-3.5 mr-2" />
                                        {t('download')}
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteItem(item.id);
                                        }}
                                        className="w-full flex items-center justify-center text-center bg-red-500 text-white font-bold py-2.5 px-2 rounded-xl transition-all hover:bg-red-600 text-[10px] uppercase tracking-widest shadow-xl"
                                        aria-label={t('deleteFromLookbook')}
                                    >
                                        <Trash2Icon className="w-3.5 h-3.5 mr-2" />
                                        {t('deleteAction')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default LookbookPanel;