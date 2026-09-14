# Pilote H&M — état et protocole de validation

## Portée
Ajout d'un onglet Boutiques FR/EN. Enregistrement manuel d'un article H&M (lien officiel, nom, taille, couleur, image importée), liste d'envies persistante dans IndexedDB, filtrage par marché, essayage via le service existant et ouverture de la fiche marchand. Aucune commande n'est passée dans l'application.

Les pays proposés sont des sélecteurs de boutiques, pas une garantie de livraison. La langue d'interface est indépendante du pays. Le format accepté est /locale/productpage.reference.html sur hm.com, www.hm.com ou www2.hm.com. Aucun équivalent étranger n'est deviné et aucun catalogue n'est extrait. Le prix et le stock sont inconnus.

Ce pilote ne contient pas de catalogue H&M connecté, d'affiliation active, de paiement intégré ni de compte synchronisé entre appareils. Les fichiers importés restent dans le navigateur jusqu'à l'essayage, qui envoie l'image au service IA configuré. Ne pas utiliser de visuels sans autorisation.

## Test manuel
1. Dans une copie de test, choisir une photo de modèle et ouvrir Boutiques.
2. Choisir France, copier une vraie fiche H&M française, renseigner taille/couleur et importer une image autorisée.
3. Enregistrer : la carte doit apparaître, avec disponibilité à confirmer.
4. Recharger : la carte et son image doivent rester dans ce navigateur.
5. Basculer l'interface en anglais : les commandes changent de langue, le pays reste indépendant.
6. Choisir Espagne : l'article français n'est pas proposé. Un lien français soumis pour Espagne est refusé.
7. Sans clé IA, cliquer Essayer : une erreur doit apparaître, sans nouvelle tenue fictive.
8. Avec une clé de test autorisée, choisir une seule image, essayer et contrôler visage, morphologie, vêtement et superposition. Ce test consomme l'API.
9. Ouvrir Voir / acheter : vérifier le produit dans la boutique, sans passer de commande pour ce test.
10. Retirer la carte, recharger et vérifier sa suppression.

## Tests automatiques
Node 22.18.0, npm install --ignore-scripts, npm test, npm run lint, npm run build.
Les références des tests unitaires sont fictives. Aucun test unitaire n'appelle H&M ou une API payante.
Le workflow GitHub Actions applique ces contrôles à la branche pilote et aux pull requests.

## Partenariat : points non confirmés au 14 septembre 2026
- Admission du projet au programme H&M, notamment pour le trafic et les livraisons en France.
- Accès catalogue autorisé et documentation de l'interface.
- Disponibilité par variante, cadence, horodatage, limites et accès de test.
- Autorisation explicite d'utiliser les images produit pour l'essayage IA.
- Liens profonds par marché, attribution, conditions commerciales.
- Interlocuteur habilité et procédure de candidature.

Le site marchand français est accessible : https://www2.hm.com/fr_fr/index.html (consulté le 14 septembre 2026). Des résultats de recherche chez Sovrn et Skimlinks mentionnent H&M, mais ils ne confirment ni admission pour ce projet, ni API de stock France. Aucune candidature ni aucun message n'a été envoyé.

## Brouillon de présentation — non envoyé
Objet : Proposition de pilote — dressing personnel et essayage virtuel H&M

Bonjour,
Nous développons une application de dressing personnel multilingue permettant de composer une tenue avec des vêtements déjà possédés et des articles à découvrir chez des enseignes.
Nous souhaitons étudier un pilote H&M : présentation d'articles autorisés, visualisation sur une photo personnelle et redirection vers votre boutique pour l'achat. Votre enseigne conserve la commande, le paiement, l'expédition et les retours.
Pourriez-vous nous indiquer les conditions d'admission, l'accès éventuel à un catalogue et aux disponibilités par taille/couleur, les marchés couverts et les autorisations relatives à l'essayage virtuel des visuels produits ?
Le prototype est en cours de validation. Nous ne revendiquons aucun résultat commercial mesuré ni partenariat existant.
Cordialement,
Yann
