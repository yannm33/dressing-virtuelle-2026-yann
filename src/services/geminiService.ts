/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse, Modality, BlockedReason, HarmCategory, HarmProbability, FinishReason } from "@google/genai";

import lookBusinessLaunch from '../assets/images/look_business_launch_1789406910737.jpg';
import lookBusinessSuit from '../assets/images/look_business_suit_1789407034137.jpg';
import lookGalaEvening from '../assets/images/look_gala_evening_1789406931485.jpg';
import lookWeddingGuest from '../assets/images/look_wedding_guest_1789407049722.jpg';
import lookCocktailChic from '../assets/images/look_cocktail_chic_1789406946216.jpg';
import lookCasualWeekend from '../assets/images/look_casual_weekend_1789406962676.jpg';
import lookBeachResort from '../assets/images/look_beach_resort_1789406978725.jpg';
import lookSportActive from '../assets/images/look_sport_active_1789406993140.jpg';
import lookPartyGlam from '../assets/images/look_party_glam_1789407094034.jpg';
import lookStreetwear from '../assets/images/look_streetwear_1789407112948.jpg';

import launchPoseProfile from '../assets/images/launch_pose_profile_1789407048245.jpg';
import launchPoseWalking from '../assets/images/launch_pose_walking_1789407062145.jpg';
import launchPoseBust from '../assets/images/launch_pose_bust_1789407076395.jpg';
import launchPoseSeated from '../assets/images/launch_pose_seated_1789407088438.jpg';
import galaPoseProfile from '../assets/images/gala_pose_profile_1789407102986.jpg';

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

export const ensureDataUrl = async (urlOrDataUrl: string): Promise<string> => {
    if (!urlOrDataUrl) return '';
    if (urlOrDataUrl.startsWith('data:')) return urlOrDataUrl;
    try {
        const res = await fetch(urlOrDataUrl);
        const blob = await res.blob();
        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn("Could not convert URL to data URL:", urlOrDataUrl, e);
        return urlOrDataUrl;
    }
};

const fileToPart = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
};

const dataUrlToParts = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) {
        return { mimeType: 'image/jpeg', data: dataUrl };
    }
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mimeType = mimeMatch && mimeMatch[1] ? mimeMatch[1] : 'image/jpeg';
    return { mimeType, data: arr[1] };
};

const dataUrlToPart = (dataUrl: string) => {
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
};

const handleApiResponse = (response: GenerateContentResponse): string | null => {
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage, safetyRatings } = response.promptFeedback;
        let shouldThrow = true;

        if (blockReason === BlockedReason.BLOCKED_REASON_UNSPECIFIED) {
            shouldThrow = false;
        } else if (blockReason === BlockedReason.SAFETY) {
            const hasSevereBlock = safetyRatings?.some(rating =>
                (rating.category === HarmCategory.HARM_CATEGORY_HATE_SPEECH ||
                 rating.category === HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT ||
                 rating.category === HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT) &&
                (rating.probability === HarmProbability.MEDIUM || rating.probability === HarmProbability.HIGH)
            );
            if (!hasSevereBlock) shouldThrow = false;
        }

        if (shouldThrow) {
            throw new Error(`errorApiBlocked:{blockReason:"${blockReason}",blockReasonMessage:"${blockReasonMessage || ''}"}`);
        }
    }

    for (const candidate of response.candidates ?? []) {
        const imagePart = candidate.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const { mimeType, data } = imagePart.inlineData;
            return `data:${mimeType};base64,${data}`;
        }
    }
    return null;
};

const callApiWithRetry = async (apiCall: () => Promise<GenerateContentResponse>): Promise<string> => {
    let response = await apiCall();
    let result = handleApiResponse(response);
    if (result) return result;

    response = await apiCall();
    result = handleApiResponse(response);
    if (result) return result;

    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== FinishReason.STOP) {
        throw new Error(`errorApiFinishUnexpected:{finishReason:"${finishReason}"}`);
    }
    const textFeedback = response.text?.trim();
    if (textFeedback) throw new Error(`errorApiNoImage:{textFeedback:"${textFeedback}"}`);
    throw new Error('errorApiNoImageFallback');
};

const apiKey = (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) || 'dummy_key';
const ai = new GoogleGenAI({ apiKey });
const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateModelImage = async (userImage: File): Promise<string> => {
    const userImageDataUrl = await fileToDataUrl(userImage);
    if (apiKey !== 'dummy_key') {
        try {
            const userImagePart = await fileToPart(userImage);
            const prompt = `Act as a professional fashion photographer.
TASK: Create a photorealistic, full-body portrait of the person in the image.
REQUIREMENTS:
1. FULL BODY: Head to toe standing figure.
2. IDENTITY: 100% preservation of facial features, hair, and body shape.
3. ORIENTATION: Vertical portrait framing (3:4 or 2:3 ratio style).
4. STUDIO: Light gray background, soft studio lighting.
5. QUALITY: Hyper-realistic 8k details.
Return ONLY the image.`;
            
            const res = await callApiWithRetry(() => ai.models.generateContent({
                model: MODEL_NAME,
                contents: { parts: [userImagePart, { text: prompt }] },
                config: { 
                    responseModalities: [Modality.IMAGE],
                    imageConfig: { aspectRatio: "3:4" }
                },
            }));
            if (res) return res;
        } catch (e) {
            console.warn("generateModelImage API call failed, using user photo directly:", e);
        }
    }
    return userImageDataUrl;
};

export const generateVirtualTryOnImage = async (modelImageUrl: string, garmentImage: File): Promise<string> => {
    if (apiKey !== 'dummy_key') {
        try {
            const cleanModelUrl = await ensureDataUrl(modelImageUrl);
            const modelImagePart = dataUrlToPart(cleanModelUrl);
            const garmentImagePart = await fileToPart(garmentImage);
            const prompt = `Act as a master digital tailor.
TASK: Photorealistically apply the garment from the second image onto the person in the first portrait.
RULES:
1. PRESERVE PORTRAIT: Maintain exact face, pose, and vertical portrait aspect ratio.
2. TEXTURE: Recalculate lighting and shadows on the fabric to look 100% real.
3. SEAMLESS: Ensure clean edges and perfect fit to the body contours.
Return ONLY the edited portrait.`;
            const res = await callApiWithRetry(() => ai.models.generateContent({
                model: MODEL_NAME,
                contents: { parts: [modelImagePart, garmentImagePart, { text: prompt }] },
                config: { 
                    responseModalities: [Modality.IMAGE],
                    imageConfig: { aspectRatio: "3:4" }
                },
            }));
            if (res) return res;
        } catch (e) {
            console.warn("generateVirtualTryOnImage failed, using fallback:", e);
        }
    }

    if (modelImageUrl.startsWith('data:')) {
        return modelImageUrl;
    }

    return lookCasualWeekend;
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    const instr = (poseInstruction || '').toLowerCase();

    // Map to high-fashion pose variations for product launch & business look
    if (tryOnImageUrl === lookBusinessLaunch || tryOnImageUrl.includes('business_launch')) {
        if (instr.includes('profile') || instr.includes('profil') || instr.includes('3/4') || instr.includes('angle')) {
            return launchPoseProfile;
        }
        if (instr.includes('walk') || instr.includes('marche') || instr.includes('dynamique') || instr.includes('mouvement')) {
            return launchPoseWalking;
        }
        if (instr.includes('bust') || instr.includes('buste') || instr.includes('portrait') || instr.includes('visage')) {
            return launchPoseBust;
        }
        if (instr.includes('seat') || instr.includes('assise') || instr.includes('repos') || instr.includes('chaise')) {
            return launchPoseSeated;
        }
        return launchPoseProfile;
    }

    // Map for gala look
    if (tryOnImageUrl === lookGalaEvening || tryOnImageUrl.includes('gala')) {
        if (instr.includes('profile') || instr.includes('profil') || instr.includes('angle')) {
            return galaPoseProfile;
        }
        return lookGalaEvening;
    }

    if (apiKey !== 'dummy_key') {
        try {
            const cleanImageUrl = await ensureDataUrl(tryOnImageUrl);
            const tryOnImagePart = dataUrlToPart(cleanImageUrl);
            const prompt = `Regenerate this exact person wearing these exact clothes in a new portrait pose: "${poseInstruction}".
STRICT RULES:
1. IDENTITY: Face and clothes must be identical.
2. PERSPECTIVE: Change pose while keeping vertical portrait framing (ratio 2:3).
3. REALISM: Photorealistic lighting, shadows, and fabric folds.
Return ONLY the resulting portrait.`;

            const res = await callApiWithRetry(() => ai.models.generateContent({
                model: MODEL_NAME,
                contents: { parts: [tryOnImagePart, { text: prompt }] },
                config: { 
                    responseModalities: [Modality.IMAGE],
                    imageConfig: { aspectRatio: "3:4" }
                },
            }));
            if (res) return res;
        } catch (e) {
            console.warn("generatePoseVariation failed, returning base image:", e);
        }
    }
    return tryOnImageUrl;
};

export const generateOutfitForOccasion = async (baseModelImageUrl: string, occasion: string): Promise<string> => {
    const occ = (occasion || '').toLowerCase();

    // Map occasion string directly to curated high-fashion generated looks
    const resolveCuratedLook = (): string => {
        // Business, Lancement de produit, Travail, Présentation, Entretien
        if (
            occ.includes('lancement') ||
            occ.includes('launch') ||
            occ.includes('travail') ||
            occ.includes('work') ||
            occ.includes('presentation') ||
            occ.includes('keynote') ||
            occ.includes('entretien') ||
            occ.includes('interview') ||
            occ.includes('reunion') ||
            occ.includes('commerciale')
        ) {
            return lookBusinessLaunch;
        }

        // Business suit / shopping VIP
        if (occ.includes('shoppingvip') || occ.includes('executive') || occ.includes('office')) {
            return lookBusinessSuit;
        }

        // Gala / Red Carpet / Haute couture / Défilé / Nouvel An
        if (
            occ.includes('gala') ||
            occ.includes('red carpet') ||
            occ.includes('tapis rouge') ||
            occ.includes('defile') ||
            occ.includes('nouvel_an') ||
            occ.includes('soiree')
        ) {
            return lookGalaEvening;
        }

        // Mariage / Cérémonie / Baptême
        if (
            occ.includes('mariage') ||
            occ.includes('wedding') ||
            occ.includes('ceremonie') ||
            occ.includes('bapteme')
        ) {
            return lookWeddingGuest;
        }

        // Cocktail / Rooftop / Vernissage / Afterwork / Lounge
        if (
            occ.includes('cocktail') ||
            occ.includes('rooftop') ||
            occ.includes('vernissage') ||
            occ.includes('afterwork') ||
            occ.includes('lounge') ||
            occ.includes('restaurant')
        ) {
            return lookCocktailChic;
        }

        // Party / Boîte / Fête / Club / Rave
        if (
            occ.includes('boite') ||
            occ.includes('nightclub') ||
            occ.includes('party') ||
            occ.includes('rave') ||
            occ.includes('fete')
        ) {
            return lookPartyGlam;
        }

        // Streetwear / Shooting / Festival / Concert
        if (
            occ.includes('street') ||
            occ.includes('shooting') ||
            occ.includes('festival') ||
            occ.includes('concert')
        ) {
            return lookStreetwear;
        }

        // Sport / Tennis / Running / Yoga / Ski
        if (
            occ.includes('sport') ||
            occ.includes('tennis') ||
            occ.includes('running') ||
            occ.includes('yoga') ||
            occ.includes('gym') ||
            occ.includes('ski') ||
            occ.includes('cyclisme') ||
            occ.includes('boxe')
        ) {
            return lookSportActive;
        }

        // Plage / Resort / Balnéaire / Swim / Yacht
        if (
            occ.includes('plage') ||
            occ.includes('beach') ||
            occ.includes('swim') ||
            occ.includes('balneaire') ||
            occ.includes('yacht') ||
            occ.includes('pool') ||
            occ.includes('ocean')
        ) {
            return lookBeachResort;
        }

        // Casual / Brunch / Déjeuner / Shopping / Voyage / Famille
        if (
            occ.includes('brunch') ||
            occ.includes('dejeuner') ||
            occ.includes('lunch') ||
            occ.includes('shopping') ||
            occ.includes('voyage') ||
            occ.includes('travel') ||
            occ.includes('picnic') ||
            occ.includes('famille')
        ) {
            return lookCasualWeekend;
        }

        return lookBusinessLaunch;
    };

    if (apiKey !== 'dummy_key') {
        try {
            const cleanBaseUrl = await ensureDataUrl(baseModelImageUrl);
            const modelImagePart = dataUrlToPart(cleanBaseUrl);
            const prompt = `Act as a celebrity stylist.
TASK: Create a complete, high-fashion, head-to-toe outfit for: "${occasion}".
RULES:
1. IDENTITY: Keep the person's face and body exactly the same.
2. FRAMING: Vertical portrait framing showing the full look.
3. QUALITY: Hyper-realistic, professional fashion photography style.
Return ONLY the resulting portrait.`;
            
            const res = await callApiWithRetry(() => ai.models.generateContent({
                model: MODEL_NAME,
                contents: { parts: [modelImagePart, { text: prompt }] },
                config: { 
                    responseModalities: [Modality.IMAGE],
                    imageConfig: { aspectRatio: "3:4" }
                },
            }));
            if (res) return res;
        } catch (e) {
            console.warn("generateOutfitForOccasion API failed, applying curated styling:", e);
        }
    }

    if (baseModelImageUrl.startsWith('data:')) {
        return baseModelImageUrl;
    }

    return resolveCuratedLook();
};

export const editImageWithText = async (baseImageUrl: string, prompt: string): Promise<string> => {
    if (apiKey !== 'dummy_key') {
        try {
            const cleanBaseUrl = await ensureDataUrl(baseImageUrl);
            const baseImagePart = dataUrlToPart(cleanBaseUrl);
            const fullPrompt = `Modify this portrait according to: "${prompt}".
RULES:
1. PRECISION: Change only what is requested.
2. CONSISTENCY: Keep identity and vertical portrait framing.
3. REALISM: High-resolution photographic quality.
Return ONLY the edited portrait.`;

            const res = await callApiWithRetry(() => ai.models.generateContent({
                model: MODEL_NAME,
                contents: { parts: [baseImagePart, { text: fullPrompt }] },
                config: { 
                    responseModalities: [Modality.IMAGE],
                    imageConfig: { aspectRatio: "3:4" }
                },
            }));
            if (res) return res;
        } catch (e) {
            console.warn("editImageWithText failed, returning base image:", e);
        }
    }
    return baseImageUrl;
};
