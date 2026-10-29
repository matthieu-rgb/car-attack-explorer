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
import { createFrameView } from "./ui/frame";
import { createReverseView } from "./ui/reverse";
import { createBlogIndexView, createArticleView } from "./ui/blog";
import { createUdsView } from "./ui/uds";
import { createAtelierView } from "./ui/atelier";
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
type Route = "home" | "canbus" | "decoder" | "reverse" | "blog" | "uds" | "atelier" | "tools";
function hashParts(): { route: Route; slug: string } {
  const raw = location.hash.replace(/^#\/?/, "");
  const [seg0, seg1 = ""] = raw.split("/");
  switch (seg0) {
    case "bus-can":
      return { route: "canbus", slug: "" };
    case "decodeur":
      return { route: "decoder", slug: "" };
    case "reverse":
      return { route: "reverse", slug: "" };
    case "analyses":
      return { route: "blog", slug: seg1 };
    case "uds":
      return { route: "uds", slug: "" };
    case "atelier":
      return { route: "atelier", slug: "" };
    case "outils":
      return { route: "tools", slug: "" };
    default:
      return { route: "home", slug: "" };
  }
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
  const { route, slug } = hashParts();

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
    navLink("blog", "#/analyses", "nav.blog", route),
    navLink("canbus", "#/bus-can", "nav.canbus", route),
    navLink("decoder", "#/decodeur", "nav.decoder", route),
    navLink("reverse", "#/reverse", "nav.reverse", route),
    navLink("uds", "#/uds", "nav.uds", route),
    navLink("atelier", "#/atelier", "nav.atelier", route),
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
  } else if (route === "decoder") {
    main.append(createFrameView(), footer);
  } else if (route === "reverse") {
    main.append(createReverseView(), footer);
  } else if (route === "blog") {
    main.append(slug ? createArticleView(slug) : createBlogIndexView(), footer);
  } else if (route === "uds") {
    main.append(createUdsView(), footer);
  } else if (route === "atelier") {
    main.append(createAtelierView(), footer);
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
  void (async () => {
    const [{ getCanbus }, { getUds }, { getAtelier }, { getArticles }, { validateReadingShape }] = await Promise.all([
      import("./data/canbus"),
      import("./data/uds"),
      import("./data/atelier"),
      import("./data/articles"),
      import("./data/reading"),
    ]);
    const checks: string[] = [];
    const asPage = (title: string, sections: import("./data/reading").Section[]) => ({ title, lede: "", sections });
    for (const lang of ["de", "en"] as const) {
      checks.push(...validateReadingShape(getCanbus("fr"), getCanbus(lang), `canbus/${lang}`));
      checks.push(...validateReadingShape(getUds("fr"), getUds(lang), `uds/${lang}`));
      checks.push(...validateReadingShape(getAtelier("fr"), getAtelier(lang), `atelier/${lang}`));
      const baseArt = getArticles("fr");
      const otherArt = getArticles(lang);
      for (const a of baseArt) {
        const o = otherArt.find((x) => x.slug === a.slug);
        if (o) checks.push(...validateReadingShape(asPage(a.slug, a.sections), asPage(o.slug, o.sections), `article:${a.slug}/${lang}`));
      }
    }
    if (checks.length > 0) console.warn("[i18n] structure a verifier:\n" + checks.join("\n"));
  })();
}

window.addEventListener("hashchange", render);
render();
