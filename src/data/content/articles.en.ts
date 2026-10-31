import type { Article } from "../articles";

// English translation of the "Analyses" articles. Mirrors fr in articles.ts
// (slugs, order, section ids and block types). Convention: plain ASCII.

// --- Vector diagrams (trusted content, injected as-is). Same markup as FR,
// --- only the human-readable labels are translated.

const SVG_TESLA_TIMING_EN = `<svg viewBox="0 0 640 248" role="img" aria-label="Timing chart: the voltage drop is aligned with the signature comparison">
  <text x="0" y="16" font-size="12" class="dg-faint">RUNNING IN ROM (time -&gt;)</text>
  <rect x="0" y="28" width="640" height="36" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="16" y="51" font-size="12" class="dg-soft">reads the next stage</text>
  <rect x="244" y="26" width="156" height="40" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="322" y="51" text-anchor="middle" font-size="12">compares the signature</text>
  <text x="470" y="51" font-size="12" class="dg-soft">launches the stage</text>
  <text x="0" y="108" font-size="12" class="dg-faint">CORE VOLTAGE (Vcore)</text>
  <path d="M0 156 H286 L300 156 L309 212 L329 212 L338 156 H640" fill="none" stroke="var(--ok)" stroke-width="2.5"/>
  <path d="M300 156 L309 212 L329 212 L338 156" fill="none" stroke="var(--attack)" stroke-width="3"/>
  <line x1="322" y1="66" x2="322" y2="150" stroke="var(--attack)" stroke-width="1" stroke-dasharray="4 4"/>
  <text x="348" y="200" font-size="11" fill="var(--attack)">~40 ns drop</text>
  <text x="0" y="240" font-size="12.5">Instruction skipped: the comparison returns <tspan fill="var(--attack)">"valid"</tspan>, unsigned code is accepted.</text>
</svg>`;

const SVG_TESLA_SVI2_EN = `<svg viewBox="0 0 640 236" role="img" aria-label="Setup: a microcontroller injects on the SVI2 bus between the processor and its voltage regulator">
  <rect x="16" y="40" width="210" height="122" rx="9" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="121" y="64" text-anchor="middle" font-size="13">SoC AMD Ryzen</text>
  <rect x="42" y="82" width="158" height="58" rx="7" fill="none" stroke="var(--powertrain)" stroke-width="2"/>
  <text x="121" y="106" text-anchor="middle" font-size="12.5" fill="var(--powertrain)">ASP / PSP</text>
  <text x="121" y="125" text-anchor="middle" font-size="10.5" class="dg-faint">root of trust</text>
  <rect x="438" y="58" width="186" height="86" rx="9" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="531" y="92" text-anchor="middle" font-size="13">Regulator</text>
  <text x="531" y="114" text-anchor="middle" font-size="11" class="dg-faint">supplies Vcore</text>
  <line x1="226" y1="101" x2="438" y2="101" stroke="var(--accent)" stroke-width="2.5"/>
  <text x="332" y="92" text-anchor="middle" font-size="12.5" fill="var(--accent)" class="dg-mono">SVI2</text>
  <text x="332" y="120" text-anchor="middle" font-size="10.5" class="dg-faint">voltage command</text>
  <line x1="332" y1="101" x2="332" y2="176" stroke="var(--attack)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <rect x="246" y="176" width="172" height="52" rx="7" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="332" y="199" text-anchor="middle" font-size="12" fill="var(--attack)">microcontroller (~100 $)</text>
  <text x="332" y="217" text-anchor="middle" font-size="10.5" fill="var(--attack)">injects a drop command</text>
</svg>`;

const SVG_TESLA_BOOT_EN = `<svg viewBox="0 0 540 324" role="img" aria-label="Vertical boot chain and the glitch injection point">
  <defs><marker id="ahT" markerWidth="9" markerHeight="9" refX="4.5" refY="7" orient="auto"><path d="M0 0 L4.5 7 L9 0" fill="none" stroke="var(--ink-faint)" stroke-width="1.5"/></marker></defs>
  <rect x="24" y="6" width="252" height="44" rx="7" fill="var(--surface-2)" stroke="var(--attack)" stroke-width="2"/>
  <text x="150" y="27" text-anchor="middle" font-size="12.5">masked ROM (ASP)</text>
  <text x="150" y="43" text-anchor="middle" font-size="10.5" class="dg-faint">etched in silicon, immutable</text>
  <line x1="150" y1="50" x2="150" y2="68" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <text x="292" y="56" font-size="11" class="dg-soft">verifies the stage signature</text>
  <text x="292" y="70" font-size="11" fill="var(--attack)">GLITCH here: check skipped</text>
  <rect x="24" y="74" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="99" text-anchor="middle" font-size="12.5">PSP bootloader</text>
  <line x1="150" y1="114" x2="150" y2="132" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="138" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="163" text-anchor="middle" font-size="12.5">ABL (AMD loader)</text>
  <line x1="150" y1="178" x2="150" y2="196" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="202" width="252" height="40" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="150" y="227" text-anchor="middle" font-size="12.5">UEFI</text>
  <line x1="150" y1="242" x2="150" y2="260" stroke="var(--ink-faint)" stroke-width="1.5" marker-end="url(#ahT)"/>
  <rect x="24" y="266" width="252" height="44" rx="7" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="150" y="287" text-anchor="middle" font-size="12.5">Linux kernel</text>
  <text x="150" y="303" text-anchor="middle" font-size="10.5" fill="var(--ok)">root shell, unsigned code accepted</text>
  <text x="292" y="289" font-size="11" class="dg-soft">firmware patched</text>
  <text x="292" y="303" font-size="11" class="dg-soft">going back up the chain</text>
</svg>`;

const SVG_CAN_TOPO_EN = `<svg viewBox="0 0 640 232" role="img" aria-label="Topology: the control bus, the gateway and the powertrain bus, with the injection point at the headlight">
  <text x="30" y="20" font-size="11" class="dg-faint">CONTROL BUS</text>
  <line x1="30" y1="70" x2="300" y2="70" stroke="var(--chassis)" stroke-width="3"/>
  <line x1="70" y1="70" x2="70" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="24" y="92" width="92" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="70" y="110" text-anchor="middle" font-size="11">key</text>
  <text x="70" y="124" text-anchor="middle" font-size="11">receiver</text>
  <line x1="170" y1="70" x2="170" y2="92" stroke="var(--attack)" stroke-width="1.5"/>
  <rect x="126" y="92" width="88" height="40" rx="6" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="170" y="116" text-anchor="middle" font-size="11" fill="var(--attack)">front headlight</text>
  <line x1="262" y1="70" x2="262" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="222" y="92" width="76" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="260" y="116" text-anchor="middle" font-size="11">doors</text>
  <rect x="300" y="48" width="110" height="46" rx="7" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="355" y="76" text-anchor="middle" font-size="12">gateway</text>
  <text x="430" y="20" font-size="11" class="dg-faint">POWERTRAIN BUS</text>
  <line x1="410" y1="70" x2="620" y2="70" stroke="var(--powertrain)" stroke-width="3"/>
  <line x1="515" y1="70" x2="515" y2="92" stroke="var(--line)" stroke-width="1.5"/>
  <rect x="462" y="92" width="106" height="40" rx="6" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="515" y="110" text-anchor="middle" font-size="11">engine +</text>
  <text x="515" y="124" text-anchor="middle" font-size="11">immobilizer</text>
  <rect x="104" y="170" width="132" height="46" rx="7" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="170" y="190" text-anchor="middle" font-size="11.5" fill="var(--attack)">injector</text>
  <text x="170" y="206" text-anchor="middle" font-size="10" fill="var(--attack)">tapped onto the harness</text>
  <line x1="170" y1="132" x2="170" y2="170" stroke="var(--attack)" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="300" y="112" font-size="10.5" class="dg-soft">relays without checking -&gt;</text>
</svg>`;

const SVG_CAN_OVERRIDE_EN = `<svg viewBox="0 0 640 220" role="img" aria-label="The injector holds the bus recessive, forces the genuine node to back off and imposes its frame">
  <text x="152" y="18" font-size="11" class="dg-faint">time -&gt;</text>
  <text x="0" y="48" font-size="11.5" class="dg-soft">Key</text>
  <text x="0" y="62" font-size="11.5" class="dg-soft">receiver</text>
  <rect x="150" y="34" width="110" height="34" rx="5" fill="var(--surface-2)" stroke="var(--ok)"/>
  <text x="205" y="55" text-anchor="middle" font-size="10.5">"no key"</text>
  <rect x="272" y="34" width="86" height="34" rx="5" fill="none" stroke="var(--attack)"/>
  <text x="315" y="55" text-anchor="middle" font-size="10.5" fill="var(--attack)">fails</text>
  <line x1="370" y1="51" x2="632" y2="51" stroke="var(--ink-faint)" stroke-width="1.2" stroke-dasharray="5 5"/>
  <text x="500" y="47" text-anchor="middle" font-size="10.5" class="dg-faint">backs off, silent (error recovery)</text>
  <text x="0" y="120" font-size="11.5" class="dg-soft">Injector</text>
  <rect x="150" y="104" width="208" height="34" rx="5" fill="var(--surface-2)" stroke="var(--accent)"/>
  <text x="254" y="125" text-anchor="middle" font-size="10.5" fill="var(--accent)">holds the bus recessive (blocks the others)</text>
  <rect x="372" y="104" width="160" height="34" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="452" y="125" text-anchor="middle" font-size="10.5" fill="var(--attack)">sends "key valid"</text>
  <text x="0" y="188" font-size="11.5" class="dg-soft">What the</text>
  <text x="0" y="202" font-size="11.5" class="dg-soft">network reads</text>
  <rect x="372" y="172" width="160" height="34" rx="5" fill="var(--surface-2)" stroke="var(--attack)" stroke-width="2"/>
  <text x="452" y="193" text-anchor="middle" font-size="10.5" fill="var(--attack)">"key valid" x20 / s</text>
  <line x1="452" y1="138" x2="452" y2="172" stroke="var(--attack)" stroke-width="1.2" stroke-dasharray="3 3"/>
</svg>`;

const SVG_CAN_SECOC_EN = `<svg viewBox="0 0 640 210" role="img" aria-label="With SecOC, a frame carries an authentication code and a freshness counter; the forged frame is rejected">
  <text x="0" y="20" font-size="11" class="dg-faint">AUTHENTICATED FRAME (SecOC)</text>
  <rect x="0" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="75" y="50" text-anchor="middle" font-size="11" class="dg-mono">0x043</text>
  <text x="75" y="64" text-anchor="middle" font-size="10" class="dg-faint">identifier</text>
  <rect x="158" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="233" y="50" text-anchor="middle" font-size="11">data</text>
  <text x="233" y="64" text-anchor="middle" font-size="10" class="dg-faint">"key valid"</text>
  <rect x="316" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="391" y="50" text-anchor="middle" font-size="11" fill="var(--ok)">MAC</text>
  <text x="391" y="64" text-anchor="middle" font-size="10" class="dg-faint">authentication code</text>
  <rect x="474" y="32" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--ok)" stroke-width="2"/>
  <text x="549" y="50" text-anchor="middle" font-size="11" fill="var(--ok)">counter</text>
  <text x="549" y="64" text-anchor="middle" font-size="10" class="dg-faint">freshness (anti-replay)</text>
  <text x="0" y="118" font-size="11" class="dg-faint">FRAME FORGED BY THE INJECTOR</text>
  <rect x="0" y="130" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="75" y="155" text-anchor="middle" font-size="11" class="dg-mono">0x043</text>
  <rect x="158" y="130" width="150" height="40" rx="5" fill="var(--surface-2)" stroke="var(--line)"/>
  <text x="233" y="155" text-anchor="middle" font-size="11">data</text>
  <rect x="316" y="130" width="308" height="40" rx="5" fill="none" stroke="var(--attack)" stroke-width="2"/>
  <text x="470" y="155" text-anchor="middle" font-size="11" fill="var(--attack)">invalid MAC (no key) -&gt; frame rejected</text>
</svg>`;

export const articlesEn: Article[] = [
  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 14,
    vector: "hardware",
    tags: ["Fault injection", "Secure boot", "Root of trust", "AMD", "SVI2", "Jailbreak"],
    title: "Tesla: a voltage glitch to break the root of trust",
    dek:
      "In 2023, four TU Berlin researchers make a Tesla's AMD secure processor stumble by disturbing its power supply through the SVI2 bus. The payoff: arbitrary code on the root of trust, extraction of an identity key, and a jailbreak that software cannot patch.",
    fiche: {
      cible: "Tesla with AMD Ryzen infotainment (the MCU board known as MCU-Z), on recent Model 3, Y, S and X.",
      entree: "Physical access to the MCU board, specifically to the SVI2 bus that commands the voltage of the AMD secure processor (ASP).",
      methode:
        "Voltage glitching: a tiny voltage drop, timed to the moment the ROM verifies the firmware signature, makes that check fail.",
      faille: "A root of trust in masked ROM, with no protection against fault injection: nothing to patch in the field.",
    },
    sections: [
      {
        id: "contexte",
        heading: "The root of trust in a Tesla",
        blocks: [
          {
            t: "p",
            text: "A recent Tesla's infotainment runs on an AMD Ryzen x86 processor. Its entire startup is locked down by a dedicated component, the AMD secure processor (ASP, also called PSP): at power-on, it verifies the signature of every software stage before launching it. This chain is the system's root of trust. It guards three things: the activation of paid options, the key that proves the car's identity to the Tesla service network, and the encryption of user data.",
          },
          {
            t: "p",
            text: "Break that link and you get everything at once. That is exactly what a TU Berlin team did, in two talks: \"Jailbreaking an Electric Vehicle in 2023\" at Black Hat USA, then \"Back in the Driver's Seat\" at the 37th Chaos Communication Congress.",
          },
          {
            t: "note",
            text:
              "Work by Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob and Oleg Drokin (TU Berlin). The attack reuses an earlier AMD glitch, \"One Glitch to Rule Them All\" (2021), of which Jacob is a co-author.",
          },
        ],
      },
      {
        id: "glitch",
        heading: "Voltage glitching, explained",
        blocks: [
          {
            t: "p",
            text: "A processor assumes a stable power supply. If you make it drop very briefly, by a few tens of nanoseconds, at the precise moment it executes a sensitive instruction, it stumbles: the instruction is skipped or mis-executed. Applied right on the comparison that validates a signature, this fault turns a failure into a success.",
          },
          {
            t: "p",
            text: "The key point: you are not attacking the cryptography. The RSA signature stays sound; you simply stop the processor from verifying it. The comparison \"is the computed signature equal to the expected one?\" returns \"yes\" when it should return \"no\". Unsigned code passes as if it were legitimate.",
          },
          {
            t: "svg",
            caption: "The voltage drop is aligned with the comparison instruction.",
            src: SVG_TESLA_TIMING_EN,
          },
          {
            t: "p",
            text: "All the difficulty is in the timing. You have to find the brief window where verification happens, trigger the drop at that instant, and start over until it lands. It is slow to tune; once the window is known, the attack is repeatable.",
          },
          {
            t: "note",
            text:
              "The glitch is not persistent: it must be replayed at every boot to get past the check. On the other hand, what you place into the system afterwards (configuration changes) can survive reboots.",
          },
        ],
      },
      {
        id: "svi2",
        heading: "Where to strike: the SVI2 bus",
        blocks: [
          {
            t: "p",
            text: "How do you drop the voltage of a chip you do not open? The trick is that the secure processor commands its own core voltage. It does so through a small serial bus, SVI2, which drives an external voltage regulator (the VRM) on the board. That command bus is accessible, and that is where the attacker taps in.",
          },
          {
            t: "p",
            text: "A microcontroller costing about a hundred dollars, wired to the SVI2, injects a forged command that tells the regulator to produce a very short voltage drop. By aligning that drop with the verification window, you get the fault you want without ever touching the processor's silicon.",
          },
          {
            t: "svg",
            caption: "The microcontroller injects on the voltage-command bus, between the ASP and the regulator.",
            src: SVG_TESLA_SVI2_EN,
          },
          {
            t: "p",
            text: "This is the heart of \"One Glitch to Rule Them All\" (Buhren et al., 2021), which the Tesla team reuses: the boot code in ROM loads the next stage from flash memory and verifies its RSA signature; the glitch strikes that verification; a single successful fault is enough to make the ROM run code of the attacker's choosing.",
          },
        ],
      },
      {
        id: "chaine",
        heading: "The boot chain and the patched firmware",
        blocks: [
          {
            t: "p",
            text: "Once the ROM is past, the remaining stages must be chained together. The team patches the firmware by going back up the chain, from the last stage to the first. The problem: a modified stage no longer has the right hash, and the previous stage, which checks it, would refuse to launch it. The workaround is to combine the two: the glitch neutralizes the ROM's verification, which lets the patched chain run all the way through. The result: a root shell on the infotainment's Linux.",
          },
          {
            t: "svg",
            caption: "The glitch breaks the first lock; the patched firmware does the rest.",
            src: SVG_TESLA_BOOT_EN,
          },
          {
            t: "ol",
            items: [
              "Remove the MCU board, locate the SVI2 bus and the regulator that powers the secure processor core.",
              "Wire a microcontroller (about 100 $) to the SVI2, and an oscilloscope to observe startup.",
              "Pin down the window where the ROM verifies the next stage's signature.",
              "Inject a voltage-drop command aligned with that comparison, and repeat until the fault lands.",
              "Get the patched boot stage accepted: the root of trust now runs unsigned code.",
              "Roll out the patched chain (bootloader, ABL, UEFI, Linux) up to persistent root access.",
              "Extract the chip-bound secrets: the identity key and the keys that encrypt the data.",
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
              ["Persistent jailbreak", "Root access on the infotainment's Linux, surviving reboots and updates."],
              ["Extraction of the identity key", "The hardware-bound key that authenticates the car to the Tesla network: enough to migrate, or even clone, a vehicle's identity."],
              ["Paid options", "Heated seats, acceleration boost and other software-locked features, activated without paying (a simple configuration flip, so persistent)."],
              ["User data", "Decryption of the personal data encrypted by the system: address book, calendar, location history, service sessions."],
            ],
          },
        ],
      },
      {
        id: "outillage",
        heading: "The toolkit",
        blocks: [
          {
            t: "deflist",
            items: [
              { term: "Microcontroller on SVI2 (about 100 $)", def: "A Teensy or equivalent, wired to the voltage-command bus. It forges the drop command. This is the heart of the attack, and it costs almost nothing." },
              { term: "Oscilloscope / logic analyzer", def: "To observe startup and find the time window where verification happens." },
              { term: "Soldering iron and physical access", def: "You have to open the MCU board and tap onto the SVI2 and the power rail." },
              { term: "Prior art", def: "The AMD glitch from 'One Glitch to Rule Them All' (2021), then the team's 2025 follow-up, 'Three Glitches to Rule One Car' (ASIACCS), on the driver-assistance computer." },
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "What went wrong",
        blocks: [
          {
            t: "ul",
            items: [
              "The root of trust assumes the ROM always enforces its verification. Fault injection breaks that assumption: you do not attack the crypto, you stop the processor from verifying it.",
              "The processor commands its own voltage through SVI2: that command bus is an accessible injection point on the board.",
              "The boot code lives in masked ROM, etched in silicon: it cannot be patched by an update.",
              "The chip does not detect power anomalies (no glitch detector, no double verification): a single fault is enough.",
            ],
          },
        ],
      },
      {
        id: "patch",
        heading: "Why it cannot be patched",
        blocks: [
          {
            t: "p",
            text: "The boot code lives in masked ROM, that is, etched into the silicon at manufacturing. A software fix cannot add anything to it: there is no way to place a countermeasure where the fault strikes. And since the attack does not break the cryptography but bypasses it, strengthening keys or signatures changes nothing.",
          },
          {
            t: "p",
            text: "The only real fix is in hardware: silicon resistant to fault injection (voltage and clock detectors, double verification, internal voltage ramps). In other words, replacing the chip. Since AMD also supplies other manufacturers, the class of problem goes beyond Tesla. On the server side, Tesla can limit the value of an extracted key by hardening vehicle re-authentication (a zero-trust approach).",
          },
          {
            t: "note",
            text:
              "In 2025, the same team followed up with 'Three Glitches to Rule One Car' (ASIACCS), carrying the approach over to the driver-assistance computer.",
          },
        ],
      },
      {
        id: "portee",
        heading: "Scope and limits",
        blocks: [
          {
            t: "p",
            text: "This is not a remote mass-theft: it needs physical access, hardware, and tuning time per unit. But on one count it is worse than theft: the attack breaks a hardware trust anchor and lets you clone a vehicle's identity. And because the flaw is in the silicon, it cannot be fixed by software.",
          },
        ],
      },
    ],
    sources: [
      { label: "Christian Werling (TU Berlin) : page de recherche et publications", url: "https://www.user.tu-berlin.de/cwerling/" },
      { label: "Mayhem Security : Jailbreaking Teslas at Black Hat USA 2023", url: "https://www.mayhem.security/blog/jailbreaking-teslas-at-black-hat-usa-2023" },
      { label: "VicOne : Tesla jailbreak via firmware patching and voltage glitching", url: "https://vicone.com/blog/tesla-jailbreak-unlocks-features-via-firmware-patching-and-voltage-glitching" },
      { label: "Hackaday : jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "One Glitch to Rule Them All : fault injection contre l'ASP AMD (arXiv)", url: "https://arxiv.org/abs/2108.04575" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 14,
    vector: "can",
    tags: ["CAN bus", "Frame injection", "Arbitration", "Keyless theft", "Gateway", "SecOC"],
    title: "Theft through the headlight: anatomy of a CAN injection",
    dek:
      "In 2023, Ian Tabor and Ken Tindell trace the theft of their RAV4 back to a headlight wire. Behind it, an attack that needs neither key nor OBD port: forcing the CAN bus to believe a forged frame while silencing the genuine node. We break down the mechanism, the toolkit and the defences.",
    fiche: {
      cible: "Toyota RAV4, and dozens of models (Lexus, Jeep, Nissan, VW, Maserati...) targeted by the same boxes.",
      entree: "The front headlight harness, a point on the control CAN bus reachable by forcing the bumper.",
      methode:
        "A box repeatedly imposes a frame that impersonates the key receiver, while holding the bus recessive to silence the genuine node; the gateway relays it without checking.",
      faille: "CAN authenticates no message and the gateway relays between domains without verifying: a well-formed frame is taken at its word.",
    },
    sections: [
      {
        id: "contexte",
        heading: "The theft that documented it all",
        blocks: [
          {
            t: "p",
            text: "Ian Tabor's RAV4 is first vandalized (bumper torn off, headlight connector unplugged), then stolen a few days later. Before the theft, the car logged fault codes reporting a loss of communication with the headlight controller and with the CAN network. With Ken Tindell, chief technology officer of Canis Automotive Labs, Tabor traces the thread back to the front headlight harness, and uncovers a method that has become a small industry.",
          },
          {
            t: "note",
            text:
              "The injector was sold ready to use to thieves, hidden in a fake Bluetooth speaker with a trigger button: about ten dollars of components to steal a car in roughly a minute.",
          },
        ],
      },
      {
        id: "architecture",
        heading: "The target: a chatty bus, zero authentication",
        blocks: [
          {
            t: "p",
            text: "A car does not have a single CAN bus but several, linked by a central gateway. The key receiver's messages travel on the control bus. The front headlight is wired to that same bus: reaching its connector means reaching the bus that carries the authorization to start. The root problem: on a CAN, no message is signed, and the gateway copies certain frames from one bus to another without verifying them.",
          },
          {
            t: "svg",
            caption: "The headlight shares the control bus with the key receiver; the gateway relays to the engine.",
            src: SVG_CAN_TOPO_EN,
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
              "Nothing distinguishes a forged frame from a real one.",
              "So the gateway relays the forged frame too.",
            ],
          },
        ],
      },
      {
        id: "injection",
        heading: "CAN injection, the real tour de force",
        blocks: [
          {
            t: "p",
            text: "The subtle point: the genuine key controller keeps emitting its legitimate message (\"no key present\"). So it is not enough to add a frame, you have to impose yours and silence the genuine one.",
          },
          {
            t: "p",
            text: "CAN arbitrates bit by bit: a dominant bit (0) overrides a recessive bit (1), and the lowest identifier wins. But winning arbitration is not enough: a receiver that detects an inconsistency can destroy the frame by raising an error flag. So the injector must neutralize that mechanism too.",
          },
          {
            t: "p",
            text: "The trick is hardware. The box first emits a wake frame in a loop, until it sees a frame from an already-awake controller go by. It then enables a modified transceiver that holds the bus in the recessive state, which \"blocks the other CAN nodes from transmitting\". The legitimate controllers that try fail, enter error recovery and back off. Above all, this override also blocks the error signalling that would let a receiver destroy the forged frame.",
          },
          {
            t: "svg",
            caption: "The injector holds the bus recessive, forces the genuine node to back off, then imposes its frame.",
            src: SVG_CAN_OVERRIDE_EN,
          },
          {
            t: "note",
            text:
              "This is what sets CAN injection apart from a simple replay: the attacker neutralizes the genuine source and the error detection, instead of adding noise on top. A caveat noted by Tindell: when several receivers acknowledge at the same time, their combined current can overpower the override, but the forged frame still gets through.",
          },
        ],
      },
      {
        id: "rafale",
        heading: "The 20 Hz burst and the gateway",
        blocks: [
          {
            t: "p",
            text: "Why repeat the frame about twenty times a second? Because the gateway is fragile: when it can no longer communicate (during the override), its CAN controller resets, and it misses frames. By hammering the burst at around 20 Hz, the injector makes sure at least one gets through when the gateway starts listening again. It then relays the \"key valid\" message to the engine network, and the immobilizer deactivates.",
          },
          {
            t: "frame",
            caption: "Teaching illustration: the forged burst (in red) amid normal traffic. Identifiers are fictional.",
            lines: [
              { text: "0x120  engine        820 rpm                  normal frame", mark: "ok" },
              { text: "0x043  key receiver  'no key present'         normal frame", mark: "ok" },
              { text: "0x043  INJECTED      'key valid'    x20 / s     forged burst", mark: "hl" },
              { text: "gateway  relays 0x043 to the engine network, unchecked", mark: "hl" },
              { text: "immobilizer deactivated, engine allowed to start", mark: "ok" },
            ],
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
              "Tap onto the two bus wires, CAN-H and CAN-L.",
              "Emit a wake frame in a loop until the network responds.",
              "Enable the override: hold the bus recessive to silence the legitimate nodes and block error detection.",
              "Emit the burst (about twenty times a second) impersonating the key receiver: the 'key valid' message.",
              "The immobilizer, believing the key present, deactivates.",
              "The gateway relays the frame to the engine network, without verifying it.",
              "A second message, triggered by the box's button, commands the doors to unlock.",
              "The thief gets in and drives off: the car is gone in about a minute, without the key.",
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
            text: "You do not need a real car to understand the method. On a virtual bus or a two-controller bench, the approach is always the same: trigger an action, observe the frame that changes, then replay it. That is exactly what this site's Workshop offers. The commands below work on a test interface (vcan0), never on a vehicle.",
          },
          {
            t: "code",
            caption: "Observe, isolate, replay (on a test bench).",
            lines: [
              "# listen to all traffic on the test bus",
              "candump vcan0",
              "",
              "# spot the frame that moves when you act (diff before / after)",
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
        heading: "The toolkit, on both sides",
        blocks: [
          {
            t: "table",
            caption: "The thief's box costs about ten dollars; the analysis is done with public tools.",
            head: ["Item", "Side", "What it is for"],
            rows: [
              ["PIC18F microcontroller with CAN", "Thief", "Generates and paces the forged frames; firmware locked against readout."],
              ["Modified transceiver + override circuit", "Thief", "Holds the bus recessive: silences the other nodes and blocks error signalling."],
              ["Fake Bluetooth speaker", "Thief", "Case, battery and button: camouflages the injector, powers it and triggers it."],
              ["CAN interface (CANable, CANtact...)", "Analyst", "Connect a PC to the bus to read and emit."],
              ["can-utils (candump, cansniffer, cansend)", "Analyst", "Capture, filter and replay frames."],
              ["SavvyCAN", "Analyst", "Visualize and compare captures, find the useful signal."],
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "What went wrong",
        blocks: [
          {
            t: "ul",
            items: [
              "CAN authenticates no message: a node able to place bits is taken at its word.",
              "The gateway copies frames between domains without verifying their origin.",
              "The immobilizer bases a security decision on a mere assertion from the bus.",
              "A non-critical peripheral (the headlight) gives access to a critical bus.",
              "Error detection itself can be neutralized by the override: a naive safeguard is not enough.",
            ],
          },
        ],
      },
      {
        id: "patch",
        heading: "The defence, and where to test it here",
        blocks: [
          {
            t: "p",
            text: "A quick but fragile defence: the gateway relays a key frame only if its own recent transmissions succeeded and no dominant-to-recessive error occurred just before. Tindell sums it up with Fleming's maxim: once is happenstance, twice is coincidence, three times is enemy action. An attacker who adapts the box can get around it.",
          },
          {
            t: "p",
            text: "The real answer is message authentication. SecOC (AUTOSAR) adds to each frame an authentication code (MAC) and a freshness counter: a forged or replayed frame is rejected. Canis pushes the same idea with CryptoCAN (a pair of encrypted frames carries one plaintext frame). A security module emulated in software (SHE) fits in about 3 KB of code, 200 bytes of RAM and 40 microseconds per message: within reach of a small controller.",
          },
          {
            t: "svg",
            caption: "With SecOC, the MAC and the freshness counter reject the forged frame.",
            src: SVG_CAN_SECOC_EN,
          },
          {
            t: "p",
            text: "Segmentation helps as a complement, by keeping a front-network node from talking directly to the engine controller. Careful: detection alone is not enough here. Devices like NXP Stinger or Canis CAN-HG destroy a forged frame with a CAN error, but the override is precisely what prevents any node from signalling that error.",
          },
          {
            t: "p",
            text: "These two defences, SecOC and segmentation, are switches you can turn on in the Explorer to watch the attack path get blocked. And the trigger, observe, replay method can be handled in the Workshop, on a virtual bus.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell : CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "CAN in Automation : The CAN Injection attack (Tindell, PDF)", url: "https://www.can-cia.org/fileadmin/cia/documents/publications/cnlm/june_2023/cnlm_23-2_p20_the_can_injection_attack_ken_tindel_canis_automotive_labs.pdf" },
      { label: "SecurityWeek : thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive : stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
      { label: "NVD : CVE-2023-29389", url: "https://nvd.nist.gov/vuln/detail/CVE-2023-29389" },
    ],
  },
];
