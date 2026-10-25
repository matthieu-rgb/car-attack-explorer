import type { CanbusOverride } from "../canbus";

// Traduction allemande de la page "Le bus CAN". Repli sur le francais tant que
// vide. La structure (ids de section, ordre des blocs) suit canbus.ts.
export const canbusText: CanbusOverride = {
  title: "Der CAN-Bus",
  lede:
    "Das Netzwerk, über das früher oder später fast jeder Angriff läuft. Wie er funktioniert, warum er so zuverlässig ist und warum genau diese Zuverlässigkeit ihn zum Ziel macht.",
  sections: {
    quoi: {
      heading: "Eine einzige Leitung für alle",
      blocks: [
        "CAN steht für Controller Area Network. Bosch entwickelte den Bus 1986, um die Steuergeräte eines Fahrzeugs mit möglichst wenig Verkabelung zu verbinden. Zuvor benötigte jede Funktion ihr eigenes Adernpaar; CAN ersetzt all das durch ein einziges gemeinsames verdrilltes Adernpaar, CAN-H und CAN-L, auf dem alle Steuergeräte senden und mithören.",
        "Die Übertragung erfolgt differenziell: Die Information ist keine absolute Spannung, sondern die Differenz zwischen den beiden Leitungen. Elektromagnetische Störungen des Motors treffen beide Leiter gleichermaßen und heben sich auf. Übliche Datenraten liegen bei 500 kbit/s beim High-Speed-CAN und 125 kbit/s für Komfortfunktionen, mit einem Abschlusswiderstand von 120 Ohm an jedem Ende.",
        "CAN ist multimasterfähig und arbeitet ohne Adressen. Es gibt weder Absender noch Empfänger: Jeder Frame trägt eine Kennung, die seinen Inhalt beschreibt (etwa „Motordrehzahl“), nicht ein Gerät. Jedes Steuergerät entscheidet selbst, welche Kennungen es interessieren, und ignoriert den Rest.",
      ],
    },
    trame: {
      heading: "Anatomie eines Frames",
      blocks: [
        "Ein Standard-Datenframe besteht aus wenigen Feldern. Für einen Angreifer zählen vor allem zwei davon: die Kennung, die Priorität und Bedeutung festlegt, und die Daten mit bis zu acht Byte.",
        {
          caption: "CAN-Datenframe (Standardformat, Kennung mit 11 Bit)",
          lines: [
            "SOF | KENNUNG 11 Bit | RTR | IDE r0 | DLC | DATEN 0-8 B | CRC | ACK | EOF",
            "  1 |        0x0C4         |  0  |       |  8  | 3F 00 ... 00  |     |     |    ",
          ],
        },
        [
          "SOF: ein dominantes Bit, das den Frame-Beginn ankündigt und alle synchronisiert.",
          "Kennung (11 oder 29 Bit): beschreibt den Inhalt und dient der Arbitrierung. Je niedriger sie ist, desto höher die Priorität des Frames.",
          "RTR: unterscheidet eine Anforderung vom Senden von Daten.",
          "DLC: Anzahl der folgenden Datenbyte, von 0 bis 8.",
          "Daten: die Nutzlast, bis zu 8 Byte (64 bei CAN-FD).",
          "CRC: Integritätsprüfung, berechnet über den Frame.",
          "ACK: Jeder Knoten, der korrekt empfangen hat, setzt ein dominantes Bit; so weiß der Sender, dass jemand mitgelesen hat.",
          "EOF: das Frame-Ende.",
        ],
      ],
    },
    arbitrage: {
      heading: "Wer zuerst spricht: die Arbitrierung",
      blocks: [
        "Zwei Steuergeräte können gleichzeitig senden wollen. CAN löst die Kollision auf, ohne sie zu zerstören. Ein dominantes Bit (0) überschreibt elektrisch ein rezessives Bit (1). Jeder Sender liest den Bus mit, während er seine Kennung schreibt: Sobald er ein rezessives Bit setzt, während ein anderer ein dominantes erzwingt, erkennt er, dass ein höherpriorer Frame unterwegs ist, und verstummt sofort.",
        "Das Ergebnis: Die niedrigste Kennung gewinnt, Bit für Bit, ohne Kollision und ohne erneutes Senden. Die Priorität ist deterministisch. Deshalb erhalten kritische Nachrichten (Bremsen, Lenkung, Airbags) die niedrigsten Kennungen: Sie kommen immer zuerst durch, auch bei ausgelastetem Bus.",
      ],
    },
    atouts: {
      heading: "Was ihn zu einem hervorragenden Netzwerk macht",
      blocks: [
        [
          "Robust: Das differenzielle Adernpaar steckt eine elektrisch raue Umgebung weg.",
          "Kostengünstig: Zwei Leitungen verbinden Dutzende Steuergeräte.",
          "Deterministisch: Die prioritätsbasierte Arbitrierung garantiert die Echtzeitfähigkeit lebenswichtiger Funktionen.",
          "Multimaster: kein Dirigent und damit kein einzelner Ausfallpunkt.",
          "Selbstüberwachend: CRC, Quittierung und Fehlerzähler sind fest im Protokoll verankert.",
          "Fehlertolerant: Ein Knoten, der Fehler anhäuft, schaltet sich selbst stumm (Bus-off), um das Netzwerk nicht zu stören.",
        ],
      ],
    },
    faiblesses: {
      heading: "Seine Schwächen aus Sicht eines Angreifers",
      blocks: [
        "Alles, was seine Stärke bei der Zuverlässigkeit ausmacht, kehrt sich bei der Sicherheit um: CAN wurde nie für einen Angreifer entworfen, der bereits am Bus hängt.",
        [
          "Keine Authentifizierung: Jeder Knoten kann jede beliebige Kennung senden. Nichts belegt die Herkunft eines Frames.",
          "Keine Verschlüsselung: Der Verkehr liegt im Klartext vor, Sniffing gelingt sofort.",
          "Vollständiges Broadcast: Jede Nachricht wird von allen empfangen, Vertraulichkeit gibt es nicht.",
          "Kein Begriff der Quelle: Ein echter Frame lässt sich nicht von einem gefälschten unterscheiden; Spoofing ist für das Protokoll nicht erkennbar.",
          "Missbrauchbare Arbitrierung: Das ständige Senden der Kennung 0 überlastet den Bus (Denial of Service); erzwungene Fehler bei einem Zielknoten treiben ihn in den Bus-off und bringen ihn zum Schweigen.",
          "Implizites Vertrauen: Ohne filterndes Gateway öffnet ein exponierter Zugang (Infotainment, OBD) den Weg zu den kritischen Domänen.",
        ],
      ],
    },
    exploitation: {
      heading: "Von der Schwäche zum Angriff",
      blocks: [
        "Diese Eigenschaften übersetzen sich unmittelbar in Technikfamilien. Jede nutzt eine ganz bestimmte Lücke des Protokolls aus.",
        {
          aTitle: "Die fehlende Eigenschaft",
          a: [
            "Keine Vertraulichkeit",
            "Keine Prüfung der Herkunftsintegrität",
            "Keine Authentifizierung",
            "Prioritätsbasierte Arbitrierung",
          ],
          bTitle: "Die dadurch mögliche Technik",
          b: [
            "Passives Mitlesen (Sniffing) und Reverse Engineering der Kennungen",
            "Identisches Wiedereinspielen (Replay) einer Aufzeichnung",
            "Einschleusen und Fälschen von Frames (Spoofing), Fuzzing",
            "Denial of Service durch Überlastung oder Erzwingen des Bus-off",
          ],
        },
        "Jede dieser Familien wird mit Werkzeugen und realen Fällen im Angriffsexplorer ausführlich dargestellt.",
      ],
    },
    parades: {
      heading: "Wie man ihn härtet",
      blocks: [
        "Man schreibt CAN nicht neu: Man legt Schichten darüber. SecOC authentifiziert jede Nachricht mit einem Authentifizierungscode und einem Frische-Zähler und schließt damit Spoofing und Replay aus. Das zentrale Gateway segmentiert die Domänen und filtert, was vom Infotainment zur Bremse gelangt. Ein CAN-IDS lernt den normalen Verkehr und meldet Auffälliges. Schließlich wandern neuere Funktionen auf CAN-FD und Automotive-Ethernet.",
        "Keine dieser Gegenmaßnahmen verschlüsselt den Bus wirklich, und das ist der entscheidende Punkt: Ein Denial of Service durch Überlastung der Arbitrierung bleibt sehr schwer zu verhindern. Die Verteidigung zielt zuerst auf Authentizität und Abschottung, nicht auf Geheimhaltung.",
      ],
    },
  },
};
