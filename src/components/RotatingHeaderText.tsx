/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../contexts/LocalizationContext';
import type { TranslationKey } from '../lib/translations';

const SLOGAN_COUNT = 15;

const RotatingHeaderText: React.FC = () => {
  const { t } = useLocalization();
  const [index, setIndex] = useState(0);

  const slogans = useMemo(() => {
    return Array.from({ length: SLOGAN_COUNT }, (_, i) => 
      t(`rotating_slogan_${i + 1}` as TranslationKey)
    );
  }, [t]);

  useEffect(() => {
    if (slogans.length === 0 || !slogans[0]) return;
    const intervalId = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % slogans.length);
    }, 5000); // Change text every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [slogans]);

  return (
    <div className="relative h-8 flex-1 min-w-0">
        <AnimatePresence mode="wait">
        <motion.h1
            key={slogans[index] || index}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center text-sm md:text-base font-serif tracking-wide text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis"
        >
            {slogans[index]}
        </motion.h1>
        </AnimatePresence>
    </div>
  );
};

export default RotatingHeaderText;