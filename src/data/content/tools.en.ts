import type { ToolsOverride } from "../tools";

// English translation of the tools catalogue. Falls back to French while empty.
// Group and tool ids mirror tools.ts.
export const toolsText: ToolsOverride = {
  sniff: {
    titre: "CAN reading and injection",
    intro: "Read, replay and forge traffic on a bus, from the software side.",
    tools: {
      candump:
        "Captures and displays, in real time, every frame on a SocketCAN interface. The starting point of any reconnaissance.",
      cansend:
        "Forges and injects a specific frame, or generates a stream of frames to flood the bus or fuzz an ECU.",
      canplayer:
        "Replays a recording of frames verbatim, timestamps included. The canonical tool for the replay attack.",
      cansniffer:
        "Groups frames by identifier and highlights the bytes that change. Ideal for isolating a signal.",
      savvycan:
        "A cross-platform GUI for capturing, replaying and reverse engineering CAN and CAN-FD frames.",
      wireshark:
        "A network analyser with SocketCAN and ISO-TP dissectors to pick a capture apart frame by frame.",
      pythoncan:
        "A Python library that drives most CAN interfaces: capture, injection and scripted automation.",
    },
  },
  diag: {
    titre: "Diagnostics and UDS",
    intro: "Talk to the ECUs through the standardised diagnostic services.",
    tools: {
      caringcaribou:
        "The \"nmap of CAN\": UDS service discovery, identifier scanning, fuzzing and session brute-forcing.",
      udsoncan:
        "A Python implementation of UDS (ISO 14229) for scripting sessions, data read/write and routines.",
      doipclient:
        "A DoIP client (diagnostics over IP/Ethernet) to reach the ECUs of recent vehicles.",
      scapy:
        "Forges and dissects CAN, ISO-TP, UDS, DoIP and GMLAN from Python, for custom scenarios.",
      j2534:
        "The standardised interface of OEM tools, often repurposed for flashing and diagnostics.",
    },
  },
  iface: {
    titre: "CAN hardware interfaces",
    intro: "The physical bridge between the PC and the CAN-H / CAN-L pair.",
    tools: {
      canable:
        "Open-source USB-CAN adapters, recognised natively by SocketCAN. The entry level of the lab.",
      pcan:
        "A very widespread professional CAN interface, with stable drivers and broad tooling support.",
      kvaser:
        "A rugged CAN/CAN-FD interface with a complete API, common in embedded engineering.",
      macchina:
        "Embeddable hardware plugged straight into the OBD-II port, programmable for fieldwork.",
      pihat:
        "A low-cost embedded platform for building a standalone CAN bench and scripting in Python.",
    },
  },
  radio: {
    titre: "Radio and wireless",
    intro: "For RF entry points: key fobs, keyless entry, cellular, GNSS.",
    tools: {
      hackrf:
        "A wideband SDR from 1 MHz to 6 GHz, transmit and receive. Captures and replays key fob signals.",
      rtlsdr:
        "A very cheap receive-only SDR, for observing and identifying the bands in use.",
      yardstick:
        "A sub-GHz transceiver (300-900 MHz), tailored for remote controls and RF key fobs.",
      gnuradio:
        "A signal-processing workbench for assembling custom transmit and receive chains.",
    },
  },
  lowlevel: {
    titre: "Low-level hardware and fault injection",
    intro: "When you open up the ECU and attack the silicon.",
    tools: {
      chipwhisperer:
        "A platform for fault injection (voltage or clock glitching) and side-channel analysis.",
      jtagulator:
        "Automatically identifies exposed JTAG / SWD debug pins on an unknown board.",
      buspirate:
        "A Swiss army knife for talking SPI, I2C and UART to a chip and probing a circuit.",
      logic:
        "Captures the digital signals of an internal bus to reverse engineer them offline.",
      flashrom:
        "Reads and writes an ECU's flash memory, to extract or replace a firmware image.",
    },
  },
  sim: {
    titre: "Simulation and frameworks",
    intro: "Practise without a vehicle, and tool up your campaigns.",
    tools: {
      icsim:
        "OpenGarages' dashboard and CAN traffic simulator, for practising replay without a car.",
      metasploit:
        "A hardware bridge that lets you drive CAN interfaces from the exploitation framework.",
      opengarages:
        "Resources, test benches and documentation from the car hacking community.",
    },
  },
};
