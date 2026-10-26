import { t, getLang } from "../i18n";
import { getUds } from "../data/uds";
import { createReadingView } from "./reading";

export function createUdsView(): HTMLElement {
  return createReadingView(getUds(getLang()), {
    eyebrow: t("nav.uds"),
    idPrefix: "uds",
    ctaHref: "#/",
    ctaLabel: t("canbus.cta"),
  });
}
