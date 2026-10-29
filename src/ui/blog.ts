// Rubrique "Analyses" : index des articles + vue d'un article.
// Reutilise renderBlock du moteur de lecture pour le corps des articles.

import { h } from "./dom";
import { renderBlock } from "./reading";
import { t, getLang, type Lang } from "../i18n";
import { getArticles, getArticle, type Article, type Vector } from "../data/articles";

const VECTOR_COLOR: Record<Vector, string> = {
  can: "var(--chassis)",
  api: "var(--bodyd)",
  hardware: "var(--powertrain)",
  rf: "var(--info)",
  charge: "var(--attack)",
};

// Mois en ASCII, par langue : on evite d'introduire des accents au rendu.
const MONTHS: Record<Lang, string[]> = {
  fr: ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"],
  de: ["Januar", "Februar", "Maerz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const month = MONTHS[lang][(m || 1) - 1];
  if (lang === "de") return `${d}. ${month} ${y}`;
  if (lang === "en") return `${month} ${d}, ${y}`;
  return `${d} ${month} ${y}`;
}

function vectorChip(a: Article): HTMLElement {
  return h("span", { class: "post-vec", style: `color:${VECTOR_COLOR[a.vector]}` }, [
    h("i", { class: "post-dot", "aria-hidden": "true" }),
    t(`blog.vector.${a.vector}`),
  ]);
}

function metaRow(a: Article, lang: Lang): HTMLElement {
  return h("div", { class: "post-meta" }, [
    vectorChip(a),
    h("span", { class: "post-dot-sep", "aria-hidden": "true" }, ["·"]),
    h("time", { datetime: a.date }, [formatDate(a.date, lang)]),
    h("span", { class: "post-dot-sep", "aria-hidden": "true" }, ["·"]),
    h("span", {}, [`${a.readMins} ${t("blog.readSuffix")}`]),
  ]);
}

export function createBlogIndexView(): HTMLElement {
  const lang = getLang();
  const articles = getArticles(lang);

  const cards = articles.map((a) =>
    h("a", { class: "post-card", href: `#/analyses/${a.slug}` }, [
      metaRow(a, lang),
      h("h2", {}, [a.title]),
      h("p", { class: "post-dek" }, [a.dek]),
      h("div", { class: "post-tags" }, a.tags.map((tag) => h("span", { class: "post-tag" }, [tag]))),
    ]),
  );

  return h("div", { class: "blog" }, [
    h("header", { class: "read-head" }, [
      h("p", { class: "eyebrow" }, [t("nav.blog")]),
      h("h1", {}, [t("blog.title")]),
      h("p", { class: "lede" }, [t("blog.lede")]),
    ]),
    h("div", { class: "post-list" }, cards),
  ]);
}

function ficheBox(a: Article): HTMLElement {
  const row = (labelKey: string, value: string) =>
    h("div", { class: "af-row" }, [
      h("dt", {}, [t(labelKey)]),
      h("dd", {}, [value]),
    ]);
  return h("aside", { class: "article-fiche" }, [
    h("p", { class: "af-title" }, [t("blog.ficheTitle")]),
    h("dl", {}, [
      row("article.cible", a.fiche.cible),
      row("article.entree", a.fiche.entree),
      row("article.methode", a.fiche.methode),
      row("article.faille", a.fiche.faille),
    ]),
  ]);
}

export function createArticleView(slug: string): HTMLElement {
  const lang = getLang();
  const a = getArticle(slug, lang);

  const back = h("a", { class: "blog-back", href: "#/analyses" }, [`← ${t("blog.back")}`]);

  if (!a) {
    return h("article", { class: "reading blog-article" }, [
      back,
      h("header", { class: "read-head" }, [h("h1", {}, [t("blog.notFound")])]),
    ]);
  }

  const sections = a.sections.map((s) =>
    h("section", { class: "read-sec", id: `art-${s.id}` }, [
      h("h2", {}, [s.heading]),
      ...s.blocks.map(renderBlock),
    ]),
  );

  const sources = h("section", { class: "read-sec article-sources" }, [
    h("h2", {}, [t("blog.sources")]),
    h("ul", { class: "links" }, a.sources.map((src) =>
      h("li", {}, [h("a", { href: src.url, target: "_blank", rel: "noopener noreferrer" }, [src.label])]),
    )),
  ]);

  return h("article", { class: "reading blog-article" }, [
    back,
    h("header", { class: "read-head article-head", style: `--vec:${VECTOR_COLOR[a.vector]}` }, [
      h("p", { class: "eyebrow", style: `color:${VECTOR_COLOR[a.vector]}` }, [t(`blog.vector.${a.vector}`)]),
      h("h1", {}, [a.title]),
      metaRow(a, lang),
      h("p", { class: "lede" }, [a.dek]),
    ]),
    ficheBox(a),
    ...sections,
    sources,
    h("div", { class: "read-cta" }, [
      h("a", { class: "cta-btn", href: "#/analyses" }, [t("blog.back")]),
    ]),
  ]);
}
