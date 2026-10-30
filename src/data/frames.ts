// Donnees du bac a sable "Decodeur de trame". On part d'un SIGNAL (vitesse,
// clignotants, portes...), pas d'octets bruts : chaque signal dit quel(s)
// octet(s) il occupe, comment on l'interprete (entier mis a l'echelle ou
// drapeaux de bits) et quel retour visuel il pilote.
//
// Mappings vitesse / clignotants / portes = valeurs reelles du simulateur
// ICSim (OpenGarages). Regime / temperature / carburant = exemples generiques
// facon OBD-II, etiquetes comme tels. Les identifiants et octets restent des
// exemples pedagogiques, pas les valeurs d'un constructeur reel.

import type { Lang } from "../i18n";
import { framesText as framesDe } from "./content/frames.de";
import { framesText as framesEn } from "./content/frames.en";

export type SignalSource = "icsim" | "obd";
export type SignalKind = "scalar" | "flags";
export type Visual = "gauge" | "blink" | "lock";

export interface GaugeSpec {
  min: number;
  max: number;
  unit: string;
  redline?: number;
}

export interface BitDef {
  pos: number;
  label: string;
}

export interface Signal {
  id: string;
  name: string;
  help: string;
  source: SignalSource;
  canId: string; // hexa, 11 bits
  kind: SignalKind;
  visual: Visual;
  // scalaire :
  byteOrder?: number[]; // indices d'octets, du poids fort au poids faible (big-endian natif)
  biEndian?: boolean; // propose la bascule d'ordre des octets (16 bits)
  factor?: number;
  offset?: number;
  gauge?: GaugeSpec;
  defaultValue?: number; // valeur physique initiale
  // drapeaux :
  byteIndex?: number;
  bits?: BitDef[];
  defaultBits?: number; // valeur initiale de l'octet de drapeaux
}

export interface Example {
  id: string;
  title: string;
  context: string;
  legit: { canId: string; bytes: string[] };
  forged: { canId: string; bytes: string[] };
  changed: number[]; // indices d'octets modifies ; -1 = identifiant change
  effect: string;
}

export interface FramesOverride {
  signals?: Record<string, { name?: string; help?: string; unit?: string; bits?: string[] }>;
  examples?: Record<string, { title?: string; context?: string; effect?: string }>;
}

const signals: Signal[] = [
  {
    id: "speed",
    name: "Vitesse véhicule",
    help: "La vitesse tient sur deux octets (3 et 4), rangés poids fort d'abord. Le combiné affiche directement cette valeur : qui réécrit ces octets fait mentir le compteur.",
    source: "icsim",
    canId: "244",
    kind: "scalar",
    visual: "gauge",
    byteOrder: [3, 4],
    biEndian: true,
    factor: 0.01,
    offset: 0,
    gauge: { min: 0, max: 260, unit: "km/h", redline: 200 },
    defaultValue: 63,
  },
  {
    id: "rpm",
    name: "Régime moteur",
    help: "Deux octets forment le régime, mais il faut diviser par quatre : les octets ne sont pas le nombre de tours. Au-delà de 7000, l'aiguille entre dans le rouge.",
    source: "obd",
    canId: "0C8",
    kind: "scalar",
    visual: "gauge",
    byteOrder: [0, 1],
    biEndian: true,
    factor: 0.25,
    offset: 0,
    gauge: { min: 0, max: 8000, unit: "tr/min", redline: 7000 },
    defaultValue: 2200,
  },
  {
    id: "turn",
    name: "Clignotants",
    help: "Ici un octet sert de jeu d'interrupteurs : bit 0 à gauche, bit 1 à droite. Les deux ensemble donnent les feux de détresse. Une seule trame forgée suffit à allumer.",
    source: "icsim",
    canId: "188",
    kind: "flags",
    visual: "blink",
    byteIndex: 0,
    bits: [
      { pos: 0, label: "Gauche" },
      { pos: 1, label: "Droite" },
    ],
    defaultBits: 0,
  },
  {
    id: "doors",
    name: "Verrouillage portes",
    help: "Quatre serrures dans un seul octet, un bit par porte, le bit à 1 signifiant verrouillée. Rejouer la trame de déverrouillage ouvre le véhicule sans aucune clé.",
    source: "icsim",
    canId: "19B",
    kind: "flags",
    visual: "lock",
    byteIndex: 2,
    bits: [
      { pos: 0, label: "Avant gauche" },
      { pos: 1, label: "Avant droite" },
      { pos: 2, label: "Arrière gauche" },
      { pos: 3, label: "Arrière droite" },
    ],
    defaultBits: 0x0f,
  },
  {
    id: "temp",
    name: "Température moteur",
    help: "Un seul octet, mais avec un décalage de -40 : la valeur affichée vaut l'octet moins 40, ce qui permet de coder des températures négatives. Fausser cette valeur peut masquer une surchauffe.",
    source: "obd",
    canId: "3E9",
    kind: "scalar",
    visual: "gauge",
    byteOrder: [1],
    factor: 1,
    offset: -40,
    gauge: { min: -40, max: 160, unit: "°C", redline: 115 },
    defaultValue: 90,
  },
  {
    id: "fuel",
    name: "Niveau de carburant",
    help: "Un octet de 0 à 255 remis à l'échelle de 0 à 100 %. Usurper cette jauge trompe directement le conducteur sans toucher au moteur.",
    source: "obd",
    canId: "3B1",
    kind: "scalar",
    visual: "gauge",
    byteOrder: [0],
    factor: 100 / 255,
    offset: 0,
    gauge: { min: 0, max: 100, unit: "%" },
    defaultValue: 55,
  },
];

const examples: Example[] = [
  {
    id: "speed-spoof",
    title: "Usurpation de la vitesse",
    context: "Un calculateur injecte une fausse vitesse pendant que le véhicule roule.",
    legit: { canId: "244", bytes: ["00", "00", "00", "18", "9C", "00", "00", "00"] },
    forged: { canId: "244", bytes: ["00", "00", "00", "00", "00", "00", "00", "00"] },
    changed: [3, 4],
    effect: "Les octets 3-4 passent de 0x189C (63 km/h) à zéro. Le combiné affiche 0 km/h alors que la voiture roule, et les fonctions qui dépendent de la vitesse sont trompées.",
  },
  {
    id: "replay-unlock",
    title: "Rejeu du déverrouillage",
    context: "La trame de déverrouillage des portes, capturée, est renvoyée telle quelle.",
    legit: { canId: "19B", bytes: ["00", "00", "0F", "00", "00", "00", "00", "00"] },
    forged: { canId: "19B", bytes: ["00", "00", "00", "00", "00", "00", "00", "00"] },
    changed: [2],
    effect: "L'octet 2 passe de 0x0F (quatre portes verrouillées) à 0x00. Le calculateur ne distingue pas un rejeu d'une commande légitime : les portes s'ouvrent.",
  },
  {
    id: "hazard",
    title: "Injection : feux de détresse",
    context: "Une trame forgée allume les deux clignotants à la fois.",
    legit: { canId: "188", bytes: ["00", "00", "00", "00", "00", "00", "00", "00"] },
    forged: { canId: "188", bytes: ["03", "00", "00", "00", "00", "00", "00", "00"] },
    changed: [0],
    effect: "L'octet 0 passe à 0x03 : les bits 0 et 1 sont à 1, les deux clignotants s'allument. Une seule trame suffit à produire un effet visible de l'extérieur.",
  },
  {
    id: "dos",
    title: "Déni de service par priorité",
    context: "Un noeud émet sans cesse l'identifiant le plus prioritaire.",
    legit: { canId: "244", bytes: ["00", "00", "00", "18", "9C", "00", "00", "00"] },
    forged: { canId: "000", bytes: ["00", "00", "00", "00", "00", "00", "00", "00"] },
    changed: [-1],
    effect: "En monopolisant l'arbitrage avec l'identifiant 0, l'attaquant empêche toute autre trame de passer. Le réseau se fige, et aucune contre-mesure logicielle ne l'empêche vraiment.",
  },
];

const overrides: Record<Exclude<Lang, "fr">, FramesOverride> = { de: framesDe, en: framesEn };

export function getSignals(lang: Lang): Signal[] {
  if (lang === "fr") return signals;
  const ov = overrides[lang]?.signals;
  if (!ov) return signals;
  return signals.map((s) => {
    const o = ov[s.id];
    if (!o) return s;
    const bits = s.bits && o.bits
      ? s.bits.map((b, i) => ({ ...b, label: o.bits?.[i] ?? b.label }))
      : s.bits;
    const gauge = s.gauge && o.unit ? { ...s.gauge, unit: o.unit } : s.gauge;
    return { ...s, name: o.name ?? s.name, help: o.help ?? s.help, bits, gauge };
  });
}

export function getExamples(lang: Lang): Example[] {
  if (lang === "fr") return examples;
  const ov = overrides[lang]?.examples;
  if (!ov) return examples;
  return examples.map((e) => ({
    ...e,
    title: ov[e.id]?.title ?? e.title,
    context: ov[e.id]?.context ?? e.context,
    effect: ov[e.id]?.effect ?? e.effect,
  }));
}
