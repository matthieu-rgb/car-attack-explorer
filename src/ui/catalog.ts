import { h } from "./dom";
import { t } from "../i18n";
import type { Attack, LayerId, Level } from "../data/types";

const LAYER_ORDER: LayerId[] = ["A", "B", "C", "D", "E"];

export type Filter = "all" | Level;

export interface Catalog {
  element: HTMLElement;
  setCurrent(id: string): void;
}

export function createCatalog(
  attacks: Attack[],
  currentId: string,
  onSelect: (id: string) => void,
  initialFilter: Filter,
  onFilterChange: (f: Filter) => void,
): Catalog {
  let filter: Filter = initialFilter;
  const listWrap = h("div", { class: "list", role: "list" });

  function visible(): Attack[] {
    return attacks.filter((a) => filter === "all" || a.level === filter);
  }

  function buildList(): void {
    listWrap.replaceChildren();
    const items = visible();
    for (const layer of LAYER_ORDER) {
      const inLayer = items.filter((a) => a.layer === layer);
      if (inLayer.length === 0) continue;
      listWrap.append(h("div", { class: "layer-h" }, [t(`layer.${layer}`)]));
      for (const a of inLayer) {
        const btn = h(
          "button",
          {
            class: "atk",
            type: "button",
            role: "listitem",
            "data-id": a.id,
            "aria-current": a.id === currentId ? "true" : "false",
            onclick: () => onSelect(a.id),
          },
          [
            h("span", { class: "code" }, [a.id]),
            h("span", { class: "nm" }, [a.nom]),
            h("span", { class: "lv" }, [t(`level.${a.level}`)]),
          ],
        );
        listWrap.append(btn);
      }
    }
  }

  const filtersRow = h("div", { class: "filters", role: "group" });
  function buildFilters(): void {
    filtersRow.replaceChildren();
    (["all", "debutant", "avance"] as Filter[]).forEach((f) => {
      filtersRow.append(
        h(
          "button",
          {
            class: "filter",
            type: "button",
            "aria-pressed": filter === f ? "true" : "false",
            onclick: () => {
              filter = f;
              onFilterChange(f);
              buildFilters();
              buildList();
            },
          },
          [t(`filter.${f}`)],
        ),
      );
    });
  }

  buildFilters();
  buildList();

  const element = h("section", { class: "catalog", "aria-label": t("catalog.title") }, [
    h("h2", {}, [t("catalog.title")]),
    h("p", { class: "hint" }, [t("catalog.hint")]),
    filtersRow,
    listWrap,
  ]);

  function setCurrent(id: string): void {
    currentId = id;
    for (const b of listWrap.querySelectorAll<HTMLButtonElement>(".atk")) {
      b.setAttribute("aria-current", b.dataset.id === id ? "true" : "false");
    }
  }

  return { element, setCurrent };
}
