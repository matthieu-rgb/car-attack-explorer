// Page pedagogique "Le bus CAN". Structure et texte FR canoniques ici ;
// de/en fournissent des surcharges fusionnees a l'execution (meme principe que
// le catalogue d'attaques). La structure (ids de section, ordre et type des
// blocs) reste une source unique : les traductions ne portent que le texte.

import type { Lang } from "../i18n";
import type { Block, ReadingPage } from "./reading";
import { canbusText } from "./content/canbus.de";
import { canbusText as canbusTextEn } from "./content/canbus.en";

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

const fr: ReadingPage = {
  title: "Le bus CAN",
  lede:
    "Le réseau sur lequel presque toutes les attaques finissent par passer. Comment il fonctionne, pourquoi il est si fiable, et pourquoi cette fiabilité même en fait une cible.",
  sections: [
    {
      id: "quoi",
      heading: "Un seul fil pour tout le monde",
      blocks: [
        {
          t: "p",
          text: "CAN veut dire Controller Area Network. Bosch l'a conçu en 1986 pour relier les calculateurs d'une voiture avec un minimum de câblage. Avant lui, chaque fonction demandait sa propre paire de fils ; le CAN remplace tout cela par une seule paire torsadée partagée, CAN-H et CAN-L, sur laquelle tous les calculateurs parlent et écoutent.",
        },
        {
          t: "p",
          text: "La transmission est différentielle : l'information n'est pas une tension absolue mais l'écart entre les deux fils. Le bruit électromagnétique du moteur frappe les deux conducteurs de la même manière et s'annule. Le débit courant est de 500 kbit/s pour le CAN haute vitesse, 125 kbit/s pour les fonctions de confort, avec une résistance de terminaison de 120 ohms à chaque extrémité.",
        },
        {
          t: "p",
          text: "Le CAN est multi-maître et sans adresses. Il n'y a ni expéditeur ni destinataire : chaque trame porte un identifiant qui décrit son contenu (par exemple \"régime moteur\"), pas une machine. Chaque calculateur décide seul des identifiants qui l'intéressent et ignore le reste.",
        },
      ],
    },
    {
      id: "trame",
      heading: "Anatomie d'une trame",
      blocks: [
        {
          t: "p",
          text: "Une trame de données standard tient en quelques champs. L'essentiel pour un attaquant tient en deux d'entre eux : l'identifiant, qui fixe la priorité et le sens, et les données, jusqu'à huit octets.",
        },
        {
          t: "frame",
          caption: "Trame de données CAN (format standard, identifiant sur 11 bits)",
          lines: [
            { text: "SOF | IDENTIFIANT 11 bits | RTR | IDE r0 | DLC | DONNEES 0-8 o | CRC | ACK | EOF" },
            { text: "  1 |        0x0C4         |  0  |       |  8  | 3F 00 ... 00  |     |     |    ", mark: "hl" },
          ],
        },
        {
          t: "ul",
          items: [
            "SOF : un bit dominant qui annonce le début de trame et synchronise tout le monde.",
            "Identifiant (11 ou 29 bits) : décrit le contenu et sert d'arbitrage. Plus il est bas, plus la trame est prioritaire.",
            "RTR : distingue une demande d'une émission de données.",
            "DLC : nombre d'octets de données qui suivent, de 0 à 8.",
            "Données : la charge utile, jusqu'à 8 octets (64 en CAN-FD).",
            "CRC : contrôle d'intégrité calculé sur la trame.",
            "ACK : chaque noeud qui a bien reçu pose un bit dominant ; l'émetteur sait ainsi que quelqu'un a lu.",
            "EOF : la fin de trame.",
          ],
        },
      ],
    },
    {
      id: "arbitrage",
      heading: "Qui parle en premier : l'arbitrage",
      blocks: [
        {
          t: "p",
          text: "Deux calculateurs peuvent vouloir émettre en même temps. Le CAN résout la collision sans la détruire. Un bit dominant (0) écrase électriquement un bit récessif (1). Chaque émetteur relit le bus pendant qu'il écrit son identifiant : dès qu'il pose un bit récessif alors qu'un autre impose un dominant, il comprend qu'une trame plus prioritaire est en cours et se tait aussitôt.",
        },
        {
          t: "p",
          text: "Résultat : l'identifiant le plus bas gagne, bit par bit, sans collision ni retransmission. La priorité est déterministe. C'est pour cela que les messages critiques (freinage, direction, airbags) reçoivent les identifiants les plus bas : ils passent toujours en premier, même bus chargé.",
        },
      ],
    },
    {
      id: "atouts",
      heading: "Ce qui en fait un excellent réseau",
      blocks: [
        {
          t: "ul",
          items: [
            "Robuste : la paire différentielle encaisse un environnement électrique hostile.",
            "Économique : deux fils relient des dizaines de calculateurs.",
            "Déterministe : l'arbitrage par priorité garantit le temps réel des fonctions vitales.",
            "Multi-maître : aucun chef d'orchestre, donc aucun point unique de défaillance.",
            "Auto-contrôle : CRC, acquittement et compteurs d'erreurs intégrés au protocole.",
            "Tolérant aux pannes : un noeud qui accumule les erreurs se met de lui-même en silence (bus-off) pour ne pas polluer le réseau.",
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
          text: "Tout ce qui fait sa force côté fiabilité se retourne côté sécurité : le CAN n'a jamais été pensé pour un adversaire déjà présent sur le bus.",
        },
        {
          t: "ul",
          items: [
            "Aucune authentification : n'importe quel noeud peut émettre n'importe quel identifiant. Rien ne prouve l'origine d'une trame.",
            "Aucun chiffrement : le trafic est en clair, le sniffing est immédiat.",
            "Diffusion totale : chaque message est reçu par tous, la confidentialité n'existe pas.",
            "Pas de notion de source : impossible de distinguer une vraie trame d'une trame forgée ; l'usurpation est indétectable par le protocole.",
            "Arbitrage détournable : émettre sans cesse l'identifiant 0 sature le bus (déni de service) ; forcer les erreurs d'un noeud cible le pousse en bus-off et le fait taire.",
            "Confiance implicite : sans passerelle qui filtre, une entrée exposée (infotainment, OBD) donne accès aux domaines critiques.",
          ],
        },
      ],
    },
    {
      id: "exploitation",
      heading: "De la faiblesse à l'attaque",
      blocks: [
        {
          t: "p",
          text: "Ces propriétés se traduisent directement en familles de techniques. Chacune exploite une absence précise du protocole.",
        },
        {
          t: "duo",
          aTitle: "La propriété manquante",
          a: [
            "Pas de confidentialité",
            "Pas de contrôle d'intégrité d'origine",
            "Pas d'authentification",
            "Arbitrage par priorité",
          ],
          bTitle: "La technique qu'elle ouvre",
          b: [
            "Lecture passive (sniffing) et rétro-ingénierie des identifiants",
            "Rejeu d'une capture à l'identique",
            "Injection et usurpation de trames forgées, fuzzing",
            "Déni de service par saturation ou passage en bus-off",
          ],
        },
        {
          t: "p",
          text: "Chacune de ces familles est détaillée, avec outils et cas réels, dans l'explorateur d'attaques.",
        },
      ],
    },
    {
      id: "parades",
      heading: "Comment on le durcit",
      blocks: [
        {
          t: "p",
          text: "On ne réécrit pas le CAN : on ajoute des couches par-dessus. SecOC authentifie chaque message avec un code d'authentification et un compteur de fraîcheur, ce qui ferme l'usurpation et le rejeu. La passerelle centrale segmente les domaines et filtre ce qui passe de l'infotainment vers le freinage. Un IDS CAN apprend le trafic normal et signale l'anormal. Enfin, les fonctions récentes migrent vers CAN-FD et l'Ethernet automobile.",
        },
        {
          t: "p",
          text: "Aucune de ces parades ne chiffre réellement le bus, et c'est le point à retenir : le déni de service par saturation de l'arbitrage reste très difficile à empêcher. La défense vise d'abord l'authenticité et le cloisonnement, pas le secret.",
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
    default:
      return base;
  }
}

export function getCanbus(lang: Lang): ReadingPage {
  if (lang === "fr") return fr;
  const ov = overrides[lang];
  if (!ov || !ov.sections) {
    return { ...fr, title: ov?.title ?? fr.title, lede: ov?.lede ?? fr.lede };
  }
  return {
    title: ov.title ?? fr.title,
    lede: ov.lede ?? fr.lede,
    sections: fr.sections.map((s) => {
      const so = ov.sections?.[s.id];
      if (!so) return s;
      return {
        id: s.id,
        heading: so.heading ?? s.heading,
        blocks: s.blocks.map((b, i) => applyBlock(b, so.blocks?.[i])),
      };
    }),
  };
}
