import type { AttackOverride } from "../types";

export const de: Record<string, AttackOverride> = {
  // ---------------------------------------------------------------- Schicht A
  A1: {
    nom: "Passives Mitlesen des Busses (Sniffing)",
    resume:
      "Den gesamten Busverkehr mitlesen. Nichts ist verschlüsselt, also ist alles lesbar.",
    principe:
      "Der CAN ist ein Broadcast-Bus: Jede Botschaft wird von allen Knoten empfangen. Ein an den Bus angeschlossenes Gerät liest den gesamten Datenverkehr mit, ohne aufzufallen.",
    pourquoi:
      "Der CAN wurde 1986 für Zuverlässigkeit und Echtzeitfähigkeit entworfen, nicht für Sicherheit. Die Botschaften werden im Klartext übertragen, ohne Verschlüsselung und ohne Zugriffskontrolle: Zum Mitlesen genügen ein CAN-Transceiver und eine Dekodiermöglichkeit.",
    methode: [
      "Sich an einen Zugangspunkt des Busses anschließen, meist die OBD-II-Buchse",
      "Den Datenverkehr fortlaufend aufzeichnen",
      "Die Identifier, ihre Häufigkeit und die sich ändernden Bytes beobachten",
    ],
    prerequis: [
      "Physischer Zugang zum Bus (OBD-II oder Kabelbaum)",
      "Eine CAN-Schnittstelle und ein Dekoder",
    ],
    effet:
      "Alle Botschaften des Fahrzeugs werden sichtbar; man zählt die Identifier und rekonstruiert nach und nach die Karte des Datenverkehrs.",
    remediations: [
      "Physische Zugangskontrolle zur Diagnosebuchse",
      "Erkennung nicht autorisierter Geräte am Bus (IDS)",
      "Verschlüsselung des Busses (selten, kostspielig und kaum verbreitet)",
    ],
    annexe5:
      "Familie 2 (Kommunikationskanäle). SecOC schützt die Authentizität, nicht die Vertraulichkeit.",
    outils: ["candump", "Wireshark", "SavvyCAN"],
    casReel:
      "Ausgangspunkt nahezu aller öffentlichen Car-Hacking-Arbeiten, vom Car Hacker's Handbook bis zu den Demonstrationen von Miller und Valasek.",
    frame: {
      caption: "Roher Datenverkehr, am Bus mitgeschnitten (Beispiel)",
      lines: [
        { text: "can0  18F  [8]  1A 00 64 00 00 00 00 12" },
        { text: "can0  0C9  [8]  20 83 00 00 FF 00 00 00" },
        {
          text: "can0  244  [8]  00 00 00 2D 00 00 00 00   <- alles im Klartext",
          mark: "hl",
        },
      ],
    },
    verdictPass:
      "Das Mitlesen bleibt möglich: Keine Gegenmaßnahme des Modells schützt die Vertraulichkeit des Busses. Es ist die Grundlage aller folgenden Angriffe.",
    verdictBlock: "",
  },
  A2: {
    nom: "Reverse Engineering der Identifier",
    resume:
      "Einen Identifier und bestimmte Bytes einer realen Fahrzeugfunktion zuordnen (Geschwindigkeit, Blinker, Türen).",
    principe:
      "Indem man eine physische Bedienung betätigt und beobachtet, was sich am Bus ändert, isoliert man den Identifier und die Bytes, die für die Funktion verantwortlich sind.",
    pourquoi:
      "Die Identifier sind nicht öffentlich dokumentiert, aber stabil und deterministisch: Dieselbe Aktion erzeugt stets dieselbe Botschaft. Die Korrelation zwischen Aktion und Botschaft genügt, um die Zuordnung zu rekonstruieren.",
    methode: [
      "Fortlaufend aufzeichnen, während eine Funktion betätigt wird",
      "Die Botschaften herausfiltern, die sich im Moment der Aktion ändern",
      "Den Identifier und das Sollwert-Byte isolieren und durch Wiedereinspielen überprüfen",
    ],
    prerequis: ["Zugang zum Bus", "Zugang zu den physischen Bedienelementen des Fahrzeugs"],
    effet:
      "In der App hebt das Betätigen einer Funktion den entsprechenden Identifier im Monitor hervor.",
    remediations: [
      "Verschleierung der Identifier (schwacher Schutz)",
      "Tiefenverteidigung nachgelagert: SecOC, Segmentierung",
    ],
    annexe5: "Familie 2. Erkundungsschritt, der Injektion und Wiedereinspielung vorbereitet.",
    outils: ["cansniffer", "caringcaribou", "SavvyCAN"],
    casReel:
      "Standardmethode jeder CAN-Analyse; Kernbestandteil der 2023 dokumentierten Diebstähle per CAN-Injektion (Ian Tabor, Ken Tindell).",
    verdictPass:
      "Die Zuordnung bleibt durchführbar: Sie hängt nur vom Mitlesen und Beobachten ab, was keine Gegenmaßnahme des Modells verhindert.",
    verdictBlock: "",
  },
  A3: {
    nom: "Wiedereinspielen einer aufgezeichneten Botschaft (Replay)",
    resume:
      "Eine legitime Botschaft aufzeichnen, etwa das Entriegeln der Türen, und sie unverändert erneut senden.",
    principe:
      "Der einfache CAN kennt keinerlei Konzept von Frische. Eine wiedereingespielte Botschaft ist exakt identisch mit dem Original: Das Steuergerät kann sie nicht unterscheiden.",
    pourquoi:
      "Ohne authentifizierten Zähler oder Zeitstempel verbindet nichts eine Botschaft mit einem Zeitpunkt. Der Empfänger handelt nach dem Inhalt, nicht nach Herkunft oder Alter der Nachricht.",
    methode: [
      "Die Botschaft der angestrebten Aktion mitschneiden und identifizieren",
      "Sie speichern",
      "Sie zum gewünschten Zeitpunkt erneut senden",
    ],
    prerequis: ["Zugang zum Bus", "Die Zielbotschaft bereits aufgezeichnet"],
    effet: "Die wiedereingespielte Aktion wird ausgeführt: Beispielsweise entriegeln sich die Türen.",
    remediations: [
      "SecOC: Frischezähler + Authentifizierungscode (eine bereits gesehene Botschaft wird abgewiesen)",
      "Anwendungsseitige Anti-Replay-Zähler",
    ],
    annexe5: "Familie 2.",
    outils: ["canplayer", "SavvyCAN"],
    casReel:
      "Klassiker bei nicht authentifizierten Komfortfunktionen (Türen, Fenster, Hupe).",
    verdictPass:
      "Ohne SecOC wird die wiedereingespielte Botschaft als neu akzeptiert: Die Aktion lässt sich beliebig wiederholen.",
    verdictBlock:
      "SecOC weist die Botschaft ab: Ihr Frischezähler wurde bereits gesehen, der Authentifizierungscode passt nicht mehr. Das Wiedereinspielen schlägt fehl.",
  },
  A4: {
    nom: "Injektion einer gefälschten Botschaft (Spoofing)",
    resume:
      "Eine Botschaft mit einem legitimen Identifier und einem frei gewählten Wert fälschen. Der Empfänger hält sie für echt.",
    principe:
      "Auf dem CAN ist der Identifier eine Kennzeichnung der Botschaft, keine Absenderadresse. Jeder Knoten kann jeden beliebigen Identifier senden.",
    pourquoi:
      "Kein Feld benennt den Absender, und keine Signatur schützt den Inhalt. Indem der Angreifer die Botschaft häufiger sendet als die legitime Quelle, setzt er seinen Wert durch (er gewinnt die Arbitrierung oder übertönt die echte Botschaft).",
    methode: [
      "Identifier und Format des Ziels kennen (über A2)",
      "Die Botschaft mit dem gewünschten Wert fälschen",
      "Sie mit hoher Frequenz senden, um die legitime Quelle zu überbieten",
    ],
    prerequis: ["Zugang zum Bus", "Bekannter Ziel-Identifier"],
    effet:
      "Das Kombiinstrument zeigt eine falsche Geschwindigkeit an, oder ein falscher Befehl wird an ein Steuergerät gesendet.",
    remediations: [
      "SecOC: Der Authentifizierungscode (MAC) ist für eine gefälschte Botschaft ungültig",
      "Segmentierung zur Begrenzung der Reichweite eines kompromittierten Knotens",
    ],
    annexe5: "Familie 2.",
    outils: ["cansend", "cangen", "caringcaribou"],
    casReel:
      "Diebstähle per CAN-Injektion 2022-2023: Ein in den Scheinwerfer-Kabelbaum eingeschleustes Modul injiziert die Botschaft zum Entriegeln/Starten (Tabor, Tindell).",
    frame: {
      caption: "Injektion auf dem Bus (didaktisches Beispiel)",
      lines: [
        {
          text: "0C9#FF 20 00 00 00 00 00 00   gefälschte Botschaft, mit 100 Hz gesendet",
          mark: "hl",
        },
        { text: "0C9#00 14 00 00 00 00 00 00   legitime Botschaft, übertönt" },
        { text: "        ^^ Sollwert-Byte: die Frequenz verschafft dem Angreifer den Sieg" },
      ],
    },
    verdictPass:
      "Ohne SecOC kann der Empfänger die gefälschte Botschaft nicht von der echten unterscheiden: Der falsche Wert wird übernommen.",
    verdictBlock:
      "SecOC prüft den Authentifizierungscode: Die gefälschte Botschaft besitzt keinen gültigen MAC und wird abgewiesen.",
  },
  A5: {
    nom: "Fuzzing des Busses",
    resume:
      "Den Bus mit zufälligen Botschaften überfluten, um unerwartetes Verhalten zu provozieren oder ein Steuergerät zum Absturz zu bringen.",
    principe:
      "Durch das Senden zufälliger Identifier und Daten löst man mitunter versehentlich eine Funktion aus oder versetzt ein Steuergerät in einen nicht vorgesehenen Zustand.",
    pourquoi:
      "Die Steuergeräte validieren ihre Eingaben nicht immer streng. Eine nicht getestete Kombination kann eine fehlende Prüfung passieren und fragilen Code erreichen.",
    methode: [
      "Massenhaft zufällige oder halb gezielte Botschaften erzeugen",
      "Die Anomalien beobachten (Kontrollleuchten, Funktionen, Abstürze)",
      "Den Suchraum um die gefundenen Anomalien herum einengen",
    ],
    prerequis: ["Zugang zum Bus"],
    effet:
      "Unregelmäßiges Verhalten: Blinker, aufleuchtende Kontrollleuchten, ein einfrierendes Steuergerät.",
    remediations: [
      "Strenge Eingabevalidierung im Steuergerät",
      "SecOC (die meisten gefälschten Botschaften werden abgewiesen)",
      "Robustheitstests bereits im Entwurf",
    ],
    annexe5: "Familie 7 (nicht behandelte Schwachstellen).",
    outils: ["cangen", "caringcaribou", "python-can-Skripte"],
    casReel:
      "Entdeckungstechnik, die in der akademischen Forschung und bei Audits der Hersteller eingesetzt wird.",
    verdictPass:
      "Ohne Authentifizierung erreichen die zufälligen Botschaften die Steuergeräte und können unvorhergesehenes Verhalten auslösen.",
    verdictBlock:
      "SecOC weist die große Mehrheit der gefälschten Botschaften ab, bevor sie die Anwendungslogik erreichen, was die Angriffsfläche des Fuzzings deutlich verringert.",
  },
  A6: {
    nom: "Denial of Service durch Überlastung des Busses",
    resume:
      "Den Bus mit Botschaften höchster Priorität monopolisieren. Nichts anderes kommt mehr durch.",
    principe:
      "Die Arbitrierung des CAN gibt dem niedrigsten Identifier (dominante Bits) den Vorrang. Durch das fortlaufende Senden des Identifiers 0x000 gewinnt der Angreifer stets die Arbitrierung.",
    pourquoi:
      "Die Priorisierung durch Arbitrierung ist ein nativer Mechanismus des Protokolls, unabhängig von Inhalt oder Authentizität. Ein Strom von 0x000 ist vollkommen CAN-konform: Nichts unterscheidet ihn von legitimem, prioritärem Datenverkehr.",
    methode: [
      "Ununterbrochen Botschaften höchster Priorität senden (0x000)",
      "Den Strom aufrechterhalten, um jedem anderen Knoten den Buszugriff zu verwehren",
    ],
    prerequis: ["Zugang zum Bus"],
    effet:
      "Der Bus wird überlastet, der legitime Verkehr kommt zum Erliegen, das Kombiinstrument friert ein. Banner << Bus überlastet >>.",
    remediations: [
      "Eingebettete Angriffserkennung (IDS), die den anormalen Strom erkennt",
      "Filterung und Redundanz kritischer Verbindungen",
    ],
    annexe5: "Familie 2, unter dem Aspekt der Verfügbarkeit.",
    outils: ["cangen im Flood-Modus"],
    casReel:
      "Der Denial of Service verdeutlicht eine wesentliche Grenze: Keine Nachrichtenauthentifizierung verhindert die Überlastung eines gemeinsam genutzten Mediums.",
    verdictPass:
      "Zentraler didaktischer Punkt: SecOC ändert daran nichts. Die Authentifizierung von Nachrichten verhindert die Überlastung des Mediums nicht. Nur ein IDS oder Redundanz hilft, und der Bus bleibt nicht verfügbar.",
    verdictBlock: "",
  },
  A7: {
    nom: "Versetzen eines Steuergeräts in den Bus-Off-Zustand",
    resume:
      "Ein legitimes Steuergerät zwingen, sich vom Bus abzumelden, und dann seine Stelle einnehmen.",
    principe:
      "Man nutzt die Fehlerbehandlung des CAN aus. Indem man während der Sendungen eines Steuergeräts gezielte Fehler provoziert, lässt man seinen Fehlerzähler bis zum Bus-Off-Zustand ansteigen: Es verstummt. Der Angreifer übernimmt dann konkurrenzlos dessen Identifier.",
    pourquoi:
      "Der Mechanismus der Fehlereingrenzung (TEC/REC, Übergang nach Error-Passive und dann Bus-Off) ist automatisch und verpflichtend. Zweckentfremdet wird er zur Waffe: Das Opfer schließt sich selbst aus, in dem Glauben, defekt zu sein.",
    methode: [
      "Die Injektion eines Fehlerbits mit den Botschaften des Ziels synchronisieren",
      "Dessen Fehlerzähler bis zum Bus-Off ansteigen lassen",
      "An seiner Stelle senden, sobald das Ziel verstummt ist",
    ],
    prerequis: ["Zugang zum Bus", "Präzise Beherrschung des Timings (geeignete Hardware)"],
    effet:
      "Ein Steuergerät erlischt im Schema; ein angreifender Knoten übernimmt dessen Identifier.",
    remediations: [
      "Überwachung der Fehlerzähler (anormaler Anstieg)",
      "Eingebettetes IDS",
      "SecOC für die Authentizität, sobald die Usurpation versucht wird",
    ],
    annexe5: "Familie 2.",
    outils: ["akademische Forschung", "spezialisierte CAN-Hardware"],
    casReel: "In der akademischen Literatur beschrieben (Bus-Off-Attack, 2016).",
    verdictPass:
      "Ohne SecOC sendet der Angreifer, sobald das Ziel im Bus-Off ist, unter dessen Identität ohne Widerspruch.",
    verdictBlock:
      "SecOC begrenzt die Usurpation auf Anwendungsebene: Selbst wenn das Ziel zum Schweigen gebracht ist, besitzen die Botschaften des Angreifers keinen gültigen MAC. Zusätzlich erkennt ein IDS den Anstieg der Fehlerzähler.",
  },
  A8: {
    nom: "Man-in-the-Middle durch Bus-Brücke",
    resume:
      "Den Bus physisch in zwei Teile trennen und sich dazwischenschalten, um Botschaften weiterzuleiten, zu verändern oder zu blockieren.",
    principe:
      "Da der CAN ein Broadcast-Medium ist, erfordert ein echter Man-in-the-Middle, den Bus physisch mit einem Gerät mit zwei Schnittstellen zu segmentieren, das Botschaft für Botschaft entscheidet, was durchgeht.",
    pourquoi:
      "Auf einem gemeinsam genutzten Medium kann man sich nicht logisch zwischen zwei Knoten schalten: Man muss das Segment auftrennen. Ist die Brücke eingerichtet, hat der Angreifer die volle Kontrolle über den Fluss zwischen den beiden Hälften.",
    methode: [
      "Den Bus an der gewählten Stelle auftrennen",
      "Das Brückengerät mit zwei CAN-Schnittstellen einfügen",
      "Die weitergeleiteten Botschaften filtern, verzögern oder verändern",
    ],
    prerequis: [
      "Erweiterter physischer Zugang zum Kabelbaum",
      "Hardware mit zwei CAN-Schnittstellen",
    ],
    effet:
      "Ein Gerät erscheint am Bus; die Botschaften laufen über es und können verändert werden.",
    remediations: [
      "Physische Integrität des Kabelbaums",
      "SecOC (eine veränderte Botschaft verliert ihren MAC)",
      "Erkennung von Latenz/Anomalien",
    ],
    annexe5: "Familie 2.",
    outils: ["Hardware mit zwei CAN-Schnittstellen"],
    casReel:
      "Grundlage zahlreicher Analysestände und mancher hochwertiger Diebstahlswerkzeuge.",
    verdictPass:
      "Ohne SecOC kann die Brücke die Botschaften im Durchlauf verändern, ohne entdeckt zu werden.",
    verdictBlock:
      "SecOC schützt die Integrität: Verändert die Brücke eine authentifizierte Botschaft, wird ihr Authentifizierungscode ungültig und der Empfänger weist sie ab.",
  },

  // ---------------------------------------------------------------- Schicht B
  B1: {
    nom: "Umgehung von SecurityAccess (0x27)",
    resume: "Die Sperre brechen, die die sensiblen Diagnosefunktionen schützt.",
    principe:
      "Der UDS-Dienst 0x27 arbeitet nach dem Seed/Key-Prinzip: Das Steuergerät sendet einen Seed, der Client muss einen von einem geheimen Algorithmus berechneten Key zurücksenden. Ein schwacher Algorithmus, ein aus der Firmware extrahierter Key oder eine fehlende Versuchsbegrenzung öffnen die Sperre.",
    pourquoi:
      "Die Sicherheit beruht vollständig auf der Geheimhaltung des Algorithmus und auf einer Anti-Brute-Force-Verzögerung. Fehlt eines von beiden, ist Seed/Key nur eine Formsache: Die Beziehung Seed -> Key ist deterministisch.",
    methode: [
      "Einen Seed anfordern (Anfrage 0x27)",
      "Den Key berechnen, falls der Algorithmus bekannt ist, sonst ihn mangels Verzögerung per Brute Force ermitteln",
      "Den Key zurücksenden und die gesicherte Sitzung erhalten",
    ],
    prerequis: [
      "Diagnosezugang (OBD oder DoIP)",
      "Mitunter der aus der Firmware extrahierte Algorithmus",
    ],
    effet:
      "Die Sperre fällt und gibt die anschließenden sensiblen Dienste frei (Schreiben, Neuprogrammierung).",
    remediations: [
      "Robuster Algorithmus und geschützter Key (HSM)",
      "Verzögerung und Sperrung nach Fehlversuchen (Anti-Brute-Force)",
      "Schlüsselrotation",
    ],
    annexe5: "Familien 5 (Diagnoseschnittstelle) und 7.",
    outils: ["python-udsoncan", "UDS-Skripte"],
    casReel:
      "Zahlreiche Serien-Seed/Key-Algorithmen erwiesen sich als schwach oder wurden durch Reverse Engineering der Firmware extrahiert.",
    frame: {
      caption: "UDS-SecurityAccess-Austausch (Beispiel)",
      lines: [
        { text: "-> 27 01            requestSeed" },
        { text: "<- 67 01 A3 7F 10 2C   Seed" },
        { text: "-> 27 02 7C 41 9B 6E   sendKey (berechneter Key)", mark: "hl" },
        { text: "<- 67 02            Zugriff gewährt", mark: "ok" },
      ],
    },
    verdictPass:
      "Nicht gehärtete Diagnoseschnittstellen: keine Verzögerung, schwacher Algorithmus, die Sperre fällt.",
    verdictBlock:
      "Die Härtung erzwingt Verzögerung, Sperrung nach Fehlversuchen und einen geschützten Key: Brute Force wird undurchführbar, und der Algorithmus lässt sich nicht mehr einfach extrahieren.",
  },
  B2: {
    nom: "Böswillige Neuprogrammierung (RequestDownload 0x34)",
    resume: "Eine veränderte Firmware in ein Steuergerät einspielen.",
    principe:
      "Der Dienst 0x34 leitet eine Datenübertragung zum Steuergerät ein, ein Schritt der Neuprogrammierung, gefolgt von 0x36 (TransferData) und 0x37. Wird die Authentizität der Firmware nicht geprüft, spielt man seine eigene ein.",
    pourquoi:
      "Ohne Secure Boot und ohne beim Schreiben und Starten geprüfte Signatur führt das Steuergerät jedes korrekt übertragene Binärprogramm aus. Die legitime und die böswillige Neuprogrammierung folgen derselben UDS-Sequenz.",
    methode: [
      "SecurityAccess erlangen (siehe B1)",
      "RequestDownload und dann TransferData mit der vorbereiteten Firmware starten",
      "Die Übertragung bestätigen (RequestTransferExit)",
    ],
    prerequis: ["Diagnosezugang", "SecurityAccess überwunden"],
    effet:
      "Das Steuergerät gerät unter die Kontrolle des Angreifers (eigene Farbe im Plan).",
    remediations: [
      "Secure Boot und Firmware-Signatur",
      "Integritätsprüfung und Anti-Rollback",
      "Beim Hersteller geschützte Signaturschlüssel",
    ],
    annexe5: "Familien 3 (Update-Verfahren) und 6 (Code).",
    outils: ["zweckentfremdete Flash-Werkzeuge des Herstellers", "UDS-Skripte"],
    casReel:
      "Die dauerhafte Übernahme eines Steuergeräts verläuft fast immer über eine nicht authentifizierte Neuprogrammierung.",
    verdictPass:
      "Ohne Authentizitätsprüfung wird die böswillige Firmware eingespielt und bleibt bestehen.",
    verdictBlock:
      "Die Härtung (Secure Boot, Signatur, Anti-Rollback) verweigert ein nicht signiertes Binärprogramm: Die Installation schlägt fehl und das Steuergerät bleibt unversehrt.",
  },
  B3: {
    nom: "Missbrauch von WriteDataByIdentifier (0x2E)",
    resume: "Unbefugt direkt einen Datenwert in ein Steuergerät schreiben.",
    principe:
      "Der Dienst 0x2E schreibt den Wert eines Daten-Identifiers (DID). Ist er ohne korrekte Authentifizierung zugänglich, verändert man interne Parameter: Kalibrierung, Konfiguration, Kilometerstand.",
    pourquoi:
      "Die Zugriffskontrolle erfolgt dienst- und DID-weise. Eine zu freizügige Rechtematrix oder ein sensibler DID, der in der Standardsitzung beschreibbar bleibt, genügt, um den Schreibzugriff zu öffnen.",
    methode: [
      "In die erforderliche Diagnosesitzung eintreten (und SecurityAccess, falls verlangt)",
      "0x2E mit dem Ziel-DID und dem neuen Wert senden",
    ],
    prerequis: ["Diagnosezugang"],
    effet:
      "Ein angezeigter Parameter ändert sich: beispielsweise ein Konfigurationswert oder ein Kilometerstand.",
    remediations: [
      "Strenge Zugriffskontrolle je Dienst und je DID",
      "Rechtetrennung (Schreibzugriff einer gesicherten Sitzung vorbehalten)",
    ],
    annexe5: "Familien 5 und 6.",
    outils: ["python-udsoncan", "UDS-Skripte"],
    casReel: "Der Kilometerstandbetrug per UDS ist ein häufiger und dokumentierter Fall.",
    verdictPass:
      "Nicht gehärtete Schnittstellen: Der sensible DID ist beschreibbar, der Wert ändert sich.",
    verdictBlock:
      "Die Härtung beschränkt 0x2E auf die in einer gesicherten Sitzung zugelassenen DIDs: Der Schreibzugriff wird verweigert.",
  },
  B4: {
    nom: "Missbrauch von RoutineControl (0x31)",
    resume:
      "Aus der Ferne eine interne Wartungsroutine des Steuergeräts auslösen: Bremsenentlüftung, Aktortest, Anlernvorgang.",
    principe:
      "Der Dienst 0x31 startet Werks-/Werkstattroutinen (startRoutine). Manche steuern Aktoren direkt an. Ohne ausreichende Kontrolle zugänglich, werden sie zu physischen Befehlen.",
    pourquoi:
      "Diese Routinen existieren für den Kundendienst und wirken real auf die Hardware. Ihre Gefährlichkeit rührt daher, dass sie die normale Anwendungslogik umgehen: Sie sind dazu gemacht, den Aktor direkt anzusteuern.",
    methode: [
      "Den Routine-Identifier eines sensiblen Aktors ermitteln",
      "In die erforderliche Sitzung eintreten",
      "Die Routine (0x31 01) mit ihren Parametern starten",
    ],
    prerequis: ["Diagnosezugang", "Ausreichende Sitzung und Rechte"],
    effet:
      "Ein Aktor reagiert außerhalb des Kontexts: Beispielsweise wird eine Bremsroutine ausgelöst.",
    remediations: [
      "Strenge Aktivierungsbedingungen (Fahrzeug im Stillstand, gesicherte Sitzung)",
      "Zugriffskontrolle je Routine",
      "Protokollierung",
    ],
    annexe5: "Familien 5 und 6.",
    outils: ["UDS-Skripte"],
    casReel: "Aktorroutinen sind ein bekanntes Ziel von Kundendienst-Audits.",
    verdictPass:
      "Ohne Härtung startet die Routine auch außerhalb der vorgesehenen Bedingungen.",
    verdictBlock:
      "Die Härtung erzwingt die Aktivierungsbedingungen und beschränkt den Zugriff auf die Routine: Das Auslösen wird verweigert.",
  },
  B5: {
    nom: "Denial of Service durch Diagnose-Reset (0x11 / 0x3E)",
    resume:
      "Ein Steuergerät in der Diagnosesitzung halten oder es in Dauerschleife zurücksetzen, um es unverfügbar zu machen.",
    principe:
      "Ein in der Diagnosesitzung gehaltenes Steuergerät (über TesterPresent 0x3E) kann einen Teil seiner normalen Funktionen aussetzen. Wiederholtes ECUReset (0x11) startet es unablässig neu.",
    pourquoi:
      "Die Diagnosesitzung ist für die Werkstatt bei stehendem Fahrzeug vorgesehen. Nicht immer verhindert etwas, in sie einzutreten und darin zu verbleiben oder den Reset zu spammen: Das Protokoll begrenzt die Häufigkeit dieser Anfragen standardmäßig nicht.",
    methode: [
      "In die Diagnosesitzung eintreten und fortlaufend TesterPresent senden",
      "Oder ECUReset wiederholen, um den Normalbetrieb zu verhindern",
    ],
    prerequis: ["Diagnosezugang"],
    effet:
      "Das Steuergerät reagiert nicht mehr normal: eingeschränkte Funktionen, Kontrollleuchten.",
    remediations: [
      "Verbot, bei fahrendem Fahrzeug in die Diagnosesitzung einzutreten",
      "Häufigkeitsbegrenzung der Anfragen",
      "IDS",
    ],
    annexe5: "Familien 5 und 2 (Verfügbarkeit).",
    outils: ["UDS-Skripte"],
    casReel: "Bekannte Nebenwirkung schlecht bedingter Diagnosesitzungen.",
    verdictPass:
      "Nicht gehärtete Schnittstellen: Die Sitzung bleibt offen oder der Reset wiederholt sich, das Steuergerät klinkt sich aus.",
    verdictBlock:
      "Die Härtung bedingt die Diagnosesitzung (Fahrzeug im Stillstand) und begrenzt die Häufigkeit: Der Denial of Service per Diagnose wird blockiert.",
  },

  // ---------------------------------------------------------------- Schicht C
  C1: {
    nom: "Relay-Angriff auf schlüssellosen Zugang (PKES)",
    resume: "Die Reichweite des Schlüssels erweitern, um ohne ihn zu öffnen und zu starten.",
    principe:
      "Das PEPS-System entriegelt, wenn der Schlüssel in der Nähe ist. Zwei Komplizen leiten das Signal zwischen Schlüssel (bei Ihnen zu Hause) und Fahrzeug (auf der Straße) weiter: Das Fahrzeug glaubt, der Schlüssel sei daneben.",
    pourquoi:
      "Das PEPS schließt die Nähe allein aus der empfangenen Signalstärke, ohne die Laufzeit zu messen. Ein Relay verlängert den Kanal, ohne dass das System merkt, dass der Schlüssel in Wirklichkeit zehn Meter ... oder hundert entfernt ist.",
    methode: [
      "Ein Gerät fängt das Signal in der Nähe des Schlüssels auf",
      "Ein zweites spielt es in der Nähe des Fahrzeugs ab",
      "Das Fahrzeug öffnet und erlaubt das Starten",
    ],
    prerequis: ["Nähe zu Schlüssel und Fahrzeug", "Zwei Relay-Funkgeräte"],
    effet:
      "Der entfernte Schlüssel wird per Relay mit dem Fahrzeug verbunden; die Türen öffnen sich.",
    remediations: [
      "Distanzmessung per Laufzeit (UWB)",
      "Bewegungssensor im Schlüssel (Deaktivierung in Ruhe)",
      "Vom Nutzer aktivierbare RF-Abschaltung",
    ],
    annexe5: "Familie 5 (externe Konnektivität).",
    outils: ["Relay-Funkhardware (Forschung)"],
    casReel:
      "An zahlreichen Premiummodellen demonstriert; Relay an einem Tesla Model S durch KeenLab (2018), Abwehr durch UWB in den jüngeren Generationen.",
    verdictPass:
      "PEPS-spezifische Abwehr: Keine der Gegenmaßnahmen des Modells (SecOC, Segmentierung, Härtung) begegnet dem Relay. Es braucht UWB oder einen Bewegungssensor im Schlüssel.",
    verdictBlock: "",
  },
  C2: {
    nom: "Kompromittiertes Infotainment und anschließender Pivot zum Bus",
    resume: "Über den vernetzten Bildschirm eindringen und dann bis zu den kritischen Funktionen springen.",
    principe:
      "Das Infotainment legt entfernte Schnittstellen offen (Mobilfunk, Wi-Fi). Eine Schwachstelle darin verschafft einen Fuß in der Tür; ist die Segmentierung unzureichend, erreicht der Angreifer den Bus und physische Funktionen.",
    pourquoi:
      "Alles hängt an der Abschottung. Da der CAN-Identifier keine Absenderadresse ist, kann ein Knoten, der den kritischen Bus erreicht, dort alles senden. Das Gateway ist das Einzige, das den Übergang von einem Domänen in eine andere verweigern kann.",
    methode: [
      "Das IVI aus der Ferne über die Mobilfunkschnittstelle ausnutzen",
      "Den mit dem Bus verbundenen Mikrocontroller erreichen (zweiter Kern des IVI)",
      "Mangels domänenübergreifender Filterung das Gateway überwinden",
      "Den Befehl auf den Chassis-Bus injizieren",
    ],
    prerequis: [
      "Fernzugriff (Mobilfunk/Wi-Fi)",
      "Anwendungsschwachstelle im IVI",
      "Schwache Segmentierung",
    ],
    effet:
      "Der Pfad durchquert das Gateway von der Antenne bis zur Bremse, die unter Kontrolle gerät.",
    remediations: [
      "Strenge Segmentierung durch das Gateway, domänenübergreifende Filterung",
      "Härtung und Aktualisierung des IVI",
      "IDS auf den kritischen Bussen",
    ],
    annexe5: "Familien 1 (Back-End), 5 (Konnektivität) und 2.",
    outils: ["Referenz: Miller & Valasek, Jeep Cherokee 2015"],
    casReel:
      "Jeep Cherokee 2015: Fernübernahme über Uconnect bis hin zu Lenkung und Bremsen. 1,4 Millionen Fahrzeuge zurückgerufen.",
    verdictPass:
      "Ohne Segmentierung durchquert der Pivot das Gateway und erreicht die Bremse. SecOC würde hier nichts ändern, wenn der Angreifer gültige Befehle sendet.",
    verdictBlock:
      "Das Gateway weist den domänenübergreifenden Pivot ab: Der Befehl erreicht die Bremse nie. Der Rest des Fahrzeugs funktioniert weiter.",
  },
  C3: {
    nom: "Ausnutzung der Telematik (TCU) aus der Ferne",
    resume: "Das eingebaute Modem angreifen, um von überall her in das Fahrzeug einzudringen.",
    principe:
      "Die TCU ist mit dem Mobilfunknetz und dem Backend des Herstellers verbunden. Eine Schwachstelle auf TCU-Seite öffnet einen Fernzugriff, potenziell im Maßstab einer ganzen Flotte.",
    pourquoi:
      "Die TCU ist ein permanenter, stets erreichbarer Einstiegspunkt, der oft mit dem Bus verbunden ist. Kompromittiert bietet sie dem Angreifer dieselbe Position wie ein internes Steuergerät, aber aus der Ferne.",
    methode: [
      "Die TCU über ihre Netzschnittstelle kompromittieren",
      "Ihre Busverbindung nutzen, um Befehle zu senden",
      "Den Vorgang an den baugleichen Fahrzeugen wiederholen",
    ],
    prerequis: ["Fernzugriff", "TCU-Schwachstelle"],
    effet: "Einstieg über das Dach (Antenne), Pfad zum Gateway und zu den Domänen.",
    remediations: [
      "Härtung der TCU",
      "Segmentierung (begrenzt die Reichweite, sobald man im Fahrzeug ist)",
      "Starke Authentifizierung gegenüber dem Backend",
    ],
    annexe5: "Familien 1 und 5.",
    outils: ["allgemeine Referenz"],
    casReel:
      "BMW ConnectedDrive (2015, Dieter Spaar): aus der Ferne über die Telematikverbindung gesendete Befehle an ~2,2 Millionen Fahrzeugen.",
    verdictPass:
      "Ohne Segmentierung erreicht die kompromittierte TCU die kritischen Domänen vom Netz aus.",
    verdictBlock:
      "Die Segmentierung schottet die TCU ab: Selbst kompromittiert kann sie das Gateway nicht überwinden, um zu den kritischen Funktionen zu gelangen.",
  },
  C4: {
    nom: "Böswilliges OTA-Update oder Rollback",
    resume: "Ein falsches Update einspielen oder eine Rückkehr zu einer verwundbaren Version erzwingen.",
    principe:
      "Werden Authentizität und Version der Updates nicht geprüft, spielt ein Angreifer Code ein oder bringt eine bereits behobene Schwachstelle zurück (Rollback).",
    pourquoi:
      "Der OTA-Kanal ist eine Fernschreibberechtigung über den gesamten Fahrzeugbestand. Ohne Signatur und Anti-Rollback wird er zum idealen Vektor: massenhaft, dauerhaft und in den Augen des Fahrzeugs legitim.",
    methode: [
      "Sich auf den Update-Kanal setzen oder dessen Quelle vortäuschen",
      "Ein nicht signiertes Paket einspielen oder eine alte, signierte, aber verwundbare Version wiedereinspielen",
    ],
    prerequis: ["Position auf dem Update-Kanal"],
    effet:
      "Ein Update trifft über die Antenne ein: ohne Abwehr akzeptiert, mit Abwehr abgewiesen.",
    remediations: [
      "Signatur der Updates und Integritätsprüfung",
      "Anti-Rollback (Ablehnung früherer Versionen)",
      "Nachverfolgbarkeit (RXSWIN, UNECE R156)",
    ],
    annexe5: "Familie 3 (Update-Verfahren).",
    outils: ["konzeptuell"],
    casReel:
      "Die Regelung UNECE R156 schreibt eben ein Update-Management-System vor, um diese Tür zu schließen.",
    verdictPass:
      "Ohne Signaturprüfung und ohne Anti-Rollback wird das böswillige Paket oder die alte Version eingespielt.",
    verdictBlock:
      "Die Härtung (geprüfte Signatur, Anti-Rollback) verweigert ein nicht signiertes Paket ebenso wie einen Rückschritt: Das Update wird abgewiesen.",
  },
  C5: {
    nom: "RollJam: Abfangen des Rolling Codes (RKE)",
    resume:
      "Die Fernbedienung stören, einen nicht verbrauchten Code abfangen und ihn später wiedereinspielen.",
    principe:
      "Die Fernöffnung (RKE) nutzt einen Rolling Code zur einmaligen Verwendung. Der Angreifer stört den Empfang des Fahrzeugs und fängt zugleich den gesendeten Code ab; der Nutzer drückt erneut, der Angreifer behält den ersten gültigen Code und spielt ihn beliebig wieder ein.",
    pourquoi:
      "Der Rolling Code wird erst ungültig, sobald das Fahrzeug ihn empfängt. Indem der Angreifer diesen Empfang verhindert, bewahrt er einen noch gültigen Code. Der Zähler des Fahrzeugs ist nicht vorgerückt: Das Wiedereinspielen gelingt.",
    methode: [
      "Das Empfangsband des Fahrzeugs stören",
      "Den oder die von der Fernbedienung gesendeten Codes abfangen",
      "Einen Code durchlassen, um keinen Verdacht zu erregen, und den anderen behalten",
    ],
    prerequis: [
      "Nähe zum Schlüssel im Moment der Nutzung",
      "Ein SDR-Sendeempfänger",
    ],
    effet: "Das Fahrzeug entriegelt sich beim Wiedereinspielen des abgefangenen Codes.",
    remediations: [
      "Kurzes zeitliches Gültigkeitsfenster auf Fahrzeugseite",
      "An die Uhr gebundene Codes (zeitgestempelter Rolling Code)",
      "Umstieg auf Challenge-Response-Protokolle",
    ],
    annexe5: "Familie 5.",
    outils: ["SDR (Forschung)", "Referenz: RollJam, Samy Kamkar 2015"],
    casReel:
      "RollJam, 2015 von Samy Kamkar vorgestellt, wirksam gegen zahlreiche Fernbedienungen mit Rolling Code.",
    verdictPass:
      "RKE-spezifische Abwehr: Die Gegenmaßnahmen des Modells begegnen der Funkstrecke der Fernbedienung nicht. Es braucht ein Zeitfenster oder ein Challenge-Response-Verfahren auf Seite des Schlüsselsystems.",
    verdictBlock: "",
  },
  C6: {
    nom: "Ausnutzung von Bluetooth / BLE",
    resume:
      "Über den Bluetooth-Stack des Infotainments eindringen oder das BLE-Entriegeln eines Telefon-Schlüssels per Relay weiterleiten.",
    principe:
      "Zwei Ansätze: Eine Schwachstelle im Bluetooth-Stack des IVI verschafft einen Fuß in der Tür auf kurze Distanz; oder, beim Zugang per Smartphone (Phone-as-a-Key), erweitert ein BLE-Relay die Reichweite wie beim PKES.",
    pourquoi:
      "Bluetooth-Stacks sind große, historisch fehlerbehaftete Software. Und BLE schließt wie PKES die Nähe aus dem Signal: Ein Relay täuscht es, denn die BLE-Spezifikation garantiert die Distanz nicht.",
    methode: [
      "Den Bluetooth-Stack des IVI zur Codeausführung angreifen, oder",
      "Die BLE-Verbindung zwischen Telefon-Schlüssel und Fahrzeug per Relay weiterleiten",
    ],
    prerequis: [
      "Bluetooth-Nähe",
      "Stack-Schwachstelle oder BLE-Zugang ohne Distanzmessung",
    ],
    effet: "Das IVI gerät unter Kontrolle, oder das Fahrzeug öffnet sich per BLE-Relay.",
    remediations: [
      "Updates des Bluetooth-Stacks",
      "Distanzmessung (UWB) für den Zugang per Telefon",
      "Härtung und Isolation des IVI",
    ],
    annexe5: "Familien 5 und 7.",
    outils: ["Referenz: BLE-Relay Tesla, NCC Group 2022"],
    casReel:
      "BLE-Relay an einem Tesla (NCC Group, 2022): Entriegeln und Starten trotz Verschlüsselung, da die Distanz nicht geprüft wurde.",
    verdictPass:
      "Ohne Härtung/Update des IVI verschafft die Bluetooth-Schwachstelle einen ausnutzbaren lokalen Zugang.",
    verdictBlock:
      "Die Härtung (aktueller Stack, isoliertes IVI) schließt die Anwendungsschwachstelle. Das reine BLE-Relay dagegen erfordert eine Abwehr vom Typ UWB auf Zugangsseite.",
  },
  C7: {
    nom: "Falsche Mobilfunk-Basisstation",
    resume:
      "Die TCU auf eine falsche Antenne locken, um ihren Datenverkehr abzufangen oder zu manipulieren.",
    principe:
      "Eine falsche Basisstation (IMSI-Catcher / Pirat-Femtozelle) gibt sich als das Netz aus. Die TCU verbindet sich mit ihr, besonders wenn sie noch 2G akzeptiert oder das Netz nicht validiert.",
    pourquoi:
      "Die Mobilfunkverbindung bevorzugt das stärkste Signal, und 2G authentifiziert das Netz endgeräteseitig nicht. Eine stärkere Pirat-Antenne fängt die TCU daher ab und schaltet sich zwischen sie und das Backend.",
    methode: [
      "Eine Pirat-Zelle senden, die stärker ist als das legitime Netz",
      "Die TCU zum Rückfall auf einen schwachen Modus (2G) zwingen",
      "Den Verkehr zum Backend abfangen oder verändern",
    ],
    prerequis: ["Nähe zum Fahrzeug", "Mobilfunk-Funkhardware"],
    effet:
      "Der Verkehr der TCU läuft über den Angreifer; Befehle und Updates werden manipulierbar.",
    remediations: [
      "2G-Rückfall unterbinden",
      "Gegenseitiges TLS TCU <-> Backend (gepinnte Zertifikate)",
      "Erkennung von Netzanomalien",
    ],
    annexe5: "Familien 1 und 5.",
    outils: ["Mobilfunk-SDR (Forschung)"],
    casReel:
      "Bewährte Technik gegen zahlreiche schlecht konfigurierte vernetzte Mobilfunkgeräte.",
    verdictPass:
      "Ohne Härtung (2G-Rückfall erlaubt, kein Pinning) spricht die TCU mit der Pirat-Antenne.",
    verdictBlock:
      "Die Härtung (kein 2G, gegenseitiges gepinntes TLS) verhindert die Pirat-Verbindung und das Abfangen.",
  },
  C8: {
    nom: "Zweckentfremdung von Begleit-App und API",
    resume:
      "Die API der mobilen Anwendung missbrauchen, um das Fahrzeug eines anderen Nutzers zu steuern.",
    principe:
      "Die Begleit-App steuert das Fahrzeug über eine Backend-API. Unzureichende Zugriffskontrollen (Objektautorisierung, nicht geprüfte direkte Referenz) erlauben es, auf ein fremdes Fahrzeug einzuwirken.",
    pourquoi:
      "Das ist klassische Web-Sicherheit, auf das Automobil angewandt: Prüft das Backend, wer Sie sind, aber nicht, wozu Sie berechtigt sind, genügt die Kenntnis des Identifiers eines anderen Fahrzeugs, um ihm Befehle zu senden.",
    methode: [
      "Die Aufrufe der mobilen Anwendung beobachten",
      "Einen Aufruf unter Austausch des Identifiers des Zielfahrzeugs wiedereinspielen",
      "Funktionen aus der Ferne auslösen (Ortung, Öffnen, Klimatisierung)",
    ],
    prerequis: ["Ein Konto beim Dienst", "Eine API mit schwachen Zugriffskontrollen"],
    effet: "Fernbefehle gehen über das Backend an ein fremdes Fahrzeug.",
    remediations: [
      "Objektautorisierung im Backend (geprüfte Verknüpfung Konto <-> Fahrzeug)",
      "API-Tests (direkte Referenzen, Enumeration)",
      "Protokollierung und Ratenbegrenzung",
    ],
    annexe5: "Familie 1 (Back-End und Dienste).",
    outils: ["Web-API-Testwerkzeuge"],
    casReel:
      "Nissan Leaf (Troy Hunt, 2016): Die API prüfte nur die VIN, was das Einwirken auf andere Fahrzeuge erlaubte. Seither zahlreiche ähnliche Fälle (Sam Curry et al., 2023).",
    verdictPass:
      "Nicht gehärtetes Backend: Die API akzeptiert einen Befehl an ein Fahrzeug, das nicht zum Konto gehört.",
    verdictBlock:
      "Die Härtung (Objektautorisierung) prüft, dass das Fahrzeug tatsächlich zum Konto gehört: Der fremde Befehl wird verweigert.",
  },
  C9: {
    nom: "Kompromittierung des Backends (Flotte)",
    resume:
      "Das Backend des Herstellers übernehmen und damit die Fähigkeit, auf Tausende von Fahrzeugen einzuwirken.",
    principe:
      "Das Backend orchestriert Telematik, Updates und Fernbefehle. Kompromittiert bietet es einen Hebel im Maßstab der gesamten Flotte.",
    pourquoi:
      "Es ist der Knotenpunkt: Ein einziges System spricht mit allen Fahrzeugen in einer etablierten Vertrauensbeziehung. Die Reichweite des Angriffs ist nicht mehr ein Fahrzeug, sondern der gesamte Bestand. Es ist der dominierende Vektor der jüngsten Vorfälle.",
    methode: [
      "Eine Komponente des Backends oder eines Zulieferers kompromittieren",
      "Die Vertrauensbeziehung Backend -> Fahrzeuge missbrauchen",
      "Befehle oder Updates in großem Maßstab verteilen",
    ],
    prerequis: ["Zugang zu einem Glied des Backends oder der Lieferkette"],
    effet:
      "Einstieg über die Antenne, Pfad zum Gateway, auf eine ganze Flotte replizierbar.",
    remediations: [
      "Backend-Sicherheit (Segmentierung, geringste Rechte, Überwachung)",
      "Eingebettete Segmentierung (begrenzt, was ein Backend-Befehl bewirken kann)",
      "Starke Authentifizierung und Signatur der Befehle",
    ],
    annexe5: "Familie 1.",
    outils: ["allgemeine Referenz"],
    casReel:
      "2024-2025 vereinen Telematik, Cloud und API etwa zwei Drittel der öffentlichen Automobilangriffe auf sich (Upstream-Bericht).",
    verdictPass:
      "Ohne eingebettete Segmentierung erreicht ein Befehl aus dem kompromittierten Backend die kritischen Funktionen.",
    verdictBlock:
      "Die Segmentierung begrenzt, was ein Backend-Befehl an Bord auslösen kann: Die Reichweite einer Cloud-Kompromittierung bleibt eingedämmt.",
  },

  // ---------------------------------------------------------------- Schicht D
  D1: {
    nom: "UDS über IP (DoIP)",
    resume: "Dieselbe UDS-Diagnose, aber gekapselt im Automotive Ethernet.",
    principe:
      "DoIP (ISO 13400) überträgt UDS über IP. Dieselben sensiblen Dienste (0x27, 0x34) sind erreichbar, potenziell mit größerer Reichweite und höherer Geschwindigkeit.",
    pourquoi:
      "Der Wechsel auf IP bringt Geschwindigkeit und Reichweite des Netzes, aber auch dessen Schwächen: Ist die DoIP-Schnittstelle ohne Netzauthentifizierung erreichbar, ist UDS wie ein gewöhnlicher TCP-Dienst exponiert.",
    methode: [
      "Die DoIP-Schnittstelle erreichen (Port 13400)",
      "Die Sitzung aufbauen und über IP in UDS kommunizieren",
      "Mit höherer Geschwindigkeit auf SecurityAccess und Neuprogrammierung (B1, B2) aufsetzen",
    ],
    prerequis: ["Zugang zum eingebetteten Ethernet-Netz"],
    effet: "Ein IP-Fluss zu einem Steuergerät; die UDS-Dienste werden über IP ausgeführt.",
    remediations: [
      "Netzauthentifizierung und -segmentierung (VLAN)",
      "Eingebettete Firewall, TLS",
      "Härtung der UDS-Dienste (siehe Schicht B)",
    ],
    annexe5: "Familien 5 und 2.",
    outils: ["python-doipclient", "DoIP-Skripte"],
    casReel:
      "DoIP ist der Diagnosestandard neuerer Fahrzeuge mit Ethernet-Architektur.",
    verdictPass:
      "Erreichbare DoIP-Schnittstelle und nicht gehärtetes UDS: Die Diagnose über IP öffnet alles, und zwar schneller.",
    verdictBlock:
      "Netzsegmentierung und Härtung der Dienste sperren den nicht autorisierten DoIP-Zugang und blockieren die sensiblen Anfragen.",
  },
  D2: {
    nom: "SOME/IP-Usurpation und Ethernet-MITM",
    resume: "Die serviceorientierte Kommunikation auf dem Ethernet des Fahrzeugs usurpieren.",
    principe:
      "SOME/IP ist die Service-Middleware auf dem Automotive Ethernet. Ohne Authentifizierung usurpiert man einen Dienst oder schaltet sich als Man-in-the-Middle dazwischen (per ARP-Spoofing), wie in einem klassischen IP-Netz.",
    pourquoi:
      "SOME/IP sieht standardmäßig keine Authentifizierung vor, und die Dienstermittlung (SOME/IP-SD) gibt bekannt, wer was anbietet. Der Angreifer erklärt sich zum Anbieter eines Dienstes oder leitet den Verkehr zwischen zwei Steuergeräten um.",
    methode: [
      "Die bekanntgegebenen Dienste ermitteln (SOME/IP-SD)",
      "Einen Dienst usurpieren oder sich als MITM dazwischenschalten (ARP-Spoofing)",
      "Falsche Dienstdaten injizieren (z. B. ADAS-Wahrnehmung)",
    ],
    prerequis: ["Zugang zum eingebetteten Ethernet-Netz"],
    effet:
      "Ein Dienst wird umgeleitet oder ein Fluss zwischen zwei Ethernet-Steuergeräten abgefangen.",
    remediations: [
      "Authentifizierung der Dienste",
      "VLAN-Segmentierung und Filterung",
      "Verschlüsselung und Erkennung von ARP-Spoofing",
    ],
    annexe5: "Familie 2.",
    outils: ["angepasste klassische Netzwerkzeuge", "SOME/IP-Skripte"],
    casReel: "Aufkommende Angriffsfläche der zonalen Ethernet-Architekturen.",
    verdictPass:
      "Ohne Segmentierung und ohne Dienstauthentifizierung gelingt die SOME/IP-Usurpation.",
    verdictBlock:
      "Die Segmentierung (VLAN, Filterung) hindert einen Knoten daran, einen Dienst zu usurpieren oder sich außerhalb seiner Zone als MITM dazwischenzuschalten.",
  },
  D3: {
    nom: "Störung des Echtzeit-Ethernets (AVB/TSN)",
    resume:
      "Die Synchronisierung oder Priorisierung der Echtzeitflüsse des eingebetteten Ethernets zerstören.",
    principe:
      "AVB/TSN garantiert die rechtzeitige Zustellung kritischer Flüsse (ADAS-Video, Audio) über eine gemeinsame Uhr (gPTP) und Bandbreitenreservierung. Das Verfälschen der Uhr oder die Überlastung einer Verkehrsklasse beeinträchtigt diese Garantien.",
    pourquoi:
      "Die Echtzeitgarantien beruhen auf dem Vertrauen in den Uhren-Master und in die Reservierung. Ein böswilliger Knoten, der sich zum gPTP-Master erklärt oder eine prioritäre Klasse überflutet, lässt die kritischen Flüsse ihre Fristen verpassen.",
    methode: [
      "Den gPTP-Uhren-Master usurpieren, oder",
      "Eine prioritäre Verkehrsklasse überlasten",
      "Die abhängigen Echtzeitflüsse beeinträchtigen (Wahrnehmung, Anzeige)",
    ],
    prerequis: ["Zugang zum eingebetteten Ethernet-Netz"],
    effet:
      "Die Echtzeitflüsse verpassen ihre Fristen: ruckelndes Video, verspätete Daten.",
    remediations: [
      "Authentifizierung des Uhren-Masters",
      "VLAN-Isolation und Zulassungskontrolle der Flüsse",
      "Überwachung der TSN-Metriken",
    ],
    annexe5: "Familie 2 (Verfügbarkeit und zeitliche Integrität).",
    outils: ["Echtzeit-Netzwerkzeuge (Forschung)"],
    casReel: "Spezifische Fläche der neueren Echtzeit-Ethernet-Architekturen.",
    verdictPass:
      "Ohne Segmentierung und Zulassungskontrolle beeinträchtigt ein Knoten die Echtzeitgarantien.",
    verdictBlock:
      "Die Segmentierung (VLAN, Zulassungskontrolle, authentifizierter Uhren-Master) schottet den Knoten ab und schützt die kritischen Flüsse.",
  },
  D4: {
    nom: "Usurpation von V2X-Nachrichten",
    resume:
      "Falsche Vehicle-to-Everything-Nachrichten (V2X) senden, um die Wahrnehmung oder die Fahrassistenz zu täuschen.",
    principe:
      "V2X (802.11p / C-V2X) lässt Fahrzeuge Position und Warnungen austauschen. Falsche Nachrichten (Geisterfahrzeug, falsche Notbremsung) können die darauf vertrauenden Funktionen in die Irre führen.",
    pourquoi:
      "V2X stützt sich auf eine Zertifikatsinfrastruktur (SCMS), um die Sender zu authentifizieren. Ist die Zertifikatsvalidierung schwach oder umgangen, wird eine gefälschte Nachricht glaubwürdig. Das GNSS wiederum lässt sich ebenfalls täuschen (GPS-Spoofing).",
    methode: [
      "Gefälschte V2X-Nachrichten senden (Position, Warnung)",
      "Oder das GNSS täuschen, um die wahrgenommene Position zu verfälschen",
      "Eine unzureichende Zertifikatsvalidierung ausnutzen",
    ],
    prerequis: ["V2X- oder GNSS-Funksender", "Schwache Zertifikatsvalidierung"],
    effet:
      "Ein falsches Fahrzeug oder eine falsche Warnung erscheint in der Wahrnehmung / Fahrassistenz.",
    remediations: [
      "Strenge Validierung der V2X-Zertifikate (SCMS)",
      "Multisensorfusion (nicht allein auf V2X/GNSS vertrauen)",
      "Erkennung von GNSS-Inkohärenzen",
    ],
    annexe5: "Familien 2 und 5.",
    outils: ["SDR (Forschung)", "Referenz: GPS-Spoofing Regulus/Tesla 2019"],
    casReel:
      "Regulus täuschte das GPS eines Tesla im Autopilot-Modus (2019) und löste unaufgeforderte Manöver aus.",
    verdictPass:
      "Ohne strenge Validierung wird die gefälschte V2X-Nachricht akzeptiert und täuscht die Wahrnehmung.",
    verdictBlock:
      "Die Härtung (SCMS-Validierung, Multisensorfusion) weist nicht authentifizierte Nachrichten ab und gleicht die Quellen ab.",
  },

  // ---------------------------------------------------------------- Schicht E
  E1: {
    nom: "Zugang über Debug-Port (JTAG / SWD)",
    resume:
      "Einen zugänglich gelassenen Debug-Port nutzen, um die Kontrolle über ein Steuergerät zu übernehmen.",
    principe:
      "JTAG/SWD geben die vollständige Kontrolle über den Mikrocontroller: Lesen/Schreiben des Speichers, Anhalten, Einzelschritt. In Serie aktiv gelassen, öffnen sie die Tür zur Extraktion und Veränderung.",
    pourquoi:
      "Diese Schnittstellen existieren für Entwicklung und Produktion. Werden sie vor der Serienfertigung nicht deaktiviert oder verriegelt, bleiben sie ein Zugang auf Herstellerebene, der jedem offensteht, der das Gehäuse öffnet.",
    methode: [
      "Die Testpunkte des Debug-Ports auf der Platine lokalisieren",
      "Sich mit einer Sonde verbinden",
      "Speicher und Ausführungsfluss lesen/verändern",
    ],
    prerequis: ["Physischer Zugang zum Steuergerät", "Eine Debug-Sonde"],
    effet:
      "Das Steuergerät steht vollständig unter Kontrolle: Code und Geheimnisse liegen offen.",
    remediations: [
      "Deaktivierung oder Verriegelung der Debug-Ports in der Produktion",
      "Sicherungsbits (Lifecycle des Bausteins)",
      "Erkennung der Gehäuseöffnung",
    ],
    annexe5: "Familien 6 und 7.",
    outils: ["JTAG/SWD-Sonden (Hardware-Forschung)"],
    casReel: "Häufiger Ausgangspunkt der Hardware-Analyse eines Steuergeräts.",
    verdictPass:
      "Aktiv gelassener Debug-Port: vollständiger Zugang zum Steuergerät.",
    verdictBlock:
      "Die Härtung (verriegeltes Debugging, Sicherungsbits) macht den Port in Serie unbrauchbar.",
  },
  E2: {
    nom: "Firmware-Extraktion (Speicher-Dump)",
    resume:
      "Die Firmware eines Steuergeräts auslesen, um sie zu analysieren und Schlüssel sowie Schwachstellen zu finden.",
    principe:
      "Durch das Auslesen des Speichers (per Debugging oder direkt am Chip) erhält man die Firmware. Ihre Analyse offenbart Seed/Key-Algorithmen, Schlüssel und über alle Exemplare hinweg wiederverwendbare Schwachstellen.",
    pourquoi:
      "Eine einmal extrahierte Firmware dient gegen den gesamten Bestand: Sie legt die gemeinsamen Geheimnisse offen (Algorithmen, Serienschlüssel) und erlaubt die Vorbereitung logischer Angriffe offline, ohne Versuchsbegrenzung.",
    methode: [
      "Den Speicher über den Debug-Port auslesen oder den Chip entnehmen/auslesen (Chip-off)",
      "Die Firmware rekonstruieren und disassemblieren",
      "Daraus Algorithmen, Schlüssel und Schwachstellen gewinnen",
    ],
    prerequis: [
      "Physischer Zugang zum Steuergerät",
      "Fehlender oder umgangener Leseschutz",
    ],
    effet: "Der Inhalt des Steuergeräts wird für die Offline-Analyse exfiltriert.",
    remediations: [
      "Leseschutz des Speichers (Readout Protection)",
      "Firmware-Verschlüsselung und Geheimnisse im HSM",
      "Verriegelung des Baustein-Lebenszyklus",
    ],
    annexe5: "Familien 6 und 7.",
    outils: ["Speicherprogrammierer, Chip-Auslesung (Hardware-Forschung)"],
    casReel:
      "Klassische Voraussetzung für das Reverse Engineering der Seed/Key-Algorithmen (siehe B1).",
    verdictPass:
      "Ohne Leseschutz wird der Speicher ausgelesen und gibt seine Geheimnisse preis.",
    verdictBlock:
      "Die Härtung (Readout Protection, verschlüsselte Firmware, Schlüssel im HSM) macht die Extraktion erfolglos.",
  },
  E3: {
    nom: "Umgehung von Secure Boot durch Fault Injection",
    resume:
      "Das Steuergerät im richtigen Moment kurz stören, um die Signaturprüfung beim Start zu überspringen.",
    principe:
      "Die Fault Injection (Spannungs- oder Takt-Glitch) verursacht einen punktuellen Rechenfehler. Auf den Zeitpunkt der Signaturprüfung gerichtet, lässt sie einen Test bestehen, der hätte fehlschlagen müssen.",
    pourquoi:
      "Secure Boot beruht auf einem Vergleich zu einem präzisen Zeitpunkt. Ein Hardware-Fehler kann diesen einzelnen Test verfälschen (einen bedingten Sprung überspringen) und so die Ausführung einer nicht signierten Firmware öffnen, selbst wenn die Kryptografie an sich korrekt ist.",
    methode: [
      "Den Zeitpunkt der Signaturprüfung identifizieren",
      "Zu diesem präzisen Zeitpunkt einen Fehler injizieren (Spannung/Takt)",
      "Eine nicht signierte Firmware zur Ausführung bringen",
    ],
    prerequis: [
      "Physischer Zugang",
      "Fault-Injection-Hardware und Feinabstimmung des Timings",
    ],
    effet: "Der sichere Start wird umgangen; nicht signierter Code wird ausgeführt.",
    remediations: [
      "Anti-Glitch-Gegenmaßnahmen (Doppelprüfung, Detektoren)",
      "Redundante und randomisierte Prüfungen",
      "Spannungs-/Taktsensoren",
    ],
    annexe5: "Familien 6 und 7.",
    outils: ["Fault-Injection-Plattformen (Forschung, z. B. ChipWhisperer)"],
    casReel:
      "Bewährte Technik der Hardware-Sicherheit, angewandt auf eingebettete Steuergeräte.",
    verdictPass:
      "Ohne Anti-Fault-Gegenmaßnahme lässt der Glitch die Prüfung überspringen und nicht signierter Code wird ausgeführt.",
    verdictBlock:
      "Die Härtung (Doppelprüfung, Glitch-Detektoren) macht die Fault Injection unzuverlässig und bewahrt Secure Boot.",
  },
  E4: {
    nom: "Blockieren des Ladevorgangs (ISO 15118 / CCS)",
    resume:
      "Das Schnellladen eines Elektrofahrzeugs aus der Ferne unterbrechen, indem man seine Kommunikation mit der Ladesäule stört.",
    principe:
      "Beim CCS-Schnellladen kommunizieren Fahrzeug und Ladesäule über Powerline (HomePlug Green PHY) gemäß ISO 15118. Ein drahtloses Störsignal genügt, um diesen Dialog zu unterbrechen und das Laden zu stoppen.",
    pourquoi:
      "Die physische Kommunikationsschicht strahlt ab und ist nicht gegen Störungen geschützt. Der Angriff zielt auf das Signal selbst, nicht auf die Kryptografie: Das Unterbrechen des Gesprächs genügt, um das Laden zu stoppen, aus der Ferne und berührungslos.",
    methode: [
      "Ein Störsignal auf dem Band der Powerline senden",
      "Die Kommunikation Fahrzeug <-> Ladesäule unterbrechen",
      "Die Störung aufrechterhalten, um die Wiederaufnahme zu verhindern",
    ],
    prerequis: ["Nähe zu einem ladenden Fahrzeug", "Ein geeigneter Funksender"],
    effet: "Die Ladesitzung wird unterbrochen; das Laden wird unverfügbar.",
    remediations: [
      "Abschirmung und Robustheit der physischen Schicht",
      "Störungserkennung und automatische Wiederaufnahme",
      "Notfall-Kommunikation",
    ],
    annexe5: "Familie 2 (Verfügbarkeit), Lade-Ökosystem.",
    outils: ["SDR (Forschung), Referenz: Brokenwire 2022"],
    casReel:
      "Brokenwire (2022, Oxford / armasuisse): Abbruch des CCS-Ladens über mehrere Meter durch bloße drahtlose Störung.",
    verdictPass:
      "Angriff auf die physische Funkschicht: Die Gegenmaßnahmen des Modells (SecOC, Segmentierung, logische Härtung) ändern daran nichts. Es braucht eine Abwehr auf Seite der Störfestigkeit.",
    verdictBlock: "",
  },
};
