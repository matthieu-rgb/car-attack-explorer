import type { Article } from "../articles";

// Deutsche Uebersetzung der Rubrik "Analysen". Spiegelt articles.ts (slugs,
// Reihenfolge, Abschnitts-ids und Blocktypen) vollstaendig wider.
// Konvention des Projekts: Text in ASCII translitteriert (ae/oe/ue/ss).
export const articlesDe: Article[] = [
  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 11,
    vector: "hardware",
    tags: ["Fault Injection", "Secure Boot", "Vertrauenswurzel", "AMD", "Jailbreak"],
    title: "Tesla: ein Spannungsglitch, der die Vertrauenswurzel bricht",
    dek:
      "2023 bringen vier Forscher der TU Berlin den sicheren AMD-Prozessor eines Tesla zum Stolpern, indem sie seine Stromversorgung stoeren. Am Ende: beliebiger Code auf der Vertrauenswurzel, die Extraktion eines Identitaetsschluessels und ein Jailbreak, den Software nicht beheben kann.",
    fiche: {
      cible: "Tesla mit AMD-Ryzen-Infotainment (die MCU-Platine, genannt MCU-Z), in aktuellen Model 3, Y, S und X.",
      entree: "Ein physischer Zugang zur MCU-Platine, genau zur Stromschiene des sicheren AMD-Prozessors (ASP).",
      methode:
        "Voltage Glitching: ein winziger Spannungseinbruch, getimt auf den Moment, in dem der Code im ROM die Signatur der Firmware prueft, laesst diese Pruefung ausfallen.",
      faille: "Eine Vertrauenswurzel in maskiertem ROM, ohne Schutz gegen Fault Injection: im Feld gibt es nichts zu patchen.",
    },
    sections: [
      {
        id: "contexte",
        heading: "Die Vertrauenswurzel eines Tesla",
        blocks: [
          {
            t: "p",
            text: "Das Infotainment eines aktuellen Tesla laeuft auf einem AMD-Ryzen-x86-Prozessor. Sein gesamter Start wird von einem eigenen Baustein verriegelt, dem sicheren AMD-Prozessor (ASP, auch PSP genannt): er prueft beim Einschalten die Signatur jeder Softwarestufe, bevor er sie startet. Diese Kette ist die Vertrauenswurzel des Systems. Sie huetet drei Dinge: die Freischaltung kostenpflichtiger Optionen, den Schluessel, der die Identitaet des Autos gegenueber dem Tesla-Servicenetz beweist, und die Verschluesselung der Nutzerdaten.",
          },
          {
            t: "p",
            text: "Dieses Glied zu brechen heisst, alles auf einmal zu bekommen. Genau das hat ein Team der TU Berlin getan, vorgestellt auf der Black Hat USA 2023 und dann auf dem 37C3.",
          },
          {
            t: "note",
            text:
              "Arbeit von Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob und Oleg Drokin (TU Berlin). Hans Niklas Jacob ist auch Mitautor des frueheren AMD-Glitches, auf dem der Angriff aufbaut.",
          },
        ],
      },
      {
        id: "glitch",
        heading: "Voltage Glitching, erklaert",
        blocks: [
          {
            t: "p",
            text: "Ein Prozessor setzt eine stabile Stromversorgung voraus. Laesst man sie ganz kurz einbrechen, fuer einige Dutzend Nanosekunden, genau in dem Moment, in dem er eine sensible Instruktion ausfuehrt, so stolpert er: die Instruktion wird uebersprungen oder falsch ausgefuehrt. Genau auf den Vergleich angewandt, der eine Signatur validiert, verwandelt dieser Fehler ein Scheitern in einen Erfolg. Nicht signierter Code geht durch, als waere er legitim.",
          },
          {
            t: "p",
            text: "Die ganze Schwierigkeit liegt im Timing. Man muss das Fenster weniger Augenblicke finden, in dem die Pruefung stattfindet, den Einbruch in diesem Moment ausloesen und so lange wiederholen, bis es passt. Das dauert, bis es eingestellt ist, aber sobald das Fenster bekannt ist, ist der Angriff reproduzierbar.",
          },
          {
            t: "note",
            text:
              "Der Glitch ist nicht persistent: er muss bei jedem Start erneut gespielt werden, um die Pruefung zu ueberwinden. Was danach im System abgelegt wird, kann dagegen dauerhaft gemacht werden.",
          },
        ],
      },
      {
        id: "chaine",
        heading: "Die Exploit-Kette, Schritt fuer Schritt",
        blocks: [
          {
            t: "ol",
            items: [
              "Die MCU-Platine ausbauen und die Schiene finden, die den Kern des sicheren AMD-Prozessors versorgt (gesteuert von einem programmierbaren Spannungsregler).",
              "Eine kleine Glitch-Schaltung auf diese Schiene setzen, die auf Befehl einen sehr kurzen Spannungseinbruch ausloesen kann.",
              "Den bereits bekannten und dokumentierten AMD-Glitch wiederverwenden, der die Signaturpruefung des Startcodes im ROM angreift.",
              "Den Einbruch genau in dem Moment ausloesen, in dem das ROM die naechste Stufe prueft, und wiederholen, bis die Pruefung umgangen ist.",
              "Nicht signierten Code auf dem sicheren Prozessor ausfuehren lassen: die Vertrauenswurzel ist nun unter Kontrolle.",
              "Von dort die Firmware entschluesseln, das Linux-System fuer einen persistenten Root-Zugang patchen und den hardwaregebundenen RSA-Schluessel extrahieren.",
            ],
          },
          {
            t: "frame",
            caption: "Die Startkette und der Injektionspunkt (didaktisches Schema).",
            lines: [
              { text: "Maskiertes ROM (ASP)  --prueft die Signatur-->  PSP-Bootloader", mark: "ok" },
              { text: "         ^ Glitch hier: die Pruefung wird uebersprungen", mark: "hl" },
              { text: "PSP-Bootloader  -->  ABL  -->  UEFI  -->  Linux-Kernel", mark: "ok" },
              { text: "nicht signierter Code akzeptiert: Vertrauenswurzel kompromittiert", mark: "hl" },
            ],
          },
        ],
      },
      {
        id: "butin",
        heading: "Was der Glitch freischaltet",
        blocks: [
          {
            t: "table",
            caption: "Ein einziger Fehler oeffnet vier Tueren.",
            head: ["Erlangte Faehigkeit", "Was es konkret bringt"],
            rows: [
              ["Persistenter Jailbreak", "Ein Root-Zugang auf dem Linux des Infotainments, der Neustarts und Updates ueberlebt."],
              ["Extraktion des Attestierungsschluessels", "Der hardwaregebundene RSA-Schluessel, der das Auto gegenueber dem Tesla-Netz authentifiziert: genug, um die Identitaet eines Fahrzeugs zu migrieren oder sogar zu klonen."],
              ["Kostenpflichtige Optionen", "Sitzheizung, Beschleunigungs-Boost und je nach Region weitere per Software gesperrte Funktionen, ohne Bezahlung freigeschaltet."],
              ["Nutzerdaten", "Die Entschluesselung der vom System gespeicherten und verschluesselten persoenlichen Daten."],
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "Das Werkzeug",
        blocks: [
          {
            t: "deflist",
            items: [
              { term: "Glitch-Schaltung (etwa 100 $)", def: "Eine kleine Platine, die den Spannungseinbruch auf Befehl ausloest. Das ist der Kern des Angriffs, und sie kostet fast nichts." },
              { term: "Oszilloskop / Logikanalysator", def: "Um den Start zu beobachten und das Zeitfenster zu finden, in dem die Pruefung stattfindet." },
              { term: "Loetkolben und physischer Zugang", def: "Man muss die MCU-Platine oeffnen und sich an die richtige Stromschiene anschliessen." },
              { term: "Vorarbeiten", def: "Der AMD-Glitch aus 'One Glitch to Rule Them All' (2021), dann die Fortsetzung des Teams 2024, 'Three Glitches to Rule One Car', am Fahrassistenzrechner." },
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Was versagt hat",
        blocks: [
          {
            t: "ul",
            items: [
              "Die Vertrauenswurzel setzt voraus, dass das ROM seine Pruefung immer anwendet. Fault Injection bricht diese Annahme: man greift nicht die Kryptografie an, man hindert den Prozessor daran, sie zu pruefen.",
              "Der Startcode liegt in einem maskierten ROM, in Silizium gegossen: er ist nicht per Update korrigierbar.",
              "Der Chip erkennt keine Anomalien der Stromversorgung (kein Glitch-Detektor, keine Doppelpruefung): ein einziger Fehler genuegt.",
            ],
          },
        ],
      },
      {
        id: "portee",
        heading: "Reichweite und Grenzen",
        blocks: [
          {
            t: "p",
            text: "Es ist kein Massendiebstahl aus der Ferne: man braucht physischen Zugang, Hardware und Einstellzeit pro Exemplar. Aber in einem Punkt ist es schlimmer als ein Diebstahl: der Angriff bricht einen hardwarebasierten Vertrauensanker und erlaubt, die Identitaet eines Fahrzeugs zu klonen. Und da die Schwachstelle im Silizium liegt, laesst sie sich nicht per Software beheben; die einzige echte Abwehr ist ein gegen Fault Injection resistenter Chip. Da AMD andere Hersteller beliefert, reicht die Problemklasse ueber Tesla hinaus.",
          },
          {
            t: "note",
            text:
              "2024 legte dasselbe Team mit 'Three Glitches to Rule One Car' nach und uebertrug den Ansatz auf den Fahrassistenzrechner.",
          },
        ],
      },
    ],
    sources: [
      { label: "Christian Werling (TU Berlin): Forschungsseite und Publikationen", url: "https://www.user.tu-berlin.de/cwerling/" },
      { label: "Mayhem Security: Jailbreaking Teslas at Black Hat USA 2023", url: "https://www.mayhem.security/blog/jailbreaking-teslas-at-black-hat-usa-2023" },
      { label: "Hackaday: jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "One Glitch to Rule Them All: Fault Injection gegen den AMD-ASP (arXiv)", url: "https://arxiv.org/abs/2108.04575" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 11,
    vector: "can",
    tags: ["CAN-Bus", "Frame-Injektion", "Diebstahl ohne Schluessel", "Gateway", "SecOC"],
    title: "Diebstahl ueber den Scheinwerfer: die Anatomie einer CAN-Injektion",
    dek:
      "2023 verfolgen Ian Tabor und Ken Tindell den Diebstahl ihres RAV4 zurueck bis zu einem Scheinwerferkabel. Dahinter ein Angriff, der weder Schluessel noch OBD-Buchse braucht: den CAN-Bus zwingen, einem gefaelschten Frame zu glauben. Wir zerlegen den Mechanismus, das Werkzeug und die Abwehr.",
    fiche: {
      cible: "Toyota RAV4 und Dutzende Modelle (Lexus, Jeep, Nissan, VW, Maserati...), die von denselben Boxen ins Visier genommen werden.",
      entree: "Der vordere Scheinwerferstrang, ein Punkt des CAN-Steuerbus, erreichbar durch Aufhebeln der Stossstange.",
      methode:
        "Eine Box injiziert in Schleife einen Frame, der den Empfaenger des Funkschluessels vortaeuscht, vom Gateway ohne Kontrolle bis zum Motorsteuergeraet weitergereicht.",
      faille: "Der CAN authentifiziert keine Nachricht, und das Gateway reicht zwischen Domaenen ohne Pruefung weiter: ein wohlgeformter Frame wird beim Wort genommen.",
    },
    sections: [
      {
        id: "contexte",
        heading: "Der Diebstahl, der alles dokumentiert hat",
        blocks: [
          {
            t: "p",
            text: "Der RAV4 von Ian Tabor wird zuerst beschaedigt (Stossstange abgerissen, Scheinwerferstecker abgezogen), dann einige Tage spaeter gestohlen. Vor dem Diebstahl hat das Auto Fehlercodes gespeichert, die einen Kommunikationsverlust mit dem Scheinwerfersteuergeraet und dem CAN-Netz melden. Zusammen mit Ken Tindell, Technikchef von Canis Automotive Labs, verfolgt Tabor die Spur zurueck bis zum vorderen Scheinwerferstrang und deckt eine Methode auf, die zu einer kleinen Industrie geworden ist.",
          },
          {
            t: "note",
            text:
              "Der Injektor wurde schluesselfertig an Diebe verkauft, versteckt in einem gefaelschten Bluetooth-Lautsprecher: ein Dutzend Dollar an Bauteilen, um ein Auto in einer Minute zu stehlen.",
          },
        ],
      },
      {
        id: "architecture",
        heading: "Das Ziel: ein geschwaetziger Bus, null Authentifizierung",
        blocks: [
          {
            t: "p",
            text: "Ein Auto hat nicht einen einzigen CAN-Bus, sondern mehrere, verbunden ueber ein zentrales Gateway. Auf dem Steuerbus laufen die Nachrichten des Empfaengers des Funkschluessels. Der vordere Scheinwerfer haengt an genau diesem Bus: seinen Stecker zu erreichen heisst, den Bus zu erreichen, der die Starterlaubnis traegt. Das Grundproblem: auf einem CAN ist keine Nachricht signiert, und das Gateway kopiert bestimmte Frames von einem Bus zum anderen, ohne sie zu pruefen.",
          },
          {
            t: "duo",
            aTitle: "Was das Netz voraussetzt",
            a: [
              "Nur Original-Steuergeraete sprechen auf dem Bus.",
              "Ein wohlgeformter Frame stammt zwangslaeufig von einem legitimen Knoten.",
              "Das Gateway reicht das Nuetzliche zwischen Domaenen weiter.",
            ],
            bTitle: "Was der Angreifer ausnutzt",
            b: [
              "Jeder Knoten am Draht kann senden.",
              "Nichts unterscheidet einen gefaelschten Frame von einem echten.",
              "Das Gateway reicht also auch den gefaelschten Frame weiter.",
            ],
          },
        ],
      },
      {
        id: "injection",
        heading: "Die CAN-Injektion, das eigentliche Kunststueck",
        blocks: [
          {
            t: "p",
            text: "Der feine Punkt: das echte Schluesselsteuergeraet sendet weiter seine legitime Nachricht ('kein Schluessel vorhanden'). Es genuegt also nicht, einen Frame hinzuzufuegen, man muss seinen eigenen durchsetzen. Der CAN entscheidet Bit fuer Bit: ein dominantes Bit (0) ueberschreibt ein rezessives Bit (1), und die niedrigste Kennung gewinnt. Die Box nutzt diesen Mechanismus und fuegt eine Schaltung hinzu, die das Verhalten des Transceivers erzwingt, um ihre Bits zu setzen und den legitimen Knoten in den Fehler zu treiben. Ergebnis: es ist der gefaelschte Frame, den Gateway und Motor sehen.",
          },
          {
            t: "note",
            text:
              "Das unterscheidet die CAN-Injektion von einem einfachen Replay: der Angreifer gewinnt die Arbitrierung und neutralisiert die echte Quelle, statt nur Rauschen obendrauf zu legen.",
          },
        ],
      },
      {
        id: "chaine",
        heading: "Die Exploit-Kette, Schritt fuer Schritt",
        blocks: [
          {
            t: "ol",
            items: [
              "Die Stossstange oder den Scheinwerfer aufhebeln, um die Kabel des Strangs freizulegen.",
              "Sich an die beiden Busdraehte anschliessen, CAN-H und CAN-L.",
              "Auf einen Weckframe des Netzes warten, Zeichen, dass der Bus lauscht.",
              "Eine Salve senden (etwa zwanzig Mal pro Sekunde), die den Schluesselempfaenger vortaeuscht: die Nachricht 'Schluessel validiert'.",
              "Die Wegfahrsperre deaktiviert sich, weil sie den Schluessel fuer anwesend haelt.",
              "Das Gateway reicht den Frame an das Motornetz weiter, ohne ihn zu pruefen.",
              "Eine zweite Nachricht befiehlt dem Karosseriesteuergeraet, die Tueren zu entriegeln.",
              "Der Dieb steigt ein und startet: das Auto faehrt in etwa einer Minute los, ohne den Schluessel.",
            ],
          },
          {
            t: "frame",
            caption: "Didaktische Illustration: die gefaelschte Salve (hl) inmitten des normalen Verkehrs. Fiktive Kennungen.",
            lines: [
              { text: "0x120  Motor          Drehzahl 820 tr/min      normaler Frame", mark: "ok" },
              { text: "0x043  Schluesselempf. 'kein Schluessel da'    normaler Frame", mark: "ok" },
              { text: "0x043  INJIZIERT      'Schluessel validiert'  x20 / s  Salve", mark: "hl" },
              { text: "Gateway  reicht 0x043 ans Motornetz weiter, ohne Kontrolle", mark: "hl" },
              { text: "Wegfahrsperre deaktiviert, Motor darf starten", mark: "ok" },
            ],
          },
        ],
      },
      {
        id: "banc",
        heading: "Wie man es beobachtet und am Pruefstand erneut abspielt",
        blocks: [
          {
            t: "p",
            text: "Man braucht kein echtes Auto, um die Methode zu verstehen. Auf einem virtuellen Bus oder einem Pruefstand mit zwei Steuergeraeten ist das Vorgehen immer dasselbe: eine Aktion ausloesen, den Frame beobachten, der sich aendert, und ihn dann erneut abspielen. Genau das bietet die Werkstatt dieser Seite. Die folgenden Befehle arbeiten auf einer Testschnittstelle (vcan0), nie an einem Fahrzeug.",
          },
          {
            t: "code",
            caption: "Beobachten, isolieren, erneut abspielen (am Pruefstand).",
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
        heading: "Das Werkzeug, auf beiden Seiten",
        blocks: [
          {
            t: "table",
            caption: "Die Box des Diebs kostet rund ein Dutzend Dollar; die Analyse laeuft mit oeffentlichen Werkzeugen.",
            head: ["Element", "Lager", "Wozu es dient"],
            rows: [
              ["Mikrocontroller PIC18F mit CAN", "Dieb", "Erzeugt und taktet die gefaelschten Frames; gesperrte Firmware."],
              ["CAN-Transceiver + Override-Schaltung", "Dieb", "Setzt die Bits auf den Draht und erzwingt die Arbitrierung gegen den legitimen Knoten."],
              ["Gefaelschter Bluetooth-Lautsprecher", "Dieb", "Gehaeuse und Batterie: tarnt den Injektor und versorgt ihn."],
              ["CAN-Schnittstelle (CANable, CANtact...)", "Analyst", "Einen PC an den Bus anschliessen, um zu lesen und zu senden."],
              ["can-utils (candump, cansniffer, cansend)", "Analyst", "Frames aufzeichnen, filtern und erneut abspielen."],
              ["SavvyCAN", "Analyst", "Aufzeichnungen visualisieren und vergleichen, das nuetzliche Signal finden."],
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "Was versagt hat",
        blocks: [
          {
            t: "ul",
            items: [
              "Der CAN authentifiziert keine Nachricht: ein Knoten, der Bits setzen kann, wird beim Wort genommen.",
              "Das Gateway kopiert Frames zwischen Domaenen, ohne ihre Herkunft zu pruefen.",
              "Die Wegfahrsperre gruendet eine Sicherheitsentscheidung auf eine blosse Behauptung des Bus.",
              "Ein unkritisches Peripheriegeraet (der Scheinwerfer) gibt Zugang zu einem kritischen Bus.",
            ],
          },
        ],
      },
      {
        id: "parade",
        heading: "Die Abwehr, und wo man sie hier testet",
        blocks: [
          {
            t: "p",
            text: "Die grundlegende Antwort ist die Authentifizierung der Nachrichten. Das ist der Zweck von SecOC: jeder Frame traegt einen Authentifizierungscode und einen Frischezaehler, sodass ein gefaelschter oder erneut abgespielter Frame abgewiesen wird. Canis Labs treibt dieselbe Idee mit CryptoCAN voran. Die Segmentierung hilft ergaenzend, indem sie verhindert, dass ein Knoten des vorderen Netzes direkt mit dem Motorsteuergeraet spricht. Schliesslich kann eine Angriffserkennung die fuer die Injektion typischen Busfehler aufspueren.",
          },
          {
            t: "p",
            text: "Diese beiden Abwehrmassnahmen, SecOC und Segmentierung, sind Schalter, die Sie im Explorer aktivieren koennen, um den Angriffspfad blockiert zu sehen. Und die Methode ausloesen, beobachten, erneut abspielen laesst sich in der Werkstatt am virtuellen Bus ausprobieren.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell: CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "SecurityWeek: thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive: stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
      { label: "NVD: CVE-2023-29389", url: "https://nvd.nist.gov/vuln/detail/CVE-2023-29389" },
    ],
  },
];
