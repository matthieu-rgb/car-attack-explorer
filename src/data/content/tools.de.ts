import type { ToolsOverride } from "../tools";

// Traduction allemande du catalogue d'outils. Repli sur le francais tant que
// vide. Les ids de groupe et d'outil suivent tools.ts.
export const toolsText: ToolsOverride = {
  sniff: {
    titre: "CAN mitlesen und einschleusen",
    intro: "Verkehr auf einem Bus mitlesen, wiedereinspielen und fälschen, auf Softwareseite.",
    tools: {
      candump:
        "Erfasst und zeigt in Echtzeit alle Frames einer SocketCAN-Schnittstelle an. Der Ausgangspunkt jeder Aufklärung.",
      cansend:
        "Fälscht und schleust einen gezielten Frame ein oder erzeugt einen Strom von Frames, um den Bus zu überlasten oder ein Steuergerät zu fuzzen.",
      canplayer:
        "Spielt eine Frame-Aufzeichnung identisch wieder ein, samt Zeitstempeln. Das klassische Werkzeug für den Replay-Angriff.",
      cansniffer:
        "Gruppiert Frames nach Kennung und hebt die Byte hervor, die sich ändern. Ideal, um ein einzelnes Signal zu isolieren.",
      savvycan:
        "Plattformübergreifende grafische Oberfläche zum Erfassen, Wiedereinspielen und Reverse Engineering von CAN- und CAN-FD-Frames.",
      wireshark:
        "Netzwerkanalysator mit SocketCAN- und ISO-TP-Dissektoren, um eine Aufzeichnung Frame für Frame zu zerlegen.",
      pythoncan:
        "Python-Bibliothek, die die meisten CAN-Schnittstellen ansteuert: Erfassung, Einschleusen und Automatisierung per Skript.",
    },
  },
  diag: {
    titre: "Diagnose und UDS",
    intro: "Mit den Steuergeräten über die genormten Diagnosedienste kommunizieren.",
    tools: {
      caringcaribou:
        "Das „nmap des CAN“: Entdeckung von UDS-Diensten, Scan von Kennungen, Fuzzing und Brute-Force von Sitzungen.",
      udsoncan:
        "Python-Implementierung von UDS (ISO 14229), um Sitzungen, das Lesen und Schreiben von Daten sowie Routinen zu skripten.",
      doipclient:
        "DoIP-Client (Diagnose über IP/Ethernet), um die Steuergeräte neuerer Fahrzeuge zu erreichen.",
      scapy:
        "Fälscht und zerlegt CAN, ISO-TP, UDS, DoIP und GMLAN aus Python heraus, für maßgeschneiderte Szenarien.",
      j2534:
        "Genormte Schnittstelle der Herstellerwerkzeuge, häufig zum Flashen und zur Diagnose zweckentfremdet.",
    },
  },
  iface: {
    titre: "CAN-Hardwareschnittstellen",
    intro: "Die physische Brücke zwischen dem PC und dem Adernpaar CAN-H / CAN-L.",
    tools: {
      canable:
        "Quelloffene USB-CAN-Adapter, von SocketCAN nativ erkannt. Die Einstiegsklasse im Labor.",
      pcan:
        "Weit verbreitete professionelle CAN-Schnittstelle, stabile Treiber und breite Werkzeugunterstützung.",
      kvaser:
        "Robuste CAN/CAN-FD-Schnittstelle mit umfassender API, gängig in der Embedded-Entwicklung.",
      macchina:
        "Einbaufähige Hardware, direkt an der OBD-II-Buchse angeschlossen, für den Feldeinsatz programmierbar.",
      pihat:
        "Kostengünstige eingebettete Plattform, um einen eigenständigen CAN-Prüfstand aufzubauen und in Python zu skripten.",
    },
  },
  radio: {
    titre: "Funk und Drahtlos",
    intro: "Für die RF-Zugänge: Schlüssel, schlüsselloser Zugang, Mobilfunk, GNSS.",
    tools: {
      hackrf:
        "Breitband-SDR von 1 MHz bis 6 GHz, Senden und Empfangen. Erfassung und Wiedereinspielen von Schlüsselsignalen.",
      rtlsdr:
        "Sehr günstiger SDR-Empfänger, nur zum Empfangen, um die genutzten Bänder zu beobachten und zu identifizieren.",
      yardstick:
        "Sub-GHz-Sendeempfänger (300-900 MHz), zugeschnitten auf Fernbedienungen und RF-Schlüssel.",
      gnuradio:
        "Werkbank zur Signalverarbeitung, um maßgeschneiderte Sende- und Empfangsketten zusammenzusetzen.",
    },
  },
  lowlevel: {
    titre: "Low-Level-Hardware und Fehlerinjektion",
    intro: "Wenn man das Steuergerät öffnet und das Silizium angreift.",
    tools: {
      chipwhisperer:
        "Plattform für Fehlerinjektion (Spannungs- oder Takt-Glitch) und Seitenkanalanalyse.",
      jtagulator:
        "Ermittelt automatisch die offenliegenden Debug-Pins JTAG / SWD auf einer unbekannten Platine.",
      buspirate:
        "Schweizer Taschenmesser, um mit einem Chip über SPI, I2C und UART zu sprechen und eine Schaltung zu untersuchen.",
      logic:
        "Erfasst die digitalen Signale eines internen Busses, um sie offline per Reverse Engineering nachzuvollziehen.",
      flashrom:
        "Liest und beschreibt die Flash-Speicher eines Steuergeräts, um eine Firmware auszulesen oder zu ersetzen.",
    },
  },
  sim: {
    titre: "Simulation und Frameworks",
    intro: "Ohne Fahrzeug üben und Kampagnen mit Werkzeugen ausstatten.",
    tools: {
      icsim:
        "Simulator für Armaturenbrett und CAN-Verkehr von OpenGarages, um das Wiedereinspielen ohne Auto zu üben.",
      metasploit:
        "Hardware-Brücke, die es erlaubt, CAN-Schnittstellen aus dem Exploitation-Framework heraus anzusteuern.",
      opengarages:
        "Ressourcen, Prüfstände und Dokumentation der Car-Hacking-Community.",
    },
  },
};
