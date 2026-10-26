import type { ReadingPage } from "../reading";

// Deutsche Uebersetzung der Atelier-Seite. Spiegelt atelier.ts (Abschnitts-ids,
// Reihenfolge und Blocktypen) vollstaendig wider.
export const atelierDe: ReadingPage | null = {
  title: "Den eigenen Pruefstand bauen und weiterkommen",
  lede:
    "Genug, um vom Lesen zur Praxis zu wechseln: ein virtueller CAN-Bus, die Befehle, die zaehlen, das Vokabular und wo es weitergeht.",
  sections: [
    {
      id: "banc",
      heading: "Ein CAN-Pruefstand ohne Auto",
      blocks: [
        {
          t: "p",
          text: "Es braucht kein Fahrzeug, um anzufangen. Linux bringt SocketCAN mit; eine virtuelle vcan-Schnittstelle verhaelt sich wie ein echter Bus, und der Simulator ICSim liefert ein Kombiinstrument zum Ansteuern.",
        },
        {
          t: "code",
          caption: "Einen virtuellen CAN-Bus erstellen (Linux, SocketCAN)",
          lines: [
            "sudo modprobe vcan",
            "sudo ip link add dev vcan0 type vcan",
            "sudo ip link set up vcan0",
          ],
        },
        {
          t: "code",
          caption: "Den Simulator ICSim starten",
          lines: [
            "./icsim vcan0        # das simulierte Kombiinstrument",
            "./controls vcan0     # die Fernbedienung, die den Verkehr erzeugt",
          ],
        },
        {
          t: "note",
          text: "Alles bleibt lokal und virtuell: kein Fahrzeug wird beruehrt, keine Trame verlaesst die Maschine.",
        },
      ],
    },
    {
      id: "reproduire",
      heading: "In echt nachbauen",
      blocks: [
        {
          t: "p",
          text: "Das Virtuelle reicht, um die Methode zu lernen; das Kupfer macht sie greifbar. Vier Aufbauten, vom einfachsten fuer fuenfzehn Euro bis zum eindruecklichsten fuer die Vorfuehrung, alle dokumentiert und reproduzierbar.",
        },
        {
          t: "table",
          caption: "Vom Spielzeugstand bis zum Kombiinstrument, das aufleuchtet",
          head: ["Aufbau", "Material", "Was man nachbaut"],
          rows: [
            [
              "Zwei-Knoten-Stand",
              "2 Arduino oder ESP32, 2 Transceiver (MCP2515 oder natives TWAI), 2 Widerstaende mit 120 Ohm",
              "Der Kern des Reversings: ein Knoten sendet, der andere hoert zu. Sniffer, Diff, Injektion.",
            ],
            [
              "ESP32-Bruecke",
              "1 ESP32 mit ESP32RET oder CANMIM",
              "Mitschnitt, Replay und Man-in-the-Middle an einem echten Bus, vom PC aus gesteuert (SavvyCAN).",
            ],
            [
              "Raspberry Pi + CAN-HAT",
              "1 Raspberry Pi, 1 CAN-Aufsatz (PiCAN, Waveshare)",
              "Dieselben candump / cansend wie in der Werkstatt, aber an einer physischen can0-Schnittstelle.",
            ],
            [
              "Echtes Kombiinstrument",
              "Ein Kombiinstrument vom Schrott, ein Netzteil, ein terminierter Bus",
              "Die Zeiger bewegen sich wirklich, wenn man die Frames faelscht. Die Vorfuehrung, die haengen bleibt.",
            ],
          ],
        },
        {
          t: "ul",
          items: [
            "Verdrahtung: CAN-H an CAN-H, CAN-L an CAN-L, und ein Widerstand von 120 Ohm an jedem Ende des Busses.",
            "Die klassische Falle: viele MCP2515-Module haben einen Quarz mit 8 MHz, nicht 16. Passt der Takt nicht, bleibt der Bus stumm.",
            "Datenrate: die meisten Beispiele laufen mit 250 oder 500 kbit/s, und beide Knoten muessen gleich eingestellt sein.",
          ],
        },
        {
          t: "p",
          text: "Die Bruecke zu dieser Seite: ein Raspberry Pi mit CAN-HAT stellt eine echte SocketCAN-Schnittstelle bereit. Alle oben gezeigten Befehle funktionieren unveraendert, und ICSim laeuft darauf ohne Anpassung.",
        },
        {
          t: "code",
          caption: "ICSim vom virtuellen Bus auf eine echte CAN-Schnittstelle bringen",
          lines: [
            "sudo ip link set can0 type can bitrate 500000",
            "sudo ip link set up can0",
            "./icsim can0        # dasselbe Kombiinstrument, am physischen Bus",
            "./controls can0",
          ],
        },
        {
          t: "links",
          items: [
            {
              label: "Zwei-Knoten-Stand Schritt fuer Schritt (SparkFun CAN Bus Shield)",
              url: "https://www.instructables.com/Sparkfun-CAN-Bus-Shield-Tutorial",
              note: "Zwei Arduino, Verdrahtung und Terminierung erklaert.",
            },
            {
              label: "ESP32RET",
              url: "https://github.com/aszu80/ESP32RET",
              note: "Einen ESP32 zum Mitschnitt- und Replay-Werkzeug machen, kompatibel mit SavvyCAN.",
            },
            {
              label: "CANMIM",
              url: "https://github.com/zeroomega/canmim",
              note: "Man-in-the-Middle am CAN mit ESP32: lesen, filtern, injizieren, erneut senden.",
            },
            {
              label: "Pro-CHASER (Forschungs-Testbed)",
              url: "https://researcher.manipal.edu/en/publications/pro-chaser-a-prototype-testbed-for-car-hacking-attack-simulation-/",
              note: "Ein Stand aus Raspberry Pi + CAN-HAT, in einer Publikation beschrieben.",
            },
          ],
        },
      ],
    },
    {
      id: "antiseche",
      heading: "can-utils-Spickzettel",
      blocks: [
        {
          t: "table",
          caption: "Die taeglichen Befehle",
          head: ["Befehl", "Was er tut"],
          rows: [
            ["candump vcan0", "Alle Trames des Bus live anzeigen."],
            ["candump -l vcan0", "In eine Datei aufzeichnen (candump-*.log) zum Nachspielen."],
            ["canplayer -I fichier.log", "Eine Aufzeichnung unveraendert nachspielen."],
            ["cansend vcan0 123#DEADBEEF", "Eine Trame senden: Kennung 0x123, Daten DE AD BE EF."],
            ["cangen vcan0 -I i -L 8 -D r", "Zufaellige Trames erzeugen: Last und Fuzzing."],
            ["cansniffer vcan0", "Nach Kennung gruppierte Ansicht, wechselnde Byte hervorgehoben."],
            ["cansend vcan0 000#0000000000000000", "Die Kennung 0 hammern: Veranschaulichung einer Dienstverweigerung."],
          ],
        },
      ],
    },
    {
      id: "glossaire",
      heading: "Glossar",
      blocks: [
        {
          t: "deflist",
          items: [
            { term: "ECU / Steuergeraet", def: "Einer der Rechner des Fahrzeugs: Motor, Bremse, Innenraum usw." },
            { term: "Trame (Frame)", def: "Dateneinheit, die ueber den Bus uebertragen wird: eine Kennung und bis zu acht Byte." },
            { term: "Kennung (CAN ID)", def: "Feld, das den Inhalt einer Trame beschreibt und ihre Arbitrierungsprioritaet festlegt." },
            { term: "ISO-TP", def: "Transportschicht (ISO 15765-2), die Nachrichten von mehr als acht Byte segmentiert." },
            { term: "UDS", def: "Genormte Diagnoseservices (ISO 14229), oberhalb des Bus." },
            { term: "DoIP", def: "Diagnose ueber IP (ISO 13400): die Diagnose, getragen von Ethernet." },
            { term: "SecOC", def: "Secure Onboard Communication: authentifiziert die Nachrichten (MAC und Frischezaehler)." },
            { term: "DTC", def: "Diagnostic Trouble Code: ein von einem Steuergeraet gespeicherter Fehlercode." },
            { term: "PID (OBD)", def: "Parameter ID: Kennung eines standardisierten Datums, lesbar ueber die OBD-II-Buchse." },
            { term: "CAN-FD", def: "Weiterentwicklung von CAN: hoehere Datenrate und bis zu 64 Byte Daten pro Trame." },
            { term: "Bus-off", def: "Zustand, in dem sich ein Knoten nach zu vielen Fehlern selbst abschaltet." },
          ],
        },
      ],
    },
    {
      id: "ressources",
      heading: "Um weiterzukommen",
      blocks: [
        {
          t: "links",
          items: [
            { label: "The Car Hacker's Handbook (OpenGarages)", url: "https://www.opengarages.org/handbook/", note: "Die freie und kostenlose Einstiegsreferenz." },
            { label: "can-utils (SocketCAN-Repository)", url: "https://github.com/linux-can/can-utils", note: "Die Kommandozeilenwerkzeuge." },
            { label: "ICSim, Kombiinstrument-Simulator", url: "https://github.com/zombieCraig/ICSim", note: "Um das Nachspielen ohne Auto zu ueben." },
            { label: "UNECE WP.29 (R155 / R156)", url: "https://unece.org/transport/vehicle-regulations-wp29", note: "Der regulatorische Cybersicherheitsrahmen des Fahrzeugs." },
            { label: "ISO/SAE 21434", url: "https://www.iso.org/standard/70918.html", note: "Das Engineering der Automobil-Cybersicherheit." },
          ],
        },
        {
          t: "note",
          text: "Die Links oeffnen sich in einem neuen Tab. Diese Website setzt keinen Tracker.",
        },
      ],
    },
  ],
};
