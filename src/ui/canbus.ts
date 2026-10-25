import { h } from "./dom";
import { t, getLang } from "../i18n";
import { getCanbus, type Block } from "../data/canbus";

function renderBlock(b: Block): HTMLElement {
  switch (b.t) {
    case "p":
      return h("p", {}, [b.text]);
    case "ul":
      return h("ul", { class: "prose-list" }, b.items.map((it) => h("li", {}, [it])));
    case "frame": {
      const pre = h("pre", {});
      for (const line of b.lines) {
        if (line.mark === "hl") pre.append(h("span", { class: "hl" }, [line.text]), "\n");
        else if (line.mark === "ok") pre.append(h("span", { class: "okv" }, [line.text]), "\n");
        else pre.append(line.text + "\n");
      }
      return h("figure", { class: "frame" }, [h("figcaption", {}, [b.caption]), pre]);
    }
    case "duo":
      return h("div", { class: "duo" }, [
        h("div", { class: "duo-col" }, [
          h("h4", {}, [b.aTitle]),
          h("ul", { class: "prose-list" }, b.a.map((it) => h("li", {}, [it]))),
        ]),
        h("div", { class: "duo-col" }, [
          h("h4", {}, [b.bTitle]),
          h("ul", { class: "prose-list" }, b.b.map((it) => h("li", {}, [it]))),
        ]),
      ]);
  }
}

export function createCanbusView(): HTMLElement {
  const page = getCanbus(getLang());

  const sections = page.sections.map((s) =>
    h("section", { class: "read-sec", id: `can-${s.id}` }, [
      h("h2", {}, [s.heading]),
      ...s.blocks.map(renderBlock),
    ]),
  );

  const cta = h("div", { class: "read-cta" }, [
    h("a", { class: "cta-btn", href: "#/" }, [t("canbus.cta")]),
  ]);

  return h("article", { class: "reading" }, [
    h("header", { class: "read-head" }, [
      h("p", { class: "eyebrow" }, [t("nav.canbus")]),
      h("h1", {}, [page.title]),
      h("p", { class: "lede" }, [page.lede]),
    ]),
    ...sections,
    cta,
  ]);
}
