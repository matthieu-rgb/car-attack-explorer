import type { Attack, Countermeasure } from "../data/types";

// Returns the active countermeasure that blocks this attack, or null if it passes.
// The order mirrors how the switches read: an attack can list several blockers,
// we report the first active one.
export function blockingMeasure(
  attack: Attack,
  active: Set<Countermeasure>,
): Countermeasure | null {
  for (const cm of attack.blockedBy) {
    if (active.has(cm)) return cm;
  }
  return null;
}
