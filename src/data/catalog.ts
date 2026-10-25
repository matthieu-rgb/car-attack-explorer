import { attacks } from "./attacks";
import { vehicle } from "./vehicle";
import { de } from "./content/de";
import { en } from "./content/en";
import type { Attack, AttackOverride } from "./types";
import type { Lang } from "../i18n";

const overrides: Record<Exclude<Lang, "fr">, Record<string, AttackOverride>> = { de, en };

// French is canonical (inline in attacks.ts); de/en overlay the textual fields.
export function getAttacks(lang: Lang): Attack[] {
  if (lang === "fr") return attacks;
  const ov = overrides[lang];
  return attacks.map((a) => ({ ...a, ...ov[a.id] }));
}

// Dev-time safety net: every route / entry / target id must resolve to a real
// point. Keeps adding an attack from silently falling back to the gateway.
export function validateCatalog(): string[] {
  const nodeIds = new Set(vehicle.nodes.map((n) => n.id));
  const entryIds = new Set(vehicle.entries.map((e) => e.id));
  const errors: string[] = [];
  const known = (id: string): boolean =>
    id === "gateway" ||
    (id.startsWith("entry:") && entryIds.has(id.slice(6))) ||
    nodeIds.has(id);

  for (const a of attacks) {
    if (!entryIds.has(a.entry)) errors.push(`${a.id}: entree inconnue "${a.entry}"`);
    for (const r of a.route) if (!known(r)) errors.push(`${a.id}: point de route inconnu "${r}"`);
    if (a.target && a.target !== "gateway" && !nodeIds.has(a.target)) {
      errors.push(`${a.id}: cible inconnue "${a.target}"`);
    }
  }
  return errors;
}
