# Maquette cliquable Festia

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

Les noms, événements, réponses et codes de badge visibles dans la démonstration sont fictifs. Le bouton WhatsApp ouvre une conversation avec le contact Festia.

## Invitation complète

La page `/invitation/` présente une invitation de mariage mobile complète : ouverture d’enveloppe, couverture photo, compte à rebours, lieux, programme et RSVP de démonstration. Les lieux sont fictifs ; les boutons d’itinéraire ouvrent une recherche cartographique. Les RSVP sont simulés dans le navigateur et ne sont pas envoyés ni enregistrés.

Les photos d’illustration sont de [Clinton Mwebaze](https://unsplash.com/photos/a-bride-and-groom-stand-solemnly-at-their-wedding-ceremony-QSsQJ0TngzM) et [Lisa Marie Theck](https://unsplash.com/photos/woman-in-white-dress-dancing-RCf8mbyNxb4), via Unsplash.
