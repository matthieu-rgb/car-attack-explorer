# CAN Bus Explorer — surface d'attaque d'un véhicule

Explorateur web interactif et pédagogique de la surface d'attaque d'un véhicule moderne. Sur un plan du véhicule vu de dessus, on voit les calculateurs à leur place, les bus qui les relient par domaine et la passerelle centrale. On choisit une attaque dans un catalogue : l'application montre par où elle entre, comment elle circule, et ce qu'une contre-mesure bloque vraiment.

**Aperçu en ligne : https://matthieu-rgb.github.io/car-attack-explorer/**

## Avertissement

Outil de compréhension et de sensibilisation. **Aucune attaque réelle n'est exécutée** : aucune trame CAN n'est émise, aucun réseau n'est touché. Tout est une simulation visuelle fondée sur des mécanismes publiquement documentés (Car Hacker's Handbook de Craig Smith, recherches publiques, UNECE R155 / R156, ISO/SAE 21434, rapport Upstream 2025). Les méthodes restent volontairement conceptuelles : aucun mode opératoire exploitable sur un véhicule réel n'est fourni. Les identifiants CAN et les trames affichés sont des exemples pédagogiques, pas les valeurs d'un constructeur.

## Ce que fait l'application

- Plan du véhicule vu de dessus : calculateurs placés anatomiquement, quatre domaines de bus (powertrain, châssis, habitacle, infotainment) reliés par la passerelle centrale, points d'entrée marqués, trafic de fond animé.
- Catalogue de 30 attaques réparties en cinq couches (bus CAN, diagnostic UDS, points d'entrée et télématique, réseaux embarqués modernes, matériel et recharge), filtrables par niveau.
- Fiche d'attaque à deux niveaux : un résumé simple, puis le détail technique (principe, pourquoi ça marche, méthode pas à pas, prérequis, effet, exemple de trame, remédiations, famille UNECE R155 Annexe 5, outils de référence, cas réel).
- Trois interrupteurs de contre-mesures (SecOC, segmentation, durcissement) qui modifient le résultat de l'attaque jouée. Le déni de service reste efficace quelles que soient les défenses : c'est voulu.
- Trois langues : français (complet), allemand, anglais.
- Deux thèmes (sombre et clair), accessibilité clavier, `prefers-reduced-motion` respecté, responsive sans défilement horizontal.

## Stack

Vite + TypeScript strict, sans framework. Plan et animations en SVG. Données séparées du code, textes d'interface en fichiers de langue. Site entièrement statique, hébergeable sur GitHub Pages. Seule dépendance réseau au runtime : les polices Google Fonts.

## Démarrage

```sh
npm install
npm run dev        # serveur de développement
npm run build      # vérification des types + build statique dans dist/
npm run preview    # prévisualise le build
```

## Structure

```
src/
  main.ts              assemblage et logique d'interface
  render/              plan SVG, trafic, chemin d'attaque
  sim/                 moteur : effet des contre-mesures sur une attaque
  ui/                  catalogue, fiche, interrupteurs, helpers DOM
  data/                types, modele du vehicule, catalogue d'attaques
    content/           traductions des fiches (de, en)
  i18n/                textes d'interface (fr, de, en)
  styles/              tokens, base, styles applicatifs
```

## Ajouter du contenu

- **Une attaque** : ajouter un objet dans `src/data/attacks.ts` (c'est la version française, canonique) en renseignant les champs structurels (couche, niveau, point d'entrée, route sur le plan, cible, contre-mesures qui bloquent) et les champs textuels. Ajouter sa traduction dans `src/data/content/de.ts` et `en.ts`.
- **Une langue d'interface** : ajouter un fichier `src/i18n/<lang>.json` et l'enregistrer dans `src/i18n/index.ts`.

## Modèle du véhicule

Le plan représente un véhicule générique moderne. Les calculateurs, bus et points d'entrée sont définis dans `src/data/vehicle.ts` avec leurs positions sur le plan SVG. Les identifiants CAN du catalogue sont des exemples pédagogiques.

## Déploiement (GitHub Pages)

Le dépôt contient un workflow GitHub Actions (`.github/workflows/deploy.yml`) qui construit le site et le publie sur GitHub Pages à chaque poussée sur `main`. Le build utilise la variable `BASE_PATH=/car-attack-explorer/` pour que les chemins fonctionnent sous le sous-répertoire de Pages. Activer Pages dans les réglages du dépôt avec la source « GitHub Actions ».

## Références

- Craig Smith, *The Car Hacker's Handbook*
- UNECE R155 (cybersécurité) et R156 (mises à jour logicielles)
- ISO/SAE 21434 (ingénierie de la cybersécurité automobile)
- Upstream, *Global Automotive Cybersecurity Report 2025*

## Licence

MIT. Voir le fichier `LICENSE`.
