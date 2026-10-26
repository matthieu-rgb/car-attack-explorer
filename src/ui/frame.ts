import { h } from "./dom";
import { t, getLang } from "../i18n";
import { getRecipes, getExamples, type FrameSnapshot } from "../data/frames";

const MAX_STD_ID = 0x7ff;

function clampHex(v: string, maxLen: number): string {
  return v.toUpperCase().replace(/[^0-9A-F]/g, "").slice(0, maxLen);
}

function byteBin(n: number): string {
  return (n & 0xff).toString(2).padStart(8, "0");
}

function priorityKey(id: number): string {
  if (id <= 0x0ff) return "decoder.prio.vhigh";
  if (id <= 0x2ff) return "decoder.prio.high";
  if (id <= 0x4ff) return "decoder.prio.med";
  return "decoder.prio.low";
}

function snapshotLine(snap: FrameSnapshot, changed: number[]): HTMLElement {
  const idChanged = changed.includes(-1);
  const parts: (Node | string)[] = [
    idChanged ? h("span", { class: "chg" }, [snap.canId]) : snap.canId,
    "  ",
  ];
  snap.bytes.forEach((b, i) => {
    parts.push(changed.includes(i) ? h("span", { class: "chg" }, [b]) : b);
    if (i < snap.bytes.length - 1) parts.push(" ");
  });
  return h("code", { class: "snap" }, parts);
}

export function createFrameView(): HTMLElement {
  const recipes = getRecipes(getLang());
  const examples = getExamples(getLang());

  // ---- editor state via live inputs ----
  const idInput = h("input", {
    class: "hx id",
    type: "text",
    inputmode: "latin",
    spellcheck: false,
    "aria-label": t("decoder.idLabel"),
    value: "0C4",
    maxlength: 3,
  }) as HTMLInputElement;

  const byteInputs: HTMLInputElement[] = [];
  for (let i = 0; i < 8; i++) {
    const inp = h("input", {
      class: "hx",
      type: "text",
      inputmode: "latin",
      spellcheck: false,
      "aria-label": `${t("decoder.byte")} ${i}`,
      value: i === 0 ? "3F" : "00",
      maxlength: 2,
    }) as HTMLInputElement;
    byteInputs.push(inp);
  }

  const out = h("div", { class: "decoded" });

  function refresh(): void {
    const idHex = idInput.value.trim();
    const idNum = idHex === "" ? 0 : parseInt(idHex, 16);
    const valid = !Number.isNaN(idNum) && idNum <= MAX_STD_ID;

    // DLC = position of the last non-empty byte (+1); empties count as present if
    // a later byte is filled, which mirrors a fixed-length frame.
    let dlc = 0;
    byteInputs.forEach((b, i) => {
      if (b.value.trim() !== "") dlc = i + 1;
    });

    const idLine = h("div", { class: "dec-row" }, [
      h("span", { class: "dec-k" }, [t("decoder.id")]),
      h("span", { class: "dec-v" }, [
        valid ? `0x${idNum.toString(16).toUpperCase()}` : idInput.value,
        h("span", { class: "dec-sub" }, [
          valid
            ? `${idNum} · ${idNum.toString(2).padStart(11, "0")}`
            : t("decoder.invalidId"),
        ]),
      ]),
    ]);

    const prioLine = h("div", { class: "dec-row" }, [
      h("span", { class: "dec-k" }, [t("decoder.priority")]),
      h("span", { class: "dec-v" }, [
        valid ? t(priorityKey(idNum)) : "—",
        h("span", { class: "dec-sub" }, [t("decoder.prioNote")]),
      ]),
    ]);

    const dlcLine = h("div", { class: "dec-row" }, [
      h("span", { class: "dec-k" }, [t("decoder.dlc")]),
      h("span", { class: "dec-v" }, [`${dlc} ${t("decoder.bytesUnit")}`]),
    ]);

    const byteRows = byteInputs.map((b, i) => {
      const n = b.value.trim() === "" ? 0 : parseInt(b.value, 16);
      const nv = Number.isNaN(n) ? 0 : n;
      return h("tr", { class: i < dlc ? "" : "muted" }, [
        h("td", { class: "bi" }, [`${i}`]),
        h("td", { class: "bh" }, [`0x${nv.toString(16).toUpperCase().padStart(2, "0")}`]),
        h("td", { class: "bb" }, [byteBin(nv)]),
        h("td", { class: "bd" }, [`${nv}`]),
      ]);
    });

    const byteTable = h("table", { class: "bytes" }, [
      h("thead", {}, [
        h("tr", {}, [
          h("th", {}, [t("decoder.byte")]),
          h("th", {}, [t("decoder.hex")]),
          h("th", {}, [t("decoder.bin")]),
          h("th", {}, [t("decoder.dec")]),
        ]),
      ]),
      h("tbody", {}, byteRows),
    ]);

    out.replaceChildren(idLine, prioLine, dlcLine, h("div", { class: "tbl-wrap" }, [byteTable]));
  }

  idInput.addEventListener("input", () => {
    const p = idInput.selectionStart;
    idInput.value = clampHex(idInput.value, 3);
    if (p !== null) idInput.setSelectionRange(p, p);
    refresh();
  });
  byteInputs.forEach((b) =>
    b.addEventListener("input", () => {
      const p = b.selectionStart;
      b.value = clampHex(b.value, 2);
      if (p !== null) b.setSelectionRange(p, p);
      refresh();
    }),
  );

  // ---- recipes ----
  const recipeNote = h("p", { class: "recipe-note" }, [recipes[0]?.note ?? ""]);
  const recipeRow = h(
    "div",
    { class: "recipe-row" },
    recipes.map((r) =>
      h(
        "button",
        {
          class: "recipe-btn",
          type: "button",
          onclick: () => {
            idInput.value = r.canId;
            r.bytes.forEach((bv, i) => {
              if (byteInputs[i]) byteInputs[i].value = bv;
            });
            recipeNote.textContent = r.note;
            refresh();
          },
        },
        [r.name],
      ),
    ),
  );

  // ---- editor block ----
  const editor = h("div", { class: "fr-editor" }, [
    h("div", { class: "fr-inputs" }, [
      h("label", { class: "fr-field id-field" }, [
        h("span", {}, [t("decoder.idLabel")]),
        idInput,
      ]),
      h("div", { class: "fr-field bytes-field" }, [
        h("span", {}, [t("decoder.dataLabel")]),
        h("div", { class: "byte-grid" }, byteInputs),
      ]),
    ]),
    h("div", { class: "fr-out" }, [
      h("h3", {}, [t("decoder.decoded")]),
      out,
    ]),
  ]);

  // ---- examples ----
  const exampleCards = examples.map((e) =>
    h("article", { class: "ex-card" }, [
      h("h4", {}, [e.title]),
      h("p", { class: "ex-ctx" }, [e.context]),
      h("div", { class: "ex-pair" }, [
        h("div", { class: "ex-snap legit" }, [
          h("span", { class: "ex-lab" }, [t("decoder.legit")]),
          snapshotLine(e.legit, []),
        ]),
        h("div", { class: "ex-snap forged" }, [
          h("span", { class: "ex-lab" }, [t("decoder.forged")]),
          snapshotLine(e.forged, e.changed),
        ]),
      ]),
      h("p", { class: "ex-effect" }, [
        h("span", { class: "ex-effect-k" }, [t("decoder.effect")]),
        " ",
        e.effect,
      ]),
    ]),
  );

  refresh();

  return h("article", { class: "reading decoder-page" }, [
    h("header", { class: "read-head" }, [
      h("p", { class: "eyebrow" }, [t("nav.decoder")]),
      h("h1", {}, [t("decoder.title")]),
      h("p", { class: "lede" }, [t("decoder.lede")]),
    ]),
    editor,
    h("section", { class: "read-sec" }, [
      h("h2", {}, [t("decoder.recipes")]),
      h("p", { class: "tool-group-intro" }, [t("decoder.recipesHint")]),
      recipeRow,
      recipeNote,
    ]),
    h("section", { class: "read-sec" }, [
      h("h2", {}, [t("decoder.examples")]),
      h("p", { class: "tool-group-intro" }, [t("decoder.examplesHint")]),
      h("div", { class: "ex-grid" }, exampleCards),
    ]),
    h("p", { class: "tool-note" }, [t("decoder.foot")]),
  ]);
}
