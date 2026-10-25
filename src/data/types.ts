// Modele de donnees. Tout est separe du code de rendu et de simulation.

export type Domain = "powertrain" | "chassis" | "bodyd" | "info";

export type LayerId = "A" | "B" | "C" | "D" | "E";

export type Level = "debutant" | "avance";

export type Countermeasure = "secoc" | "segmentation" | "durcissement";

export type Side = "left" | "right";

export interface EcuNode {
  id: string;
  label: string; // acronym, language-neutral (ECM, ABS/ESP...). Sub-label is in i18n.
  domain: Domain;
  x: number;
  y: number;
  side: Side;
}

export interface EntryPoint {
  id: string; // label is in i18n (entry.<id>.label)
  x: number;
  y: number;
  side: Side;
}

export interface FrameLine {
  text: string;
  mark?: "hl" | "ok" | "none";
}

export interface FrameExample {
  caption: string;
  lines: FrameLine[];
}

export interface Attack {
  id: string;
  layer: LayerId;
  level: Level;
  nom: string;
  entry: string; // EntryPoint id
  // route of point ids traversed by the animation; ids may be "entry:<id>",
  // "gateway", or an EcuNode id. Straight segments connect them in order.
  route: string[];
  // when set, the attack lights whole domains rather than a single target
  busHighlight?: Domain[];
  target?: string; // EcuNode id flashed as compromised, if any

  resume: string; // niveau 1, simple
  principe: string;
  pourquoi: string; // pourquoi ca marche techniquement
  methode: string[];
  prerequis: string[];
  effet: string;
  remediations: string[];
  annexe5: string;
  outils: string[];
  casReel?: string;
  frame?: FrameExample;

  blockedBy: Countermeasure[];
  verdictPass: string;
  verdictBlock: string;
}

export interface Vehicle {
  gateway: { x: number; y: number };
  nodes: EcuNode[];
  entries: EntryPoint[];
}

// Translatable text fields of an attack. The French version lives inline in
// attacks.ts (canonical). de/en provide overrides, merged at runtime.
export type AttackText = Pick<
  Attack,
  | "nom"
  | "resume"
  | "principe"
  | "pourquoi"
  | "methode"
  | "prerequis"
  | "effet"
  | "remediations"
  | "annexe5"
  | "outils"
  | "casReel"
  | "frame"
  | "verdictPass"
  | "verdictBlock"
>;

export type AttackOverride = Partial<AttackText>;

