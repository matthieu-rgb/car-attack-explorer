import { h } from "./dom";
import type { Block, ReadingPage } from "../data/reading";

export function renderBlock(b: Block): HTMLElement {
  switch (b.t) {
    case "p":
      return h("p", {}, [b.text]);
    case "note":
      return h("aside", { class: "note" }, [b.text]);
    case "ul":
      return h("ul", { class: "prose-list" }, b.items.map((it) => h("li", {}, [it])));
    case "ol":
      return h("ol", { class: "prose-steps" }, b.items.map((it) => h("li", {}, [it])));
    case "duo":
      return h("div", { class: "duo" }, [
        h("div", { class: "duo-col" }, [
          h("h4", {}, [b.aTitle]),
          h("ul", { class: "prose-list" }, b.a.map((it) => h("li", {}, [it]))),
        ]),
        h("div", { class: "duo-col" }, [
          h("h4", {}, [b.bTitle]),
          h("ul", { class: "prose-list" }, b.b.map((it) => h("li", {}, [it]))),
        ]),
      ]);
    case "frame": {
      const pre = h("pre", {});
      for (const line of b.lines) {
        if (line.mark === "hl") pre.append(h("span", { class: "hl" }, [line.text]), "\n");
        else if (line.mark === "ok") pre.append(h("span", { class: "okv" }, [line.text]), "\n");
        else pre.append(line.text + "\n");
      }
      return h("figure", { class: "frame" }, [h("figcaption", {}, [b.caption]), pre]);
    }
    case "table": {
      const thead = h("thead", {}, [
        h("tr", {}, b.head.map((c) => h("th", {}, [c]))),
      ]);
      const tbody = h("tbody", {}, b.rows.map((r) => h("tr", {}, r.map((c, i) =>
        i === 0 ? h("th", { scope: "row" }, [c]) : h("td", {}, [c]),
      ))));
      const table = h("table", {}, [thead, tbody]);
      const wrap = h("div", { class: "tbl-wrap" }, [table]);
      if (b.caption) return h("figure", { class: "tbl" }, [h("figcaption", {}, [b.caption]), wrap]);
      return h("figure", { class: "tbl" }, [wrap]);
    }
    case "code": {
      const pre = h("pre", {}, [b.lines.join("\n")]);
      if (b.caption) return h("figure", { class: "code" }, [h("figcaption", {}, [b.caption]), pre]);
      return h("figure", { class: "code" }, [pre]);
    }
    case "deflist":
      return h("dl", { class: "deflist" }, b.items.flatMap((it) => [
        h("dt", {}, [it.term]),
        h("dd", {}, [it.def]),
      ]));
    case "links":
      return h("ul", { class: "links" }, b.items.map((it) =>
        h("li", {}, [
          h("a", { href: it.url, target: "_blank", rel: "noopener noreferrer" }, [it.label]),
          ...(it.note ? [h("span", { class: "link-note" }, [it.note])] : []),
        ]),
      ));
  }
}

export interface ReadingOpts {
  eyebrow: string;
  idPrefix: string;
  ctaHref?: string;
  ctaLabel?: string;
  extraClass?: string;
}

export function createReadingView(page: ReadingPage, opts: ReadingOpts): HTMLElement {
  const sections = page.sections.map((s) =>
    h("section", { class: "read-sec", id: `${opts.idPrefix}-${s.id}` }, [
      h("h2", {}, [s.heading]),
      ...s.blocks.map(renderBlock),
    ]),
  );

  const children: (HTMLElement)[] = [
    h("header", { class: "read-head" }, [
      h("p", { class: "eyebrow" }, [opts.eyebrow]),
      h("h1", {}, [page.title]),
      h("p", { class: "lede" }, [page.lede]),
    ]),
    ...sections,
  ];

  if (opts.ctaHref && opts.ctaLabel) {
    children.push(h("div", { class: "read-cta" }, [
      h("a", { class: "cta-btn", href: opts.ctaHref }, [opts.ctaLabel]),
    ]));
  }

  return h("article", { class: `reading${opts.extraClass ? " " + opts.extraClass : ""}` }, children);
}
