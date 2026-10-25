// Page pedagogique "Le bus CAN". Structure et texte FR canoniques ici ;
// de/en fournissent des surcharges fusionnees a l'execution (meme principe que
// le catalogue d'attaques). La structure (ids de section, ordre et type des
// blocs) reste une source unique : les traductions ne portent que le texte.

import type { Lang } from "../i18n";
import { canbusText } from "./content/canbus.de";
import { canbusText as canbusTextEn } from "./content/canbus.en";

export type Block =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "frame"; caption: string; lines: { text: string; mark?: "hl" | "ok" }[] }
  | { t: "duo"; aTitle: string; a: string[]; bTitle: string; b: string[] };

export interface Section {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface CanbusPage {
  title: string;
  lede: string;
  sections: Section[];
}

// Surcharge de traduction : par section, l'intitule et la charge utile de
// chaque bloc dans l'ordre. Un bloc absent retombe sur le francais.
export type BlockPayload =
  | string // p
  | string[] // ul
  | { caption: string; lines: string[] } // frame (les marques viennent du FR)
  | { aTitle: string; a: string[]; bTitle: string; b: string[] }; // duo

export interface SectionOverride {
  heading?: string;
  blocks?: BlockPayload[];
}

export interface CanbusOverride {
  title?: string;
  lede?: string;
  sections?: Record<string, SectionOverride>;
}

const fr: CanbusPage = {
  title: "Le bus CAN",
  lede:
    "Le reseau sur lequel presque toutes les attaques finissent par passer. Comment il fonctionne, pourquoi il est si fiable, et pourquoi cette fiabilite meme en fait une cible.",
  sections: [
    {
      id: "quoi",
      heading: "Un seul fil pour tout le monde",
      blocks: [
        {
          t: "p",
          text: "CAN veut dire Controller Area Network. Bosch l'a concu en 1986 pour relier les calculateurs d'une voiture avec un minimum de cablage. Avant lui, chaque fonction demandait sa propre paire de fils ; le CAN remplace tout cela par une seule paire torsadee partagee, CAN-H et CAN-L, sur laquelle tous les calculateurs parlent et ecoutent.",
        },
        {
          t: "p",
          text: "La transmission est differentielle : l'information n'est pas une tension absolue mais l'ecart entre les deux fils. Le bruit electromagnetique du moteur frappe les deux conducteurs de la meme maniere et s'annule. Le debit courant est de 500 kbit/s pour le CAN haute vitesse, 125 kbit/s pour les fonctions de confort, avec une resistance de terminaison de 120 ohms a chaque extremite.",
        },
        {
          t: "p",
          text: "Le CAN est multi-maitre et sans adresses. Il n'y a ni expediteur ni destinataire : chaque trame porte un identifiant qui decrit son contenu (par exemple « regime moteur »), pas une machine. Chaque calculateur decide seul des identifiants qui l'interessent et ignore le reste.",
        },
      ],
    },
    {
      id: "trame",
      heading: "Anatomie d'une trame",
      blocks: [
        {
          t: "p",
          text: "Une trame de donnees standard tient en quelques champs. L'essentiel pour un attaquant tient en deux d'entre eux : l'identifiant, qui fixe la priorite et le sens, et les donnees, jusqu'a huit octets.",
        },
        {
          t: "frame",
          caption: "Trame de donnees CAN (format standard, identifiant sur 11 bits)",
          lines: [
            { text: "SOF | IDENTIFIANT 11 bits | RTR | IDE r0 | DLC | DONNEES 0-8 o | CRC | ACK | EOF" },
            { text: "  1 |        0x0C4         |  0  |       |  8  | 3F 00 ... 00  |     |     |    ", mark: "hl" },
          ],
        },
        {
          t: "ul",
          items: [
            "SOF : un bit dominant qui annonce le debut de trame et synchronise tout le monde.",
            "Identifiant (11 ou 29 bits) : decrit le contenu et sert d'arbitrage. Plus il est bas, plus la trame est prioritaire.",
            "RTR : distingue une demande d'une emission de donnees.",
            "DLC : nombre d'octets de donnees qui suivent, de 0 a 8.",
            "Donnees : la charge utile, jusqu'a 8 octets (64 en CAN-FD).",
            "CRC : controle d'integrite calcule sur la trame.",
            "ACK : chaque noeud qui a bien recu pose un bit dominant ; l'emetteur sait ainsi que quelqu'un a lu.",
            "EOF : la fin de trame.",
          ],
        },
      ],
    },
    {
      id: "arbitrage",
      heading: "Qui parle en premier : l'arbitrage",
      blocks: [
        {
          t: "p",
          text: "Deux calculateurs peuvent vouloir emettre en meme temps. Le CAN resout la collision sans la detruire. Un bit dominant (0) ecrase electriquement un bit recessif (1). Chaque emetteur relit le bus pendant qu'il ecrit son identifiant : des qu'il pose un bit recessif alors qu'un autre impose un dominant, il comprend qu'une trame plus prioritaire est en cours et se tait aussitot.",
        },
        {
          t: "p",
          text: "Resultat : l'identifiant le plus bas gagne, bit par bit, sans collision ni retransmission. La priorite est deterministe. C'est pour cela que les messages critiques (freinage, direction, airbags) recoivent les identifiants les plus bas : ils passent toujours en premier, meme bus charge.",
        },
      ],
    },
    {
      id: "atouts",
      heading: "Ce qui en fait un excellent reseau",
      blocks: [
        {
          t: "ul",
          items: [
            "Robuste : la paire differentielle encaisse un environnement electrique hostile.",
            "Economique : deux fils relient des dizaines de calculateurs.",
            "Deterministe : l'arbitrage par priorite garantit le temps reel des fonctions vitales.",
            "Multi-maitre : aucun chef d'orchestre, donc aucun point unique de defaillance.",
            "Auto-controle : CRC, acquittement et compteurs d'erreurs integres au protocole.",
            "Tolerant aux pannes : un noeud qui accumule les erreurs se met de lui-meme en silence (bus-off) pour ne pas polluer le reseau.",
          ],
        },
      ],
    },
    {
      id: "faiblesses",
      heading: "Ses faiblesses, vues par un attaquant",
      blocks: [
        {
          t: "p",
          text: "Tout ce qui fait sa force cote fiabilite se retourne cote securite : le CAN n'a jamais ete pense pour un adversaire deja present sur le bus.",
        },
        {
          t: "ul",
          items: [
            "Aucune authentification : n'importe quel noeud peut emettre n'importe quel identifiant. Rien ne prouve l'origine d'une trame.",
            "Aucun chiffrement : le trafic est en clair, le sniffing est immediat.",
            "Diffusion totale : chaque message est recu par tous, la confidentialite n'existe pas.",
            "Pas de notion de source : impossible de distinguer une vraie trame d'une trame forgee ; l'usurpation est indetectable par le protocole.",
            "Arbitrage detournable : emettre sans cesse l'identifiant 0 sature le bus (deni de service) ; forcer les erreurs d'un noeud cible le pousse en bus-off et le fait taire.",
            "Confiance implicite : sans passerelle qui filtre, une entree exposee (infotainment, OBD) donne acces aux domaines critiques.",
          ],
        },
      ],
    },
    {
      id: "exploitation",
      heading: "De la faiblesse a l'attaque",
      blocks: [
        {
          t: "p",
          text: "Ces proprietes se traduisent directement en familles de techniques. Chacune exploite une absence precise du protocole.",
        },
        {
          t: "duo",
          aTitle: "La propriete manquante",
          a: [
            "Pas de confidentialite",
            "Pas de controle d'integrite d'origine",
            "Pas d'authentification",
            "Arbitrage par priorite",
          ],
          bTitle: "La technique qu'elle ouvre",
          b: [
            "Lecture passive (sniffing) et retro-ingenierie des identifiants",
            "Rejeu d'une capture a l'identique",
            "Injection et usurpation de trames forgees, fuzzing",
            "Deni de service par saturation ou passage en bus-off",
          ],
        },
        {
          t: "p",
          text: "Chacune de ces familles est detaillee, avec outils et cas reels, dans l'explorateur d'attaques.",
        },
      ],
    },
    {
      id: "parades",
      heading: "Comment on le durcit",
      blocks: [
        {
          t: "p",
          text: "On ne reecrit pas le CAN : on ajoute des couches par-dessus. SecOC authentifie chaque message avec un code d'authentification et un compteur de fraicheur, ce qui ferme l'usurpation et le rejeu. La passerelle centrale segmente les domaines et filtre ce qui passe de l'infotainment vers le freinage. Un IDS CAN apprend le trafic normal et signale l'anormal. Enfin, les fonctions recentes migrent vers CAN-FD et l'Ethernet automobile.",
        },
        {
          t: "p",
          text: "Aucune de ces parades ne chiffre reellement le bus, et c'est le point a retenir : le deni de service par saturation de l'arbitrage reste tres difficile a empecher. La defense vise d'abord l'authenticite et le cloisonnement, pas le secret.",
        },
      ],
    },
  ],
};

const overrides: Record<Exclude<Lang, "fr">, CanbusOverride> = {
  de: canbusText,
  en: canbusTextEn,
};

function applyBlock(base: Block, payload: BlockPayload | undefined): Block {
  if (payload === undefined) return base;
  switch (base.t) {
    case "p":
      return typeof payload === "string" ? { t: "p", text: payload } : base;
    case "ul":
      return Array.isArray(payload) ? { t: "ul", items: payload } : base;
    case "frame":
      if (payload && typeof payload === "object" && "caption" in payload) {
        const lines = base.lines.map((l, i) => ({ text: payload.lines[i] ?? l.text, mark: l.mark }));
        return { t: "frame", caption: payload.caption, lines };
      }
      return base;
    case "duo":
      if (payload && typeof payload === "object" && "aTitle" in payload) {
        return { t: "duo", aTitle: payload.aTitle, a: payload.a, bTitle: payload.bTitle, b: payload.b };
      }
      return base;
  }
}

export function getCanbus(lang: Lang): CanbusPage {
  if (lang === "fr") return fr;
  const ov = overrides[lang];
  if (!ov || !ov.sections) {
    return { ...fr, title: ov?.title ?? fr.title, lede: ov?.lede ?? fr.lede };
  }
  return {
    title: ov.title ?? fr.title,
    lede: ov.lede ?? fr.lede,
    sections: fr.sections.map((s) => {
      const so = ov.sections?.[s.id];
      if (!so) return s;
      return {
        id: s.id,
        heading: so.heading ?? s.heading,
        blocks: s.blocks.map((b, i) => applyBlock(b, so.blocks?.[i])),
      };
    }),
  };
}
