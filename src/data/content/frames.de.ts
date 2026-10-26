import type { FramesOverride } from "../frames";

// Deutsche Uebersetzung der Decoder-Signale und -Szenarien. Franzoesisch ist kanonisch.
export const framesText: FramesOverride = {
  signals: {
    speed: {
      name: "Fahrzeuggeschwindigkeit",
      help: "Die Geschwindigkeit belegt zwei Bytes (3 und 4), hoeherwertiges Byte zuerst. Das Kombiinstrument zeigt diesen Wert direkt an: Wer diese Bytes ueberschreibt, laesst den Tacho luegen.",
    },
    rpm: {
      name: "Motordrehzahl",
      help: "Zwei Bytes bilden die Drehzahl, doch man muss durch vier teilen: Die Bytes sind nicht die Zahl der Umdrehungen. Ab 7000 taucht die Nadel in den roten Bereich.",
      unit: "rpm",
    },
    turn: {
      name: "Blinker",
      help: "Hier dient ein Byte als Satz von Schaltern: Bit 0 links, Bit 1 rechts. Beide zusammen ergeben die Warnblinkanlage. Eine einzige gefaelschte Frame genuegt zum Einschalten.",
      bits: ["Links", "Rechts"],
    },
    doors: {
      name: "Tuerverriegelung",
      help: "Vier Schloesser in einem einzigen Byte, ein Bit pro Tuer, wobei das Bit auf 1 verriegelt bedeutet. Das Wiederholen der Entriegelungs-Frame oeffnet das Fahrzeug ganz ohne Schluessel.",
      bits: ["Vorne links", "Vorne rechts", "Hinten links", "Hinten rechts"],
    },
    temp: {
      name: "Motortemperatur",
      help: "Ein einziges Byte, aber mit einem Versatz von -40: Der angezeigte Wert entspricht dem Byte minus 40, was die Codierung negativer Temperaturen erlaubt. Diesen Wert zu faelschen kann eine Ueberhitzung verbergen.",
    },
    fuel: {
      name: "Kraftstofffuellstand",
      help: "Ein Byte von 0 bis 255, umskaliert auf 0 bis 100 %. Diese Anzeige zu faelschen taeuscht unmittelbar den Fahrer, ohne den Motor zu beruehren.",
    },
  },
  examples: {
    "speed-spoof": {
      title: "Faelschung der Geschwindigkeit",
      context: "Ein Steuergeraet speist eine falsche Geschwindigkeit ein, waehrend das Fahrzeug faehrt.",
      effect: "Die Bytes 3-4 wechseln von 0x189C (63 km/h) auf null. Das Kombiinstrument zeigt 0 km/h, obwohl der Wagen faehrt, und die von der Geschwindigkeit abhaengigen Funktionen werden getaeuscht.",
    },
    "replay-unlock": {
      title: "Wiedereinspielung der Entriegelung",
      context: "Die aufgezeichnete Entriegelungs-Frame der Tueren wird unveraendert erneut gesendet.",
      effect: "Byte 2 wechselt von 0x0F (vier verriegelte Tueren) auf 0x00. Das Steuergeraet unterscheidet eine Wiedereinspielung nicht von einem legitimen Befehl: Die Tueren oeffnen sich.",
    },
    hazard: {
      title: "Injektion: Warnblinkanlage",
      context: "Eine gefaelschte Frame schaltet beide Blinker gleichzeitig ein.",
      effect: "Byte 0 wechselt auf 0x03: Die Bits 0 und 1 stehen auf 1, beide Blinker leuchten auf. Eine einzige Frame genuegt, um einen von aussen sichtbaren Effekt zu erzeugen.",
    },
    dos: {
      title: "Denial of Service durch Prioritaet",
      context: "Ein Knoten sendet unablaessig den hoechstprioren Identifier.",
      effect: "Indem der Angreifer die Arbitrierung mit dem Identifier 0 belegt, verhindert er, dass irgendeine andere Frame durchkommt. Das Netz erstarrt, und keine Software-Gegenmassnahme verhindert dies wirklich.",
    },
  },
};
