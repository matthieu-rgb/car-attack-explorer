// Rubrique "Analyses" : decryptage des hacks auto recents.
// FR canonique inline ; de/en fournissent des tableaux miroir (repli FR).
// Convention du projet : texte translittere en ASCII (comme le reste du site).

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
    tags: ["Bluetooth", "Cle partagee", "Alarme apres-vente", "2026"],
    title: "KARR : une seule cle Bluetooth pour 2,2 millions de voitures",
    dek:
      "En 2026, des chercheurs de UC San Diego montrent qu'une alarme antivol posee en concession utilise la meme cle Bluetooth sur tous les appareils. Avec cette cle, on ouvre, on fait taire l'alarme, on bloque le demarrage.",
    fiche: {
      cible:
        "Vehicules equipes d'une alarme KARR / SWDS posee en concession (Honda, Toyota, Mazda, Ford, Jeep...), environ 2,2 millions.",
      entree: "L'interface Bluetooth de l'alarme apres-vente, pas la voiture elle-meme.",
      methode:
        "Forger les commandes radio grace a une cle d'authentification codee en dur, identique sur tous les boitiers.",
      faille: "Une seule cle cryptographique partagee par toute la flotte : la connaitre une fois suffit pour tous.",
    },
    sections: [
      {
        id: "maillon",
        heading: "Le maillon ajoute",
        blocks: [
          {
            t: "p",
            text: "L'alarme KARR n'est pas montee par le constructeur : c'est un accessoire pose en concession, souvent reconnaissable a un autocollant KARR ou SWDS sur la vitre du conducteur. Elle se pilote en Bluetooth depuis une application. C'est exactement le genre d'ajout dont personne ne verifie la securite.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par ou ils sont entres",
        blocks: [
          {
            t: "ol",
            items: [
              "Retro-ingenierie du protocole Bluetooth de l'alarme.",
              "Decouverte d'une cle d'authentification codee en dur, la meme sur tous les appareils.",
              "Avec cette cle, forger les commandes acceptees par l'alarme.",
              "Deverrouiller les portes, desactiver l'alarme, klaxonner, et bloquer le demarrage quand le vehicule est a l'arret.",
            ],
          },
          {
            t: "note",
            text:
              "Travail de UC San Diego, presente a DEF CON le 9 aout et a USENIX Security le 12 aout 2026. Un correctif firmware a ete diffuse le 20 juillet 2026 via l'application KARR ; l'editeur affirme n'avoir connaissance d'aucun abus reel.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "Ce qui a peche, la lecon",
        blocks: [
          {
            t: "p",
            text: "Coder une cle unique dans tous les boitiers, c'est transformer un secret en point de defaillance unique : une seule extraction compromet la flotte entiere. Chaque boitier aurait du avoir sa propre cle, appairee a un seul vehicule.",
          },
          {
            t: "p",
            text: "La morale est plus large : votre point faible n'est pas forcement dans la voiture. L'accessoire apres-vente, cense proteger, devient la porte d'entree. Plus on ajoute d'objets connectes autour du vehicule, plus la surface d'attaque s'etend hors de la voiture.",
          },
        ],
      },
    ],
    sources: [
      { label: "Fox News : KARR Bluetooth flaw exposes 2.2M cars", url: "https://www.foxnews.com/tech/karr-bluetooth-flaw-exposes-2-2m-cars-theft-risk" },
      { label: "Popular Science : 2 million cars at risk of Bluetooth hack", url: "https://www.popsci.com/technology/car-bluetooth-cybersecurity-hack/" },
      { label: "Malwarebytes : millions of cars could be tracked and unlocked", url: "https://www.malwarebytes.com/blog/bugs/2026/07/millions-of-cars-could-be-tracked-and-unlocked-by-a-hidden-security-flaw" },
    ],
  },

  {
    slug: "subaru-starlink",
    date: "2025-01-23",
    readMins: 6,
    vector: "api",
    tags: ["Geolocalisation", "Portail admin", "Prise de controle", "Vie privee"],
    title: "Subaru STARLINK : un an de trajets dans un panneau admin",
    dek:
      "Debut 2025, Sam Curry et Shubham Shah entrent dans le panneau d'administration STARLINK de Subaru. A la cle : localisation en direct, historique d'un an, et controle des vehicules aux Etats-Unis, au Canada et au Japon.",
    fiche: {
      cible: "Subaru connectees (STARLINK) aux Etats-Unis, au Canada et au Japon.",
      entree: "Un sous-domaine d'administration trouve par scan, puis un compte employe repris.",
      methode:
        "Reinitialiser le mot de passe d'un employe (email trouve sur LinkedIn) en contournant deux questions de securite.",
      faille: "Un panneau admin trop expose et mal protege : l'acces d'un employe donne la main sur tout.",
    },
    sections: [
      {
        id: "porte",
        heading: "Trouver la porte",
        blocks: [
          {
            t: "p",
            text: "Tout commence par un balayage de sous-domaines. Les deux chercheurs tombent sur le portail d'administration interne de STARLINK, l'outil que les employes utilisent pour gerer les comptes et les vehicules. Il n'aurait jamais du etre atteignable aussi facilement.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par ou ils sont entres",
        blocks: [
          {
            t: "ol",
            items: [
              "Trouver l'adresse email d'un employe Subaru sur LinkedIn.",
              "Declencher une reinitialisation de mot de passe sur son compte.",
              "Contourner les deux questions de securite exigees.",
              "Obtenir un acces administrateur complet au portail.",
              "Interroger n'importe quel vehicule par son VIN, lui-meme retrouvable a partir d'une plaque via les fichiers d'immatriculation.",
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
            text: "Le panneau ne se contente pas d'afficher des fiches. Depuis l'interface, ils peuvent agir sur les vehicules et consulter des donnees sensibles.",
          },
          {
            t: "ul",
            items: [
              "Demarrer, arreter, verrouiller et deverrouiller n'importe quelle Subaru connectee.",
              "Voir la position en direct.",
              "Extraire un an d'historique de localisation sur leur vehicule de test.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Ce qui a peche, la lecon",
        blocks: [
          {
            t: "p",
            text: "Deux problemes se cumulent. D'abord une surface d'administration exposee et une recuperation de compte trop faible : reset par email plus questions contournables. Ensuite, et c'est le plus durable, la retention des donnees : un an de trajets de chaque conducteur, accessibles derriere un simple mot de passe.",
          },
          {
            t: "p",
            text: "Subaru a corrige rapidement. Mais l'affaire rappelle que la voiture peut etre bien protegee pendant que le dos du decor, le portail et sa base, ne l'est pas.",
          },
        ],
      },
    ],
    sources: [
      { label: "Sam Curry : Hacking Subaru", url: "https://samcurry.net/hacking-subaru" },
      { label: "Jalopnik : hackers crack Subaru's connected services", url: "https://jalopnik.com/hackers-crack-subarus-connected-services-to-access-loca-1851746393" },
      { label: "Engadget : Subaru's poor security left vehicle data accessible", url: "https://www.engadget.com/cybersecurity/subarus-poor-security-left-troves-of-vehicle-data-easily-accessible-182514123.html" },
    ],
  },

  {
    slug: "pwn2own-automotive-2025",
    date: "2025-01-24",
    readMins: 5,
    vector: "charge",
    tags: ["Competition", "Chargeurs VE", "Infodivertissement", "0-day"],
    title: "Pwn2Own Automotive 2025 : 49 failles, et les chargeurs tombent",
    dek:
      "A Tokyo en janvier 2025, des equipes ont enchaine 49 failles inedites pour 886 250 dollars. La cible la plus prolifique : les bornes de recharge.",
    fiche: {
      cible:
        "Bornes de recharge (Tesla Wall Connector, Autel, ChargePoint...), systemes d'exploitation embarques et autoradios.",
      entree: "Les surfaces reseau et USB de materiels grand public et semi-professionnels.",
      methode: "Des chaines d'exploitation (debordements, comparaisons sans borne minimale...) jusqu'a l'execution de code.",
      faille: "Un ecosysteme large et jeune : beaucoup de code expose, encore peu durci.",
    },
    sections: [
      {
        id: "principe",
        heading: "Le principe de Pwn2Own",
        blocks: [
          {
            t: "p",
            text: "Pwn2Own est un concours organise par la Zero Day Initiative. Les equipes viennent avec des failles inedites (des 0-day) qu'elles demontrent en direct sur du vrai materiel. Elles sont payees, et en echange les fabricants recuperent les bugs pour les corriger. C'est une photographie annuelle de l'etat de la securite auto.",
          },
        ],
      },
      {
        id: "tombe",
        heading: "Ce qui est tombe",
        blocks: [
          {
            t: "p",
            text: "Les bornes de recharge ont ete la cible la plus riche de l'edition. Le Tesla Wall Connector est le premier materiel a tomber, via une comparaison de plage numerique sans borne minimale qui permet d'en prendre le controle.",
          },
          {
            t: "ul",
            items: [
              "Plus de 140 000 dollars rien que pour les failles du Tesla Wall Connector.",
              "De nombreux autoradios et systemes d'infodivertissement compromis.",
              "La recharge electrique s'impose comme la surface la plus exposee.",
            ],
          },
        ],
      },
      {
        id: "gagnants",
        heading: "Qui a gagne",
        blocks: [
          {
            t: "p",
            text: "Sina Kheirkhah, de la Summoning Team, est sacre Master of Pwn avec 222 250 dollars. Synacktiv termine deuxieme avec 147 500 dollars. Au total : 49 failles inedites et 886 250 dollars distribues. Fait notable, personne n'a tente d'attaquer une Tesla complete cette annee-la, alors que les organisateurs avaient prevu d'offrir une voiture.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "Ce que ca dit du secteur, la lecon",
        blocks: [
          {
            t: "p",
            text: "La surface d'attaque s'est deplacee vers l'exterieur de la voiture : bornes, applications, cloud. L'infrastructure de recharge, jeune et deployee vite, est la nouvelle cible molle. La tendance se confirme : un rapport PCA a recense 345 nouvelles vulnerabilites automobiles au deuxieme trimestre 2026, dont 161 jugees critiques.",
          },
        ],
      },
    ],
    sources: [
      { label: "Zero Day Initiative : Pwn2Own Automotive 2025, resultats finaux", url: "https://www.thezdi.com/blog/2025/1/23/pwn2own-automotive-2025-day-three-and-final-results" },
      { label: "BleepingComputer : 886 250 dollars pour 49 0-days", url: "https://www.bleepingcomputer.com/news/security/hackers-get-886-250-for-49-zero-days-at-pwn2own-automotive-2025/" },
      { label: "SecurityWeek : chargeurs, OS et infodivertissement", url: "https://www.securityweek.com/hackers-earn-886000-at-pwn2own-automotive-2025-for-charger-os-infotainment-exploits/" },
    ],
  },

  {
    slug: "kia-portail-plaque",
    date: "2024-09-26",
    readMins: 5,
    vector: "api",
    tags: ["Prise de controle a distance", "API", "Portail concessionnaire", "Plaque"],
    title: "Kia : prendre le controle d'une voiture avec une plaque",
    dek:
      "En 2024, l'equipe de Sam Curry controle a distance des millions de Kia a partir d'une simple plaque d'immatriculation, via le portail reserve aux concessionnaires.",
    fiche: {
      cible: "Kia connectees produites apres 2013, abonnement Kia Connect actif ou non.",
      entree: "kiaconnect.kdealer.com, le portail web des concessionnaires.",
      methode:
        "Creer un compte concessionnaire, generer un jeton, appeler les API internes, se rajouter comme proprietaire.",
      faille: "Un controle d'acces cote serveur defaillant : un compte revendeur donne la main sur n'importe quel vehicule.",
    },
    sections: [
      {
        id: "plaque",
        heading: "D'une plaque a un proprietaire",
        blocks: [
          {
            t: "p",
            text: "Le point de depart est accessible a tous : une plaque d'immatriculation. Elle mene au VIN, puis, cote serveur, aux informations du proprietaire. Aucun acces physique a la voiture n'est necessaire.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par ou ils sont entres",
        blocks: [
          {
            t: "ol",
            items: [
              "Enregistrer un compte sur le portail concessionnaire kiaconnect.kdealer.com, en reutilisant la meme requete d'inscription que les clients.",
              "Generer un jeton d'acces valide pour les API internes des concessionnaires.",
              "Recuperer les donnees du proprietaire : nom, telephone, email, adresse.",
              "Remplacer l'email du proprietaire par le sien et s'ajouter comme titulaire principal.",
              "Envoyer des commandes au vehicule.",
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
              "Verrouiller et deverrouiller, demarrer et arreter, klaxonner, localiser le vehicule.",
              "Le tout en une trentaine de secondes.",
              "Sans aucune notification au proprietaire que sa voiture avait ete accedee ou ses droits modifies.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Ce qui a peche, la lecon",
        blocks: [
          {
            t: "p",
            text: "La voiture n'a pas ete piratee : le maillon faible est le serveur web. Un controle d'acces mal cloisonne laissait un compte revendeur agir sur les vehicules de n'importe quel client. C'est l'illustration parfaite du basculement de la menace : aujourd'hui l'essentiel des attaques est mene a distance, et une large part passe par la telematique, le cloud ou les API.",
          },
          {
            t: "p",
            text: "Les failles ont ete corrigees avant publication, l'outil de demonstration n'a jamais ete diffuse, et Kia indique qu'aucune exploitation malveillante n'a eu lieu.",
          },
        ],
      },
    ],
    sources: [
      { label: "Sam Curry : Hacking Kia", url: "https://samcurry.net/hacking-kia" },
      { label: "SecurityWeek : millions of Kia cars vulnerable to remote hacking", url: "https://www.securityweek.com/millions-of-kia-cars-were-vulnerable-to-remote-hacking-researchers/" },
      { label: "BleepingComputer : Kia dealer portal flaw", url: "https://www.bleepingcomputer.com/news/security/kia-dealer-portal-flaw-could-let-attackers-hack-millions-of-cars/" },
    ],
  },

  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 6,
    vector: "hardware",
    tags: ["Materiel", "Fault injection", "Racine de confiance", "Jailbreak"],
    title: "Tesla : faire trebucher la puce pour casser la racine de confiance",
    dek:
      "En 2023, des chercheurs de la TU Berlin perturbent l'alimentation du processeur AMD d'une Tesla pour contourner son demarrage securise. De la, ils extraient des secrets et deverrouillent des options payantes.",
    fiche: {
      cible: "Tesla recentes a systeme d'infodivertissement AMD Ryzen.",
      entree: "La carte MCU : un acces physique a l'alimentation du processeur securise AMD.",
      methode: "Voltage glitching : une micro-coupure de tension au bon instant fait sauter une verification au demarrage.",
      faille: "Un demarrage securise contournable par injection de faute, dans une ROM non corrigeable.",
    },
    sections: [
      {
        id: "glitch",
        heading: "C'est quoi le voltage glitching",
        blocks: [
          {
            t: "p",
            text: "C'est une attaque par injection de faute. En provoquant une chute de tension tres breve, a l'instant precis ou le processeur execute une instruction sensible (par exemple une verification de signature), on le fait trebucher : l'instruction est sautee ou mal executee, et le controle passe quand il aurait du echouer.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par ou ils sont entres",
        blocks: [
          {
            t: "ol",
            items: [
              "Acces physique a la carte MCU du vehicule.",
              "Cibler le processeur securise AMD, la racine de confiance du systeme.",
              "Glitcher la verification du chargeur d'amorcage en ROM.",
              "Faire executer du code non signe.",
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
              "Executer leur propre logiciel : un jailbreak de l'infodivertissement.",
              "Extraire la cle RSA liee au materiel, celle qui authentifie la voiture aupres du reseau de service Tesla.",
              "Activer des options verrouillees par logiciel : sieges chauffants, boost d'acceleration.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Pourquoi c'est grave et difficile a patcher",
        blocks: [
          {
            t: "p",
            text: "La faille est dans la ROM du processeur : elle n'est pas corrigeable sans changer la puce. Le glitch n'est pas persistant, il faut le refaire a chaque demarrage, et il exige un acces physique. Ce n'est donc pas un vol de masse a distance, mais c'est pire sur un point : cela brise un ancre de confiance et permet de cloner l'identite d'un vehicule.",
          },
          {
            t: "note",
            text:
              "Travail de chercheurs de la TU Berlin (Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob...), presente en 2023. L'equipe a enchaine en 2024 avec une attaque similaire sur l'ordinateur Autopilot.",
          },
        ],
      },
    ],
    sources: [
      { label: "Hackaday : jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "Dark Reading : Tesla jailbreak unlocks paid features", url: "https://www.darkreading.com/application-security/tesla-jailbreak-unlocks-theft-in-car-paid-features" },
      { label: "Hackster : unpatchable jailbreak for cloning Teslas", url: "https://www.hackster.io/news/researchers-find-an-unpatchable-jailbreak-for-cloning-teslas-unlocking-paywalled-features-51753e53439c" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 6,
    vector: "can",
    tags: ["Vol", "Bus CAN", "Injection", "Sans authentification"],
    title: "Vol de voiture par le phare : l'injection CAN",
    dek:
      "En 2023, Ian Tabor et Ken Tindell remontent le vol de leur RAV4 jusqu'a un fil de phare. Derriere, une attaque qui ne demande ni cle ni prise OBD : parler directement au bus CAN.",
    fiche: {
      cible: "Toyota RAV4, et des dizaines de modeles (Lexus, Jeep, Nissan, VW...) vises par les memes boitiers.",
      entree: "Le faisceau du phare avant, accessible en forcant le pare-chocs.",
      methode:
        "Injecter une trame CAN qui se fait passer pour la cle validee, relayee par la passerelle jusqu'au calculateur moteur.",
      faille: "Le bus CAN n'authentifie aucun message : une trame bien formee est crue sur parole.",
    },
    sections: [
      {
        id: "depart",
        heading: "Le point de depart : un phare arrache",
        blocks: [
          {
            t: "p",
            text: "La RAV4 d'Ian Tabor est vandalisee, puis volee. Avant le vol, la voiture a enregistre des codes defaut indiquant une perte de communication avec le calculateur du phare et le reseau CAN. Avec Ken Tindell, directeur technique de Canis Automotive Labs, il remonte le fil jusqu'au faisceau du phare avant.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Par ou ils sont entres",
        blocks: [
          {
            t: "p",
            text: "Le phare partage le meme bus CAN que le calculateur de la cle intelligente. Atteindre le connecteur du phare, c'est atteindre le bus. A partir de la, le scenario tient en quelques gestes.",
          },
          {
            t: "ol",
            items: [
              "Forcer le pare-chocs ou le phare pour exposer les fils.",
              "Brancher un injecteur sur CAN-H et CAN-L.",
              "Emettre une trame forgee qui annonce que la cle a ete validee.",
              "La passerelle relaie le message vers le reseau du moteur, qu'elle croit sur parole.",
              "Le moteur demarre : la voiture part en une minute environ.",
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Ce qui a peche",
        blocks: [
          {
            t: "p",
            text: "Le bus CAN n'a aucune authentification de message : n'importe quel noeud capable de poser des bits sur le fil est cru. Une trame bien formee, meme emise par un intrus, est traitee comme legitime. C'est le defaut de conception que toute la demarche exploite.",
          },
          {
            t: "note",
            text:
              "L'injecteur, cache dans un faux haut-parleur JBL vendu aux voleurs, ne contenait qu'une dizaine de dollars de composants. Le cas de la RAV4 est suivi sous la reference CVE-2023-29389.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "La lecon, et la parade",
        blocks: [
          {
            t: "p",
            text: "C'est precisement ce que vise SecOC : authentifier chaque message avec un code et un compteur de fraicheur, pour qu'une trame forgee soit rejetee. La segmentation aide aussi, en empechant un noeud du reseau avant d'atteindre le calculateur moteur. Deux parades directement illustrees ailleurs sur ce site.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell : CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "SecurityWeek : thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive : stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
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
