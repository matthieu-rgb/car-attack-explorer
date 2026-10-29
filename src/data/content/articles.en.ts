import type { Article } from "../articles";

// English translation of the "Analyses" articles. Mirrors fr in articles.ts.
export const articlesEn: Article[] = [
  {
    slug: "karr-bluetooth",
    date: "2026-08-09",
    readMins: 5,
    vector: "rf",
    tags: ["Bluetooth", "Shared key", "Aftermarket alarm", "2026"],
    title: "KARR: a single Bluetooth key for 2.2 million cars",
    dek:
      "In 2026, researchers from UC San Diego show that a dealer-installed anti-theft alarm uses the same Bluetooth key on every device. With that key, you can unlock, silence the alarm, and block the engine.",
    fiche: {
      cible:
        "Vehicles fitted with a dealer-installed KARR / SWDS alarm (Honda, Toyota, Mazda, Ford, Jeep...), around 2.2 million.",
      entree: "The Bluetooth interface of the aftermarket alarm, not the car itself.",
      methode:
        "Forging the radio commands thanks to a hard-coded authentication key, identical across every unit.",
      faille: "A single cryptographic key shared across the whole fleet: knowing it once is enough for all of them.",
    },
    sections: [
      {
        id: "maillon",
        heading: "The added link",
        blocks: [
          {
            t: "p",
            text: "The KARR alarm is not fitted by the manufacturer: it is an accessory installed at the dealership, often recognisable by a KARR or SWDS sticker on the driver's window. It is controlled over Bluetooth from an app. This is exactly the kind of add-on whose security nobody checks.",
          },
        ],
      },
      {
        id: "entree",
        heading: "How they got in",
        blocks: [
          {
            t: "ol",
            items: [
              "Reverse-engineering the alarm's Bluetooth protocol.",
              "Discovering a hard-coded authentication key, the same on every device.",
              "With that key, forging the commands accepted by the alarm.",
              "Unlocking the doors, disabling the alarm, honking the horn, and blocking the engine while the vehicle is stationary.",
            ],
          },
          {
            t: "note",
            text:
              "Work by UC San Diego, presented at DEF CON on 9 August and at USENIX Security on 12 August 2026. A firmware fix was pushed on 20 July 2026 through the KARR app; the vendor states it is not aware of any real-world abuse.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "What went wrong, the lesson",
        blocks: [
          {
            t: "p",
            text: "Hard-coding a single key into every unit turns a secret into a single point of failure: one extraction compromises the entire fleet. Each unit should have had its own key, paired to a single vehicle.",
          },
          {
            t: "p",
            text: "The moral is broader: your weak spot is not necessarily in the car. The aftermarket accessory, meant to protect, becomes the way in. The more connected objects we add around the vehicle, the more the attack surface spreads beyond the car.",
          },
        ],
      },
    ],
    sources: [
      { label: "Fox News: KARR Bluetooth flaw exposes 2.2M cars", url: "https://www.foxnews.com/tech/karr-bluetooth-flaw-exposes-2-2m-cars-theft-risk" },
      { label: "Popular Science: 2 million cars at risk of Bluetooth hack", url: "https://www.popsci.com/technology/car-bluetooth-cybersecurity-hack/" },
      { label: "Malwarebytes: millions of cars could be tracked and unlocked", url: "https://www.malwarebytes.com/blog/bugs/2026/07/millions-of-cars-could-be-tracked-and-unlocked-by-a-hidden-security-flaw" },
    ],
  },

  {
    slug: "subaru-starlink",
    date: "2025-01-23",
    readMins: 6,
    vector: "api",
    tags: ["Geolocation", "Admin portal", "Account takeover", "Privacy"],
    title: "Subaru STARLINK: a year of trips inside an admin panel",
    dek:
      "In early 2025, Sam Curry and Shubham Shah get into Subaru's STARLINK administration panel. The prize: live location, a year of history, and control of vehicles across the United States, Canada and Japan.",
    fiche: {
      cible: "Connected Subaru vehicles (STARLINK) in the United States, Canada and Japan.",
      entree: "An administration subdomain found by scanning, then a hijacked employee account.",
      methode:
        "Resetting an employee's password (email found on LinkedIn) by bypassing two security questions.",
      faille: "An admin panel too exposed and poorly protected: one employee's access hands over control of everything.",
    },
    sections: [
      {
        id: "porte",
        heading: "Finding the door",
        blocks: [
          {
            t: "p",
            text: "It all starts with a sweep of subdomains. The two researchers stumble on STARLINK's internal administration portal, the tool employees use to manage accounts and vehicles. It should never have been reachable so easily.",
          },
        ],
      },
      {
        id: "entree",
        heading: "How they got in",
        blocks: [
          {
            t: "ol",
            items: [
              "Finding a Subaru employee's email address on LinkedIn.",
              "Triggering a password reset on their account.",
              "Bypassing the two required security questions.",
              "Obtaining full administrator access to the portal.",
              "Querying any vehicle by its VIN, which itself can be recovered from a licence plate through registration records.",
            ],
          },
        ],
      },
      {
        id: "ampleur",
        heading: "The scale",
        blocks: [
          {
            t: "p",
            text: "The panel does more than display records. From the interface, they can act on vehicles and view sensitive data.",
          },
          {
            t: "ul",
            items: [
              "Start, stop, lock and unlock any connected Subaru.",
              "See its live position.",
              "Pull a year of location history on their test vehicle.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "What went wrong, the lesson",
        blocks: [
          {
            t: "p",
            text: "Two problems stack up. First, an exposed administration surface and weak account recovery: reset by email plus bypassable questions. Then, and this is the more lasting one, data retention: a year of each driver's trips, accessible behind a simple password.",
          },
          {
            t: "p",
            text: "Subaru fixed it quickly. But the case is a reminder that the car can be well protected while the backstage, the portal and its database, is not.",
          },
        ],
      },
    ],
    sources: [
      { label: "Sam Curry: Hacking Subaru", url: "https://samcurry.net/hacking-subaru" },
      { label: "Jalopnik: hackers crack Subaru's connected services", url: "https://jalopnik.com/hackers-crack-subarus-connected-services-to-access-loca-1851746393" },
      { label: "Engadget: Subaru's poor security left vehicle data accessible", url: "https://www.engadget.com/cybersecurity/subarus-poor-security-left-troves-of-vehicle-data-easily-accessible-182514123.html" },
    ],
  },

  {
    slug: "pwn2own-automotive-2025",
    date: "2025-01-24",
    readMins: 5,
    vector: "charge",
    tags: ["Competition", "EV chargers", "Infotainment", "0-day"],
    title: "Pwn2Own Automotive 2025: 49 flaws, and the chargers fall",
    dek:
      "In Tokyo in January 2025, teams chained 49 brand-new flaws for 886,250 dollars. The most prolific target: charging stations.",
    fiche: {
      cible:
        "Charging stations (Tesla Wall Connector, Autel, ChargePoint...), embedded operating systems and car radios.",
      entree: "The network and USB surfaces of consumer and semi-professional hardware.",
      methode: "Exploitation chains (overflows, comparisons with no lower bound...) up to code execution.",
      faille: "A broad and young ecosystem: plenty of exposed code, still lightly hardened.",
    },
    sections: [
      {
        id: "principe",
        heading: "How Pwn2Own works",
        blocks: [
          {
            t: "p",
            text: "Pwn2Own is a contest run by the Zero Day Initiative. Teams arrive with brand-new flaws (0-days) that they demonstrate live on real hardware. They get paid, and in exchange the manufacturers get the bugs back to fix them. It is a yearly snapshot of the state of automotive security.",
          },
        ],
      },
      {
        id: "tombe",
        heading: "What fell",
        blocks: [
          {
            t: "p",
            text: "Charging stations were the richest target of the edition. The Tesla Wall Connector was the first piece of hardware to fall, through a numeric range comparison with no lower bound that lets you take control of it.",
          },
          {
            t: "ul",
            items: [
              "More than 140,000 dollars for the Tesla Wall Connector flaws alone.",
              "Many car radios and infotainment systems compromised.",
              "Electric charging stands out as the most exposed surface.",
            ],
          },
        ],
      },
      {
        id: "gagnants",
        heading: "Who won",
        blocks: [
          {
            t: "p",
            text: "Sina Kheirkhah, of the Summoning Team, is crowned Master of Pwn with 222,250 dollars. Synacktiv finishes second with 147,500 dollars. In total: 49 brand-new flaws and 886,250 dollars handed out. Notably, nobody tried to attack a complete Tesla that year, even though the organisers had planned to give away a car.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "What it says about the sector, the lesson",
        blocks: [
          {
            t: "p",
            text: "The attack surface has shifted outside the car: chargers, apps, cloud. The charging infrastructure, young and deployed fast, is the new soft target. The trend is confirmed: a PCA report counted 345 new automotive vulnerabilities in the second quarter of 2026, 161 of them rated critical.",
          },
        ],
      },
    ],
    sources: [
      { label: "Zero Day Initiative: Pwn2Own Automotive 2025, final results", url: "https://www.thezdi.com/blog/2025/1/23/pwn2own-automotive-2025-day-three-and-final-results" },
      { label: "BleepingComputer: 886,250 dollars for 49 0-days", url: "https://www.bleepingcomputer.com/news/security/hackers-get-886-250-for-49-zero-days-at-pwn2own-automotive-2025/" },
      { label: "SecurityWeek: chargers, OS and infotainment", url: "https://www.securityweek.com/hackers-earn-886000-at-pwn2own-automotive-2025-for-charger-os-infotainment-exploits/" },
    ],
  },

  {
    slug: "kia-portail-plaque",
    date: "2024-09-26",
    readMins: 5,
    vector: "api",
    tags: ["Remote takeover", "API", "Dealer portal", "Licence plate"],
    title: "Kia: taking control of a car with a licence plate",
    dek:
      "In 2024, Sam Curry's team remotely controls millions of Kia vehicles starting from nothing but a licence plate, through the dealers-only portal.",
    fiche: {
      cible: "Connected Kia vehicles built after 2013, with or without an active Kia Connect subscription.",
      entree: "kiaconnect.kdealer.com, the dealers' web portal.",
      methode:
        "Creating a dealer account, generating a token, calling the internal APIs, adding yourself as owner.",
      faille: "Broken server-side access control: a dealer account hands over control of any vehicle.",
    },
    sections: [
      {
        id: "plaque",
        heading: "From a plate to an owner",
        blocks: [
          {
            t: "p",
            text: "The starting point is available to anyone: a licence plate. It leads to the VIN, then, server-side, to the owner's information. No physical access to the car is needed.",
          },
        ],
      },
      {
        id: "entree",
        heading: "How they got in",
        blocks: [
          {
            t: "ol",
            items: [
              "Register an account on the dealer portal kiaconnect.kdealer.com, reusing the same sign-up request as customers.",
              "Generate an access token valid for the dealers' internal APIs.",
              "Retrieve the owner's data: name, phone, email, address.",
              "Replace the owner's email with your own and add yourself as primary account holder.",
              "Send commands to the vehicle.",
            ],
          },
        ],
      },
      {
        id: "capacites",
        heading: "What they could do",
        blocks: [
          {
            t: "ul",
            items: [
              "Lock and unlock, start and stop, honk the horn, locate the vehicle.",
              "All in about thirty seconds.",
              "With no notification to the owner that their car had been accessed or their rights changed.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "What went wrong, the lesson",
        blocks: [
          {
            t: "p",
            text: "The car was not hacked: the weak link is the web server. Poorly partitioned access control let a dealer account act on any customer's vehicles. It is the perfect illustration of the shift in the threat: today most attacks are carried out remotely, and a large share go through telematics, the cloud or APIs.",
          },
          {
            t: "p",
            text: "The flaws were fixed before publication, the demonstration tool was never released, and Kia states that no malicious exploitation took place.",
          },
        ],
      },
    ],
    sources: [
      { label: "Sam Curry: Hacking Kia", url: "https://samcurry.net/hacking-kia" },
      { label: "SecurityWeek: millions of Kia cars vulnerable to remote hacking", url: "https://www.securityweek.com/millions-of-kia-cars-were-vulnerable-to-remote-hacking-researchers/" },
      { label: "BleepingComputer: Kia dealer portal flaw", url: "https://www.bleepingcomputer.com/news/security/kia-dealer-portal-flaw-could-let-attackers-hack-millions-of-cars/" },
    ],
  },

  {
    slug: "tesla-voltage-glitching",
    date: "2023-08-05",
    readMins: 6,
    vector: "hardware",
    tags: ["Hardware", "Fault injection", "Root of trust", "Jailbreak"],
    title: "Tesla: tripping the chip to break the root of trust",
    dek:
      "In 2023, researchers from TU Berlin disturb the power supply of a Tesla's AMD processor to bypass its secure boot. From there, they extract secrets and unlock paid options.",
    fiche: {
      cible: "Recent Tesla vehicles with an AMD Ryzen infotainment system.",
      entree: "The MCU board: physical access to the power supply of the secure AMD processor.",
      methode: "Voltage glitching: a micro power dip at the right moment makes a boot-time check fail to run.",
      faille: "A secure boot that can be bypassed by fault injection, in a ROM that cannot be patched.",
    },
    sections: [
      {
        id: "glitch",
        heading: "What is voltage glitching",
        blocks: [
          {
            t: "p",
            text: "It is a fault-injection attack. By causing a very brief voltage drop, at the precise moment the processor runs a sensitive instruction (a signature check, for example), you make it trip: the instruction is skipped or mis-executed, and control passes when it should have failed.",
          },
        ],
      },
      {
        id: "entree",
        heading: "How they got in",
        blocks: [
          {
            t: "ol",
            items: [
              "Physical access to the vehicle's MCU board.",
              "Targeting the secure AMD processor, the system's root of trust.",
              "Glitching the ROM bootloader's verification step.",
              "Getting unsigned code to run.",
            ],
          },
        ],
      },
      {
        id: "butin",
        heading: "What they obtain",
        blocks: [
          {
            t: "ul",
            items: [
              "Running their own software: an infotainment jailbreak.",
              "Extracting the hardware-bound RSA key, the one that authenticates the car to Tesla's service network.",
              "Enabling software-locked options: heated seats, acceleration boost.",
            ],
          },
        ],
      },
      {
        id: "lecon",
        heading: "Why it is serious and hard to patch",
        blocks: [
          {
            t: "p",
            text: "The flaw is in the processor's ROM: it cannot be fixed without changing the chip. The glitch is not persistent, it has to be redone at every boot, and it requires physical access. So it is not a remote mass theft, but it is worse on one point: it breaks a trust anchor and makes it possible to clone a vehicle's identity.",
          },
          {
            t: "note",
            text:
              "Work by researchers from TU Berlin (Christian Werling, Niclas Kuhnapfel, Hans Niklas Jacob...), presented in 2023. The team followed up in 2024 with a similar attack on the Autopilot computer.",
          },
        ],
      },
    ],
    sources: [
      { label: "Hackaday: jailbreaking Tesla infotainment systems", url: "https://hackaday.com/2023/08/05/jailbreaking-tesla-infotainment-systems/" },
      { label: "Dark Reading: Tesla jailbreak unlocks paid features", url: "https://www.darkreading.com/application-security/tesla-jailbreak-unlocks-theft-in-car-paid-features" },
      { label: "Hackster: unpatchable jailbreak for cloning Teslas", url: "https://www.hackster.io/news/researchers-find-an-unpatchable-jailbreak-for-cloning-teslas-unlocking-paywalled-features-51753e53439c" },
    ],
  },

  {
    slug: "vol-can-injection",
    date: "2023-04-03",
    readMins: 6,
    vector: "can",
    tags: ["Theft", "CAN bus", "Injection", "No authentication"],
    title: "Car theft through the headlight: CAN injection",
    dek:
      "In 2023, Ian Tabor and Ken Tindell trace the theft of their RAV4 back to a headlight wire. Behind it, an attack that needs no key and no OBD port: talking directly to the CAN bus.",
    fiche: {
      cible: "Toyota RAV4, and dozens of models (Lexus, Jeep, Nissan, VW...) targeted by the same devices.",
      entree: "The front headlight harness, reachable by forcing the bumper.",
      methode:
        "Injecting a CAN frame that poses as the validated key, relayed by the gateway to the engine controller.",
      faille: "The CAN bus authenticates no message: a well-formed frame is taken at its word.",
    },
    sections: [
      {
        id: "depart",
        heading: "The starting point: a torn-off headlight",
        blocks: [
          {
            t: "p",
            text: "Ian Tabor's RAV4 is vandalised, then stolen. Before the theft, the car logged fault codes indicating a loss of communication with the headlight controller and the CAN network. Together with Ken Tindell, CTO of Canis Automotive Labs, he traces the trail back to the front headlight harness.",
          },
        ],
      },
      {
        id: "entree",
        heading: "How they got in",
        blocks: [
          {
            t: "p",
            text: "The headlight shares the same CAN bus as the smart-key controller. Reaching the headlight connector means reaching the bus. From there, the scenario takes just a few moves.",
          },
          {
            t: "ol",
            items: [
              "Force the bumper or the headlight to expose the wires.",
              "Clip an injector onto CAN-H and CAN-L.",
              "Emit a forged frame announcing that the key has been validated.",
              "The gateway relays the message to the engine network, which it takes at its word.",
              "The engine starts: the car drives off in about a minute.",
            ],
          },
        ],
      },
      {
        id: "peche",
        heading: "What went wrong",
        blocks: [
          {
            t: "p",
            text: "The CAN bus has no message authentication: any node able to place bits on the wire is believed. A well-formed frame, even sent by an intruder, is treated as legitimate. This is the design flaw the whole approach exploits.",
          },
          {
            t: "note",
            text:
              "The injector, hidden in a fake JBL speaker sold to thieves, held barely ten dollars of components. The RAV4 case is tracked under the reference CVE-2023-29389.",
          },
        ],
      },
      {
        id: "lecon",
        heading: "The lesson, and the defence",
        blocks: [
          {
            t: "p",
            text: "This is exactly what SecOC targets: authenticating every message with a code and a freshness counter, so that a forged frame is rejected. Segmentation also helps, by preventing a node on the front network from reaching the engine controller. Two defences shown directly elsewhere on this site.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ken Tindell: CAN Injection, keyless car theft", url: "https://kentindell.github.io/2023/04/03/can-injection/" },
      { label: "SecurityWeek: thieves use CAN injection hack to steal cars", url: "https://www.securityweek.com/thieves-use-can-injection-hack-to-steal-cars/" },
      { label: "The Drive: stealing cars via headlight wiring", url: "https://www.thedrive.com/news/shadetree-hackers-are-stealing-cars-by-injecting-code-into-headlight-wiring" },
    ],
  },
];
