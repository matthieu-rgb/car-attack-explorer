import { h } from "./dom";
import { el } from "../render/svg";
import { t, getLang } from "../i18n";
import { getSignals, getExamples, type Signal, type GaugeSpec, type Example } from "../data/frames";

// ---------------------------------------------------------------- helpers

function hex2(n: number): string {
  return (n & 0xff).toString(16).toUpperCase().padStart(2, "0");
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}
function priorityKey(id: number): string {
  if (id <= 0x0ff) return "decoder.prio.vhigh";
  if (id <= 0x2ff) return "decoder.prio.high";
  if (id <= 0x4ff) return "decoder.prio.med";
  return "decoder.prio.low";
}
function fmt(n: number): string {
  // jolie valeur : entiere si proche, sinon une decimale
  return Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1);
}

// raw entier a partir des octets, selon l'ordre choisi
function rawFromBytes(sig: Signal, bytes: number[], big: boolean): number {
  const order = sig.byteOrder!;
  if (order.length === 1) return bytes[order[0]];
  const [a, b] = big ? [order[0], order[1]] : [order[1], order[0]];
  return ((bytes[a] << 8) | bytes[b]) & 0xffff;
}
function physFromBytes(sig: Signal, bytes: number[], big: boolean): number {
  return rawFromBytes(sig, bytes, big) * (sig.factor ?? 1) + (sig.offset ?? 0);
}
function writePhys(sig: Signal, bytes: number[], phys: number, big: boolean): void {
  const order = sig.byteOrder!;
  const maxRaw = order.length === 1 ? 0xff : 0xffff;
  const raw = clamp(Math.round((phys - (sig.offset ?? 0)) / (sig.factor ?? 1)), 0, maxRaw);
  if (order.length === 1) {
    bytes[order[0]] = raw;
  } else {
    const [a, b] = big ? [order[0], order[1]] : [order[1], order[0]];
    bytes[a] = (raw >> 8) & 0xff;
    bytes[b] = raw & 0xff;
  }
}

// ---------------------------------------------------------------- widgets

interface Widget {
  node: SVGSVGElement;
  update(bytes: number[], sig: Signal, big: boolean): void;
}

function makeGauge(spec: GaugeSpec): Widget {
  const CX = 130, CY = 140, R = 110;
  const svg = el("svg", { viewBox: "0 0 260 172", class: "gaugew", "aria-hidden": "true" });

  const pt = (theta: number): [number, number] => {
    const r = (theta * Math.PI) / 180;
    return [CX + R * Math.cos(r), CY - R * Math.sin(r)];
  };
  const [lx, ly] = pt(180);
  const [rx, ry] = pt(0);
  svg.append(el("path", { d: `M ${lx} ${ly} A ${R} ${R} 0 0 1 ${rx} ${ry}`, class: "gauge-arc" }));

  if (spec.redline !== undefined) {
    const frac = clamp((spec.redline - spec.min) / (spec.max - spec.min), 0, 1);
    const [sx, sy] = pt(180 - 180 * frac);
    svg.append(el("path", { d: `M ${sx} ${sy} A ${R} ${R} 0 0 1 ${rx} ${ry}`, class: "gauge-red" }));
  }

  for (let i = 0; i <= 8; i++) {
    const theta = 180 - (180 * i) / 8;
    const [ox, oy] = pt(theta);
    const inr = R - (i % 2 === 0 ? 14 : 8);
    const r = (theta * Math.PI) / 180;
    svg.append(el("line", {
      x1: ox, y1: oy, x2: CX + inr * Math.cos(r), y2: CY - inr * Math.sin(r), class: "gauge-tick",
    }));
  }

  const needle = el("line", { x1: CX, y1: CY, x2: CX, y2: CY - R + 16, class: "gauge-needle" });
  svg.append(needle, el("circle", { cx: CX, cy: CY, r: 6, class: "gauge-hub" }));

  svg.append(
    el("text", { x: lx, y: ly + 16, class: "gauge-end", "text-anchor": "start" }, [String(spec.min)]),
    el("text", { x: rx, y: ry + 16, class: "gauge-end", "text-anchor": "end" }, [String(spec.max)]),
  );

  return {
    node: svg,
    update(bytes, sig, big) {
      const phys = physFromBytes(sig, bytes, big);
      const frac = clamp((phys - spec.min) / (spec.max - spec.min), 0, 1);
      needle.style.transform = `rotate(${-90 + 180 * frac}deg)`;
    },
  };
}

function makeBlink(): Widget {
  const svg = el("svg", { viewBox: "0 0 260 172", class: "turnw", "aria-hidden": "true" });
  const left = el("path", { d: "M 44 86 L 86 54 L 86 72 L 116 72 L 116 100 L 86 100 L 86 118 Z", class: "turn-arrow left" });
  const right = el("path", { d: "M 216 86 L 174 54 L 174 72 L 144 72 L 144 100 L 174 100 L 174 118 Z", class: "turn-arrow right" });
  svg.append(left, right);
  return {
    node: svg,
    update(bytes, sig) {
      const v = bytes[sig.byteIndex!];
      left.classList.toggle("on", (v & 0x01) !== 0);
      right.classList.toggle("on", (v & 0x02) !== 0);
    },
  };
}

function makeLock(): Widget {
  const svg = el("svg", { viewBox: "0 0 260 172", class: "lockw", "aria-hidden": "true" });
  const groups: SVGGElement[] = [];
  const xs = [34, 96, 158, 220];
  xs.forEach((x) => {
    const g = el("g", { class: "padlock" }) as SVGGElement;
    g.append(
      el("path", { d: `M ${x - 14} 96 h 28 v 2 M ${x} 70 a 14 14 0 0 1 14 14 v 10 h -28 v -10 a 14 14 0 0 1 14 -14 z`, class: "pad-shackle" }),
      el("rect", { x: x - 18, y: 94, width: 36, height: 34, rx: 5, class: "pad-body" }),
      el("circle", { cx: x, cy: 108, r: 3.5, class: "pad-hole" }),
      el("rect", { x: x - 1.6, y: 108, width: 3.2, height: 10, class: "pad-hole" }),
    );
    groups.push(g);
    svg.append(g);
  });
  return {
    node: svg,
    update(bytes, sig) {
      const v = bytes[sig.byteIndex!];
      groups.forEach((g, i) => g.classList.toggle("open", (v & (1 << i)) === 0));
    },
  };
}

function widgetFor(sig: Signal): Widget {
  if (sig.visual === "gauge") return makeGauge(sig.gauge!);
  if (sig.visual === "blink") return makeBlink();
  return makeLock();
}

// ---------------------------------------------------------------- view

export function createFrameView(): HTMLElement {
  const signals = getSignals(getLang());
  const examples = getExamples(getLang());

  const bytes: number[] = new Array(8).fill(0);
  let current: Signal = signals[0];
  let big = true; // ordre des octets : gros-boutiste par defaut
  let prevByte = 0; // pour surligner les bits qui basculent

  const visualWrap = h("div", { class: "sb-visual" });
  const chipsRow = h("div", { class: "sig-chips", role: "group", "aria-label": t("decoder.signal") });
  const controlWrap = h("div", { class: "control" });
  const bandWrap = h("div", { class: "frameband", role: "img" });
  const interp = h("p", { class: "interp", "aria-live": "polite" });
  const bitsWrap = h("div", { class: "bits-body" });
  const help = h("p", { class: "sig-help" });
  const meta = h("p", { class: "sb-meta" });

  let widget: Widget = widgetFor(current);

  // ---- rendering ----
  function renderBand(changed: number[]): void {
    const active = current.kind === "flags" ? [current.byteIndex!] : current.byteOrder!;
    const spans: (Node | string)[] = [];
    bytes.forEach((b, i) => {
      const cls = ["fb-byte"];
      if (active.includes(i)) cls.push("active");
      else cls.push("muted");
      if (changed.includes(i)) cls.push("flash");
      spans.push(h("span", { class: cls.join(" ") }, [hex2(b)]));
      if (i < 7) spans.push(" ");
    });
    bandWrap.replaceChildren(h("code", { class: "fb-line" }, spans));
  }

  function renderInterp(): void {
    if (current.kind === "scalar") {
      const order = current.byteOrder!;
      const raw = rawFromBytes(current, bytes, big);
      const phys = raw * (current.factor ?? 1) + (current.offset ?? 0);
      const idxLabel = order.length === 1
        ? `${t("decoder.byteN")} ${order[0]}`
        : `${t("decoder.bytesN")} ${big ? order.join("-") : [...order].reverse().join("-")}`;
      const hexRaw = order.length === 1 ? `0x${hex2(raw)}` : `0x${raw.toString(16).toUpperCase().padStart(4, "0")}`;
      const op = current.factor !== 1 ? ` × ${current.factor === 100 / 255 ? "100/255" : current.factor}` : "";
      const off = current.offset ? ` ${current.offset > 0 ? "+" : "−"} ${Math.abs(current.offset)}` : "";
      interp.replaceChildren(
        h("span", { class: "interp-k" }, [t("decoder.meaning")]),
        ` ${idxLabel} = ${hexRaw} = ${raw}${op}${off} → ${fmt(phys)} ${current.gauge!.unit}`,
      );
    } else {
      const v = bytes[current.byteIndex!];
      const on = current.bits!.filter((b) => v & (1 << b.pos)).map((b) => b.label);
      const list = on.length ? on.join(" + ") : t("decoder.none");
      interp.replaceChildren(
        h("span", { class: "interp-k" }, [t("decoder.meaning")]),
        ` ${t("decoder.byteN")} ${current.byteIndex} = 0x${hex2(v)} = 0b${v.toString(2).padStart(8, "0")} → ${list}`,
      );
    }
  }

  function renderBits(): void {
    const idx = current.kind === "flags" ? current.byteIndex! : current.byteOrder![0];
    const v = bytes[idx];
    const cells: HTMLElement[] = [];
    for (let bit = 7; bit >= 0; bit--) {
      const set = (v >> bit) & 1;
      const changed = ((prevByte ^ v) >> bit) & 1;
      cells.push(h("div", { class: `bit${set ? " set" : ""}${changed ? " changed" : ""}` }, [
        h("span", { class: "bit-i" }, [`${bit}`]),
        h("span", { class: "bit-v" }, [`${set}`]),
      ]));
    }
    const grid = h("div", { class: "bits-grid" }, cells);
    const rows = bytes.map((b, i) =>
      h("tr", { class: i === idx ? "hot" : "" }, [
        h("td", { class: "bi" }, [`${i}`]),
        h("td", { class: "bh" }, [`0x${hex2(b)}`]),
        h("td", { class: "bb" }, [b.toString(2).padStart(8, "0")]),
        h("td", { class: "bd" }, [`${b}`]),
      ]),
    );
    const table = h("table", { class: "bytes" }, [
      h("thead", {}, [h("tr", {}, [
        h("th", {}, [t("decoder.byte")]), h("th", {}, [t("decoder.hex")]),
        h("th", {}, [t("decoder.bin")]), h("th", {}, [t("decoder.dec")]),
      ])]),
      h("tbody", {}, rows),
    ]);
    bitsWrap.replaceChildren(
      h("p", { class: "bits-cap" }, [`${t("decoder.byteN")} ${idx}`]),
      grid,
      h("div", { class: "tbl-wrap" }, [table]),
    );
  }

  function render(changed: number[]): void {
    widget.update(bytes, current, big);
    renderBand(changed);
    renderInterp();
    renderBits();
  }

  // ---- control builders ----
  function buildControl(): void {
    const node: HTMLElement[] = [];
    if (current.kind === "scalar") {
      const spec = current.gauge!;
      const phys = physFromBytes(current, bytes, big);
      const step = Math.max(1, Math.round((spec.max - spec.min) / 240));
      const num = h("span", { class: "bv-num" }, [fmt(phys)]);
      const slider = h("input", {
        class: "range", type: "range",
        min: spec.min, max: spec.max, step,
        value: clamp(phys, spec.min, spec.max),
        "aria-label": `${current.name}`,
      }) as HTMLInputElement;
      slider.setAttribute("aria-valuetext", `${fmt(phys)} ${spec.unit}`);
      slider.addEventListener("input", () => {
        writePhys(current, bytes, Number(slider.value), big);
        const p = physFromBytes(current, bytes, big);
        num.textContent = fmt(p);
        slider.setAttribute("aria-valuetext", `${fmt(p)} ${spec.unit}`);
        prevByte = bytes[current.byteOrder![0]];
        render(current.byteOrder!);
      });
      node.push(
        h("div", { class: "big-val" }, [num, h("span", { class: "bv-unit" }, [spec.unit])]),
        h("label", { class: "range-field" }, [
          h("span", { class: "range-lab" }, [t("decoder.value")]),
          slider,
        ]),
      );
      if (current.biEndian) {
        const mk = (b: boolean, key: string) =>
          h("button", {
            class: `endian-btn${big === b ? " on" : ""}`, type: "button",
            onclick: () => {
              if (big === b) return;
              big = b;
              const p = physFromBytes(current, bytes, big);
              num.textContent = fmt(p);
              slider.value = String(clamp(p, spec.min, spec.max));
              buildControl();
              render(current.byteOrder!);
            },
          }, [t(key)]);
        node.push(h("div", { class: "endian-toggle" }, [
          h("span", { class: "endian-lab" }, [t("decoder.endian")]),
          mk(true, "decoder.endianBig"),
          mk(false, "decoder.endianLittle"),
        ]));
      }
    } else {
      const v0 = bytes[current.byteIndex!];
      const big0 = h("span", { class: "bv-num flags" }, [`0x${hex2(v0)}`]);
      const toggles = current.bits!.map((bit) =>
        h("button", {
          class: `flag-tog${(bytes[current.byteIndex!] & (1 << bit.pos)) ? " on" : ""}`,
          type: "button", "aria-pressed": (bytes[current.byteIndex!] & (1 << bit.pos)) ? "true" : "false",
          onclick: (e: Event) => {
            prevByte = bytes[current.byteIndex!];
            bytes[current.byteIndex!] ^= 1 << bit.pos;
            const btn = e.currentTarget as HTMLButtonElement;
            const now = (bytes[current.byteIndex!] & (1 << bit.pos)) !== 0;
            btn.classList.toggle("on", now);
            btn.setAttribute("aria-pressed", now ? "true" : "false");
            big0.textContent = `0x${hex2(bytes[current.byteIndex!])}`;
            render([current.byteIndex!]);
          },
        }, [bit.label]),
      );
      node.push(
        h("div", { class: "big-val" }, [big0]),
        h("div", { class: "flag-toggles" }, toggles),
      );
    }
    controlWrap.replaceChildren(...node);
  }

  // ---- signal selection ----
  function selectSignal(sig: Signal): void {
    current = sig;
    bytes.fill(0);
    if (sig.kind === "scalar") {
      writePhys(sig, bytes, sig.defaultValue ?? sig.gauge!.min, big);
      prevByte = bytes[sig.byteOrder![0]];
    } else {
      bytes[sig.byteIndex!] = sig.defaultBits ?? 0;
      prevByte = bytes[sig.byteIndex!];
    }
    widget = widgetFor(sig);
    visualWrap.replaceChildren(widget.node);
    help.textContent = sig.help;
    const idn = parseInt(sig.canId, 16);
    meta.replaceChildren(
      `${t("decoder.idWord")} 0x${sig.canId} · `,
      h("span", { class: `src-tag src-${sig.source}` }, [t(`decoder.src.${sig.source}`)]),
      ` · ${t("decoder.priority").toLowerCase()} ${t(priorityKey(idn))}`,
    );
    for (const c of chipsRow.querySelectorAll(".sig-chip")) {
      c.classList.toggle("active", (c as HTMLElement).dataset.id === sig.id);
      c.setAttribute("aria-pressed", (c as HTMLElement).dataset.id === sig.id ? "true" : "false");
    }
    buildControl();
    render(current.kind === "flags" ? [current.byteIndex!] : current.byteOrder!);
  }

  for (const sig of signals) {
    chipsRow.append(h("button", {
      class: "sig-chip", type: "button", "data-id": sig.id,
      onclick: () => selectSignal(sig),
    }, [sig.name]));
  }

  // ---- examples (secondary reading) ----
  function snapLine(snap: Example["legit"], changed: number[]): HTMLElement {
    const idChanged = changed.includes(-1);
    const parts: (Node | string)[] = [idChanged ? h("span", { class: "chg" }, [snap.canId]) : snap.canId, "  "];
    snap.bytes.forEach((b, i) => {
      parts.push(changed.includes(i) ? h("span", { class: "chg" }, [b]) : b);
      if (i < snap.bytes.length - 1) parts.push(" ");
    });
    return h("code", { class: "snap" }, parts);
  }
  const exampleCards = examples.map((e) =>
    h("article", { class: "ex-card" }, [
      h("h4", {}, [e.title]),
      h("p", { class: "ex-ctx" }, [e.context]),
      h("div", { class: "ex-pair" }, [
        h("div", { class: "ex-snap legit" }, [h("span", { class: "ex-lab" }, [t("decoder.legit")]), snapLine(e.legit, [])]),
        h("div", { class: "ex-snap forged" }, [h("span", { class: "ex-lab" }, [t("decoder.forged")]), snapLine(e.forged, e.changed)]),
      ]),
      h("p", { class: "ex-effect" }, [h("span", { class: "ex-effect-k" }, [t("decoder.effect")]), " ", e.effect]),
    ]),
  );

  // ---- assemble sandbox ----
  const sandbox = h("div", { class: "sandbox" }, [
    visualWrap,
    h("div", { class: "sb-panel" }, [
      chipsRow,
      controlWrap,
      help,
      h("div", { class: "frame-block" }, [
        h("span", { class: "fb-cap" }, [t("decoder.frameLabel")]),
        bandWrap,
      ]),
      interp,
      meta,
      h("details", { class: "deep bits-deep" }, [
        h("summary", {}, [h("span", { class: "caret" }), t("decoder.seeBits")]),
        bitsWrap,
      ]),
    ]),
  ]);

  selectSignal(current);

  return h("article", { class: "reading decoder-page" }, [
    h("header", { class: "read-head" }, [
      h("p", { class: "eyebrow" }, [t("nav.decoder")]),
      h("h1", {}, [t("decoder.title")]),
      h("p", { class: "lede" }, [t("decoder.lede")]),
    ]),
    sandbox,
    h("section", { class: "read-sec" }, [
      h("h2", {}, [t("decoder.scenarios")]),
      h("p", { class: "tool-group-intro" }, [t("decoder.scenariosHint")]),
      h("div", { class: "ex-grid" }, exampleCards),
    ]),
    h("p", { class: "tool-note" }, [t("decoder.foot")]),
  ]);
}
