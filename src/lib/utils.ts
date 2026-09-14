/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// FIX: Use 'import type' for TranslationKey to resolve module resolution error.
import type { TranslationKey } from "./translations";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TFunction = (key: TranslationKey, replacements?: Record<string, string>) => string;

// Helper to convert image URL to a File object using a canvas to bypass potential CORS issues.
export const urlToFile = (url: string, filename: string): Promise<File> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context.'));
            }
            ctx.drawImage(image, 0, 0);

            canvas.toBlob((blob) => {
                if (!blob) {
                    return reject(new Error('Canvas toBlob failed.'));
                }
                const mimeType = blob.type || 'image/png';
                const file = new File([blob], filename, { type: mimeType });
                resolve(file);
            }, 'image/png');
        };

        image.onerror = (error) => {
            reject(new Error(`Could not load image from URL for canvas conversion. Error: ${error}`));
        };

        image.src = url;
    });
};


export function getFriendlyErrorMessage(error: unknown, t: TFunction): string {
    if (error instanceof Error) {
        const key = error.message as TranslationKey;
        // Check if the error message is a translation key
        const translatedError = t(key);
        if (translatedError !== key) {
            // It was a valid key
            return translatedError;
        }

        // It was not a key, but a raw message. Try to parse it.
        const rawMessage = error.message;

        if (rawMessage.includes("RESOURCE_EXHAUSTED") || rawMessage.includes("429")) {
            return t('errorQuotaExceeded');
        }

        if (rawMessage.includes("Unsupported MIME type")) {
             try {
                const errorJson = JSON.parse(rawMessage);
                const nestedMessage = errorJson?.error?.message;
                if (nestedMessage && nestedMessage.includes("Unsupported MIME type")) {
                    const mimeType = nestedMessage.split(': ')[1] || 'unsupported';
                    return t('errorUnsupportedMIME', { mimeType });
                }
            } catch (e) {
                // Not a JSON string, but contains the text.
            }
            return t('errorUnsupportedMIMEFallback');
        }
        
        // For other raw messages, return them but they won't be translated.
        return rawMessage;
    }
    
    if (typeof error === 'string') {
        const key = error as TranslationKey;
        const translatedError = t(key);
         if (translatedError !== key) {
            return translatedError;
        }
        return error;
    }
    
    return t('errorGeneric');
}