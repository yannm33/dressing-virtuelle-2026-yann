/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OccasionKey } from '../occasions';
import { PoseKey } from '../lib/translations';

// Importations directes des visuels haute-définition créés pour les styles
import lookLaunchFront from '../assets/images/look_business_launch_1789406910737.jpg';
import lookLaunchProfile from '../assets/images/launch_pose_profile_1789407048245.jpg';
import lookLaunchWalking from '../assets/images/launch_pose_walking_1789407062145.jpg';
import lookLaunchBust from '../assets/images/launch_pose_bust_1789407076395.jpg';
import lookLaunchSeated from '../assets/images/launch_pose_seated_1789407088438.jpg';

import lookBusinessSuit from '../assets/images/look_business_suit_1789407034137.jpg';

import lookGalaFront from '../assets/images/look_gala_evening_1789406931485.jpg';
import lookGalaProfile from '../assets/images/gala_pose_profile_1789407102986.jpg';

import lookCocktail from '../assets/images/look_cocktail_chic_1789406946216.jpg';
import lookPartyGlam from '../assets/images/look_party_glam_1789407094034.jpg';
import lookWeddingGuest from '../assets/images/look_wedding_guest_1789407049722.jpg';

import lookCasualWeekend from '../assets/images/look_casual_weekend_1789406962676.jpg';
import lookBeachResort from '../assets/images/look_beach_resort_1789406978725.jpg';
import lookSportActive from '../assets/images/look_sport_active_1789406993140.jpg';

import lookStreetwear from '../assets/images/look_streetwear_1789407112948.jpg';

export interface StyleLookCollection {
  nameFr: string;
  defaultImage: string;
  poseImages: Partial<Record<PoseKey, string>>;
}

/**
 * Bibliothèque de tenues haute couture classées par style avec multi-profils et attitudes réelles
 */
export const STYLE_COLLECTIONS: Record<string, StyleLookCollection> = {
  // 10. Streetwear & Urbain
  streetwear_urban: {
    nameFr: "Style Urbain Streetwear",
    defaultImage: lookStreetwear,
    poseImages: {
      pose_default: lookStreetwear,
      pose_3_4: lookStreetwear,
      pose_bust_closeup: lookStreetwear,
    },
  },

  // 1. Business & Lancement de Produit (La demande explicite de l'utilisateur)
  launch_executive: {
    nameFr: "Tailleur Lancement de Produit",
    defaultImage: lookLaunchFront,
    poseImages: {
      pose_default: lookLaunchFront,
      pose_3_4: lookLaunchProfile,
      pose_profile: lookLaunchProfile,
      pose_walking: lookLaunchWalking,
      pose_bust_closeup: lookLaunchBust,
      pose_sitting: lookLaunchSeated,
      pose_hips: lookLaunchWalking,
      pose_leaning: lookLaunchSeated,
    },
  },

  // 2. Business Corporate & RDV
  business_suit: {
    nameFr: "Costume Tailleur Bleu Nuit",
    defaultImage: lookBusinessSuit,
    poseImages: {
      pose_default: lookBusinessSuit,
      pose_3_4: lookLaunchProfile,
      pose_walking: lookLaunchWalking,
      pose_bust_closeup: lookLaunchBust,
      pose_sitting: lookLaunchSeated,
    },
  },

  // 3. Cérémonie & Soirée Gala
  gala_couture: {
    nameFr: "Robe Soirée Satin Émeraude",
    defaultImage: lookGalaFront,
    poseImages: {
      pose_default: lookGalaFront,
      pose_3_4: lookGalaProfile,
      pose_profile: lookGalaProfile,
      pose_bust_closeup: lookGalaFront,
      pose_walking: lookGalaProfile,
    },
  },

  // 4. Cocktail & Vernissage
  cocktail_chic: {
    nameFr: "Robe Cocktail Noire & Mousseline",
    defaultImage: lookCocktail,
    poseImages: {
      pose_default: lookCocktail,
      pose_3_4: lookCocktail,
      pose_bust_closeup: lookCocktail,
      pose_walking: lookCocktail,
    },
  },

  // 5. Mariage invité
  wedding_guest: {
    nameFr: "Tenue Invitée de Mariage Raffinée",
    defaultImage: lookWeddingGuest,
    poseImages: {
      pose_default: lookWeddingGuest,
      pose_3_4: lookWeddingGuest,
      pose_bust_closeup: lookWeddingGuest,
    },
  },

  // 6. Fête, Rooftop & Nuit
  party_glam: {
    nameFr: "Ensemble Glamour Rooftop & Fête",
    defaultImage: lookPartyGlam,
    poseImages: {
      pose_default: lookPartyGlam,
      pose_3_4: lookPartyGlam,
      pose_bust_closeup: lookPartyGlam,
    },
  },

  // 7. Casual & Quotidien Chic
  casual_parisian: {
    nameFr: "Trench & Denim Casual Chic",
    defaultImage: lookCasualWeekend,
    poseImages: {
      pose_default: lookCasualWeekend,
      pose_3_4: lookCasualWeekend,
      pose_bust_closeup: lookCasualWeekend,
      pose_walking: lookCasualWeekend,
    },
  },

  // 8. Plage, Yacht & Bain
  beach_resort: {
    nameFr: "Ensemble Lin & Soie Balnéaire Riviera",
    defaultImage: lookBeachResort,
    poseImages: {
      pose_default: lookBeachResort,
      pose_3_4: lookBeachResort,
      pose_bust_closeup: lookBeachResort,
    },
  },

  // 9. Sport, Yoga & Tennis
  sport_wellness: {
    nameFr: "Ensemble Tennis Club & Athleisure",
    defaultImage: lookSportActive,
    poseImages: {
      pose_default: lookSportActive,
      pose_3_4: lookSportActive,
      pose_bust_closeup: lookSportActive,
      pose_walking: lookSportActive,
    },
  },
};

/**
 * Résout la collection de style la plus adaptée pour une occasion donnée
 */
export function getStyleLookForOccasion(occasionKey: OccasionKey): StyleLookCollection {
  // Lancement de produit
  if (occasionKey === 'occasion_lancement') {
    return STYLE_COLLECTIONS.launch_executive;
  }

  // Autres thèmes Business
  if (
    occasionKey === 'occasion_entretien' ||
    occasionKey === 'occasion_presentation' ||
    occasionKey === 'occasion_reunion_commerciale' ||
    occasionKey === 'occasion_travail_rdv'
  ) {
    return STYLE_COLLECTIONS.business_suit;
  }

  // Gala, Cérémonie de mariage, Soirée d'exception
  if (
    occasionKey === 'occasion_gala' ||
    occasionKey === 'occasion_defile' ||
    occasionKey === 'occasion_mariage_soiree' ||
    occasionKey === 'occasion_bal_masque' ||
    occasionKey === 'occasion_caritatif' ||
    occasionKey === 'occasion_nouvel_an'
  ) {
    return STYLE_COLLECTIONS.gala_couture;
  }

  // Mariage invité ou cérémonie
  if (
    occasionKey === 'occasion_mariage_invite' ||
    occasionKey === 'occasion_mariage_ceremonie' ||
    occasionKey === 'occasion_bapteme' ||
    occasionKey === 'occasion_reception'
  ) {
    return STYLE_COLLECTIONS.wedding_guest;
  }

  // Cocktail, Vernissage, Dîner romantique
  if (
    occasionKey === 'occasion_cocktail' ||
    occasionKey === 'occasion_vernissage' ||
    occasionKey === 'occasion_diner_romantique' ||
    occasionKey === 'occasion_theatre' ||
    occasionKey === 'occasion_restaurant'
  ) {
    return STYLE_COLLECTIONS.cocktail_chic;
  }

  // Soirée festive, Boîte, Rooftop, Festival
  if (
    occasionKey === 'occasion_rooftop' ||
    occasionKey === 'occasion_boite' ||
    occasionKey === 'occasion_lounge' ||
    occasionKey === 'occasion_concert' ||
    occasionKey === 'occasion_festival' ||
    occasionKey === 'occasion_rave' ||
    occasionKey === 'occasion_beachparty' ||
    occasionKey === 'occasion_afterwork' ||
    occasionKey === 'occasion_apero'
  ) {
    return STYLE_COLLECTIONS.party_glam;
  }

  // Plage & Maillots
  if (
    occasionKey.startsWith('occasion_swim') ||
    occasionKey === 'occasion_balneaire' ||
    occasionKey === 'occasion_yacht'
  ) {
    return STYLE_COLLECTIONS.beach_resort;
  }

  // Sport & Activités
  if (
    occasionKey === 'occasion_sport' ||
    occasionKey === 'occasion_tennis' ||
    occasionKey === 'occasion_running' ||
    occasionKey === 'occasion_cyclisme' ||
    occasionKey === 'occasion_yoga' ||
    occasionKey === 'occasion_danse' ||
    occasionKey === 'occasion_ski' ||
    occasionKey === 'occasion_surf'
  ) {
    return STYLE_COLLECTIONS.sport_wellness;
  }

  // Thèmes et Univers
  if (
    occasionKey === 'theme_streetwear' ||
    occasionKey === 'theme_cyberpunk' ||
    occasionKey === 'theme_y2k' ||
    occasionKey === 'theme_grunge' ||
    occasionKey === 'theme_rock'
  ) {
    return STYLE_COLLECTIONS.streetwear_urban;
  }

  if (
    occasionKey === 'theme_haute_couture' ||
    occasionKey === 'theme_avant_garde'
  ) {
    return STYLE_COLLECTIONS.gala_couture;
  }

  if (
    occasionKey === 'theme_chic_parisien' ||
    occasionKey === 'theme_minimalist' ||
    occasionKey === 'theme_preppy'
  ) {
    return STYLE_COLLECTIONS.business_suit;
  }
  
  if (
    occasionKey === 'theme_boho' ||
    occasionKey === 'theme_hippie' ||
    occasionKey === 'theme_vintage' ||
    occasionKey === 'theme_retro' ||
    occasionKey === 'theme_casual_chic'
  ) {
    return STYLE_COLLECTIONS.casual_parisian;
  }

  // Casual par défaut (brunch, voyage, shopping...)
  return STYLE_COLLECTIONS.casual_parisian;
}
