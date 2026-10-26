import type { ReadingPage } from "../reading";

// Deutsche Uebersetzung der UDS-Seite. Spiegelt uds.ts (Abschnitts-ids,
// Reihenfolge und Blocktypen) vollstaendig wider.
export const udsDe: ReadingPage | null = {
  title: "UDS, die Diagnose, die Tueren oeffnet",
  lede:
    "Das genormte Protokoll, mit dem man zu den Steuergeraeten spricht: lesen, schreiben, zuruecksetzen, neu flashen. Fuer die Werkstatt entworfen, wird es zur Angriffsflaeche, sobald man es zweckentfremdet.",
  sections: [
    {
      id: "quoi",
      heading: "Ein Protokoll oberhalb des Bus",
      blocks: [
        {
          t: "p",
          text: "UDS (Unified Diagnostic Services, ISO 14229) ist ein Anfrage/Antwort-Protokoll zwischen einem Tester (dem Diagnosegeraet) und einem Steuergeraet. Es ersetzt CAN nicht: es laeuft darueber, transportiert durch ISO-TP (ISO 15765-2), wenn eine Anfrage acht Byte ueberschreitet, oder durch DoIP bei Fahrzeugen mit Ethernet.",
        },
        {
          t: "p",
          text: "Jede Anfrage beginnt mit einer ein Byte langen Service-Kennung (SID). Eine positive Antwort gibt diese SID um 0x40 erhoeht zurueck; eine negative Antwort gibt 0x7F zurueck, die urspruengliche SID und dann einen Fehlercode.",
        },
        {
          t: "frame",
          caption: "UDS-Anfrage und ihre positive Antwort (SID + 0x40)",
          lines: [
            { text: "Tester -> ECU : 10 03                 erweiterte Sitzung oeffnen" },
            { text: "ECU -> Tester : 50 03 00 32 01 F4       positiv (0x10 + 0x40 = 0x50)", mark: "ok" },
          ],
        },
      ],
    },
    {
      id: "services",
      heading: "Die Services, die zaehlen",
      blocks: [
        {
          t: "p",
          text: "Eine Handvoll Services deckt bereits den Kern der offensiven Diagnose ab.",
        },
        {
          t: "table",
          caption: "UDS-Referenzservices",
          head: ["SID", "Service", "Was er erlaubt"],
          rows: [
            ["0x10", "DiagnosticSessionControl", "Eine Sitzung oeffnen (Standard, erweitert, Programmierung) und sensible Services freischalten."],
            ["0x27", "SecurityAccess", "Eine geschuetzte Funktion ueber eine Challenge/Response (Seed/Key) entsperren."],
            ["0x22", "ReadDataByIdentifier", "Ein Datum per Kennung lesen: VIN, Softwarestaende, Sensoren."],
            ["0x2E", "WriteDataByIdentifier", "Ein Datum per Kennung schreiben, also einen Parameter des Steuergeraets aendern."],
            ["0x31", "RoutineControl", "Eine interne Routine starten: Loeschen, Tests, Kalibrierungen."],
            ["0x34 / 36 / 37", "Request/Transfer/Exit", "Die Reflash-Sequenz: ankuendigen, uebertragen, abschliessen."],
            ["0x11", "ECUReset", "Das Steuergeraet neu starten."],
            ["0x3E", "TesterPresent", "Die Sitzung offen halten (Keep-alive)."],
            ["0x28", "CommunicationControl", "Das Senden und Empfangen von Nachrichten unterbrechen oder wiederherstellen."],
            ["0x85", "ControlDTCSetting", "Das Erfassen der Fehlercodes aktivieren oder deaktivieren."],
          ],
        },
      ],
    },
    {
      id: "seedkey",
      heading: "SecurityAccess: die Seed/Key-Challenge",
      blocks: [
        {
          t: "p",
          text: "Der Service 0x27 schuetzt sensible Funktionen (Schreiben, Reflashen) durch eine Challenge-Response. Das Prinzip ist einfach; seine gesamte Robustheit beruht auf der Geheimhaltung des Algorithmus.",
        },
        {
          t: "ol",
          items: [
            "Der Tester fordert einen Seed an: Anfrage 0x27 mit einer ungeraden Unterfunktion (0x01, requestSeed).",
            "Das Steuergeraet gibt einen zufaelligen Seed zurueck, einige Byte.",
            "Der Tester berechnet den Key, indem er auf den Seed einen Algorithmus anwendet, den der Hersteller geheim haelt.",
            "Der Tester sendet den Key: Anfrage 0x27 mit der entsprechenden geraden Unterfunktion (0x02, sendKey).",
            "Stimmt der Key, entsperrt das Steuergeraet; sonst lehnt es ab und erzwingt nach mehreren Versuchen eine Wartezeit gegen Bruteforce.",
          ],
        },
        {
          t: "frame",
          caption: "Seed/Key-Austausch (Service 0x27)",
          lines: [
            { text: "Tester -> ECU : 27 01                 requestSeed" },
            { text: "ECU -> Tester : 67 01 A3 7F 2C 90       Seed (4 Byte)", mark: "ok" },
            { text: "Tester -> ECU : 27 02 11 22 33 44       sendKey (berechneter Key)" },
            { text: "ECU -> Tester : 67 02                 positiv, Zugriff gewaehrt", mark: "ok" },
          ],
        },
        {
          t: "p",
          text: "Der Algorithmus von Seed zu Key lebt in der Firmware des Steuergeraets. Ist er schwach (lineare Operationen, fester Key) oder durch einen Speicher-Dump extrahiert, spielt man ihn offline nach. Deshalb ist 0x27 das erste Ziel eines UDS-Audits und darum aendern ein starker Algorithmus und SecOC alles.",
        },
      ],
    },
    {
      id: "flash",
      heading: "Das Reflashen: 0x34 / 0x36 / 0x37",
      blocks: [
        {
          t: "p",
          text: "Ein Steuergeraet neu zu programmieren folgt einer genauen Sequenz, in der Programmiersitzung und nach einem erfolgreichen SecurityAccess.",
        },
        {
          t: "ol",
          items: [
            "0x34 RequestDownload: kuendigt Adresse, Groesse und Format der zu schreibenden Daten an.",
            "0x36 TransferData: sendet die Firmware in nummerierten Bloecken.",
            "0x37 RequestTransferExit: schliesst die Uebertragung ab; das Steuergeraet prueft und bestaetigt dann.",
          ],
        },
        {
          t: "p",
          text: "Ohne Authentizitaets- und Integritaetspruefung erlaubt diese Sequenz, eine veraenderte Firmware zu schreiben. Darum sind Secure Boot und die Signatur der Updates (Rahmenwerk R156) entscheidend.",
        },
      ],
    },
    {
      id: "aller",
      heading: "Die Verbindung zu den Angriffen",
      blocks: [
        {
          t: "p",
          text: "Die Angriffe der Diagnose-Schicht des Explorers beruhen alle auf diesen Services: eine Sitzung erzwingen, einen schwachen Seed bruteforcen, eine Datenkennung schreiben, eine Routine starten, ein Steuergeraet neu flashen.",
        },
      ],
    },
  ],
};
