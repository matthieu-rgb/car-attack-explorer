// Rubrique "Analyses" : decryptage des hacks auto recents.
// FR canonique inline ; de/en fournissent des tableaux miroir (repli FR).
// Texte affiche en francais accentue ; identifiants, code et SVG restent sobres.

import type { Lang } from "../i18n";
import type { Block, Section } from "./reading";
import { articlesDe } from "./content/articles.de";
import { articlesEn } from "./content/articles.en";

// Vecteur dominant de l'attaque : pilote la pastille coloree.
export type Vector = "can" | "api" | "hardware" | "rf" | "charge";

export interface ArticleFiche {
  cible: string;
  entree: string;
  methode: string;
  faille: string;
}

export interface Article {
  slug: string; // identifiant d'URL, neutre linguistiquement
  date: string; // ISO "2023-04-03"
  readMins: number;
  vector: Vector;
  tags: string[];
  title: string;
  dek: string; // chapeau : une phrase, pour la carte et l'en-tete
  fiche: ArticleFiche;
  sections: Section[];
  sources: { label: string; url: string }[];
}

// --- Schemas vectoriels (contenu de confiance, injecte tel quel). ----------
// Ils s'adaptent au theme via les variables CSS (var(--ink), var(--attack)...).

const SVG_TESLA_TIMING = `<svg viewBox="0 0 640 248" role="img" aria-label="Chronogramme : la chute de tension est calée sur la comparaison de signature">
  <text x="0" y="16" font-size="12" class="dg-faint">EXÉCUTION EN ROM (temps -&gt;)</text>
  <rect x="0" y="28" width="640" height="36" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="16" y="51" font-size="12" class="dg-soft">lit l'étage suivant</text>
  <rect x="244" y="26" width="156" height="40" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="322" y="51" text-anchor="middle" font-size="12">compare la signature</text>
  <text x="470" y="51" font-size="12" class="dg-soft">lance l'étage</text>
  <text x="0" y="108" font-size="12" class="dg-faint">TENSION DU COEUR (Vcore)</text>
  <path d="M0 156 H286 L300 156 L309 212 L329 212 L338 156 H640" fill="none" stroke="var(--ok)" stroke-width="2.5"/>
  <path d="M300 156 L309 212 L329 212 L338 156" fill="none" stroke="var(--attack)" stroke-width="3"/>
  <line x1="322" y1="66" x2="322" y2="150" stroke="var(--attack)" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="348" y="200" font-size="11" fill="var(--attack)">chute ~40 ns</text>
  <text x="0" y="240" font-size="12.5">Instruction sautée : la comparaison renvoie <tspan fill="var(--attack)">"valide"</tspan>, le code non signé est accepté.</text>
</svg>`;

const SVG_TESLA_SVI2 = `<svg viewBox="0 0 640 236" role="img" aria-label="Montage : un microcontrôleur injecte sur le bus SVI2 entre le processeur et son régulateur de tension">
  <rect x="16" y="40" width="210" height="122" rx="9" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="121" y="64" text-anchor="middle" font-size="13">SoC AMD Ryzen</text>
  <rect x="42" y="82" width="158" height="58" rx="7" fill="none" stroke="var(--powertrain)" stroke-width="2"/>
  <text x="121" y="106" text-anchor="middle" font-size="12.5" fill="var(--powertrain)">ASP / PSP</text>
  <text x="121" y="125" text-anchor="middle" font-size="10.5" class="dg-faint">racine de confiance</text>
  <rect x="438" y="58" width="186" height="86" rx="9" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="531" y="92" text-anchor="middle" font-size="13">Régulateur</text>
  <text x="531" y="114" text-anchor="middle" font-size="11" class="dg-faint">fournit Vcore</text>
  <line x1="226" y1="101" x2="438" y2="101" stroke="var(--accent)" stroke-width="2.5"/>
  <text x="332" y="92" text-anchor="middle" font-size="12.5" fill="var(--accent)" class="dg-mono">SVI2</text>
  <text x="332" y="120" text-anchor="middle" font-size="10.5" class="dg-faint">commande de tension</text>
  <line x1="332" y1="101" x2="332" y2="176" stroke="var(--attack)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="246" y="176" width="172" height="52" rx="7" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="332" y="199" text-anchor="middle" font-size="12" fill="var(--attack)">microcontrôleur (~100 $)</text>
  <text x="332" y="217" text-anchor="middle" font-size="10.5" fill="var(--attack)">injecte une commande de chute</text>
</svg>`;

const SVG_TESLA_BOOT = `<svg viewBox="0 0 540 324" role="img" aria-label="Chaîne de démarrage verticale et point d'injection du glitch">
  <defs><marker id="ahT" markerWidth="9" markerHeight="9" refX="4.5" refY="7" orient="auto"><path d="M0 0 L4.5 7 L9 0" fill="none" stroke="var(--ink-faint)" stroke-width="1.5"/></marker></defs>
  <rect x="24" y="6" width="252" height="44" rx="7" fill="var(--surface-2)" stroke="var(--attack)" stroke-width="2"/>
  <text x="150" y="27" text-anchor="middle" font-size="12.5">ROM masquée (ASP)</text>
  <text x="150" y="43" text-anchor="middle" font-size="10.5" class="dg-faint">gravée dans le silicium, immuable</text>
  <line x1="150" y1="50" x2="150" y2="68" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <text x="292" y="56" font-size="11" class="dg-soft">vérifie la signature de l'étage</text>
  <text x="292" y="70" font-size="11" fill="var(--attack)">GLITCH ici : vérification sautée</text>
  <rect x="24" y="74" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="99" text-anchor="middle" font-size="12.5">bootloader PSP</text>
  <line x1="150" y1="114" x2="150" y2="132" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="138" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="163" text-anchor="middle" font-size="12.5">ABL (chargeur AMD)</text>
  <line x1="150" y1="178" x2="150" y2="196" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="202" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="227" text-anchor="middle" font-size="12.5">UEFI</text>
  <line x1="150" y1="242" x2="150" y2="260" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="266" width="252" height="44" rx="7" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="150" y="287" text-anchor="middle" font-size="12.5">noyau Linux</text>
  <text x="150" y="303" text-anchor="middle" font-size="10.5" fill="var(--ok)">shell root, code non signé accepté</text>
  <text x="292" y="289" font-size="11" class="dg-soft">firmware patché</text>
  <text x="292" y="303" font-size="11" class="dg-soft">en remontant la chaîne</text>
</svg>`;

const SVG_CAN_TOPO = `<svg viewBox="0 0 640 232" role="img" aria-label="Topologie : le bus de contrôle, la passerelle et le bus moteur, avec le point d'injection au phare">
  <text x="30" y="20" font-size="11" class="dg-faint">BUS DE CONTRÔLE</text>
  <line x1="30" y1="70" x2="300" y2="70" stroke="var(--chassis)" stroke-width="3"/>
  <line x1="70" y1="70" x2="70" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="24" y="92" width="92" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="70" y="110" text-anchor="middle" font-size="11">récepteur</text>
  <text x="70" y="124" text-anchor="middle" font-size="11">de clé</text>
  <line x1="170" y1="70" x2="170" y2="92" stroke="var(--attack)" stroke-width="1.5"/>
  <rect x="126" y="92" width="88" height="40" rx="6" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="170" y="116" text-anchor="middle" font-size="11" fill="var(--attack)">phare avant</text>
  <line x1="262" y1="70" x2="262" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="222" y="92" width="76" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="260" y="116" text-anchor="middle" font-size="11">portes</text>
  <rect x="300" y="48" width="110" height="46" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="355" y="76" text-anchor="middle" font-size="12">passerelle</text>
  <text x="430" y="20" font-size="11" class="dg-faint">BUS MOTEUR</text>
  <line x1="410" y1="70" x2="620" y2="70" stroke="var(--powertrain)" stroke-width="3"/>
  <line x1="515" y1="70" x2="515" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="462" y="92" width="106" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="515" y="110" text-anchor="middle" font-size="11">moteur +</text>
  <text x="515" y="124" text-anchor="middle" font-size="11">immobiliseur</text>
  <rect x="104" y="170" width="132" height="46" rx="7" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="170" y="190" text-anchor="middle" font-size="11.5" fill="var(--attack)">injecteur</text>
  <text x="170" y="206" text-anchor="middle" font-size="10" fill="var(--attack)">branché sur le faisceau</text>
  <line x1="170" y1="132" x2="170" y2="170" stroke="var(--attack)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="300" y="112" font-size="10.5" class="dg-soft">relaie sans vérifier -&gt;</text>
</svg>`;

const SVG_CAN_OVERRIDE = `<svg viewBox="0 0 640 220" role="img" aria-label="L'injecteur maintient le bus récessif, fait reculer le noeud légitime et impose sa trame">
  <text x="152" y="18" font-size="11" class="dg-faint">temps -&gt;</text>
  <text x="0" y="48" font-size="11.5" class="dg-soft">Récepteur</text>
  <text x="0" y="62" font-size="11.5" class="dg-soft">de clé</text>
  <rect x="150" y="34" width="110" height="34" rx="5" fill="var(--surface-2)" stroke="var(--ok)"/>
  <text x="205" y="55" text-anchor="middle" font-size="10.5">"pas de clé"</text>
  <rect x="272" y="34" width="86" height="34" rx="5" fill="none" stroke="var(--attack)"/>
  <text x="315" y="55" text-anchor="middle" font-size="10.5" fill="var(--attack)">échec</text>
  <line x1="370" y1="51" x2="632" y2="51" stroke="var(--ink-faint)" stroke-width="1.2" stroke-dasharray="5 5"/>
  <text x="500" y="47" text-anchor="middle" font-size="10.5" class="dg-faint">recule, muet (reprise d'erreur)</text>
  <text x="0" y="120" font-size="11.5" class="dg-soft">Injecteur</text>
  <rect x="150" y="104" width="208" height="34" rx="5" fill="var(--surface-2)" stroke="var(--accent)"/>
  <text x="254" y="125" text-anchor="middle" font-size="10.5" fill="var(--accent)">maintient le bus récessif (bloque les autres)</text>
  <rect x="372" y="104" width="160" height="34" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="452" y="125" text-anchor="middle" font-size="10.5" fill="var(--attack)">émet "clé validée"</text>
  <text x="0" y="188" font-size="11.5" class="dg-soft">Ce que lit</text>
  <text x="0" y="202" font-size="11.5" class="dg-soft">le réseau</text>
  <rect x="372" y="172" width="160" height="34" rx="5" fill="var(--surface-2)" stroke="var(--attack)" stroke-width="2"/>
  <text x="452" y="193" text-anchor="middle" font-size="10.5" fill="var(--attack)">"clé validée" x20 / s</text>
  <line x1="452" y1="138" x2="452" y2="172" stroke="var(--attack)" stroke-width="1.2" stroke-dasharray="3 3"/>
</svg>`;

const SVG_CAN_SECOC = `<svg viewBox="0 0 640 210" role="img" aria-label="Avec SecOC, une trame porte un code d'authentification et un compteur de fraîcheur ; la trame forgée est rejetée">
  <text x="0" y="20" font-size="11" class="dg-faint">TRAME AUTHENTIFIÉE (SecOC)</text>
  <rect x="0" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="75" y="50" text-anchor="middle" font-size="11" class="dg-mono">0x043</text>
  <text x="75" y="64" text-anchor="middle" font-size="10" class="dg-faint">identifiant</text>
  <rect x="158" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="233" y="50" text-anchor="middle" font-size="11">données</text>
  <text x="233" y="64" text-anchor="middle" font-size="10" class="dg-faint">"clé validée"</text>
  <rect x="316" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="391" y="50" text-anchor="middle" font-size="11" fill="var(--ok)">MAC</text>
  <text x="391" y="64" text-anchor="middle" font-size="10" class="dg-faint">code d'authentification</text>
  <rect x="474" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="549" y="50" text-anchor="middle" font-size="11" fill="var(--ok)">compteur</text>
  <text x="549" y="64" text-anchor="middle" font-size="10" class="dg-faint">fraîcheur (anti-rejeu)</text>
  <text x="0" y="118" font-size="11" class="dg-faint">TRAME FORGÉE PAR L'INJECTEUR</text>
  <rect x="0" y="130" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="75" y="155" text-anchor="middle" font-size="11" class="dg-mono">0x043</text>
  <rect x="158" y="130" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="233" y="155" text-anchor="middle" font-size="11">données</text>
  <rect x="316" y="130" width="308" height="40" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="470" y="155" text-anchor="middle" font-size="11" fill="var(--attack)">MAC invalide (pas la clé) -&gt; trame rejetée</text>
</svg>`;

const fr: Article[] = [
  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 14,
    vector: "hardware",
    tags: ["Injection de faute", "Secure boot", "Racine de confiance", "AMD", "SVI2", "Jailbreak"],
    title: "Tesla : un glitch de tension pour briser la racine de confiance",
    dek:
      "En 2023, quatre chercheurs de la TU Berlin font trébucher le processeur sécurisé AMD d'une Tesla en perturbant son alimentation par le bus SVI2. Au bout : du code arbitraire sur la racine de confiance, l'extraction d'une clé d'identité, et un jailbreak que le logiciel ne peut pas corriger.",
    fiche: {
      cible: "Tesla à infodivertissement AMD Ryzen (la carte MCU dite MCU-Z), sur les Model 3, Y, S et X récentes.",
      entree: "Un accès physique à la carte MCU, précisément au bus SVI2 qui commande la tension du processeur sécurisé AMD (ASP).",
      methode:
        "Voltage glitching : une micro-chute de tension, calée à l'instant où la ROM vérifie la signature du firmware, fait sauter ce contrôle.",
      faille: "Une racine de confiance en ROM masquée, sans protection contre l'injection de faute : rien à corriger sur le terrain.",
    },
    sections: [
      {
        id: "contexte",
        heading: "La racine de confiance d'une Tesla",
        blocks: [
          {
            t: "p",
            text: "L'infodivertissement d'une Tesla récente tourne sur un processeur AMD Ryzen x86. Tout son démarrage est verrouillé par un composant à part, le processeur sécurisé AMD (ASP, aussi appelé PSP) : à la mise sous tension, c'est lui qui vérifie la signature de chaque étage logiciel avant de le lancer. Cette chaîne est la racine de confiance du système. Elle garde trois choses : l'activation des options payantes, la clé qui prouve l'identité de la voiture auprès du réseau de service Tesla, et le chiffrement des données utilisateur.",
          },
          {
            t: "p",
            text: `Casser ce maillon, c'est tout obtenir d'un coup. C'est exactement ce qu'a fait une équipe de la TU Berlin, dans deux exposés : "Jailbreaking an Electric Vehicle in 2023" à Black Hat USA, puis "Back in the Driver's Seat" au 37e Chaos Communication Congress.`,
          },
          {
            t: "note",
            text:
              `Travail de Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob et Oleg Drokin (TU Berlin). L'attaque réutilise un glitch AMD antérieur, "One Glitch to Rule Them All" (2021), dont Jacob est coauteur.`,
          },
        ],
      },
      {
        id: "glitch",
        heading: "Le voltage glitching, expliqué",
        blocks: [
          {
            t: "p",
            text: "Un processeur suppose une alimentation stable. Si on la fait chuter très brièvement, de quelques dizaines de nanosecondes, au moment précis où il exécute une instruction sensible, il trébuche : l'instruction est sautée ou mal exécutée. Appliquée pile sur la comparaison qui valide une signature, cette faute transforme un échec en succès.",
          },
          {
            t: "p",
            text: `Le point important : on n'attaque pas la cryptographie. La signature RSA reste solide ; on empêche simplement le processeur de la vérifier. La comparaison "la signature calculée est-elle égale à la signature attendue ?" renvoie "oui" alors qu'elle devrait renvoyer "non". Du code non signé passe comme s'il était légitime.`,
          },
          {
            t: "svg",
            caption: "La chute de tension est calée sur l'instruction de comparaison.",
            src: SVG_TESLA_TIMING,
          },
          {
            t: "p",
            text: "Toute la difficulté est dans le timing. Il faut repérer la fenêtre de quelques instants où la vérification a lieu, déclencher la coupure à cet instant, et recommencer jusqu'à ce que ça tombe juste. C'est long à caler ; une fois la fenêtre connue, l'attaque est reproductible.",
          },
          {
            t: "note",
            text:
              "Le glitch n'est pas persistant : il faut le rejouer à chaque démarrage pour franchir la vérification. En revanche, ce que l'on pose ensuite dans le système (modifications de configuration) peut survivre aux redémarrages.",
          },
        ],
      },
      {
        id: "svi2",
        heading: "Où frapper : le bus SVI2",
        blocks: [
          {
            t: "p",
            text: "Comment faire chuter la tension d'une puce qu'on n'ouvre pas ? L'astuce est que le processeur sécurisé commande lui-même sa tension de coeur. Il le fait par un petit bus série, le SVI2, qui pilote un régulateur de tension externe (le VRM) posé sur la carte. Ce bus de commande est accessible, et c'est là que l'attaquant se branche.",
          },
          {
            t: "p",
            text: "Un microcontrôleur à une centaine de dollars, câblé sur le SVI2, injecte une commande forgée qui ordonne au régulateur une chute de tension très courte. En calant cette chute sur la fenêtre de vérification, on obtient la faute voulue sans jamais toucher au silicium du processeur.",
          },
          {
            t: "svg",
            caption: "Le microcontrôleur injecte sur le bus de commande de tension, entre l'ASP et le régulateur.",
            src: SVG_TESLA_SVI2,
          },
          {
            t: "p",
            text: `C'est le coeur de "One Glitch to Rule Them All" (Buhren et coll., 2021), que l'équipe Tesla réutilise : le code d'amorçage en ROM charge l'étage suivant depuis la mémoire flash et en vérifie la signature RSA ; le glitch frappe cette vérification ; une seule faute réussie suffit à faire exécuter à la ROM du code choisi par l'attaquant.`,
          },
        ],
      },
      {
        id: "chaine",
        heading: "La chaîne de démarrage et le firmware patché",
        blocks: [
          {
            t: "p",
            text: "Une fois la ROM franchie, il reste à enchaîner tous les étages. L'équipe patche le firmware en remontant la chaîne, du dernier étage vers le premier. Problème : un étage modifié n'a plus le bon condensat (hash), et l'étage précédent, qui le vérifie, refuserait de le lancer. La parade est de combiner les deux : le glitch neutralise la vérification de la ROM, ce qui laisse passer la chaîne patchée jusqu'au bout. Résultat : un shell root sur le Linux de l'infodivertissement.",
          },
          {
            t: "svg",
            caption: "Le glitch casse le premier verrou ; le firmware patché fait le reste.",
            src: SVG_TESLA_BOOT,
          },
          {
            t: "ol",
            items: [
              "Démonter la carte MCU, repérer le bus SVI2 et le régulateur qui alimente le coeur du processeur sécurisé.",
              "Câbler un microcontrôleur (environ 100 $) sur le SVI2, et un oscilloscope pour observer le démarrage.",
              "Situer la fenêtre où la ROM vérifie la signature de l'étage suivant.",
              "Injecter une commande de chute de tension calée sur cette comparaison, et répéter jusqu'à ce que la faute tombe juste.",
              "Faire accepter l'étage d'amorçage patché : la racine de confiance exécute désormais du code non signé.",
              "Dérouler la chaîne patchée (bootloader, ABL, UEFI, Linux) jusqu'à un accès root persistant.",
              "Extraire les secrets liés à la puce : la clé d'identité et les clés qui chiffrent les données.",
            ],
          },
        ],
      },
      {
        id: "butin",
        heading: "Ce que le glitch débloque",
        blocks: [
          {
            t: "table",
            caption: "Une seule faute ouvre quatre portes.",
            head: ["Capacité obtenue", "Ce que ça donne concrètement"],
            rows: [
              ["Jailbreak persistant", "Un accès root sur le Linux de l'infodivertissement, qui survit aux redémarrages et aux mises à jour."],
              ["Extraction de la clé d'identité", "La clé liée au matériel qui authentifie la voiture auprès du réseau Tesla : de quoi migrer, voire cloner, l'identité d'un véhicule."],
              ["Options payantes", "Sièges chauffants, boost d'accélération et autres fonctions verrouillées par logiciel, activées sans payer (une simple bascule de configuration, donc persistante)."],
              ["Données utilisateur", "Le déchiffrement des données personnelles chiffrées par le système : carnet d'adresses, agenda, historique de position, sessions de service."],
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "L'outillage",
        blocks: [
          {
            t: "deflist",
            items: [
              { term: "Microcontrôleur sur SVI2 (environ 100 $)", def: "Un Teensy ou équivalent, câblé sur le bus de commande de tension. Il forge la commande de chute. C'est le coeur de l'attaque, et ça ne coûte presque rien." },
              { term: "Oscilloscope / analyseur logique", def: "Pour observer le démarrage et trouver la fenêtre temporelle où la vérification a lieu." },
              { term: "Fer à souder et accès physique", def: "Il faut ouvrir la carte MCU et se brancher sur le SVI2 et le rail d'alimentation." },
              { term: "Art antérieur", def: "Le glitch AMD de 'One Glitch to Rule Them All' (2021), puis le suivi de l'équipe en 2025, 'Three Glitches to Rule One Car' (ASIACCS), sur l'ordinateur d'assistance à la conduite." },
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Ce qui a péché",
        blocks: [
          {
            t: "ul",
            items: [
              "La racine de confiance suppose que la ROM applique toujours sa vérification. L'injection de faute brise cette hypothèse : on n'attaque pas la crypto, on empêche le processeur de la vérifier.",
              "Le processeur commande lui-même sa tension par le SVI2 : ce bus de commande est un point d'injection accessible sur la carte.",
              "Le code d'amorçage vit dans une ROM masquée, gravée dans le silicium : il n'est pas corrigeable par mise à jour.",
              "La puce ne détecte pas les anomalies d'alimentation (pas de détecteur de glitch, pas de double vérification) : une faute unique suffit.",
            ],
          },
        ],
      },
      {
        id: "patch",
        heading: "Pourquoi ça ne se corrige pas",
        blocks: [
          {
            t: "p",
            text: "Le code d'amorçage vit en ROM masquée, c'est-à-dire gravée dans le silicium à la fabrication. Un correctif logiciel ne peut rien y ajouter : impossible de poser une contre-mesure là où la faute frappe. Et comme l'attaque ne casse pas la cryptographie mais la contourne, renforcer les clés ou les signatures ne change rien.",
          },
          {
            t: "p",
            text: "La seule vraie parade est matérielle : du silicium résistant à l'injection de faute (détecteurs de tension et d'horloge, double vérification, rampes de tension internes). Autrement dit, remplacer la puce. Comme AMD équipe aussi d'autres constructeurs, la classe de problème dépasse Tesla. Côté serveur, Tesla peut limiter la valeur d'une clé extraite en durcissant la ré-authentification des véhicules (approche zero trust).",
          },
          {
            t: "note",
            text:
              "En 2025, la même équipe a enchaîné avec 'Three Glitches to Rule One Car' (ASIACCS), en portant l'approche sur l'ordinateur d'assistance à la conduite.",
          },
        ],
      },
      {
        id: "portee",
        heading: "Portée et limites",
        blocks: [
          {
            t: "p",
            text: "Ce n'est pas un vol de masse à distance : il faut un accès physique, du matériel, et du temps de mise au point par exemplaire. Mais sur un point c'est pire qu'un vol : l'attaque brise une ancre de confiance matérielle et permet de cloner l'identité d'un véhicule. Et comme la faille est dans le silicium, elle ne se corrige pas par logiciel.",
          },
        ],
      },
    ],
    sources: [
      { label: "Christian Werling (TU Berlin) : page de recherche et publications", url: "https://www.user.tu-berlin.de/cwerling/" },
      { label: "Mayhem Security : Jailbreaking Teslas at Black Hat USA 2023", url: "https://www.mayhem.security/blog/jailbreaking-teslas-at-black-hat-usa-2023" },
      { label: "VicOne : Tesla jailbreak via firmware patching and voltage glitching", url: "https://vicone.com/blog/tesla-jailbreak-unlocks-features-via-firmware-patching-and-voltage-glitching" },
      { label: "Hackaday : jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "One Glitch to Rule Them All : fault injection contre l'ASP AMD (arXiv)", url: "https://arxiv.org/abs/2108.04575" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 14,
    vector: "can",
    tags: ["Bus CAN", "Injection de trame", "Arbitrage", "Vol sans cle", "Passerelle", "SecOC"],
    title: "Vol par le phare : l'anatomie d'une injection CAN",
    dek:
      "En 2023, Ian Tabor et Ken Tindell remontent le vol de leur RAV4 jusqu'à un fil de phare. Derrière, une attaque qui ne demande ni clé ni prise OBD : forcer le bus CAN à croire une trame forgée, en faisant taire le noeud légitime. On décortique le mécanisme, l'outillage et les parades.",
    fiche: {
      cible: "Toyota RAV4, et des dizaines de modèles (Lexus, Jeep, Nissan, VW, Maserati...) visés par les mêmes boîtiers.",
      entree: "Le faisceau du phare avant, un point du bus CAN de contrôle accessible en forçant le pare-chocs.",
      methode:
        "Un boîtier impose en boucle une trame qui usurpe le récepteur de la clé, tout en maintenant le bus récessif pour faire taire le noeud légitime ; la passerelle la relaie sans contrôle.",
      faille: "Le CAN n'authentifie aucun message et la passerelle relaie entre domaines sans vérifier : une trame bien formée est crue sur parole.",
    },
    sections: [
      {
        id: "contexte",
        heading: "Le vol qui a tout documenté",
        blocks: [
          {
            t: "p",
            text: "La RAV4 d'Ian Tabor est d'abord vandalisée (pare-chocs arraché, connecteur de phare débranché), puis volée quelques jours plus tard. Avant le vol, la voiture a enregistré des codes défaut signalant une perte de communication avec le calculateur du phare et avec le réseau CAN. Avec Ken Tindell, directeur technique de Canis Automotive Labs, Tabor remonte le fil jusqu'au faisceau du phare avant, et met au jour une méthode devenue une petite industrie.",
          },
          {
            t: "note",
            text:
              "L'injecteur était vendu clé en main aux voleurs, caché dans un faux haut-parleur Bluetooth avec un bouton de déclenchement : une dizaine de dollars de composants pour voler une voiture en une minute environ.",
          },
        ],
      },
      {
        id: "architecture",
        heading: "La cible : un bus bavard, zéro authentification",
        blocks: [
          {
            t: "p",
            text: "Une voiture n'a pas un seul bus CAN mais plusieurs, reliés par une passerelle centrale. Sur le bus de contrôle circulent les messages du récepteur de la clé. Le phare avant est branché sur ce même bus : atteindre son connecteur, c'est atteindre le bus qui porte l'autorisation de démarrer. Le problème de fond : sur un CAN, aucun message n'est signé, et la passerelle recopie certaines trames d'un bus à l'autre sans les vérifier.",
          },
          {
            t: "svg",
            caption: "Le phare partage le bus de contrôle avec le récepteur de clé ; la passerelle relaie vers le moteur.",
            src: SVG_CAN_TOPO,
          },
          {
            t: "duo",
            aTitle: "Ce que le réseau suppose",
            a: [
              "Seuls des calculateurs d'origine parlent sur le bus.",
              "Une trame bien formée vient forcément d'un noeud légitime.",
              "La passerelle relaie ce qui est utile entre domaines.",
            ],
            bTitle: "Ce que l'attaquant exploite",
            b: [
              "N'importe quel noeud posé sur le fil peut émettre.",
              "Rien ne distingue une trame forgée d'une vraie.",
              "La passerelle relaie donc aussi la trame forgée.",
            ],
          },
        ],
      },
      {
        id: "injection",
        heading: "L'injection CAN, le vrai tour de force",
        blocks: [
          {
            t: "p",
            text: `Le point subtil : le vrai calculateur de la clé continue d'émettre, lui, son message légitime ("pas de clé présente"). Il ne suffit donc pas d'ajouter une trame, il faut imposer la sienne et faire taire l'authentique.`,
          },
          {
            t: "p",
            text: "Le CAN arbitre bit à bit : un bit dominant (0) écrase un bit récessif (1), et l'identifiant le plus bas gagne. Mais gagner l'arbitrage ne suffit pas : un récepteur qui détecte une incohérence peut détruire la trame en émettant un drapeau d'erreur. L'injecteur doit donc neutraliser aussi ce mécanisme.",
          },
          {
            t: "p",
            text: `La ruse est matérielle. Le boîtier émet d'abord une trame de réveil en boucle, jusqu'à voir passer la trame d'un calculateur déjà réveillé. Il active alors un transceiver modifié qui maintient le bus à l'état récessif, ce qui "bloque les autres noeuds CAN d'émettre". Les calculateurs légitimes qui essaient échouent, passent en reprise d'erreur et reculent. Surtout, cet override bloque aussi le signalement d'erreur qui permettrait à un récepteur de détruire la trame forgée.`,
          },
          {
            t: "svg",
            caption: "L'injecteur maintient le bus récessif, fait reculer le noeud légitime, puis impose sa trame.",
            src: SVG_CAN_OVERRIDE,
          },
          {
            t: "note",
            text:
              "C'est ce qui distingue l'injection CAN d'un simple rejeu : l'attaquant neutralise la source authentique et la détection d'erreur, au lieu d'ajouter du bruit par-dessus. Nuance relevée par Tindell : quand plusieurs récepteurs acquittent en même temps, leur courant combiné peut dépasser l'override, mais la trame forgée passe quand même.",
          },
        ],
      },
      {
        id: "rafale",
        heading: "La rafale à 20 Hz et la passerelle",
        blocks: [
          {
            t: "p",
            text: `Pourquoi répéter la trame une vingtaine de fois par seconde ? Parce que la passerelle est fragile : quand elle ne parvient plus à communiquer (pendant l'override), son contrôleur CAN se réinitialise, et elle rate des trames. En martelant la rafale à environ 20 Hz, l'injecteur s'assure qu'au moins une passe au moment où la passerelle rouvre l'oreille. Elle relaie alors le message "clé validée" vers le réseau du moteur, et l'immobiliseur se désactive.`,
          },
          {
            t: "frame",
            caption: "Illustration pédagogique : la rafale forgée (en rouge) au milieu du trafic normal. Identifiants fictifs.",
            lines: [
              { text: "0x120  moteur        régime 820 tr/min        trame normale", mark: "ok" },
              { text: "0x043  récepteur clé  'pas de clé présente'    trame normale", mark: "ok" },
              { text: "0x043  INJECTÉ       'clé validée'  x20 / s     rafale forgée", mark: "hl" },
              { text: "passerelle  relaie 0x043 vers le réseau moteur, sans contrôle", mark: "hl" },
              { text: "immobiliseur désactivé, moteur autorisé à démarrer", mark: "ok" },
            ],
          },
        ],
      },
      {
        id: "chaine",
        heading: "La chaîne d'exploitation, pas à pas",
        blocks: [
          {
            t: "ol",
            items: [
              "Forcer le pare-chocs ou le phare pour exposer les fils du faisceau.",
              "Se brancher sur les deux fils du bus, CAN-H et CAN-L.",
              "Émettre une trame de réveil en boucle jusqu'à voir le réseau répondre.",
              "Activer l'override : maintenir le bus récessif pour faire taire les noeuds légitimes et bloquer la détection d'erreur.",
              "Émettre la rafale (environ vingt fois par seconde) usurpant le récepteur de la clé : le message 'clé validée'.",
              "L'immobiliseur, croyant la clé présente, se désactive.",
              "La passerelle relaie la trame vers le réseau du moteur, sans la vérifier.",
              "Un second message, déclenché par le bouton du boîtier, commande le déverrouillage des portes.",
              "Le voleur monte et démarre : la voiture part en une minute environ, sans la clé.",
            ],
          },
        ],
      },
      {
        id: "banc",
        heading: "Comment on l'observe et on le rejoue sur un banc",
        blocks: [
          {
            t: "p",
            text: "On n'a pas besoin d'une vraie voiture pour comprendre la méthode. Sur un bus virtuel ou un banc à deux calculateurs, la démarche est toujours la même : provoquer une action, observer la trame qui change, puis la rejouer. C'est exactement ce que propose l'Atelier de ce site. Les commandes ci-dessous travaillent sur une interface de test (vcan0), jamais sur un véhicule.",
          },
          {
            t: "code",
            caption: "Observer, isoler, rejouer (sur banc de test).",
            lines: [
              "# ecouter tout le trafic du bus de test",
              "candump vcan0",
              "",
              "# reperer la trame qui bouge quand on agit (diff avant / apres)",
              "cansniffer vcan0",
              "",
              "# rejouer une trame reperee (identifiant#donnees, valeurs d'exemple)",
              "cansend vcan0 043#01",
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "L'outillage, des deux côtés",
        blocks: [
          {
            t: "table",
            caption: "Le boîtier du voleur coûte une dizaine de dollars ; l'analyse se fait avec des outils publics.",
            head: ["Élément", "Camp", "À quoi ça sert"],
            rows: [
              ["Microcontroleur PIC18F avec CAN", "Voleur", "Génère et cadence les trames forgées ; firmware verrouillé en lecture."],
              ["Transceiver modifié + circuit d'override", "Voleur", "Maintient le bus récessif : fait taire les autres noeuds et bloque le signalement d'erreur."],
              ["Faux haut-parleur Bluetooth", "Voleur", "Boîtier, batterie et bouton : camoufle l'injecteur, l'alimente et le déclenche."],
              ["Interface CAN (CANable, CANtact...)", "Analyste", "Brancher un PC sur le bus pour lire et émettre."],
              ["can-utils (candump, cansniffer, cansend)", "Analyste", "Capturer, filtrer et rejouer les trames."],
              ["SavvyCAN", "Analyste", "Visualiser et comparer les captures, retrouver le signal utile."],
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Ce qui a péché",
        blocks: [
          {
            t: "ul",
            items: [
              "Le CAN n'authentifie aucun message : un noeud capable de poser des bits est cru sur parole.",
              "La passerelle recopie des trames entre domaines sans vérifier leur origine.",
              "L'immobiliseur fonde une décision de sécurité sur une simple assertion du bus.",
              "Un périphérique non critique (le phare) donne accès à un bus critique.",
              "La détection d'erreur elle-même peut être neutralisée par l'override : un simple garde-fou naïf ne suffit pas.",
            ],
          },
        ],
      },
      {
        id: "patch",
        heading: "La parade, et où la tester ici",
        blocks: [
          {
            t: "p",
            text: "Parade rapide, mais fragile : la passerelle ne relaie une trame de clé que si ses propres émissions récentes ont réussi et qu'aucune erreur dominante vers récessive n'a eu lieu juste avant. Tindell la résume par la maxime de Fleming : une fois le hasard, deux fois la coïncidence, trois fois l'action ennemie. Un attaquant qui adapte son boîtier peut la contourner.",
          },
          {
            t: "p",
            text: "La réponse de fond est l'authentification des messages. SecOC (AUTOSAR) ajoute à chaque trame un code d'authentification (MAC) et un compteur de fraîcheur : une trame forgée ou rejouée est rejetée. Canis pousse la même idée avec CryptoCAN (une paire de trames chiffrées transporte une trame en clair). Un module de sécurité émulé en logiciel (SHE) tient en environ 3 Ko de code, 200 octets de RAM et 40 microsecondes par message : c'est à la portée d'un petit calculateur.",
          },
          {
            t: "svg",
            caption: "Avec SecOC, le MAC et le compteur de fraîcheur rejettent la trame forgée.",
            src: SVG_CAN_SECOC,
          },
          {
            t: "p",
            text: "La segmentation aide en complément, en empêchant un noeud du réseau avant de parler directement au calculateur moteur. Attention : la détection seule ne suffit pas ici. Des dispositifs comme NXP Stinger ou Canis CAN-HG détruisent une trame forgée par une erreur CAN, mais l'override empêche justement tout noeud de signaler cette erreur.",
          },
          {
            t: "p",
            text: "Ces deux parades, SecOC et segmentation, sont des interrupteurs que vous pouvez activer sur l'Explorateur pour voir le chemin d'attaque se faire bloquer. Et la méthode provoquer, observer, rejouer se manipule dans l'Atelier, sur bus virtuel.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell : CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "CAN in Automation : The CAN Injection attack (Tindell, PDF)", url: "https://www.can-cia.org/fileadmin/cia/documents/publications/cnlm/june_2023/cnlm_23-2_p20_the_can_injection_attack_ken_tindel_canis_automotive_labs.pdf" },
      { label: "SecurityWeek : thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive : stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
      { label: "NVD : CVE-2023-29389", url: "https://nvd.nist.gov/vuln/detail/CVE-2023-29389" },
    ],
  },
];

// Du plus recent au plus ancien.
function byDateDesc(list: Article[]): Article[] {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const overrides: Record<Exclude<Lang, "fr">, Article[] | null> = { de: articlesDe, en: articlesEn };

export function getArticles(lang: Lang): Article[] {
  const base = lang === "fr" ? fr : overrides[lang] ?? fr;
  return byDateDesc(base);
}

export function getArticle(slug: string, lang: Lang): Article | undefined {
  return getArticles(lang).find((a) => a.slug === slug) ?? fr.find((a) => a.slug === slug);
}

// Pour le garde-fou de structure (DEV) : expose les sections d'un article.
export function articleBlocks(a: Article): Block[] {
  return a.sections.flatMap((s) => s.blocks);
}

export { fr as articlesFr };
