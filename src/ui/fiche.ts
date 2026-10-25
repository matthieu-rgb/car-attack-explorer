import { h } from "./dom";
import { t } from "../i18n";
import { vehicle } from "../data/vehicle";
import type { Attack } from "../data/types";

const nodeLabel = new Map(vehicle.nodes.map((n) => [n.id, n.label]));

export interface Fiche {
  element: HTMLElement;
  update(attack: Attack): void;
}

export function createFiche(
  initial: Attack,
  open: boolean,
  onOpenChange: (v: boolean) => void,
): Fiche {
  const element = h("article", { class: "fiche", id: "fiche", tabindex: "-1" });

  function textField(key: string, value: string): HTMLElement {
    return h("div", { class: "field" }, [h("h4", {}, [t(key)]), h("p", {}, [value])]);
  }

  function listField(
    key: string,
    items: string[],
    tag: "ul" | "ol",
    listClass?: string,
  ): HTMLElement {
    const list = h(tag, listClass ? { class: listClass } : {}, items.map((it) => h("li", {}, [it])));
    return h("div", { class: "field" }, [h("h4", {}, [t(key)]), list]);
  }

  function frameField(a: Attack): HTMLElement | null {
    if (!a.frame) return null;
    const pre = h("pre", {});
    for (const line of a.frame.lines) {
      if (line.mark === "hl") pre.append(h("span", { class: "hl" }, [line.text]), "\n");
      else if (line.mark === "ok") pre.append(h("span", { class: "okv" }, [line.text]), "\n");
      else pre.append(line.text + "\n");
    }
    return h("div", { class: "field span" }, [
      h("figure", { class: "frame" }, [h("figcaption", {}, [a.frame.caption]), pre]),
    ]);
  }

  function build(a: Attack): void {
    const chips: HTMLElement[] = [];
    if (a.target) {
      const label = a.target === "gateway" ? "Central Gateway" : nodeLabel.get(a.target) ?? a.target;
      chips.push(h("span", { class: "chip target" }, [`${t("fiche.chip.target")} : ${label}`]));
    }
    if (a.blockedBy.length > 0) {
      const names = a.blockedBy.map((c) => t(`cm.${c}.lab`)).join(", ");
      chips.push(h("span", { class: "chip remedy" }, [names]));
    } else {
      chips.push(h("span", { class: "chip" }, [t("fiche.chip.remedyNone")]));
    }

    const body: HTMLElement[] = [
      textField("fiche.f.principe", a.principe),
      textField("fiche.f.pourquoi", a.pourquoi),
      listField("fiche.f.methode", a.methode, "ol"),
      listField("fiche.f.prerequis", a.prerequis, "ul"),
      textField("fiche.f.effet", a.effet),
    ];
    const frame = frameField(a);
    if (frame) body.push(frame);
    body.push(listField("fiche.f.remediations", a.remediations, "ul"));
    body.push(listField("fiche.f.outils", a.outils, "ul", "tools"));
    body.push(textField("fiche.f.annexe5", a.annexe5));
    if (a.casReel) {
      body.push(
        h("div", { class: "field span" }, [
          h("h4", {}, [t("fiche.f.casReel")]),
          h("p", { class: "case" }, [a.casReel]),
        ]),
      );
    }

    const details = h("details", { class: "deep" }, [
      h("summary", {}, [h("span", { class: "caret" }), t("fiche.deepToggle")]),
      h("div", { class: "deep-body" }, body),
    ]);
    if (open) details.setAttribute("open", "");
    details.addEventListener("toggle", () => {
      open = details.hasAttribute("open");
      onOpenChange(open);
    });

    element.replaceChildren(
      h("div", { class: "head" }, [
        h("div", { class: "kicker" }, [`${a.id} — ${t("fiche.kicker")} ${a.layer}`]),
        h("h3", {}, [a.nom]),
        h("p", { class: "n1" }, [a.resume]),
        h("div", { class: "meta" }, chips),
      ]),
      details,
    );
  }

  build(initial);
  return { element, update: build };
}
