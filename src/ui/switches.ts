import { h } from "./dom";
import { t } from "../i18n";
import type { Attack, Countermeasure } from "../data/types";

// Display order of the countermeasure switches.
const CM_ORDER: Countermeasure[] = ["secoc", "segmentation", "durcissement"];

export interface Switches {
  element: HTMLElement;
  setVerdict(attack: Attack, blockedBy: Countermeasure | null): void;
}

export function createSwitches(
  active: Set<Countermeasure>,
  onToggle: (cm: Countermeasure) => void,
): Switches {
  const verdict = h("div", { class: "verdict pass", role: "status", "aria-live": "polite" });

  const swEls = new Map<Countermeasure, HTMLButtonElement>();
  const row = h("div", { class: "switches" });
  for (const cm of CM_ORDER) {
    const btn = h(
      "button",
      {
        class: "sw",
        type: "button",
        "aria-pressed": active.has(cm) ? "true" : "false",
        onclick: () => {
          const pressed = btn.getAttribute("aria-pressed") === "true";
          btn.setAttribute("aria-pressed", pressed ? "false" : "true");
          onToggle(cm);
        },
      },
      [
        h("span", { class: "knob", "aria-hidden": "true" }),
        h("span", {}, [
          h("span", { class: "lab" }, [t(`cm.${cm}.lab`)]),
          h("span", { class: "d" }, [t(`cm.${cm}.desc`)]),
        ]),
      ],
    );
    swEls.set(cm, btn);
    row.append(btn);
  }

  const element = h("section", { class: "cm", "aria-label": t("cm.title") }, [
    h("h3", {}, [t("cm.title")]),
    h("p", { class: "sub" }, [t("cm.sub")]),
    row,
    verdict,
  ]);

  function setVerdict(attack: Attack, blockedBy: Countermeasure | null): void {
    const blocked = blockedBy !== null;
    verdict.className = "verdict " + (blocked ? "block" : "pass");
    verdict.replaceChildren(
      h("span", { class: "st" }, [blocked ? t("verdict.block") : t("verdict.pass")]),
      h("p", {}, [blocked ? attack.verdictBlock : attack.verdictPass]),
    );
  }

  return { element, setVerdict };
}
