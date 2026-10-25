import type { AttackOverride } from "../types";

export const en: Record<string, AttackOverride> = {
  // ---------------------------------------------------------------- Layer A
  A1: {
    nom: "Passive bus eavesdropping (sniffing)",
    resume:
      "Listen to everything travelling on the bus. Nothing is encrypted, so everything is readable.",
    principe:
      "CAN is a broadcast bus: every frame is received by every node. A device connected to the bus reads the entire traffic without drawing any attention.",
    pourquoi:
      "CAN was designed in 1986 for reliability and real-time behaviour, not for security. Frames travel in the clear, with no encryption or access control: reading them requires only a CAN transceiver and something to decode with.",
    methode: [
      "Connect to a bus access point, most often the OBD-II port",
      "Capture the traffic continuously",
      "Observe the identifiers, their frequency and the bytes that change",
    ],
    prerequis: ["Physical access to the bus (OBD-II or wiring harness)", "A CAN interface and a decoder"],
    effet:
      "Every frame in the vehicle becomes visible; you count the identifiers and gradually reconstruct a map of the traffic.",
    remediations: [
      "Physical access control to the diagnostic port",
      "Detection of unauthorised devices on the bus (IDS)",
      "Bus encryption (rare, costly and not widely deployed)",
    ],
    annexe5: "Family 2 (communication channels). SecOC protects authenticity, not confidentiality.",
    outils: ["candump", "Wireshark", "SavvyCAN"],
    casReel:
      "The starting point of nearly all published car-hacking work, from the Car Hacker's Handbook to the demonstrations by Miller and Valasek.",
    frame: {
      caption: "Raw traffic captured on the bus (example)",
      lines: [
        { text: "can0  18F  [8]  1A 00 64 00 00 00 00 12" },
        { text: "can0  0C9  [8]  20 83 00 00 FF 00 00 00" },
        { text: "can0  244  [8]  00 00 00 2D 00 00 00 00   <- everything is in the clear", mark: "hl" },
      ],
    },
    verdictPass:
      "Eavesdropping remains possible: none of the model's countermeasures protects the confidentiality of the bus. It is the foundation of all the attacks that follow.",
    verdictBlock: "",
  },
  A2: {
    nom: "Reverse-engineering the identifiers",
    resume:
      "Tie an identifier and its bytes to a real vehicle function (speed, turn signal, doors).",
    principe:
      "By acting on a physical control and observing what changes on the bus, you isolate the identifier and the bytes responsible for the function.",
    pourquoi:
      "The identifiers are not publicly documented, but they are stable and deterministic: the same action always produces the same frame. Correlating action and frame is enough to rebuild the mapping.",
    methode: [
      "Capture continuously while actuating a function",
      "Filter the frames that move at the moment of the action",
      "Isolate the identifier and the setpoint byte, then confirm by replaying",
    ],
    prerequis: ["Access to the bus", "Access to the vehicle's physical controls"],
    effet:
      "In the app, actuating a function highlights the corresponding identifier in the monitor.",
    remediations: [
      "Obfuscation of the identifiers (weak protection)",
      "Defence in depth downstream: SecOC, segmentation",
    ],
    annexe5: "Family 2. A reconnaissance step that sets up injection and replay.",
    outils: ["cansniffer", "caringcaribou", "SavvyCAN"],
    casReel:
      "The standard method for any CAN analysis; at the heart of the CAN-injection thefts documented in 2023 (Ian Tabor, Ken Tindell).",
    verdictPass:
      "The mapping remains feasible: it relies only on eavesdropping and observation, which none of the model's countermeasures prevents.",
    verdictBlock: "",
  },
  A3: {
    nom: "Replay of a captured frame",
    resume:
      "Capture a legitimate frame, for example the door unlock, and re-emit it unchanged.",
    principe:
      "Plain CAN has no notion of freshness. A replayed frame is strictly identical to the original: the ECU cannot tell them apart.",
    pourquoi:
      "With no authenticated counter or timestamp, nothing ties a frame to a point in time. The receiver acts on the content, not on the origin or the age of the message.",
    methode: [
      "Sniff and identify the frame for the targeted action",
      "Store it",
      "Re-emit it at the chosen moment",
    ],
    prerequis: ["Access to the bus", "The target frame already captured"],
    effet: "The replayed action executes: for example, the doors unlock.",
    remediations: [
      "SecOC: freshness counter + authentication code (an already-seen frame is rejected)",
      "Application-level anti-replay counters",
    ],
    annexe5: "Family 2.",
    outils: ["canplayer", "SavvyCAN"],
    casReel: "A classic against unauthenticated comfort functions (doors, windows, horn).",
    verdictPass:
      "Without SecOC, the replayed frame is accepted as new: the action can be reproduced at will.",
    verdictBlock:
      "SecOC rejects the frame: its freshness counter has already been seen, and the authentication code no longer matches. The replay fails.",
  },
  A4: {
    nom: "Injection of a forged frame (spoofing)",
    resume:
      "Forge a frame with a legitimate identifier and the value of your choice. The receiver believes it is authentic.",
    principe:
      "On CAN, the identifier is a message label, not a sender address. Any node can emit any identifier.",
    pourquoi:
      "No field designates the sender and no signature protects the content. By emitting the frame more often than the legitimate source, the attacker imposes their value (winning arbitration or drowning out the real frame).",
    methode: [
      "Know the target's identifier and format (via A2)",
      "Forge the frame with the desired value",
      "Emit it at high frequency to prevail over the legitimate source",
    ],
    prerequis: ["Access to the bus", "Target identifier known"],
    effet:
      "The dashboard displays a false speed, or a false command is sent to an ECU.",
    remediations: [
      "SecOC: an authentication code (MAC) that is invalid for a forged frame",
      "Segmentation to limit the reach of a compromised node",
    ],
    annexe5: "Family 2.",
    outils: ["cansend", "cangen", "caringcaribou"],
    casReel:
      "CAN-injection thefts in 2022-2023: a module spliced into a headlight's wiring harness injects the unlock/start frame (Tabor, Tindell).",
    frame: {
      caption: "Injection on the bus (teaching example)",
      lines: [
        { text: "0C9#FF 20 00 00 00 00 00 00   forged frame, emitted at 100 Hz", mark: "hl" },
        { text: "0C9#00 14 00 00 00 00 00 00   legitimate frame, drowned out" },
        { text: "        ^^ setpoint byte: frequency lets the attacker win" },
      ],
    },
    verdictPass:
      "Without SecOC, the receiver cannot distinguish the forged frame from the real one: the false value is taken into account.",
    verdictBlock:
      "SecOC checks the authentication code: the forged frame has no valid MAC and is rejected.",
  },
  A5: {
    nom: "Bus fuzzing",
    resume:
      "Flood the bus with random frames to trigger unexpected behaviour or crash an ECU.",
    principe:
      "By sending random identifiers and data, you sometimes trigger a function by accident or drive an ECU into an unplanned state.",
    pourquoi:
      "ECUs do not always validate their inputs strictly. An untested combination can slip past a missing check and reach fragile code.",
    methode: [
      "Generate random or semi-directed frames in bulk",
      "Observe the anomalies (warning lights, functions, crashes)",
      "Narrow the search space around the anomalies found",
    ],
    prerequis: ["Access to the bus"],
    effet:
      "Erratic behaviour: turn signals, warning lights coming on, an ECU freezing.",
    remediations: [
      "Strict input validation on the ECU side",
      "SecOC (most forged frames rejected)",
      "Robustness testing from the design stage",
    ],
    annexe5: "Family 7 (unmitigated vulnerabilities).",
    outils: ["cangen", "caringcaribou", "python-can scripts"],
    casReel: "A discovery technique used in academic research and manufacturer audits.",
    verdictPass:
      "Without authentication, the random frames reach the ECUs and can trigger unforeseen behaviour.",
    verdictBlock:
      "SecOC rejects the vast majority of forged frames before they reach the application logic, which sharply reduces the fuzzing surface.",
  },
  A6: {
    nom: "Denial of service by bus saturation",
    resume:
      "Monopolise the bus with maximum-priority frames. Nothing else gets through.",
    principe:
      "CAN arbitration gives priority to the lowest identifier (dominant bits). By continuously emitting identifier 0x000, the attacker always wins arbitration.",
    pourquoi:
      "Priority by arbitration is a native mechanism of the protocol, independent of content or authenticity. A stream of 0x000 is perfectly CAN-compliant: nothing distinguishes it from legitimate high-priority traffic.",
    methode: [
      "Emit the highest-priority frames (0x000) without interruption",
      "Sustain the stream to prevent any other node from accessing the bus",
    ],
    prerequis: ["Access to the bus"],
    effet:
      "The bus saturates, legitimate traffic stops, the dashboard freezes. Banner \"bus saturated\".",
    remediations: [
      "On-board intrusion detection (IDS) that spots the abnormal stream",
      "Filtering and redundancy on critical links",
    ],
    annexe5: "Family 2, from the availability angle.",
    outils: ["cangen in flood mode"],
    casReel:
      "Denial of service illustrates a major limitation: no message authentication prevents the saturation of a shared medium.",
    verdictPass:
      "A key teaching point: SecOC changes nothing here. Authenticating messages does not prevent saturating the medium. Only an IDS or redundancy helps, and the bus stays unavailable.",
    verdictBlock: "",
  },
  A7: {
    nom: "Forcing an ECU into bus-off",
    resume:
      "Force a legitimate ECU to disconnect from the bus, then take its place.",
    principe:
      "This exploits CAN's error handling. By causing targeted errors during an ECU's transmissions, you drive its error counter up to the bus-off state: it goes silent. The attacker then usurps its identifier unchallenged.",
    pourquoi:
      "The error-confinement mechanism (TEC/REC, transition to error-passive then bus-off) is automatic and mandatory. Hijacked, it becomes a weapon: the victim excludes itself, believing it is faulty.",
    methode: [
      "Synchronise an error-bit injection with the target's frames",
      "Drive its error counter up to bus-off",
      "Emit in its place once the target is silent",
    ],
    prerequis: ["Access to the bus", "Fine timing control (suitable hardware)"],
    effet: "An ECU goes dark on the diagram; an attacking node takes over its identifier.",
    remediations: [
      "Monitoring of the error counters (abnormal rise)",
      "On-board IDS",
      "SecOC for authenticity once usurpation is attempted",
    ],
    annexe5: "Family 2.",
    outils: ["academic research", "specialised CAN hardware"],
    casReel: "Described in the academic literature (bus-off attack, 2016).",
    verdictPass:
      "Without SecOC, once the target is in bus-off the attacker emits under its identity unchallenged.",
    verdictBlock:
      "SecOC limits the application-level usurpation: even with the target silenced, the attacker's frames have no valid MAC. An IDS additionally detects the rise in the error counters.",
  },
  A8: {
    nom: "Man-in-the-middle via bus bridge",
    resume:
      "Physically cut the bus in two and insert yourself in the middle to relay, modify or block frames.",
    principe:
      "Because CAN is a broadcast medium, a true man-in-the-middle requires physically segmenting the bus with a two-interface device that decides, frame by frame, what passes.",
    pourquoi:
      "On a shared medium, you cannot insert yourself logically between two nodes: you have to break the segment. Once the bridge is in place, the attacker has full control over the flow between the two halves.",
    methode: [
      "Split the bus at the chosen point",
      "Insert the bridge device with its two CAN interfaces",
      "Filter, delay or modify the relayed frames",
    ],
    prerequis: ["Extensive physical access to the wiring harness", "Hardware with two CAN interfaces"],
    effet: "A device appears on the bus; the frames pass through it and can be altered.",
    remediations: [
      "Physical integrity of the wiring harness",
      "SecOC (a modified frame loses its MAC)",
      "Latency/anomaly detection",
    ],
    annexe5: "Family 2.",
    outils: ["hardware with two CAN interfaces"],
    casReel: "The basis of many analysis benches and of some high-end theft tools.",
    verdictPass:
      "Without SecOC, the bridge can modify frames in transit without being detected.",
    verdictBlock:
      "SecOC protects integrity: if the bridge modifies an authenticated frame, its authentication code becomes invalid and the receiver rejects it.",
  },

  // ---------------------------------------------------------------- Layer B
  B1: {
    nom: "Bypassing SecurityAccess (0x27)",
    resume: "Break the lock that protects sensitive diagnostic functions.",
    principe:
      "The UDS service 0x27 works on a seed/key basis: the ECU sends a seed, and the client must return a key computed by a secret algorithm. A weak algorithm, a key extracted from the firmware, or the absence of attempt limiting opens the lock.",
    pourquoi:
      "Security rests entirely on the secrecy of the algorithm and on an anti-brute-force delay. If either is missing, seed/key is a mere formality: the seed -> key relationship is deterministic.",
    methode: [
      "Request a seed (0x27 request)",
      "Compute the key if the algorithm is known, otherwise brute-force it for lack of a delay",
      "Return the key and obtain the secured session",
    ],
    prerequis: ["Diagnostic access (OBD or DoIP)", "Sometimes the algorithm extracted from the firmware"],
    effet: "The lock gives way and unlocks the sensitive services that follow (writing, reflashing).",
    remediations: [
      "A robust algorithm and a protected key (HSM)",
      "Delay and lockout after failures (anti-brute-force)",
      "Key rotation",
    ],
    annexe5: "Families 5 (diagnostic interface) and 7.",
    outils: ["python-udsoncan", "UDS scripts"],
    casReel:
      "Many production seed/key algorithms have proven weak or have been extracted by reverse-engineering the firmware.",
    frame: {
      caption: "UDS SecurityAccess exchange (example)",
      lines: [
        { text: "-> 27 01            requestSeed" },
        { text: "<- 67 01 A3 7F 10 2C   seed" },
        { text: "-> 27 02 7C 41 9B 6E   sendKey (computed key)", mark: "hl" },
        { text: "<- 67 02            access granted", mark: "ok" },
      ],
    },
    verdictPass:
      "Unhardened diagnostic interfaces: no delay, a weak algorithm, and the lock falls.",
    verdictBlock:
      "Hardening enforces a delay, lockout after failures and a protected key: brute force becomes impractical and the algorithm is no longer easily extractable.",
  },
  B2: {
    nom: "Malicious reflashing (RequestDownload 0x34)",
    resume: "Install modified firmware into an ECU.",
    principe:
      "The 0x34 service initiates a data transfer to the ECU, a step in reflashing, followed by 0x36 (TransferData) and 0x37. If the firmware's authenticity is not verified, you install your own.",
    pourquoi:
      "Without Secure Boot or a signature verified at write time and at boot, the ECU executes any binary that is correctly transferred. Legitimate reflashing and malicious reflashing follow the same UDS sequence.",
    methode: [
      "Obtain SecurityAccess (see B1)",
      "Launch RequestDownload then TransferData with the prepared firmware",
      "Validate the transfer (RequestTransferExit)",
    ],
    prerequis: ["Diagnostic access", "SecurityAccess cleared"],
    effet: "The ECU comes under the attacker's control (shown in a distinct colour on the map).",
    remediations: [
      "Secure Boot and firmware signing",
      "Integrity verification and anti-rollback",
      "Signing keys protected on the manufacturer's side",
    ],
    annexe5: "Families 3 (update procedures) and 6 (code).",
    outils: ["repurposed manufacturer flashing tools", "UDS scripts"],
    casReel:
      "Persistent takeover of an ECU almost always goes through unauthenticated reflashing.",
    verdictPass:
      "Without authenticity verification, the malicious firmware installs and persists.",
    verdictBlock:
      "Hardening (Secure Boot, signing, anti-rollback) refuses an unsigned binary: the installation fails and the ECU stays clean.",
  },
  B3: {
    nom: "Abuse of WriteDataByIdentifier (0x2E)",
    resume: "Write data directly into an ECU without being authorised.",
    principe:
      "The 0x2E service writes the value of a data identifier (DID). If it is reachable without proper authentication, you modify internal parameters: calibration, configuration, odometer.",
    pourquoi:
      "Access control is enforced service by service and DID by DID. An overly permissive rights matrix, or a sensitive DID left writable in the default session, is enough to open up writing.",
    methode: [
      "Enter the required diagnostic session (and SecurityAccess if demanded)",
      "Emit 0x2E with the target DID and the new value",
    ],
    prerequis: ["Diagnostic access"],
    effet: "A displayed parameter changes: for example a configuration value or a mileage reading.",
    remediations: [
      "Strict access control by service and by DID",
      "Separation of rights (writing reserved for a secured session)",
    ],
    annexe5: "Families 5 and 6.",
    outils: ["python-udsoncan", "UDS scripts"],
    casReel: "Odometer fraud via UDS is a common and well-documented case.",
    verdictPass:
      "Unhardened interfaces: the sensitive DID is writable, and the value changes.",
    verdictBlock:
      "Hardening restricts 0x2E to the authorised DIDs only, within a secured session: the write is refused.",
  },
  B4: {
    nom: "Abuse of RoutineControl (0x31)",
    resume:
      "Trigger, outside of a service context, an internal ECU routine: brake bleeding, actuator test, relearning.",
    principe:
      "The 0x31 service launches factory/workshop routines (startRoutine). Some drive actuators directly. Reachable without sufficient control, they become physical commands.",
    pourquoi:
      "These routines exist for the aftermarket and act for real on the hardware. Their danger lies in bypassing the normal application logic: they are designed to drive the actuator directly.",
    methode: [
      "Identify the routine identifier for a sensitive actuator",
      "Enter the required session",
      "Launch the routine (0x31 01) with its parameters",
    ],
    prerequis: ["Diagnostic access", "Sufficient session and rights"],
    effet: "An actuator reacts out of context: for example a braking routine is triggered.",
    remediations: [
      "Strict activation conditions (vehicle stationary, secured session)",
      "Per-routine access control",
      "Logging",
    ],
    annexe5: "Families 5 and 6.",
    outils: ["UDS scripts"],
    casReel: "Actuator routines are a known target of aftermarket audits.",
    verdictPass:
      "Without hardening, the routine launches even outside the intended conditions.",
    verdictBlock:
      "Hardening enforces the activation conditions and restricts access to the routine: the trigger is refused.",
  },
  B5: {
    nom: "Denial of service via diagnostic reset (0x11 / 0x3E)",
    resume:
      "Keep an ECU in a diagnostic session, or reset it in a loop, to make it unavailable.",
    principe:
      "An ECU held in a diagnostic session (via TesterPresent 0x3E) may suspend part of its normal functions. Repeating ECUReset (0x11) restarts it endlessly.",
    pourquoi:
      "The diagnostic session is intended for the workshop, with the vehicle immobilised. Nothing always prevents entering and staying in it, or spamming the reset: by default the protocol does not limit the frequency of these requests.",
    methode: [
      "Enter a diagnostic session and send TesterPresent continuously",
      "Or repeat ECUReset to prevent normal operation",
    ],
    prerequis: ["Diagnostic access"],
    effet: "The ECU no longer responds normally: degraded functions, warning lights.",
    remediations: [
      "Prohibit entering a diagnostic session while the vehicle is moving",
      "Rate-limiting of requests",
      "IDS",
    ],
    annexe5: "Families 5 and 2 (availability).",
    outils: ["UDS scripts"],
    casReel: "A known side effect of poorly conditioned diagnostic sessions.",
    verdictPass:
      "Unhardened interfaces: the session stays open or the reset repeats, and the ECU drops out.",
    verdictBlock:
      "Hardening conditions the diagnostic session (vehicle stationary) and limits its frequency: the diagnostic denial of service is blocked.",
  },

  // ---------------------------------------------------------------- Layer C
  C1: {
    nom: "Relay attack on a keyless entry key (PKES)",
    resume: "Extend the key's range to open and start the car without having it.",
    principe:
      "The PKES system unlocks when the key is nearby. Two accomplices relay the signal between the key (in your home) and the vehicle (in the street): the vehicle believes the key is right beside it.",
    pourquoi:
      "PKES infers proximity solely from the received signal strength, without measuring time of flight. A relay lengthens the channel without the system knowing that the key is actually ten metres away... or a hundred.",
    methode: [
      "One device picks up the signal near the key",
      "A second replays it near the vehicle",
      "The vehicle opens and authorises starting",
    ],
    prerequis: ["Proximity to the key and the vehicle", "Two relay radio devices"],
    effet: "The distant key is linked to the vehicle by the relay; the doors open.",
    remediations: [
      "Distance measurement by time of flight (UWB)",
      "Motion sensor in the key (deactivation at rest)",
      "User-selectable RF deactivation",
    ],
    annexe5: "Family 5 (external connectivity).",
    outils: ["relay radio hardware (research)"],
    casReel:
      "Demonstrated on many premium models; relay on the Tesla Model S by KeenLab (2018), countered by UWB on recent generations.",
    verdictPass:
      "A PKES-specific countermeasure is needed: none of the model's countermeasures (SecOC, segmentation, hardening) addresses the relay. It takes UWB or a motion sensor in the key.",
    verdictBlock: "",
  },
  C2: {
    nom: "Compromised infotainment, then pivot to the bus",
    resume: "Enter through the connected screen, then jump all the way to critical functions.",
    principe:
      "Infotainment exposes remote interfaces (cellular, Wi-Fi). A flaw there gives a foothold; if segmentation is insufficient, the attacker reaches the bus and physical functions.",
    pourquoi:
      "Everything hinges on compartmentalisation. Since the CAN identifier is not a sender address, a node that reaches the critical bus can emit anything on it. The gateway is the only thing that can deny passage from one domain to another.",
    methode: [
      "Exploit the IVI remotely via the cellular interface",
      "Reach the microcontroller connected to the bus (the IVI's second core)",
      "Cross the gateway for lack of inter-domain filtering",
      "Inject the command onto the chassis bus",
    ],
    prerequis: ["Remote access (cellular/Wi-Fi)", "An application flaw in the IVI", "Weak segmentation"],
    effet: "The path runs through the gateway from the antenna to the brakes, which come under control.",
    remediations: [
      "Strict segmentation by gateway, inter-domain filtering",
      "Hardening and updating of the IVI",
      "IDS on the critical buses",
    ],
    annexe5: "Families 1 (back-end), 5 (connectivity) and 2.",
    outils: ["reference: Miller & Valasek, Jeep Cherokee 2015"],
    casReel:
      "Jeep Cherokee 2015: remote takeover via Uconnect, reaching steering and brakes. 1.4 million vehicles recalled.",
    verdictPass:
      "Without segmentation, the pivot crosses the gateway and reaches the brakes. SecOC would change nothing here if the attacker emits valid commands.",
    verdictBlock:
      "The gateway rejects the inter-domain pivot: the command never reaches the brakes. The rest of the vehicle keeps working.",
  },
  C3: {
    nom: "Remote exploitation of the telematics unit (TCU)",
    resume: "Attack the on-board modem to enter the vehicle from anywhere.",
    principe:
      "The TCU is connected to the cellular network and to the manufacturer's backend. A flaw on the TCU side opens remote access, potentially at fleet scale.",
    pourquoi:
      "The TCU is a permanent entry point, always reachable, and often connected to the bus. Compromised, it gives the attacker the same position as an internal ECU, but remotely.",
    methode: [
      "Compromise the TCU via its network interface",
      "Rely on its bus connection to emit commands",
      "Repeat the operation on identical vehicles",
    ],
    prerequis: ["Remote access", "A TCU flaw"],
    effet: "Entry through the roof (antenna), a path towards the gateway and the domains.",
    remediations: [
      "Hardening of the TCU",
      "Segmentation (limits the reach once inside the vehicle)",
      "Strong authentication towards the backend",
    ],
    annexe5: "Families 1 and 5.",
    outils: ["general reference"],
    casReel:
      "BMW ConnectedDrive (2015, Dieter Spaar): commands sent remotely over the telematics link on ~2.2 million vehicles.",
    verdictPass:
      "Without segmentation, the compromised TCU reaches the critical domains from the network.",
    verdictBlock:
      "Segmentation confines the TCU: even compromised, it cannot cross the gateway to the critical functions.",
  },
  C4: {
    nom: "Malicious OTA update or rollback",
    resume: "Push a fake update, or force a return to a vulnerable version.",
    principe:
      "If the authenticity and version of updates are not verified, an attacker installs code or brings back an already-patched flaw (rollback).",
    pourquoi:
      "The OTA channel is a remote write capability over the entire fleet. Without signing or anti-rollback, it becomes the ideal vector: massive, persistent, and legitimate in the vehicle's eyes.",
    methode: [
      "Position yourself on the update channel or spoof its source",
      "Push an unsigned package, or replay an older signed but vulnerable version",
    ],
    prerequis: ["A position on the update channel"],
    effet: "An update arrives via the antenna: accepted without defences, rejected with them.",
    remediations: [
      "Update signing and integrity verification",
      "Anti-rollback (refusing earlier versions)",
      "Traceability (RXSWIN, UNECE R156)",
    ],
    annexe5: "Family 3 (update procedures).",
    outils: ["conceptual"],
    casReel:
      "The UNECE R156 regulation specifically mandates an update management system to close this door.",
    verdictPass:
      "Without signature verification or anti-rollback, the malicious package or the older version installs.",
    verdictBlock:
      "Hardening (verified signature, anti-rollback) refuses both an unsigned package and a rollback: the update is rejected.",
  },
  C5: {
    nom: "RollJam: capturing the rolling code (RKE)",
    resume:
      "Jam the remote, capture an unused code and replay it later.",
    principe:
      "Remote entry (RKE) uses a single-use rolling code. The attacker jams the vehicle's reception while capturing the emitted code; the user presses again, the attacker keeps the first valid code and replays it at will.",
    pourquoi:
      "A rolling code is only invalidated once the vehicle has received it. By preventing that reception, the attacker keeps a still-valid code. The vehicle's counter has not advanced: the replay goes through.",
    methode: [
      "Jam the vehicle's reception band",
      "Capture the code(s) emitted by the remote",
      "Let one code through to avoid suspicion, keep the other",
    ],
    prerequis: ["Proximity to the key at the time of use", "An SDR transceiver"],
    effet: "The vehicle unlocks when the captured code is replayed.",
    remediations: [
      "A short validity window on the vehicle side",
      "Clock-bound codes (timestamped rolling code)",
      "Moving to challenge-response protocols",
    ],
    annexe5: "Family 5.",
    outils: ["SDR (research)", "reference: RollJam, Samy Kamkar 2015"],
    casReel: "RollJam, presented by Samy Kamkar in 2015, effective against many rolling-code remotes.",
    verdictPass:
      "An RKE-specific countermeasure is needed: the model's countermeasures do not address the remote's radio. It takes a time window or a challenge-response on the key system side.",
    verdictBlock: "",
  },
  C6: {
    nom: "Bluetooth / BLE exploitation",
    resume:
      "Enter through the infotainment's Bluetooth stack, or relay the BLE unlock of a phone-as-a-key.",
    principe:
      "Two angles: a flaw in the IVI's Bluetooth stack gives a short-range foothold; or, for smartphone access (Phone-as-a-Key), a BLE relay extends the range as with PKES.",
    pourquoi:
      "Bluetooth stacks are large pieces of software, historically buggy. And BLE, like PKES, infers proximity from the signal: a relay fools it, because the BLE specification does not guarantee distance.",
    methode: [
      "Target the IVI's Bluetooth stack for code execution, or",
      "Relay the BLE link between the phone-key and the vehicle",
    ],
    prerequis: ["Bluetooth proximity", "A stack flaw or BLE access without distance measurement"],
    effet: "The IVI comes under control, or the vehicle opens via the BLE relay.",
    remediations: [
      "Bluetooth stack updates",
      "Distance measurement (UWB) for phone-based access",
      "Hardening and isolation of the IVI",
    ],
    annexe5: "Families 5 and 7.",
    outils: ["reference: Tesla BLE relay, NCC Group 2022"],
    casReel:
      "BLE relay on Tesla (NCC Group, 2022): unlock and start despite encryption, because distance was not verified.",
    verdictPass:
      "Without hardening/updating of the IVI, the Bluetooth flaw gives exploitable local access.",
    verdictBlock:
      "Hardening (up-to-date stack, isolated IVI) closes the application flaw. A pure BLE relay, however, calls for a UWB-type countermeasure on the access side.",
  },
  C7: {
    nom: "Rogue cellular base station",
    resume:
      "Lure the TCU onto a fake antenna to intercept or manipulate its traffic.",
    principe:
      "A rogue base station (IMSI catcher / rogue femtocell) impersonates the network. The TCU attaches to it, especially if it still accepts 2G or does not validate the network.",
    pourquoi:
      "Cellular attachment favours the strongest signal, and 2G does not authenticate the network to the terminal. A more powerful rogue antenna therefore captures the TCU and positions itself between it and the backend.",
    methode: [
      "Emit a rogue cell stronger than the legitimate network",
      "Force the TCU to fall back to a weak mode (2G)",
      "Intercept or alter the traffic towards the backend",
    ],
    prerequis: ["Proximity to the vehicle", "Cellular radio hardware"],
    effet: "The TCU's traffic passes through the attacker; commands and updates become manipulable.",
    remediations: [
      "Prohibit 2G fallback",
      "Mutual TLS between TCU and backend (pinned certificates)",
      "Network anomaly detection",
    ],
    annexe5: "Families 1 and 5.",
    outils: ["cellular SDR (research)"],
    casReel: "A proven technique against many poorly configured cellular connected devices.",
    verdictPass:
      "Without hardening (2G fallback allowed, no pinning), the TCU talks to the rogue antenna.",
    verdictBlock:
      "Hardening (no 2G, pinned mutual TLS) prevents the rogue attachment and the interception.",
  },
  C8: {
    nom: "Companion app and API abuse",
    resume:
      "Abuse the mobile app's API to command another user's vehicle.",
    principe:
      "The companion app drives the vehicle through a backend API. Insufficient access controls (broken object-level authorisation, unverified direct references) allow actions on a vehicle that is not your own.",
    pourquoi:
      "This is classic web security applied to the car: if the backend checks who you are but not what you are entitled to, knowing another vehicle's identifier is enough to send it commands.",
    methode: [
      "Observe the mobile app's calls",
      "Replay a call while changing the target vehicle's identifier",
      "Trigger remote functions (location, unlocking, climate control)",
    ],
    prerequis: ["An account on the service", "An API with weak access controls"],
    effet: "Remote commands go out to a third party's vehicle through the backend.",
    remediations: [
      "Object-level authorisation on the backend (verified account-to-vehicle link)",
      "API testing (direct references, enumeration)",
      "Logging and rate-limiting",
    ],
    annexe5: "Family 1 (back-end and services).",
    outils: ["web API testing tools"],
    casReel:
      "Nissan Leaf (Troy Hunt, 2016): the API only checked the VIN, allowing action on other vehicles. Many similar cases since (Sam Curry et al., 2023).",
    verdictPass:
      "Unhardened backend: the API accepts a command on a vehicle that does not belong to the account.",
    verdictBlock:
      "Hardening (object-level authorisation) verifies that the vehicle really belongs to the account: the cross-account command is refused.",
  },
  C9: {
    nom: "Backend compromise (fleet)",
    resume:
      "Take over the manufacturer's backend, and with it the ability to act on thousands of vehicles.",
    principe:
      "The backend orchestrates telematics, updates and remote commands. Compromised, it offers leverage across the entire fleet.",
    pourquoi:
      "It is the point of convergence: a single system talks to every vehicle with an established trust relationship. The scope of the attack is no longer one vehicle, but the whole fleet. It is the dominant vector in recent incidents.",
    methode: [
      "Compromise a backend or supplier component",
      "Abuse the backend -> vehicles trust relationship",
      "Push commands or updates at scale",
    ],
    prerequis: ["Access to a link in the backend or the supplier chain"],
    effet: "Entry via the antenna, a path towards the gateway, replicable across an entire fleet.",
    remediations: [
      "Backend security (segmentation, least privilege, monitoring)",
      "On-board segmentation (limits what a backend order can do)",
      "Strong authentication and signing of orders",
    ],
    annexe5: "Family 1.",
    outils: ["general reference"],
    casReel:
      "In 2024-2025, telematics, cloud and APIs account for roughly two thirds of public automotive attacks (Upstream report).",
    verdictPass:
      "Without on-board segmentation, an order from the compromised backend reaches the critical functions.",
    verdictBlock:
      "Segmentation limits what a backend order can trigger on board: the reach of a cloud compromise is contained.",
  },

  // ---------------------------------------------------------------- Layer D
  D1: {
    nom: "UDS over IP (DoIP)",
    resume: "The same UDS diagnostics, but encapsulated in Automotive Ethernet.",
    principe:
      "DoIP (ISO 13400) carries UDS over IP. The same sensitive services (0x27, 0x34) are reachable, potentially at greater range and higher throughput.",
    pourquoi:
      "Moving to IP brings network speed and range, but also its weaknesses: if the DoIP interface is reachable without network authentication, it is UDS exposed like an ordinary TCP service.",
    methode: [
      "Reach the DoIP interface (port 13400)",
      "Establish the session and converse in UDS over IP",
      "Chain into SecurityAccess and reflashing (B1, B2) at higher throughput",
    ],
    prerequis: ["Access to the on-board Ethernet network"],
    effet: "An IP flow towards an ECU; the UDS services are played over IP.",
    remediations: [
      "Authentication and network segmentation (VLAN)",
      "On-board firewall, TLS",
      "Hardening of the UDS services (see layer B)",
    ],
    annexe5: "Families 5 and 2.",
    outils: ["python-doipclient", "DoIP scripts"],
    casReel: "DoIP is the diagnostic standard for recent Ethernet-architecture vehicles.",
    verdictPass:
      "A reachable DoIP interface and unhardened UDS: diagnostics over IP opens everything, faster.",
    verdictBlock:
      "Network segmentation and service hardening close off unauthorised DoIP access and block the sensitive requests.",
  },
  D2: {
    nom: "SOME/IP spoofing and Ethernet MITM",
    resume:
      "Spoof the service-oriented communication on the vehicle's Ethernet.",
    principe:
      "SOME/IP is the service middleware on Automotive Ethernet. Without authentication, you spoof a service or position yourself as a man-in-the-middle (via ARP spoofing), as on a classic IP network.",
    pourquoi:
      "SOME/IP provides no authentication by default, and service discovery (SOME/IP-SD) advertises who offers what. The attacker declares themselves the provider of a service, or hijacks the traffic between two ECUs.",
    methode: [
      "Discover the advertised services (SOME/IP-SD)",
      "Spoof a service or position yourself as MITM (ARP spoofing)",
      "Inject false service data (e.g. ADAS perception)",
    ],
    prerequis: ["Access to the on-board Ethernet network"],
    effet: "A service is hijacked or a flow intercepted between two Ethernet ECUs.",
    remediations: [
      "Service authentication",
      "VLAN segmentation and filtering",
      "Encryption and ARP-spoofing detection",
    ],
    annexe5: "Family 2.",
    outils: ["adapted classic network tools", "SOME/IP scripts"],
    casReel: "An emerging attack surface of zonal Ethernet architectures.",
    verdictPass:
      "Without segmentation or service authentication, SOME/IP spoofing goes through.",
    verdictBlock:
      "Segmentation (VLAN, filtering) prevents a node from spoofing a service or positioning itself as MITM outside its zone.",
  },
  D3: {
    nom: "Real-time Ethernet disruption (AVB/TSN)",
    resume:
      "Break the synchronisation or priority of the real-time flows on the on-board Ethernet.",
    principe:
      "AVB/TSN guarantees timely delivery of critical flows (ADAS video, audio) through a common clock (gPTP) and bandwidth reservation. Falsifying the clock or saturating a traffic class degrades these guarantees.",
    pourquoi:
      "The real-time guarantees rest on trust in the clock master and in the reservation. A malicious node that declares itself gPTP master or floods a priority class makes the critical flows miss their deadlines.",
    methode: [
      "Spoof the gPTP clock master, or",
      "Saturate a priority traffic class",
      "Degrade the dependent real-time flows (perception, display)",
    ],
    prerequis: ["Access to the on-board Ethernet network"],
    effet: "The real-time flows miss their deadlines: choppy video, late data.",
    remediations: [
      "Authentication of the clock master",
      "VLAN isolation and flow admission control",
      "Monitoring of the TSN metrics",
    ],
    annexe5: "Family 2 (availability and timing integrity).",
    outils: ["real-time network tools (research)"],
    casReel: "A surface specific to recent real-time Ethernet architectures.",
    verdictPass:
      "Without segmentation or admission control, a node degrades the real-time guarantees.",
    verdictBlock:
      "Segmentation (VLAN, admission control, authenticated clock master) confines the node and protects the critical flows.",
  },
  D4: {
    nom: "V2X message spoofing",
    resume:
      "Emit false vehicle-to-everything (V2X) messages to deceive perception or driver assistance.",
    principe:
      "V2X (802.11p / C-V2X) lets vehicles exchange position and alerts. False messages (a phantom vehicle, a false emergency braking) can mislead the functions that rely on them.",
    pourquoi:
      "V2X relies on a certificate infrastructure (SCMS) to authenticate senders. If certificate validation is weak or bypassed, a forged message becomes credible. GNSS, for its part, can also be fooled (GPS spoofing).",
    methode: [
      "Emit forged V2X messages (position, alert)",
      "Or spoof GNSS to falsify the perceived position",
      "Exploit insufficient certificate validation",
    ],
    prerequis: ["A V2X or GNSS radio transmitter", "Weak certificate validation"],
    effet: "A false vehicle or a false alert appears to perception / driver assistance.",
    remediations: [
      "Strict V2X certificate validation (SCMS)",
      "Multi-sensor fusion (do not rely on V2X/GNSS alone)",
      "GNSS inconsistency detection",
    ],
    annexe5: "Families 2 and 5.",
    outils: ["SDR (research)", "reference: Regulus/Tesla GPS spoofing 2019"],
    casReel:
      "Regulus spoofed the GPS of a Tesla on Autopilot (2019), causing unsolicited manoeuvres.",
    verdictPass:
      "Without strict validation, the forged V2X message is accepted and deceives perception.",
    verdictBlock:
      "Hardening (SCMS validation, multi-sensor fusion) rejects unauthenticated messages and cross-checks the sources.",
  },

  // ---------------------------------------------------------------- Layer E
  E1: {
    nom: "Access via debug port (JTAG / SWD)",
    resume:
      "Use a debug port left accessible to take control of an ECU.",
    principe:
      "JTAG/SWD give full control of the microcontroller: memory read/write, halt, single-step. Left active in production, they open the door to extraction and modification.",
    pourquoi:
      "These interfaces exist for development and production. If they are not disabled or locked before series production, they remain a manufacturer-level access offered to anyone who opens the enclosure.",
    methode: [
      "Locate the debug port's test points on the board",
      "Connect to them with a probe",
      "Read/modify the memory and the execution flow",
    ],
    prerequis: ["Physical access to the ECU", "A debug probe"],
    effet: "The ECU is entirely under control: code and secrets exposed.",
    remediations: [
      "Disabling or locking the debug ports in production",
      "Security fuses (component lifecycle)",
      "Enclosure-opening detection",
    ],
    annexe5: "Families 6 and 7.",
    outils: ["JTAG/SWD probes (hardware research)"],
    casReel: "A frequent starting point for the hardware analysis of an ECU.",
    verdictPass:
      "A debug port left active: full access to the ECU.",
    verdictBlock:
      "Hardening (locked debug, security fuses) makes the port unusable in production.",
  },
  E2: {
    nom: "Firmware extraction (memory dump)",
    resume:
      "Recover an ECU's firmware to analyse it and find keys and flaws.",
    principe:
      "By reading the memory (via debugging, or directly from the chip), you obtain the firmware. Analysing it reveals seed/key algorithms, keys, and vulnerabilities reusable across every unit.",
    pourquoi:
      "A firmware extracted once serves against the entire fleet: it exposes the shared secrets (algorithms, production keys) and lets logical attacks be prepared offline, with no limit on attempts.",
    methode: [
      "Read the memory via the debug port, or remove/read the chip (chip-off)",
      "Reconstruct and disassemble the firmware",
      "Extract algorithms, keys and flaws from it",
    ],
    prerequis: ["Physical access to the ECU", "Readout protection absent or bypassed"],
    effet: "The ECU's contents are exfiltrated for offline analysis.",
    remediations: [
      "Memory readout protection",
      "Firmware encryption and secrets in an HSM",
      "Locking the component's lifecycle",
    ],
    annexe5: "Families 6 and 7.",
    outils: ["memory programmers, chip reading (hardware research)"],
    casReel: "A classic prerequisite for reverse-engineering seed/key algorithms (see B1).",
    verdictPass:
      "Without readout protection, the memory is dumped and gives up its secrets.",
    verdictBlock:
      "Hardening (readout protection, encrypted firmware, keys in an HSM) makes the extraction fruitless.",
  },
  E3: {
    nom: "Secure Boot bypass via fault injection",
    resume:
      "Briefly disrupt the ECU at the right moment to skip the signature check at boot.",
    principe:
      "Fault injection (a voltage or clock glitch) causes a momentary computation error. Aimed at the instant of the signature check, it makes a test that should have failed pass instead.",
    pourquoi:
      "Secure Boot relies on a comparison at a precise instant. A hardware fault can corrupt this single test (skipping a conditional jump), opening the execution of unsigned firmware even if the cryptography itself is sound.",
    methode: [
      "Identify the instant of the signature check",
      "Inject a fault (voltage/clock) at that precise instant",
      "Make unsigned firmware execute",
    ],
    prerequis: ["Physical access", "Fault-injection hardware and timing tuning"],
    effet: "Secure Boot is bypassed; unsigned code runs.",
    remediations: [
      "Anti-glitch countermeasures (double checking, detectors)",
      "Redundant and randomised checks",
      "Voltage/clock sensors",
    ],
    annexe5: "Families 6 and 7.",
    outils: ["fault-injection platforms (research, e.g. ChipWhisperer)"],
    casReel: "A proven hardware-security technique, applied to embedded ECUs.",
    verdictPass:
      "Without anti-fault countermeasures, the glitch skips the check and unsigned code runs.",
    verdictBlock:
      "Hardening (double checking, glitch detectors) makes fault injection unreliable and preserves Secure Boot.",
  },
  E4: {
    nom: "Charging denial (ISO 15118 / CCS)",
    resume:
      "Remotely interrupt an electric vehicle's fast charging by jamming its communication with the charger.",
    principe:
      "CCS fast charging has the vehicle and the charger communicate over power-line (HomePlug Green PHY) following ISO 15118. A wireless jamming signal is enough to cut off this dialogue and stop the charge.",
    pourquoi:
      "The physical communication layer radiates and is not protected against jamming. The attack targets the signal itself, not the cryptography: cutting off the conversation is enough to stop the charge, remotely and without contact.",
    methode: [
      "Emit a jamming signal on the power-line band",
      "Break the vehicle <-> charger communication",
      "Sustain the jamming to prevent recovery",
    ],
    prerequis: ["Proximity to a charging vehicle", "A suitable radio transmitter"],
    effet: "The charging session is interrupted; charging becomes unavailable.",
    remediations: [
      "Shielding and robustness of the physical layer",
      "Jamming detection and automatic recovery",
      "Fallback communication",
    ],
    annexe5: "Family 2 (availability), charging ecosystem.",
    outils: ["SDR (research), reference: Brokenwire 2022"],
    casReel:
      "Brokenwire (2022, Oxford / armasuisse): stopping CCS charging from several metres away by simple wireless jamming.",
    verdictPass:
      "An attack on the radio physical layer: the model's countermeasures (SecOC, segmentation, logical hardening) change nothing. It takes a jamming-resistance countermeasure.",
    verdictBlock: "",
  },
};
