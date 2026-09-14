/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { WardrobeItem } from './types';

// Default wardrobe items hosted with reliable high-resolution fashion assets
export const defaultWardrobe: WardrobeItem[] = [
  // Tops
  {
    id: 'gemini-tee',
    name: 'wardrobe_gemini_tee',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/Gemini-tee.png',
    category: 'Tops',
  },
  {
    id: 'white-blouse',
    name: 'wardrobe_white_blouse',
    url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=600&auto=format&fit=crop',
    category: 'Tops',
  },
  {
    id: 'polo-shirt',
    name: 'wardrobe_polo_shirt',
    url: 'https://images.unsplash.com/photo-1625910513413-56291a134a4a?q=80&w=600&auto=format&fit=crop',
    category: 'Tops',
  },
  {
    id: 'black-tank-top',
    name: 'wardrobe_black_tank',
    url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
    category: 'Tops',
  },
  {
    id: 'striped-long-sleeve',
    name: 'wardrobe_striped_long_sleeve',
    url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop',
    category: 'Tops',
  },
  // Bottoms
  {
    id: 'blue-jeans',
    name: 'wardrobe_blue_jeans',
    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    category: 'Bottoms',
  },
  {
    id: 'dress-pants',
    name: 'wardrobe_dress_pants',
    url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=600&auto=format&fit=crop',
    category: 'Bottoms',
  },
  {
    id: 'khaki-shorts',
    name: 'wardrobe_khaki_shorts',
    url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop',
    category: 'Bottoms',
  },
  {
    id: 'pleated-skirt',
    name: 'wardrobe_pleated_skirt',
    url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=600&auto=format&fit=crop',
    category: 'Bottoms',
  },
  {
    id: 'ankle-boots',
    name: 'wardrobe_ankle_boots',
    url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
    category: 'Bottoms',
  },
  // Outerwear
  {
    id: 'gemini-sweat',
    name: 'wardrobe_gemini_sweat',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/gemini-sweat-2.png',
    category: 'Outerwear',
  },
  {
    id: 'leather-jacket',
    name: 'wardrobe_leather_jacket',
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    category: 'Outerwear',
  },
  {
    id: 'denim-jacket',
    name: 'wardrobe_denim_jacket',
    url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop',
    category: 'Outerwear',
  },
  {
    id: 'trench-coat',
    name: 'wardrobe_trench_coat',
    url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600&auto=format&fit=crop',
    category: 'Outerwear',
  },
  {
    id: 'gray-hoodie',
    name: 'wardrobe_gray_hoodie',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop',
    category: 'Outerwear',
  },
  {
    id: 'blazer-jacket',
    name: 'wardrobe_blazer_jacket',
    url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
    category: 'Outerwear',
  },
  // Dresses
  {
    id: 'evening-dress',
    name: 'wardrobe_evening_dress',
    url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop',
    category: 'Dresses',
  },
  // Accessories - Hats
  {
    id: 'beanie-hat',
    name: 'wardrobe_beanie',
    url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Hats',
  },
  {
    id: 'baseball-cap',
    name: 'wardrobe_baseball_cap',
    url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Hats',
  },
  {
    id: 'fedora-hat',
    name: 'wardrobe_fedora_hat',
    url: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Hats',
  },
  // Accessories - Glasses
  {
    id: 'sunglasses',
    name: 'wardrobe_sunglasses',
    url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Glasses',
  },
  {
    id: 'aviator-sunglasses',
    name: 'wardrobe_aviators',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Glasses',
  },
  // Accessories - Bags
  {
    id: 'leather-tote',
    name: 'wardrobe_leather_tote',
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Bags',
  },
  {
    id: 'crossbody-bag',
    name: 'wardrobe_crossbody_bag',
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Bags',
  },
  {
    id: 'backpack',
    name: 'wardrobe_backpack',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Bags',
  },
  // Accessories - Jewelry
  {
    id: 'gold-necklace',
    name: 'wardrobe_gold_necklace',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Jewelry',
  },
  {
    id: 'silver-hoops',
    name: 'wardrobe_silver_hoops',
    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Jewelry',
  },
  // Accessories - Belts
  {
    id: 'brown-leather-belt',
    name: 'wardrobe_leather_belt',
    url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Belts',
  },
  // Accessories - Watches
  {
    id: 'classic-watch',
    name: 'wardrobe_classic_watch',
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Watches',
  },
  // Accessories - Scarves
  {
    id: 'silk-scarf',
    name: 'wardrobe_silk_scarf',
    url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    subcategory: 'Scarves',
  }
];
