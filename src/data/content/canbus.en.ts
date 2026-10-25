import type { CanbusOverride } from "../canbus";

// English translation of the "CAN bus" page. Falls back to French while empty.
// Structure (section ids, block order) mirrors canbus.ts.
export const canbusText: CanbusOverride = {
  title: "The CAN bus",
  lede:
    "The network almost every attack eventually travels over. How it works, why it is so reliable, and why that very reliability makes it a target.",
  sections: {
    quoi: {
      heading: "A single wire for everyone",
      blocks: [
        "CAN stands for Controller Area Network. Bosch designed it in 1986 to link a car's electronic control units with a minimum of wiring. Before it, every function needed its own pair of wires; CAN replaces all of that with a single shared twisted pair, CAN-H and CAN-L, over which every ECU both talks and listens.",
        "Transmission is differential: the information is not an absolute voltage but the difference between the two wires. Electromagnetic noise from the engine hits both conductors the same way and cancels out. The typical bitrate is 500 kbit/s for high-speed CAN and 125 kbit/s for comfort functions, with a 120 ohm termination resistor at each end.",
        "CAN is multi-master and address-free. There is no sender and no recipient: each frame carries an identifier that describes its content (for example \"engine RPM\"), not a machine. Every ECU decides on its own which identifiers matter to it and ignores the rest.",
      ],
    },
    trame: {
      heading: "Anatomy of a frame",
      blocks: [
        "A standard data frame comes down to a handful of fields. For an attacker, two of them carry the weight: the identifier, which sets priority and meaning, and the data, up to eight bytes.",
        {
          caption: "CAN data frame (standard format, 11-bit identifier)",
          lines: [
            "SOF | IDENTIFIER 11 bits | RTR | IDE r0 | DLC | DATA 0-8 B | CRC | ACK | EOF",
            "  1 |        0x0C4         |  0  |       |  8  | 3F 00 ... 00  |     |     |    ",
          ],
        },
        [
          "SOF: a dominant bit that announces the start of frame and synchronises everyone.",
          "Identifier (11 or 29 bits): describes the content and drives arbitration. The lower it is, the higher the frame's priority.",
          "RTR: tells a request apart from an actual data transmission.",
          "DLC: the number of data bytes that follow, from 0 to 8.",
          "Data: the payload, up to 8 bytes (64 with CAN-FD).",
          "CRC: an integrity check computed over the frame.",
          "ACK: every node that received the frame correctly drives a dominant bit, so the transmitter knows someone read it.",
          "EOF: the end of frame.",
        ],
      ],
    },
    arbitrage: {
      heading: "Who speaks first: arbitration",
      blocks: [
        "Two ECUs may want to transmit at the same time. CAN resolves the collision without destroying it. A dominant bit (0) electrically overrides a recessive bit (1). Each transmitter reads back the bus while it writes its identifier: the moment it drives a recessive bit while another forces a dominant one, it realises a higher-priority frame is in progress and goes silent at once.",
        "The result: the lowest identifier wins, bit by bit, with no collision and no retransmission. Priority is deterministic. That is why critical messages (braking, steering, airbags) are given the lowest identifiers: they always go first, even on a busy bus.",
      ],
    },
    atouts: {
      heading: "What makes it an excellent network",
      blocks: [
        [
          "Robust: the differential pair shrugs off a hostile electrical environment.",
          "Cheap: two wires connect dozens of ECUs.",
          "Deterministic: priority-based arbitration guarantees real-time behaviour for vital functions.",
          "Multi-master: no conductor, and therefore no single point of failure.",
          "Self-checking: CRC, acknowledgement and error counters are built into the protocol.",
          "Fault-tolerant: a node that piles up errors takes itself offline (bus-off) so it does not pollute the network.",
        ],
      ],
    },
    faiblesses: {
      heading: "Its weaknesses, seen by an attacker",
      blocks: [
        "Everything that makes it strong on reliability turns against it on security: CAN was never designed for an adversary already sitting on the bus.",
        [
          "No authentication: any node can emit any identifier. Nothing proves where a frame came from.",
          "No encryption: traffic is in the clear, so sniffing is immediate.",
          "Full broadcast: every message reaches everyone, so confidentiality does not exist.",
          "No concept of source: a genuine frame cannot be told apart from a forged one; spoofing is undetectable at the protocol level.",
          "Hijackable arbitration: endlessly sending identifier 0 saturates the bus (denial of service); forcing a target node's errors pushes it into bus-off and silences it.",
          "Implicit trust: without a filtering gateway, an exposed entry point (infotainment, OBD) grants access to the critical domains.",
        ],
      ],
    },
    exploitation: {
      heading: "From weakness to attack",
      blocks: [
        "These properties translate directly into families of techniques. Each one exploits a specific gap in the protocol.",
        {
          aTitle: "The missing property",
          a: [
            "No confidentiality",
            "No origin integrity check",
            "No authentication",
            "Priority-based arbitration",
          ],
          bTitle: "The technique it opens up",
          b: [
            "Passive reading (sniffing) and reverse engineering of identifiers",
            "Replaying a capture verbatim",
            "Injection and spoofing of forged frames, fuzzing",
            "Denial of service through saturation or forced bus-off",
          ],
        },
        "Each of these families is detailed, with tools and real-world cases, in the attack explorer.",
      ],
    },
    parades: {
      heading: "How it gets hardened",
      blocks: [
        "You do not rewrite CAN: you add layers on top. SecOC authenticates each message with a message authentication code and a freshness counter, which closes off spoofing and replay. The central gateway segments the domains and filters what crosses from infotainment toward braking. A CAN IDS learns normal traffic and flags the abnormal. Finally, recent functions are migrating to CAN-FD and automotive Ethernet.",
        "None of these countermeasures actually encrypts the bus, and that is the point to remember: denial of service by saturating the arbitration remains very hard to prevent. Defence targets authenticity and partitioning first, not secrecy.",
      ],
    },
  },
};
