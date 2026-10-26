import type { ReverseContent } from "../reverse";

export const reverseEn: ReverseContent | null = {
  title: "Dissect and forge a frame",
  lede:
    "The real work: start from an unreadable bus, find the byte that drives a function, then craft the frame that commands it. Two workshops to see the method in action.",

  s1Title: "Dissect: find the right byte",
  s1Intro: [
    "Hook up to the bus and you see thousands of frames per second, all anonymous. Not one says « I am the speed ». The method is a detective's: trigger a known action, and watch what changes.",
    "That is exactly what cansniffer is for: it groups frames by identifier and highlights the bytes that move. You freeze the idle state, act on the car, then compare before and after.",
  ],
  snifferTitle: "Spot the byte that reacts",
  snifferHint: "Trigger an action and watch which frame changes. Turn on « isolate » to hide the background traffic.",
  snifferDiffLabel: "Isolate the change",
  snifferActionLabels: {
    turn: "Left turn signal",
    unlock: "Unlock the doors",
    accel: "Accelerate",
  },
  snifferNotes: {
    turn: "0x188 — byte 0: 0x00 → 0x01. Bit 0 commands the left turn signal.",
    unlock: "0x19B — byte 2: 0x0F → 0x00. All four locks open at once.",
    accel: "0x244 — bytes 3-4: 0x189C → 0x2EE0. The speed climbs to 120 km/h.",
  },
  snifferIdle: "At idle, everything scrolls by. Trigger an action to see which frame responds to it.",
  s1Steps: [
    "Capture the traffic at idle: candump -l vcan0 records everything to a file.",
    "Trigger a single, repeated action: lock, flash the signal, accelerate.",
    "Compare before / after: the identifier and the byte that change give away the function.",
    "Narrow down: filter that identifier, isolate the byte, then the useful bit or range.",
    "Deduce the scale: vary the real-world quantity and note the relation (factor, offset, byte order).",
  ],
  s1Cmd: {
    caption: "Capture then observe",
    lines: [
      "candump -l vcan0            # records to candump-*.log",
      "cansniffer -c vcan0         # grouped view, changing bytes in color",
    ],
  },
  s1Close:
    "Once the identifier, the byte and the scale are known, you have the mapping — exactly what the Decoder tool works with.",
  ctaDecode: "Decode a signal",

  s2Title: "Forge: build and inject",
  s2Intro: [
    "Knowing the mapping is not enough: you have to write the frame and send it. Forging means building an identifier and bytes, then emitting them onto the bus.",
    "The catch: the real ECU has not gone away. It keeps emitting the correct value. Your frame and its frame fight over the instrument cluster — whichever emits more often wins. A single frame only produces one flicker.",
  ],
  injectTitle: "The injection race",
  injectHint: "Raise the injection rate and watch the gauge flip over. Turn on SecOC to see the defense.",
  injectCadence: "Injection rate",
  injectReadout: "The cluster displays",
  injectSecoc: "SecOC",
  injectSecocMsg: "Forged frame rejected: invalid authentication code.",
  injectNote:
    "At a low rate, the real value takes over again: you have to emit faster than the ECU. SecOC rejects frames without a valid code, and the spoofing fails.",
  s2Cmd: {
    caption: "Forge and replay",
    lines: [
      "cansend vcan0 244#000000002EE00000          # one frame: 120 km/h",
      "while true; do cansend vcan0 244#000000002EE00000; done   # hammer it to win",
      "canplayer -I candump-xxx.log                # replay a capture verbatim",
    ],
  },
  s2Steps: [
    "Build the frame: identifier#data in hex, with cansend.",
    "Emit in a loop, faster than the legitimate ECU, to win the arbitration.",
    "Or replay a capture: even without understanding the bytes, a replay is often enough.",
  ],
  s2Def:
    "This is where SecOC changes everything: each frame carries an authentication code and a freshness counter. A forged or replayed frame does not have the right code, and the receiver ignores it. Segmentation by the gateway, for its part, prevents reaching the critical domain from an exposed entry point.",
  ctaAttacks: "See the attacks",
};
