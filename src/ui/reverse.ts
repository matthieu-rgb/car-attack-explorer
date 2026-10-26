import { h } from "./dom";
import { t, getLang } from "../i18n";
import { renderBlock } from "./reading";
import {
  getReverse, snifferRows, snifferActions, inject, type ReverseContent,
} from "../data/reverse";

function hex2(n: number): string {
  return (n & 0xff).toString(16).toUpperCase().padStart(2, "0");
}
function detached(node: Node): boolean {
  return !document.body.contains(node);
}

// --------------------------------------------------- atelier 1 : sniffer
function buildSniffer(c: ReverseContent): HTMLElement {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isolate = false;
  let activeId: string | null = null;

  const cells = new Map<string, HTMLElement[]>();
  const rowEls = new Map<string, HTMLElement>();
  const live = snifferRows.map((r) => ({ id: r.id, bytes: [...r.bytes], noise: r.noise }));

  const rowsWrap = h("div", { class: "sniff-rows" });
  for (const r of live) {
    const cEls = r.bytes.map((b) => h("span", { class: "sn-cell" }, [b]));
    cells.set(r.id, cEls);
    const parts: (Node | string)[] = [h("span", { class: "sn-id" }, [`0x${r.id}`])];
    cEls.forEach((e) => parts.push(e));
    const row = h("div", { class: "sn-row" }, parts);
    rowEls.set(r.id, row);
    rowsWrap.append(row);
  }

  const readout = h("p", { class: "sniff-readout" }, [c.snifferIdle]);

  function applyIsolate(): void {
    for (const [id, row] of rowEls) {
      row.classList.toggle("dimmed", isolate && activeId !== null && id !== activeId);
    }
  }

  const actionBtns = snifferActions.map((a) =>
    h("button", { class: "sn-act", type: "button", onclick: () => {
      const row = live.find((r) => r.id === a.targetId)!;
      const cEls = cells.get(a.targetId)!;
      a.targetBytes.forEach((bi, k) => {
        row.bytes[bi] = a.toVals[k];
        cEls[bi].textContent = a.toVals[k];
        cEls[bi].classList.remove("hit");
        void cEls[bi].offsetWidth; // relance l'animation
        cEls[bi].classList.add("hit");
      });
      activeId = a.targetId;
      readout.replaceChildren(h("span", { class: "ro-id" }, [`▸`]), " ", c.snifferNotes[a.key]);
      applyIsolate();
    } }, [c.snifferActionLabels[a.key]]),
  );

  const diffBtn = h("button", { class: "sn-diff", type: "button", "aria-pressed": "false" }, [c.snifferDiffLabel]);
  diffBtn.addEventListener("click", () => {
    isolate = !isolate;
    diffBtn.classList.toggle("on", isolate);
    diffBtn.setAttribute("aria-pressed", isolate ? "true" : "false");
    applyIsolate();
  });

  // trafic de fond
  if (!reduce) {
    const timer = window.setInterval(() => {
      if (detached(rowsWrap)) { window.clearInterval(timer); return; }
      for (const r of live) {
        if (!r.noise) continue;
        const bi = Math.floor(Math.random() * 8);
        const nv = hex2(Math.floor(Math.random() * 256));
        r.bytes[bi] = nv;
        const cEls = cells.get(r.id)!;
        cEls[bi].textContent = nv;
      }
    }, 820);
  }

  return h("div", { class: "demo sniffer" }, [
    h("div", { class: "demo-head" }, [
      h("h3", {}, [c.snifferTitle]),
      h("p", { class: "demo-hint" }, [c.snifferHint]),
    ]),
    rowsWrap,
    h("div", { class: "sniff-controls" }, [
      h("div", { class: "sn-acts" }, actionBtns),
      diffBtn,
    ]),
    readout,
  ]);
}

// --------------------------------------------------- atelier 2 : injection
function buildInject(c: ReverseContent): HTMLElement {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cadence = 30;
  let secoc = false;

  const num = h("span", { class: "inj-num" }, [`${inject.legit}`]);
  const unit = h("span", { class: "inj-unit" }, [inject.unit]);
  const display = h("div", { class: "inj-display" }, [
    h("span", { class: "inj-lab" }, [c.injectReadout]),
    h("div", { class: "inj-val" }, [num, unit]),
  ]);
  const msg = h("p", { class: "inj-msg" }, []);

  const slider = h("input", {
    class: "range", type: "range", min: 0, max: 100, step: 1, value: cadence,
    "aria-label": c.injectCadence,
  }) as HTMLInputElement;
  const cadVal = h("span", { class: "inj-cadval" }, [`${cadence}%`]);
  slider.addEventListener("input", () => {
    cadence = Number(slider.value);
    cadVal.textContent = `${cadence}%`;
  });

  const secocBtn = h("button", { class: "sn-diff", type: "button", "aria-pressed": "false" }, [c.injectSecoc]);
  secocBtn.addEventListener("click", () => {
    secoc = !secoc;
    secocBtn.classList.toggle("on", secoc);
    secocBtn.setAttribute("aria-pressed", secoc ? "true" : "false");
  });

  function show(forged: boolean): void {
    num.textContent = forged ? `${inject.forged}` : `${inject.legit}`;
    num.classList.toggle("forged", forged);
  }

  if (reduce) {
    show(false);
    msg.textContent = c.injectNote;
  } else {
    const timer = window.setInterval(() => {
      if (detached(display)) { window.clearInterval(timer); return; }
      if (secoc) {
        show(false);
        msg.textContent = c.injectSecocMsg;
        return;
      }
      const forged = Math.random() < cadence / 100;
      show(forged);
      msg.textContent = "";
    }, 240);
  }

  return h("div", { class: "demo inject" }, [
    h("div", { class: "demo-head" }, [
      h("h3", {}, [c.injectTitle]),
      h("p", { class: "demo-hint" }, [c.injectHint]),
    ]),
    display,
    msg,
    h("label", { class: "range-field" }, [
      h("span", { class: "range-lab" }, [c.injectCadence, " ", cadVal]),
      slider,
    ]),
    h("div", { class: "inj-controls" }, [secocBtn]),
    h("p", { class: "demo-note" }, [c.injectNote]),
  ]);
}

// --------------------------------------------------- page
export function createReverseView(): HTMLElement {
  const c = getReverse(getLang());

  const paras = (arr: string[]) => arr.map((text) => renderBlock({ t: "p", text }));

  const s1 = h("section", { class: "read-sec" }, [
    h("h2", {}, [c.s1Title]),
    ...paras(c.s1Intro),
    buildSniffer(c),
    renderBlock({ t: "ol", items: c.s1Steps }),
    renderBlock({ t: "code", caption: c.s1Cmd.caption, lines: c.s1Cmd.lines }),
    renderBlock({ t: "p", text: c.s1Close }),
    h("div", { class: "read-cta" }, [h("a", { class: "cta-btn", href: "#/decodeur" }, [c.ctaDecode])]),
  ]);

  const s2 = h("section", { class: "read-sec" }, [
    h("h2", {}, [c.s2Title]),
    ...paras(c.s2Intro),
    buildInject(c),
    renderBlock({ t: "code", caption: c.s2Cmd.caption, lines: c.s2Cmd.lines }),
    renderBlock({ t: "ol", items: c.s2Steps }),
    renderBlock({ t: "note", text: c.s2Def }),
    h("div", { class: "read-cta" }, [h("a", { class: "cta-btn ghost", href: "#/" }, [c.ctaAttacks])]),
  ]);

  return h("article", { class: "reading" }, [
    h("header", { class: "read-head" }, [
      h("p", { class: "eyebrow" }, [t("nav.reverse")]),
      h("h1", {}, [c.title]),
      h("p", { class: "lede" }, [c.lede]),
    ]),
    s1,
    s2,
  ]);
}
