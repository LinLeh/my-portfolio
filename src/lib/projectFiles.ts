// Server-only helpers that read uploaded project files from public/project-files/<slug>/.
// Everything here runs at build time (pages are statically generated).
import fs from "node:fs/promises";
import path from "node:path";
import { codeToHtml } from "shiki";

export const FILES_ROOT = path.join(process.cwd(), "public", "project-files");

export type FileKind = "image" | "notebook" | "code" | "data" | "pdf" | "powerbi" | "tableau" | "excel" | "other";

export type ProjectFile = {
  name: string;
  ext: string;
  url: string;
  size: number;
  kind: FileKind;
  label: string;
  /** Shiki language id for code files */
  lang?: string;
};

const TYPES: Record<string, { kind: FileKind; label: string; lang?: string }> = {
  png: { kind: "image", label: "Image" },
  jpg: { kind: "image", label: "Image" },
  jpeg: { kind: "image", label: "Image" },
  webp: { kind: "image", label: "Image" },
  gif: { kind: "image", label: "Image" },
  ipynb: { kind: "notebook", label: "Jupyter notebook" },
  sql: { kind: "code", label: "SQL script", lang: "sql" },
  py: { kind: "code", label: "Python script", lang: "python" },
  r: { kind: "code", label: "R script", lang: "r" },
  dax: { kind: "code", label: "DAX measures", lang: "text" },
  m: { kind: "code", label: "Power Query (M)", lang: "powerquery" },
  pq: { kind: "code", label: "Power Query (M)", lang: "powerquery" },
  json: { kind: "code", label: "JSON", lang: "json" },
  md: { kind: "code", label: "Markdown", lang: "markdown" },
  txt: { kind: "code", label: "Text file", lang: "text" },
  csv: { kind: "data", label: "CSV dataset" },
  pdf: { kind: "pdf", label: "PDF" },
  pbix: { kind: "powerbi", label: "Power BI report" },
  pbit: { kind: "powerbi", label: "Power BI template" },
  twb: { kind: "tableau", label: "Tableau workbook" },
  twbx: { kind: "tableau", label: "Tableau packaged workbook" },
  xlsx: { kind: "excel", label: "Excel workbook" },
  xls: { kind: "excel", label: "Excel workbook" },
};

/** Files bigger than this are offered as downloads only (not rendered inline). */
export const MAX_INLINE_BYTES = 2_000_000;

export async function listProjectFiles(slug: string): Promise<ProjectFile[]> {
  const dir = path.join(FILES_ROOT, slug);
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = await Promise.all(
    entries
      // Skip hidden files and Office/Tableau lock files (~$file, ~file__123.twbr)
      .filter((e) => e.isFile() && !/^[.~]/.test(e.name))
      .map(async (e): Promise<ProjectFile> => {
        const ext = path.extname(e.name).slice(1).toLowerCase();
        const type = TYPES[ext] ?? { kind: "other" as const, label: ext.toUpperCase() || "File" };
        const { size } = await fs.stat(path.join(dir, e.name));
        return {
          name: e.name,
          ext,
          url: `/project-files/${slug}/${encodeURIComponent(e.name)}`,
          size,
          ...type,
        };
      }),
  );
  // Natural sort so "01-overview.png" < "02-sales.png" < "10-detail.png"
  return files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export function readText(slug: string, name: string) {
  return fs.readFile(path.join(FILES_ROOT, slug, name), "utf8");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

/* ---------- Syntax highlighting ---------- */

const THEME = "rose-pine-dawn";

export async function highlight(code: string, lang = "text") {
  try {
    return await codeToHtml(code, { lang, theme: THEME });
  } catch {
    return codeToHtml(code, { lang: "text", theme: THEME });
  }
}

/* ---------- Jupyter notebooks ---------- */

type RawOutput = {
  output_type: string;
  text?: string | string[];
  data?: Record<string, string | string[]>;
  traceback?: string[];
};
type RawCell = {
  cell_type: "markdown" | "code" | "raw";
  source: string | string[];
  execution_count?: number | null;
  outputs?: RawOutput[];
};

export type NotebookOutput =
  | { type: "text"; text: string; error?: boolean }
  | { type: "image"; index: number; mime: string };

export type NotebookCell =
  | { type: "markdown"; source: string }
  | { type: "code"; source: string; count: number | null; outputs: NotebookOutput[] };

export type ParsedNotebook = {
  language: string;
  cells: NotebookCell[];
  images: { mime: string; base64: string }[];
};

const IMAGE_MIMES = ["image/png", "image/jpeg", "image/svg+xml"];
const joinSrc = (s: string | string[] | undefined) => (Array.isArray(s) ? s.join("") : (s ?? ""));
const stripAnsi = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, "");

export function parseNotebook(json: string): ParsedNotebook {
  const nb = JSON.parse(json) as {
    cells?: RawCell[];
    metadata?: { kernelspec?: { language?: string }; language_info?: { name?: string } };
  };
  const images: ParsedNotebook["images"] = [];
  const cells: NotebookCell[] = [];

  for (const cell of nb.cells ?? []) {
    const source = joinSrc(cell.source);
    if (cell.cell_type === "markdown") {
      if (source.trim()) cells.push({ type: "markdown", source });
      continue;
    }
    if (cell.cell_type !== "code") continue;

    const outputs: NotebookOutput[] = [];
    for (const out of cell.outputs ?? []) {
      if (out.output_type === "stream") {
        outputs.push({ type: "text", text: joinSrc(out.text) });
      } else if (out.output_type === "error") {
        outputs.push({ type: "text", text: stripAnsi((out.traceback ?? []).join("\n")), error: true });
      } else if (out.data) {
        const mime = IMAGE_MIMES.find((m) => out.data![m]);
        if (mime) {
          // SVG is stored as text; PNG/JPEG as base64
          const raw = joinSrc(out.data[mime]);
          const base64 = mime === "image/svg+xml" ? Buffer.from(raw).toString("base64") : raw.replace(/\s/g, "");
          images.push({ mime, base64 });
          outputs.push({ type: "image", index: images.length - 1, mime });
        } else if (out.data["text/plain"]) {
          // Prefer plain text over raw HTML (e.g. pandas tables) so nothing is injected into the page
          outputs.push({ type: "text", text: joinSrc(out.data["text/plain"]) });
        }
      }
    }
    if (source.trim() || outputs.length) {
      cells.push({ type: "code", source, count: cell.execution_count ?? null, outputs });
    }
  }

  const language = nb.metadata?.kernelspec?.language ?? nb.metadata?.language_info?.name ?? "python";
  return { language, cells, images };
}

const MIME_EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/svg+xml": "svg" };
export const mimeFromExt = (ext: string) =>
  Object.entries(MIME_EXT).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";

/** URL of an image embedded in a notebook output, served by app/notebook-images. */
export function notebookImageUrl(slug: string, notebookIndex: number, imageIndex: number, mime: string) {
  return `/notebook-images/${slug}/${notebookIndex}-${imageIndex}.${MIME_EXT[mime] ?? "png"}`;
}

export async function loadNotebooks(slug: string, files?: ProjectFile[]) {
  const list = (files ?? (await listProjectFiles(slug))).filter((f) => f.kind === "notebook");
  return Promise.all(
    list.map(async (file, index) => {
      try {
        return { file, index, notebook: parseNotebook(await readText(slug, file.name)) };
      } catch {
        return { file, index, notebook: null };
      }
    }),
  );
}

/* ---------- CSV ---------- */

/** Minimal RFC 4180 parser (handles quoted fields, escaped quotes and embedded newlines). */
export function parseCsv(text: string, maxRows = Infinity) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let total = 0;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((v) => v !== "")) {
        total++;
        if (rows.length < maxRows) rows.push(row);
      }
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((v) => v !== "")) {
    total++;
    if (rows.length < maxRows) rows.push(row);
  }
  return { rows, total };
}

/* ---------- Per-project bundle ---------- */

/** Everything the project page and home card need, derived from the uploaded files. */
export async function getProjectAssets(slug: string) {
  const files = await listProjectFiles(slug);
  const notebooks = await loadNotebooks(slug, files);

  const screenshots = files
    .filter((f) => f.kind === "image")
    .map((f) => ({ src: f.url, alt: `Dashboard screenshot: ${prettyName(f.name)}`, caption: prettyName(f.name) }));

  const charts = notebooks.flatMap(({ file, index, notebook }) =>
    (notebook?.images ?? []).map((img, i) => ({
      src: notebookImageUrl(slug, index, i, img.mime),
      alt: `Chart ${i + 1} from ${file.name}`,
      caption: `${prettyName(file.name)} · chart ${i + 1}`,
      unoptimized: true,
    })),
  );

  // Count files by label for a short summary like "2 Jupyter notebooks · 1 Tableau workbook"
  const counts = new Map<string, number>();
  for (const f of files) if (f.kind !== "image") counts.set(f.label, (counts.get(f.label) ?? 0) + 1);
  const summary = [...counts].map(([label, n]) => `${n} ${label}${n > 1 ? "s" : ""}`);

  return {
    files,
    notebooks,
    screenshots,
    charts,
    cover: screenshots[0] ?? charts[0] ?? null,
    summary,
  };
}

/** "01-sales_overview.png" → "Sales overview" */
export function prettyName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/^\d+[-_.\s]+/, "").replace(/[-_]+/g, " ").trim();
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** Only allow embeds from known dashboard hosts, and add Tableau's embed flags. */
const EMBED_HOSTS = ["public.tableau.com", "app.powerbi.com", "lookerstudio.google.com", "datastudio.google.com"];
export function toEmbedUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || !EMBED_HOSTS.includes(url.hostname)) return null;
    if (url.hostname === "public.tableau.com") {
      url.searchParams.set(":embed", "y");
      url.searchParams.set(":showVizHome", "no");
    }
    return url.toString();
  } catch {
    return null;
  }
}
