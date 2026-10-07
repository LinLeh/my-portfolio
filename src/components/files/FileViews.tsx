// Server components that render each kind of uploaded file.
import {
  formatBytes,
  highlight,
  MAX_INLINE_BYTES,
  notebookImageUrl,
  parseCsv,
  readText,
  type ParsedNotebook,
  type ProjectFile,
} from "@/lib/projectFiles";
import MarkdownLite from "./MarkdownLite";

const codeBox =
  "[&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:text-[13px] [&_pre]:leading-relaxed [&_pre]:overflow-x-auto [&_code]:font-mono";

export async function CodeView({ slug, file }: { slug: string; file: ProjectFile }) {
  if (file.size > MAX_INLINE_BYTES) return <TooLarge file={file} />;
  const code = await readText(slug, file.name);
  const html = await highlight(code, file.lang);
  // Plain-text notes wrap like prose; code keeps horizontal scrolling
  const wrap = file.lang === "text" ? "[&_pre]:whitespace-pre-wrap" : "";
  // Shiki escapes all code content, so this HTML is safe to inject
  return <div className={`${codeBox} ${wrap}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export async function NotebookView({
  slug,
  index,
  notebook,
}: {
  slug: string;
  index: number;
  notebook: ParsedNotebook;
}) {
  const rendered = await Promise.all(
    notebook.cells.map(async (cell) =>
      cell.type === "code" ? { ...cell, html: await highlight(cell.source, notebook.language) } : cell,
    ),
  );

  return (
    <div className="space-y-5 p-5">
      {rendered.map((cell, i) =>
        cell.type === "markdown" ? (
          <div key={i} className="px-1">
            <MarkdownLite source={cell.source} />
          </div>
        ) : (
          <div key={i} className="overflow-hidden rounded-xl border border-line">
            {cell.source.trim() && (
              <div className="flex bg-soft/60">
                <span className="w-14 shrink-0 select-none pt-5 pr-2 text-right font-mono text-[11px] text-muted">
                  [{cell.count ?? " "}]
                </span>
                <div
                  className={`min-w-0 flex-1 ${codeBox} [&_pre]:pl-0`}
                  dangerouslySetInnerHTML={{ __html: "html" in cell ? cell.html : "" }}
                />
              </div>
            )}
            {cell.outputs.length > 0 && (
              <div className="space-y-3 border-t border-line bg-surface p-4 sm:pl-14">
                {cell.outputs.map((out, j) =>
                  out.type === "image" ? (
                    // Notebook charts have unknown dimensions and are already sized PNGs
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={j}
                      src={notebookImageUrl(slug, index, out.index, out.mime)}
                      alt={`Chart output from cell ${cell.count ?? i + 1}`}
                      loading="lazy"
                      className="max-w-full rounded-lg"
                    />
                  ) : (
                    <pre
                      key={j}
                      className={`max-h-80 overflow-auto font-mono text-xs leading-relaxed ${out.error ? "text-rose-700" : "text-foreground/80"}`}
                    >
                      {out.text}
                    </pre>
                  ),
                )}
              </div>
            )}
          </div>
        ),
      )}
    </div>
  );
}

export async function CsvView({ slug, file }: { slug: string; file: ProjectFile }) {
  if (file.size > 25_000_000) return <TooLarge file={file} />;
  const { rows, total } = parseCsv(await readText(slug, file.name), 26);
  const [header = [], ...body] = rows;

  return (
    <div>
      <p className="border-b border-line px-5 py-3 text-sm text-muted">
        Showing first {body.length} of {(total - 1).toLocaleString()} rows · {header.length} columns
      </p>
      <div className="overflow-auto">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-soft">
            <tr>
              {header.map((h, i) => (
                <th key={i} scope="col" className="whitespace-nowrap px-3 py-2 font-semibold text-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((r, i) => (
              <tr key={i} className="border-t border-line even:bg-soft/40">
                {header.map((_, j) => (
                  <td key={j} className="max-w-[260px] truncate whitespace-nowrap px-3 py-2 text-foreground/80" title={r[j]}>
                    {r[j]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PdfView({ file }: { file: ProjectFile }) {
  return <iframe src={file.url} title={file.name} className="h-[720px] w-full bg-white" />;
}

function TooLarge({ file }: { file: ProjectFile }) {
  return (
    <div className="p-10 text-center text-muted">
      This file is {formatBytes(file.size)}, too large to preview.{" "}
      <a href={file.url} download className="text-accent underline underline-offset-2">
        Download it
      </a>{" "}
      instead.
    </div>
  );
}
