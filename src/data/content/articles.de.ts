import type { Article } from "../articles";

// Deutsche Uebersetzung der Rubrik "Analysen". Spiegelt articles.ts (slugs,
// Reihenfolge, Abschnitts-ids und Blocktypen) vollstaendig wider.
// Konvention des Projekts: Text in ASCII translitteriert (ae/oe/ue/ss).
export const articlesDe: Article[] = [
  {
    slug: "karr-bluetooth",
    date: "2026-08-09",
    readMins: 5,
    vector: "rf",
    tags: ["Bluetooth", "Geteilter Schluessel", "Nachruest-Alarmanlage", "2026"],
    title: "KARR: ein einziger Bluetooth-Schluessel fuer 2,2 Millionen Autos",
    dek:
      "2026 zeigen Forscher der UC San Diego, dass eine im Autohaus verbaute Diebstahlwarnanlage denselben Bluetooth-Schluessel auf allen Geraeten verwendet. Mit diesem Schluessel oeffnet man das Auto, bringt die Alarmanlage zum Schweigen und blockiert den Start.",
    fiche: {
      cible:
        "Fahrzeuge mit einer im Autohaus verbauten KARR- / SWDS-Alarmanlage (Honda, Toyota, Mazda, Ford, Jeep...), rund 2,2 Millionen.",
      entree: "Die Bluetooth-Schnittstelle der nachgeruesteten Alarmanlage, nicht das Auto selbst.",
      methode:
        "Funkbefehle faelschen mithilfe eines fest einprogrammierten Authentifizierungsschluessels, der auf allen Geraeten identisch ist.",
      faille: "Ein einziger kryptografischer Schluessel, den die gesamte Flotte teilt: ihn einmal zu kennen reicht fuer alle.",
    },
    sections: [
      {
        id: "maillon",
        heading: "Das hinzugefuegte Glied",
        blocks: [
          {
            t: "p",
            text: "Die KARR-Alarmanlage wird nicht vom Hersteller eingebaut: Sie ist ein im Autohaus verbautes Zubehoer, oft an einem KARR- oder SWDS-Aufkleber an der Fahrerscheibe erkennbar. Gesteuert wird sie per Bluetooth ueber eine App. Genau die Art von Ergaenzung, deren Sicherheit niemand prueft.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Wo sie eingedrungen sind",
        blocks: [
          {
            t: "ol",
            items: [
              "Reverse Engineering des Bluetooth-Protokolls der Alarmanlage.",
              "Entdeckung eines fest einprogrammierten Authentifizierungsschluessels, der auf allen Geraeten gleich ist.",
              "Mit diesem Schluessel die von der Alarmanlage akzeptierten Befehle faelschen.",
              "Die Tueren entriegeln, die Alarmanlage ausschalten, hupen und den Start blockieren, wenn das Fahrzeug steht.",
            ],
          },
          {
            t: "note",
            text:
              "Arbeit der UC San Diego, vorgestellt auf der DEF CON am 9. August und bei USENIX Security am 12. August 2026. Ein Firmware-Patch wurde am 20. Juli 2026 ueber die KARR-App verteilt; der Anbieter erklaert, von keinem tatsaechlichen Missbrauch zu wissen.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "Was versagt hat, die Lehre",
        blocks: [
          {
            t: "p",
            text: "Einen einzigen Schluessel in alle Geraete einzuprogrammieren bedeutet, ein Geheimnis in einen einzigen Versagenspunkt zu verwandeln: ein einziges Auslesen kompromittiert die gesamte Flotte. Jedes Geraet haette seinen eigenen Schluessel haben muessen, an ein einziges Fahrzeug gekoppelt.",
          },
          {
            t: "p",
            text: "Die Moral reicht weiter: Ihr Schwachpunkt liegt nicht zwangslaeufig im Auto. Das nachgeruestete Zubehoer, das schuetzen soll, wird zum Einfallstor. Je mehr vernetzte Gegenstaende man rund um das Fahrzeug hinzufuegt, desto weiter dehnt sich die Angriffsflaeche ausserhalb des Autos aus.",
          },
        ],
      },
    ],
    sources: [
      { label: "Fox News: KARR-Bluetooth-Luecke gefaehrdet 2,2 Mio. Autos", url: "https://www.foxnews.com/tech/karr-bluetooth-flaw-exposes-2-2m-cars-theft-risk" },
      { label: "Popular Science: 2 Millionen Autos durch Bluetooth-Hack gefaehrdet", url: "https://www.popsci.com/technology/car-bluetooth-cybersecurity-hack/" },
      { label: "Malwarebytes: Millionen Autos koennten verfolgt und entriegelt werden", url: "https://www.malwarebytes.com/blog/bugs/2026/07/millions-of-cars-could-be-tracked-and-unlocked-by-a-hidden-security-flaw" },
    ],
  },

  {
    slug: "subaru-starlink",
    date: "2025-01-23",
    readMins: 6,
    vector: "api",
    tags: ["Geolokalisierung", "Admin-Panel", "Uebernahme", "Privatsphaere"],
    title: "Subaru STARLINK: ein Jahr Fahrten in einem Admin-Panel",
    dek:
      "Anfang 2025 dringen Sam Curry und Shubham Shah in das STARLINK-Administrationspanel von Subaru ein. Das Ergebnis: Live-Ortung, ein Jahr Verlauf und die Kontrolle ueber Fahrzeuge in den USA, in Kanada und in Japan.",
    fiche: {
      cible: "Vernetzte Subaru (STARLINK) in den USA, in Kanada und in Japan.",
      entree: "Eine per Scan gefundene Administrations-Subdomain, dann ein uebernommenes Mitarbeiterkonto.",
      methode:
        "Das Passwort eines Mitarbeiters (per LinkedIn gefundene E-Mail) zuruecksetzen und dabei zwei Sicherheitsfragen umgehen.",
      faille: "Ein zu offen zugaengliches und schlecht geschuetztes Admin-Panel: der Zugang eines Mitarbeiters gibt die Kontrolle ueber alles.",
    },
    sections: [
      {
        id: "porte",
        heading: "Die Tuer finden",
        blocks: [
          {
            t: "p",
            text: "Alles beginnt mit einem Durchsuchen der Subdomains. Die beiden Forscher stossen auf das interne Administrationsportal von STARLINK, das Werkzeug, mit dem die Mitarbeiter Konten und Fahrzeuge verwalten. Es haette niemals so leicht erreichbar sein duerfen.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Wo sie eingedrungen sind",
        blocks: [
          {
            t: "ol",
            items: [
              "Die E-Mail-Adresse eines Subaru-Mitarbeiters auf LinkedIn finden.",
              "Ein Zuruecksetzen des Passworts fuer sein Konto ausloesen.",
              "Die beiden geforderten Sicherheitsfragen umgehen.",
              "Vollen Administratorzugang zum Portal erlangen.",
              "Jedes beliebige Fahrzeug ueber seine VIN abfragen, die sich ihrerseits aus einem Kennzeichen ueber die Zulassungsdaten ermitteln laesst.",
            ],
          },
        ],
      },
      {
        id: "ampleur",
        heading: "Das Ausmass",
        blocks: [
          {
            t: "p",
            text: "Das Panel zeigt nicht nur Datensaetze an. Ueber die Oberflaeche koennen sie auf die Fahrzeuge einwirken und sensible Daten einsehen.",
          },
          {
            t: "ul",
            items: [
              "Jeden vernetzten Subaru starten, abstellen, ver- und entriegeln.",
              "Die Position in Echtzeit sehen.",
              "Ein Jahr Standortverlauf ihres Testfahrzeugs auslesen.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Was versagt hat, die Lehre",
        blocks: [
          {
            t: "p",
            text: "Zwei Probleme ueberlagern sich. Zuerst eine offen zugaengliche Administrationsoberflaeche und eine zu schwache Kontowiederherstellung: Reset per E-Mail plus umgehbare Fragen. Dann, und das ist das nachhaltigste, die Datenaufbewahrung: ein Jahr Fahrten jedes Fahrers, zugaenglich hinter einem einfachen Passwort.",
          },
          {
            t: "p",
            text: "Subaru hat schnell nachgebessert. Doch der Fall erinnert daran, dass das Auto gut geschuetzt sein kann, waehrend die Rueckseite der Kulisse, das Portal und seine Datenbank, es nicht ist.",
          },
        ],
      },
    ],
    sources: [
      { label: "Sam Curry: Subaru hacken", url: "https://samcurry.net/hacking-subaru" },
      { label: "Jalopnik: Hacker knacken die vernetzten Dienste von Subaru", url: "https://jalopnik.com/hackers-crack-subarus-connected-services-to-access-loca-1851746393" },
      { label: "Engadget: Subarus schwache Sicherheit machte Fahrzeugdaten zugaenglich", url: "https://www.engadget.com/cybersecurity/subarus-poor-security-left-troves-of-vehicle-data-easily-accessible-182514123.html" },
    ],
  },

  {
    slug: "pwn2own-automotive-2025",
    date: "2025-01-24",
    readMins: 5,
    vector: "charge",
    tags: ["Wettbewerb", "EV-Ladestationen", "Infotainment", "0-day"],
    title: "Pwn2Own Automotive 2025: 49 Luecken, und die Ladestationen fallen",
    dek:
      "In Tokio reihten im Januar 2025 mehrere Teams 49 bislang unbekannte Luecken aneinander, fuer 886 250 Dollar. Das ergiebigste Ziel: die Ladestationen.",
    fiche: {
      cible:
        "Ladestationen (Tesla Wall Connector, Autel, ChargePoint...), eingebettete Betriebssysteme und Autoradios.",
      entree: "Die Netzwerk- und USB-Angriffsflaechen von Geraeten fuer Endverbraucher und Halbprofis.",
      methode: "Exploit-Ketten (Ueberlaeufe, Vergleiche ohne untere Grenze...) bis hin zur Codeausfuehrung.",
      faille: "Ein breites und junges Oekosystem: viel exponierter Code, noch kaum gehaertet.",
    },
    sections: [
      {
        id: "principe",
        heading: "Das Prinzip von Pwn2Own",
        blocks: [
          {
            t: "p",
            text: "Pwn2Own ist ein von der Zero Day Initiative veranstalteter Wettbewerb. Die Teams kommen mit bislang unbekannten Luecken (0-days), die sie live an echter Hardware vorfuehren. Sie werden bezahlt, und im Gegenzug erhalten die Hersteller die Bugs, um sie zu beheben. Es ist eine jaehrliche Momentaufnahme vom Zustand der Autosicherheit.",
          },
        ],
      },
      {
        id: "tombe",
        heading: "Was gefallen ist",
        blocks: [
          {
            t: "p",
            text: "Die Ladestationen waren das ergiebigste Ziel dieser Ausgabe. Der Tesla Wall Connector ist die erste Hardware, die faellt, ueber einen Zahlenbereichsvergleich ohne untere Grenze, der es erlaubt, die Kontrolle darueber zu uebernehmen.",
          },
          {
            t: "ul",
            items: [
              "Mehr als 140 000 Dollar allein fuer die Luecken des Tesla Wall Connector.",
              "Zahlreiche kompromittierte Autoradios und Infotainment-Systeme.",
              "Das elektrische Laden etabliert sich als die am staerksten exponierte Angriffsflaeche.",
            ],
          },
        ],
      },
      {
        id: "gagnants",
        heading: "Wer gewonnen hat",
        blocks: [
          {
            t: "p",
            text: "Sina Kheirkhah von der Summoning Team wird mit 222 250 Dollar zum Master of Pwn gekroent. Synacktiv wird mit 147 500 Dollar Zweiter. Insgesamt: 49 bislang unbekannte Luecken und 886 250 Dollar ausgeschuettet. Bemerkenswert: Niemand versuchte in jenem Jahr, ein komplettes Tesla-Fahrzeug anzugreifen, obwohl die Veranstalter ein Auto als Preis vorgesehen hatten.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "Was das ueber die Branche sagt, die Lehre",
        blocks: [
          {
            t: "p",
            text: "Die Angriffsflaeche hat sich nach ausserhalb des Autos verlagert: Ladestationen, Apps, Cloud. Die Ladeinfrastruktur, jung und schnell ausgerollt, ist das neue weiche Ziel. Der Trend bestaetigt sich: Ein PCA-Bericht zaehlte im zweiten Quartal 2026 345 neue Schwachstellen im Automobilbereich, davon 161 als kritisch eingestuft.",
          },
        ],
      },
    ],
    sources: [
      { label: "Zero Day Initiative: Pwn2Own Automotive 2025, Endergebnisse", url: "https://www.thezdi.com/blog/2025/1/23/pwn2own-automotive-2025-day-three-and-final-results" },
      { label: "BleepingComputer: 886 250 Dollar fuer 49 0-days", url: "https://www.bleepingcomputer.com/news/security/hackers-get-886-250-for-49-zero-days-at-pwn2own-automotive-2025/" },
      { label: "SecurityWeek: Ladestationen, OS und Infotainment", url: "https://www.securityweek.com/hackers-earn-886000-at-pwn2own-automotive-2025-for-charger-os-infotainment-exploits/" },
    ],
  },

  {
    slug: "kia-portail-plaque",
    date: "2024-09-26",
    readMins: 5,
    vector: "api",
    tags: ["Fernuebernahme", "API", "Haendlerportal", "Kennzeichen"],
    title: "Kia: die Kontrolle ueber ein Auto mit einem Kennzeichen uebernehmen",
    dek:
      "2024 steuert das Team von Sam Curry Millionen Kia aus der Ferne, ausgehend von einem einfachen Kennzeichen, ueber das den Vertragshaendlern vorbehaltene Portal.",
    fiche: {
      cible: "Vernetzte Kia, gebaut nach 2013, mit oder ohne aktives Kia-Connect-Abonnement.",
      entree: "kiaconnect.kdealer.com, das Webportal der Vertragshaendler.",
      methode:
        "Ein Haendlerkonto anlegen, ein Token erzeugen, die internen APIs aufrufen, sich selbst als Eigentuemer hinzufuegen.",
      faille: "Eine fehlerhafte Zugriffskontrolle auf Serverseite: ein Haendlerkonto gibt die Kontrolle ueber jedes beliebige Fahrzeug.",
    },
    sections: [
      {
        id: "plaque",
        heading: "Von einem Kennzeichen zu einem Eigentuemer",
        blocks: [
          {
            t: "p",
            text: "Der Ausgangspunkt ist fuer alle zugaenglich: ein Kennzeichen. Es fuehrt zur VIN, dann, auf Serverseite, zu den Daten des Eigentuemers. Kein physischer Zugang zum Auto ist noetig.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Wo sie eingedrungen sind",
        blocks: [
          {
            t: "ol",
            items: [
              "Ein Konto auf dem Haendlerportal kiaconnect.kdealer.com registrieren und dabei dieselbe Registrierungsanfrage wie die Kunden wiederverwenden.",
              "Ein gueltiges Zugangstoken fuer die internen APIs der Vertragshaendler erzeugen.",
              "Die Daten des Eigentuemers abrufen: Name, Telefon, E-Mail, Adresse.",
              "Die E-Mail des Eigentuemers durch die eigene ersetzen und sich als Hauptberechtigten hinzufuegen.",
              "Befehle an das Fahrzeug senden.",
            ],
          },
        ],
      },
      {
        id: "capacites",
        heading: "Was sie tun konnten",
        blocks: [
          {
            t: "ul",
            items: [
              "Ver- und entriegeln, starten und abstellen, hupen, das Fahrzeug orten.",
              "Das alles in rund dreissig Sekunden.",
              "Ohne jede Benachrichtigung an den Eigentuemer, dass auf sein Auto zugegriffen oder seine Rechte geaendert wurden.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Was versagt hat, die Lehre",
        blocks: [
          {
            t: "p",
            text: "Das Auto wurde nicht gehackt: das schwache Glied ist der Webserver. Eine schlecht abgeschottete Zugriffskontrolle liess ein Haendlerkonto auf die Fahrzeuge jedes beliebigen Kunden einwirken. Das ist die perfekte Veranschaulichung der Verschiebung der Bedrohung: heute wird der Grossteil der Angriffe aus der Ferne gefuehrt, und ein grosser Teil laeuft ueber Telematik, Cloud oder APIs.",
          },
          {
            t: "p",
            text: "Die Luecken wurden vor der Veroeffentlichung behoben, das Demonstrationswerkzeug wurde nie verbreitet, und Kia gibt an, dass keine boeswillige Ausnutzung stattgefunden hat.",
          },
        ],
      },
    ],
    sources: [
      { label: "Sam Curry: Kia hacken", url: "https://samcurry.net/hacking-kia" },
      { label: "SecurityWeek: Millionen Kia-Autos anfaellig fuer Fernhacking", url: "https://www.securityweek.com/millions-of-kia-cars-were-vulnerable-to-remote-hacking-researchers/" },
      { label: "BleepingComputer: Luecke im Kia-Haendlerportal", url: "https://www.bleepingcomputer.com/news/security/kia-dealer-portal-flaw-could-let-attackers-hack-millions-of-cars/" },
    ],
  },

  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 6,
    vector: "hardware",
    tags: ["Hardware", "Fault Injection", "Vertrauenswurzel", "Jailbreak"],
    title: "Tesla: den Chip stolpern lassen, um die Vertrauenswurzel zu brechen",
    dek:
      "2023 stoeren Forscher der TU Berlin die Stromversorgung des AMD-Prozessors einer Tesla, um deren sicheren Start zu umgehen. Von dort lesen sie Geheimnisse aus und schalten kostenpflichtige Optionen frei.",
    fiche: {
      cible: "Neuere Tesla mit AMD-Ryzen-Infotainmentsystem.",
      entree: "Die MCU-Platine: ein physischer Zugang zur Stromversorgung des sicheren AMD-Prozessors.",
      methode: "Voltage Glitching: eine winzige Spannungsunterbrechung im richtigen Moment laesst eine Pruefung beim Start ausfallen.",
      faille: "Ein sicherer Start, der sich per Fault Injection umgehen laesst, in einem nicht korrigierbaren ROM.",
    },
    sections: [
      {
        id: "glitch",
        heading: "Was ist Voltage Glitching",
        blocks: [
          {
            t: "p",
            text: "Es ist ein Angriff durch Fault Injection. Indem man einen sehr kurzen Spannungsabfall genau in dem Moment ausloest, in dem der Prozessor eine sensible Anweisung ausfuehrt (etwa eine Signaturpruefung), laesst man ihn stolpern: die Anweisung wird uebersprungen oder falsch ausgefuehrt, und die Pruefung geht durch, obwohl sie haette scheitern muessen.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Wo sie eingedrungen sind",
        blocks: [
          {
            t: "ol",
            items: [
              "Physischer Zugang zur MCU-Platine des Fahrzeugs.",
              "Den sicheren AMD-Prozessor anvisieren, die Vertrauenswurzel des Systems.",
              "Die Pruefung des Bootloaders im ROM glitchen.",
              "Nicht signierten Code ausfuehren lassen.",
            ],
          },
        ],
      },
      {
        id: "butin",
        heading: "Was sie erbeuten",
        blocks: [
          {
            t: "ul",
            items: [
              "Ihre eigene Software ausfuehren: ein Jailbreak des Infotainments.",
              "Den an die Hardware gebundenen RSA-Schluessel auslesen, jenen, der das Auto gegenueber dem Tesla-Servicenetz authentifiziert.",
              "Per Software gesperrte Optionen freischalten: Sitzheizung, Beschleunigungs-Boost.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Warum es gravierend und schwer zu patchen ist",
        blocks: [
          {
            t: "p",
            text: "Die Luecke steckt im ROM des Prozessors: sie laesst sich nicht beheben, ohne den Chip zu tauschen. Der Glitch ist nicht dauerhaft, man muss ihn bei jedem Start wiederholen, und er erfordert physischen Zugang. Es ist also kein Massendiebstahl aus der Ferne, aber in einem Punkt ist es schlimmer: es bricht einen Vertrauensanker und erlaubt, die Identitaet eines Fahrzeugs zu klonen.",
          },
          {
            t: "note",
            text:
              "Arbeit von Forschern der TU Berlin (Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob...), vorgestellt 2023. Das Team legte 2024 mit einem aehnlichen Angriff auf den Autopilot-Rechner nach.",
          },
        ],
      },
    ],
    sources: [
      { label: "Hackaday: Tesla-Infotainmentsysteme jailbreaken", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "Dark Reading: Tesla-Jailbreak schaltet kostenpflichtige Funktionen frei", url: "https://www.darkreading.com/application-security/tesla-jailbreak-unlocks-theft-in-car-paid-features" },
      { label: "Hackster: nicht patchbarer Jailbreak zum Klonen von Teslas", url: "https://www.hackster.io/news/researchers-find-an-unpatchable-jailbreak-for-cloning-teslas-unlocking-paywalled-features-51753e53439c" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 6,
    vector: "can",
    tags: ["Diebstahl", "CAN-Bus", "Injektion", "Ohne Authentifizierung"],
    title: "Autodiebstahl ueber den Scheinwerfer: die CAN-Injektion",
    dek:
      "2023 verfolgen Ian Tabor und Ken Tindell den Diebstahl ihres RAV4 zurueck bis zu einem Scheinwerferkabel. Dahinter ein Angriff, der weder Schluessel noch OBD-Buchse braucht: direkt mit dem CAN-Bus sprechen.",
    fiche: {
      cible: "Toyota RAV4 und Dutzende Modelle (Lexus, Jeep, Nissan, VW...), die von denselben Geraeten angegriffen werden.",
      entree: "Der Kabelstrang des vorderen Scheinwerfers, erreichbar durch Aufhebeln der Stossstange.",
      methode:
        "Einen CAN-Frame einschleusen, der sich als der bestaetigte Schluessel ausgibt und vom Gateway bis zum Motorsteuergeraet weitergereicht wird.",
      faille: "Der CAN-Bus authentifiziert keine Nachricht: einem wohlgeformten Frame wird aufs Wort geglaubt.",
    },
    sections: [
      {
        id: "depart",
        heading: "Der Ausgangspunkt: ein herausgerissener Scheinwerfer",
        blocks: [
          {
            t: "p",
            text: "Der RAV4 von Ian Tabor wird beschaedigt und dann gestohlen. Vor dem Diebstahl speicherte das Auto Fehlercodes, die auf einen Kommunikationsverlust mit dem Scheinwerfersteuergeraet und dem CAN-Netz hindeuten. Zusammen mit Ken Tindell, dem technischen Leiter von Canis Automotive Labs, verfolgt er die Spur zurueck bis zum Kabelstrang des vorderen Scheinwerfers.",
          },
        ],
      },
      {
        id: "entree",
        heading: "Wo sie eingedrungen sind",
        blocks: [
          {
            t: "p",
            text: "Der Scheinwerfer teilt sich denselben CAN-Bus mit dem Steuergeraet des intelligenten Schluessels. Den Scheinwerferstecker zu erreichen heisst, den Bus zu erreichen. Von da an besteht das Szenario aus wenigen Handgriffen.",
          },
          {
            t: "ol",
            items: [
              "Die Stossstange oder den Scheinwerfer aufhebeln, um die Kabel freizulegen.",
              "Einen Injektor an CAN-H und CAN-L anschliessen.",
              "Einen gefaelschten Frame senden, der meldet, dass der Schluessel bestaetigt wurde.",
              "Das Gateway leitet die Nachricht an das Motornetz weiter, dem es aufs Wort glaubt.",
              "Der Motor springt an: das Auto faehrt in etwa einer Minute davon.",
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Was versagt hat",
        blocks: [
          {
            t: "p",
            text: "Der CAN-Bus hat keinerlei Nachrichtenauthentifizierung: jedem Knoten, der Bits auf den Draht legen kann, wird geglaubt. Ein wohlgeformter Frame gilt, selbst von einem Eindringling gesendet, als legitim. Das ist der Konstruktionsfehler, den das gesamte Vorgehen ausnutzt.",
          },
          {
            t: "note",
            text:
              "Der Injektor, versteckt in einem gefaelschten JBL-Lautsprecher, der an die Diebe verkauft wurde, enthielt nur rund zehn Dollar an Bauteilen. Der Fall des RAV4 wird unter der Kennung CVE-2023-29389 gefuehrt.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "Die Lehre und die Gegenmassnahme",
        blocks: [
          {
            t: "p",
            text: "Genau darauf zielt SecOC ab: jede Nachricht mit einem Code und einem Frischezaehler authentifizieren, damit ein gefaelschter Frame abgewiesen wird. Die Segmentierung hilft ebenfalls, indem sie verhindert, dass ein Knoten des vorderen Netzes das Motorsteuergeraet erreicht. Zwei Gegenmassnahmen, die anderswo auf dieser Website direkt veranschaulicht werden.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell: CAN-Injektion, schluesselloser Autodiebstahl", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "SecurityWeek: Diebe nutzen CAN-Injektions-Hack, um Autos zu stehlen", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive: Autos ueber die Scheinwerferverkabelung stehlen", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
    ],
  },
];
