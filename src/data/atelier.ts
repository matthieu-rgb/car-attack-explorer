// Page "Atelier" : monter son banc, antiseche, glossaire, ressources.
// FR canonique inline ; de/en fournissent une page complete (repli FR).

import type { Lang } from "../i18n";
import type { ReadingPage } from "./reading";
import { atelierDe } from "./content/atelier.de";
import { atelierEn } from "./content/atelier.en";

const fr: ReadingPage = {
  title: "Monter son banc, et aller plus loin",
  lede:
    "De quoi passer de la lecture à la pratique : un bus CAN virtuel, les commandes qui comptent, le vocabulaire, et où continuer.",
  sections: [
    {
      id: "banc",
      heading: "Un banc CAN sans voiture",
      blocks: [
        {
          t: "p",
          text: "Pas besoin de véhicule pour commencer. Linux embarque SocketCAN ; une interface virtuelle vcan se comporte comme un vrai bus, et le simulateur ICSim fournit un tableau de bord à piloter.",
        },
        {
          t: "code",
          caption: "Créer un bus CAN virtuel (Linux, SocketCAN)",
          lines: [
            "sudo modprobe vcan",
            "sudo ip link add dev vcan0 type vcan",
            "sudo ip link set up vcan0",
          ],
        },
        {
          t: "code",
          caption: "Lancer le simulateur ICSim",
          lines: [
            "./icsim vcan0        # le tableau de bord simule",
            "./controls vcan0     # la telecommande qui genere le trafic",
          ],
        },
        {
          t: "note",
          text: "Tout reste local et virtuel : aucun véhicule n'est touché, aucune trame ne sort de la machine.",
        },
      ],
    },
    {
      id: "reproduire",
      heading: "Reproduire en vrai",
      blocks: [
        {
          t: "p",
          text: "Le virtuel suffit pour apprendre la méthode ; le cuivre la rend concrète. Quatre montages, du plus simple à quinze euros au plus parlant en démonstration, tous documentés et reproductibles.",
        },
        {
          t: "table",
          caption: "Du banc jouet au tableau de bord qui s'allume",
          head: ["Montage", "Matériel", "Ce qu'on reproduit"],
          rows: [
            [
              "Banc deux noeuds",
              "2 Arduino ou ESP32, 2 transceivers (MCP2515 ou TWAI natif), 2 résistances 120 ohms",
              "Le coeur du reverse : un noeud émet, l'autre écoute. Sniffer, diff, injection.",
            ],
            [
              "Pont ESP32",
              "1 ESP32 avec ESP32RET ou CANMIM",
              "Capture, rejeu et homme du milieu sur un vrai bus, pilotés depuis le PC (SavvyCAN).",
            ],
            [
              "Raspberry Pi + CAN-HAT",
              "1 Raspberry Pi, 1 chapeau CAN (PiCAN, Waveshare)",
              "Les mêmes candump / cansend que l'Atelier, mais sur une interface can0 physique.",
            ],
            [
              "Tableau de bord réel",
              "Un combiné d'instruments de casse, une alimentation, un bus terminé",
              "Les aiguilles bougent pour de vrai quand on forge les trames. La démonstration qui marque.",
            ],
          ],
        },
        {
          t: "ul",
          items: [
            "Câblage : CAN-H relié à CAN-H, CAN-L à CAN-L, et une résistance de 120 ohms à chaque extrémité du bus.",
            "Le piège classique : beaucoup de modules MCP2515 ont un quartz à 8 MHz, pas 16. Si l'horloge ne correspond pas, le bus reste muet.",
            "Débit : la plupart des exemples tournent à 250 ou 500 kbit/s, et les deux noeuds doivent être réglés pareil.",
          ],
        },
        {
          t: "p",
          text: "Le pont avec ce site : un Raspberry Pi muni d'un CAN-HAT expose une vraie interface SocketCAN. Toutes les commandes vues plus haut fonctionnent à l'identique, et ICSim tourne dessus sans rien changer.",
        },
        {
          t: "code",
          caption: "Passer ICSim du bus virtuel à une interface CAN réelle",
          lines: [
            "sudo ip link set can0 type can bitrate 500000",
            "sudo ip link set up can0",
            "./icsim can0        # le meme tableau de bord, sur le bus physique",
            "./controls can0",
          ],
        },
        {
          t: "links",
          items: [
            {
              label: "Banc deux noeuds pas à pas (SparkFun CAN Bus Shield)",
              url: "https://www.instructables.com/Sparkfun-CAN-Bus-Shield-Tutorial",
              note: "Deux Arduino, câblage et terminaison expliqués.",
            },
            {
              label: "ESP32RET",
              url: "https://github.com/aszu80/ESP32RET",
              note: "Faire d'un ESP32 un outil de capture et de rejeu, compatible SavvyCAN.",
            },
            {
              label: "CANMIM",
              url: "https://github.com/zeroomega/canmim",
              note: "Homme du milieu CAN sur ESP32 : lire, filtrer, injecter, réémettre.",
            },
            {
              label: "Pro-CHASER (banc d'essai de recherche)",
              url: "https://researcher.manipal.edu/en/publications/pro-chaser-a-prototype-testbed-for-car-hacking-attack-simulation-/",
              note: "Un banc Raspberry Pi + CAN-HAT décrit dans une publication.",
            },
          ],
        },
      ],
    },
    {
      id: "antiseche",
      heading: "Antisèche can-utils",
      blocks: [
        {
          t: "table",
          caption: "Les commandes du quotidien",
          head: ["Commande", "Ce qu'elle fait"],
          rows: [
            ["candump vcan0", "Afficher en direct toutes les trames du bus."],
            ["candump -l vcan0", "Enregistrer dans un fichier (candump-*.log) pour rejeu."],
            ["canplayer -I fichier.log", "Rejouer un enregistrement à l'identique."],
            ["cansend vcan0 123#DEADBEEF", "Envoyer une trame : identifiant 0x123, données DE AD BE EF."],
            ["cangen vcan0 -I i -L 8 -D r", "Générer des trames aléatoires : charge et fuzzing."],
            ["cansniffer vcan0", "Vue groupée par identifiant, octets changeants en surbrillance."],
            ["cansend vcan0 000#0000000000000000", "Marteler l'identifiant 0 : illustration d'un déni de service."],
          ],
        },
      ],
    },
    {
      id: "glossaire",
      heading: "Glossaire",
      blocks: [
        {
          t: "deflist",
          items: [
            { term: "ECU / calculateur", def: "Un des ordinateurs du véhicule : moteur, freinage, habitacle, etc." },
            { term: "Trame (frame)", def: "Unité de données transmise sur le bus : un identifiant et jusqu'à huit octets." },
            { term: "Identifiant (CAN ID)", def: "Champ qui décrit le contenu d'une trame et fixe sa priorité d'arbitrage." },
            { term: "ISO-TP", def: "Couche de transport (ISO 15765-2) qui segmente les messages de plus de huit octets." },
            { term: "UDS", def: "Services de diagnostic normalisés (ISO 14229), au-dessus du bus." },
            { term: "DoIP", def: "Diagnostic sur IP (ISO 13400) : le diagnostic porté par Ethernet." },
            { term: "SecOC", def: "Secure Onboard Communication : authentifie les messages (MAC et compteur de fraîcheur)." },
            { term: "DTC", def: "Diagnostic Trouble Code : un code défaut enregistré par un calculateur." },
            { term: "PID (OBD)", def: "Parameter ID : identifiant d'une donnée standard lisible via la prise OBD-II." },
            { term: "CAN-FD", def: "Évolution du CAN : débit supérieur et jusqu'à 64 octets de données par trame." },
            { term: "Bus-off", def: "État dans lequel un noeud se déconnecte de lui-même après trop d'erreurs." },
          ],
        },
      ],
    },
    {
      id: "ressources",
      heading: "Pour aller plus loin",
      blocks: [
        {
          t: "links",
          items: [
            { label: "The Car Hacker's Handbook (OpenGarages)", url: "https://www.opengarages.org/handbook/", note: "La référence d'entrée, libre et gratuite." },
            { label: "can-utils (depot SocketCAN)", url: "https://github.com/linux-can/can-utils", note: "Les outils en ligne de commande." },
            { label: "ICSim, simulateur de tableau de bord", url: "https://github.com/zombieCraig/ICSim", note: "Pour s'exercer au rejeu sans voiture." },
            { label: "UNECE WP.29 (R155 / R156)", url: "https://unece.org/transport/vehicle-regulations-wp29", note: "Le cadre réglementaire cybersécurité du véhicule." },
            { label: "ISO/SAE 21434", url: "https://www.iso.org/standard/70918.html", note: "L'ingénierie de la cybersécurité automobile." },
          ],
        },
        {
          t: "note",
          text: "Les liens s'ouvrent dans un nouvel onglet. Ce site ne dépose aucun traceur.",
        },
      ],
    },
  ],
};

const overrides: Record<Exclude<Lang, "fr">, ReadingPage | null> = { de: atelierDe, en: atelierEn };

export function getAtelier(lang: Lang): ReadingPage {
  if (lang === "fr") return fr;
  return overrides[lang] ?? fr;
}

export { fr as atelierFr };
