const fs = require('fs');

const categories = [
  { id: "cat_noel", label: "Noël & fêtes", icon: "🎄", styles: ["Réveillon élégant", "Repas familial", "Chalet cosy", "Pull de Noël", "Noël glamour"] },
  { id: "cat_plongee", label: "Activités aquatiques", icon: "🤿", styles: ["Plongée sous-marine", "Snorkeling", "Apnée", "Surf", "Paddle"] },
  { id: "cat_fitness", label: "Fitness & salle", icon: "🏋️‍♀️", styles: ["Musculation", "Cardio", "Training fonctionnel", "Tenue sportive sobre", "Ensemble coloré"] },
  { id: "cat_yoga", label: "Yoga & Pilates", icon: "🧘‍♀️", styles: ["Minimaliste", "Tons naturels", "Studio élégant", "Pratique douce", "Extérieur"] },
  { id: "cat_running", label: "Running", icon: "🏃‍♀️", styles: ["Course urbaine", "Trail", "Piste", "Footing hivernal", "Course estivale"] },
  { id: "cat_raquette", label: "Sports de raquette", icon: "🎾", styles: ["Tennis classique", "Tennis contemporain", "Padel", "Badminton", "Squash"] },
  { id: "cat_velo", label: "Vélo & mobilité", icon: "🚴‍♀️", styles: ["Cyclisme sur route", "VTT", "Gravel", "Vélo urbain", "Trajet domicile-travail"] },
  { id: "cat_montagne", label: "Sports d’hiver", icon: "⛷️", styles: ["Ski", "Snowboard", "Ski de fond", "Raquettes", "Après-ski"] },
  { id: "cat_rando", label: "Randonnée", icon: "🥾", styles: ["Balade nature", "Randonnée estivale", "Trekking", "Camping", "Exploration sous la pluie"] },
  { id: "cat_nautisme", label: "Nautisme", icon: "⛵", styles: ["Voile", "Croisière", "Yacht chic", "Marin classique", "Promenade côtière"] },
  { id: "cat_equitation", label: "Équitation", icon: "🐎", styles: ["Entraînement équestre", "Concours", "Campagne chic", "Country", "Western"] },
  { id: "cat_danse", label: "Danse", icon: "💃", styles: ["Danse classique", "Contemporaine", "Hip-hop", "Salsa", "Tango"] },
  { id: "cat_festival", label: "Festivals", icon: "🎪", styles: ["Bohème", "Rock", "Électro", "Festival sous la pluie"] }, // removed 'country' to avoid duplicate or handled specially
  { id: "cat_mariage", label: "Mariage", icon: "💍", styles: ["Marié ou mariée", "Témoin", "Cortège", "Invité", "Brunch du lendemain"] },
  { id: "cat_rendezvous", label: "Rendez-vous amoureux", icon: "🌹", styles: ["Premier café", "Dîner romantique", "Promenade", "Soirée élégante", "Week-end à deux"] },
  { id: "cat_voyage", label: "Voyage", icon: "✈️", styles: ["Avion longue distance", "Train", "Road trip", "Voyage professionnel", "Arrivée en station balnéaire"] },
  { id: "cat_maison", label: "Maison & détente", icon: "🛋️", styles: ["Loungewear", "Télétravail confortable", "Dimanche cosy", "Recevoir chez soi", "Tenue de nuit"] },
  { id: "cat_jardin", label: "Jardinage & bricolage", icon: "🪴", styles: ["Jardinage léger", "Potager", "Atelier créatif", "Peinture", "Petit bricolage"] },
  { id: "cat_culture", label: "Culture & sorties", icon: "🎭", styles: ["Musée", "Vernissage", "Théâtre", "Opéra", "Soirée littéraire"] },
  { id: "cat_pro", label: "Événements pro", icon: "💼", styles: ["Entretien d’embauche", "Conférence", "Salon", "Présentation sur scène", "Cocktail professionnel"] },
  { id: "cat_fete", label: "Fêtes à thème", icon: "🥳", styles: ["Halloween", "Carnaval", "Bal masqué", "Soirée disco", "Soirée rétro"] },
  { id: "cat_grossesse", label: "Grossesse", icon: "🤰", styles: ["Quotidien évolutif", "Bureau", "Cérémonie", "Détente", "Accès pratique pour allaiter"] },
  { id: "cat_adapte", label: "Vêtements adaptés", icon: "🦽", styles: ["Habillage assis", "Fermetures faciles", "Coupes amples", "Accès aux dispositifs médicaux", "Confort sensoriel"] }
];

// Helper to make an occasion key
function makeKey(catId, styleName) {
  let normalized = styleName.toLowerCase().replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return `${catId}_${normalized}`;
}

let occasionOptions = [];
let translations = {};
let categoryMap = `  all: {
    label: "Tous les styles",
    icon: "✨",
    keys: [...occasionOptions],
  },\n`;

let styleCategoryTypes = ["'all'"];

for (const cat of categories) {
  styleCategoryTypes.push(`'${cat.id}'`);
  let keys = [];
  for (const style of cat.styles) {
    const key = makeKey(cat.id, style);
    occasionOptions.push(`  '${key}',`);
    translations[key] = style;
    keys.push(`'${key}'`);
  }
  categoryMap += `  ${cat.id}: {
    label: "${cat.label}",
    icon: "${cat.icon}",
    keys: [
      ${keys.join(',\n      ')}
    ],
  },\n`;
}

fs.writeFileSync('generated_occasions.txt', occasionOptions.join('\n'));
fs.writeFileSync('generated_translations.txt', JSON.stringify(translations, null, 2));
fs.writeFileSync('generated_category_map.txt', categoryMap);
fs.writeFileSync('generated_style_category.txt', styleCategoryTypes.join(' | '));

console.log("Done generating");
