import type { Article } from "../articles";

// English translation of the "Analyses" articles. Mirrors fr in articles.ts.
export const articlesEn: Article[] = [
  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 11,
    vector: "hardware",
    tags: ["Fault injection", "Secure boot", "Root of trust", "AMD", "Jailbreak"],
    title: "Tesla: glitching the chip to break the root of trust",
    dek:
      "In 2023, four TU Berlin researchers make a Tesla's AMD secure processor stumble by disturbing its power supply. The payoff: arbitrary code on the root of trust, extraction of an identity key, and a jailbreak that software cannot patch.",
    fiche: {
      cible: "Tesla with AMD Ryzen infotainment (the MCU board known as MCU-Z), on recent Model 3, Y, S and X.",
      entree: "Physical access to the MCU board, specifically to the power rail of the AMD secure processor (ASP).",
      methode:
        "Voltage glitching: a tiny voltage drop timed to the moment the ROM code verifies the firmware signature makes that check fail to run.",
      faille: "A root of trust in masked ROM, with no protection against fault injection: nothing to fix in the field.",
    },
    sections: [
      {
        id: "contexte",
        heading: "The root of trust of a Tesla",
        blocks: [
          {
            t: "p",
            text: "A recent Tesla's infotainment runs on an AMD Ryzen x86 processor. Its entire boot is locked down by a separate component, the AMD secure processor (ASP, also called PSP): at power-on it verifies the signature of every software stage before launching it. This chain is the system's root of trust. It guards three things: the activation of paid options, the key that proves the car's identity to Tesla's service network, and the encryption of user data.",
          },
          {
            t: "p",
            text: "Break this link and you get everything at once. That is exactly what a team from TU Berlin did, presented at Black Hat USA 2023 and then at 37C3.",
          },
          {
            t: "note",
            text:
              "Work by Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob and Oleg Drokin (TU Berlin). Hans Niklas Jacob also co-authored the earlier AMD glitch the attack builds on.",
          },
        ],
      },
      {
        id: "glitch",
        heading: "Voltage glitching, explained",
        blocks: [
          {
            t: "p",
            text: "A processor assumes a stable power supply. Drop it very briefly, for a few tens of nanoseconds, at the exact moment it executes a sensitive instruction, and it stumbles: the instruction is skipped or mis-executed. Applied right on the comparison that validates a signature, this fault turns a failure into a success. Unsigned code passes as if it were legitimate.",
          },
          {
            t: "p",
            text: "The whole difficulty is timing. You have to find the window of a few moments when the verification happens, trigger the drop at that instant, and retry until it lands. It takes a while to tune, but once the window is known, the attack is repeatable.",
          },
          {
            t: "note",
            text:
              "The glitch is not persistent: it must be replayed at every boot to get past the check. What is then placed in the system, however, can be made permanent.",
          },
        ],
      },
      {
        id: "chaine",
        heading: "The exploitation chain, step by step",
        blocks: [
          {
            t: "ol",
            items: [
              "Take apart the MCU board and locate the rail that powers the core of the AMD secure processor (driven by a programmable voltage regulator).",
              "Fit a small glitch circuit on that rail, able to cause a very short voltage drop on command.",
              "Reuse the already known and documented AMD glitch, which targets the signature check of the boot code in ROM.",
              "Trigger the drop at the exact moment the ROM verifies the next stage, and repeat until the verification is bypassed.",
              "Run unsigned code on the secure processor: the root of trust is now under control.",
              "From there, decrypt the firmware, patch the Linux system for persistent root access, and extract the hardware-bound RSA key.",
            ],
          },
          {
            t: "frame",
            caption: "The boot chain and the injection point (teaching schematic).",
            lines: [
              { text: "masked ROM (ASP)  --verifies signature-->  PSP bootloader", mark: "ok" },
              { text: "         ^ glitch here: the check is skipped", mark: "hl" },
              { text: "PSP bootloader  -->  ABL  -->  UEFI  -->  Linux kernel", mark: "ok" },
              { text: "unsigned code accepted: root of trust compromised", mark: "hl" },
            ],
          },
        ],
      },
      {
        id: "butin",
        heading: "What the glitch unlocks",
        blocks: [
          {
            t: "table",
            caption: "A single fault opens four doors.",
            head: ["Capability gained", "What it means in practice"],
            rows: [
              ["Persistent jailbreak", "Root access on the infotainment Linux, surviving reboots and updates."],
              ["Attestation key extraction", "The hardware-bound RSA key that authenticates the car to Tesla's network: enough to migrate, even clone, a vehicle's identity."],
              ["Paid options", "Heated seats, acceleration boost, and depending on region other software-locked features, enabled without paying."],
              ["User data", "Decryption of the personal data stored and encrypted by the system."],
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "The tooling",
        blocks: [
          {
            t: "deflist",
            items: [
              { term: "Glitch circuit (about $100)", def: "A small board that causes the voltage drop on command. It is the heart of the attack, and costs almost nothing." },
              { term: "Oscilloscope / logic analyzer", def: "To observe the boot and find the time window when the verification happens." },
              { term: "Soldering iron and physical access", def: "You must open the MCU board and tap the right power rail." },
              { term: "Prior art", def: "The AMD glitch from 'One Glitch to Rule Them All' (2021), then the team's 2024 follow-up, 'Three Glitches to Rule One Car', on the driver-assistance computer." },
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "What failed",
        blocks: [
          {
            t: "ul",
            items: [
              "The root of trust assumes the ROM always enforces its check. Fault injection breaks that assumption: you do not attack the cryptography, you stop the processor from verifying it.",
              "The boot code lives in masked ROM, etched into the silicon: it cannot be fixed by an update.",
              "The chip does not detect power anomalies (no glitch detector, no double check): a single fault is enough.",
            ],
          },
        ],
      },
      {
        id: "portee",
        heading: "Scope and limits",
        blocks: [
          {
            t: "p",
            text: "This is not a remote mass theft: it needs physical access, hardware, and tuning time per unit. But on one point it is worse than theft: the attack breaks a hardware trust anchor and lets you clone a vehicle's identity. And because the flaw is in the silicon, it cannot be fixed by software; the only real countermeasure is a chip resistant to fault injection. Since AMD supplies other manufacturers, the class of problem goes beyond Tesla.",
          },
          {
            t: "note",
            text:
              "In 2024, the same team followed up with 'Three Glitches to Rule One Car', carrying the approach over to the driver-assistance computer.",
          },
        ],
      },
    ],
    sources: [
      { label: "Christian Werling (TU Berlin): research page and publications", url: "https://www.user.tu-berlin.de/cwerling/" },
      { label: "Mayhem Security: Jailbreaking Teslas at Black Hat USA 2023", url: "https://www.mayhem.security/blog/jailbreaking-teslas-at-black-hat-usa-2023" },
      { label: "Hackaday: jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "One Glitch to Rule Them All: fault injection against AMD's ASP (arXiv)", url: "https://arxiv.org/abs/2108.04575" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 11,
    vector: "can",
    tags: ["CAN bus", "Frame injection", "Keyless theft", "Gateway", "SecOC"],
    title: "Theft through the headlight: anatomy of a CAN injection",
    dek:
      "In 2023, Ian Tabor and Ken Tindell trace the theft of their RAV4 back to a headlight wire. Behind it, an attack that needs no key and no OBD port: forcing the CAN bus to believe a forged frame. We break down the mechanism, the tooling and the defenses.",
    fiche: {
      cible: "Toyota RAV4, and dozens of models (Lexus, Jeep, Nissan, VW, Maserati...) targeted by the same devices.",
      entree: "The front headlight harness, a point on the control CAN bus reachable by forcing the bumper.",
      methode:
        "A device injects, in a loop, a frame that impersonates the smart key receiver, relayed unchecked by the gateway to the engine controller.",
      faille: "CAN authenticates no message and the gateway relays between domains without verifying: a well-formed frame is taken at its word.",
    },
    sections: [
      {
        id: "contexte",
        heading: "The theft that documented it all",
        blocks: [
          {
            t: "p",
            text: "Ian Tabor's RAV4 is first vandalized (bumper torn off, headlight connector unplugged), then stolen a few days later. Before the theft, the car logged fault codes reporting a loss of communication with the headlight controller and with the CAN network. With Ken Tindell, CTO of Canis Automotive Labs, Tabor traces the wire back to the front headlight harness, and uncovers a method that has become a small industry.",
          },
          {
            t: "note",
            text:
              "The injector was sold ready to use to thieves, hidden in a fake Bluetooth speaker: about ten dollars of parts to steal a car in a minute.",
          },
        ],
      },
      {
        id: "architecture",
        heading: "The target: a chatty bus, zero authentication",
        blocks: [
          {
            t: "p",
            text: "A car has not one CAN bus but several, linked by a central gateway. On the control bus travel the messages of the smart key receiver. The front headlight is wired to that same bus: reaching its connector means reaching the bus that carries the authorization to start. The underlying problem: on a CAN, no message is signed, and the gateway copies certain frames from one bus to another without verifying them.",
          },
          {
            t: "duo",
            aTitle: "What the network assumes",
            a: [
              "Only factory controllers talk on the bus.",
              "A well-formed frame necessarily comes from a legitimate node.",
              "The gateway relays what is useful between domains.",
            ],
            bTitle: "What the attacker exploits",
            b: [
              "Any node placed on the wire can transmit.",
              "Nothing tells a forged frame from a real one.",
              "So the gateway relays the forged frame too.",
            ],
          },
        ],
      },
      {
        id: "injection",
        heading: "CAN injection, the real trick",
        blocks: [
          {
            t: "p",
            text: "The subtle point: the real key controller keeps emitting its own legitimate message ('no key present'). So it is not enough to add a frame, you have to impose yours. CAN arbitrates bit by bit: a dominant bit (0) overwrites a recessive bit (1), and the lowest identifier wins. The device exploits this mechanism and adds a circuit that forces the transceiver's behavior, so as to place its bits and push the legitimate node into error. The result: it is the forged frame that the gateway and the engine see.",
          },
          {
            t: "note",
            text:
              "This is what sets CAN injection apart from a simple replay: the attacker wins arbitration and neutralizes the authentic source, instead of adding noise on top.",
          },
        ],
      },
      {
        id: "chaine",
        heading: "The exploitation chain, step by step",
        blocks: [
          {
            t: "ol",
            items: [
              "Force the bumper or the headlight to expose the harness wires.",
              "Tap the two bus wires, CAN-H and CAN-L.",
              "Wait for a wake-up frame from the network, a sign the bus is listening.",
              "Emit a burst (about twenty times per second) impersonating the key receiver: the 'key validated' message.",
              "The immobilizer, believing the key is present, disarms.",
              "The gateway relays the frame to the engine network, without verifying it.",
              "A second message tells the body controller to unlock the doors.",
              "The thief gets in and starts: the car drives off in about a minute, without the key.",
            ],
          },
          {
            t: "frame",
            caption: "Teaching illustration: the forged burst (hl) amid normal traffic. Fictional identifiers.",
            lines: [
              { text: "0x120  engine        820 rpm                   normal frame", mark: "ok" },
              { text: "0x043  key receiver  'no key present'          normal frame", mark: "ok" },
              { text: "0x043  INJECTED      'key validated'  x20 / s   forged burst", mark: "hl" },
              { text: "gateway  relays 0x043 to the engine network, unchecked", mark: "hl" },
              { text: "immobilizer disabled, engine allowed to start", mark: "ok" },
            ],
          },
        ],
      },
      {
        id: "banc",
        heading: "How to observe and replay it on a bench",
        blocks: [
          {
            t: "p",
            text: "You do not need a real car to understand the method. On a virtual bus or a two-controller bench, the approach is always the same: trigger an action, watch the frame that changes, then replay it. That is exactly what this site's Workshop offers. The commands below work on a test interface (vcan0), never on a vehicle.",
          },
          {
            t: "code",
            caption: "Observe, isolate, replay (on a test bench).",
            lines: [
              "# listen to all traffic on the test bus",
              "candump vcan0",
              "",
              "# find the frame that moves when you act (diff before / after)",
              "cansniffer vcan0",
              "",
              "# replay a spotted frame (identifier#data, example values)",
              "cansend vcan0 043#01",
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "The tooling, on both sides",
        blocks: [
          {
            t: "table",
            caption: "The thief's device costs about ten dollars; the analysis uses public tools.",
            head: ["Item", "Side", "What it does"],
            rows: [
              ["PIC18F microcontroller with CAN", "Thief", "Generates and paces the forged frames; locked firmware."],
              ["CAN transceiver + override circuit", "Thief", "Places bits on the wire and forces arbitration against the legitimate node."],
              ["Fake Bluetooth speaker", "Thief", "Case and battery: hides the injector and powers it."],
              ["CAN interface (CANable, CANtact...)", "Analyst", "Connect a PC to the bus to read and send."],
              ["can-utils (candump, cansniffer, cansend)", "Analyst", "Capture, filter and replay frames."],
              ["SavvyCAN", "Analyst", "Visualize and compare captures, find the useful signal."],
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "What failed",
        blocks: [
          {
            t: "ul",
            items: [
              "CAN authenticates no message: a node able to place bits is taken at its word.",
              "The gateway copies frames between domains without verifying their origin.",
              "The immobilizer bases a security decision on a mere assertion from the bus.",
              "A non-critical peripheral (the headlight) gives access to a critical bus.",
            ],
          },
        ],
      },
      {
        id: "parade",
        heading: "The defense, and where to test it here",
        blocks: [
          {
            t: "p",
            text: "The fundamental answer is message authentication. That is the purpose of SecOC: each frame carries an authentication code and a freshness counter, so that a forged or replayed frame is rejected. Canis Labs pushes the same idea with CryptoCAN. Segmentation helps as well, by preventing a node on the front network from talking directly to the engine controller. Finally, intrusion detection can spot the bus errors characteristic of injection.",
          },
          {
            t: "p",
            text: "These two defenses, SecOC and segmentation, are switches you can turn on in the Explorer to watch the attack path get blocked. And the trigger, observe, replay method can be handled in the Workshop, on a virtual bus.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell: CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "SecurityWeek: thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive: stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
      { label: "NVD: CVE-2023-29389", url: "https://nvd.nist.gov/vuln/detail/CVE-2023-29389" },
    ],
  },
];
