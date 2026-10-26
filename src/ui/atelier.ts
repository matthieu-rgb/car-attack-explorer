import { t, getLang } from "../i18n";
import { getAtelier } from "../data/atelier";
import { createReadingView } from "./reading";

export function createAtelierView(): HTMLElement {
  return createReadingView(getAtelier(getLang()), {
    eyebrow: t("nav.atelier"),
    idPrefix: "atelier",
  });
}
