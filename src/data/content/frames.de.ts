import type { FramesOverride } from "../frames";

// Deutsche Uebersetzung der Decoder-Rezepte und Beispiele. FR-Repli solange leer.
export const framesText: FramesOverride = {
  recipes: {
    speed: {
      name: "Fahrzeuggeschwindigkeit",
      note: "Byte 0 = Geschwindigkeit in km/h. 0x3F ist 63. Erhoeht man es auf 0xFF, wuerde der Tacho 255 km/h anzeigen.",
    },
    rpm: {
      name: "Motordrehzahl",
      note: "Byte 0-1 = Drehzahl (0x1B58 = 7000). Das Kombiinstrument wuerde die Nadel in den roten Bereich schicken.",
    },
    blink: {
      name: "Blinker",
      note: "Byte 3: 0x01 Blinker links, 0x02 rechts. Setze 0x03, um beide einzuschalten (Warnblinker).",
    },
    lock: {
      name: "Tuerverriegelung",
      note: "Byte 2: 0x01 verriegelt, 0x02 entriegelt. Das Entriegelungs-Trame nachzuspielen oeffnet die Tueren.",
    },
  },
  examples: {
    "speed-spoof": {
      title: "Spoofing der Geschwindigkeit",
      context: "Ein Steuergeraet speist eine falsche Geschwindigkeit ein, waehrend das Fahrzeug faehrt.",
      effect: "Das Kombiinstrument zeigt 0 km/h an, obwohl das Auto faehrt. Die Funktionen, die von der Geschwindigkeit abhaengen (automatische Verriegelung, Fahrassistenten), werden getaeuscht.",
    },
    "replay-unlock": {
      title: "Nachspielen der Entriegelung",
      context: "Ein mitgeschnittenes Entriegelungs-Trame wird unveraendert erneut gesendet.",
      effect: "Kein Byte aendert sich, und genau das ist das Problem: das Steuergeraet unterscheidet ein Nachspielen nicht von einem legitimen Befehl. Die Tueren oeffnen sich.",
    },
    "blink-inject": {
      title: "Injektion: Warnblinker",
      context: "Ein gefaelschtes Trame schaltet beide Blinker gleichzeitig ein.",
      effect: "Byte 3 wechselt auf 0x03: beide Blinker leuchten. Ein einziges Trame genuegt, um ein sichtbares Verhalten auszuloesen.",
    },
    dos: {
      title: "Dienstverweigerung durch Prioritaet",
      context: "Ein Knoten sendet unablaessig die Kennung mit der hoechsten Prioritaet.",
      effect: "Indem er die Arbitrierung mit der Kennung 0 monopolisiert, hindert der Angreifer jedes andere Trame am Durchkommen. Das Netz friert ein: keine Software-Gegenmassnahme verhindert das wirklich.",
    },
  },
};
