# Maquette Festia

Maquette cliquable pour valider l’intérêt d’un service assisté d’invitations digitales auprès de particuliers et de prestataires événementiels.

## Lancer en local

```bash
npm ci
npm run dev
```

## Déploiement

Le site est exporté en fichiers statiques par `next build` et publié sur GitHub Pages par l’action définie dans `.github/workflows/deploy.yml`. Le formulaire RSVP et le contrôle d’entrée sont des simulations côté navigateur : aucune réponse n’est transmise ou sauvegardée.

## À propos des offres

Les tarifs affichés (50 000 FCFA, 75 000 FCFA et sur devis) sont des hypothèses de validation, pas une grille commerciale confirmée. Le contenu des formules et les options de badges / QR code restent à valider avant commande.

Cette maquette est un prototype public autonome. Elle ne contient pas les documents internes du projet. Le bouton WhatsApp ouvre une conversation avec le contact Festia.
