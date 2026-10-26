// Page "UDS & diagnostic". FR canonique inline ; de/en fournissent une page
// complete (meme structure) fusionnee a l'execution, avec repli FR.

import type { Lang } from "../i18n";
import type { ReadingPage } from "./reading";
import { udsDe } from "./content/uds.de";
import { udsEn } from "./content/uds.en";

const fr: ReadingPage = {
  title: "UDS, le diagnostic qui ouvre les portes",
  lede:
    "Le protocole normalise par lequel on parle aux calculateurs : lire, ecrire, reinitialiser, reflasher. Concu pour l'atelier, il devient une surface d'attaque des qu'on sait le detourner.",
  sections: [
    {
      id: "quoi",
      heading: "Un protocole par-dessus le bus",
      blocks: [
        {
          t: "p",
          text: "UDS (Unified Diagnostic Services, ISO 14229) est un protocole requete/reponse entre un testeur (l'outil de diagnostic) et un calculateur. Il ne remplace pas le CAN : il circule par-dessus, transporte par ISO-TP (ISO 15765-2) quand une requete depasse huit octets, ou par DoIP sur les vehicules a Ethernet.",
        },
        {
          t: "p",
          text: "Chaque requete commence par un identifiant de service (SID) d'un octet. Une reponse positive renvoie ce SID augmente de 0x40 ; une reponse negative renvoie 0x7F, le SID d'origine, puis un code d'erreur.",
        },
        {
          t: "frame",
          caption: "Requete UDS et sa reponse positive (SID + 0x40)",
          lines: [
            { text: "Testeur -> ECU : 10 03                 ouvrir la session etendue" },
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
          text: "Une poignee de services suffit a couvrir l'essentiel du diagnostic offensif.",
        },
        {
          t: "table",
          caption: "Services UDS de reference",
          head: ["SID", "Service", "Ce qu'il permet"],
          rows: [
            ["0x10", "DiagnosticSessionControl", "Ouvrir une session (defaut, etendue, programmation) et debloquer des services sensibles."],
            ["0x27", "SecurityAccess", "Deverrouiller une fonction protegee par un defi/reponse (seed/key)."],
            ["0x22", "ReadDataByIdentifier", "Lire une donnee par identifiant : VIN, versions logicielles, capteurs."],
            ["0x2E", "WriteDataByIdentifier", "Ecrire une donnee par identifiant, donc modifier un parametre du calculateur."],
            ["0x31", "RoutineControl", "Lancer une routine interne : effacement, tests, calibrations."],
            ["0x34 / 36 / 37", "Request/Transfer/Exit", "La sequence de reflashage : annoncer, transferer, clore."],
            ["0x11", "ECUReset", "Redemarrer le calculateur."],
            ["0x3E", "TesterPresent", "Maintenir la session ouverte (keep-alive)."],
            ["0x28", "CommunicationControl", "Couper ou retablir l'emission et la reception de messages."],
            ["0x85", "ControlDTCSetting", "Activer ou desactiver l'enregistrement des codes defaut."],
          ],
        },
      ],
    },
    {
      id: "seedkey",
      heading: "SecurityAccess : le defi seed/key",
      blocks: [
        {
          t: "p",
          text: "Le service 0x27 protege les fonctions sensibles (ecriture, reflashage) par un defi-reponse. Le principe est simple ; toute sa solidite repose sur le secret de l'algorithme.",
        },
        {
          t: "ol",
          items: [
            "Le testeur demande une graine : requete 0x27 avec une sous-fonction impaire (0x01, requestSeed).",
            "Le calculateur renvoie une graine aleatoire (le seed), quelques octets.",
            "Le testeur calcule la cle en appliquant au seed un algorithme que le constructeur garde secret.",
            "Le testeur envoie la cle : requete 0x27 avec la sous-fonction paire correspondante (0x02, sendKey).",
            "Si la cle correspond, le calculateur deverrouille ; sinon il refuse, et apres plusieurs essais impose un delai anti-bruteforce.",
          ],
        },
        {
          t: "frame",
          caption: "Echange seed/key (service 0x27)",
          lines: [
            { text: "Testeur -> ECU : 27 01                 requestSeed" },
            { text: "ECU -> Testeur : 67 01 A3 7F 2C 90       seed (4 octets)", mark: "ok" },
            { text: "Testeur -> ECU : 27 02 11 22 33 44       sendKey (cle calculee)" },
            { text: "ECU -> Testeur : 67 02                 positif, acces accorde", mark: "ok" },
          ],
        },
        {
          t: "p",
          text: "L'algorithme seed vers key vit dans le firmware du calculateur. S'il est faible (operations lineaires, cle fixe) ou extrait par un dump memoire, on le rejoue hors ligne. C'est pour cela que 0x27 est la premiere cible d'un audit UDS, et pourquoi un algorithme fort et SecOC changent tout.",
        },
      ],
    },
    {
      id: "flash",
      heading: "Le reflashage : 0x34 / 0x36 / 0x37",
      blocks: [
        {
          t: "p",
          text: "Reprogrammer un calculateur suit une sequence precise, en session de programmation et apres un SecurityAccess reussi.",
        },
        {
          t: "ol",
          items: [
            "0x34 RequestDownload : annonce l'adresse, la taille et le format des donnees a ecrire.",
            "0x36 TransferData : envoie le firmware par blocs numerotes.",
            "0x37 RequestTransferExit : clot le transfert ; le calculateur verifie puis valide.",
          ],
        },
        {
          t: "p",
          text: "Sans controle d'authenticite et d'integrite, cette sequence permet d'ecrire un firmware modifie. C'est pourquoi le demarrage securise et la signature des mises a jour (cadre R156) sont decisifs.",
        },
      ],
    },
    {
      id: "aller",
      heading: "Le relier aux attaques",
      blocks: [
        {
          t: "p",
          text: "Les attaques de la couche Diagnostic de l'explorateur reposent toutes sur ces services : forcer une session, bruteforcer une graine faible, ecrire un identifiant de donnee, lancer une routine, reflasher un calculateur.",
        },
      ],
    },
  ],
};

const overrides: Record<Exclude<Lang, "fr">, ReadingPage | null> = { de: udsDe, en: udsEn };

export function getUds(lang: Lang): ReadingPage {
  if (lang === "fr") return fr;
  return overrides[lang] ?? fr;
}

export { fr as udsFr };
