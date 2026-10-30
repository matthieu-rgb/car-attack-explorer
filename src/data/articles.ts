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
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 11,
    vector: "hardware",
    tags: ["Injection de faute", "Secure boot", "Racine de confiance", "AMD", "Jailbreak"],
    title: "Tesla : un glitch de tension pour briser la racine de confiance",
    dek:
      "En 2023, quatre chercheurs de la TU Berlin font trebucher le processeur securise AMD d'une Tesla en perturbant son alimentation. Au bout : du code arbitraire sur la racine de confiance, l'extraction d'une cle d'identite, et un jailbreak que le logiciel ne peut pas corriger.",
    fiche: {
      cible: "Tesla a infodivertissement AMD Ryzen (la carte MCU dite MCU-Z), sur les Model 3, Y, S et X recentes.",
      entree: "Un acces physique a la carte MCU, precisement au rail d'alimentation du processeur securise AMD (ASP).",
      methode:
        "Voltage glitching : une micro-chute de tension calee a l'instant ou le code en ROM verifie la signature du firmware fait sauter ce controle.",
      faille: "Une racine de confiance en ROM masquee, sans protection contre l'injection de faute : rien a corriger sur le terrain.",
    },
    sections: [
      {
        id: "contexte",
        heading: "La racine de confiance d'une Tesla",
        blocks: [
          {
            t: "p",
            text: "L'infodivertissement d'une Tesla recente tourne sur un processeur AMD Ryzen x86. Tout son demarrage est verrouille par un composant a part, le processeur securise AMD (ASP, aussi appele PSP) : c'est lui qui, a la mise sous tension, verifie la signature de chaque etage logiciel avant de le lancer. Cette chaine est la racine de confiance du systeme. Elle garde trois choses : l'activation des options payantes, la cle qui prouve l'identite de la voiture aupres du reseau de service Tesla, et le chiffrement des donnees utilisateur.",
          },
          {
            t: "p",
            text: "Casser ce maillon, c'est tout obtenir d'un coup. C'est exactement ce qu'a fait une equipe de la TU Berlin, presentee a Black Hat USA 2023 puis au 37C3.",
          },
          {
            t: "note",
            text:
              "Travail de Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob et Oleg Drokin (TU Berlin). Hans Niklas Jacob est aussi coauteur du glitch AMD anterieur sur lequel l'attaque s'appuie.",
          },
        ],
      },
      {
        id: "glitch",
        heading: "Le voltage glitching, explique",
        blocks: [
          {
            t: "p",
            text: "Un processeur suppose une alimentation stable. Si on la fait chuter tres brievement, de quelques dizaines de nanosecondes, au moment precis ou il execute une instruction sensible, il trebuche : l'instruction est sautee ou mal executee. Appliquee pile sur la comparaison qui valide une signature, cette faute transforme un echec en succes. Le code non signe passe comme s'il etait legitime.",
          },
          {
            t: "p",
            text: "Toute la difficulte est dans le timing. Il faut repérer la fenetre de quelques instants ou la verification a lieu, declencher la coupure a cet instant, et recommencer jusqu'a ce que ca tombe juste. C'est long a caler, mais une fois la fenetre connue, l'attaque est reproductible.",
          },
          {
            t: "note",
            text:
              "Le glitch n'est pas persistant : il faut le rejouer a chaque demarrage pour franchir la verification. Ce qui est pose ensuite dans le systeme, lui, peut etre rendu permanent.",
          },
        ],
      },
      {
        id: "chaine",
        heading: "La chaine d'exploitation, pas a pas",
        blocks: [
          {
            t: "ol",
            items: [
              "Demonter la carte MCU et reperer le rail qui alimente le coeur du processeur securise AMD (pilote par un regulateur de tension programmable).",
              "Monter un petit circuit de glitch sur ce rail, capable de provoquer une chute de tension tres courte sur commande.",
              "Reutiliser le glitch AMD deja connu et documente, qui vise la verification de signature du code d'amorcage en ROM.",
              "Declencher la coupure a l'instant exact ou la ROM verifie l'etage suivant, et repeter jusqu'a ce que la verification soit contournee.",
              "Faire executer du code non signe sur le processeur securise : la racine de confiance est desormais sous controle.",
              "De la, dechiffrer le firmware, patcher le systeme Linux pour un acces root persistant, et extraire la cle RSA liee au materiel.",
            ],
          },
          {
            t: "frame",
            caption: "La chaine de demarrage et le point d'injection (schema pedagogique).",
            lines: [
              { text: "ROM masquee (ASP)  --verifie la signature-->  bootloader PSP", mark: "ok" },
              { text: "         ^ glitch ici : la verification est sautee", mark: "hl" },
              { text: "bootloader PSP  -->  ABL  -->  UEFI  -->  noyau Linux", mark: "ok" },
              { text: "code non signe accepte : racine de confiance compromise", mark: "hl" },
            ],
          },
        ],
      },
      {
        id: "butin",
        heading: "Ce que le glitch debloque",
        blocks: [
          {
            t: "table",
            caption: "Une seule faute ouvre quatre portes.",
            head: ["Capacite obtenue", "Ce que ca donne concretement"],
            rows: [
              ["Jailbreak persistant", "Un acces root sur le Linux de l'infodivertissement, qui survit aux redemarrages et aux mises a jour."],
              ["Extraction de la cle d'attestation", "La cle RSA liee au materiel qui authentifie la voiture aupres du reseau Tesla : de quoi migrer, voire cloner, l'identite d'un vehicule."],
              ["Options payantes", "Sieges chauffants, boost d'acceleration, et selon les regions d'autres fonctions verrouillees par logiciel, activees sans payer."],
              ["Donnees utilisateur", "Le dechiffrement des donnees personnelles stockees et chiffrees par le systeme."],
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "L'outillage",
        blocks: [
          {
            t: "deflist",
            items: [
              { term: "Circuit de glitch (environ 100 $)", def: "Une petite carte qui provoque la chute de tension sur commande. C'est le coeur de l'attaque, et ca ne coute presque rien." },
              { term: "Oscilloscope / analyseur logique", def: "Pour observer le demarrage et trouver la fenetre temporelle ou la verification a lieu." },
              { term: "Fer a souder et acces physique", def: "Il faut ouvrir la carte MCU et se brancher sur le bon rail d'alimentation." },
              { term: "Art anterieur", def: "Le glitch AMD de 'One Glitch to Rule Them All' (2021), puis le suivi de l'equipe en 2024, 'Three Glitches to Rule One Car', sur l'ordinateur d'assistance a la conduite." },
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Ce qui a peche",
        blocks: [
          {
            t: "ul",
            items: [
              "La racine de confiance suppose que la ROM applique toujours sa verification. L'injection de faute brise cette hypothese : on n'attaque pas la cryptographie, on empeche le processeur de la verifier.",
              "Le code d'amorcage vit dans une ROM masquee, gravee dans le silicium : il n'est pas corrigeable par mise a jour.",
              "La puce ne detecte pas les anomalies d'alimentation (pas de detecteur de glitch, pas de double verification) : une faute unique suffit.",
            ],
          },
        ],
      },
      {
        id: "portee",
        heading: "Portee et limites",
        blocks: [
          {
            t: "p",
            text: "Ce n'est pas un vol de masse a distance : il faut un acces physique, du materiel, et du temps de mise au point par exemplaire. Mais sur un point c'est pire qu'un vol : l'attaque brise une ancre de confiance materielle et permet de cloner l'identite d'un vehicule. Et comme la faille est dans le silicium, elle ne se corrige pas par logiciel ; la seule vraie parade est une puce resistante a l'injection de faute. AMD equipant d'autres constructeurs, la classe de probleme depasse Tesla.",
          },
          {
            t: "note",
            text:
              "En 2024, la meme equipe a enchaine avec 'Three Glitches to Rule One Car', en portant l'approche sur l'ordinateur d'assistance a la conduite.",
          },
        ],
      },
    ],
    sources: [
      { label: "Christian Werling (TU Berlin) : page de recherche et publications", url: "https://www.user.tu-berlin.de/cwerling/" },
      { label: "Mayhem Security : Jailbreaking Teslas at Black Hat USA 2023", url: "https://www.mayhem.security/blog/jailbreaking-teslas-at-black-hat-usa-2023" },
      { label: "Hackaday : jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "One Glitch to Rule Them All : fault injection contre l'ASP AMD (arXiv)", url: "https://arxiv.org/abs/2108.04575" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 11,
    vector: "can",
    tags: ["Bus CAN", "Injection de trame", "Vol sans cle", "Passerelle", "SecOC"],
    title: "Vol par le phare : l'anatomie d'une injection CAN",
    dek:
      "En 2023, Ian Tabor et Ken Tindell remontent le vol de leur RAV4 jusqu'a un fil de phare. Derriere, une attaque qui ne demande ni cle ni prise OBD : forcer le bus CAN a croire une trame forgee. On decortique le mecanisme, l'outillage et les parades.",
    fiche: {
      cible: "Toyota RAV4, et des dizaines de modeles (Lexus, Jeep, Nissan, VW, Maserati...) vises par les memes boitiers.",
      entree: "Le faisceau du phare avant, un point du bus CAN de controle accessible en forcant le pare-chocs.",
      methode:
        "Un boitier injecte en boucle une trame qui usurpe le recepteur de la cle intelligente, relayee sans controle par la passerelle jusqu'au calculateur moteur.",
      faille: "Le CAN n'authentifie aucun message et la passerelle relaie entre domaines sans verifier : une trame bien formee est crue sur parole.",
    },
    sections: [
      {
        id: "contexte",
        heading: "Le vol qui a tout documente",
        blocks: [
          {
            t: "p",
            text: "La RAV4 d'Ian Tabor est d'abord vandalisee (pare-chocs arrache, connecteur de phare debranche), puis volee quelques jours plus tard. Avant le vol, la voiture a enregistre des codes defaut signalant une perte de communication avec le calculateur du phare et avec le reseau CAN. Avec Ken Tindell, directeur technique de Canis Automotive Labs, Tabor remonte le fil jusqu'au faisceau du phare avant, et met au jour une methode devenue une petite industrie.",
          },
          {
            t: "note",
            text:
              "L'injecteur etait vendu cle en main aux voleurs, cache dans un faux haut-parleur Bluetooth : une dizaine de dollars de composants pour voler une voiture en une minute.",
          },
        ],
      },
      {
        id: "architecture",
        heading: "La cible : un bus bavard, zero authentification",
        blocks: [
          {
            t: "p",
            text: "Une voiture n'a pas un seul bus CAN mais plusieurs, relies par une passerelle centrale. Sur le bus de controle circulent les messages du recepteur de la cle intelligente. Le phare avant est branche sur ce meme bus : atteindre son connecteur, c'est atteindre le bus qui porte l'autorisation de demarrer. Le probleme de fond : sur un CAN, aucun message n'est signe, et la passerelle recopie certaines trames d'un bus a l'autre sans les verifier.",
          },
          {
            t: "duo",
            aTitle: "Ce que le reseau suppose",
            a: [
              "Seuls des calculateurs d'origine parlent sur le bus.",
              "Une trame bien formee vient forcement d'un noeud legitime.",
              "La passerelle relaie ce qui est utile entre domaines.",
            ],
            bTitle: "Ce que l'attaquant exploite",
            b: [
              "N'importe quel noeud pose sur le fil peut emettre.",
              "Rien ne distingue une trame forgee d'une vraie.",
              "La passerelle relaie donc aussi la trame forgee.",
            ],
          },
        ],
      },
      {
        id: "injection",
        heading: "L'injection CAN, le vrai tour de force",
        blocks: [
          {
            t: "p",
            text: "Le point subtil : le vrai calculateur de la cle continue d'emettre, lui, son message legitime ('pas de cle presente'). Il ne suffit donc pas d'ajouter une trame, il faut imposer la sienne. Le CAN arbitre bit a bit : un bit dominant (0) ecrase un bit recessif (1), et l'identifiant le plus bas gagne. Le boitier exploite ce mecanisme et ajoute un circuit qui force le comportement du transceiver, de facon a placer ses bits et a pousser le noeud legitime en erreur. Resultat : c'est la trame forgee que la passerelle et le moteur voient.",
          },
          {
            t: "note",
            text:
              "C'est ce qui distingue l'injection CAN d'un simple rejeu : l'attaquant gagne l'arbitrage et neutralise la source authentique, au lieu d'ajouter du bruit par-dessus.",
          },
        ],
      },
      {
        id: "chaine",
        heading: "La chaine d'exploitation, pas a pas",
        blocks: [
          {
            t: "ol",
            items: [
              "Forcer le pare-chocs ou le phare pour exposer les fils du faisceau.",
              "Se brancher sur les deux fils du bus, CAN-H et CAN-L.",
              "Attendre une trame de reveil du reseau, signe que le bus ecoute.",
              "Emettre une rafale (environ vingt fois par seconde) usurpant le recepteur de la cle : le message 'cle validee'.",
              "L'immobiliseur, croyant la cle presente, se desactive.",
              "La passerelle relaie la trame vers le reseau du moteur, sans la verifier.",
              "Un second message commande au calculateur d'habitacle de deverrouiller les portes.",
              "Le voleur monte et demarre : la voiture part en une minute environ, sans la cle.",
            ],
          },
          {
            t: "frame",
            caption: "Illustration pedagogique : la rafale forgee (hl) au milieu du trafic normal. Identifiants fictifs.",
            lines: [
              { text: "0x120  moteur        regime 820 tr/min        trame normale", mark: "ok" },
              { text: "0x043  recepteur cle  'pas de cle presente'    trame normale", mark: "ok" },
              { text: "0x043  INJECTE       'cle validee'  x20 / s     rafale forgee", mark: "hl" },
              { text: "passerelle  relaie 0x043 vers le reseau moteur, sans controle", mark: "hl" },
              { text: "immobiliseur desactive, moteur autorise a demarrer", mark: "ok" },
            ],
          },
        ],
      },
      {
        id: "banc",
        heading: "Comment on l'observe et on le rejoue sur un banc",
        blocks: [
          {
            t: "p",
            text: "On n'a pas besoin d'une vraie voiture pour comprendre la methode. Sur un bus virtuel ou un banc a deux calculateurs, la demarche est toujours la meme : provoquer une action, observer la trame qui change, puis la rejouer. C'est exactement ce que propose l'Atelier de ce site. Les commandes ci-dessous travaillent sur une interface de test (vcan0), jamais sur un vehicule.",
          },
          {
            t: "code",
            caption: "Observer, isoler, rejouer (sur banc de test).",
            lines: [
              "# ecouter tout le trafic du bus de test",
              "candump vcan0",
              "",
              "# reperer la trame qui bouge quand on agit (diff avant / apres)",
              "cansniffer vcan0",
              "",
              "# rejouer une trame reperee (identifiant#donnees, valeurs d'exemple)",
              "cansend vcan0 043#01",
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "L'outillage, des deux cotes",
        blocks: [
          {
            t: "table",
            caption: "Le boitier du voleur coute une dizaine de dollars ; l'analyse se fait avec des outils publics.",
            head: ["Element", "Camp", "A quoi ca sert"],
            rows: [
              ["Microcontroleur PIC18F avec CAN", "Voleur", "Genere et cadence les trames forgees ; firmware verrouille."],
              ["Transceiver CAN + circuit d'override", "Voleur", "Pose les bits sur le fil et force l'arbitrage contre le noeud legitime."],
              ["Faux haut-parleur Bluetooth", "Voleur", "Boitier et batterie : camoufle l'injecteur et l'alimente."],
              ["Interface CAN (CANable, CANtact...)", "Analyste", "Brancher un PC sur le bus pour lire et emettre."],
              ["can-utils (candump, cansniffer, cansend)", "Analyste", "Capturer, filtrer et rejouer les trames."],
              ["SavvyCAN", "Analyste", "Visualiser et comparer les captures, retrouver le signal utile."],
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Ce qui a peche",
        blocks: [
          {
            t: "ul",
            items: [
              "Le CAN n'authentifie aucun message : un noeud capable de poser des bits est cru sur parole.",
              "La passerelle recopie des trames entre domaines sans verifier leur origine.",
              "L'immobiliseur fonde une decision de securite sur une simple assertion du bus.",
              "Un peripherique non critique (le phare) donne acces a un bus critique.",
            ],
          },
        ],
      },
      {
        id: "parade",
        heading: "La parade, et ou la tester ici",
        blocks: [
          {
            t: "p",
            text: "La reponse de fond est l'authentification des messages. C'est l'objet de SecOC : chaque trame porte un code d'authentification et un compteur de fraicheur, si bien qu'une trame forgee ou rejouee est rejetee. Canis Labs pousse la meme idee avec CryptoCAN. La segmentation aide en complement, en empechant qu'un noeud du reseau avant parle directement au calculateur moteur. Enfin, une detection d'intrusion peut reperer les erreurs de bus caracteristiques de l'injection.",
          },
          {
            t: "p",
            text: "Ces deux parades, SecOC et segmentation, sont des interrupteurs que vous pouvez activer sur l'Explorateur pour voir le chemin d'attaque se faire bloquer. Et la methode provoquer, observer, rejouer se manipule dans l'Atelier, sur bus virtuel.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell : CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "SecurityWeek : thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive : stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
      { label: "NVD : CVE-2023-29389", url: "https://nvd.nist.gov/vuln/detail/CVE-2023-29389" },
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
