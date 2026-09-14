/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from "react";
import Spinner from "./Spinner";

interface CustomImageSliderProps {
  leftImage: string;  // Image "Avant" (Portrait utilisateur)
  rightImage: string; // Image "Après" (Résultat stylisé)
  className?: string;
  isLoading?: boolean;
  loadingMessage?: string;
}

const CustomImageSlider: React.FC<CustomImageSliderProps> = ({ 
  leftImage, 
  rightImage, 
  className, 
  isLoading, 
  loadingMessage 
}) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calcule la largeur du conteneur pour maintenir l'aspect de l'image masquée
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(e.target.value));
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative select-none touch-none group overflow-hidden bg-stone-100 ${className ?? ''}`}
    >
      {/* 1. IMAGE DE FOND (APRÈS - RÉSULTAT) */}
      <div className="absolute inset-0 bg-stone-100 flex items-center justify-center">
        <img
          src={rightImage}
          alt="Après transformation"
          className="w-full h-full object-cover object-top pointer-events-none"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 2. IMAGE SUPÉRIEURE (AVANT - SOURCE) AVEC CLIPPING */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden z-10 border-r border-white/60 bg-stone-100"
        style={{ width: `${position}%`, boxShadow: '4px 0 16px rgba(0,0,0,0.12)' }}
      >
        <div style={{ width: containerWidth || '100%', height: '100%' }}>
            <img 
              src={leftImage} 
              alt="Avant transformation" 
              className="w-full h-full object-cover object-top pointer-events-none" 
              referrerPolicy="no-referrer"
            />
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
          <Spinner className="w-12 h-12 mb-4 text-white" />
          {loadingMessage && (
            <p className="text-sm font-serif italic text-white px-8 text-center animate-pulse drop-shadow-md">
              {loadingMessage}
            </p>
          )}
        </div>
      )}

      {/* LABELS CONTEXTUELS */}
      {!isLoading && (
        <>
          <div className="absolute top-4 left-4 z-20 pointer-events-none transition-opacity duration-300" style={{ opacity: position < 10 ? 0 : 1 }}>
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/20 shadow-sm">Avant</span>
          </div>
          <div className="absolute top-4 right-4 z-20 pointer-events-none transition-opacity duration-300" style={{ opacity: position > 90 ? 0 : 1 }}>
            <span className="px-3 py-1 bg-white/40 backdrop-blur-md text-black text-[10px] font-bold uppercase tracking-widest rounded-full border border-black/10 shadow-sm">Après</span>
          </div>
        </>
      )}

      {/* LE DRAGGER (INPUT RANGE TRANSPARENT) */}
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={handleChange}
        style={{ opacity: 0, cursor: 'ew-resize' }}
        className="absolute inset-0 w-full h-full z-40 opacity-0 cursor-ew-resize"
        aria-label="Faire glisser pour comparer"
        disabled={isLoading}
      />

      {/* LIGNE DE SÉPARATION ET POIGNÉE VISUELLE */}
      {!isLoading && (
        <div
          className="absolute top-0 h-full pointer-events-none z-30"
          style={{
            left: `${position}%`,
            width: "2px",
            transform: "translateX(-50%)",
          }}
        >
            {/* Ligne blanche verticale */}
            <div className="w-full h-full bg-white shadow-[0_0_15px_rgba(0,0,0,0.4)]" />

            {/* Poignée centrale */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center justify-center border-4 border-white group-hover:scale-110 transition-all duration-300">
               <div className="flex gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                      <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                      <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default CustomImageSlider;