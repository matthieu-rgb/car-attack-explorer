// Page "Atelier" : monter son banc, antiseche, glossaire, ressources.
// FR canonique inline ; de/en fournissent une page complete (repli FR).

import type { Lang } from "../i18n";
import type { ReadingPage } from "./reading";
import { atelierDe } from "./content/atelier.de";
import { atelierEn } from "./content/atelier.en";

const fr: ReadingPage = {
  title: "Monter son banc, et aller plus loin",
  lede:
    "De quoi passer de la lecture a la pratique : un bus CAN virtuel, les commandes qui comptent, le vocabulaire, et ou continuer.",
  sections: [
    {
      id: "banc",
      heading: "Un banc CAN sans voiture",
      blocks: [
        {
          t: "p",
          text: "Pas besoin de vehicule pour commencer. Linux embarque SocketCAN ; une interface virtuelle vcan se comporte comme un vrai bus, et le simulateur ICSim fournit un tableau de bord a piloter.",
        },
        {
          t: "code",
          caption: "Creer un bus CAN virtuel (Linux, SocketCAN)",
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
          text: "Tout reste local et virtuel : aucun vehicule n'est touche, aucune trame ne sort de la machine.",
        },
      ],
    },
    {
      id: "antiseche",
      heading: "Antiseche can-utils",
      blocks: [
        {
          t: "table",
          caption: "Les commandes du quotidien",
          head: ["Commande", "Ce qu'elle fait"],
          rows: [
            ["candump vcan0", "Afficher en direct toutes les trames du bus."],
            ["candump -l vcan0", "Enregistrer dans un fichier (candump-*.log) pour rejeu."],
            ["canplayer -I fichier.log", "Rejouer un enregistrement a l'identique."],
            ["cansend vcan0 123#DEADBEEF", "Envoyer une trame : identifiant 0x123, donnees DE AD BE EF."],
            ["cangen vcan0 -I i -L 8 -D r", "Generer des trames aleatoires : charge et fuzzing."],
            ["cansniffer vcan0", "Vue groupee par identifiant, octets changeants en surbrillance."],
            ["cansend vcan0 000#0000000000000000", "Marteler l'identifiant 0 : illustration d'un deni de service."],
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
            { term: "ECU / calculateur", def: "Un des ordinateurs du vehicule : moteur, freinage, habitacle, etc." },
            { term: "Trame (frame)", def: "Unite de donnees transmise sur le bus : un identifiant et jusqu'a huit octets." },
            { term: "Identifiant (CAN ID)", def: "Champ qui decrit le contenu d'une trame et fixe sa priorite d'arbitrage." },
            { term: "ISO-TP", def: "Couche de transport (ISO 15765-2) qui segmente les messages de plus de huit octets." },
            { term: "UDS", def: "Services de diagnostic normalises (ISO 14229), au-dessus du bus." },
            { term: "DoIP", def: "Diagnostic sur IP (ISO 13400) : le diagnostic porte par Ethernet." },
            { term: "SecOC", def: "Secure Onboard Communication : authentifie les messages (MAC et compteur de fraicheur)." },
            { term: "DTC", def: "Diagnostic Trouble Code : un code defaut enregistre par un calculateur." },
            { term: "PID (OBD)", def: "Parameter ID : identifiant d'une donnee standard lisible via la prise OBD-II." },
            { term: "CAN-FD", def: "Evolution du CAN : debit superieur et jusqu'a 64 octets de donnees par trame." },
            { term: "Bus-off", def: "Etat dans lequel un noeud se deconnecte de lui-meme apres trop d'erreurs." },
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
            { label: "The Car Hacker's Handbook (OpenGarages)", url: "https://www.opengarages.org/handbook/", note: "La reference d'entree, libre et gratuite." },
            { label: "can-utils (depot SocketCAN)", url: "https://github.com/linux-can/can-utils", note: "Les outils en ligne de commande." },
            { label: "ICSim, simulateur de tableau de bord", url: "https://github.com/zombieCraig/ICSim", note: "Pour s'exercer au rejeu sans voiture." },
            { label: "UNECE WP.29 (R155 / R156)", url: "https://unece.org/transport/vehicle-regulations-wp29", note: "Le cadre reglementaire cybersecurite du vehicule." },
            { label: "ISO/SAE 21434", url: "https://www.iso.org/standard/70918.html", note: "L'ingenierie de la cybersecurite automobile." },
          ],
        },
        {
          t: "note",
          text: "Les liens s'ouvrent dans un nouvel onglet. Ce site ne depose aucun traceur.",
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
