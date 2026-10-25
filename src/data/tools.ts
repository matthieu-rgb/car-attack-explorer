// Catalogue d'outils. FR canonique ici ; de/en surchargent les textes
// traduisibles (intitule et intro de groupe, description d'outil). Les noms
// propres (candump, SavvyCAN...) et le type ne se traduisent pas.

import type { Lang } from "../i18n";
import { toolsText } from "./content/tools.de";
import { toolsText as toolsTextEn } from "./content/tools.en";

export type ToolKind = "logiciel" | "materiel" | "radio" | "framework";

export interface Tool {
  id: string;
  nom: string;
  kind: ToolKind;
  desc: string;
}

export interface ToolGroup {
  id: string;
  titre: string;
  intro: string;
  tools: Tool[];
}

export interface GroupOverride {
  titre?: string;
  intro?: string;
  tools?: Record<string, string>; // id d'outil -> description traduite
}

export type ToolsOverride = Record<string, GroupOverride>;

const fr: ToolGroup[] = [
  {
    id: "sniff",
    titre: "Lecture et injection CAN",
    intro: "Lire, rejouer et forger du trafic sur un bus, cote logiciel.",
    tools: [
      {
        id: "candump",
        nom: "can-utils / candump",
        kind: "logiciel",
        desc: "Capture et affiche en direct toutes les trames d'une interface SocketCAN. Le point de depart de toute reconnaissance.",
      },
      {
        id: "cansend",
        nom: "can-utils / cansend, cangen",
        kind: "logiciel",
        desc: "Forge et injecte une trame precise, ou genere un flot de trames pour saturer le bus ou fuzzer un calculateur.",
      },
      {
        id: "canplayer",
        nom: "can-utils / canplayer",
        kind: "logiciel",
        desc: "Rejoue un enregistrement de trames a l'identique, horodatage compris. L'outil canonique de l'attaque par rejeu.",
      },
      {
        id: "cansniffer",
        nom: "can-utils / cansniffer",
        kind: "logiciel",
        desc: "Regroupe les trames par identifiant et met en surbrillance les octets qui changent. Ideal pour isoler un signal.",
      },
      {
        id: "savvycan",
        nom: "SavvyCAN",
        kind: "logiciel",
        desc: "Interface graphique multi-plateforme de capture, rejeu et retro-ingenierie de trames CAN et CAN-FD.",
      },
      {
        id: "wireshark",
        nom: "Wireshark",
        kind: "logiciel",
        desc: "Analyseur reseau avec dissecteurs SocketCAN et ISO-TP pour decortiquer une capture trame par trame.",
      },
      {
        id: "pythoncan",
        nom: "python-can",
        kind: "logiciel",
        desc: "Bibliotheque Python qui pilote la plupart des interfaces CAN : capture, injection et automatisation par script.",
      },
    ],
  },
  {
    id: "diag",
    titre: "Diagnostic et UDS",
    intro: "Dialoguer avec les calculateurs via les services normalises de diagnostic.",
    tools: [
      {
        id: "caringcaribou",
        nom: "Caring Caribou",
        kind: "logiciel",
        desc: "Le « nmap du CAN » : decouverte de services UDS, scan d'identifiants, fuzzing et brute-force de sessions.",
      },
      {
        id: "udsoncan",
        nom: "python-udsoncan",
        kind: "logiciel",
        desc: "Implementation Python d'UDS (ISO 14229) pour scripter sessions, lecture/ecriture de donnees et routines.",
      },
      {
        id: "doipclient",
        nom: "python-doipclient",
        kind: "logiciel",
        desc: "Client DoIP (diagnostic sur IP/Ethernet) pour atteindre les calculateurs des vehicules recents.",
      },
      {
        id: "scapy",
        nom: "Scapy (couches auto)",
        kind: "logiciel",
        desc: "Forge et disseque CAN, ISO-TP, UDS, DoIP et GMLAN depuis Python, pour des scenarios sur mesure.",
      },
      {
        id: "j2534",
        nom: "J2534 / pass-thru",
        kind: "materiel",
        desc: "Interface normalisee des outils constructeurs, souvent detournee pour le flash et le diagnostic.",
      },
    ],
  },
  {
    id: "iface",
    titre: "Interfaces materielles CAN",
    intro: "Le pont physique entre le PC et la paire CAN-H / CAN-L.",
    tools: [
      {
        id: "canable",
        nom: "CANtact / CANable",
        kind: "materiel",
        desc: "Adaptateurs USB-CAN open source, reconnus nativement par SocketCAN. Entree de gamme du laboratoire.",
      },
      {
        id: "pcan",
        nom: "Peak PCAN-USB",
        kind: "materiel",
        desc: "Interface CAN professionnelle tres repandue, pilotes stables et large support outillage.",
      },
      {
        id: "kvaser",
        nom: "Kvaser Leaf",
        kind: "materiel",
        desc: "Interface CAN/CAN-FD robuste avec une API complete, courante en ingenierie embarquee.",
      },
      {
        id: "macchina",
        nom: "Macchina M2",
        kind: "materiel",
        desc: "Materiel embarquable branche directement sur la prise OBD-II, programmable pour le terrain.",
      },
      {
        id: "pihat",
        nom: "Raspberry Pi + chapeau MCP2515",
        kind: "materiel",
        desc: "Plateforme embarquee economique pour monter un banc CAN autonome et scripter en Python.",
      },
    ],
  },
  {
    id: "radio",
    titre: "Radio et sans-fil",
    intro: "Pour les entrees RF : cle, acces mains libres, cellulaire, GNSS.",
    tools: [
      {
        id: "hackrf",
        nom: "HackRF One",
        kind: "radio",
        desc: "SDR large bande de 1 MHz a 6 GHz, emission et reception. Capture et rejeu de signaux de cle.",
      },
      {
        id: "rtlsdr",
        nom: "RTL-SDR",
        kind: "radio",
        desc: "Recepteur SDR tres bon marche, en reception seule, pour observer et identifier les bandes utilisees.",
      },
      {
        id: "yardstick",
        nom: "YARD Stick One",
        kind: "radio",
        desc: "Emetteur-recepteur sub-GHz (300-900 MHz), taille pour les telecommandes et les cles RF.",
      },
      {
        id: "gnuradio",
        nom: "GNU Radio",
        kind: "logiciel",
        desc: "Atelier de traitement du signal pour assembler des chaines d'emission et de reception sur mesure.",
      },
    ],
  },
  {
    id: "lowlevel",
    titre: "Materiel bas niveau et injection de fautes",
    intro: "Quand on ouvre le calculateur et qu'on attaque le silicium.",
    tools: [
      {
        id: "chipwhisperer",
        nom: "ChipWhisperer",
        kind: "materiel",
        desc: "Plateforme d'injection de fautes (glitch de tension ou d'horloge) et d'analyse par canaux auxiliaires.",
      },
      {
        id: "jtagulator",
        nom: "JTAGulator",
        kind: "materiel",
        desc: "Identifie automatiquement les broches de debug JTAG / SWD exposees sur une carte inconnue.",
      },
      {
        id: "buspirate",
        nom: "Bus Pirate",
        kind: "materiel",
        desc: "Couteau suisse pour parler SPI, I2C et UART a une puce et sonder un circuit.",
      },
      {
        id: "logic",
        nom: "Analyseur logique",
        kind: "materiel",
        desc: "Capture les signaux numeriques d'un bus interne pour les retro-concevoir hors ligne.",
      },
      {
        id: "flashrom",
        nom: "flashrom / programmateur memoire",
        kind: "materiel",
        desc: "Lit et ecrit les memoires flash d'un calculateur, pour extraire ou remplacer un firmware.",
      },
    ],
  },
  {
    id: "sim",
    titre: "Simulation et frameworks",
    intro: "S'entrainer sans vehicule, et outiller les campagnes.",
    tools: [
      {
        id: "icsim",
        nom: "ICSim",
        kind: "framework",
        desc: "Simulateur de tableau de bord et de trafic CAN d'OpenGarages, pour s'exercer au rejeu sans voiture.",
      },
      {
        id: "metasploit",
        nom: "Metasploit (hwbridge)",
        kind: "framework",
        desc: "Pont materiel qui permet de piloter des interfaces CAN depuis le framework d'exploitation.",
      },
      {
        id: "opengarages",
        nom: "OpenGarages / Car Hacking Village",
        kind: "framework",
        desc: "Ressources, bancs d'essai et documentation de la communaute du car hacking.",
      },
    ],
  },
];

const overrides: Record<Exclude<Lang, "fr">, ToolsOverride> = {
  de: toolsText,
  en: toolsTextEn,
};

export function getToolGroups(lang: Lang): ToolGroup[] {
  if (lang === "fr") return fr;
  const ov = overrides[lang];
  if (!ov) return fr;
  return fr.map((g) => {
    const go = ov[g.id];
    if (!go) return g;
    return {
      id: g.id,
      titre: go.titre ?? g.titre,
      intro: go.intro ?? g.intro,
      tools: g.tools.map((tool) => ({ ...tool, desc: go.tools?.[tool.id] ?? tool.desc })),
    };
  });
}
