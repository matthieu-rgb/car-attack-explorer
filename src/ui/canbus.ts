import { t, getLang } from "../i18n";
import { getCanbus } from "../data/canbus";
import { createReadingView } from "./reading";

export function createCanbusView(): HTMLElement {
  return createReadingView(getCanbus(getLang()), {
    eyebrow: t("nav.canbus"),
    idPrefix: "can",
    ctaHref: "#/",
    ctaLabel: t("canbus.cta"),
  });
}
