import type { ReadingPage } from "../reading";

// English translation of the Atelier page. Mirrors atelier.ts.
export const atelierEn: ReadingPage | null = {
  title: "Build your bench, and go further",
  lede:
    "Enough to move from reading to practice: a virtual CAN bus, the commands that matter, the vocabulary, and where to go next.",
  sections: [
    {
      id: "banc",
      heading: "A CAN bench without a car",
      blocks: [
        {
          t: "p",
          text: "You don't need a vehicle to get started. Linux ships with SocketCAN; a virtual vcan interface behaves like a real bus, and the ICSim simulator provides a dashboard to drive.",
        },
        {
          t: "code",
          caption: "Create a virtual CAN bus (Linux, SocketCAN)",
          lines: [
            "sudo modprobe vcan",
            "sudo ip link add dev vcan0 type vcan",
            "sudo ip link set up vcan0",
          ],
        },
        {
          t: "code",
          caption: "Launch the ICSim simulator",
          lines: [
            "./icsim vcan0        # the simulated dashboard",
            "./controls vcan0     # the controller that generates the traffic",
          ],
        },
        {
          t: "note",
          text: "Everything stays local and virtual: no vehicle is touched, and no frame leaves the machine.",
        },
      ],
    },
    {
      id: "reproduire",
      heading: "Reproduce it for real",
      blocks: [
        {
          t: "p",
          text: "The virtual bench is enough to learn the method; copper makes it concrete. Four builds, from the simplest at fifteen euros to the most striking for a demo, all documented and reproducible.",
        },
        {
          t: "table",
          caption: "From a toy bench to a cluster that lights up",
          head: ["Build", "Hardware", "What it reproduces"],
          rows: [
            [
              "Two-node bench",
              "2 Arduino or ESP32, 2 transceivers (MCP2515 or native TWAI), 2 resistors of 120 ohms",
              "The heart of reversing: one node sends, the other listens. Sniff, diff, inject.",
            ],
            [
              "ESP32 bridge",
              "1 ESP32 with ESP32RET or CANMIM",
              "Capture, replay and man-in-the-middle on a real bus, driven from the PC (SavvyCAN).",
            ],
            [
              "Raspberry Pi + CAN-HAT",
              "1 Raspberry Pi, 1 CAN hat (PiCAN, Waveshare)",
              "The same candump / cansend as the Workshop, but on a physical can0 interface.",
            ],
            [
              "Real instrument cluster",
              "A scrapyard cluster, a power supply, a terminated bus",
              "The needles move for real when you forge the frames. The demo that sticks.",
            ],
          ],
        },
        {
          t: "ul",
          items: [
            "Wiring: CAN-H to CAN-H, CAN-L to CAN-L, and a 120 ohm resistor at each end of the bus.",
            "The classic trap: many MCP2515 modules use an 8 MHz crystal, not 16. If the clock does not match, the bus stays silent.",
            "Bit rate: most examples run at 250 or 500 kbit/s, and both nodes must be set the same.",
          ],
        },
        {
          t: "p",
          text: "The bridge to this site: a Raspberry Pi with a CAN-HAT exposes a real SocketCAN interface. Every command shown above works unchanged, and ICSim runs on it with no modification.",
        },
        {
          t: "code",
          caption: "Move ICSim from the virtual bus to a real CAN interface",
          lines: [
            "sudo ip link set can0 type can bitrate 500000",
            "sudo ip link set up can0",
            "./icsim can0        # the same cluster, on the physical bus",
            "./controls can0",
          ],
        },
        {
          t: "links",
          items: [
            {
              label: "Two-node bench step by step (SparkFun CAN Bus Shield)",
              url: "https://www.instructables.com/Sparkfun-CAN-Bus-Shield-Tutorial",
              note: "Two Arduinos, wiring and termination explained.",
            },
            {
              label: "ESP32RET",
              url: "https://github.com/aszu80/ESP32RET",
              note: "Turn an ESP32 into a capture-and-replay tool, compatible with SavvyCAN.",
            },
            {
              label: "CANMIM",
              url: "https://github.com/zeroomega/canmim",
              note: "Man-in-the-middle on CAN with an ESP32: read, filter, inject, re-emit.",
            },
            {
              label: "Pro-CHASER (research testbed)",
              url: "https://researcher.manipal.edu/en/publications/pro-chaser-a-prototype-testbed-for-car-hacking-attack-simulation-/",
              note: "A Raspberry Pi + CAN-HAT bench described in a publication.",
            },
          ],
        },
      ],
    },
    {
      id: "antiseche",
      heading: "can-utils cheat sheet",
      blocks: [
        {
          t: "table",
          caption: "The everyday commands",
          head: ["Command", "What it does"],
          rows: [
            ["candump vcan0", "Show every frame on the bus live."],
            ["candump -l vcan0", "Log to a file (candump-*.log) for replay."],
            ["canplayer -I file.log", "Replay a recording exactly as captured."],
            ["cansend vcan0 123#DEADBEEF", "Send a frame: identifier 0x123, data DE AD BE EF."],
            ["cangen vcan0 -I i -L 8 -D r", "Generate random frames: load and fuzzing."],
            ["cansniffer vcan0", "A view grouped by identifier, with changing bytes highlighted."],
            ["cansend vcan0 000#0000000000000000", "Hammer identifier 0: an illustration of a denial of service."],
          ],
        },
      ],
    },
    {
      id: "glossaire",
      heading: "Glossary",
      blocks: [
        {
          t: "deflist",
          items: [
            { term: "ECU", def: "One of the vehicle's computers: engine, braking, cabin, and so on." },
            { term: "Frame", def: "The unit of data transmitted on the bus: one identifier and up to eight bytes." },
            { term: "Identifier (CAN ID)", def: "The field that describes a frame's contents and sets its arbitration priority." },
            { term: "ISO-TP", def: "The transport layer (ISO 15765-2) that segments messages longer than eight bytes." },
            { term: "UDS", def: "Standardised diagnostic services (ISO 14229), on top of the bus." },
            { term: "DoIP", def: "Diagnostics over IP (ISO 13400): diagnostics carried by Ethernet." },
            { term: "SecOC", def: "Secure Onboard Communication: authenticates messages (a MAC and a freshness counter)." },
            { term: "DTC", def: "Diagnostic Trouble Code: a fault code recorded by an ECU." },
            { term: "PID (OBD)", def: "Parameter ID: the identifier of a standard value readable through the OBD-II port." },
            { term: "CAN-FD", def: "An evolution of CAN: a higher bit rate and up to 64 data bytes per frame." },
            { term: "Bus-off", def: "The state in which a node disconnects itself after too many errors." },
          ],
        },
      ],
    },
    {
      id: "ressources",
      heading: "To go further",
      blocks: [
        {
          t: "links",
          items: [
            { label: "The Car Hacker's Handbook (OpenGarages)", url: "https://www.opengarages.org/handbook/", note: "The entry-level reference, free and open." },
            { label: "can-utils (SocketCAN repository)", url: "https://github.com/linux-can/can-utils", note: "The command-line tools." },
            { label: "ICSim, the dashboard simulator", url: "https://github.com/zombieCraig/ICSim", note: "To practise replay without a car." },
            { label: "UNECE WP.29 (R155 / R156)", url: "https://unece.org/transport/vehicle-regulations-wp29", note: "The regulatory framework for vehicle cybersecurity." },
            { label: "ISO/SAE 21434", url: "https://www.iso.org/standard/70918.html", note: "Automotive cybersecurity engineering." },
          ],
        },
        {
          t: "note",
          text: "Links open in a new tab. This site drops no trackers.",
        },
      ],
    },
  ],
};
