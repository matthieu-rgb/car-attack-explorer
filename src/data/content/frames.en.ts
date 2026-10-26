import type { FramesOverride } from "../frames";

// English translation of the decoder recipes and examples. Keyed by id,
// hex values stay in frames.ts; only the wording is translated here.
export const framesText: FramesOverride = {
  recipes: {
    speed: {
      name: "Vehicle speed",
      note: "Byte 0 = speed in km/h. 0x3F is 63. Raise it to 0xFF and the cluster would read 255 km/h.",
    },
    rpm: {
      name: "Engine RPM",
      note: "Bytes 0-1 = RPM (0x1B58 = 7000). The cluster would send the needle into the red zone.",
    },
    blink: {
      name: "Turn signals",
      note: "Byte 3: 0x01 left signal, 0x02 right. Set 0x03 to light both at once (hazard lights).",
    },
    lock: {
      name: "Door locking",
      note: "Byte 2: 0x01 locks, 0x02 unlocks. Replaying the unlock frame opens the doors.",
    },
  },
  examples: {
    "speed-spoof": {
      title: "Speed spoofing",
      context: "An ECU injects a false speed while the vehicle is moving.",
      effect: "The cluster shows 0 km/h while the car is moving. Functions that depend on speed (automatic locking, driver assistance) are fooled.",
    },
    "replay-unlock": {
      title: "Unlock replay",
      context: "A captured unlock frame is sent back unchanged.",
      effect: "No byte changes, and that is precisely the problem: the ECU cannot tell a replay from a legitimate command. The doors open.",
    },
    "blink-inject": {
      title: "Injection: hazard lights",
      context: "A forged frame lights both turn signals at once.",
      effect: "Byte 3 goes to 0x03: both turn signals light up. A single frame is enough to trigger a visible behaviour.",
    },
    dos: {
      title: "Denial of service by priority",
      context: "A node endlessly emits the highest-priority identifier.",
      effect: "By monopolising arbitration with identifier 0, the attacker prevents any other frame from getting through. The network freezes: no software countermeasure truly prevents it.",
    },
  },
};
