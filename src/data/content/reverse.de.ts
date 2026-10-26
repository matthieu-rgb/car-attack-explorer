import type { ReverseContent } from "../reverse";

export const reverseDe: ReverseContent | null = {
  title: "Einen Frame zerlegen und fälschen",
  lede:
    "Die eigentliche Arbeit: von einem unlesbaren Bus ausgehen, das Byte finden, das eine Funktion steuert, und dann den Frame bauen, der sie auslöst. Zwei Werkstätten, um die Methode in Aktion zu sehen.",

  s1Title: "Zerlegen: das richtige Byte finden",
  s1Intro: [
    "Am Bus angeschlossen sieht man Tausende Frames pro Sekunde, alle anonym. Keiner sagt „ich bin die Geschwindigkeit“. Die Methode ist die eines Detektivs: eine bekannte Aktion auslösen und beobachten, was sich ändert.",
    "Genau darin liegt der Nutzen von cansniffer: Er gruppiert die Frames nach Identifier und hebt die Bytes hervor, die sich bewegen. Man friert den Ruhezustand ein, handelt am Fahrzeug und vergleicht vorher mit nachher.",
  ],
  snifferTitle: "Finden Sie das Byte, das reagiert",
  snifferHint: "Lösen Sie eine Aktion aus und beobachten Sie, welcher Frame sich ändert. Aktivieren Sie „isolieren“, um den Hintergrundverkehr auszublenden.",
  snifferDiffLabel: "Die Änderung isolieren",
  snifferActionLabels: {
    turn: "Blinker links",
    unlock: "Türen entriegeln",
    accel: "Beschleunigen",
  },
  snifferNotes: {
    turn: "0x188 — Byte 0: 0x00 → 0x01. Bit 0 steuert den linken Blinker.",
    unlock: "0x19B — Byte 2: 0x0F → 0x00. Alle vier Schlösser öffnen sich auf einmal.",
    accel: "0x244 — Bytes 3-4: 0x189C → 0x2EE0. Die Geschwindigkeit steigt auf 120 km/h.",
  },
  snifferIdle: "Im Ruhezustand läuft alles durch. Lösen Sie eine Aktion aus, um zu sehen, welcher Frame darauf antwortet.",
  s1Steps: [
    "Den Verkehr im Ruhezustand aufzeichnen: candump -l vcan0 schreibt alles in eine Datei.",
    "Eine einzelne, wiederholte Aktion auslösen: verriegeln, blinken, beschleunigen.",
    "Vorher / nachher vergleichen: der Identifier und das Byte, die sich ändern, verraten die Funktion.",
    "Eingrenzen: diesen Identifier filtern, das Byte isolieren, dann das Bit oder den nutzbaren Bereich.",
    "Die Skala ableiten: die reale Größe variieren lassen und den Zusammenhang notieren (Faktor, Offset, Byte-Reihenfolge).",
  ],
  s1Cmd: {
    caption: "Aufzeichnen und dann beobachten",
    lines: [
      "candump -l vcan0            # schreibt in candump-*.log",
      "cansniffer -c vcan0         # gruppierte Ansicht, wechselnde Bytes farbig",
    ],
  },
  s1Close:
    "Sobald Identifier, Byte und Skala bekannt sind, haben Sie das Mapping — genau das, womit das Decoder-Werkzeug arbeitet.",
  ctaDecode: "Ein Signal decodieren",

  s2Title: "Fälschen: bauen und injizieren",
  s2Intro: [
    "Das Mapping zu kennen reicht nicht: Man muss den Frame schreiben und ihn senden. Fälschen heißt, einen Identifier und Bytes zu konstruieren und sie dann auf den Bus zu schicken.",
    "Die Falle: Das echte Steuergerät ist nicht verschwunden. Es sendet weiterhin den korrekten Wert. Ihr Frame und seiner streiten sich um das Kombiinstrument — wer am häufigsten sendet, gewinnt. Ein einzelner Frame erzeugt nur ein kurzes Aufblinken.",
  ],
  injectTitle: "Das Wettrennen der Injektion",
  injectHint: "Erhöhen Sie die Injektionsrate und beobachten Sie, wie der Zähler umkippt. Aktivieren Sie SecOC, um die Verteidigung zu sehen.",
  injectCadence: "Injektionsrate",
  injectReadout: "Das Kombiinstrument zeigt",
  injectSecoc: "SecOC",
  injectSecocMsg: "Gefälschter Frame abgewiesen: ungültiger Authentifizierungscode.",
  injectNote:
    "Bei niedriger Rate setzt sich der echte Wert wieder durch: Man muss schneller senden als das Steuergerät. SecOC weist Frames ohne gültigen Code ab, und die Täuschung scheitert.",
  s2Cmd: {
    caption: "Fälschen und wiedereinspielen",
    lines: [
      "cansend vcan0 244#000000002EE00000          # ein Frame: 120 km/h",
      "while true; do cansend vcan0 244#000000002EE00000; done   # hämmern, um zu gewinnen",
      "canplayer -I candump-xxx.log                # eine Aufzeichnung identisch wiedereinspielen",
    ],
  },
  s2Steps: [
    "Den Frame bauen: Identifier#Daten in Hex, mit cansend.",
    "In einer Schleife senden, schneller als das legitime Steuergerät, um die Arbitrierung zu gewinnen.",
    "Oder eine Aufzeichnung wiedereinspielen: auch ohne die Bytes zu verstehen, reicht ein Replay oft aus.",
  ],
  s2Def:
    "Hier ändert SecOC alles: Jeder Frame trägt einen Authentifizierungscode und einen Frische-Zähler. Ein gefälschter oder wiedereingespielter Frame hat nicht den richtigen Code, der Empfänger ignoriert ihn. Die Segmentierung durch das Gateway wiederum verhindert, dass der kritische Bereich von einem exponierten Eingang aus erreicht wird.",
  ctaAttacks: "Die Angriffe ansehen",
};
