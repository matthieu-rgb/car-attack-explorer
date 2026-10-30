import type { Attack } from "./types";

// Catalogue verifie. Les "methode" restent conceptuelles (pas de mode operatoire
// exploitable). Les outils sont cites a titre de repere pedagogique.
// Les identifiants et trames sont des exemples, pas les valeurs d'un constructeur.

export const attacks: Attack[] = [
  // ---------------------------------------------------------------- Couche A
  {
    id: "A1",
    layer: "A",
    level: "debutant",
    nom: "Écoute passive du bus (sniffing)",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["powertrain", "chassis", "bodyd", "info"],
    resume:
      "Écouter tout ce qui circule sur le bus. Rien n'est chiffré, donc tout est lisible.",
    principe:
      "Le CAN est un bus de diffusion : chaque trame est reçue par tous les noeuds. Un équipement branché sur le bus lit l'intégralité du trafic sans se faire remarquer.",
    pourquoi:
      "Le CAN a été conçu en 1986 pour la fiabilité et le temps réel, pas pour la sécurité. Les trames circulent en clair, sans chiffrement ni contrôle d'accès : lire n'exige qu'un transceiver CAN et de quoi décoder.",
    methode: [
      "Se brancher sur un point d'accès au bus, le plus souvent la prise OBD-II",
      "Capturer le trafic en continu",
      "Observer les identifiants, leur fréquence et les octets qui changent",
    ],
    prerequis: ["Accès physique au bus (OBD-II ou faisceau)", "Une interface CAN et un décodeur"],
    effet:
      "Toutes les trames du véhicule deviennent visibles ; on compte les identifiants et on reconstitue peu à peu la carte du trafic.",
    remediations: [
      "Contrôle d'accès physique à la prise diagnostic",
      "Détection d'équipement non autorisé sur le bus (IDS)",
      "Chiffrement du bus (rare et coûteux, peu répandu)",
    ],
    annexe5: "Famille 2 (canaux de communication). SecOC protège l'authenticité, pas la confidentialité.",
    outils: ["candump", "Wireshark", "SavvyCAN"],
    casReel:
      "Point de départ de la quasi-totalité des travaux publics de car hacking, du Car Hacker's Handbook aux démonstrations de Miller et Valasek.",
    frame: {
      caption: "Trafic brut capturé sur le bus (exemple)",
      lines: [
        { text: "can0  18F  [8]  1A 00 64 00 00 00 00 12" },
        { text: "can0  0C9  [8]  20 83 00 00 FF 00 00 00" },
        { text: "can0  244  [8]  00 00 00 2D 00 00 00 00   <- tout est en clair", mark: "hl" },
      ],
    },
    blockedBy: [],
    verdictPass:
      "L'écoute reste possible : aucune contre-mesure du modèle ne protège la confidentialité du bus. C'est le socle de toutes les attaques suivantes.",
    verdictBlock: "",
  },
  {
    id: "A2",
    layer: "A",
    level: "debutant",
    nom: "Rétro-ingénierie des identifiants",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["powertrain", "chassis", "bodyd"],
    resume:
      "Relier un identifiant et des octets à une vraie fonction du véhicule (vitesse, clignotant, portes).",
    principe:
      "En agissant sur une commande physique et en observant ce qui change sur le bus, on isole l'identifiant et les octets responsables de la fonction.",
    pourquoi:
      "Les identifiants ne sont pas documentés publiquement, mais ils sont stables et déterministes : la même action produit toujours la même trame. La corrélation action/trame suffit à reconstruire la cartographie.",
    methode: [
      "Capturer en continu pendant qu'on actionne une fonction",
      "Filtrer les trames qui bougent au moment de l'action",
      "Isoler l'identifiant et l'octet de consigne, puis vérifier en rejouant",
    ],
    prerequis: ["Accès au bus", "Accès aux commandes physiques du véhicule"],
    effet:
      "Dans l'appli, actionner une fonction met en évidence l'identifiant correspondant dans le moniteur.",
    remediations: [
      "Obfuscation des identifiants (protection faible)",
      "Défense en profondeur en aval : SecOC, segmentation",
    ],
    annexe5: "Famille 2. Étape de reconnaissance qui prépare l'injection et le rejeu.",
    outils: ["cansniffer", "caringcaribou", "SavvyCAN"],
    casReel:
      "Méthode standard de toute analyse CAN ; au coeur des vols par injection CAN documentés en 2023 (Ian Tabor, Ken Tindell).",
    blockedBy: [],
    verdictPass:
      "La cartographie reste faisable : elle ne dépend que de l'écoute et de l'observation, qu'aucune contre-mesure du modèle n'empêche.",
    verdictBlock: "",
  },
  {
    id: "A3",
    layer: "A",
    level: "debutant",
    nom: "Rejeu d'une trame capturée (replay)",
    disrupt: "inject",
    entry: "obd",
    route: ["entry:obd", "gateway", "bcm"],
    target: "bcm",
    resume:
      "Capturer une trame légitime, par exemple le déverrouillage des portes, et la réémettre telle quelle.",
    principe:
      "Le CAN de base n'a aucune notion de fraîcheur. Une trame rejouée est strictement identique à l'originale : le calculateur ne peut pas les distinguer.",
    pourquoi:
      "Sans compteur ni horodatage authentifié, rien ne lie une trame à un instant. Le récepteur agit sur le contenu, pas sur l'origine ni l'ancienneté du message.",
    methode: [
      "Sniffer et identifier la trame de l'action visée",
      "La stocker",
      "La réémettre au moment voulu",
    ],
    prerequis: ["Accès au bus", "La trame cible déjà capturée"],
    effet: "L'action rejouée s'exécute : par exemple, les portes se déverrouillent.",
    remediations: [
      "SecOC : compteur de fraîcheur + code d'authentification (une trame déjà vue est rejetée)",
      "Compteurs anti-rejeu applicatifs",
    ],
    annexe5: "Famille 2.",
    outils: ["canplayer", "SavvyCAN"],
    casReel: "Classique sur les commandes de confort non authentifiées (portes, vitres, klaxon).",
    blockedBy: ["secoc"],
    verdictPass:
      "Sans SecOC, la trame rejouée est acceptée comme neuve : l'action se reproduit à volonté.",
    verdictBlock:
      "SecOC rejette la trame : son compteur de fraîcheur a déjà été vu, le code d'authentification ne correspond plus. Le rejeu échoue.",
  },
  {
    id: "A4",
    layer: "A",
    level: "debutant",
    nom: "Injection d'une trame forgée (spoofing)",
    disrupt: "inject",
    entry: "obd",
    route: ["entry:obd", "gateway", "ic"],
    target: "ic",
    resume:
      "Forger une trame avec un identifiant légitime et la valeur de son choix. Le récepteur la croit authentique.",
    principe:
      "Sur le CAN, l'identifiant est une étiquette de message, pas une adresse d'émetteur. N'importe quel noeud peut émettre n'importe quel identifiant.",
    pourquoi:
      "Aucun champ ne désigne l'émetteur et aucune signature ne protège le contenu. En émettant la trame plus souvent que la source légitime, l'attaquant impose sa valeur (il gagne l'arbitrage ou noie la vraie trame).",
    methode: [
      "Connaître l'identifiant et le format de la cible (via A2)",
      "Forger la trame avec la valeur voulue",
      "L'émettre à haute fréquence pour l'emporter sur la source légitime",
    ],
    prerequis: ["Accès au bus", "Identifiant cible connu"],
    effet:
      "Le tableau de bord affiche une fausse vitesse, ou une fausse commande est envoyée à un calculateur.",
    remediations: [
      "SecOC : code d'authentification (MAC) invalide pour une trame forgée",
      "Segmentation pour limiter la portée d'un noeud compromis",
    ],
    annexe5: "Famille 2.",
    outils: ["cansend", "cangen", "caringcaribou"],
    casReel:
      "Vols par injection CAN en 2022-2023 : un module branché sur le faisceau d'un phare injecte la trame de déverrouillage/démarrage (Tabor, Tindell).",
    frame: {
      caption: "Injection sur le bus (exemple pédagogique)",
      lines: [
        { text: "0C9#FF 20 00 00 00 00 00 00   trame forgee, emise a 100 Hz", mark: "hl" },
        { text: "0C9#00 14 00 00 00 00 00 00   trame legitime, noyee" },
        { text: "        ^^ octet de consigne : la frequence fait gagner l'attaquant" },
      ],
    },
    blockedBy: ["secoc"],
    verdictPass:
      "Sans SecOC, le récepteur ne peut pas distinguer la trame forgée de la vraie : la fausse valeur est prise en compte.",
    verdictBlock:
      "SecOC vérifie le code d'authentification : la trame forgée n'a pas de MAC valide et elle est rejetée.",
  },
  {
    id: "A5",
    layer: "A",
    level: "debutant",
    nom: "Fuzzing du bus",
    disrupt: "flood",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["powertrain", "chassis", "bodyd", "info"],
    resume:
      "Noyer le bus de trames aléatoires pour provoquer des comportements inattendus ou faire planter un calculateur.",
    principe:
      "En envoyant des identifiants et des données aléatoires, on déclenche parfois une fonction par accident ou on met un calculateur dans un état non prévu.",
    pourquoi:
      "Les calculateurs ne valident pas toujours strictement leurs entrées. Une combinaison non testée peut franchir une vérification absente et atteindre du code fragile.",
    methode: [
      "Générer en masse des trames aléatoires ou semi-dirigées",
      "Observer les anomalies (voyants, fonctions, plantages)",
      "Restreindre l'espace de recherche autour des anomalies trouvées",
    ],
    prerequis: ["Accès au bus"],
    effet:
      "Comportements erratiques : clignotants, voyants qui s'allument, calculateur qui se fige.",
    remediations: [
      "Validation stricte des entrées côté calculateur",
      "SecOC (la plupart des trames forgées rejetées)",
      "Tests de robustesse dès la conception",
    ],
    annexe5: "Famille 7 (vulnérabilités non traitées).",
    outils: ["cangen", "caringcaribou", "scripts python-can"],
    casReel: "Technique de découverte employée dans la recherche académique et les audits constructeurs.",
    blockedBy: ["secoc"],
    verdictPass:
      "Sans authentification, les trames aléatoires atteignent les calculateurs et peuvent déclencher des comportements imprévus.",
    verdictBlock:
      "SecOC rejette la grande majorité des trames forgées avant qu'elles n'atteignent la logique applicative, ce qui réduit fortement la surface du fuzzing.",
  },
  {
    id: "A6",
    layer: "A",
    level: "debutant",
    nom: "Déni de service par saturation du bus",
    disrupt: "flood",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["powertrain", "chassis", "bodyd", "info"],
    resume:
      "Monopoliser le bus avec des trames de priorité maximale. Plus rien d'autre ne passe.",
    principe:
      "L'arbitrage du CAN donne la priorité à l'identifiant le plus bas (bits dominants). En émettant en continu l'identifiant 0x000, l'attaquant gagne toujours l'arbitrage.",
    pourquoi:
      "La priorité par arbitrage est un mécanisme natif du protocole, indépendant du contenu ou de l'authenticité. Un flot de 0x000 est parfaitement conforme au CAN : rien ne le distingue d'un trafic légitime prioritaire.",
    methode: [
      "Émettre sans interruption des trames de plus haute priorité (0x000)",
      "Maintenir le flot pour empêcher tout autre noeud d'accéder au bus",
    ],
    prerequis: ["Accès au bus"],
    effet:
      "Le bus se sature, le trafic légitime cesse, le tableau de bord se fige. Bannière \"bus saturé\".",
    remediations: [
      "Détection d'intrusion embarquée (IDS) qui repère le flot anormal",
      "Filtrage et redondance des liens critiques",
    ],
    annexe5: "Famille 2, sous l'angle disponibilité.",
    outils: ["cangen en mode flood"],
    casReel:
      "Le déni de service illustre une limite majeure : aucune authentification de message n'empêche de saturer un média partagé.",
    blockedBy: [],
    verdictPass:
      "Point pédagogique clé : SecOC n'y change rien. Authentifier les messages n'empêche pas de saturer le média. Seul un IDS ou de la redondance aide, et le bus reste indisponible.",
    verdictBlock: "",
  },
  {
    id: "A7",
    layer: "A",
    level: "avance",
    nom: "Mise en bus-off d'un calculateur",
    disrupt: "silence",
    entry: "obd",
    route: ["entry:obd", "gateway", "ecm"],
    target: "ecm",
    resume:
      "Forcer un calculateur légitime à se déconnecter du bus, puis prendre sa place.",
    principe:
      "On exploite la gestion d'erreur du CAN. En provoquant des erreurs ciblées pendant les émissions d'un calculateur, on fait grimper son compteur d'erreur jusqu'à l'état bus-off : il se tait. L'attaquant usurpe alors son identifiant sans concurrence.",
    pourquoi:
      "Le mécanisme de confinement d'erreur (TEC/REC, passage en error-passive puis bus-off) est automatique et obligatoire. Détourné, il devient une arme : la victime s'auto-exclut en croyant être défaillante.",
    methode: [
      "Synchroniser une injection de bit d'erreur sur les trames de la cible",
      "Faire monter son compteur d'erreur jusqu'au bus-off",
      "Émettre à sa place une fois la cible silencieuse",
    ],
    prerequis: ["Accès au bus", "Maîtrise fine du timing (matériel adapté)"],
    effet: "Un calculateur s'éteint sur le schéma ; un noeud attaquant reprend son identifiant.",
    remediations: [
      "Surveillance des compteurs d'erreur (remontée anormale)",
      "IDS embarqué",
      "SecOC pour l'authenticité une fois l'usurpation tentée",
    ],
    annexe5: "Famille 2.",
    outils: ["recherche académique", "matériel CAN spécialisé"],
    casReel: "Décrite dans la littérature académique (bus-off attack, 2016).",
    blockedBy: ["secoc"],
    verdictPass:
      "Sans SecOC, une fois la cible en bus-off, l'attaquant émet sous son identité sans être contredit.",
    verdictBlock:
      "SecOC limite l'usurpation applicative : même la cible réduite au silence, les trames de l'attaquant n'ont pas de MAC valide. Un IDS détecte en plus la montée des compteurs d'erreur.",
  },
  {
    id: "A8",
    layer: "A",
    level: "avance",
    nom: "Homme du milieu par pont de bus",
    disrupt: "inject",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    target: "gateway",
    resume:
      "Couper physiquement le bus en deux et s'insérer au milieu pour relayer, modifier ou bloquer les trames.",
    principe:
      "Comme le CAN est diffusé, un vrai homme du milieu impose de segmenter physiquement le bus avec un dispositif à deux interfaces, qui décide trame par trame ce qui passe.",
    pourquoi:
      "Sur un média partagé, on ne peut pas s'intercaler logiquement entre deux noeuds : il faut casser le segment. Une fois le pont en place, l'attaquant a le contrôle total du flux entre les deux moitiés.",
    methode: [
      "Scinder le bus à l'endroit choisi",
      "Insérer le dispositif pont à deux interfaces CAN",
      "Filtrer, retarder ou modifier les trames relayées",
    ],
    prerequis: ["Accès physique étendu au faisceau", "Matériel à deux interfaces CAN"],
    effet: "Un dispositif apparaît sur le bus ; les trames transitent par lui et peuvent être altérées.",
    remediations: [
      "Intégrité physique du faisceau",
      "SecOC (une trame modifiée perd son MAC)",
      "Détection de latence/anomalie",
    ],
    annexe5: "Famille 2.",
    outils: ["matériel à deux interfaces CAN"],
    casReel: "Base de nombreux bancs d'analyse et de certains outils de vol haut de gamme.",
    blockedBy: ["secoc"],
    verdictPass:
      "Sans SecOC, le pont peut modifier les trames au passage sans être détecté.",
    verdictBlock:
      "SecOC protège l'intégrité : si le pont modifie une trame authentifiée, son code d'authentification devient invalide et le récepteur la rejette.",
  },

  // ---------------------------------------------------------------- Couche B
  {
    id: "B1",
    layer: "B",
    level: "avance",
    nom: "Contournement de SecurityAccess (0x27)",
    entry: "obd",
    route: ["entry:obd", "gateway", "ecm"],
    target: "ecm",
    resume: "Casser le verrou qui protège les fonctions de diagnostic sensibles.",
    principe:
      "Le service UDS 0x27 fonctionne en seed/key : le calculateur envoie une graine, le client doit renvoyer une clé calculée par un algorithme secret. Algorithme faible, clé extraite du firmware ou absence de limitation des essais ouvrent le verrou.",
    pourquoi:
      "La sécurité repose entièrement sur le secret de l'algorithme et sur une temporisation anti-brute-force. Si l'un ou l'autre manque, le seed/key n'est qu'une formalité : la relation graine -> clé est déterministe.",
    methode: [
      "Demander une graine (requête 0x27)",
      "Calculer la clé si l'algorithme est connu, sinon la forcer faute de temporisation",
      "Renvoyer la clé et obtenir la session sécurisée",
    ],
    prerequis: ["Accès diagnostic (OBD ou DoIP)", "Parfois l'algorithme extrait du firmware"],
    effet: "Le verrou cède et déverrouille les services sensibles qui suivent (écriture, reflashage).",
    remediations: [
      "Algorithme robuste et clé protégée (HSM)",
      "Temporisation et verrouillage après échecs (anti-brute-force)",
      "Rotation des clés",
    ],
    annexe5: "Familles 5 (interface diagnostic) et 7.",
    outils: ["python-udsoncan", "scripts UDS"],
    casReel:
      "De nombreux algorithmes seed/key de série se sont avérés faibles ou extraits par rétro-ingénierie du firmware.",
    frame: {
      caption: "Échange UDS SecurityAccess (exemple)",
      lines: [
        { text: "-> 27 01            requestSeed" },
        { text: "<- 67 01 A3 7F 10 2C   seed" },
        { text: "-> 27 02 7C 41 9B 6E   sendKey (cle calculee)", mark: "hl" },
        { text: "<- 67 02            acces accorde", mark: "ok" },
      ],
    },
    blockedBy: ["durcissement"],
    verdictPass:
      "Interfaces diagnostic non durcies : pas de temporisation, algorithme faible, le verrou tombe.",
    verdictBlock:
      "Le durcissement impose temporisation, verrouillage après échecs et clé protégée : le brute-force devient impraticable et l'algorithme n'est plus extractible facilement.",
  },
  {
    id: "B2",
    layer: "B",
    level: "avance",
    nom: "Reflashage malveillant (RequestDownload 0x34)",
    entry: "obd",
    route: ["entry:obd", "gateway", "ecm"],
    target: "ecm",
    resume: "Installer un firmware modifié dans un calculateur.",
    principe:
      "Le service 0x34 initie un transfert de données vers le calculateur, étape du reflashage, suivi de 0x36 (TransferData) et 0x37. Si l'authenticité du firmware n'est pas vérifiée, on installe le sien.",
    pourquoi:
      "Sans Secure Boot ni signature vérifiée à l'écriture et au démarrage, le calculateur exécute n'importe quel binaire correctement transféré. Le reflashage légitime et le reflashage malveillant suivent la même séquence UDS.",
    methode: [
      "Obtenir SecurityAccess (voir B1)",
      "Lancer RequestDownload puis TransferData avec le firmware préparé",
      "Valider le transfert (RequestTransferExit)",
    ],
    prerequis: ["Accès diagnostic", "SecurityAccess franchi"],
    effet: "Le calculateur passe sous contrôle de l'attaquant (couleur distincte sur le plan).",
    remediations: [
      "Secure Boot et signature du firmware",
      "Vérification d'intégrité et anti-rollback",
      "Clés de signature protégées côté constructeur",
    ],
    annexe5: "Familles 3 (procédures de mise à jour) et 6 (code).",
    outils: ["outils de flash constructeur détournés", "scripts UDS"],
    casReel:
      "La prise de contrôle persistante d'un calculateur passe presque toujours par un reflashage non authentifié.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans vérification d'authenticité, le firmware malveillant s'installe et persiste.",
    verdictBlock:
      "Le durcissement (Secure Boot, signature, anti-rollback) refuse un binaire non signé : l'installation échoue et le calculateur reste sain.",
  },
  {
    id: "B3",
    layer: "B",
    level: "avance",
    nom: "Abus de WriteDataByIdentifier (0x2E)",
    entry: "obd",
    route: ["entry:obd", "gateway", "ic"],
    target: "ic",
    resume: "Écrire directement une donnée dans un calculateur sans y être autorisé.",
    principe:
      "Le service 0x2E écrit la valeur d'un identifiant de donnée (DID). S'il est accessible sans authentification correcte, on modifie des paramètres internes : calibration, configuration, odomètre.",
    pourquoi:
      "Le contrôle d'accès se fait service par service et DID par DID. Une matrice de droits trop permissive, ou un DID sensible laissé inscriptible en session par défaut, suffit à ouvrir l'écriture.",
    methode: [
      "Entrer dans la session diagnostic requise (et SecurityAccess si demandé)",
      "Émettre 0x2E avec le DID cible et la nouvelle valeur",
    ],
    prerequis: ["Accès diagnostic"],
    effet: "Un paramètre affiché change : par exemple une valeur de configuration ou un kilométrage.",
    remediations: [
      "Contrôle d'accès strict par service et par DID",
      "Séparation des droits (écriture réservée à une session sécurisée)",
    ],
    annexe5: "Familles 5 et 6.",
    outils: ["python-udsoncan", "scripts UDS"],
    casReel: "La fraude à l'odomètre via UDS est un cas courant et documenté.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Interfaces non durcies : le DID sensible est inscriptible, la valeur change.",
    verdictBlock:
      "Le durcissement restreint 0x2E aux seuls DID autorisés en session sécurisée : l'écriture est refusée.",
  },
  {
    id: "B4",
    layer: "B",
    level: "avance",
    nom: "Abus de RoutineControl (0x31)",
    entry: "obd",
    route: ["entry:obd", "gateway", "abs"],
    target: "abs",
    resume:
      "Déclencher à distance de maintenance une routine interne du calculateur : purge de freins, test d'actionneur, apprentissage.",
    principe:
      "Le service 0x31 lance des routines usine/atelier (startRoutine). Certaines pilotent directement des actionneurs. Accessibles sans contrôle suffisant, elles deviennent des commandes physiques.",
    pourquoi:
      "Ces routines existent pour l'après-vente et agissent réellement sur le matériel. Leur dangerosité tient à ce qu'elles court-circuitent la logique applicative normale : elles sont faites pour piloter l'actionneur directement.",
    methode: [
      "Identifier l'identifiant de routine d'un actionneur sensible",
      "Entrer dans la session requise",
      "Lancer la routine (0x31 01) avec ses paramètres",
    ],
    prerequis: ["Accès diagnostic", "Session et droits suffisants"],
    effet: "Un actionneur réagit hors contexte : par exemple une routine de freinage se déclenche.",
    remediations: [
      "Conditions strictes d'activation (véhicule à l'arrêt, session sécurisée)",
      "Contrôle d'accès par routine",
      "Journalisation",
    ],
    annexe5: "Familles 5 et 6.",
    outils: ["scripts UDS"],
    casReel: "Les routines d'actionneur sont une cible connue des audits après-vente.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans durcissement, la routine se lance même hors des conditions prévues.",
    verdictBlock:
      "Le durcissement impose les conditions d'activation et restreint l'accès à la routine : le déclenchement est refusé.",
  },
  {
    id: "B5",
    layer: "B",
    level: "debutant",
    nom: "Déni de service par reset diagnostic (0x11 / 0x3E)",
    entry: "obd",
    route: ["entry:obd", "gateway", "ecm"],
    target: "ecm",
    resume:
      "Garder un calculateur en session diagnostic ou le réinitialiser en boucle pour le rendre indisponible.",
    principe:
      "Un calculateur maintenu en session diagnostic (via TesterPresent 0x3E) peut suspendre une partie de ses fonctions normales. Répéter ECUReset (0x11) le relance sans cesse.",
    pourquoi:
      "La session diagnostic est prévue pour l'atelier, véhicule immobilisé. Rien n'empêche toujours d'y entrer et d'y rester, ou de spammer le reset : le protocole ne limite pas la fréquence de ces requêtes par défaut.",
    methode: [
      "Entrer en session diagnostic et envoyer TesterPresent en continu",
      "Ou répéter ECUReset pour empêcher le fonctionnement normal",
    ],
    prerequis: ["Accès diagnostic"],
    effet: "Le calculateur ne répond plus normalement : fonctions dégradées, voyants.",
    remediations: [
      "Interdiction d'entrer en session diagnostic véhicule roulant",
      "Limitation de fréquence des requêtes",
      "IDS",
    ],
    annexe5: "Familles 5 et 2 (disponibilité).",
    outils: ["scripts UDS"],
    casReel: "Effet de bord connu des sessions diagnostic mal conditionnées.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Interfaces non durcies : la session reste ouverte ou le reset se répète, le calculateur décroche.",
    verdictBlock:
      "Le durcissement conditionne la session diagnostic (véhicule à l'arrêt) et limite la fréquence : le déni de service par diagnostic est bloqué.",
  },

  // ---------------------------------------------------------------- Couche C
  {
    id: "C1",
    layer: "C",
    level: "debutant",
    nom: "Attaque par relais sur clé sans contact (PKES)",
    entry: "key",
    route: ["entry:key", "peps"],
    target: "peps",
    resume: "Étendre la portée de la clé pour ouvrir et démarrer sans l'avoir.",
    principe:
      "Le système PEPS déverrouille quand la clé est proche. Deux complices relaient le signal entre la clé (chez vous) et le véhicule (dans la rue) : le véhicule croit la clé à côté.",
    pourquoi:
      "Le PEPS déduit la proximité de la seule puissance reçue du signal, sans mesurer le temps de vol. Un relais rallonge le canal sans que le système sache que la clé est en réalité à dix mètres... ou cent.",
    methode: [
      "Un dispositif capte le signal près de la clé",
      "Un second le rejoue près du véhicule",
      "Le véhicule ouvre et autorise le démarrage",
    ],
    prerequis: ["Proximité de la clé et du véhicule", "Deux dispositifs radio relais"],
    effet: "La clé éloignée est reliée au véhicule par le relais ; les portes s'ouvrent.",
    remediations: [
      "Mesure de distance par temps de vol (UWB)",
      "Capteur de mouvement dans la clé (désactivation au repos)",
      "Désactivation RF possible par l'utilisateur",
    ],
    annexe5: "Famille 5 (connectivité externe).",
    outils: ["matériel radio de relais (recherche)"],
    casReel:
      "Démontré sur de nombreux modèles premium ; relais sur Tesla Model S par KeenLab (2018), parade par l'UWB sur les générations récentes.",
    blockedBy: [],
    verdictPass:
      "Parade spécifique au PEPS : aucune des contre-mesures du modèle (SecOC, segmentation, durcissement) ne traite le relais. Il faut de l'UWB ou un capteur de mouvement dans la clé.",
    verdictBlock: "",
  },
  {
    id: "C2",
    layer: "C",
    level: "avance",
    nom: "Infotainment compromis, puis pivot vers le bus",
    entry: "cell",
    route: ["entry:cell", "tcu", "gateway", "abs"],
    target: "abs",
    resume: "Entrer par l'écran connecté, puis sauter jusqu'aux fonctions critiques.",
    principe:
      "L'infotainment expose des interfaces distantes (cellulaire, Wi-Fi). Une faille y donne un pied ; si la segmentation est insuffisante, l'attaquant atteint le bus et des fonctions physiques.",
    pourquoi:
      "Tout tient au cloisonnement. L'identifiant CAN n'étant pas une adresse d'émetteur, un noeud qui atteint le bus critique peut tout y émettre. La passerelle est la seule à pouvoir refuser le passage d'un domaine à l'autre.",
    methode: [
      "Exploiter l'IVI à distance via l'interface cellulaire",
      "Atteindre le microcontrôleur relié au bus (second coeur de l'IVI)",
      "Franchir la passerelle faute de filtrage inter-domaines",
      "Injecter la commande sur le bus châssis",
    ],
    prerequis: ["Accès distant (cellulaire/Wi-Fi)", "Faille applicative sur l'IVI", "Segmentation faible"],
    effet: "Le chemin traverse la passerelle de l'antenne jusqu'au freinage, qui passe sous contrôle.",
    remediations: [
      "Segmentation stricte par passerelle, filtrage inter-domaines",
      "Durcissement et mise à jour de l'IVI",
      "IDS sur les bus critiques",
    ],
    annexe5: "Familles 1 (back-end), 5 (connectivité) et 2.",
    outils: ["référence : Miller & Valasek, Jeep Cherokee 2015"],
    casReel:
      "Jeep Cherokee 2015 : prise de contrôle à distance via Uconnect, jusqu'à la direction et aux freins. 1,4 million de véhicules rappelés.",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation, le pivot traverse la passerelle et atteint le freinage. SecOC ne changerait rien ici si l'attaquant émet des commandes valides.",
    verdictBlock:
      "La passerelle rejette le pivot inter-domaines : la commande n'atteint jamais le freinage. Le reste du véhicule continue de fonctionner.",
  },
  {
    id: "C3",
    layer: "C",
    level: "avance",
    nom: "Exploitation de la télématique (TCU) à distance",
    entry: "cell",
    route: ["entry:cell", "tcu", "gateway"],
    target: "gateway",
    resume:
      "Attaquer le modem embarqué pour entrer dans le véhicule depuis n'importe où.",
    principe:
      "La TCU est connectée au réseau cellulaire et au backend constructeur. Une faille côté TCU ouvre un accès distant, potentiellement à l'échelle d'une flotte.",
    pourquoi:
      "La TCU est un point d'entrée permanent, toujours joignable, et souvent relié au bus. Compromise, elle offre à l'attaquant la même position qu'un calculateur interne, mais à distance.",
    methode: [
      "Compromettre la TCU via son interface réseau",
      "S'appuyer sur sa connexion au bus pour émettre des commandes",
      "Répéter l'opération sur les véhicules identiques",
    ],
    prerequis: ["Accès distant", "Faille TCU"],
    effet: "Entrée par le toit (antenne), chemin vers la passerelle et les domaines.",
    remediations: [
      "Durcissement de la TCU",
      "Segmentation (limite la portée une fois dans le véhicule)",
      "Authentification forte vers le backend",
    ],
    annexe5: "Familles 1 et 5.",
    outils: ["référence générale"],
    casReel:
      "BMW ConnectedDrive (2015, Dieter Spaar) : commandes envoyées à distance via la liaison télématique sur environ 2,2 millions de véhicules.",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation, la TCU compromise atteint les domaines critiques depuis le réseau.",
    verdictBlock:
      "La segmentation confine la TCU : même compromise, elle ne peut pas franchir la passerelle vers les fonctions critiques.",
  },
  {
    id: "C4",
    layer: "C",
    level: "avance",
    nom: "Mise à jour OTA malveillante ou rollback",
    entry: "cell",
    route: ["entry:cell", "tcu"],
    target: "tcu",
    resume: "Pousser une fausse mise à jour, ou forcer un retour à une version vulnérable.",
    principe:
      "Si l'authenticité et la version des mises à jour ne sont pas vérifiées, un attaquant installe du code ou ramène une faille déjà corrigée (rollback).",
    pourquoi:
      "Le canal OTA est un pouvoir d'écriture à distance sur tout le parc. Sans signature ni anti-rollback, il devient le vecteur idéal : massif, persistant, et légitime aux yeux du véhicule.",
    methode: [
      "Se placer sur le canal de mise à jour ou usurper sa source",
      "Pousser un paquet non signé, ou rejouer une ancienne version signée mais vulnérable",
    ],
    prerequis: ["Position sur le canal de mise à jour"],
    effet: "Une mise à jour arrive par l'antenne : acceptée sans défense, rejetée avec défense.",
    remediations: [
      "Signature des mises à jour et vérification d'intégrité",
      "Anti-rollback (refus des versions antérieures)",
      "Traçabilité (RXSWIN, UNECE R156)",
    ],
    annexe5: "Famille 3 (procédures de mise à jour).",
    outils: ["conceptuel"],
    casReel:
      "Le règlement UNECE R156 impose justement un système de gestion des mises à jour pour fermer cette porte.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans vérification de signature ni anti-rollback, le paquet malveillant ou l'ancienne version s'installe.",
    verdictBlock:
      "Le durcissement (signature vérifiée, anti-rollback) refuse un paquet non signé comme un retour en arrière : la mise à jour est rejetée.",
  },
  {
    id: "C5",
    layer: "C",
    level: "debutant",
    nom: "RollJam : capture du code tournant (RKE)",
    entry: "key",
    route: ["entry:key", "bcm"],
    target: "bcm",
    resume:
      "Brouiller la télécommande, capturer un code non consommé et le rejouer plus tard.",
    principe:
      "L'ouverture à distance (RKE) utilise un code tournant à usage unique. L'attaquant brouille la réception du véhicule tout en capturant le code émis ; l'utilisateur réappuie, l'attaquant garde le premier code valide et rejoue à volonté.",
    pourquoi:
      "Le code tournant n'est invalidé qu'une fois reçu par le véhicule. En empêchant cette réception, l'attaquant conserve un code encore valide. Le compteur du véhicule n'a pas avancé : le rejeu passe.",
    methode: [
      "Brouiller la bande de réception du véhicule",
      "Capturer le ou les codes émis par la télécommande",
      "Laisser passer un code pour ne pas éveiller le soupçon, garder l'autre",
    ],
    prerequis: ["Proximité de la clé au moment de l'usage", "Un émetteur-récepteur SDR"],
    effet: "Le véhicule se déverrouille au rejeu du code capturé.",
    remediations: [
      "Fenêtre de validité temporelle courte côté véhicule",
      "Codes liés à l'horloge (rolling code horodaté)",
      "Passage à des protocoles à défi-réponse",
    ],
    annexe5: "Famille 5.",
    outils: ["SDR (recherche)", "référence : RollJam, Samy Kamkar 2015"],
    casReel: "RollJam, présenté par Samy Kamkar en 2015, efficace sur de nombreuses télécommandes à code tournant.",
    blockedBy: [],
    verdictPass:
      "Parade spécifique au RKE : les contre-mesures du modèle ne traitent pas la radio de la télécommande. Il faut une fenêtre temporelle ou un défi-réponse côté système de clé.",
    verdictBlock: "",
  },
  {
    id: "C6",
    layer: "C",
    level: "avance",
    nom: "Exploitation Bluetooth / BLE",
    entry: "usb",
    route: ["entry:usb", "ivi"],
    target: "ivi",
    resume:
      "Entrer par la pile Bluetooth de l'infotainment, ou relayer le déverrouillage BLE d'un téléphone-clé.",
    principe:
      "Deux angles : une faille dans la pile Bluetooth de l'IVI donne un pied à courte portée ; ou, pour les accès par smartphone (Phone-as-a-Key), un relais BLE étend la portée comme pour le PKES.",
    pourquoi:
      "Les piles Bluetooth sont de gros logiciels historiquement buggés. Et le BLE, comme le PKES, déduit la proximité du signal : un relais le trompe, car la spécification BLE ne garantit pas la distance.",
    methode: [
      "Cibler la pile Bluetooth de l'IVI pour l'exécution de code, ou",
      "Relayer la liaison BLE entre le téléphone-clé et le véhicule",
    ],
    prerequis: ["Proximité Bluetooth", "Faille de pile ou accès BLE sans mesure de distance"],
    effet: "L'IVI passe sous contrôle, ou le véhicule s'ouvre via le relais BLE.",
    remediations: [
      "Mises à jour de la pile Bluetooth",
      "Mesure de distance (UWB) pour les accès par téléphone",
      "Durcissement et isolation de l'IVI",
    ],
    annexe5: "Familles 5 et 7.",
    outils: ["référence : relais BLE Tesla, NCC Group 2022"],
    casReel:
      "Relais BLE sur Tesla (NCC Group, 2022) : déverrouillage et démarrage malgré le chiffrement, car la distance n'était pas vérifiée.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans durcissement/mise à jour de l'IVI, la faille Bluetooth donne un accès local exploitable.",
    verdictBlock:
      "Le durcissement (pile à jour, IVI isolé) ferme la faille applicative. Le relais BLE pur, lui, relève d'une parade de type UWB côté accès.",
  },
  {
    id: "C7",
    layer: "C",
    level: "avance",
    nom: "Fausse station de base cellulaire",
    entry: "cell",
    route: ["entry:cell", "tcu"],
    target: "tcu",
    resume:
      "Attirer la TCU sur une fausse antenne pour intercepter ou manipuler son trafic.",
    principe:
      "Une fausse station de base (IMSI catcher / femtocell pirate) se fait passer pour le réseau. La TCU s'y rattache, surtout si elle accepte encore la 2G ou si elle ne valide pas le réseau.",
    pourquoi:
      "Le rattachement cellulaire privilégie le signal le plus fort, et la 2G n'authentifie pas le réseau côté terminal. Une antenne pirate plus puissante capte donc la TCU et se place entre elle et le backend.",
    methode: [
      "Émettre une cellule pirate plus puissante que le réseau légitime",
      "Forcer le repli de la TCU vers un mode faible (2G)",
      "Intercepter ou altérer le trafic vers le backend",
    ],
    prerequis: ["Proximité du véhicule", "Matériel radio cellulaire"],
    effet: "Le trafic de la TCU transite par l'attaquant ; commandes et mises à jour deviennent manipulables.",
    remediations: [
      "Interdire le repli 2G",
      "TLS mutuel TCU <-> backend (certificats épinglés)",
      "Détection d'anomalie de réseau",
    ],
    annexe5: "Familles 1 et 5.",
    outils: ["SDR cellulaire (recherche)"],
    casReel: "Technique éprouvée contre de nombreux objets connectés cellulaires mal configurés.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans durcissement (repli 2G permis, pas d'épinglage), la TCU parle à l'antenne pirate.",
    verdictBlock:
      "Le durcissement (pas de 2G, TLS mutuel épinglé) empêche le rattachement pirate et l'interception.",
  },
  {
    id: "C8",
    layer: "C",
    level: "debutant",
    nom: "Appli compagnon et API détournées",
    entry: "cell",
    route: ["entry:cell", "tcu"],
    target: "tcu",
    resume:
      "Abuser de l'API de l'application mobile pour commander le véhicule d'un autre utilisateur.",
    principe:
      "L'application compagnon pilote le véhicule via une API backend. Des contrôles d'accès insuffisants (autorisation par objet, référence directe non vérifiée) permettent d'agir sur un véhicule qui n'est pas le sien.",
    pourquoi:
      "C'est de la sécurité web classique appliquée à l'automobile : si le backend vérifie qui vous êtes mais pas à quoi vous avez droit, connaître l'identifiant d'un autre véhicule suffit à lui envoyer des commandes.",
    methode: [
      "Observer les appels de l'application mobile",
      "Rejouer un appel en changeant l'identifiant du véhicule cible",
      "Déclencher des fonctions à distance (localisation, ouverture, climatisation)",
    ],
    prerequis: ["Un compte sur le service", "Une API aux contrôles d'accès faibles"],
    effet: "Des commandes à distance partent vers un véhicule tiers via le backend.",
    remediations: [
      "Autorisation par objet côté backend (liaison compte <-> véhicule vérifiée)",
      "Tests d'API (références directes, énumération)",
      "Journalisation et limitation de débit",
    ],
    annexe5: "Famille 1 (back-end et services).",
    outils: ["outils de test d'API web"],
    casReel:
      "Nissan Leaf (Troy Hunt, 2016) : l'API ne vérifiait que le VIN, permettant d'agir sur d'autres véhicules. Nombreux cas analogues depuis (Sam Curry et al., 2023).",
    blockedBy: ["durcissement"],
    verdictPass:
      "Backend non durci : l'API accepte une commande sur un véhicule qui n'appartient pas au compte.",
    verdictBlock:
      "Le durcissement (autorisation par objet) vérifie que le véhicule appartient bien au compte : la commande croisée est refusée.",
  },
  {
    id: "C9",
    layer: "C",
    level: "avance",
    nom: "Compromission du backend (flotte)",
    entry: "cell",
    route: ["entry:cell", "tcu", "gateway"],
    target: "tcu",
    resume:
      "Prendre le backend constructeur, et avec lui la capacité d'agir sur des milliers de véhicules.",
    principe:
      "Le backend orchestre télématique, mises à jour et commandes à distance. Compromis, il offre un levier à l'échelle de la flotte entière.",
    pourquoi:
      "C'est le point de convergence : un seul système parle à tous les véhicules avec une relation de confiance établie. La portée de l'attaque n'est plus un véhicule, mais le parc. C'est le vecteur dominant des incidents récents.",
    methode: [
      "Compromettre un composant du backend ou d'un fournisseur",
      "Abuser de la relation de confiance backend -> véhicules",
      "Diffuser commandes ou mises à jour à grande échelle",
    ],
    prerequis: ["Accès à un maillon du backend ou de la chaîne fournisseurs"],
    effet: "Entrée par l'antenne, chemin vers la passerelle, réplicable sur toute une flotte.",
    remediations: [
      "Sécurité backend (segmentation, moindre privilège, supervision)",
      "Segmentation embarquée (limite ce qu'un ordre backend peut faire)",
      "Authentification forte et signature des ordres",
    ],
    annexe5: "Famille 1.",
    outils: ["référence générale"],
    casReel:
      "En 2024-2025, télématique, cloud et API concentrent environ deux tiers des attaques automobiles publiques (rapport Upstream).",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation embarquée, un ordre venu du backend compromis atteint les fonctions critiques.",
    verdictBlock:
      "La segmentation limite ce qu'un ordre backend peut déclencher à bord : la portée d'une compromission cloud est contenue.",
  },

  // ---------------------------------------------------------------- Couche D
  {
    id: "D1",
    layer: "D",
    level: "avance",
    nom: "UDS sur IP (DoIP)",
    entry: "obd",
    route: ["entry:obd", "gateway", "ecm"],
    target: "ecm",
    resume: "Le même diagnostic UDS, mais encapsulé dans l'Ethernet automobile.",
    principe:
      "DoIP (ISO 13400) transporte UDS sur IP. Les mêmes services sensibles (0x27, 0x34) sont joignables, potentiellement à plus grande portée et à plus haut débit.",
    pourquoi:
      "Passer sur IP apporte la vitesse et la portée du réseau, mais aussi ses faiblesses : si l'interface DoIP est joignable sans authentification réseau, c'est UDS exposé comme un service TCP ordinaire.",
    methode: [
      "Atteindre l'interface DoIP (port 13400)",
      "Établir la session et dialoguer en UDS sur IP",
      "Enchaîner sur SecurityAccess et reflashage (B1, B2) à plus haut débit",
    ],
    prerequis: ["Accès au réseau Ethernet embarqué"],
    effet: "Un flux IP vers un calculateur ; les services UDS sont joués sur IP.",
    remediations: [
      "Authentification et segmentation réseau (VLAN)",
      "Pare-feu embarqué, TLS",
      "Durcissement des services UDS (voir couche B)",
    ],
    annexe5: "Familles 5 et 2.",
    outils: ["python-doipclient", "scripts DoIP"],
    casReel: "DoIP est la norme de diagnostic des véhicules récents à architecture Ethernet.",
    blockedBy: ["segmentation", "durcissement"],
    verdictPass:
      "Interface DoIP joignable et UDS non durci : le diagnostic sur IP ouvre tout, plus vite.",
    verdictBlock:
      "Segmentation réseau et durcissement des services ferment l'accès DoIP non autorisé et bloquent les requêtes sensibles.",
  },
  {
    id: "D2",
    layer: "D",
    level: "avance",
    nom: "Usurpation SOME/IP et MITM Ethernet",
    entry: "obd",
    route: ["entry:obd", "gateway", "adas"],
    target: "adas",
    resume:
      "Usurper la communication orientée service sur l'Ethernet du véhicule.",
    principe:
      "SOME/IP est le middleware de services sur Automotive Ethernet. Sans authentification, on usurpe un service ou on se place en homme du milieu (par ARP spoofing), comme sur un réseau IP classique.",
    pourquoi:
      "SOME/IP ne prévoit pas d'authentification par défaut, et la découverte de services (SOME/IP-SD) annonce qui offre quoi. L'attaquant se déclare fournisseur d'un service, ou détourne le trafic entre deux calculateurs.",
    methode: [
      "Découvrir les services annoncés (SOME/IP-SD)",
      "Usurper un service ou se placer en MITM (ARP spoofing)",
      "Injecter de fausses données de service (ex. perception ADAS)",
    ],
    prerequis: ["Accès au réseau Ethernet embarqué"],
    effet: "Un service est détourné ou un flux intercepté entre deux calculateurs Ethernet.",
    remediations: [
      "Authentification des services",
      "Segmentation VLAN et filtrage",
      "Chiffrement et détection d'ARP spoofing",
    ],
    annexe5: "Famille 2.",
    outils: ["outils réseau classiques adaptés", "scripts SOME/IP"],
    casReel: "Surface d'attaque émergente des architectures zonales à Ethernet.",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation ni authentification de service, l'usurpation SOME/IP passe.",
    verdictBlock:
      "La segmentation (VLAN, filtrage) empêche un noeud d'usurper un service ou de se placer en MITM hors de sa zone.",
  },
  {
    id: "D3",
    layer: "D",
    level: "avance",
    nom: "Perturbation Ethernet temps réel (AVB/TSN)",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["info"],
    resume:
      "Casser la synchronisation ou la priorité des flux temps réel de l'Ethernet embarqué.",
    principe:
      "AVB/TSN garantit la livraison à temps des flux critiques (vidéo ADAS, audio) grâce à une horloge commune (gPTP) et à la réservation de bande. Fausser l'horloge ou saturer une classe de trafic dégrade ces garanties.",
    pourquoi:
      "Les garanties temps réel reposent sur la confiance dans le maître d'horloge et dans la réservation. Un noeud malveillant qui se déclare maître gPTP ou inonde une classe prioritaire fait perdre leurs échéances aux flux critiques.",
    methode: [
      "Usurper le maître d'horloge gPTP, ou",
      "Saturer une classe de trafic prioritaire",
      "Dégrader les flux temps réel dépendants (perception, affichage)",
    ],
    prerequis: ["Accès au réseau Ethernet embarqué"],
    effet: "Les flux temps réel perdent leurs échéances : vidéo saccadée, données en retard.",
    remediations: [
      "Authentification du maître d'horloge",
      "Isolation VLAN et contrôle d'admission des flux",
      "Supervision des métriques TSN",
    ],
    annexe5: "Famille 2 (disponibilité et intégrité temporelle).",
    outils: ["outils réseau temps réel (recherche)"],
    casReel: "Surface spécifique aux architectures Ethernet temps réel récentes.",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation ni contrôle d'admission, un noeud dégrade les garanties temps réel.",
    verdictBlock:
      "La segmentation (VLAN, contrôle d'admission, maître d'horloge authentifié) confine le noeud et protège les flux critiques.",
  },
  {
    id: "D4",
    layer: "D",
    level: "avance",
    nom: "Usurpation de messages V2X",
    entry: "gnss",
    route: ["entry:gnss", "adas"],
    target: "adas",
    resume:
      "Émettre de faux messages véhicule-à-tout (V2X) pour tromper la perception ou l'aide à la conduite.",
    principe:
      "Le V2X (802.11p / C-V2X) laisse les véhicules échanger position et alertes. De faux messages (véhicule fantôme, faux freinage d'urgence) peuvent induire en erreur les fonctions qui s'y fient.",
    pourquoi:
      "Le V2X s'appuie sur une infrastructure de certificats (SCMS) pour authentifier les émetteurs. Si la validation des certificats est faible ou contournée, un message forgé devient crédible. Le GNSS, lui, se leurre aussi (spoofing GPS).",
    methode: [
      "Émettre des messages V2X forgés (position, alerte)",
      "Ou leurrer le GNSS pour fausser la position perçue",
      "Exploiter une validation de certificat insuffisante",
    ],
    prerequis: ["Émetteur radio V2X ou GNSS", "Validation de certificats faible"],
    effet: "Un faux véhicule ou une fausse alerte apparaît à la perception / aide à la conduite.",
    remediations: [
      "Validation stricte des certificats V2X (SCMS)",
      "Fusion multi-capteurs (ne pas se fier au seul V2X/GNSS)",
      "Détection d'incohérence GNSS",
    ],
    annexe5: "Familles 2 et 5.",
    outils: ["SDR (recherche)", "référence : spoofing GPS Regulus/Tesla 2019"],
    casReel:
      "Regulus a leurré le GPS d'une Tesla en Autopilot (2019), provoquant des manoeuvres non sollicitées.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans validation stricte, le message V2X forgé est accepté et trompe la perception.",
    verdictBlock:
      "Le durcissement (validation SCMS, fusion multi-capteurs) rejette les messages non authentifiés et recoupe les sources.",
  },

  // ---------------------------------------------------------------- Couche E
  {
    id: "E1",
    layer: "E",
    level: "avance",
    nom: "Accès par port de débogage (JTAG / SWD)",
    entry: "debug",
    route: ["entry:debug", "ecm"],
    target: "ecm",
    resume:
      "Utiliser un port de débogage laissé accessible pour prendre la main sur un calculateur.",
    principe:
      "JTAG/SWD donnent un contrôle total du microcontrôleur : lecture/écriture mémoire, arrêt, pas-à-pas. Laissés actifs en série, ils ouvrent la porte à l'extraction et à la modification.",
    pourquoi:
      "Ces interfaces existent pour le développement et la production. Si elles ne sont pas désactivées ou verrouillées avant la mise en série, elles restent un accès de niveau constructeur offert à qui ouvre le boîtier.",
    methode: [
      "Localiser les points de test du port de débogage sur la carte",
      "S'y connecter avec une sonde",
      "Lire/modifier la mémoire et le flux d'exécution",
    ],
    prerequis: ["Accès physique au calculateur", "Une sonde de débogage"],
    effet: "Le calculateur est entièrement sous contrôle : code et secrets exposés.",
    remediations: [
      "Désactivation ou verrouillage des ports de débogage en production",
      "Fusibles de sécurité (lifecycle du composant)",
      "Détection d'ouverture du boîtier",
    ],
    annexe5: "Familles 6 et 7.",
    outils: ["sondes JTAG/SWD (recherche matérielle)"],
    casReel: "Point de départ fréquent de l'analyse matérielle d'un calculateur.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Port de débogage laissé actif : accès complet au calculateur.",
    verdictBlock:
      "Le durcissement (débogage verrouillé, fusibles de sécurité) rend le port inutilisable en série.",
  },
  {
    id: "E2",
    layer: "E",
    level: "avance",
    nom: "Extraction du firmware (dump mémoire)",
    entry: "debug",
    route: ["entry:debug", "ecm"],
    target: "ecm",
    resume:
      "Récupérer le firmware d'un calculateur pour l'analyser et trouver clés et failles.",
    principe:
      "En lisant la mémoire (via débogage, ou directement la puce), on obtient le firmware. Son analyse révèle algorithmes seed/key, clés, et vulnérabilités réutilisables sur tous les exemplaires.",
    pourquoi:
      "Un firmware extrait une fois sert contre tout le parc : il expose les secrets communs (algorithmes, clés de série) et permet de préparer les attaques logiques hors ligne, sans limite d'essais.",
    methode: [
      "Lire la mémoire via le port de débogage, ou retirer/lire la puce (chip-off)",
      "Reconstituer et désassembler le firmware",
      "En extraire algorithmes, clés et failles",
    ],
    prerequis: ["Accès physique au calculateur", "Protection en lecture absente ou contournée"],
    effet: "Le contenu du calculateur est exfiltré pour analyse hors ligne.",
    remediations: [
      "Protection en lecture de la mémoire (readout protection)",
      "Chiffrement du firmware et secrets en HSM",
      "Verrouillage du cycle de vie du composant",
    ],
    annexe5: "Familles 6 et 7.",
    outils: ["programmateurs mémoire, lecture de puce (recherche matérielle)"],
    casReel: "Préalable classique à la rétro-ingénierie des algorithmes seed/key (voir B1).",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans protection en lecture, la mémoire se vide et livre ses secrets.",
    verdictBlock:
      "Le durcissement (readout protection, firmware chiffré, clés en HSM) rend l'extraction infructueuse.",
  },
  {
    id: "E3",
    layer: "E",
    level: "avance",
    nom: "Contournement de Secure Boot par injection de faute",
    entry: "debug",
    route: ["entry:debug", "ecm"],
    target: "ecm",
    resume:
      "Perturber brièvement le calculateur au bon moment pour sauter la vérification de signature au démarrage.",
    principe:
      "L'injection de faute (glitch de tension ou d'horloge) provoque une erreur de calcul ponctuelle. Visant l'instant de la vérification de signature, elle fait passer un test qui aurait dû échouer.",
    pourquoi:
      "Secure Boot repose sur une comparaison à un instant précis. Une faute matérielle peut corrompre ce test unique (sauter un saut conditionnel), ouvrant l'exécution d'un firmware non signé même si la cryptographie est, elle, correcte.",
    methode: [
      "Identifier l'instant de la vérification de signature",
      "Injecter une faute (tension/horloge) à cet instant précis",
      "Faire exécuter un firmware non signé",
    ],
    prerequis: ["Accès physique", "Matériel d'injection de faute et mise au point du timing"],
    effet: "Le démarrage sécurisé est contourné ; du code non signé s'exécute.",
    remediations: [
      "Contre-mesures anti-glitch (double vérification, détecteurs)",
      "Vérifications redondantes et aléatoirisées",
      "Capteurs de tension/horloge",
    ],
    annexe5: "Familles 6 et 7.",
    outils: ["plateformes d'injection de faute (recherche, ex. ChipWhisperer)"],
    casReel: "Technique éprouvée de la sécurité matérielle, appliquée à des calculateurs embarqués.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans contre-mesure anti-faute, le glitch fait sauter la vérification et le code non signé s'exécute.",
    verdictBlock:
      "Le durcissement (double vérification, détecteurs de glitch) rend l'injection de faute non fiable et préserve le Secure Boot.",
  },
  {
    id: "E4",
    layer: "E",
    level: "avance",
    nom: "Blocage de la recharge (ISO 15118 / CCS)",
    entry: "charge",
    route: ["entry:charge", "tcu"],
    target: "tcu",
    resume:
      "Interrompre à distance la charge rapide d'un véhicule électrique en brouillant sa communication avec la borne.",
    principe:
      "La charge rapide CCS fait dialoguer véhicule et borne par courant porteur (HomePlug Green PHY) selon ISO 15118. Un signal de brouillage sans fil suffit à couper ce dialogue et à stopper la charge.",
    pourquoi:
      "La couche physique de communication rayonne et n'est pas protégée contre le brouillage. L'attaque vise le signal lui-même, pas la cryptographie : couper la conversation suffit à arrêter la charge, à distance et sans contact.",
    methode: [
      "Émettre un signal de brouillage sur la bande du courant porteur",
      "Rompre la communication véhicule <-> borne",
      "Maintenir le brouillage pour empêcher la reprise",
    ],
    prerequis: ["Proximité d'un véhicule en charge", "Un émetteur radio adapté"],
    effet: "La session de charge s'interrompt ; la recharge devient indisponible.",
    remediations: [
      "Blindage et robustesse de la couche physique",
      "Détection de brouillage et reprise automatique",
      "Communication de secours",
    ],
    annexe5: "Famille 2 (disponibilité), écosystème de recharge.",
    outils: ["SDR (recherche), référence : Brokenwire 2022"],
    casReel:
      "Brokenwire (2022, Oxford / armasuisse) : arrêt de la charge CCS à plusieurs mètres par simple brouillage sans fil.",
    blockedBy: [],
    verdictPass:
      "Attaque sur la couche physique radio : les contre-mesures du modèle (SecOC, segmentation, durcissement logique) n'y changent rien. Il faut une parade côté résistance au brouillage.",
    verdictBlock: "",
  },
];
