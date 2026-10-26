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
    nom: "Ecoute passive du bus (sniffing)",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["powertrain", "chassis", "bodyd", "info"],
    resume:
      "Ecouter tout ce qui circule sur le bus. Rien n'est chiffre, donc tout est lisible.",
    principe:
      "Le CAN est un bus de diffusion : chaque trame est recue par tous les noeuds. Un equipement branche sur le bus lit l'integralite du trafic sans se faire remarquer.",
    pourquoi:
      "Le CAN a ete concu en 1986 pour la fiabilite et le temps reel, pas pour la securite. Les trames circulent en clair, sans chiffrement ni controle d'acces : lire n'exige qu'un transceiver CAN et de quoi decoder.",
    methode: [
      "Se brancher sur un point d'acces au bus, le plus souvent la prise OBD-II",
      "Capturer le trafic en continu",
      "Observer les identifiants, leur frequence et les octets qui changent",
    ],
    prerequis: ["Acces physique au bus (OBD-II ou faisceau)", "Une interface CAN et un decodeur"],
    effet:
      "Toutes les trames du vehicule deviennent visibles ; on compte les identifiants et on reconstitue peu a peu la carte du trafic.",
    remediations: [
      "Controle d'acces physique a la prise diagnostic",
      "Detection d'equipement non autorise sur le bus (IDS)",
      "Chiffrement du bus (rare et couteux, peu repandu)",
    ],
    annexe5: "Famille 2 (canaux de communication). SecOC protege l'authenticite, pas la confidentialite.",
    outils: ["candump", "Wireshark", "SavvyCAN"],
    casReel:
      "Point de depart de la quasi-totalite des travaux publics de car hacking, du Car Hacker's Handbook aux demonstrations de Miller et Valasek.",
    frame: {
      caption: "Trafic brut capture sur le bus (exemple)",
      lines: [
        { text: "can0  18F  [8]  1A 00 64 00 00 00 00 12" },
        { text: "can0  0C9  [8]  20 83 00 00 FF 00 00 00" },
        { text: "can0  244  [8]  00 00 00 2D 00 00 00 00   <- tout est en clair", mark: "hl" },
      ],
    },
    blockedBy: [],
    verdictPass:
      "L'ecoute reste possible : aucune contre-mesure du modele ne protege la confidentialite du bus. C'est le socle de toutes les attaques suivantes.",
    verdictBlock: "",
  },
  {
    id: "A2",
    layer: "A",
    level: "debutant",
    nom: "Retro-ingenierie des identifiants",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["powertrain", "chassis", "bodyd"],
    resume:
      "Relier un identifiant et des octets a une vraie fonction du vehicule (vitesse, clignotant, portes).",
    principe:
      "En agissant sur une commande physique et en observant ce qui change sur le bus, on isole l'identifiant et les octets responsables de la fonction.",
    pourquoi:
      "Les identifiants ne sont pas documentes publiquement, mais ils sont stables et deterministes : la meme action produit toujours la meme trame. La correlation action/trame suffit a reconstruire la cartographie.",
    methode: [
      "Capturer en continu pendant qu'on actionne une fonction",
      "Filtrer les trames qui bougent au moment de l'action",
      "Isoler l'identifiant et l'octet de consigne, puis verifier en rejouant",
    ],
    prerequis: ["Acces au bus", "Acces aux commandes physiques du vehicule"],
    effet:
      "Dans l'appli, actionner une fonction met en evidence l'identifiant correspondant dans le moniteur.",
    remediations: [
      "Obfuscation des identifiants (protection faible)",
      "Defense en profondeur en aval : SecOC, segmentation",
    ],
    annexe5: "Famille 2. Etape de reconnaissance qui prepare l'injection et le rejeu.",
    outils: ["cansniffer", "caringcaribou", "SavvyCAN"],
    casReel:
      "Methode standard de toute analyse CAN ; au coeur des vols par injection CAN documentes en 2023 (Ian Tabor, Ken Tindell).",
    blockedBy: [],
    verdictPass:
      "La cartographie reste faisable : elle ne depend que de l'ecoute et de l'observation, qu'aucune contre-mesure du modele n'empeche.",
    verdictBlock: "",
  },
  {
    id: "A3",
    layer: "A",
    level: "debutant",
    nom: "Rejeu d'une trame capturee (replay)",
    disrupt: "inject",
    entry: "obd",
    route: ["entry:obd", "gateway", "bcm"],
    target: "bcm",
    resume:
      "Capturer une trame legitime, par exemple le deverrouillage des portes, et la reemettre telle quelle.",
    principe:
      "Le CAN de base n'a aucune notion de fraicheur. Une trame rejouee est strictement identique a l'originale : le calculateur ne peut pas les distinguer.",
    pourquoi:
      "Sans compteur ni horodatage authentifie, rien ne lie une trame a un instant. Le recepteur agit sur le contenu, pas sur l'origine ni l'anciennete du message.",
    methode: [
      "Sniffer et identifier la trame de l'action visee",
      "La stocker",
      "La reemettre au moment voulu",
    ],
    prerequis: ["Acces au bus", "La trame cible deja capturee"],
    effet: "L'action rejouee s'execute : par exemple, les portes se deverrouillent.",
    remediations: [
      "SecOC : compteur de fraicheur + code d'authentification (une trame deja vue est rejetee)",
      "Compteurs anti-rejeu applicatifs",
    ],
    annexe5: "Famille 2.",
    outils: ["canplayer", "SavvyCAN"],
    casReel: "Classique sur les commandes de confort non authentifiees (portes, vitres, klaxon).",
    blockedBy: ["secoc"],
    verdictPass:
      "Sans SecOC, la trame rejouee est acceptee comme neuve : l'action se reproduit a volonte.",
    verdictBlock:
      "SecOC rejette la trame : son compteur de fraicheur a deja ete vu, le code d'authentification ne correspond plus. Le rejeu echoue.",
  },
  {
    id: "A4",
    layer: "A",
    level: "debutant",
    nom: "Injection d'une trame forgee (spoofing)",
    disrupt: "inject",
    entry: "obd",
    route: ["entry:obd", "gateway", "ic"],
    target: "ic",
    resume:
      "Forger une trame avec un identifiant legitime et la valeur de son choix. Le recepteur la croit authentique.",
    principe:
      "Sur le CAN, l'identifiant est une etiquette de message, pas une adresse d'emetteur. N'importe quel noeud peut emettre n'importe quel identifiant.",
    pourquoi:
      "Aucun champ ne designe l'emetteur et aucune signature ne protege le contenu. En emettant la trame plus souvent que la source legitime, l'attaquant impose sa valeur (il gagne l'arbitrage ou noie la vraie trame).",
    methode: [
      "Connaitre l'identifiant et le format de la cible (via A2)",
      "Forger la trame avec la valeur voulue",
      "L'emettre a haute frequence pour l'emporter sur la source legitime",
    ],
    prerequis: ["Acces au bus", "Identifiant cible connu"],
    effet:
      "Le tableau de bord affiche une fausse vitesse, ou une fausse commande est envoyee a un calculateur.",
    remediations: [
      "SecOC : code d'authentification (MAC) invalide pour une trame forgee",
      "Segmentation pour limiter la portee d'un noeud compromis",
    ],
    annexe5: "Famille 2.",
    outils: ["cansend", "cangen", "caringcaribou"],
    casReel:
      "Vols par injection CAN en 2022-2023 : un module branche sur le faisceau d'un phare injecte la trame de deverrouillage/demarrage (Tabor, Tindell).",
    frame: {
      caption: "Injection sur le bus (exemple pedagogique)",
      lines: [
        { text: "0C9#FF 20 00 00 00 00 00 00   trame forgee, emise a 100 Hz", mark: "hl" },
        { text: "0C9#00 14 00 00 00 00 00 00   trame legitime, noyee" },
        { text: "        ^^ octet de consigne : la frequence fait gagner l'attaquant" },
      ],
    },
    blockedBy: ["secoc"],
    verdictPass:
      "Sans SecOC, le recepteur ne peut pas distinguer la trame forgee de la vraie : la fausse valeur est prise en compte.",
    verdictBlock:
      "SecOC verifie le code d'authentification : la trame forgee n'a pas de MAC valide et elle est rejetee.",
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
      "Noyer le bus de trames aleatoires pour provoquer des comportements inattendus ou faire planter un calculateur.",
    principe:
      "En envoyant des identifiants et des donnees aleatoires, on declenche parfois une fonction par accident ou on met un calculateur dans un etat non prevu.",
    pourquoi:
      "Les calculateurs ne valident pas toujours strictement leurs entrees. Une combinaison non testee peut franchir une verification absente et atteindre du code fragile.",
    methode: [
      "Generer en masse des trames aleatoires ou semi-dirigees",
      "Observer les anomalies (voyants, fonctions, plantages)",
      "Restreindre l'espace de recherche autour des anomalies trouvees",
    ],
    prerequis: ["Acces au bus"],
    effet:
      "Comportements erratiques : clignotants, voyants qui s'allument, calculateur qui se fige.",
    remediations: [
      "Validation stricte des entrees cote calculateur",
      "SecOC (la plupart des trames forgees rejetees)",
      "Tests de robustesse des la conception",
    ],
    annexe5: "Famille 7 (vulnerabilites non traitees).",
    outils: ["cangen", "caringcaribou", "scripts python-can"],
    casReel: "Technique de decouverte employee dans la recherche academique et les audits constructeurs.",
    blockedBy: ["secoc"],
    verdictPass:
      "Sans authentification, les trames aleatoires atteignent les calculateurs et peuvent declencher des comportements imprevus.",
    verdictBlock:
      "SecOC rejette la grande majorite des trames forgees avant qu'elles n'atteignent la logique applicative, ce qui reduit fortement la surface du fuzzing.",
  },
  {
    id: "A6",
    layer: "A",
    level: "debutant",
    nom: "Deni de service par saturation du bus",
    disrupt: "flood",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["powertrain", "chassis", "bodyd", "info"],
    resume:
      "Monopoliser le bus avec des trames de priorite maximale. Plus rien d'autre ne passe.",
    principe:
      "L'arbitrage du CAN donne la priorite a l'identifiant le plus bas (bits dominants). En emettant en continu l'identifiant 0x000, l'attaquant gagne toujours l'arbitrage.",
    pourquoi:
      "La priorite par arbitrage est un mecanisme natif du protocole, independant du contenu ou de l'authenticite. Un flot de 0x000 est parfaitement conforme au CAN : rien ne le distingue d'un trafic legitime prioritaire.",
    methode: [
      "Emettre sans interruption des trames de plus haute priorite (0x000)",
      "Maintenir le flot pour empecher tout autre noeud d'acceder au bus",
    ],
    prerequis: ["Acces au bus"],
    effet:
      "Le bus se sature, le trafic legitime cesse, le tableau de bord se fige. Banniere << bus sature >>.",
    remediations: [
      "Detection d'intrusion embarquee (IDS) qui repere le flot anormal",
      "Filtrage et redondance des liens critiques",
    ],
    annexe5: "Famille 2, sous l'angle disponibilite.",
    outils: ["cangen en mode flood"],
    casReel:
      "Le deni de service illustre une limite majeure : aucune authentification de message n'empeche de saturer un media partage.",
    blockedBy: [],
    verdictPass:
      "Point pedagogique cle : SecOC n'y change rien. Authentifier les messages n'empeche pas de saturer le media. Seul un IDS ou de la redondance aide, et le bus reste indisponible.",
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
      "Forcer un calculateur legitime a se deconnecter du bus, puis prendre sa place.",
    principe:
      "On exploite la gestion d'erreur du CAN. En provoquant des erreurs ciblees pendant les emissions d'un calculateur, on fait grimper son compteur d'erreur jusqu'a l'etat bus-off : il se tait. L'attaquant usurpe alors son identifiant sans concurrence.",
    pourquoi:
      "Le mecanisme de confinement d'erreur (TEC/REC, passage en error-passive puis bus-off) est automatique et obligatoire. Detourne, il devient une arme : la victime s'auto-exclut en croyant etre defaillante.",
    methode: [
      "Synchroniser une injection de bit d'erreur sur les trames de la cible",
      "Faire monter son compteur d'erreur jusqu'au bus-off",
      "Emettre a sa place une fois la cible silencieuse",
    ],
    prerequis: ["Acces au bus", "Maitrise fine du timing (materiel adapte)"],
    effet: "Un calculateur s'eteint sur le schema ; un noeud attaquant reprend son identifiant.",
    remediations: [
      "Surveillance des compteurs d'erreur (remontee anormale)",
      "IDS embarque",
      "SecOC pour l'authenticite une fois l'usurpation tentee",
    ],
    annexe5: "Famille 2.",
    outils: ["recherche academique", "materiel CAN specialise"],
    casReel: "Decrite dans la litterature academique (bus-off attack, 2016).",
    blockedBy: ["secoc"],
    verdictPass:
      "Sans SecOC, une fois la cible en bus-off, l'attaquant emet sous son identite sans etre contredit.",
    verdictBlock:
      "SecOC limite l'usurpation applicative : meme la cible reduite au silence, les trames de l'attaquant n'ont pas de MAC valide. Un IDS detecte en plus la montee des compteurs d'erreur.",
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
      "Couper physiquement le bus en deux et s'inserer au milieu pour relayer, modifier ou bloquer les trames.",
    principe:
      "Comme le CAN est diffuse, un vrai homme du milieu impose de segmenter physiquement le bus avec un dispositif a deux interfaces, qui decide trame par trame ce qui passe.",
    pourquoi:
      "Sur un media partage, on ne peut pas s'intercaler logiquement entre deux noeuds : il faut casser le segment. Une fois le pont en place, l'attaquant a le controle total du flux entre les deux moities.",
    methode: [
      "Scinder le bus a l'endroit choisi",
      "Inserer le dispositif pont a deux interfaces CAN",
      "Filtrer, retarder ou modifier les trames relayees",
    ],
    prerequis: ["Acces physique etendu au faisceau", "Materiel a deux interfaces CAN"],
    effet: "Un dispositif apparait sur le bus ; les trames transitent par lui et peuvent etre alterees.",
    remediations: [
      "Integrite physique du faisceau",
      "SecOC (une trame modifiee perd son MAC)",
      "Detection de latence/anomalie",
    ],
    annexe5: "Famille 2.",
    outils: ["materiel a deux interfaces CAN"],
    casReel: "Base de nombreux bancs d'analyse et de certains outils de vol haut de gamme.",
    blockedBy: ["secoc"],
    verdictPass:
      "Sans SecOC, le pont peut modifier les trames au passage sans etre detecte.",
    verdictBlock:
      "SecOC protege l'integrite : si le pont modifie une trame authentifiee, son code d'authentification devient invalide et le recepteur la rejette.",
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
    resume: "Casser le verrou qui protege les fonctions de diagnostic sensibles.",
    principe:
      "Le service UDS 0x27 fonctionne en seed/key : le calculateur envoie une graine, le client doit renvoyer une cle calculee par un algorithme secret. Algorithme faible, cle extraite du firmware ou absence de limitation des essais ouvrent le verrou.",
    pourquoi:
      "La securite repose entierement sur le secret de l'algorithme et sur une temporisation anti-brute-force. Si l'un ou l'autre manque, le seed/key n'est qu'une formalite : la relation graine -> cle est deterministe.",
    methode: [
      "Demander une graine (requete 0x27)",
      "Calculer la cle si l'algorithme est connu, sinon la forcer faute de temporisation",
      "Renvoyer la cle et obtenir la session securisee",
    ],
    prerequis: ["Acces diagnostic (OBD ou DoIP)", "Parfois l'algorithme extrait du firmware"],
    effet: "Le verrou cede et deverrouille les services sensibles qui suivent (ecriture, reflashage).",
    remediations: [
      "Algorithme robuste et cle protegee (HSM)",
      "Temporisation et verrouillage apres echecs (anti-brute-force)",
      "Rotation des cles",
    ],
    annexe5: "Familles 5 (interface diagnostic) et 7.",
    outils: ["python-udsoncan", "scripts UDS"],
    casReel:
      "De nombreux algorithmes seed/key de serie se sont averes faibles ou extraits par retro-ingenierie du firmware.",
    frame: {
      caption: "Echange UDS SecurityAccess (exemple)",
      lines: [
        { text: "-> 27 01            requestSeed" },
        { text: "<- 67 01 A3 7F 10 2C   seed" },
        { text: "-> 27 02 7C 41 9B 6E   sendKey (cle calculee)", mark: "hl" },
        { text: "<- 67 02            acces accorde", mark: "ok" },
      ],
    },
    blockedBy: ["durcissement"],
    verdictPass:
      "Interfaces diagnostic non durcies : pas de temporisation, algorithme faible, le verrou tombe.",
    verdictBlock:
      "Le durcissement impose temporisation, verrouillage apres echecs et cle protegee : le brute-force devient impraticable et l'algorithme n'est plus extractible facilement.",
  },
  {
    id: "B2",
    layer: "B",
    level: "avance",
    nom: "Reflashage malveillant (RequestDownload 0x34)",
    entry: "obd",
    route: ["entry:obd", "gateway", "ecm"],
    target: "ecm",
    resume: "Installer un firmware modifie dans un calculateur.",
    principe:
      "Le service 0x34 initie un transfert de donnees vers le calculateur, etape du reflashage, suivi de 0x36 (TransferData) et 0x37. Si l'authenticite du firmware n'est pas verifiee, on installe le sien.",
    pourquoi:
      "Sans Secure Boot ni signature verifiee a l'ecriture et au demarrage, le calculateur execute n'importe quel binaire correctement transfere. Le reflashage legitime et le reflashage malveillant suivent la meme sequence UDS.",
    methode: [
      "Obtenir SecurityAccess (voir B1)",
      "Lancer RequestDownload puis TransferData avec le firmware prepare",
      "Valider le transfert (RequestTransferExit)",
    ],
    prerequis: ["Acces diagnostic", "SecurityAccess franchi"],
    effet: "Le calculateur passe sous controle de l'attaquant (couleur distincte sur le plan).",
    remediations: [
      "Secure Boot et signature du firmware",
      "Verification d'integrite et anti-rollback",
      "Cles de signature protegees cote constructeur",
    ],
    annexe5: "Familles 3 (procedures de mise a jour) et 6 (code).",
    outils: ["outils de flash constructeur detournes", "scripts UDS"],
    casReel:
      "La prise de controle persistante d'un calculateur passe presque toujours par un reflashage non authentifie.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans verification d'authenticite, le firmware malveillant s'installe et persiste.",
    verdictBlock:
      "Le durcissement (Secure Boot, signature, anti-rollback) refuse un binaire non signe : l'installation echoue et le calculateur reste sain.",
  },
  {
    id: "B3",
    layer: "B",
    level: "avance",
    nom: "Abus de WriteDataByIdentifier (0x2E)",
    entry: "obd",
    route: ["entry:obd", "gateway", "ic"],
    target: "ic",
    resume: "Ecrire directement une donnee dans un calculateur sans y etre autorise.",
    principe:
      "Le service 0x2E ecrit la valeur d'un identifiant de donnee (DID). S'il est accessible sans authentification correcte, on modifie des parametres internes : calibration, configuration, odometre.",
    pourquoi:
      "Le controle d'acces se fait service par service et DID par DID. Une matrice de droits trop permissive, ou un DID sensible laisse ecrivable en session par defaut, suffit a ouvrir l'ecriture.",
    methode: [
      "Entrer dans la session diagnostic requise (et SecurityAccess si demande)",
      "Emettre 0x2E avec le DID cible et la nouvelle valeur",
    ],
    prerequis: ["Acces diagnostic"],
    effet: "Un parametre affiche change : par exemple une valeur de configuration ou un kilometrage.",
    remediations: [
      "Controle d'acces strict par service et par DID",
      "Separation des droits (ecriture reservee a une session securisee)",
    ],
    annexe5: "Familles 5 et 6.",
    outils: ["python-udsoncan", "scripts UDS"],
    casReel: "La fraude a l'odometre via UDS est un cas courant et documente.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Interfaces non durcies : le DID sensible est ecrivable, la valeur change.",
    verdictBlock:
      "Le durcissement restreint 0x2E aux seuls DID autorises en session securisee : l'ecriture est refusee.",
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
      "Declencher a distance de maintenance une routine interne du calculateur : purge de freins, test d'actionneur, apprentissage.",
    principe:
      "Le service 0x31 lance des routines usine/atelier (startRoutine). Certaines pilotent directement des actionneurs. Accessibles sans controle suffisant, elles deviennent des commandes physiques.",
    pourquoi:
      "Ces routines existent pour l'apres-vente et agissent reellement sur le materiel. Leur dangerosite tient a ce qu'elles court-circuitent la logique applicative normale : elles sont faites pour piloter l'actionneur directement.",
    methode: [
      "Identifier l'identifiant de routine d'un actionneur sensible",
      "Entrer dans la session requise",
      "Lancer la routine (0x31 01) avec ses parametres",
    ],
    prerequis: ["Acces diagnostic", "Session et droits suffisants"],
    effet: "Un actionneur reagit hors contexte : par exemple une routine de freinage se declenche.",
    remediations: [
      "Conditions strictes d'activation (vehicule a l'arret, session securisee)",
      "Controle d'acces par routine",
      "Journalisation",
    ],
    annexe5: "Familles 5 et 6.",
    outils: ["scripts UDS"],
    casReel: "Les routines d'actionneur sont une cible connue des audits apres-vente.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans durcissement, la routine se lance meme hors des conditions prevues.",
    verdictBlock:
      "Le durcissement impose les conditions d'activation et restreint l'acces a la routine : le declenchement est refuse.",
  },
  {
    id: "B5",
    layer: "B",
    level: "debutant",
    nom: "Deni de service par reset diagnostic (0x11 / 0x3E)",
    entry: "obd",
    route: ["entry:obd", "gateway", "ecm"],
    target: "ecm",
    resume:
      "Garder un calculateur en session diagnostic ou le reinitialiser en boucle pour le rendre indisponible.",
    principe:
      "Un calculateur maintenu en session diagnostic (via TesterPresent 0x3E) peut suspendre une partie de ses fonctions normales. Repeter ECUReset (0x11) le relance sans cesse.",
    pourquoi:
      "La session diagnostic est prevue pour l'atelier, vehicule immobilise. Rien n'empeche toujours d'y entrer et d'y rester, ou de spammer le reset : le protocole ne limite pas la frequence de ces requetes par defaut.",
    methode: [
      "Entrer en session diagnostic et envoyer TesterPresent en continu",
      "Ou repeter ECUReset pour empecher le fonctionnement normal",
    ],
    prerequis: ["Acces diagnostic"],
    effet: "Le calculateur ne repond plus normalement : fonctions degradees, voyants.",
    remediations: [
      "Interdiction d'entrer en session diagnostic vehicule roulant",
      "Limitation de frequence des requetes",
      "IDS",
    ],
    annexe5: "Familles 5 et 2 (disponibilite).",
    outils: ["scripts UDS"],
    casReel: "Effet de bord connu des sessions diagnostic mal conditionnees.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Interfaces non durcies : la session reste ouverte ou le reset se repete, le calculateur decroche.",
    verdictBlock:
      "Le durcissement conditionne la session diagnostic (vehicule a l'arret) et limite la frequence : le deni de service par diagnostic est bloque.",
  },

  // ---------------------------------------------------------------- Couche C
  {
    id: "C1",
    layer: "C",
    level: "debutant",
    nom: "Attaque par relais sur cle sans contact (PKES)",
    entry: "key",
    route: ["entry:key", "peps"],
    target: "peps",
    resume: "Etendre la portee de la cle pour ouvrir et demarrer sans l'avoir.",
    principe:
      "Le systeme PEPS deverrouille quand la cle est proche. Deux complices relaient le signal entre la cle (chez vous) et le vehicule (dans la rue) : le vehicule croit la cle a cote.",
    pourquoi:
      "Le PEPS deduit la proximite de la seule puissance recue du signal, sans mesurer le temps de vol. Un relais rallonge le canal sans que le systeme sache que la cle est en realite a dix metres... ou cent.",
    methode: [
      "Un dispositif capte le signal pres de la cle",
      "Un second le rejoue pres du vehicule",
      "Le vehicule ouvre et autorise le demarrage",
    ],
    prerequis: ["Proximite de la cle et du vehicule", "Deux dispositifs radio relais"],
    effet: "La cle eloignee est reliee au vehicule par le relais ; les portes s'ouvrent.",
    remediations: [
      "Mesure de distance par temps de vol (UWB)",
      "Capteur de mouvement dans la cle (desactivation au repos)",
      "Desactivation RF possible par l'utilisateur",
    ],
    annexe5: "Famille 5 (connectivite externe).",
    outils: ["materiel radio de relais (recherche)"],
    casReel:
      "Demonstre sur de nombreux modeles premium ; relais sur Tesla Model S par KeenLab (2018), parade par l'UWB sur les generations recentes.",
    blockedBy: [],
    verdictPass:
      "Parade specifique au PEPS : aucune des contre-mesures du modele (SecOC, segmentation, durcissement) ne traite le relais. Il faut de l'UWB ou un capteur de mouvement dans la cle.",
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
    resume: "Entrer par l'ecran connecte, puis sauter jusqu'aux fonctions critiques.",
    principe:
      "L'infotainment expose des interfaces distantes (cellulaire, Wi-Fi). Une faille y donne un pied ; si la segmentation est insuffisante, l'attaquant atteint le bus et des fonctions physiques.",
    pourquoi:
      "Tout tient au cloisonnement. L'identifiant CAN n'etant pas une adresse d'emetteur, un noeud qui atteint le bus critique peut tout y emettre. La passerelle est la seule a pouvoir refuser le passage d'un domaine a l'autre.",
    methode: [
      "Exploiter l'IVI a distance via l'interface cellulaire",
      "Atteindre le microcontrole relie au bus (second coeur de l'IVI)",
      "Franchir la passerelle faute de filtrage inter-domaines",
      "Injecter la commande sur le bus chassis",
    ],
    prerequis: ["Acces distant (cellulaire/Wi-Fi)", "Faille applicative sur l'IVI", "Segmentation faible"],
    effet: "Le chemin traverse la passerelle de l'antenne jusqu'au freinage, qui passe sous controle.",
    remediations: [
      "Segmentation stricte par passerelle, filtrage inter-domaines",
      "Durcissement et mise a jour de l'IVI",
      "IDS sur les bus critiques",
    ],
    annexe5: "Familles 1 (back-end), 5 (connectivite) et 2.",
    outils: ["reference : Miller & Valasek, Jeep Cherokee 2015"],
    casReel:
      "Jeep Cherokee 2015 : prise de controle a distance via Uconnect, jusqu'a la direction et aux freins. 1,4 million de vehicules rappeles.",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation, le pivot traverse la passerelle et atteint le freinage. SecOC ne changerait rien ici si l'attaquant emet des commandes valides.",
    verdictBlock:
      "La passerelle rejette le pivot inter-domaines : la commande n'atteint jamais le freinage. Le reste du vehicule continue de fonctionner.",
  },
  {
    id: "C3",
    layer: "C",
    level: "avance",
    nom: "Exploitation de la telematique (TCU) a distance",
    entry: "cell",
    route: ["entry:cell", "tcu", "gateway"],
    target: "gateway",
    resume:
      "Attaquer le modem embarque pour entrer dans le vehicule depuis n'importe ou.",
    principe:
      "La TCU est connectee au reseau cellulaire et au backend constructeur. Une faille cote TCU ouvre un acces distant, potentiellement a l'echelle d'une flotte.",
    pourquoi:
      "La TCU est un point d'entree permanent, toujours joignable, et souvent relie au bus. Compromise, elle offre a l'attaquant la meme position qu'un calculateur interne, mais a distance.",
    methode: [
      "Compromettre la TCU via son interface reseau",
      "S'appuyer sur sa connexion au bus pour emettre des commandes",
      "Repeter l'operation sur les vehicules identiques",
    ],
    prerequis: ["Acces distant", "Faille TCU"],
    effet: "Entree par le toit (antenne), chemin vers la passerelle et les domaines.",
    remediations: [
      "Durcissement de la TCU",
      "Segmentation (limite la portee une fois dans le vehicule)",
      "Authentification forte vers le backend",
    ],
    annexe5: "Familles 1 et 5.",
    outils: ["reference generale"],
    casReel:
      "BMW ConnectedDrive (2015, Dieter Spaar) : commandes envoyees a distance via la liaison telematique sur ~2,2 millions de vehicules.",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation, la TCU compromise atteint les domaines critiques depuis le reseau.",
    verdictBlock:
      "La segmentation confine la TCU : meme compromise, elle ne peut pas franchir la passerelle vers les fonctions critiques.",
  },
  {
    id: "C4",
    layer: "C",
    level: "avance",
    nom: "Mise a jour OTA malveillante ou rollback",
    entry: "cell",
    route: ["entry:cell", "tcu"],
    target: "tcu",
    resume: "Pousser une fausse mise a jour, ou forcer un retour a une version vulnerable.",
    principe:
      "Si l'authenticite et la version des mises a jour ne sont pas verifiees, un attaquant installe du code ou ramene une faille deja corrigee (rollback).",
    pourquoi:
      "Le canal OTA est un pouvoir d'ecriture a distance sur tout le parc. Sans signature ni anti-rollback, il devient le vecteur ideal : massif, persistant, et legitime aux yeux du vehicule.",
    methode: [
      "Se placer sur le canal de mise a jour ou usurper sa source",
      "Pousser un paquet non signe, ou rejouer une ancienne version signee mais vulnerable",
    ],
    prerequis: ["Position sur le canal de mise a jour"],
    effet: "Une mise a jour arrive par l'antenne : acceptee sans defense, rejetee avec defense.",
    remediations: [
      "Signature des mises a jour et verification d'integrite",
      "Anti-rollback (refus des versions anterieures)",
      "Tracabilite (RXSWIN, UNECE R156)",
    ],
    annexe5: "Famille 3 (procedures de mise a jour).",
    outils: ["conceptuel"],
    casReel:
      "Le reglement UNECE R156 impose justement un systeme de gestion des mises a jour pour fermer cette porte.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans verification de signature ni anti-rollback, le paquet malveillant ou l'ancienne version s'installe.",
    verdictBlock:
      "Le durcissement (signature verifiee, anti-rollback) refuse un paquet non signe comme un retour en arriere : la mise a jour est rejetee.",
  },
  {
    id: "C5",
    layer: "C",
    level: "debutant",
    nom: "RollJam : capture du code tournant (RKE)",
    entry: "key",
    route: ["entry:key", "bcm"],
    target: "bcm",
    resume:
      "Brouiller la telecommande, capturer un code non consomme et le rejouer plus tard.",
    principe:
      "L'ouverture a distance (RKE) utilise un code tournant a usage unique. L'attaquant brouille la reception du vehicule tout en capturant le code emis ; l'utilisateur reappuie, l'attaquant garde le premier code valide et rejoue a volonte.",
    pourquoi:
      "Le code tournant n'est invalide qu'une fois recu par le vehicule. En empechant cette reception, l'attaquant conserve un code encore valide. Le compteur du vehicule n'a pas avance : le rejeu passe.",
    methode: [
      "Brouiller la bande de reception du vehicule",
      "Capturer le ou les codes emis par la telecommande",
      "Laisser passer un code pour ne pas eveiller le soupcon, garder l'autre",
    ],
    prerequis: ["Proximite de la cle au moment de l'usage", "Un emetteur-recepteur SDR"],
    effet: "Le vehicule se deverrouille au rejeu du code capture.",
    remediations: [
      "Fenetre de validite temporelle courte cote vehicule",
      "Codes lies a l'horloge (rolling code horodate)",
      "Passage a des protocoles a defi-reponse",
    ],
    annexe5: "Famille 5.",
    outils: ["SDR (recherche)", "reference : RollJam, Samy Kamkar 2015"],
    casReel: "RollJam, presente par Samy Kamkar en 2015, efficace sur de nombreuses telecommandes a code tournant.",
    blockedBy: [],
    verdictPass:
      "Parade specifique au RKE : les contre-mesures du modele ne traitent pas la radio de la telecommande. Il faut une fenetre temporelle ou un defi-reponse cote systeme de cle.",
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
      "Entrer par la pile Bluetooth de l'infotainment, ou relayer le deverrouillage BLE d'un telephone-cle.",
    principe:
      "Deux angles : une faille dans la pile Bluetooth de l'IVI donne un pied a courte portee ; ou, pour les acces par smartphone (Phone-as-a-Key), un relais BLE etend la portee comme pour le PKES.",
    pourquoi:
      "Les piles Bluetooth sont de gros logiciels historiquement bugges. Et le BLE, comme le PKES, deduit la proximite du signal : un relais le trompe, car la specification BLE ne garantit pas la distance.",
    methode: [
      "Cibler la pile Bluetooth de l'IVI pour l'execution de code, ou",
      "Relayer la liaison BLE entre le telephone-cle et le vehicule",
    ],
    prerequis: ["Proximite Bluetooth", "Faille de pile ou acces BLE sans mesure de distance"],
    effet: "L'IVI passe sous controle, ou le vehicule s'ouvre via le relais BLE.",
    remediations: [
      "Mises a jour de la pile Bluetooth",
      "Mesure de distance (UWB) pour les acces par telephone",
      "Durcissement et isolation de l'IVI",
    ],
    annexe5: "Familles 5 et 7.",
    outils: ["reference : relais BLE Tesla, NCC Group 2022"],
    casReel:
      "Relais BLE sur Tesla (NCC Group, 2022) : deverrouillage et demarrage malgre le chiffrement, car la distance n'etait pas verifiee.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans durcissement/mise a jour de l'IVI, la faille Bluetooth donne un acces local exploitable.",
    verdictBlock:
      "Le durcissement (pile a jour, IVI isole) ferme la faille applicative. Le relais BLE pur, lui, releve d'une parade de type UWB cote acces.",
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
      "Une fausse station de base (IMSI catcher / femtocell pirate) se fait passer pour le reseau. La TCU s'y rattache, surtout si elle accepte encore la 2G ou si elle ne valide pas le reseau.",
    pourquoi:
      "Le rattachement cellulaire privilegie le signal le plus fort, et la 2G n'authentifie pas le reseau cote terminal. Une antenne pirate plus puissante capte donc la TCU et se place entre elle et le backend.",
    methode: [
      "Emettre une cellule pirate plus puissante que le reseau legitime",
      "Forcer le repli de la TCU vers un mode faible (2G)",
      "Intercepter ou alterer le trafic vers le backend",
    ],
    prerequis: ["Proximite du vehicule", "Materiel radio cellulaire"],
    effet: "Le trafic de la TCU transite par l'attaquant ; commandes et mises a jour deviennent manipulables.",
    remediations: [
      "Interdire le repli 2G",
      "TLS mutuel TCU <-> backend (certificats epingles)",
      "Detection d'anomalie de reseau",
    ],
    annexe5: "Familles 1 et 5.",
    outils: ["SDR cellulaire (recherche)"],
    casReel: "Technique eprouvee contre de nombreux objets connectes cellulaires mal configures.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans durcissement (repli 2G permis, pas d'epinglage), la TCU parle a l'antenne pirate.",
    verdictBlock:
      "Le durcissement (pas de 2G, TLS mutuel epingle) empeche le rattachement pirate et l'interception.",
  },
  {
    id: "C8",
    layer: "C",
    level: "debutant",
    nom: "Appli compagnon et API detournees",
    entry: "cell",
    route: ["entry:cell", "tcu"],
    target: "tcu",
    resume:
      "Abuser de l'API de l'application mobile pour commander le vehicule d'un autre utilisateur.",
    principe:
      "L'application compagnon pilote le vehicule via une API backend. Des controles d'acces insuffisants (autorisation par objet, reference directe non verifiee) permettent d'agir sur un vehicule qui n'est pas le sien.",
    pourquoi:
      "C'est de la securite web classique appliquee a l'automobile : si le backend verifie qui vous etes mais pas a quoi vous avez droit, connaitre l'identifiant d'un autre vehicule suffit a lui envoyer des commandes.",
    methode: [
      "Observer les appels de l'application mobile",
      "Rejouer un appel en changeant l'identifiant du vehicule cible",
      "Declencher des fonctions a distance (localisation, ouverture, climatisation)",
    ],
    prerequis: ["Un compte sur le service", "Une API aux controles d'acces faibles"],
    effet: "Des commandes a distance partent vers un vehicule tiers via le backend.",
    remediations: [
      "Autorisation par objet cote backend (liaison compte <-> vehicule verifiee)",
      "Tests d'API (references directes, enumeration)",
      "Journalisation et limitation de debit",
    ],
    annexe5: "Famille 1 (back-end et services).",
    outils: ["outils de test d'API web"],
    casReel:
      "Nissan Leaf (Troy Hunt, 2016) : l'API ne verifiait que le VIN, permettant d'agir sur d'autres vehicules. Nombreux cas analogues depuis (Sam Curry et al., 2023).",
    blockedBy: ["durcissement"],
    verdictPass:
      "Backend non durci : l'API accepte une commande sur un vehicule qui n'appartient pas au compte.",
    verdictBlock:
      "Le durcissement (autorisation par objet) verifie que le vehicule appartient bien au compte : la commande croisee est refusee.",
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
      "Prendre le backend constructeur, et avec lui la capacite d'agir sur des milliers de vehicules.",
    principe:
      "Le backend orchestre telematique, mises a jour et commandes a distance. Compromis, il offre un levier a l'echelle de la flotte entiere.",
    pourquoi:
      "C'est le point de convergence : un seul systeme parle a tous les vehicules avec une relation de confiance etablie. La portee de l'attaque n'est plus un vehicule, mais le parc. C'est le vecteur dominant des incidents recents.",
    methode: [
      "Compromettre un composant du backend ou d'un fournisseur",
      "Abuser de la relation de confiance backend -> vehicules",
      "Diffuser commandes ou mises a jour a grande echelle",
    ],
    prerequis: ["Acces a un maillon du backend ou de la chaine fournisseurs"],
    effet: "Entree par l'antenne, chemin vers la passerelle, replicable sur toute une flotte.",
    remediations: [
      "Securite backend (segmentation, moindre privilege, supervision)",
      "Segmentation embarquee (limite ce qu'un ordre backend peut faire)",
      "Authentification forte et signature des ordres",
    ],
    annexe5: "Famille 1.",
    outils: ["reference generale"],
    casReel:
      "En 2024-2025, telematique, cloud et API concentrent environ deux tiers des attaques automobiles publiques (rapport Upstream).",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation embarquee, un ordre venu du backend compromis atteint les fonctions critiques.",
    verdictBlock:
      "La segmentation limite ce qu'un ordre backend peut declencher a bord : la portee d'une compromission cloud est contenue.",
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
    resume: "Le meme diagnostic UDS, mais encapsule dans l'Ethernet automobile.",
    principe:
      "DoIP (ISO 13400) transporte UDS sur IP. Les memes services sensibles (0x27, 0x34) sont joignables, potentiellement a plus grande portee et a plus haut debit.",
    pourquoi:
      "Passer sur IP apporte la vitesse et la portee du reseau, mais aussi ses faiblesses : si l'interface DoIP est joignable sans authentification reseau, c'est UDS expose comme un service TCP ordinaire.",
    methode: [
      "Atteindre l'interface DoIP (port 13400)",
      "Etablir la session et dialoguer en UDS sur IP",
      "Enchainer sur SecurityAccess et reflashage (B1, B2) a plus haut debit",
    ],
    prerequis: ["Acces au reseau Ethernet embarque"],
    effet: "Un flux IP vers un calculateur ; les services UDS sont joues sur IP.",
    remediations: [
      "Authentification et segmentation reseau (VLAN)",
      "Pare-feu embarque, TLS",
      "Durcissement des services UDS (voir couche B)",
    ],
    annexe5: "Familles 5 et 2.",
    outils: ["python-doipclient", "scripts DoIP"],
    casReel: "DoIP est la norme de diagnostic des vehicules recents a architecture Ethernet.",
    blockedBy: ["segmentation", "durcissement"],
    verdictPass:
      "Interface DoIP joignable et UDS non durci : le diagnostic sur IP ouvre tout, plus vite.",
    verdictBlock:
      "Segmentation reseau et durcissement des services ferment l'acces DoIP non autorise et bloquent les requetes sensibles.",
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
      "Usurper la communication orientee service sur l'Ethernet du vehicule.",
    principe:
      "SOME/IP est le middleware de services sur Automotive Ethernet. Sans authentification, on usurpe un service ou on se place en homme du milieu (par ARP spoofing), comme sur un reseau IP classique.",
    pourquoi:
      "SOME/IP ne prevoit pas d'authentification par defaut, et la decouverte de services (SOME/IP-SD) annonce qui offre quoi. L'attaquant se declare fournisseur d'un service, ou detourne le trafic entre deux calculateurs.",
    methode: [
      "Decouvrir les services annonces (SOME/IP-SD)",
      "Usurper un service ou se placer en MITM (ARP spoofing)",
      "Injecter de fausses donnees de service (ex. perception ADAS)",
    ],
    prerequis: ["Acces au reseau Ethernet embarque"],
    effet: "Un service est detourne ou un flux intercepte entre deux calculateurs Ethernet.",
    remediations: [
      "Authentification des services",
      "Segmentation VLAN et filtrage",
      "Chiffrement et detection d'ARP spoofing",
    ],
    annexe5: "Famille 2.",
    outils: ["outils reseau classiques adaptes", "scripts SOME/IP"],
    casReel: "Surface d'attaque emergente des architectures zonales a Ethernet.",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation ni authentification de service, l'usurpation SOME/IP passe.",
    verdictBlock:
      "La segmentation (VLAN, filtrage) empeche un noeud d'usurper un service ou de se placer en MITM hors de sa zone.",
  },
  {
    id: "D3",
    layer: "D",
    level: "avance",
    nom: "Perturbation Ethernet temps reel (AVB/TSN)",
    entry: "obd",
    route: ["entry:obd", "gateway"],
    busHighlight: ["info"],
    resume:
      "Casser la synchronisation ou la priorite des flux temps reel de l'Ethernet embarque.",
    principe:
      "AVB/TSN garantit la livraison a temps des flux critiques (video ADAS, audio) grace a une horloge commune (gPTP) et a la reservation de bande. Fausser l'horloge ou saturer une classe de trafic degrade ces garanties.",
    pourquoi:
      "Les garanties temps reel reposent sur la confiance dans le maitre d'horloge et dans la reservation. Un noeud malveillant qui se declare maitre gPTP ou inonde une classe prioritaire fait perdre leurs echeances aux flux critiques.",
    methode: [
      "Usurper le maitre d'horloge gPTP, ou",
      "Saturer une classe de trafic prioritaire",
      "Degrader les flux temps reel dependants (perception, affichage)",
    ],
    prerequis: ["Acces au reseau Ethernet embarque"],
    effet: "Les flux temps reel perdent leurs echeances : video saccadee, donnees en retard.",
    remediations: [
      "Authentification du maitre d'horloge",
      "Isolation VLAN et controle d'admission des flux",
      "Supervision des metriques TSN",
    ],
    annexe5: "Famille 2 (disponibilite et integrite temporelle).",
    outils: ["outils reseau temps reel (recherche)"],
    casReel: "Surface specifique aux architectures Ethernet temps reel recentes.",
    blockedBy: ["segmentation"],
    verdictPass:
      "Sans segmentation ni controle d'admission, un noeud degrade les garanties temps reel.",
    verdictBlock:
      "La segmentation (VLAN, controle d'admission, maitre d'horloge authentifie) confine le noeud et protege les flux critiques.",
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
      "Emettre de faux messages vehicule-a-tout (V2X) pour tromper la perception ou l'aide a la conduite.",
    principe:
      "Le V2X (802.11p / C-V2X) laisse les vehicules echanger position et alertes. De faux messages (vehicule fantome, faux freinage d'urgence) peuvent induire en erreur les fonctions qui s'y fient.",
    pourquoi:
      "Le V2X s'appuie sur une infrastructure de certificats (SCMS) pour authentifier les emetteurs. Si la validation des certificats est faible ou contournee, un message forge devient credible. Le GNSS, lui, se leurre aussi (spoofing GPS).",
    methode: [
      "Emettre des messages V2X forges (position, alerte)",
      "Ou leurrer le GNSS pour fausser la position percue",
      "Exploiter une validation de certificat insuffisante",
    ],
    prerequis: ["Emetteur radio V2X ou GNSS", "Validation de certificats faible"],
    effet: "Un faux vehicule ou une fausse alerte apparait a la perception / aide a la conduite.",
    remediations: [
      "Validation stricte des certificats V2X (SCMS)",
      "Fusion multi-capteurs (ne pas se fier au seul V2X/GNSS)",
      "Detection d'incoherence GNSS",
    ],
    annexe5: "Familles 2 et 5.",
    outils: ["SDR (recherche)", "reference : spoofing GPS Regulus/Tesla 2019"],
    casReel:
      "Regulus a leurre le GPS d'une Tesla en Autopilot (2019), provoquant des manoeuvres non sollicitees.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans validation stricte, le message V2X forge est accepte et trompe la perception.",
    verdictBlock:
      "Le durcissement (validation SCMS, fusion multi-capteurs) rejette les messages non authentifies et recoupe les sources.",
  },

  // ---------------------------------------------------------------- Couche E
  {
    id: "E1",
    layer: "E",
    level: "avance",
    nom: "Acces par port de debogage (JTAG / SWD)",
    entry: "debug",
    route: ["entry:debug", "ecm"],
    target: "ecm",
    resume:
      "Utiliser un port de debogage laisse accessible pour prendre la main sur un calculateur.",
    principe:
      "JTAG/SWD donnent un controle total du microcontroleur : lecture/ecriture memoire, arret, pas-a-pas. Laisses actifs en serie, ils ouvrent la porte a l'extraction et a la modification.",
    pourquoi:
      "Ces interfaces existent pour le developpement et la production. Si elles ne sont pas desactivees ou verrouillees avant la mise en serie, elles restent un acces de niveau constructeur offert a qui ouvre le boitier.",
    methode: [
      "Localiser les points de test du port de debogage sur la carte",
      "S'y connecter avec une sonde",
      "Lire/modifier la memoire et le flux d'execution",
    ],
    prerequis: ["Acces physique au calculateur", "Une sonde de debogage"],
    effet: "Le calculateur est entierement sous controle : code et secrets exposes.",
    remediations: [
      "Desactivation ou verrouillage des ports de debogage en production",
      "Fusibles de securite (lifecycle du composant)",
      "Detection d'ouverture du boitier",
    ],
    annexe5: "Familles 6 et 7.",
    outils: ["sondes JTAG/SWD (recherche materielle)"],
    casReel: "Point de depart frequent de l'analyse materielle d'un calculateur.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Port de debogage laisse actif : acces complet au calculateur.",
    verdictBlock:
      "Le durcissement (debogage verrouille, fusibles de securite) rend le port inutilisable en serie.",
  },
  {
    id: "E2",
    layer: "E",
    level: "avance",
    nom: "Extraction du firmware (dump memoire)",
    entry: "debug",
    route: ["entry:debug", "ecm"],
    target: "ecm",
    resume:
      "Recuperer le firmware d'un calculateur pour l'analyser et trouver cles et failles.",
    principe:
      "En lisant la memoire (via debogage, ou directement la puce), on obtient le firmware. Son analyse revele algorithmes seed/key, cles, et vulnerabilites reutilisables sur tous les exemplaires.",
    pourquoi:
      "Un firmware extrait une fois sert contre tout le parc : il expose les secrets communs (algorithmes, cles de serie) et permet de preparer les attaques logiques hors ligne, sans limite d'essais.",
    methode: [
      "Lire la memoire via le port de debogage, ou retirer/lire la puce (chip-off)",
      "Reconstituer et desassembler le firmware",
      "En extraire algorithmes, cles et failles",
    ],
    prerequis: ["Acces physique au calculateur", "Protection en lecture absente ou contournee"],
    effet: "Le contenu du calculateur est exfiltre pour analyse hors ligne.",
    remediations: [
      "Protection en lecture de la memoire (readout protection)",
      "Chiffrement du firmware et secrets en HSM",
      "Verrouillage du cycle de vie du composant",
    ],
    annexe5: "Familles 6 et 7.",
    outils: ["programmateurs memoire, lecture de puce (recherche materielle)"],
    casReel: "Prealable classique a la retro-ingenierie des algorithmes seed/key (voir B1).",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans protection en lecture, la memoire se vide et livre ses secrets.",
    verdictBlock:
      "Le durcissement (readout protection, firmware chiffre, cles en HSM) rend l'extraction infructueuse.",
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
      "Perturber brievement le calculateur au bon moment pour sauter la verification de signature au demarrage.",
    principe:
      "L'injection de faute (glitch de tension ou d'horloge) provoque une erreur de calcul ponctuelle. Visant l'instant de la verification de signature, elle fait passer un test qui aurait du echouer.",
    pourquoi:
      "Secure Boot repose sur une comparaison a un instant precis. Une faute materielle peut corrompre ce test unique (sauter un saut conditionnel), ouvrant l'execution d'un firmware non signe meme si la cryptographie est, elle, correcte.",
    methode: [
      "Identifier l'instant de la verification de signature",
      "Injecter une faute (tension/horloge) a cet instant precis",
      "Faire executer un firmware non signe",
    ],
    prerequis: ["Acces physique", "Materiel d'injection de faute et mise au point du timing"],
    effet: "Le demarrage securise est contourne ; du code non signe s'execute.",
    remediations: [
      "Contre-mesures anti-glitch (double verification, detecteurs)",
      "Verifications redondantes et aleatoirisees",
      "Capteurs de tension/horloge",
    ],
    annexe5: "Familles 6 et 7.",
    outils: ["plateformes d'injection de faute (recherche, ex. ChipWhisperer)"],
    casReel: "Technique eprouvee de la securite materielle, appliquee a des calculateurs embarques.",
    blockedBy: ["durcissement"],
    verdictPass:
      "Sans contre-mesure anti-faute, le glitch fait sauter la verification et le code non signe s'execute.",
    verdictBlock:
      "Le durcissement (double verification, detecteurs de glitch) rend l'injection de faute non fiable et preserve le Secure Boot.",
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
      "Interrompre a distance la charge rapide d'un vehicule electrique en brouillant sa communication avec la borne.",
    principe:
      "La charge rapide CCS fait dialoguer vehicule et borne par courant porteur (HomePlug Green PHY) selon ISO 15118. Un signal de brouillage sans fil suffit a couper ce dialogue et a stopper la charge.",
    pourquoi:
      "La couche physique de communication rayonne et n'est pas protegee contre le brouillage. L'attaque vise le signal lui-meme, pas la cryptographie : couper la conversation suffit a arreter la charge, a distance et sans contact.",
    methode: [
      "Emettre un signal de brouillage sur la bande du courant porteur",
      "Rompre la communication vehicule <-> borne",
      "Maintenir le brouillage pour empecher la reprise",
    ],
    prerequis: ["Proximite d'un vehicule en charge", "Un emetteur radio adapte"],
    effet: "La session de charge s'interrompt ; la recharge devient indisponible.",
    remediations: [
      "Blindage et robustesse de la couche physique",
      "Detection de brouillage et reprise automatique",
      "Communication de secours",
    ],
    annexe5: "Famille 2 (disponibilite), ecosysteme de recharge.",
    outils: ["SDR (recherche), reference : Brokenwire 2022"],
    casReel:
      "Brokenwire (2022, Oxford / armasuisse) : arret de la charge CCS a plusieurs metres par simple brouillage sans fil.",
    blockedBy: [],
    verdictPass:
      "Attaque sur la couche physique radio : les contre-mesures du modele (SecOC, segmentation, durcissement logique) n'y changent rien. Il faut une parade cote resistance au brouillage.",
    verdictBlock: "",
  },
];
