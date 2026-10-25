import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/app.css";

import { h } from "./ui/dom";
import { el } from "./render/svg";
import { getAttacks, validateCatalog } from "./data/catalog";
import { createVehiclePlan } from "./render/vehicle";
import { createCatalog, type Filter } from "./ui/catalog";
import { createFiche } from "./ui/fiche";
import { createSwitches } from "./ui/switches";
import { createCanbusView } from "./ui/canbus";
import { createToolsView } from "./ui/tools";
import { blockingMeasure } from "./sim/engine";
import { t, initLang, getLang, setLang, LANGS, type Lang } from "./i18n";
import type { Countermeasure } from "./data/types";

const root = document.getElementById("app")!;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- state that survives a language switch (which rebuilds the DOM) ----
const active = new Set<Countermeasure>();
let currentId = "C2";
let catalogFilter: Filter = "all";
let ficheOpen = true;
let trafficTimer: number | undefined;

// ---- routing (hash based, GitHub Pages friendly) ----
type Route = "home" | "canbus" | "tools";
function currentRoute(): Route {
  const hash = location.hash.replace(/^#\/?/, "");
  if (hash === "bus-can") return "canbus";
  if (hash === "outils") return "tools";
  return "home";
}

// ---- theme ----
function effectiveTheme(): "dark" | "light" {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "dark" || set === "light") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function initTheme(): void {
  try {
    const stored = localStorage.getItem("cae.theme");
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  } catch {
    /* ignore */
  }
}
function toggleTheme(): void {
  const next = effectiveTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("cae.theme", next);
  } catch {
    /* ignore */
  }
}

// ---- brand glyph ----
function glyph(): SVGSVGElement {
  const s = el("svg", { viewBox: "0 0 24 24", width: 18, height: 18, "aria-hidden": "true" });
  s.append(
    el("path", {
      d: "M5 15c0-4 2-8 7-8s7 4 7 8",
      fill: "none",
      stroke: "var(--accent)",
      "stroke-width": 1.8,
      "stroke-linecap": "round",
    }),
    el("circle", { cx: 12, cy: 13.5, r: 1.8, fill: "var(--attack)" }),
  );
  return s;
}

function navLink(route: Route, target: string, key: string, active: Route): HTMLElement {
  return h(
    "a",
    {
      class: "nav-link",
      href: target,
      "aria-current": route === active ? "page" : "false",
    },
    [t(key)],
  );
}

function render(): void {
  if (trafficTimer) window.clearInterval(trafficTimer);
  const route = currentRoute();

  // ---- topbar ----
  const themeBtn = h(
    "button",
    { class: "ctrl", type: "button", onclick: () => {
      toggleTheme();
      themeBtn.textContent = effectiveTheme() === "dark" ? t("controls.toLight") : t("controls.toDark");
    } },
    [effectiveTheme() === "dark" ? t("controls.toLight") : t("controls.toDark")],
  );

  const langSel = h("select", {
    class: "ctrl",
    "aria-label": t("controls.langLabel"),
    onchange: (e: Event) => {
      setLang((e.target as HTMLSelectElement).value as Lang);
      render();
    },
  });
  for (const l of LANGS) {
    const opt = h("option", { value: l }, [l.toUpperCase()]);
    if (l === getLang()) opt.setAttribute("selected", "");
    langSel.append(opt);
  }

  const nav = h("nav", { class: "nav", "aria-label": t("nav.label") }, [
    navLink("home", "#/", "nav.explore", route),
    navLink("canbus", "#/bus-can", "nav.canbus", route),
    navLink("tools", "#/outils", "nav.tools", route),
  ]);

  const topbar = h("div", { class: "topbar" }, [
    h("a", { class: "brand", href: "#/" }, [
      h("div", { class: "glyph" }, [glyph()]),
      h("div", {}, [
        h("div", { class: "name" }, [t("brand.name")]),
        h("div", { class: "tag" }, [t("brand.tag")]),
      ]),
    ]),
    nav,
    langSel,
    themeBtn,
  ]);

  // ---- main content per route ----
  const footer = h("footer", { class: "ethic" }, [
    h("p", {}, [t("footer.p1")]),
    h("p", {}, [t("footer.p2")]),
  ]);

  const main = h("main", { id: "content" });
  if (route === "canbus") {
    main.append(createCanbusView(), footer);
  } else if (route === "tools") {
    main.append(createToolsView(), footer);
  } else {
    main.append(buildExplorer(), footer);
  }

  root.replaceChildren(
    h("a", { class: "skip-link", href: "#content" }, [t("skip")]),
    h("div", { class: "wrap" }, [topbar, main]),
  );
  root.setAttribute("aria-busy", "false");
  window.scrollTo(0, 0);
}

function buildExplorer(): HTMLElement {
  const catalogAttacks = getAttacks(getLang());
  const byId = (id: string) => catalogAttacks.find((a) => a.id === id) ?? catalogAttacks[0];

  const plan = createVehiclePlan(reduceMotion);

  // ---- hero ----
  const hero = h("header", { class: "hero" }, [
    h("h1", {}, [t("hero.title"), " ", h("em", {}, [t("hero.titleEm")])]),
    h("p", { class: "lede" }, [t("hero.lede")]),
    h("p", { class: "ctx" }, [
      h("span", {}, [t("hero.ctx1pre"), " ", h("b", {}, [t("hero.ctx1b")]), " ", t("hero.ctx1post")]),
      h("span", {}, [h("b", {}, [t("hero.ctx2b")]), " ", t("hero.ctx2post")]),
    ]),
  ]);

  // ---- figure ----
  const rateEl = h("b", { id: "rate" }, ["1 240"]);
  const figure = h("section", { class: "figure" }, [
    h("div", { class: "readout" }, [
      h("span", { class: "live", "aria-hidden": "true" }),
      t("fig.readout"),
      " ",
      rateEl,
      " ",
      t("fig.unit"),
    ]),
    plan.element,
    h("div", { class: "legend" }, [
      legendItem("powertrain"),
      legendItem("chassis"),
      legendItem("bodyd"),
      legendItem("info"),
      h("span", {}, [h("i", { class: "path" }), t("legend.path")]),
    ]),
    h("p", { class: "caption" }, [t("fig.caption")]),
  ]);

  // ---- catalog / fiche / switches ----
  const fiche = createFiche(byId(currentId), ficheOpen, (v) => {
    ficheOpen = v;
  });

  const catalog = createCatalog(
    catalogAttacks,
    currentId,
    (id) => {
      currentId = id;
      catalog.setCurrent(id);
      fiche.update(byId(id));
      applyAttack();
    },
    catalogFilter,
    (f) => {
      catalogFilter = f;
    },
  );

  const switches = createSwitches(active, (cm) => {
    if (active.has(cm)) active.delete(cm);
    else active.add(cm);
    applyAttack();
  });

  function applyAttack(): void {
    const a = byId(currentId);
    const blocked = blockingMeasure(a, active);
    plan.setAttack(a, blocked);
    switches.setVerdict(a, blocked);
  }

  applyAttack();
  if (reduceMotion) {
    document.body.classList.add("reduce");
  } else {
    trafficTimer = window.setInterval(() => {
      const n = 1180 + Math.round(Math.random() * 150);
      rateEl.textContent = n.toLocaleString("fr-FR").replace(/[ ,]/g, " ");
    }, 1700);
  }

  return h("div", {}, [
    hero,
    h("div", { class: "explore" }, [figure, catalog.element, fiche.summary, switches.element, fiche.detail]),
  ]);
}

function legendItem(domain: string): HTMLElement {
  return h("span", {}, [
    h("i", { style: `background:var(--${domain})` }),
    t(`legend.${domain}`),
  ]);
}

initTheme();
initLang();

if (import.meta.env.DEV) {
  const problems = validateCatalog();
  if (problems.length > 0) {
    console.warn("[catalog] identifiants a verifier:\n" + problems.join("\n"));
  }
}

window.addEventListener("hashchange", render);
render();
