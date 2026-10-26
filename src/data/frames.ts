// Donnees de l'atelier "Decodeur de trame". Les valeurs hexa sont universelles ;
// seuls les textes (nom, note, titre, contexte, effet) se traduisent, via des
// surcharges par id (de/en). Identifiants et octets sont des EXEMPLES
// pedagogiques, pas les valeurs d'un constructeur reel.

import type { Lang } from "../i18n";
import { framesText as framesDe } from "./content/frames.de";
import { framesText as framesEn } from "./content/frames.en";

export interface Recipe {
  id: string;
  name: string;
  canId: string; // hexa, 11 bits, ex "0C4"
  bytes: string[]; // octets hexa, ex ["3F","00",...]
  note: string;
}

export interface FrameSnapshot {
  canId: string;
  bytes: string[];
}

export interface Example {
  id: string;
  title: string;
  context: string;
  legit: FrameSnapshot;
  forged: FrameSnapshot;
  changed: number[]; // indices d'octets modifies ; -1 = l'identifiant a change
  effect: string;
}

export interface FramesOverride {
  recipes?: Record<string, { name?: string; note?: string }>;
  examples?: Record<string, { title?: string; context?: string; effect?: string }>;
}

const recipes: Recipe[] = [
  {
    id: "speed",
    name: "Vitesse vehicule",
    canId: "0C4",
    bytes: ["3F", "00", "00", "00", "00", "00", "00", "00"],
    note: "Octet 0 = vitesse en km/h. 0x3F vaut 63. Montez-le a 0xFF et le compteur afficherait 255 km/h.",
  },
  {
    id: "rpm",
    name: "Regime moteur",
    canId: "0C8",
    bytes: ["1B", "58", "00", "00", "00", "00", "00", "00"],
    note: "Octets 0-1 = regime (0x1B58 = 7000). Le combine enverrait l'aiguille dans la zone rouge.",
  },
  {
    id: "blink",
    name: "Clignotants",
    canId: "188",
    bytes: ["00", "00", "00", "00", "00", "00", "00", "00"],
    note: "Octet 3 : 0x01 clignotant gauche, 0x02 droit. Mettez 0x03 pour allumer les deux (feux de detresse).",
  },
  {
    id: "lock",
    name: "Verrouillage portes",
    canId: "19B",
    bytes: ["00", "00", "01", "00", "00", "00", "00", "00"],
    note: "Octet 2 : 0x01 verrouille, 0x02 deverrouille. Rejouer la trame de deverrouillage ouvre les portes.",
  },
];

const examples: Example[] = [
  {
    id: "speed-spoof",
    title: "Usurpation de la vitesse",
    context: "Un calculateur injecte une fausse vitesse pendant que le vehicule roule.",
    legit: { canId: "0C4", bytes: ["3F", "00", "00", "00", "00", "00", "00", "00"] },
    forged: { canId: "0C4", bytes: ["00", "00", "00", "00", "00", "00", "00", "00"] },
    changed: [0],
    effect: "Le combine affiche 0 km/h alors que la voiture roule. Les fonctions qui dependent de la vitesse (verrouillage automatique, aides a la conduite) sont trompees.",
  },
  {
    id: "replay-unlock",
    title: "Rejeu du deverrouillage",
    context: "Une trame de deverrouillage capturee est renvoyee telle quelle.",
    legit: { canId: "19B", bytes: ["00", "00", "02", "00", "00", "00", "00", "00"] },
    forged: { canId: "19B", bytes: ["00", "00", "02", "00", "00", "00", "00", "00"] },
    changed: [],
    effect: "Aucun octet ne change, et c'est justement le probleme : le calculateur ne distingue pas un rejeu d'une commande legitime. Les portes s'ouvrent.",
  },
  {
    id: "blink-inject",
    title: "Injection : feux de detresse",
    context: "Une trame forgee allume les deux clignotants a la fois.",
    legit: { canId: "188", bytes: ["00", "00", "00", "00", "00", "00", "00", "00"] },
    forged: { canId: "188", bytes: ["00", "00", "00", "03", "00", "00", "00", "00"] },
    changed: [3],
    effect: "L'octet 3 passe a 0x03 : les deux clignotants s'allument. Une trame suffit a declencher un comportement visible.",
  },
  {
    id: "dos",
    title: "Deni de service par priorite",
    context: "Un noeud emet sans cesse l'identifiant le plus prioritaire.",
    legit: { canId: "0C4", bytes: ["3F", "00", "00", "00", "00", "00", "00", "00"] },
    forged: { canId: "000", bytes: ["00", "00", "00", "00", "00", "00", "00", "00"] },
    changed: [-1],
    effect: "En monopolisant l'arbitrage avec l'identifiant 0, l'attaquant empeche toute autre trame de passer. Le reseau se fige : aucune contre-mesure logicielle ne l'empeche vraiment.",
  },
];

const recipeOverrides: Record<Exclude<Lang, "fr">, FramesOverride> = { de: framesDe, en: framesEn };

export function getRecipes(lang: Lang): Recipe[] {
  if (lang === "fr") return recipes;
  const ov = recipeOverrides[lang]?.recipes;
  if (!ov) return recipes;
  return recipes.map((r) => ({ ...r, name: ov[r.id]?.name ?? r.name, note: ov[r.id]?.note ?? r.note }));
}

export function getExamples(lang: Lang): Example[] {
  if (lang === "fr") return examples;
  const ov = recipeOverrides[lang]?.examples;
  if (!ov) return examples;
  return examples.map((e) => ({
    ...e,
    title: ov[e.id]?.title ?? e.title,
    context: ov[e.id]?.context ?? e.context,
    effect: ov[e.id]?.effect ?? e.effect,
  }));
}
