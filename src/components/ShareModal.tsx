/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { XIcon, DownloadIcon, Share2Icon } from './icons';
import { useLocalization } from '../contexts/LocalizationContext';
import { urlToFile } from '../lib/utils';
import Spinner from './Spinner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

const backdropAnimation: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalAnimation: MotionProps = {
  initial: { scale: 0.95, y: 20 },
  animate: { scale: 1, y: 0 },
  exit: { scale: 0.95, y: 20 },
};

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, imageUrl }) => {
  const { t } = useLocalization();
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleShare = async () => {
    if (!imageUrl || !canShare) return;
    
    setIsSharing(true);
    setShareError(null);

    try {
      const file = await urlToFile(imageUrl, 'virtual-try-on-outfit.png');
      
      if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
        setShareError(t('shareNotSupported'));
        setIsSharing(false);
        return;
      }

      await navigator.share({
        title: t('shareOutfit'),
        text: t('virtualTryOn'),
        files: [file],
      });
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error("Share failed:", err);
        setShareError(t('shareError'));
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <motion.div
          {...backdropAnimation}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            {...modalAnimation}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-2xl font-serif tracking-wider text-gray-800">{t('shareOutfit')}</h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label={t('close')}>
                <XIcon className="w-6 h-6"/>
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              <div className="aspect-[2/3] w-full bg-gray-100 rounded-lg overflow-hidden border">
                <img src={imageUrl} alt={t('shareOutfit')} className="w-full h-full object-contain" />
              </div>
              
              {shareError && <p className="text-red-500 text-sm text-center">{shareError}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <a 
                    href={imageUrl}
                    download="virtual-try-on-outfit.png"
                    className="w-full flex items-center justify-center text-center px-6 py-3 rounded-xl font-semibold bg-orange-500 text-black shadow-md transition-all hover:bg-black hover:text-orange-400 hover:shadow-[0_0_15px_#f97316] text-base"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    {t('download')}
                </a>
                {canShare && (
                  <button 
                      onClick={handleShare}
                      disabled={isSharing}
                      className="w-full flex items-center justify-center text-center bg-black/5 backdrop-blur-xl border border-white/20 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out hover:bg-black/10 hover:shadow-lg hover:shadow-black/10 active:scale-95 text-base disabled:opacity-50 disabled:cursor-wait"
                  >
                     {isSharing ? (
                        <>
                            <Spinner className="h-5 w-5 mr-2" />
                            {t('sharing')}
                        </>
                    ) : (
                        <>
                            <Share2Icon className="w-5 h-5 mr-2" />
                            {t('share')}
                        </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
