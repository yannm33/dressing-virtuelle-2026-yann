/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
// FIX: Use 'import type' for PoseKey to resolve module resolution error.
import type { PoseKey } from './lib/translations';

export type WardrobeCategory = string; // Allow for custom user-defined categories
export type AccessorySubcategory = 'Hats' | 'Glasses' | 'Bags' | 'Jewelry' | 'Belts' | 'Watches' | 'Scarves';

export interface WardrobeItem {
  id: string;
  dbId?: number; // IndexedDB primary key for custom items
  name: string;
  url: string;
  category?: WardrobeCategory;
  subcategory?: string;
  color?: string;
  material?: string;
  description?: string;
  isCustom?: boolean; // Differentiates default items from user-uploaded ones
  file?: File; // Stores the original file for custom items
}

export interface OutfitLayer {
  garment: WardrobeItem | null; // null represents the base model layer
  poseImages: Partial<Record<PoseKey, string>>; // Maps pose instruction to image URL
}
