/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import Spinner from './Spinner';
import { cn } from '../lib/utils';

// Add type definitions for the Web Speech API to resolve the 'Cannot find name' error.
interface SpeechRecognitionError extends Event {
    error: string;
}
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: {
        isFinal: boolean;
        [key: number]: {
            transcript: string;
        };
    }[];
}

interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionError) => void) | null;
    onend: (() => void) | null;
}

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
);


interface ImageModificationPanelProps {
  onApplyModification: (prompt: string) => void;
  isLoading: boolean;
  numImagesToGenerate: number;
  onNumImagesChange: (num: number) => void;
}

const ImageModificationPanel: React.FC<ImageModificationPanelProps> = ({ onApplyModification, isLoading, numImagesToGenerate, onNumImagesChange }) => {
    const { t, language } = useLocalization();
    const [prompt, setPrompt] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const finalTranscriptRef = useRef("");

    useEffect(() => {
        const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) {
            setSpeechError(t('speechNotSupported'));
            return;
        }

        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language === 'fr' ? 'fr-FR' : 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript.trim() + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            finalTranscriptRef.current += finalTranscript;
            setPrompt(finalTranscriptRef.current + interimTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionError) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'network') {
                return; // Ignore these non-fatal errors
            }

            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                setSpeechError(t('errorSpeechNotAllowed'));
            } else {
                setSpeechError(t('errorSpeechGeneric'));
            }
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
            }
        };
    }, [language, t]);

    const handlePointerDown = () => {
        if (isLoading || !recognitionRef.current || isListening) return;

        setSpeechError(null);
        setPrompt("");
        finalTranscriptRef.current = "";
        
        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e) {
            console.error("Could not start speech recognition", e);
            setIsListening(false);
        }
    };

    const handlePointerUp = () => {
        if (!isListening || !recognitionRef.current) return;
        
        recognitionRef.current.stop();
        setIsListening(false);
        
        const finalPrompt = finalTranscriptRef.current.trim();
        if (finalPrompt) {
            onApplyModification(finalPrompt);
            setPrompt("");
            finalTranscriptRef.current = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() && !isLoading) {
            onApplyModification(prompt.trim());
            setPrompt("");
            finalTranscriptRef.current = "";
        }
    };

    return (
        <div className="pt-6 mt-6 border-t border-gray-100">
            <h3 className="text-md font-bold text-gray-900 mb-4">{t('editYourLook')}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('editPlaceholder')}
                        rows={3}
                        className="w-full p-4 pr-14 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all bg-gray-50 text-gray-900 disabled:opacity-50 text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        disabled={!recognitionRef.current || isLoading}
                        className={cn(
                            'absolute top-3 right-3 p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm',
                            isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
                        )}
                        aria-label={t('useVoice')}
                    >
                        <MicIcon className="w-5 h-5" />
                    </button>
                </div>
                
                {speechError && <p className="text-xs text-red-500 font-medium">{speechError}</p>}

                <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {t('numImagesToGenerate')}
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 4, 6, 8].map(n => (
                            <button
                                key={n}
                                type="button"
                                onClick={() => onNumImagesChange(n)}
                                disabled={isLoading}
                                className={`py-2 text-xs font-bold rounded-lg border transition-all ${numImagesToGenerate === n ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim() || isListening}
                    className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-bold py-4 px-4 rounded-xl transition-all hover:bg-gray-800 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
                >
                    {isLoading ? (
                        <>
                            <Spinner className="h-5 w-5 mr-3 text-white" />
                            <span>{t('modifyingLook')}</span>
                        </>
                    ) : (
                       t('applyModification')
                    )}
                </button>
            </form>
        </div>
    );
};

export default ImageModificationPanel;
