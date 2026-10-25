import type { Vehicle } from "./types";

// Plan vue de dessus, repere SVG viewBox 440 x 724 (front en haut).
// Les positions sont pedagogiques, pas les cotes d'un constructeur reel.
export const vehicle: Vehicle = {
  gateway: { x: 220, y: 390 },
  nodes: [
    { id: "ecm", label: "ECM", domain: "powertrain", x: 205, y: 150, side: "left" },
    { id: "tcm", label: "TCM", domain: "powertrain", x: 240, y: 150, side: "right" },
    { id: "adas", label: "ADAS", domain: "powertrain", x: 222, y: 234, side: "left" },
    { id: "abs", label: "ABS / ESP", domain: "chassis", x: 150, y: 205, side: "left" },
    { id: "srs", label: "SRS", domain: "chassis", x: 150, y: 330, side: "left" },
    { id: "ic", label: "Combine", domain: "bodyd", x: 290, y: 252, side: "right" },
    { id: "peps", label: "PEPS", domain: "bodyd", x: 290, y: 336, side: "right" },
    { id: "bcm", label: "BCM", domain: "bodyd", x: 290, y: 420, side: "right" },
    { id: "ivi", label: "IVI", domain: "info", x: 220, y: 468, side: "right" },
    { id: "tcu", label: "TCU", domain: "info", x: 220, y: 560, side: "right" },
  ],
  entries: [
    { id: "gnss", x: 220, y: 36, side: "right" },
    { id: "obd", x: 116, y: 272, side: "left" },
    { id: "debug", x: 112, y: 404, side: "left" },
    { id: "key", x: 340, y: 208, side: "right" },
    { id: "charge", x: 150, y: 470, side: "left" },
    { id: "usb", x: 262, y: 506, side: "left" },
    { id: "cell", x: 220, y: 622, side: "right" },
  ],
};
