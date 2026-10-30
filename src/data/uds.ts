// Page "UDS & diagnostic". FR canonique inline ; de/en fournissent une page
// complete (meme structure) fusionnee a l'execution, avec repli FR.

import type { Lang } from "../i18n";
import type { ReadingPage } from "./reading";
import { udsDe } from "./content/uds.de";
import { udsEn } from "./content/uds.en";

const fr: ReadingPage = {
  title: "UDS, le diagnostic qui ouvre les portes",
  lede:
    "Le protocole normalisé par lequel on parle aux calculateurs : lire, écrire, réinitialiser, reflasher. Conçu pour l'atelier, il devient une surface d'attaque dès qu'on sait le détourner.",
  sections: [
    {
      id: "quoi",
      heading: "Un protocole par-dessus le bus",
      blocks: [
        {
          t: "p",
          text: "UDS (Unified Diagnostic Services, ISO 14229) est un protocole requête/réponse entre un testeur (l'outil de diagnostic) et un calculateur. Il ne remplace pas le CAN : il circule par-dessus, transporté par ISO-TP (ISO 15765-2) quand une requête dépasse huit octets, ou par DoIP sur les véhicules à Ethernet.",
        },
        {
          t: "p",
          text: "Chaque requête commence par un identifiant de service (SID) d'un octet. Une réponse positive renvoie ce SID augmenté de 0x40 ; une réponse négative renvoie 0x7F, le SID d'origine, puis un code d'erreur.",
        },
        {
          t: "frame",
          caption: "Requête UDS et sa réponse positive (SID + 0x40)",
          lines: [
            { text: "Testeur -> ECU : 10 03                 ouvrir la session étendue" },
            { text: "ECU -> Testeur : 50 03 00 32 01 F4       positif (0x10 + 0x40 = 0x50)", mark: "ok" },
          ],
        },
      ],
    },
    {
      id: "services",
      heading: "Les services qui comptent",
      blocks: [
        {
          t: "p",
          text: "Une poignée de services suffit à couvrir l'essentiel du diagnostic offensif.",
        },
        {
          t: "table",
          caption: "Services UDS de référence",
          head: ["SID", "Service", "Ce qu'il permet"],
          rows: [
            ["0x10", "DiagnosticSessionControl", "Ouvrir une session (défaut, étendue, programmation) et débloquer des services sensibles."],
            ["0x27", "SecurityAccess", "Déverrouiller une fonction protégée par un défi/réponse (seed/key)."],
            ["0x22", "ReadDataByIdentifier", "Lire une donnée par identifiant : VIN, versions logicielles, capteurs."],
            ["0x2E", "WriteDataByIdentifier", "Écrire une donnée par identifiant, donc modifier un paramètre du calculateur."],
            ["0x31", "RoutineControl", "Lancer une routine interne : effacement, tests, calibrations."],
            ["0x34 / 36 / 37", "Request/Transfer/Exit", "La séquence de reflashage : annoncer, transférer, clore."],
            ["0x11", "ECUReset", "Redémarrer le calculateur."],
            ["0x3E", "TesterPresent", "Maintenir la session ouverte (keep-alive)."],
            ["0x28", "CommunicationControl", "Couper ou rétablir l'émission et la réception de messages."],
            ["0x85", "ControlDTCSetting", "Activer ou désactiver l'enregistrement des codes défaut."],
          ],
        },
      ],
    },
    {
      id: "seedkey",
      heading: "SecurityAccess : le défi seed/key",
      blocks: [
        {
          t: "p",
          text: "Le service 0x27 protège les fonctions sensibles (écriture, reflashage) par un défi-réponse. Le principe est simple ; toute sa solidité repose sur le secret de l'algorithme.",
        },
        {
          t: "ol",
          items: [
            "Le testeur demande une graine : requête 0x27 avec une sous-fonction impaire (0x01, requestSeed).",
            "Le calculateur renvoie une graine aléatoire (le seed), quelques octets.",
            "Le testeur calcule la clé en appliquant au seed un algorithme que le constructeur garde secret.",
            "Le testeur envoie la clé : requête 0x27 avec la sous-fonction paire correspondante (0x02, sendKey).",
            "Si la clé correspond, le calculateur déverrouille ; sinon il refuse, et après plusieurs essais impose un délai anti-bruteforce.",
          ],
        },
        {
          t: "frame",
          caption: "Échange seed/key (service 0x27)",
          lines: [
            { text: "Testeur -> ECU : 27 01                 requestSeed" },
            { text: "ECU -> Testeur : 67 01 A3 7F 2C 90       seed (4 octets)", mark: "ok" },
            { text: "Testeur -> ECU : 27 02 11 22 33 44       sendKey (clé calculée)" },
            { text: "ECU -> Testeur : 67 02                 positif, accès accordé", mark: "ok" },
          ],
        },
        {
          t: "p",
          text: "L'algorithme seed vers key vit dans le firmware du calculateur. S'il est faible (opérations linéaires, clé fixe) ou extrait par un dump mémoire, on le rejoue hors ligne. C'est pour cela que 0x27 est la première cible d'un audit UDS, et pourquoi un algorithme fort et SecOC changent tout.",
        },
      ],
    },
    {
      id: "flash",
      heading: "Le reflashage : 0x34 / 0x36 / 0x37",
      blocks: [
        {
          t: "p",
          text: "Reprogrammer un calculateur suit une séquence précise, en session de programmation et après un SecurityAccess réussi.",
        },
        {
          t: "ol",
          items: [
            "0x34 RequestDownload : annonce l'adresse, la taille et le format des données à écrire.",
            "0x36 TransferData : envoie le firmware par blocs numérotés.",
            "0x37 RequestTransferExit : clôt le transfert ; le calculateur vérifie puis valide.",
          ],
        },
        {
          t: "p",
          text: "Sans contrôle d'authenticité et d'intégrité, cette séquence permet d'écrire un firmware modifié. C'est pourquoi le démarrage sécurisé et la signature des mises à jour (cadre R156) sont décisifs.",
        },
      ],
    },
    {
      id: "aller",
      heading: "Le relier aux attaques",
      blocks: [
        {
          t: "p",
          text: "Les attaques de la couche Diagnostic de l'explorateur reposent toutes sur ces services : forcer une session, bruteforcer une graine faible, écrire un identifiant de donnée, lancer une routine, reflasher un calculateur.",
        },
      ],
    },
  ],
};

const overrides: Record<Exclude<Lang, "fr">, ReadingPage | null> = { de: udsDe, en: udsEn };

export function getUds(lang: Lang): ReadingPage {
  if (lang === "fr") return fr;
  return overrides[lang] ?? fr;
}

export { fr as udsFr };
