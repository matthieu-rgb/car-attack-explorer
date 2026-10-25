import fr from "./fr.json";
import de from "./de.json";
import en from "./en.json";

// Adding a language = add its JSON import here. LANGS and the type derive from it.
const dicts = { fr, de, en } as const;

type Dict = Record<string, string>;
export type Lang = keyof typeof dicts;
export const LANGS = Object.keys(dicts) as Lang[];

let current: Lang = "fr";

function isLang(v: string): v is Lang {
  return (LANGS as string[]).includes(v);
}

function readStored(): Lang | null {
  try {
    const v = localStorage.getItem("cae.lang");
    if (v && isLang(v)) return v;
  } catch {
    /* storage may be unavailable */
  }
  return null;
}

export function initLang(): Lang {
  const stored = readStored();
  if (stored) {
    current = stored;
  } else {
    const nav = navigator.language.slice(0, 2).toLowerCase();
    current = isLang(nav) ? nav : "fr";
  }
  document.documentElement.lang = current;
  return current;
}

export function getLang(): Lang {
  return current;
}

export function setLang(lang: Lang): void {
  current = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem("cae.lang", lang);
  } catch {
    /* ignore */
  }
}

// Translate a key. Falls back to French, then to the key itself.
export function t(key: string): string {
  return (dicts[current] as Dict)[key] ?? (dicts.fr as Dict)[key] ?? key;
}
