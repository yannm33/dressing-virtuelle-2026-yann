import { occasionOptions, type OccasionKey } from './occasions';

export const CATEGORY_MAP = {
  all: {
    label: "Tous les styles",
    en: "All styles",
    keys: [...occasionOptions],
  },
  cat_noel: {
    label: "Noël & fêtes",
    en: "Christmas & holidays",
    keys: [
      'cat_noel_reveillon_elegant',
      'cat_noel_repas_familial',
      'cat_noel_chalet_cosy',
      'cat_noel_pull_de_noel',
      'cat_noel_noel_glamour'
    ],
  },
  cat_plongee: {
    label: "Activités aquatiques",
    en: "Water activities",
    keys: [
      'cat_plongee_plongee_sous_marine',
      'cat_plongee_snorkeling',
      'cat_plongee_apnee',
      'cat_plongee_surf',
      'cat_plongee_paddle'
    ],
  },
  cat_fitness: {
    label: "Fitness & salle",
    en: "Fitness & gym",
    keys: [
      'cat_fitness_musculation',
      'cat_fitness_cardio',
      'cat_fitness_training_fonctionnel',
      'cat_fitness_tenue_sportive_sobre',
      'cat_fitness_ensemble_colore'
    ],
  },
  cat_yoga: {
    label: "Yoga & Pilates",
    en: "Yoga & Pilates",
    keys: [
      'cat_yoga_minimaliste',
      'cat_yoga_tons_naturels',
      'cat_yoga_studio_elegant',
      'cat_yoga_pratique_douce',
      'cat_yoga_exterieur'
    ],
  },
  cat_running: {
    label: "Running",
    en: "Running",
    keys: [
      'cat_running_course_urbaine',
      'cat_running_trail',
      'cat_running_piste',
      'cat_running_footing_hivernal',
      'cat_running_course_estivale'
    ],
  },
  cat_raquette: {
    label: "Sports de raquette",
    en: "Racket sports",
    keys: [
      'cat_raquette_tennis_classique',
      'cat_raquette_tennis_contemporain',
      'cat_raquette_padel',
      'cat_raquette_badminton',
      'cat_raquette_squash'
    ],
  },
  cat_velo: {
    label: "Vélo & mobilité",
    en: "Cycling & mobility",
    keys: [
      'cat_velo_cyclisme_sur_route',
      'cat_velo_vtt',
      'cat_velo_gravel',
      'cat_velo_velo_urbain',
      'cat_velo_trajet_domicile_travail'
    ],
  },
  cat_montagne: {
    label: "Sports d’hiver",
    en: "Winter sports",
    keys: [
      'cat_montagne_ski',
      'cat_montagne_snowboard',
      'cat_montagne_ski_de_fond',
      'cat_montagne_raquettes',
      'cat_montagne_apres_ski'
    ],
  },
  cat_rando: {
    label: "Randonnée",
    en: "Hiking",
    keys: [
      'cat_rando_balade_nature',
      'cat_rando_randonnee_estivale',
      'cat_rando_trekking',
      'cat_rando_camping',
      'cat_rando_exploration_sous_la_pluie'
    ],
  },
  cat_nautisme: {
    label: "Nautisme",
    en: "Sailing & seaside",
    keys: [
      'cat_nautisme_voile',
      'cat_nautisme_croisiere',
      'cat_nautisme_yacht_chic',
      'cat_nautisme_marin_classique',
      'cat_nautisme_promenade_cotiere'
    ],
  },
  cat_equitation: {
    label: "Équitation",
    en: "Equestrian",
    keys: [
      'cat_equitation_entrainement_equestre',
      'cat_equitation_concours',
      'cat_equitation_campagne_chic',
      'cat_equitation_country',
      'cat_equitation_western'
    ],
  },
  cat_danse: {
    label: "Danse",
    en: "Dance",
    keys: [
      'cat_danse_danse_classique',
      'cat_danse_contemporaine',
      'cat_danse_hip_hop',
      'cat_danse_salsa',
      'cat_danse_tango'
    ],
  },
  cat_festival: {
    label: "Festivals",
    en: "Festivals",
    keys: [
      'cat_festival_boheme',
      'cat_festival_rock',
      'cat_festival_electro',
      'cat_festival_festival_sous_la_pluie'
    ],
  },
  cat_mariage: {
    label: "Mariage",
    en: "Wedding",
    keys: [
      'cat_mariage_marie_ou_mariee',
      'cat_mariage_temoin',
      'cat_mariage_cortege',
      'cat_mariage_invite',
      'cat_mariage_brunch_du_lendemain'
    ],
  },
  cat_rendezvous: {
    label: "Rendez-vous amoureux",
    en: "Dating",
    keys: [
      'cat_rendezvous_premier_cafe',
      'cat_rendezvous_diner_romantique',
      'cat_rendezvous_promenade',
      'cat_rendezvous_soiree_elegante',
      'cat_rendezvous_week_end_a_deux'
    ],
  },
  cat_voyage: {
    label: "Voyage",
    en: "Travel",
    keys: [
      'cat_voyage_avion_longue_distance',
      'cat_voyage_train',
      'cat_voyage_road_trip',
      'cat_voyage_voyage_professionnel',
      'cat_voyage_arrivee_en_station_balneaire'
    ],
  },
  cat_maison: {
    label: "Maison & détente",
    en: "Home & relaxation",
    keys: [
      'cat_maison_loungewear',
      'cat_maison_teletravail_confortable',
      'cat_maison_dimanche_cosy',
      'cat_maison_recevoir_chez_soi',
      'cat_maison_tenue_de_nuit'
    ],
  },
  cat_jardin: {
    label: "Jardinage & bricolage",
    en: "Gardening & DIY",
    keys: [
      'cat_jardin_jardinage_leger',
      'cat_jardin_potager',
      'cat_jardin_atelier_creatif',
      'cat_jardin_peinture',
      'cat_jardin_petit_bricolage'
    ],
  },
  cat_culture: {
    label: "Culture & sorties",
    en: "Culture & outings",
    keys: [
      'cat_culture_musee',
      'cat_culture_vernissage',
      'cat_culture_theatre',
      'cat_culture_opera',
      'cat_culture_soiree_litteraire'
    ],
  },
  cat_pro: {
    label: "Événements pro",
    en: "Professional events",
    keys: [
      'cat_pro_entretien_d_embauche',
      'cat_pro_conference',
      'cat_pro_salon',
      'cat_pro_presentation_sur_scene',
      'cat_pro_cocktail_professionnel'
    ],
  },
  cat_fete: {
    label: "Fêtes à thème",
    en: "Themed parties",
    keys: [
      'cat_fete_halloween',
      'cat_fete_carnaval',
      'cat_fete_bal_masque',
      'cat_fete_soiree_disco',
      'cat_fete_soiree_retro'
    ],
  },
  cat_grossesse: {
    label: "Grossesse",
    en: "Maternity",
    keys: [
      'cat_grossesse_quotidien_evolutif',
      'cat_grossesse_bureau',
      'cat_grossesse_ceremonie',
      'cat_grossesse_detente',
      'cat_grossesse_acces_pratique_pour_allaiter'
    ],
  },
  cat_adapte: {
    label: "Vêtements adaptés",
    en: "Adaptive clothing",
    keys: [
      'cat_adapte_habillage_assis',
      'cat_adapte_fermetures_faciles',
      'cat_adapte_coupes_amples',
      'cat_adapte_acces_aux_dispositifs_medicaux',
      'cat_adapte_confort_sensoriel'
    ],
  },

legacy_ceremony: { label: "Cérémonies & soirées", en: "Ceremonies & evenings", keys: ["occasion_mariage_invite","occasion_mariage_ceremonie","occasion_mariage_soiree","occasion_bapteme","occasion_gala","occasion_reception","occasion_funerailles","occasion_caritatif"] },
legacy_business: { label: "Business & travail", en: "Business & work", keys: ["occasion_travail_rdv","occasion_reunion_commerciale","occasion_presentation","occasion_entretien","occasion_afterwork","occasion_shoppingvip","occasion_lancement"] },
legacy_sport: { label: "Sport & plein air", en: "Sport & outdoors", keys: ["occasion_randonnee","occasion_sport","occasion_tennis","occasion_running","occasion_cyclisme","occasion_yoga","occasion_boxe","occasion_natation","occasion_danse","occasion_ski","occasion_surf","occasion_football","occasion_basketball"] },
legacy_beach: { label: "Plage & vacances", en: "Beach & holidays", keys: ["occasion_balneaire","occasion_beachparty","occasion_yacht","occasion_swim_onepiece","occasion_swim_twopiece","occasion_swim_tankini","occasion_swim_beach","occasion_swim_pool","occasion_swim_ocean","occasion_swim_lake"] },
legacy_themes: { label: "Univers & tendances", en: "Style universes & trends", keys: ["theme_streetwear","theme_y2k","theme_vintage","theme_boho","theme_cyberpunk","theme_preppy","theme_grunge","theme_minimalist","theme_haute_couture","theme_chic_parisien","theme_avant_garde","theme_gothic","theme_rock","theme_maternity","theme_hippie","theme_western","theme_workwear","theme_retro","theme_casual_chic","theme_steampunk"] },
legacy_other: { label: "Quotidien & sorties", en: "Everyday & going out", keys: ["occasion_cocktail","occasion_diner_romantique","occasion_boite","occasion_lounge","occasion_restaurant","occasion_dejeuner","occasion_cinema","occasion_concert","occasion_festival","occasion_voyage","occasion_shopping","occasion_famille","occasion_vernissage","occasion_garden","occasion_nouvel_an","occasion_noel","occasion_defile","occasion_rooftop","occasion_brunch","occasion_deguisement","occasion_shooting","occasion_bal_masque","occasion_rave","occasion_picnic","occasion_karaoke","occasion_coloc","occasion_speeddating","occasion_jazzclub","occasion_theatre","occasion_apero"] },
} satisfies Record<string, { label: string; en: string; keys: readonly OccasionKey[] }>;

export type StyleCategory = keyof typeof CATEGORY_MAP;

export const normalizeStyleSearch = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_’']/g, ' ').replace(/\s+/g, ' ').trim();

export function getOccasionCategory(key: OccasionKey): Exclude<StyleCategory, 'all'> {
  return (Object.keys(CATEGORY_MAP) as StyleCategory[]).find(
    category => category !== 'all' && (CATEGORY_MAP[category].keys as readonly OccasionKey[]).includes(key)
  ) as Exclude<StyleCategory, 'all'>;
}

export const preferenceOptions = {
  aesthetic: [
    ['Classique', 'Classic'], ['Minimaliste', 'Minimalist'], ['Bohème', 'Bohemian'],
    ['Streetwear', 'Streetwear'], ['Sportswear', 'Sportswear'], ['Rock', 'Rock'],
    ['Rétro', 'Retro'], ['Romantique', 'Romantic'], ['Luxe discret', 'Quiet luxury'],
    ['Avant-garde', 'Avant-garde']
  ],
  season: [['Printemps', 'Spring'], ['Été', 'Summer'], ['Automne', 'Autumn'], ['Hiver', 'Winter']],
  setting: [['Intérieur', 'Indoors'], ['Extérieur', 'Outdoors'], ['Intérieur et extérieur', 'Indoors and outdoors']]
} as const;

export interface StylingPreferences {
  aesthetic?: string;
  season?: string;
  setting?: string;
  details?: string;
}

export function buildOccasionBrief(key: OccasionKey, label: string, preferences: StylingPreferences = {}): string {
  const category = CATEGORY_MAP[getOccasionCategory(key)];
  const lines = [
    'Occasion / activity: ' + category.en + ' — ' + label,
    preferences.aesthetic && 'Optional aesthetic: ' + preferences.aesthetic,
    preferences.season && 'Season: ' + preferences.season,
    preferences.setting && 'Setting: ' + preferences.setting,
    preferences.details?.trim() && 'User clothing preferences: ' + preferences.details.trim().slice(0, 500),
    'The selected activity and its functional clothing needs take priority over the optional aesthetic.',
    'Preserve identity, body shape and pose. Adapt clothing to the person; do not change their body.',
    'Do not infer measurements, weather, medical conditions or ownership of garments.',
    'For pregnancy and adaptive clothing, change garments only; do not invent body changes or medical devices.',
    'Technical equipment is a visual proposal, never a safety or suitability certification.'
  ];
  return lines.filter(Boolean).join('\n');
}
