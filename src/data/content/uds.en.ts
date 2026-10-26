import type { ReadingPage } from "../reading";

// English translation of the UDS page. Mirrors uds.ts (same section ids,
// same block order and types), only the text is translated.
export const udsEn: ReadingPage | null = {
  title: "UDS, the diagnostic that opens the doors",
  lede:
    "The standardised protocol we use to talk to ECUs: read, write, reset, reflash. Designed for the workshop, it becomes an attack surface the moment you learn to divert it.",
  sections: [
    {
      id: "quoi",
      heading: "A protocol on top of the bus",
      blocks: [
        {
          t: "p",
          text: "UDS (Unified Diagnostic Services, ISO 14229) is a request/response protocol between a tester (the diagnostic tool) and an ECU. It does not replace CAN: it rides on top of it, carried by ISO-TP (ISO 15765-2) when a request exceeds eight bytes, or by DoIP on Ethernet-equipped vehicles.",
        },
        {
          t: "p",
          text: "Each request begins with a one-byte service identifier (SID). A positive response returns that SID increased by 0x40; a negative response returns 0x7F, the original SID, then an error code.",
        },
        {
          t: "frame",
          caption: "A UDS request and its positive response (SID + 0x40)",
          lines: [
            { text: "Tester -> ECU : 10 03                 open the extended session" },
            { text: "ECU -> Tester : 50 03 00 32 01 F4       positive (0x10 + 0x40 = 0x50)", mark: "ok" },
          ],
        },
      ],
    },
    {
      id: "services",
      heading: "The services that matter",
      blocks: [
        {
          t: "p",
          text: "A handful of services is enough to cover the essentials of offensive diagnostics.",
        },
        {
          t: "table",
          caption: "Reference UDS services",
          head: ["SID", "Service", "What it allows"],
          rows: [
            ["0x10", "DiagnosticSessionControl", "Open a session (default, extended, programming) and unlock sensitive services."],
            ["0x27", "SecurityAccess", "Unlock a protected function through a challenge/response (seed/key)."],
            ["0x22", "ReadDataByIdentifier", "Read a value by identifier: VIN, software versions, sensors."],
            ["0x2E", "WriteDataByIdentifier", "Write a value by identifier, and thus change an ECU parameter."],
            ["0x31", "RoutineControl", "Run an internal routine: erasing, tests, calibrations."],
            ["0x34 / 36 / 37", "Request/Transfer/Exit", "The reflashing sequence: announce, transfer, close."],
            ["0x11", "ECUReset", "Restart the ECU."],
            ["0x3E", "TesterPresent", "Keep the session open (keep-alive)."],
            ["0x28", "CommunicationControl", "Stop or restore the sending and receiving of messages."],
            ["0x85", "ControlDTCSetting", "Enable or disable the recording of fault codes."],
          ],
        },
      ],
    },
    {
      id: "seedkey",
      heading: "SecurityAccess: the seed/key challenge",
      blocks: [
        {
          t: "p",
          text: "Service 0x27 protects sensitive functions (writing, reflashing) with a challenge-response. The principle is simple; all of its strength rests on the secrecy of the algorithm.",
        },
        {
          t: "ol",
          items: [
            "The tester asks for a seed: a 0x27 request with an odd sub-function (0x01, requestSeed).",
            "The ECU returns a random seed, a few bytes long.",
            "The tester computes the key by applying to the seed an algorithm the manufacturer keeps secret.",
            "The tester sends the key: a 0x27 request with the matching even sub-function (0x02, sendKey).",
            "If the key matches, the ECU unlocks; otherwise it refuses, and after several attempts it imposes an anti-bruteforce delay.",
          ],
        },
        {
          t: "frame",
          caption: "Seed/key exchange (service 0x27)",
          lines: [
            { text: "Tester -> ECU : 27 01                 requestSeed" },
            { text: "ECU -> Tester : 67 01 A3 7F 2C 90       seed (4 bytes)", mark: "ok" },
            { text: "Tester -> ECU : 27 02 11 22 33 44       sendKey (computed key)" },
            { text: "ECU -> Tester : 67 02                 positive, access granted", mark: "ok" },
          ],
        },
        {
          t: "p",
          text: "The seed-to-key algorithm lives in the ECU firmware. If it is weak (linear operations, a fixed key) or extracted through a memory dump, it can be replayed offline. That is why 0x27 is the first target of a UDS audit, and why a strong algorithm and SecOC change everything.",
        },
      ],
    },
    {
      id: "flash",
      heading: "Reflashing: 0x34 / 0x36 / 0x37",
      blocks: [
        {
          t: "p",
          text: "Reprogramming an ECU follows a precise sequence, in a programming session and after a successful SecurityAccess.",
        },
        {
          t: "ol",
          items: [
            "0x34 RequestDownload: announces the address, the size and the format of the data to be written.",
            "0x36 TransferData: sends the firmware in numbered blocks.",
            "0x37 RequestTransferExit: closes the transfer; the ECU verifies and then validates.",
          ],
        },
        {
          t: "p",
          text: "Without an authenticity and integrity check, this sequence makes it possible to write modified firmware. That is why secure boot and signed updates (the R156 framework) are decisive.",
        },
      ],
    },
    {
      id: "aller",
      heading: "Tying it back to the attacks",
      blocks: [
        {
          t: "p",
          text: "The attacks in the explorer's Diagnostic layer all rely on these services: forcing a session, bruteforcing a weak seed, writing a data identifier, running a routine, reflashing an ECU.",
        },
      ],
    },
  ],
};
