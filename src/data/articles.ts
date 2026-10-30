// Rubrique "Analyses" : decryptage des hacks auto recents.
// FR canonique inline ; de/en fournissent des tableaux miroir (repli FR).
// Texte affiche en francais accentue ; identifiants et code restent en ASCII.

import type { Lang } from "../i18n";
import type { Block, Section } from "./reading";
import { articlesDe } from "./content/articles.de";
import { articlesEn } from "./content/articles.en";

// Vecteur dominant de l'attaque : pilote la pastille coloree.
export type Vector = "can" | "api" | "hardware" | "rf" | "charge";

export interface ArticleFiche {
  cible: string;
  entree: string;
  methode: string;
  faille: string;
}

export interface Article {
  slug: string; // identifiant d'URL, neutre linguistiquement
  date: string; // ISO "2023-04-03"
  readMins: number;
  vector: Vector;
  tags: string[];
  title: string;
  dek: string; // chapeau : une phrase, pour la carte et l'en-tete
  fiche: ArticleFiche;
  sections: Section[];
  sources: { label: string; url: string }[];
}

const fr: Article[] = [
  {
    slug: "karr-bluetooth",
    date: "2026-08-09",
    readMins: 5,
    vector: "rf",
    tags: ["Bluetooth", "Clé partagée", "Alarme après-vente", "2026"],
    title: "KARR : une seule clé Bluetooth pour 2,2 millions de voitures",
    dek:
      "En 2026, des chercheurs de UC San Diego montrent qu'une alarme antivol posée en concession utilise la même clé Bluetooth sur tous les appareils. Avec cette clé, on ouvre, on fait taire l'alarme, on bloque le démarrage.",
    fiche: {
      cible:
        "Véhicules équipés d'une alarme KARR / SWDS posée en concession (Honda, Toyota, Mazda, Ford, Jeep...), environ 2,2 millions.",
      entree: "L'interface Bluetooth de l'alarme après-vente, pas la voiture elle-même.",
      methode:
        "Forger les commandes radio grâce à une clé d'authentification codée en dur, identique sur tous les boîtiers.",
      faille: "Une seule clé cryptographique partagée par toute la flotte : la connaître une fois suffit pour tous.",
    },
    sections: [
      {
        id: "maillon",
        heading: "Le maillon ajouté",
        blocks: [
          {
            t: "p",
            text: "L'alarme KARR n'est pas montée par le constructeur : c'est un accessoire posé en concession, souvent reconnaissable à un autocollant KARR ou SWDS sur la vitre du conducteur. Elle se pilote en Bluetooth depuis une application. C'est exactement le genre d'ajout dont personne ne vérifie la sécurité.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par où ils sont entrés",
        blocks: [
          {
            t: "ol",
            items: [
              "Rétro-ingénierie du protocole Bluetooth de l'alarme.",
              "Découverte d'une clé d'authentification codée en dur, la même sur tous les appareils.",
              "Avec cette clé, forger les commandes acceptées par l'alarme.",
              "Déverrouiller les portes, désactiver l'alarme, klaxonner, et bloquer le démarrage quand le véhicule est à l'arrêt.",
            ],
          },
          {
            t: "note",
            text:
              "Travail de UC San Diego, présenté à DEF CON le 9 août et à USENIX Security le 12 août 2026. Un correctif firmware a été diffusé le 20 juillet 2026 via l'application KARR ; l'éditeur affirme n'avoir connaissance d'aucun abus réel.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "Ce qui a péché, la leçon",
        blocks: [
          {
            t: "p",
            text: "Coder une clé unique dans tous les boîtiers, c'est transformer un secret en point de défaillance unique : une seule extraction compromet la flotte entière. Chaque boîtier aurait dû avoir sa propre clé, appairée à un seul véhicule.",
          },
          {
            t: "p",
            text: "La morale est plus large : votre point faible n'est pas forcément dans la voiture. L'accessoire après-vente, censé protéger, devient la porte d'entrée. Plus on ajoute d'objets connectés autour du véhicule, plus la surface d'attaque s'étend hors de la voiture.",
          },
        ],
      },
    ],
    sources: [
      { label: "Fox News : KARR Bluetooth flaw exposes 2.2M cars", url: "https://www.foxnews.com/tech/karr-bluetooth-flaw-exposes-2-2m-cars-theft-risk" },
      { label: "Popular Science : 2 million cars at risk of Bluetooth hack", url: "https://www.popsci.com/technology/car-bluetooth-cybersecurity-hack/" },
      { label: "Malwarebytes : millions of cars could be tracked and unlocked", url: "https://www.malwarebytes.com/blog/bugs/2026/07/millions-of-cars-could-be-tracked-and-unlocked-by-a-hidden-security-flaw" },
    ],
  },

  {
    slug: "subaru-starlink",
    date: "2025-01-23",
    readMins: 6,
    vector: "api",
    tags: ["Géolocalisation", "Portail admin", "Prise de contrôle", "Vie privée"],
    title: "Subaru STARLINK : un an de trajets dans un panneau admin",
    dek:
      "Début 2025, Sam Curry et Shubham Shah entrent dans le panneau d'administration STARLINK de Subaru. À la clé : localisation en direct, historique d'un an, et contrôle des véhicules aux États-Unis, au Canada et au Japon.",
    fiche: {
      cible: "Subaru connectées (STARLINK) aux États-Unis, au Canada et au Japon.",
      entree: "Un sous-domaine d'administration trouvé par scan, puis un compte employé repris.",
      methode:
        "Réinitialiser le mot de passe d'un employé (email trouvé sur LinkedIn) en contournant deux questions de sécurité.",
      faille: "Un panneau admin trop exposé et mal protégé : l'accès d'un employé donne la main sur tout.",
    },
    sections: [
      {
        id: "porte",
        heading: "Trouver la porte",
        blocks: [
          {
            t: "p",
            text: "Tout commence par un balayage de sous-domaines. Les deux chercheurs tombent sur le portail d'administration interne de STARLINK, l'outil que les employés utilisent pour gérer les comptes et les véhicules. Il n'aurait jamais dû être atteignable aussi facilement.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par où ils sont entrés",
        blocks: [
          {
            t: "ol",
            items: [
              "Trouver l'adresse email d'un employé Subaru sur LinkedIn.",
              "Déclencher une réinitialisation de mot de passe sur son compte.",
              "Contourner les deux questions de sécurité exigées.",
              "Obtenir un accès administrateur complet au portail.",
              "Interroger n'importe quel véhicule par son VIN, lui-même retrouvable à partir d'une plaque via les fichiers d'immatriculation.",
            ],
          },
        ],
      },
      {
        id: "ampleur",
        heading: "L'ampleur",
        blocks: [
          {
            t: "p",
            text: "Le panneau ne se contente pas d'afficher des fiches. Depuis l'interface, ils peuvent agir sur les véhicules et consulter des données sensibles.",
          },
          {
            t: "ul",
            items: [
              "Démarrer, arrêter, verrouiller et déverrouiller n'importe quelle Subaru connectée.",
              "Voir la position en direct.",
              "Extraire un an d'historique de localisation sur leur véhicule de test.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Ce qui a péché, la leçon",
        blocks: [
          {
            t: "p",
            text: "Deux problèmes se cumulent. D'abord une surface d'administration exposée et une récupération de compte trop faible : reset par email plus questions contournables. Ensuite, et c'est le plus durable, la rétention des données : un an de trajets de chaque conducteur, accessibles derrière un simple mot de passe.",
          },
          {
            t: "p",
            text: "Subaru a corrigé rapidement. Mais l'affaire rappelle que la voiture peut être bien protégée pendant que le dos du décor, le portail et sa base, ne l'est pas.",
          },
        ],
      },
    ],
    sources: [
      { label: "Sam Curry : Hacking Subaru", url: "https://samcurry.net/hacking-subaru" },
      { label: "Jalopnik : hackers crack Subaru's connected services", url: "https://jalopnik.com/hackers-crack-subarus-connected-services-to-access-loca-1851746393" },
      { label: "Engadget : Subaru's poor security left vehicle data accessible", url: "https://www.engadget.com/cybersecurity/subarus-poor-security-left-troves-of-vehicle-data-easily-accessible-182514123.html" },
    ],
  },

  {
    slug: "pwn2own-automotive-2025",
    date: "2025-01-24",
    readMins: 5,
    vector: "charge",
    tags: ["Compétition", "Chargeurs VE", "Infodivertissement", "0-day"],
    title: "Pwn2Own Automotive 2025 : 49 failles, et les chargeurs tombent",
    dek:
      "À Tokyo en janvier 2025, des équipes ont enchaîné 49 failles inédites pour 886 250 dollars. La cible la plus prolifique : les bornes de recharge.",
    fiche: {
      cible:
        "Bornes de recharge (Tesla Wall Connector, Autel, ChargePoint...), systèmes d'exploitation embarqués et autoradios.",
      entree: "Les surfaces réseau et USB de matériels grand public et semi-professionnels.",
      methode: "Des chaînes d'exploitation (débordements, comparaisons sans borne minimale...) jusqu'à l'exécution de code.",
      faille: "Un écosystème large et jeune : beaucoup de code exposé, encore peu durci.",
    },
    sections: [
      {
        id: "principe",
        heading: "Le principe de Pwn2Own",
        blocks: [
          {
            t: "p",
            text: "Pwn2Own est un concours organisé par la Zero Day Initiative. Les équipes viennent avec des failles inédites (des 0-day) qu'elles démontrent en direct sur du vrai matériel. Elles sont payées, et en échange les fabricants récupèrent les bugs pour les corriger. C'est une photographie annuelle de l'état de la sécurité auto.",
          },
        ],
      },
      {
        id: "tombe",
        heading: "Ce qui est tombé",
        blocks: [
          {
            t: "p",
            text: "Les bornes de recharge ont été la cible la plus riche de l'édition. Le Tesla Wall Connector est le premier matériel à tomber, via une comparaison de plage numérique sans borne minimale qui permet d'en prendre le contrôle.",
          },
          {
            t: "ul",
            items: [
              "Plus de 140 000 dollars rien que pour les failles du Tesla Wall Connector.",
              "De nombreux autoradios et systèmes d'infodivertissement compromis.",
              "La recharge électrique s'impose comme la surface la plus exposée.",
            ],
          },
        ],
      },
      {
        id: "gagnants",
        heading: "Qui a gagné",
        blocks: [
          {
            t: "p",
            text: "Sina Kheirkhah, de la Summoning Team, est sacré Master of Pwn avec 222 250 dollars. Synacktiv termine deuxième avec 147 500 dollars. Au total : 49 failles inédites et 886 250 dollars distribués. Fait notable, personne n'a tenté d'attaquer une Tesla complète cette année-là, alors que les organisateurs avaient prévu d'offrir une voiture.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "Ce que ça dit du secteur, la leçon",
        blocks: [
          {
            t: "p",
            text: "La surface d'attaque s'est déplacée vers l'extérieur de la voiture : bornes, applications, cloud. L'infrastructure de recharge, jeune et déployée vite, est la nouvelle cible molle. La tendance se confirme : un rapport PCA a recensé 345 nouvelles vulnérabilités automobiles au deuxième trimestre 2026, dont 161 jugées critiques.",
          },
        ],
      },
    ],
    sources: [
      { label: "Zero Day Initiative : Pwn2Own Automotive 2025, résultats finaux", url: "https://www.thezdi.com/blog/2025/1/23/pwn2own-automotive-2025-day-three-and-final-results" },
      { label: "BleepingComputer : 886 250 dollars pour 49 0-days", url: "https://www.bleepingcomputer.com/news/security/hackers-get-886-250-for-49-zero-days-at-pwn2own-automotive-2025/" },
      { label: "SecurityWeek : chargeurs, OS et infodivertissement", url: "https://www.securityweek.com/hackers-earn-886000-at-pwn2own-automotive-2025-for-charger-os-infotainment-exploits/" },
    ],
  },

  {
    slug: "kia-portail-plaque",
    date: "2024-09-26",
    readMins: 5,
    vector: "api",
    tags: ["Prise de contrôle à distance", "API", "Portail concessionnaire", "Plaque"],
    title: "Kia : prendre le contrôle d'une voiture avec une plaque",
    dek:
      "En 2024, l'équipe de Sam Curry contrôle à distance des millions de Kia à partir d'une simple plaque d'immatriculation, via le portail réservé aux concessionnaires.",
    fiche: {
      cible: "Kia connectées produites après 2013, abonnement Kia Connect actif ou non.",
      entree: "kiaconnect.kdealer.com, le portail web des concessionnaires.",
      methode:
        "Créer un compte concessionnaire, générer un jeton, appeler les API internes, se rajouter comme propriétaire.",
      faille: "Un contrôle d'accès côté serveur défaillant : un compte revendeur donne la main sur n'importe quel véhicule.",
    },
    sections: [
      {
        id: "plaque",
        heading: "D'une plaque à un propriétaire",
        blocks: [
          {
            t: "p",
            text: "Le point de départ est accessible à tous : une plaque d'immatriculation. Elle mène au VIN, puis, côté serveur, aux informations du propriétaire. Aucun accès physique à la voiture n'est nécessaire.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par où ils sont entrés",
        blocks: [
          {
            t: "ol",
            items: [
              "Enregistrer un compte sur le portail concessionnaire kiaconnect.kdealer.com, en réutilisant la même requête d'inscription que les clients.",
              "Générer un jeton d'accès valide pour les API internes des concessionnaires.",
              "Récupérer les données du propriétaire : nom, téléphone, email, adresse.",
              "Remplacer l'email du propriétaire par le sien et s'ajouter comme titulaire principal.",
              "Envoyer des commandes au véhicule.",
            ],
          },
        ],
      },
      {
        id: "capacites",
        heading: "Ce qu'ils pouvaient faire",
        blocks: [
          {
            t: "ul",
            items: [
              "Verrouiller et déverrouiller, démarrer et arrêter, klaxonner, localiser le véhicule.",
              "Le tout en une trentaine de secondes.",
              "Sans aucune notification au propriétaire que sa voiture avait été accédée ou ses droits modifiés.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Ce qui a péché, la leçon",
        blocks: [
          {
            t: "p",
            text: "La voiture n'a pas été piratée : le maillon faible est le serveur web. Un contrôle d'accès mal cloisonné laissait un compte revendeur agir sur les véhicules de n'importe quel client. C'est l'illustration parfaite du basculement de la menace : aujourd'hui l'essentiel des attaques est mené à distance, et une large part passe par la télématique, le cloud ou les API.",
          },
          {
            t: "p",
            text: "Les failles ont été corrigées avant publication, l'outil de démonstration n'a jamais été diffusé, et Kia indique qu'aucune exploitation malveillante n'a eu lieu.",
          },
        ],
      },
    ],
    sources: [
      { label: "Sam Curry : Hacking Kia", url: "https://samcurry.net/hacking-kia" },
      { label: "SecurityWeek : millions of Kia cars vulnerable to remote hacking", url: "https://www.securityweek.com/millions-of-kia-cars-were-vulnerable-to-remote-hacking-researchers/" },
      { label: "BleepingComputer : Kia dealer portal flaw", url: "https://www.bleepingcomputer.com/news/security/kia-dealer-portal-flaw-could-let-attackers-hack-millions-of-cars/" },
    ],
  },

  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 6,
    vector: "hardware",
    tags: ["Matériel", "Fault injection", "Racine de confiance", "Jailbreak"],
    title: "Tesla : faire trébucher la puce pour casser la racine de confiance",
    dek:
      "En 2023, des chercheurs de la TU Berlin perturbent l'alimentation du processeur AMD d'une Tesla pour contourner son démarrage sécurisé. De là, ils extraient des secrets et déverrouillent des options payantes.",
    fiche: {
      cible: "Tesla récentes à système d'infodivertissement AMD Ryzen.",
      entree: "La carte MCU : un accès physique à l'alimentation du processeur sécurisé AMD.",
      methode: "Voltage glitching : une micro-coupure de tension au bon instant fait sauter une vérification au démarrage.",
      faille: "Un démarrage sécurisé contournable par injection de faute, dans une ROM non corrigeable.",
    },
    sections: [
      {
        id: "glitch",
        heading: "C'est quoi le voltage glitching",
        blocks: [
          {
            t: "p",
            text: "C'est une attaque par injection de faute. En provoquant une chute de tension très brève, à l'instant précis où le processeur exécute une instruction sensible (par exemple une vérification de signature), on le fait trébucher : l'instruction est sautée ou mal exécutée, et le contrôle passe quand il aurait dû échouer.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par où ils sont entrés",
        blocks: [
          {
            t: "ol",
            items: [
              "Accès physique à la carte MCU du véhicule.",
              "Cibler le processeur sécurisé AMD, la racine de confiance du système.",
              "Glitcher la vérification du chargeur d'amorçage en ROM.",
              "Faire exécuter du code non signé.",
            ],
          },
        ],
      },
      {
        id: "butin",
        heading: "Ce qu'ils obtiennent",
        blocks: [
          {
            t: "ul",
            items: [
              "Exécuter leur propre logiciel : un jailbreak de l'infodivertissement.",
              "Extraire la clé RSA liée au matériel, celle qui authentifie la voiture auprès du réseau de service Tesla.",
              "Activer des options verrouillées par logiciel : sièges chauffants, boost d'accélération.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Pourquoi c'est grave et difficile à patcher",
        blocks: [
          {
            t: "p",
            text: "La faille est dans la ROM du processeur : elle n'est pas corrigeable sans changer la puce. Le glitch n'est pas persistant, il faut le refaire à chaque démarrage, et il exige un accès physique. Ce n'est donc pas un vol de masse à distance, mais c'est pire sur un point : cela brise une ancre de confiance et permet de cloner l'identité d'un véhicule.",
          },
          {
            t: "note",
            text:
              "Travail de chercheurs de la TU Berlin (Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob...), présenté en 2023. L'équipe a enchaîné en 2024 avec une attaque similaire sur l'ordinateur Autopilot.",
          },
        ],
      },
    ],
    sources: [
      { label: "Hackaday : jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "Dark Reading : Tesla jailbreak unlocks paid features", url: "https://www.darkreading.com/application-security/tesla-jailbreak-unlocks-theft-in-car-paid-features" },
      { label: "Hackster : unpatchable jailbreak for cloning Teslas", url: "https://www.hackster.io/news/researchers-find-an-unpatchable-jailbreak-for-cloning-teslas-unlocking-paywalled-features-51753e53439c" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 6,
    vector: "can",
    tags: ["Vol", "Bus CAN", "Injection", "Sans authentification"],
    title: "Vol de voiture par le phare : l'injection CAN",
    dek:
      "En 2023, Ian Tabor et Ken Tindell remontent le vol de leur RAV4 jusqu'à un fil de phare. Derrière, une attaque qui ne demande ni clé ni prise OBD : parler directement au bus CAN.",
    fiche: {
      cible: "Toyota RAV4, et des dizaines de modèles (Lexus, Jeep, Nissan, VW...) visés par les mêmes boîtiers.",
      entree: "Le faisceau du phare avant, accessible en forçant le pare-chocs.",
      methode:
        "Injecter une trame CAN qui se fait passer pour la clé validée, relayée par la passerelle jusqu'au calculateur moteur.",
      faille: "Le bus CAN n'authentifie aucun message : une trame bien formée est crue sur parole.",
    },
    sections: [
      {
        id: "depart",
        heading: "Le point de départ : un phare arraché",
        blocks: [
          {
            t: "p",
            text: "La RAV4 d'Ian Tabor est vandalisée, puis volée. Avant le vol, la voiture a enregistré des codes défaut indiquant une perte de communication avec le calculateur du phare et le réseau CAN. Avec Ken Tindell, directeur technique de Canis Automotive Labs, il remonte le fil jusqu'au faisceau du phare avant.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par où ils sont entrés",
        blocks: [
          {
            t: "p",
            text: "Le phare partage le même bus CAN que le calculateur de la clé intelligente. Atteindre le connecteur du phare, c'est atteindre le bus. À partir de là, le scénario tient en quelques gestes.",
          },
          {
            t: "ol",
            items: [
              "Forcer le pare-chocs ou le phare pour exposer les fils.",
              "Brancher un injecteur sur CAN-H et CAN-L.",
              "Émettre une trame forgée qui annonce que la clé a été validée.",
              "La passerelle relaie le message vers le réseau du moteur, qu'elle croit sur parole.",
              "Le moteur démarre : la voiture part en une minute environ.",
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Ce qui a péché",
        blocks: [
          {
            t: "p",
            text: "Le bus CAN n'a aucune authentification de message : n'importe quel noeud capable de poser des bits sur le fil est cru. Une trame bien formée, même émise par un intrus, est traitée comme légitime. C'est le défaut de conception que toute la démarche exploite.",
          },
          {
            t: "note",
            text:
              "L'injecteur, caché dans un faux haut-parleur JBL vendu aux voleurs, ne contenait qu'une dizaine de dollars de composants. Le cas de la RAV4 est suivi sous la référence CVE-2023-29389.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "La leçon, et la parade",
        blocks: [
          {
            t: "p",
            text: "C'est précisément ce que vise SecOC : authentifier chaque message avec un code et un compteur de fraîcheur, pour qu'une trame forgée soit rejetée. La segmentation aide aussi, en empêchant un noeud du réseau avant d'atteindre le calculateur moteur. Deux parades directement illustrées ailleurs sur ce site.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell : CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "SecurityWeek : thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive : stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
    ],
  },
];

// Du plus recent au plus ancien.
function byDateDesc(list: Article[]): Article[] {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const overrides: Record<Exclude<Lang, "fr">, Article[] | null> = { de: articlesDe, en: articlesEn };

export function getArticles(lang: Lang): Article[] {
  const base = lang === "fr" ? fr : overrides[lang] ?? fr;
  return byDateDesc(base);
}

export function getArticle(slug: string, lang: Lang): Article | undefined {
  return getArticles(lang).find((a) => a.slug === slug) ?? fr.find((a) => a.slug === slug);
}

// Pour le garde-fou de structure (DEV) : expose les sections d'un article.
export function articleBlocks(a: Article): Block[] {
  return a.sections.flatMap((s) => s.blocks);
}

export { fr as articlesFr };
