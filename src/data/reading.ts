// Modele partage par toutes les pages de contenu (Le bus CAN, UDS, Atelier).
// Un bloc = une unite de mise en page ; le rendu vit dans ui/reading.ts.

export type Block =
  | { t: "p"; text: string }
  | { t: "note"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "duo"; aTitle: string; a: string[]; bTitle: string; b: string[] }
  | { t: "frame"; caption: string; lines: { text: string; mark?: "hl" | "ok" }[] }
  | { t: "table"; caption?: string; head: string[]; rows: string[][] }
  | { t: "code"; caption?: string; lines: string[] }
  | { t: "deflist"; items: { term: string; def: string }[] }
  | { t: "links"; items: { label: string; url: string; note?: string }[] };

export interface Section {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface ReadingPage {
  title: string;
  lede: string;
  sections: Section[];
}

// Garde-fou de developpement : une traduction doit refleter la structure FR
// (memes sections dans le meme ordre, meme suite de types de blocs).
export function validateReadingShape(base: ReadingPage, other: ReadingPage, tag: string): string[] {
  const errs: string[] = [];
  if (other.sections.length !== base.sections.length) {
    errs.push(`${tag}: ${other.sections.length} sections au lieu de ${base.sections.length}`);
  }
  base.sections.forEach((s, i) => {
    const o = other.sections[i];
    if (!o) return;
    if (o.id !== s.id) errs.push(`${tag}: section ${i} id "${o.id}" au lieu de "${s.id}"`);
    if (o.blocks.length !== s.blocks.length) {
      errs.push(`${tag}: section "${s.id}" a ${o.blocks.length} blocs au lieu de ${s.blocks.length}`);
    }
    s.blocks.forEach((b, j) => {
      const ob = o.blocks[j];
      if (ob && ob.t !== b.t) errs.push(`${tag}: section "${s.id}" bloc ${j} type "${ob.t}" au lieu de "${b.t}"`);
    });
  });
  return errs;
}
