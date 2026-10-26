// Page "Reverse engineering d'une trame" : deux ateliers (decortiquer / forger)
// + la methode. Valeurs techniques (identifiants, octets, cadences) universelles
// et partagees ; seul le texte est traduit (de/en en repli FR).

import type { Lang } from "../i18n";
import { reverseDe } from "./content/reverse.de";
import { reverseEn } from "./content/reverse.en";

// --- donnees universelles (non traduites) ---

export interface SnifferRow {
  id: string;
  bytes: string[];
  noise: boolean; // true = trafic de fond qui scintille
}

export const snifferRows: SnifferRow[] = [
  { id: "095", bytes: ["12", "04", "00", "7A", "00", "10", "00", "00"], noise: true },
  { id: "133", bytes: ["00", "88", "01", "00", "FF", "00", "20", "00"], noise: true },
  { id: "188", bytes: ["00", "00", "00", "00", "00", "00", "00", "00"], noise: false },
  { id: "19B", bytes: ["00", "00", "0F", "00", "00", "00", "00", "00"], noise: false },
  { id: "1A0", bytes: ["A0", "00", "3C", "00", "00", "91", "00", "0B"], noise: true },
  { id: "244", bytes: ["00", "00", "00", "18", "9C", "00", "00", "00"], noise: false },
  { id: "2C1", bytes: ["00", "40", "00", "00", "08", "00", "D5", "00"], noise: true },
  { id: "3D2", bytes: ["7F", "00", "00", "22", "00", "00", "00", "61"], noise: true },
];

export interface SnifferAction {
  key: string;
  targetId: string;
  targetBytes: number[];
  toVals: string[];
}

export const snifferActions: SnifferAction[] = [
  { key: "turn", targetId: "188", targetBytes: [0], toVals: ["01"] },
  { key: "unlock", targetId: "19B", targetBytes: [2], toVals: ["00"] },
  { key: "accel", targetId: "244", targetBytes: [3, 4], toVals: ["2E", "E0"] },
];

export const inject = { legit: 63, forged: 0, unit: "km/h" };

// --- contenu traduisible ---

export interface Cmd {
  caption: string;
  lines: string[];
}

export interface ReverseContent {
  title: string;
  lede: string;

  s1Title: string;
  s1Intro: string[];
  snifferTitle: string;
  snifferHint: string;
  snifferDiffLabel: string;
  snifferActionLabels: Record<string, string>; // key -> libelle du bouton
  snifferNotes: Record<string, string>; // key -> phrase "ce qui a change"
  snifferIdle: string;
  s1Steps: string[];
  s1Cmd: Cmd;
  s1Close: string;
  ctaDecode: string;

  s2Title: string;
  s2Intro: string[];
  injectTitle: string;
  injectHint: string;
  injectCadence: string;
  injectReadout: string;
  injectSecoc: string;
  injectSecocMsg: string;
  injectNote: string;
  s2Cmd: Cmd;
  s2Steps: string[];
  s2Def: string;
  ctaAttacks: string;
}

const fr: ReverseContent = {
  title: "Decortiquer et forger une trame",
  lede:
    "Le vrai travail : partir d'un bus illisible, trouver l'octet qui pilote une fonction, puis fabriquer la trame qui la commande. Deux ateliers pour voir la methode a l'oeuvre.",

  s1Title: "Decortiquer : trouver le bon octet",
  s1Intro: [
    "Branche sur le bus, on voit des milliers de trames par seconde, toutes anonymes. Aucune ne dit « je suis la vitesse ». La methode est celle d'un detective : provoquer une action connue, et regarder ce qui change.",
    "C'est tout l'interet de cansniffer : il regroupe les trames par identifiant et met en evidence les octets qui bougent. On fige l'etat au repos, on agit sur la voiture, on compare avant et apres.",
  ],
  snifferTitle: "Reperez l'octet qui reagit",
  snifferHint: "Declenchez une action et observez quelle trame change. Activez « isoler » pour masquer le trafic de fond.",
  snifferDiffLabel: "Isoler le changement",
  snifferActionLabels: {
    turn: "Clignotant gauche",
    unlock: "Deverrouiller les portes",
    accel: "Accelerer",
  },
  snifferNotes: {
    turn: "0x188 — octet 0 : 0x00 → 0x01. Le bit 0 commande le clignotant gauche.",
    unlock: "0x19B — octet 2 : 0x0F → 0x00. Les quatre serrures s'ouvrent d'un coup.",
    accel: "0x244 — octets 3-4 : 0x189C → 0x2EE0. La vitesse grimpe a 120 km/h.",
  },
  snifferIdle: "Au repos, tout defile. Declenchez une action pour voir quelle trame y repond.",
  s1Steps: [
    "Capturer le trafic au repos : candump -l vcan0 enregistre tout dans un fichier.",
    "Provoquer une action unique et repetee : verrouiller, clignoter, accelerer.",
    "Comparer avant / apres : l'identifiant et l'octet qui changent trahissent la fonction.",
    "Reduire : filtrer cet identifiant, isoler l'octet, puis le bit ou la plage utile.",
    "Deduire l'echelle : faire varier la grandeur reelle et noter la relation (facteur, offset, ordre des octets).",
  ],
  s1Cmd: {
    caption: "Capturer puis observer",
    lines: [
      "candump -l vcan0            # enregistre dans candump-*.log",
      "cansniffer -c vcan0         # vue groupee, octets changeants en couleur",
    ],
  },
  s1Close:
    "Une fois l'identifiant, l'octet et l'echelle connus, vous tenez le mapping — exactement ce que l'outil Decodeur manipule.",
  ctaDecode: "Decoder un signal",

  s2Title: "Forger : fabriquer et injecter",
  s2Intro: [
    "Connaitre le mapping ne suffit pas : il faut ecrire la trame et l'envoyer. Forger, c'est construire un identifiant et des octets, puis les emettre sur le bus.",
    "Le piege : le vrai calculateur n'a pas disparu. Il continue d'emettre la bonne valeur. Votre trame et la sienne se disputent le combine — celui qui emet le plus souvent gagne. Une seule trame ne fait qu'un clignotement.",
  ],
  injectTitle: "La course a l'injection",
  injectHint: "Montez la cadence d'injection et regardez le compteur basculer. Activez SecOC pour voir la defense.",
  injectCadence: "Cadence d'injection",
  injectReadout: "Le combine affiche",
  injectSecoc: "SecOC",
  injectSecocMsg: "Trame forgee rejetee : code d'authentification invalide.",
  injectNote:
    "A faible cadence, la vraie valeur reprend le dessus : il faut emettre plus vite que le calculateur. SecOC rejette les trames sans code valide, et l'usurpation tombe.",
  s2Cmd: {
    caption: "Forger et rejouer",
    lines: [
      "cansend vcan0 244#000000002EE00000          # une trame : 120 km/h",
      "while true; do cansend vcan0 244#000000002EE00000; done   # marteler pour gagner",
      "canplayer -I candump-xxx.log                # rejouer une capture a l'identique",
    ],
  },
  s2Steps: [
    "Construire la trame : identifiant#donnees en hexa, avec cansend.",
    "Emettre en boucle, plus vite que le calculateur legitime, pour gagner l'arbitrage.",
    "Ou rejouer une capture : meme sans comprendre les octets, un rejeu suffit souvent.",
  ],
  s2Def:
    "C'est la que SecOC change tout : chaque trame porte un code d'authentification et un compteur de fraicheur. Une trame forgee ou rejouee n'a pas le bon code, le recepteur l'ignore. La segmentation par la passerelle empeche, elle, d'atteindre le domaine critique depuis une entree exposee.",
  ctaAttacks: "Voir les attaques",
};

const overrides: Record<Exclude<Lang, "fr">, ReverseContent | null> = { de: reverseDe, en: reverseEn };

export function getReverse(lang: Lang): ReverseContent {
  if (lang === "fr") return fr;
  return overrides[lang] ?? fr;
}

export { fr as reverseFr };
