import { el } from "./svg";
import { vehicle } from "../data/vehicle";
import type { Attack, Countermeasure, Domain } from "../data/types";
import { t } from "../i18n";

type Pt = { x: number; y: number };

// Bus trunks. Drawn and reused as SMIL motion paths for ambient traffic.
const TRUNKS: { domain: Domain; draw: string; motion: string }[] = [
  { domain: "powertrain", draw: "M222 150 V364", motion: "M222 150 V364" },
  { domain: "chassis", draw: "M150 205 V390 H194", motion: "M150 205 V390 H194" },
  { domain: "bodyd", draw: "M290 252 V420 M290 390 H246", motion: "M290 252 V390 H246" },
  { domain: "info", draw: "M220 560 V416", motion: "M220 560 V416" },
];

const STUBS = ["M205 150 H222", "M240 150 H222"]; // ecm, tcm into powertrain spine

// Domain zones (trust boundaries), enclosing each domain's ECUs.
const ZONES: { domain: Domain; x: number; y: number; w: number; h: number; lx: number; ly: number }[] = [
  { domain: "powertrain", x: 176, y: 126, w: 92, h: 130, lx: 222, ly: 119 },
  { domain: "chassis", x: 118, y: 180, w: 62, h: 180, lx: 149, ly: 173 },
  { domain: "bodyd", x: 261, y: 228, w: 60, h: 220, lx: 291, ly: 221 },
  { domain: "info", x: 189, y: 444, w: 62, h: 142, lx: 220, ly: 601 },
];

const CAR_STATIC = `
  <g aria-hidden="true">
    <rect class="tire" x="100" y="124" width="20" height="56" rx="7"/>
    <rect class="tire" x="320" y="124" width="20" height="56" rx="7"/>
    <rect class="tire" x="100" y="512" width="20" height="56" rx="7"/>
    <rect class="tire" x="320" y="512" width="20" height="56" rx="7"/>
    <path class="car-body" d="M160 70 L280 70 C298 70 308 80 312 100
      C318 120 320 135 321 152 C322 168 320 182 318 200 C315 240 316 280 317 320
      C318 380 317 440 318 480 C319 510 322 528 323 544 C324 562 321 582 314 598
      C308 616 298 628 280 628 L160 628 C142 628 132 616 126 598
      C119 582 116 562 117 544 C118 528 121 510 122 480 C123 440 122 380 123 320
      C124 280 125 240 122 200 C120 182 118 168 119 152 C120 135 122 120 128 100
      C132 80 142 70 160 70 Z"/>
    <rect class="car-detail" x="156" y="78" width="26" height="9" rx="4"/>
    <rect class="car-detail" x="258" y="78" width="26" height="9" rx="4"/>
    <rect class="car-detail" x="185" y="92" width="70" height="42" rx="6"/>
    <path class="car-faint" d="M198 96 V130 M242 96 V130 M185 113 H255"/>
    <path class="car-line" d="M186 246 L254 246 L270 288 L170 288 Z" style="fill:var(--glass)"/>
    <rect class="car-line" x="170" y="288" width="100" height="142" rx="6"
      style="fill:color-mix(in srgb,var(--car) 9%,transparent)"/>
    <path class="car-line" d="M170 430 L270 430 L254 478 L186 478 Z" style="fill:var(--glass)"/>
    <path class="car-faint" d="M180 520 Q220 530 260 520"/>
    <path class="car-faint" d="M172 600 Q220 610 268 600"/>
    <path class="car-line" d="M170 284 L150 278 L152 292 L170 296 Z"/>
    <path class="car-line" d="M270 284 L290 278 L288 292 L270 296 Z"/>
  </g>
`;

function domVar(d: Domain): string {
  return `var(--${d})`;
}

export interface VehiclePlan {
  element: SVGSVGElement;
  setAttack(attack: Attack, blockedBy: Countermeasure | null): void;
}

export function createVehiclePlan(reduceMotion: boolean): VehiclePlan {
  const nodeById = new Map(vehicle.nodes.map((n) => [n.id, n]));
  const entryById = new Map(vehicle.entries.map((e) => [e.id, e]));

  const svg = el("svg", {
    class: "plan",
    viewBox: "0 0 440 724",
    role: "img",
    "aria-label": t("fig.alt"),
  });

  const defs = el("defs");
  TRUNKS.forEach((trk, i) => defs.append(el("path", { id: `motion-${i}`, d: trk.motion })));
  svg.append(defs);

  // car underlay
  const carG = el("g");
  carG.innerHTML = CAR_STATIC;
  svg.append(carG);

  // domain zones
  const zoneLayer = el("g", { "aria-hidden": "true" });
  for (const z of ZONES) {
    const color = domVar(z.domain);
    zoneLayer.append(
      el("rect", { class: "zone", x: z.x, y: z.y, width: z.w, height: z.h, rx: 11, style: `color:${color}` }),
    );
    zoneLayer.append(
      el("text", { class: "zone-label", x: z.lx, y: z.ly, "text-anchor": "middle", style: `color:${color}` }, [
        t(`legend.${z.domain}`),
      ]),
    );
  }
  svg.append(zoneLayer);

  // buses
  const busLayer = el("g");
  const busEls: SVGElement[] = [];
  for (const trk of TRUNKS) {
    const color = domVar(trk.domain);
    const p = el("path", { class: "bus", d: trk.draw, style: `color:${color};stroke:${color}` });
    busEls.push(p);
    busLayer.append(p);
  }
  for (const d of STUBS) {
    busLayer.append(el("path", { class: "bus", d, style: "color:var(--powertrain);stroke:var(--powertrain)" }));
  }
  svg.append(busLayer);

  // ambient traffic (skipped when reduced motion is requested)
  if (!reduceMotion) {
    const trafficLayer = el("g", { "aria-hidden": "true" });
    TRUNKS.forEach((trk, i) => {
      for (let k = 0; k < 2; k++) {
        const dot = el("circle", {
          class: "frame-dot",
          r: 2.6,
          fill: domVar(trk.domain),
          color: domVar(trk.domain),
          opacity: k === 0 ? 1 : 0.55,
        });
        const anim = el("animateMotion", {
          dur: `${3 + i * 0.3 + k * 0.4}s`,
          begin: `${k * 1.6}s`,
          repeatCount: "indefinite",
          rotate: "0",
        });
        anim.append(el("mpath", { href: `#motion-${i}` }));
        dot.append(anim);
        trafficLayer.append(dot);
      }
    });
    svg.append(trafficLayer);
  }

  // attack path layer (under gateway/nodes so labels stay readable)
  const pathLayer = el("g", { "aria-hidden": "true" });
  svg.append(pathLayer);

  // gateway (central hub)
  const gw = el("g", { class: "gw" });
  gw.append(el("rect", { class: "gw-box", x: 193, y: 363, width: 54, height: 54, rx: 9 }));
  gw.append(el("text", { class: "gw-t", x: 220, y: 386, "text-anchor": "middle" }, ["CENTRAL"]));
  gw.append(el("text", { class: "gw-t", x: 220, y: 400, "text-anchor": "middle" }, ["GATEWAY"]));
  svg.append(gw);

  // nodes
  const nodeLayer = el("g");
  const nodeEls = new Map<string, SVGGElement>();
  for (const n of vehicle.nodes) {
    const g = el("g", { class: "node-g" });
    const left = n.side === "left";
    const leaderX2 = left ? 92 : n.x <= 260 ? 300 : 350;
    const labelX = left ? 86 : leaderX2 + 6;
    const anchor = left ? "end" : "start";
    g.append(el("line", { class: "leader", x1: n.x, y1: n.y, x2: leaderX2, y2: n.y }));
    g.append(el("text", { class: "lbl", x: labelX, y: n.y - 1, "text-anchor": anchor }, [n.label]));
    g.append(
      el("text", { class: "lbl u", x: labelX, y: n.y + 10, "text-anchor": anchor }, [t(`node.${n.id}.sub`)]),
    );
    g.append(el("circle", { class: "node", cx: n.x, cy: n.y, r: 5 }));
    g.append(el("circle", { class: "node-ring", cx: n.x, cy: n.y, r: 5, style: `stroke:${domVar(n.domain)}` }));
    nodeEls.set(n.id, g);
    nodeLayer.append(g);
  }
  svg.append(nodeLayer);

  // entries
  const entryLayer = el("g", { class: "entry" });
  const entryEls = new Map<string, SVGGElement>();
  for (const e of vehicle.entries) {
    const g = el("g", { class: "entry-g" });
    g.append(el("circle", { class: "mk", cx: e.x, cy: e.y, r: 5 }));
    const left = e.side === "left";
    const lx = left ? e.x - 10 : e.x + 10;
    g.append(el("text", { x: lx, y: e.y + 3, "text-anchor": left ? "end" : "start" }, [t(`entry.${e.id}.label`)]));
    entryEls.set(e.id, g);
    entryLayer.append(g);
  }
  svg.append(entryLayer);

  // effects layer (bursts, on top)
  const fxLayer = el("g", { "aria-hidden": "true" });
  svg.append(fxLayer);

  // ---- helpers ----
  const gatewayPt: Pt = vehicle.gateway;

  function resolve(id: string): Pt {
    if (id === "gateway") return gatewayPt;
    if (id.startsWith("entry:")) {
      const e = entryById.get(id.slice(6));
      return e ? { x: e.x, y: e.y } : gatewayPt;
    }
    const n = nodeById.get(id);
    return n ? { x: n.x, y: n.y } : gatewayPt;
  }

  function pathD(points: Pt[]): string {
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  }

  function lerp(a: Pt, b: Pt, t: number): Pt {
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  // Draw the attack path (tracing in on appearance) and a travelling packet.
  function drawPath(points: Pt[]): void {
    if (points.length < 2) return;
    const p = el("path", { class: "atkpath", id: "atk-live", d: pathD(points) });
    pathLayer.append(p);
    if (reduceMotion) return;
    // one-shot "draw-in" from entry to target, then hand over to the CSS march
    try {
      const len = (p as SVGPathElement).getTotalLength();
      p.classList.add("drawing");
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
      const anim = p.animate(
        [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 460, easing: "cubic-bezier(.22,.61,.36,1)" },
      );
      anim.onfinish = () => {
        p.classList.remove("drawing");
        p.style.strokeDasharray = "";
        p.style.strokeDashoffset = "";
      };
    } catch {
      /* getTotalLength unavailable */
    }
    const packet = el("circle", { class: "packet", r: 3.4 });
    const motion = el("animateMotion", { dur: "1.8s", repeatCount: "indefinite", rotate: "0", begin: "0.3s" });
    motion.append(el("mpath", { href: "#atk-live" }));
    packet.append(motion);
    pathLayer.append(packet);
  }

  // A drawn shield where a defence intercepts the attack.
  function shield(pt: Pt): void {
    const g = el("g", { transform: `translate(${pt.x} ${pt.y})` });
    g.append(
      el("path", {
        d: "M0 -7.5 L6.2 -4.3 L6.2 1 C6.2 5.6 0 8.2 0 8.2 C0 8.2 -6.2 5.6 -6.2 1 L-6.2 -4.3 Z",
        fill: "color-mix(in srgb, var(--ok) 26%, var(--bg))",
        stroke: "var(--ok)",
        "stroke-width": 1.4,
        "stroke-linejoin": "round",
      }),
    );
    g.append(
      el("path", {
        d: "M-2.6 0.2 L-0.6 2.6 L3.1 -2.4",
        fill: "none",
        stroke: "var(--ok)",
        "stroke-width": 1.5,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    );
    fxLayer.append(g);
  }

  function burst(p: Pt, color: string): void {
    const ring = el("circle", {
      cx: p.x,
      cy: p.y,
      r: reduceMotion ? 13 : 7,
      fill: "none",
      stroke: color,
      "stroke-width": 1.8,
      opacity: reduceMotion ? 0.85 : 1,
    });
    if (!reduceMotion) {
      ring.append(
        el("animate", { attributeName: "r", values: "7;17", dur: "1.2s", repeatCount: "indefinite" }),
        el("animate", { attributeName: "opacity", values: ".9;0", dur: "1.2s", repeatCount: "indefinite" }),
      );
    }
    fxLayer.append(ring);
  }

  function setBusHot(domains: Domain[], on: boolean): void {
    for (const [idx, trk] of TRUNKS.entries()) {
      if (!domains.includes(trk.domain)) continue;
      busEls[idx].classList.toggle("hot", on);
    }
  }

  function clear(): void {
    pathLayer.replaceChildren();
    fxLayer.replaceChildren();
    for (const g of nodeEls.values()) g.classList.remove("target-crit");
    for (const g of entryEls.values()) g.classList.remove("hot");
    gw.classList.remove("gw-crit");
    setBusHot(["powertrain", "chassis", "bodyd", "info"], false);
  }

  function setAttack(attack: Attack, blockedBy: Countermeasure | null): void {
    clear();
    entryEls.get(attack.entry)?.classList.add("hot");
    const routePts = attack.route.map(resolve);

    if (blockedBy) {
      // The attack is stopped at the defence point: the red path ends there and a
      // green shield marks the interception. Nothing downstream is compromised.
      const last = routePts.length - 1;
      let shown: Pt[];
      let blockPt: Pt;
      if (blockedBy === "segmentation") {
        const gi = attack.route.indexOf("gateway");
        const idx = gi >= 0 ? gi : Math.max(0, last - 1);
        shown = routePts.slice(0, idx + 1);
        blockPt = routePts[idx] ?? gatewayPt;
      } else if (routePts.length >= 2) {
        // intercepted just short of the targeted interface
        blockPt = lerp(routePts[last - 1], routePts[last], 0.72);
        shown = routePts.slice(0, last).concat([blockPt]);
      } else {
        blockPt = routePts[last] ?? gatewayPt;
        shown = routePts.slice();
      }
      drawPath(shown);
      burst(blockPt, "var(--ok)");
      shield(blockPt);
      return;
    }

    // Passes: full path, buses reached lit, target compromised.
    drawPath(routePts);
    if (attack.busHighlight) setBusHot(attack.busHighlight, true);
    if (attack.target === "gateway") {
      gw.classList.add("gw-crit");
    } else if (attack.target) {
      nodeEls.get(attack.target)?.classList.add("target-crit");
    }
  }

  return { element: svg, setAttack };
}
