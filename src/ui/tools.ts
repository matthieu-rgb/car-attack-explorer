import { h } from "./dom";
import { t, getLang } from "../i18n";
import { getToolGroups } from "../data/tools";

export function createToolsView(): HTMLElement {
  const groups = getToolGroups(getLang());

  const sections = groups.map((g) =>
    h("section", { class: "tool-group" }, [
      h("div", { class: "tool-group-head" }, [
        h("h2", {}, [g.titre]),
        h("p", { class: "tool-group-intro" }, [g.intro]),
      ]),
      h(
        "div",
        { class: "tool-grid" },
        g.tools.map((tool) =>
          h("article", { class: "tool-card" }, [
            h("div", { class: "tool-top" }, [
              h("h3", {}, [tool.nom]),
              h("span", { class: `tool-kind k-${tool.kind}` }, [t(`tools.kind.${tool.kind}`)]),
            ]),
            h("p", {}, [tool.desc]),
          ]),
        ),
      ),
    ]),
  );

  return h("article", { class: "reading tools-page" }, [
    h("header", { class: "read-head" }, [
      h("p", { class: "eyebrow" }, [t("nav.tools")]),
      h("h1", {}, [t("tools.title")]),
      h("p", { class: "lede" }, [t("tools.lede")]),
    ]),
    ...sections,
    h("p", { class: "tool-note" }, [t("tools.note")]),
  ]);
}
