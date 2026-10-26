import type { FramesOverride } from "../frames";

export const framesText: FramesOverride = {
  signals: {
    speed: {
      name: "Vehicle speed",
      help: "The speed spans two bytes (3 and 4), stored most significant first. The instrument cluster displays this value directly: whoever rewrites these bytes makes the speedometer lie.",
    },
    rpm: {
      name: "Engine speed",
      help: "Two bytes form the engine speed, but you have to divide by four: the bytes are not the number of revolutions. Past 7000, the needle enters the red zone.",
      unit: "rpm",
    },
    turn: {
      name: "Turn signals",
      help: "Here one byte acts as a set of switches: bit 0 on the left, bit 1 on the right. Both together give the hazard lights. A single forged frame is enough to turn them on.",
      bits: ["Left", "Right"],
    },
    doors: {
      name: "Door locks",
      help: "Four locks in a single byte, one bit per door, a bit set to 1 meaning locked. Replaying the unlock frame opens the vehicle without any key.",
      bits: ["Front left", "Front right", "Rear left", "Rear right"],
    },
    temp: {
      name: "Engine temperature",
      help: "A single byte, but with an offset of -40: the displayed value equals the byte minus 40, which makes it possible to encode negative temperatures. Faking this value can hide an overheat.",
    },
    fuel: {
      name: "Fuel level",
      help: "A byte from 0 to 255 rescaled from 0 to 100 %. Spoofing this gauge directly deceives the driver without touching the engine.",
    },
  },
  examples: {
    "speed-spoof": {
      title: "Speed spoofing",
      context: "An ECU injects a false speed while the vehicle is moving.",
      effect: "Bytes 3-4 go from 0x189C (63 km/h) to zero. The instrument cluster shows 0 km/h while the car is moving, and the functions that depend on speed are fooled.",
    },
    "replay-unlock": {
      title: "Unlock replay",
      context: "The door unlock frame, captured earlier, is resent unchanged.",
      effect: "Byte 2 goes from 0x0F (four doors locked) to 0x00. The ECU cannot tell a replay from a legitimate command: the doors open.",
    },
    hazard: {
      title: "Injection: hazard lights",
      context: "A forged frame turns on both turn signals at once.",
      effect: "Byte 0 becomes 0x03: bits 0 and 1 are set to 1, both turn signals light up. A single frame is enough to produce an effect visible from the outside.",
    },
    dos: {
      title: "Priority-based denial of service",
      context: "A node endlessly transmits the highest-priority identifier.",
      effect: "By monopolizing arbitration with identifier 0, the attacker prevents any other frame from getting through. The network freezes, and no software countermeasure really stops it.",
    },
  },
};
