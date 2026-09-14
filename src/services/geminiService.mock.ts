/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import lookBusinessLaunch from '../assets/images/look_business_launch_1789406910737.jpg';
import lookBusinessSuit from '../assets/images/look_business_suit_1789407034137.jpg';
import lookGalaEvening from '../assets/images/look_gala_evening_1789406931485.jpg';
import lookCasualWeekend from '../assets/images/look_casual_weekend_1789406962676.jpg';
import launchPoseProfile from '../assets/images/launch_pose_profile_1789407048245.jpg';

const MOCK_DELAY = 1000;

const simulateApiCall = <T>(result: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(result);
        }, MOCK_DELAY);
    });
};

export const generateModelImage = async (userImage: File): Promise<string> => {
    return simulateApiCall(lookBusinessLaunch);
};

export const generateVirtualTryOnImage = async (modelImageUrl: string, garmentImage: File): Promise<string> => {
    return simulateApiCall(lookCasualWeekend);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    return simulateApiCall(launchPoseProfile);
};

export const generateOutfitForOccasion = async (baseModelImageUrl: string, occasion: string): Promise<string> => {
    const occ = (occasion || '').toLowerCase();
    if (occ.includes('lancement') || occ.includes('launch') || occ.includes('travail') || occ.includes('work')) {
        return simulateApiCall(lookBusinessLaunch);
    }
    if (occ.includes('gala') || occ.includes('soiree')) {
        return simulateApiCall(lookGalaEvening);
    }
    return simulateApiCall(lookBusinessSuit);
};

export const editImageWithText = async (baseImageUrl: string, prompt: string): Promise<string> => {
    return simulateApiCall(lookBusinessLaunch);
};
