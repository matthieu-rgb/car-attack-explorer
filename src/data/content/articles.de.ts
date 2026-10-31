import type { Article } from "../articles";

// Deutsche Uebersetzung der Rubrik "Analysen". Spiegelt articles.ts (slugs,
// Reihenfolge, Abschnitts-ids und Blocktypen) vollstaendig wider.
// Konvention des Projekts: Text in ASCII translitteriert (ae/oe/ue/ss).

// --- Schemata (gleiches SVG-Markup wie FR, nur sichtbarer Text uebersetzt). --

const SVG_TESLA_TIMING_DE = `<svg viewBox="0 0 640 248" role="img" aria-label="Zeitdiagramm: der Spannungseinbruch ist auf den Signaturvergleich getimt">
  <text x="0" y="16" font-size="12" class="dg-faint">AUSFUEHRUNG IM ROM (Zeit -&gt;)</text>
  <rect x="0" y="28" width="640" height="36" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="16" y="51" font-size="12" class="dg-soft">liest die naechste Stufe</text>
  <rect x="244" y="26" width="156" height="40" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="322" y="51" text-anchor="middle" font-size="12">vergleicht die Signatur</text>
  <text x="470" y="51" font-size="12" class="dg-soft">startet die Stufe</text>
  <text x="0" y="108" font-size="12" class="dg-faint">KERNSPANNUNG (Vcore)</text>
  <path d="M0 156 H286 L300 156 L309 212 L329 212 L338 156 H640" fill="none" stroke="var(--ok)" stroke-width="2.5"/>
  <path d="M300 156 L309 212 L329 212 L338 156" fill="none" stroke="var(--attack)" stroke-width="3"/>
  <line x1="322" y1="66" x2="322" y2="150" stroke="var(--attack)" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="348" y="200" font-size="11" fill="var(--attack)">Einbruch ~40 ns</text>
  <text x="0" y="240" font-size="12.5">Instruktion uebersprungen: der Vergleich liefert <tspan fill="var(--attack)">"gueltig"</tspan>, nicht signierter Code wird akzeptiert.</text>
</svg>`;

const SVG_TESLA_SVI2_DE = `<svg viewBox="0 0 640 236" role="img" aria-label="Aufbau: ein Mikrocontroller injiziert auf den SVI2-Bus zwischen Prozessor und Spannungsregler">
  <rect x="16" y="40" width="210" height="122" rx="9" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="121" y="64" text-anchor="middle" font-size="13">SoC AMD Ryzen</text>
  <rect x="42" y="82" width="158" height="58" rx="7" fill="none" stroke="var(--powertrain)" stroke-width="2"/>
  <text x="121" y="106" text-anchor="middle" font-size="12.5" fill="var(--powertrain)">ASP / PSP</text>
  <text x="121" y="125" text-anchor="middle" font-size="10.5" class="dg-faint">Vertrauenswurzel</text>
  <rect x="438" y="58" width="186" height="86" rx="9" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="531" y="92" text-anchor="middle" font-size="13">Regler</text>
  <text x="531" y="114" text-anchor="middle" font-size="11" class="dg-faint">liefert Vcore</text>
  <line x1="226" y1="101" x2="438" y2="101" stroke="var(--accent)" stroke-width="2.5"/>
  <text x="332" y="92" text-anchor="middle" font-size="12.5" fill="var(--accent)" class="dg-mono">SVI2</text>
  <text x="332" y="120" text-anchor="middle" font-size="10.5" class="dg-faint">Spannungsbefehl</text>
  <line x1="332" y1="101" x2="332" y2="176" stroke="var(--attack)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="246" y="176" width="172" height="52" rx="7" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="332" y="199" text-anchor="middle" font-size="12" fill="var(--attack)">Mikrocontroller (~100 $)</text>
  <text x="332" y="217" text-anchor="middle" font-size="10.5" fill="var(--attack)">injiziert einen Einbruchbefehl</text>
</svg>`;

const SVG_TESLA_BOOT_DE = `<svg viewBox="0 0 540 324" role="img" aria-label="Vertikale Startkette und Injektionspunkt des Glitches">
  <defs><marker id="ahT" markerWidth="9" markerHeight="9" refX="4.5" refY="7" orient="auto"><path d="M0 0 L4.5 7 L9 0" fill="none" stroke="var(--ink-faint)" stroke-width="1.5"/></marker></defs>
  <rect x="24" y="6" width="252" height="44" rx="7" fill="var(--surface-2)" stroke="var(--attack)" stroke-width="2"/>
  <text x="150" y="27" text-anchor="middle" font-size="12.5">Masken-ROM (ASP)</text>
  <text x="150" y="43" text-anchor="middle" font-size="10.5" class="dg-faint">in Silizium gebrannt, unveraenderlich</text>
  <line x1="150" y1="50" x2="150" y2="68" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <text x="292" y="56" font-size="11" class="dg-soft">prueft die Signatur der Stufe</text>
  <text x="292" y="70" font-size="11" fill="var(--attack)">GLITCH hier: Pruefung uebersprungen</text>
  <rect x="24" y="74" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="99" text-anchor="middle" font-size="12.5">PSP-Bootloader</text>
  <line x1="150" y1="114" x2="150" y2="132" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="138" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="163" text-anchor="middle" font-size="12.5">ABL (AMD-Lader)</text>
  <line x1="150" y1="178" x2="150" y2="196" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="202" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="227" text-anchor="middle" font-size="12.5">UEFI</text>
  <line x1="150" y1="242" x2="150" y2="260" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="266" width="252" height="44" rx="7" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="150" y="287" text-anchor="middle" font-size="12.5">Linux-Kernel</text>
  <text x="150" y="303" text-anchor="middle" font-size="10.5" fill="var(--ok)">Root-Shell, nicht signierter Code akzeptiert</text>
  <text x="292" y="289" font-size="11" class="dg-soft">gepatchte Firmware</text>
  <text x="292" y="303" font-size="11" class="dg-soft">rueckwaerts durch die Kette</text>
</svg>`;

const SVG_CAN_TOPO_DE = `<svg viewBox="0 0 640 232" role="img" aria-label="Topologie: Steuerbus, Gateway und Motorbus, mit dem Injektionspunkt am Scheinwerfer">
  <text x="30" y="20" font-size="11" class="dg-faint">STEUERBUS</text>
  <line x1="30" y1="70" x2="300" y2="70" stroke="var(--chassis)" stroke-width="3"/>
  <line x1="70" y1="70" x2="70" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="24" y="92" width="92" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="70" y="110" text-anchor="middle" font-size="11">Schluessel-</text>
  <text x="70" y="124" text-anchor="middle" font-size="11">empfaenger</text>
  <line x1="170" y1="70" x2="170" y2="92" stroke="var(--attack)" stroke-width="1.5"/>
  <rect x="126" y="92" width="88" height="40" rx="6" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="170" y="116" text-anchor="middle" font-size="11" fill="var(--attack)">Scheinwerfer</text>
  <line x1="262" y1="70" x2="262" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="222" y="92" width="76" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="260" y="116" text-anchor="middle" font-size="11">Tueren</text>
  <rect x="300" y="48" width="110" height="46" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="355" y="76" text-anchor="middle" font-size="12">Gateway</text>
  <text x="430" y="20" font-size="11" class="dg-faint">MOTORBUS</text>
  <line x1="410" y1="70" x2="620" y2="70" stroke="var(--powertrain)" stroke-width="3"/>
  <line x1="515" y1="70" x2="515" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="462" y="92" width="106" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="515" y="110" text-anchor="middle" font-size="11">Motor +</text>
  <text x="515" y="124" text-anchor="middle" font-size="11">Wegfahrsperre</text>
  <rect x="104" y="170" width="132" height="46" rx="7" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="170" y="190" text-anchor="middle" font-size="11.5" fill="var(--attack)">Injektor</text>
  <text x="170" y="206" text-anchor="middle" font-size="10" fill="var(--attack)">am Kabelbaum angeklemmt</text>
  <line x1="170" y1="132" x2="170" y2="170" stroke="var(--attack)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="300" y="112" font-size="10.5" class="dg-soft">leitet ungeprueft weiter -&gt;</text>
</svg>`;

const SVG_CAN_OVERRIDE_DE = `<svg viewBox="0 0 640 220" role="img" aria-label="Der Injektor haelt den Bus rezessiv, draengt den legitimen Knoten zurueck und erzwingt seinen Frame">
  <text x="152" y="18" font-size="11" class="dg-faint">Zeit -&gt;</text>
  <text x="0" y="48" font-size="11.5" class="dg-soft">Schluessel-</text>
  <text x="0" y="62" font-size="11.5" class="dg-soft">empfaenger</text>
  <rect x="150" y="34" width="110" height="34" rx="5" fill="var(--surface-2)" stroke="var(--ok)"/>
  <text x="205" y="55" text-anchor="middle" font-size="10.5">"kein Schluessel"</text>
  <rect x="272" y="34" width="86" height="34" rx="5" fill="none" stroke="var(--attack)"/>
  <text x="315" y="55" text-anchor="middle" font-size="10.5" fill="var(--attack)">Fehler</text>
  <line x1="370" y1="51" x2="632" y2="51" stroke="var(--ink-faint)" stroke-width="1.2" stroke-dasharray="5 5"/>
  <text x="500" y="47" text-anchor="middle" font-size="10.5" class="dg-faint">zieht sich zurueck, stumm (Fehlerbehandlung)</text>
  <text x="0" y="120" font-size="11.5" class="dg-soft">Injektor</text>
  <rect x="150" y="104" width="208" height="34" rx="5" fill="var(--surface-2)" stroke="var(--accent)"/>
  <text x="254" y="125" text-anchor="middle" font-size="10.5" fill="var(--accent)">haelt den Bus rezessiv (blockiert die anderen)</text>
  <rect x="372" y="104" width="160" height="34" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="452" y="125" text-anchor="middle" font-size="10.5" fill="var(--attack)">sendet "Schluessel gueltig"</text>
  <text x="0" y="188" font-size="11.5" class="dg-soft">Was das Netz</text>
  <text x="0" y="202" font-size="11.5" class="dg-soft">liest</text>
  <rect x="372" y="172" width="160" height="34" rx="5" fill="var(--surface-2)" stroke="var(--attack)" stroke-width="2"/>
  <text x="452" y="193" text-anchor="middle" font-size="10.5" fill="var(--attack)">"Schluessel gueltig" x20 / s</text>
  <line x1="452" y1="138" x2="452" y2="172" stroke="var(--attack)" stroke-width="1.2" stroke-dasharray="3 3"/>
</svg>`;

const SVG_CAN_SECOC_DE = `<svg viewBox="0 0 640 210" role="img" aria-label="Mit SecOC traegt ein Frame einen Authentifizierungscode und einen Frischezaehler; der gefaelschte Frame wird abgewiesen">
  <text x="0" y="20" font-size="11" class="dg-faint">AUTHENTIFIZIERTER FRAME (SecOC)</text>
  <rect x="0" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="75" y="50" text-anchor="middle" font-size="11" class="dg-mono">0x043</text>
  <text x="75" y="64" text-anchor="middle" font-size="10" class="dg-faint">Kennung</text>
  <rect x="158" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="233" y="50" text-anchor="middle" font-size="11">Daten</text>
  <text x="233" y="64" text-anchor="middle" font-size="10" class="dg-faint">"Schluessel gueltig"</text>
  <rect x="316" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="391" y="50" text-anchor="middle" font-size="11" fill="var(--ok)">MAC</text>
  <text x="391" y="64" text-anchor="middle" font-size="10" class="dg-faint">Authentifizierungscode</text>
  <rect x="474" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="549" y="50" text-anchor="middle" font-size="11" fill="var(--ok)">Zaehler</text>
  <text x="549" y="64" text-anchor="middle" font-size="10" class="dg-faint">Frische (Anti-Replay)</text>
  <text x="0" y="118" font-size="11" class="dg-faint">VOM INJEKTOR GEFAELSCHTER FRAME</text>
  <rect x="0" y="130" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="75" y="155" text-anchor="middle" font-size="11" class="dg-mono">0x043</text>
  <rect x="158" y="130" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="233" y="155" text-anchor="middle" font-size="11">Daten</text>
  <rect x="316" y="130" width="308" height="40" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="470" y="155" text-anchor="middle" font-size="11" fill="var(--attack)">MAC ungueltig (nicht der Schluessel) -&gt; Frame abgewiesen</text>
</svg>`;

export const articlesDe: Article[] = [
  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 14,
    vector: "hardware",
    tags: ["Fault Injection", "Secure Boot", "Vertrauenswurzel", "AMD", "SVI2", "Jailbreak"],
    title: "Tesla: ein Spannungsglitch, der die Vertrauenswurzel bricht",
    dek:
      "2023 bringen vier Forscher der TU Berlin den sicheren AMD-Prozessor eines Tesla zum Stolpern, indem sie seine Stromversorgung ueber den SVI2-Bus stoeren. Am Ende: beliebiger Code auf der Vertrauenswurzel, die Extraktion eines Identitaetsschluessels und ein Jailbreak, den Software nicht beheben kann.",
    fiche: {
      cible: "Tesla mit AMD-Ryzen-Infotainment (die MCU-Platine, genannt MCU-Z), in aktuellen Model 3, Y, S und X.",
      entree: "Ein physischer Zugang zur MCU-Platine, genau zum SVI2-Bus, der die Spannung des sicheren AMD-Prozessors (ASP) steuert.",
      methode:
        "Voltage Glitching: ein winziger Spannungseinbruch, getimt auf den Moment, in dem das ROM die Signatur der Firmware prueft, laesst diese Pruefung ausfallen.",
      faille: "Eine Vertrauenswurzel in maskiertem ROM, ohne Schutz gegen Fault Injection: im Feld gibt es nichts zu patchen.",
    },
    sections: [
      {
        id: "contexte",
        heading: "Die Vertrauenswurzel eines Tesla",
        blocks: [
          {
            t: "p",
            text: "Das Infotainment eines aktuellen Tesla laeuft auf einem AMD-Ryzen-x86-Prozessor. Sein gesamter Start wird von einem eigenen Baustein verriegelt, dem sicheren AMD-Prozessor (ASP, auch PSP genannt): beim Einschalten prueft er die Signatur jeder Softwarestufe, bevor er sie startet. Diese Kette ist die Vertrauenswurzel des Systems. Sie huetet drei Dinge: die Freischaltung kostenpflichtiger Optionen, den Schluessel, der die Identitaet des Autos gegenueber dem Tesla-Servicenetz beweist, und die Verschluesselung der Nutzerdaten.",
          },
          {
            t: "p",
            text: "Dieses Glied zu brechen heisst, alles auf einmal zu bekommen. Genau das hat ein Team der TU Berlin getan, in zwei Vortraegen: \"Jailbreaking an Electric Vehicle in 2023\" auf der Black Hat USA und \"Back in the Driver's Seat\" auf dem 37. Chaos Communication Congress.",
          },
          {
            t: "note",
            text:
              "Arbeit von Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob und Oleg Drokin (TU Berlin). Der Angriff nutzt einen frueheren AMD-Glitch wieder, \"One Glitch to Rule Them All\" (2021), an dem Jacob mitgewirkt hat.",
          },
        ],
      },
      {
        id: "glitch",
        heading: "Voltage Glitching, erklaert",
        blocks: [
          {
            t: "p",
            text: "Ein Prozessor setzt eine stabile Stromversorgung voraus. Laesst man sie sehr kurz einbrechen, um einige Dutzend Nanosekunden, genau in dem Moment, in dem er eine heikle Instruktion ausfuehrt, stolpert er: die Instruktion wird uebersprungen oder falsch ausgefuehrt. Genau auf den Vergleich gelegt, der eine Signatur bestaetigt, verwandelt dieser Fehler ein Scheitern in einen Erfolg.",
          },
          {
            t: "p",
            text: "Der wichtige Punkt: man greift nicht die Kryptografie an. Die RSA-Signatur bleibt robust; man hindert den Prozessor nur daran, sie zu pruefen. Der Vergleich \"ist die berechnete Signatur gleich der erwarteten?\" liefert \"ja\", obwohl er \"nein\" liefern muesste. Nicht signierter Code geht durch, als waere er legitim.",
          },
          {
            t: "svg",
            caption: "Der Spannungseinbruch ist auf die Vergleichsinstruktion getimt.",
            src: SVG_TESLA_TIMING_DE,
          },
          {
            t: "p",
            text: "Die ganze Schwierigkeit liegt im Timing. Man muss das kurze Fenster finden, in dem die Pruefung stattfindet, den Einbruch in diesem Moment ausloesen und so lange wiederholen, bis es passt. Das dauert, bis es sitzt; ist das Fenster erst bekannt, ist der Angriff reproduzierbar.",
          },
          {
            t: "note",
            text:
              "Der Glitch ist nicht persistent: er muss bei jedem Start erneut gespielt werden, um die Pruefung zu ueberwinden. Was man danach im System ablegt (Konfigurationsaenderungen), kann dagegen Neustarts ueberdauern.",
          },
        ],
      },
      {
        id: "svi2",
        heading: "Wohin schlagen: der SVI2-Bus",
        blocks: [
          {
            t: "p",
            text: "Wie laesst sich die Spannung eines Chips einbrechen, den man nicht oeffnet? Der Trick: der sichere Prozessor steuert seine Kernspannung selbst. Er tut das ueber einen kleinen seriellen Bus, den SVI2, der einen externen Spannungsregler (das VRM) auf der Platine ansteuert. Dieser Steuerbus ist zugaenglich, und genau dort klemmt sich der Angreifer an.",
          },
          {
            t: "p",
            text: "Ein Mikrocontroller fuer rund hundert Dollar, am SVI2 angeschlossen, injiziert einen gefaelschten Befehl, der dem Regler einen sehr kurzen Spannungseinbruch anordnet. Legt man diesen Einbruch auf das Pruefungsfenster, erhaelt man den gewollten Fehler, ohne je das Silizium des Prozessors zu beruehren.",
          },
          {
            t: "svg",
            caption: "Der Mikrocontroller injiziert auf den Spannungs-Steuerbus, zwischen ASP und Regler.",
            src: SVG_TESLA_SVI2_DE,
          },
          {
            t: "p",
            text: "Das ist der Kern von \"One Glitch to Rule Them All\" (Buhren u.a., 2021), den das Tesla-Team wiederverwendet: der Startcode im ROM laedt die naechste Stufe aus dem Flash-Speicher und prueft ihre RSA-Signatur; der Glitch trifft diese Pruefung; ein einziger geglueckter Fehler genuegt, damit das ROM vom Angreifer gewaehlten Code ausfuehrt.",
          },
        ],
      },
      {
        id: "chaine",
        heading: "Die Startkette und die gepatchte Firmware",
        blocks: [
          {
            t: "p",
            text: "Ist das ROM ueberwunden, bleiben alle weiteren Stufen zu verketten. Das Team patcht die Firmware rueckwaerts durch die Kette, von der letzten Stufe zur ersten. Problem: eine veraenderte Stufe hat nicht mehr den richtigen Hash, und die vorherige Stufe, die ihn prueft, wuerde ihren Start verweigern. Die Loesung ist, beides zu verbinden: der Glitch neutralisiert die Pruefung des ROM, was die gepatchte Kette bis zum Ende durchlaesst. Ergebnis: eine Root-Shell auf dem Linux des Infotainments.",
          },
          {
            t: "svg",
            caption: "Der Glitch bricht das erste Schloss; die gepatchte Firmware erledigt den Rest.",
            src: SVG_TESLA_BOOT_DE,
          },
          {
            t: "ol",
            items: [
              "Die MCU-Platine ausbauen, den SVI2-Bus und den Regler finden, der den Kern des sicheren Prozessors versorgt.",
              "Einen Mikrocontroller (etwa 100 $) an den SVI2 anschliessen, dazu ein Oszilloskop, um den Start zu beobachten.",
              "Das Fenster finden, in dem das ROM die Signatur der naechsten Stufe prueft.",
              "Einen Spannungseinbruch-Befehl injizieren, der auf diesen Vergleich getimt ist, und wiederholen, bis der Fehler passt.",
              "Die gepatchte Startstufe akzeptieren lassen: die Vertrauenswurzel fuehrt nun nicht signierten Code aus.",
              "Die gepatchte Kette (Bootloader, ABL, UEFI, Linux) bis zu einem persistenten Root-Zugang abrollen.",
              "Die chipgebundenen Geheimnisse extrahieren: den Identitaetsschluessel und die Schluessel, die die Daten verschluesseln.",
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
            head: ["Erlangte Faehigkeit", "Was das konkret bedeutet"],
            rows: [
              ["Persistenter Jailbreak", "Ein Root-Zugang auf dem Linux des Infotainments, der Neustarts und Updates ueberdauert."],
              ["Extraktion des Identitaetsschluessels", "Der hardwaregebundene Schluessel, der das Auto gegenueber dem Tesla-Netz authentifiziert: genug, um die Identitaet eines Fahrzeugs zu migrieren oder gar zu klonen."],
              ["Kostenpflichtige Optionen", "Sitzheizung, Beschleunigungsboost und andere per Software gesperrte Funktionen, ohne Bezahlung aktiviert (ein blosser Konfigurationsschalter, also persistent)."],
              ["Nutzerdaten", "Die Entschluesselung der vom System verschluesselten persoenlichen Daten: Adressbuch, Kalender, Standortverlauf, Service-Sitzungen."],
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "Die Ausruestung",
        blocks: [
          {
            t: "deflist",
            items: [
              { term: "Mikrocontroller am SVI2 (etwa 100 $)", def: "Ein Teensy oder aehnlich, am Spannungs-Steuerbus angeschlossen. Er faelscht den Einbruchbefehl. Das ist der Kern des Angriffs, und es kostet fast nichts." },
              { term: "Oszilloskop / Logikanalysator", def: "Um den Start zu beobachten und das Zeitfenster zu finden, in dem die Pruefung stattfindet." },
              { term: "Loetkolben und physischer Zugang", def: "Man muss die MCU-Platine oeffnen und sich an den SVI2 und die Versorgungsschiene anschliessen." },
              { term: "Stand der Technik", def: "Der AMD-Glitch aus 'One Glitch to Rule Them All' (2021), dann die Fortsetzung des Teams 2025, 'Three Glitches to Rule One Car' (ASIACCS), am Fahrassistenzrechner." },
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
              "Die Vertrauenswurzel setzt voraus, dass das ROM seine Pruefung immer anwendet. Fault Injection bricht diese Annahme: man greift nicht die Krypto an, man hindert den Prozessor daran, sie zu pruefen.",
              "Der Prozessor steuert seine Spannung selbst ueber den SVI2: dieser Steuerbus ist ein zugaenglicher Injektionspunkt auf der Platine.",
              "Der Startcode liegt in maskiertem ROM, in Silizium gebrannt: er ist per Update nicht korrigierbar.",
              "Der Chip erkennt keine Stromanomalien (kein Glitch-Detektor, keine Doppelpruefung): ein einziger Fehler genuegt.",
            ],
          },
        ],
      },
      {
        id: "patch",
        heading: "Warum es sich nicht beheben laesst",
        blocks: [
          {
            t: "p",
            text: "Der Startcode liegt in maskiertem ROM, also bei der Fertigung in Silizium gebrannt. Ein Software-Patch kann dort nichts hinzufuegen: es ist unmoeglich, eine Gegenmassnahme genau dort zu setzen, wo der Fehler zuschlaegt. Und da der Angriff die Kryptografie nicht bricht, sondern umgeht, aendert ein Verstaerken der Schluessel oder Signaturen nichts.",
          },
          {
            t: "p",
            text: "Die einzige echte Abwehr ist in Hardware: Silizium, das gegen Fault Injection gehaertet ist (Spannungs- und Taktdetektoren, Doppelpruefung, interne Spannungsrampen). Mit anderen Worten, den Chip ersetzen. Da AMD auch andere Hersteller beliefert, reicht die Problemklasse ueber Tesla hinaus. Serverseitig kann Tesla den Wert eines extrahierten Schluessels begrenzen, indem es die Reauthentifizierung der Fahrzeuge haertet (Zero-Trust-Ansatz).",
          },
          {
            t: "note",
            text:
              "2025 hat dasselbe Team mit 'Three Glitches to Rule One Car' (ASIACCS) nachgelegt und den Ansatz auf den Fahrassistenzrechner uebertragen.",
          },
        ],
      },
      {
        id: "portee",
        heading: "Reichweite und Grenzen",
        blocks: [
          {
            t: "p",
            text: "Das ist kein Massendiebstahl aus der Ferne: es braucht physischen Zugang, Hardware und Entwicklungszeit pro Exemplar. Aber in einem Punkt ist es schlimmer als ein Diebstahl: der Angriff bricht einen hardwarebasierten Vertrauensanker und erlaubt, die Identitaet eines Fahrzeugs zu klonen. Und da die Schwachstelle im Silizium liegt, laesst sie sich nicht per Software beheben.",
          },
        ],
      },
    ],
    sources: [
      { label: "Christian Werling (TU Berlin) : page de recherche et publications", url: "https://www.user.tu-berlin.de/cwerling/" },
      { label: "Mayhem Security : Jailbreaking Teslas at Black Hat USA 2023", url: "https://www.mayhem.security/blog/jailbreaking-teslas-at-black-hat-usa-2023" },
      { label: "VicOne : Tesla jailbreak via firmware patching and voltage glitching", url: "https://vicone.com/blog/tesla-jailbreak-unlocks-features-via-firmware-patching-and-voltage-glitching" },
      { label: "Hackaday : jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "One Glitch to Rule Them All : fault injection contre l'ASP AMD (arXiv)", url: "https://arxiv.org/abs/2108.04575" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 14,
    vector: "can",
    tags: ["CAN-Bus", "Frame-Injektion", "Arbitrierung", "Diebstahl ohne Schluessel", "Gateway", "SecOC"],
    title: "Diebstahl ueber den Scheinwerfer: Anatomie einer CAN-Injektion",
    dek:
      "2023 fuehren Ian Tabor und Ken Tindell den Diebstahl ihres RAV4 auf einen Scheinwerferdraht zurueck. Dahinter ein Angriff, der weder Schluessel noch OBD-Stecker braucht: den CAN-Bus zwingen, einem gefaelschten Frame zu glauben, indem der legitime Knoten zum Schweigen gebracht wird. Wir sezieren Mechanismus, Ausruestung und Abwehr.",
    fiche: {
      cible: "Toyota RAV4 und Dutzende Modelle (Lexus, Jeep, Nissan, VW, Maserati...), die von denselben Boxen angegriffen werden.",
      entree: "Der Kabelbaum des vorderen Scheinwerfers, ein Punkt des CAN-Steuerbusses, erreichbar durch Aufhebeln der Stossstange.",
      methode:
        "Eine Box erzwingt in Schleife einen Frame, der den Schluesselempfaenger vortaeuscht, und haelt dabei den Bus rezessiv, um den legitimen Knoten verstummen zu lassen; das Gateway leitet ihn ungeprueft weiter.",
      faille: "Der CAN authentifiziert keine Nachricht, und das Gateway leitet zwischen Domaenen weiter, ohne zu pruefen: ein gut geformter Frame wird aufs Wort geglaubt.",
    },
    sections: [
      {
        id: "contexte",
        heading: "Der Diebstahl, der alles dokumentiert hat",
        blocks: [
          {
            t: "p",
            text: "Der RAV4 von Ian Tabor wird zuerst vandaliert (Stossstange abgerissen, Scheinwerferstecker abgezogen), dann einige Tage spaeter gestohlen. Vor dem Diebstahl hatte das Auto Fehlercodes gespeichert, die einen Kommunikationsverlust mit dem Scheinwerfer-Steuergeraet und mit dem CAN-Netz meldeten. Mit Ken Tindell, technischem Leiter von Canis Automotive Labs, verfolgt Tabor die Spur bis zum Kabelbaum des vorderen Scheinwerfers und deckt eine Methode auf, die zu einer kleinen Industrie geworden ist.",
          },
          {
            t: "note",
            text:
              "Der Injektor wurde den Dieben schluesselfertig verkauft, versteckt in einem falschen Bluetooth-Lautsprecher mit Ausloeseknopf: ein Dutzend Dollar an Bauteilen, um ein Auto in etwa einer Minute zu stehlen.",
          },
        ],
      },
      {
        id: "architecture",
        heading: "Das Ziel: ein geschwaetziger Bus, null Authentifizierung",
        blocks: [
          {
            t: "p",
            text: "Ein Auto hat nicht einen CAN-Bus, sondern mehrere, verbunden durch ein zentrales Gateway. Auf dem Steuerbus laufen die Nachrichten des Schluesselempfaengers. Der vordere Scheinwerfer haengt an genau diesem Bus: seinen Stecker zu erreichen heisst, den Bus zu erreichen, der die Startfreigabe traegt. Das Grundproblem: auf einem CAN ist keine Nachricht signiert, und das Gateway kopiert manche Frames von einem Bus zum anderen, ohne sie zu pruefen.",
          },
          {
            t: "svg",
            caption: "Der Scheinwerfer teilt den Steuerbus mit dem Schluesselempfaenger; das Gateway leitet zum Motor weiter.",
            src: SVG_CAN_TOPO_DE,
          },
          {
            t: "duo",
            aTitle: "Was das Netz annimmt",
            a: [
              "Nur originale Steuergeraete sprechen auf dem Bus.",
              "Ein gut geformter Frame kommt zwangslaeufig von einem legitimen Knoten.",
              "Das Gateway leitet weiter, was zwischen Domaenen nuetzlich ist.",
            ],
            bTitle: "Was der Angreifer ausnutzt",
            b: [
              "Jeder Knoten, der an den Draht gelegt wird, kann senden.",
              "Nichts unterscheidet einen gefaelschten Frame von einem echten.",
              "Das Gateway leitet also auch den gefaelschten Frame weiter.",
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
            text: "Der feine Punkt: das echte Steuergeraet des Schluessels sendet weiter seine legitime Nachricht (\"kein Schluessel vorhanden\"). Es genuegt also nicht, einen Frame hinzuzufuegen, man muss den eigenen durchsetzen und den echten verstummen lassen.",
          },
          {
            t: "p",
            text: "Der CAN arbitriert Bit fuer Bit: ein dominantes Bit (0) ueberschreibt ein rezessives Bit (1), und die niedrigste Kennung gewinnt. Doch die Arbitrierung zu gewinnen genuegt nicht: ein Empfaenger, der eine Unstimmigkeit erkennt, kann den Frame durch ein Fehlerflag zerstoeren. Der Injektor muss also auch diesen Mechanismus neutralisieren.",
          },
          {
            t: "p",
            text: "Der Trick ist in Hardware. Die Box sendet zuerst in Schleife einen Weck-Frame, bis sie den Frame eines bereits erwachten Steuergeraets vorbeikommen sieht. Dann aktiviert sie einen modifizierten Transceiver, der den Bus im rezessiven Zustand haelt, was \"die anderen CAN-Knoten am Senden blockiert\". Die legitimen Steuergeraete, die es versuchen, scheitern, gehen in die Fehlerbehandlung und ziehen sich zurueck. Vor allem blockiert dieser Override auch das Fehlersignal, mit dem ein Empfaenger den gefaelschten Frame zerstoeren koennte.",
          },
          {
            t: "svg",
            caption: "Der Injektor haelt den Bus rezessiv, draengt den legitimen Knoten zurueck und erzwingt dann seinen Frame.",
            src: SVG_CAN_OVERRIDE_DE,
          },
          {
            t: "note",
            text:
              "Das unterscheidet die CAN-Injektion von einem simplen Replay: der Angreifer neutralisiert die echte Quelle und die Fehlererkennung, statt Rauschen darueber zu legen. Von Tindell angemerkte Nuance: wenn mehrere Empfaenger gleichzeitig quittieren, kann ihr kombinierter Strom den Override uebersteigen, doch der gefaelschte Frame geht trotzdem durch.",
          },
        ],
      },
      {
        id: "rafale",
        heading: "Die Salve mit 20 Hz und das Gateway",
        blocks: [
          {
            t: "p",
            text: "Warum den Frame rund zwanzigmal pro Sekunde wiederholen? Weil das Gateway fragil ist: wenn es nicht mehr kommunizieren kann (waehrend des Override), setzt sich sein CAN-Controller zurueck, und es verpasst Frames. Indem der Injektor die Salve mit etwa 20 Hz haemmert, stellt er sicher, dass mindestens einer durchkommt, sobald das Gateway wieder das Ohr oeffnet. Es leitet dann die Nachricht \"Schluessel gueltig\" an das Motornetz weiter, und die Wegfahrsperre deaktiviert sich.",
          },
          {
            t: "frame",
            caption: "Didaktische Illustration: die gefaelschte Salve (rot) inmitten des normalen Verkehrs. Fiktive Kennungen.",
            lines: [
              { text: "0x120  Motor         Drehzahl 820 U/min       normaler Frame", mark: "ok" },
              { text: "0x043  Schluesselempf 'kein Schluessel'        normaler Frame", mark: "ok" },
              { text: "0x043  INJIZIERT     'Schluessel gueltig' x20/s gefaelschte Salve", mark: "hl" },
              { text: "Gateway  leitet 0x043 ans Motornetz weiter, ungeprueft", mark: "hl" },
              { text: "Wegfahrsperre deaktiviert, Motor zum Start freigegeben", mark: "ok" },
            ],
          },
        ],
      },
      {
        id: "chaine",
        heading: "Die Ausbeutungskette, Schritt fuer Schritt",
        blocks: [
          {
            t: "ol",
            items: [
              "Stossstange oder Scheinwerfer aufhebeln, um die Draehte des Kabelbaums freizulegen.",
              "Sich an die zwei Draehte des Busses anklemmen, CAN-H und CAN-L.",
              "In Schleife einen Weck-Frame senden, bis das Netz antwortet.",
              "Den Override aktivieren: den Bus rezessiv halten, um die legitimen Knoten verstummen zu lassen und die Fehlererkennung zu blockieren.",
              "Die Salve senden (etwa zwanzigmal pro Sekunde), die den Schluesselempfaenger vortaeuscht: die Nachricht 'Schluessel gueltig'.",
              "Die Wegfahrsperre deaktiviert sich, weil sie den Schluessel fuer anwesend haelt.",
              "Das Gateway leitet den Frame ans Motornetz weiter, ohne ihn zu pruefen.",
              "Eine zweite Nachricht, ausgeloest durch den Knopf der Box, befiehlt das Entriegeln der Tueren.",
              "Der Dieb steigt ein und faehrt los: das Auto ist in etwa einer Minute weg, ohne Schluessel.",
            ],
          },
        ],
      },
      {
        id: "banc",
        heading: "Wie man es beobachtet und am Pruefstand nachspielt",
        blocks: [
          {
            t: "p",
            text: "Man braucht kein echtes Auto, um die Methode zu verstehen. Auf einem virtuellen Bus oder einem Pruefstand mit zwei Steuergeraeten ist das Vorgehen immer dasselbe: eine Aktion ausloesen, den Frame beobachten, der sich aendert, dann ihn nachspielen. Genau das bietet die Werkstatt dieser Seite. Die Befehle unten arbeiten auf einer Test-Schnittstelle (vcan0), nie an einem Fahrzeug.",
          },
          {
            t: "code",
            caption: "Beobachten, isolieren, nachspielen (am Pruefstand).",
            lines: [
              "# den gesamten Verkehr des Test-Busses mithoeren",
              "candump vcan0",
              "",
              "# den Frame finden, der sich bei einer Aktion bewegt (diff vorher / nachher)",
              "cansniffer vcan0",
              "",
              "# einen gefundenen Frame nachspielen (Kennung#Daten, Beispielwerte)",
              "cansend vcan0 043#01",
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "Die Ausruestung, auf beiden Seiten",
        blocks: [
          {
            t: "table",
            caption: "Die Box des Diebs kostet ein Dutzend Dollar; die Analyse laeuft mit oeffentlichen Werkzeugen.",
            head: ["Element", "Seite", "Wozu es dient"],
            rows: [
              ["Mikrocontroller PIC18F mit CAN", "Dieb", "Erzeugt und taktet die gefaelschten Frames; Firmware gegen Auslesen gesperrt."],
              ["Modifizierter Transceiver + Override-Schaltung", "Dieb", "Haelt den Bus rezessiv: laesst die anderen Knoten verstummen und blockiert das Fehlersignal."],
              ["Falscher Bluetooth-Lautsprecher", "Dieb", "Gehaeuse, Batterie und Knopf: tarnt den Injektor, versorgt und loest ihn aus."],
              ["CAN-Schnittstelle (CANable, CANtact...)", "Analyst", "Einen PC an den Bus anschliessen, um zu lesen und zu senden."],
              ["can-utils (candump, cansniffer, cansend)", "Analyst", "Frames erfassen, filtern und nachspielen."],
              ["SavvyCAN", "Analyst", "Aufzeichnungen visualisieren und vergleichen, das Nutzsignal wiederfinden."],
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
              "Der CAN authentifiziert keine Nachricht: ein Knoten, der Bits setzen kann, wird aufs Wort geglaubt.",
              "Das Gateway kopiert Frames zwischen Domaenen, ohne ihre Herkunft zu pruefen.",
              "Die Wegfahrsperre gruendet eine Sicherheitsentscheidung auf eine blosse Behauptung des Busses.",
              "Ein unkritisches Geraet (der Scheinwerfer) gibt Zugang zu einem kritischen Bus.",
              "Die Fehlererkennung selbst kann durch den Override neutralisiert werden: ein naiver Schutzwall genuegt nicht.",
            ],
          },
        ],
      },
      {
        id: "patch",
        heading: "Die Abwehr, und wo man sie hier testet",
        blocks: [
          {
            t: "p",
            text: "Schnelle, aber fragile Abwehr: das Gateway leitet einen Schluessel-Frame nur weiter, wenn seine eigenen juengsten Sendungen gelungen sind und unmittelbar davor kein Fehler von dominant nach rezessiv auftrat. Tindell fasst das mit Flemings Maxime: einmal ist Zufall, zweimal ist Koinzidenz, dreimal ist Feindhandlung. Ein Angreifer, der seine Box anpasst, kann sie umgehen.",
          },
          {
            t: "p",
            text: "Die grundlegende Antwort ist die Authentifizierung der Nachrichten. SecOC (AUTOSAR) fuegt jedem Frame einen Authentifizierungscode (MAC) und einen Frischezaehler hinzu: ein gefaelschter oder nachgespielter Frame wird abgewiesen. Canis treibt dieselbe Idee mit CryptoCAN voran (ein Paar verschluesselter Frames transportiert einen Klartext-Frame). Ein in Software emuliertes Sicherheitsmodul (SHE) passt in etwa 3 KB Code, 200 Byte RAM und 40 Mikrosekunden pro Nachricht: das ist fuer ein kleines Steuergeraet machbar.",
          },
          {
            t: "svg",
            caption: "Mit SecOC weisen der MAC und der Frischezaehler den gefaelschten Frame ab.",
            src: SVG_CAN_SECOC_DE,
          },
          {
            t: "p",
            text: "Die Segmentierung hilft ergaenzend, indem sie einen Knoten des vorderen Netzes daran hindert, direkt mit dem Motorsteuergeraet zu sprechen. Achtung: Erkennung allein genuegt hier nicht. Geraete wie NXP Stinger oder Canis CAN-HG zerstoeren einen gefaelschten Frame durch einen CAN-Fehler, doch der Override hindert eben jeden Knoten daran, diesen Fehler zu signalisieren.",
          },
          {
            t: "p",
            text: "Diese beiden Abwehrmassnahmen, SecOC und Segmentierung, sind Schalter, die Sie im Explorer aktivieren koennen, um den Angriffspfad blockiert zu sehen. Und die Methode ausloesen, beobachten, nachspielen laesst sich in der Werkstatt auf virtuellem Bus bedienen.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell : CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "CAN in Automation : The CAN Injection attack (Tindell, PDF)", url: "https://www.can-cia.org/fileadmin/cia/documents/publications/cnlm/june_2023/cnlm_23-2_p20_the_can_injection_attack_ken_tindel_canis_automotive_labs.pdf" },
      { label: "SecurityWeek : thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive : stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
      { label: "NVD : CVE-2023-29389", url: "https://nvd.nist.gov/vuln/detail/CVE-2023-29389" },
    ],
  },
];
