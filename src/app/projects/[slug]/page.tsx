import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import FileExplorer, { type ExplorerFile } from "@/components/files/FileExplorer";
import Gallery from "@/components/files/Gallery";
import { CodeView, CsvView, NotebookView, PdfView } from "@/components/files/FileViews";
import { profile, projects } from "@/data/resume";
import ReportViewer, { type ReportPage } from "@/components/files/ReportViewer";
import { FILES_ROOT, formatBytes, getProjectAssets, toEmbedUrl, type ProjectFile } from "@/lib/projectFiles";
import { readPbixPages } from "@/lib/pbix";
import path from "node:path";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} · ${profile.name}`, description: project.description };
}

const DOWNLOAD_HINT: Partial<Record<ProjectFile["kind"], string>> = {
  powerbi: "Open with Power BI Desktop",
  tableau: "Open with Tableau Desktop / Public",
  excel: "Open with Excel",
  data: "Raw dataset",
  notebook: "Open with Jupyter",
};

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];

  const { files, notebooks, screenshots, charts } = await getProjectAssets(slug);
  const embeds = (project.embeds ?? [])
    .map((e) => ({ ...e, src: toEmbedUrl(e.url) }))
    .filter((e): e is typeof e & { src: string } => e.src !== null);

  // Files that can be rendered in the browser
  const viewable: ExplorerFile[] = [];
  for (const file of files) {
    let content: React.ReactNode = null;
    if (file.kind === "notebook") {
      const nb = notebooks.find((n) => n.file.name === file.name);
      content = nb?.notebook ? (
        <NotebookView slug={slug} index={nb.index} notebook={nb.notebook} />
      ) : (
        <p className="p-8 text-muted">This notebook could not be read.</p>
      );
    } else if (file.kind === "code") content = <CodeView slug={slug} file={file} />;
    else if (file.kind === "data") content = <CsvView slug={slug} file={file} />;
    else if (file.kind === "pdf") content = <PdfView file={file} />;
    if (content) viewable.push({ name: file.name, label: file.label, size: formatBytes(file.size), url: file.url, content });
  }

  // Power BI reports: list each report page and pair it with a matching screenshot by page name
  const norm = (s: string) => s.toLowerCase().replace(/\.[^.]+$/, "").replace(/^\d+[-_.\s]*/, "").replace(/[^a-z0-9]/g, "");
  const usedImages = new Set<string>();
  const reports = await Promise.all(
    files
      .filter((f) => f.kind === "powerbi")
      .map(async (file) => {
        const pages: ReportPage[] = (await readPbixPages(path.join(FILES_ROOT, slug, file.name))).map((p, i) => {
          const img = files.find((f) => f.kind === "image" && norm(f.name) === norm(p.name));
          if (img) usedImages.add(img.url);
          return {
            name: p.name,
            visuals: p.visuals,
            aspect: p.width / p.height,
            image: img?.url,
            suggestedFile: `${String(i + 1).padStart(2, "0")}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.png`,
          };
        });
        return { file, pages };
      }),
  ).then((r) => r.filter((x) => x.pages.length > 0));
  const otherScreenshots = screenshots.filter((s) => !usedImages.has(s.src));

  const downloads = files.filter((f) => f.kind !== "image");
  const hasVisuals = embeds.length > 0 || screenshots.length > 0 || reports.length > 0;
  const isDev = process.env.NODE_ENV === "development";
  let n = 0;
  const num = () => String(++n).padStart(2, "0");

  return (
    <>
      <Nav />
      <main id="main" className="relative flex-1 overflow-x-clip pt-28 pb-24 sm:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]">
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute -top-40 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full bg-accent/15 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent">
              <span aria-hidden="true">←</span> All projects
            </Link>
          </Reveal>

          {/* Header */}
          <Reveal delay={60} className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{project.category}</p>
              <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">{project.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{project.description}</p>
            </div>
            <ul className="card space-y-3 p-6 text-sm">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-2" />
                  <span className="text-foreground/85">{h}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies">
              {project.tech.map((t) => (
                <li key={t} className="rounded-full border border-line bg-soft px-3 py-1 text-xs text-muted">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          {isDev && !hasVisuals && <UploadHint slug={slug} />}

          {embeds.length > 0 && (
            <Section number={num()} title="Live dashboard" intro="Interactive: filter, hover and click just like the original.">
              <div className="space-y-6">
                {embeds.map((e) => (
                  <div key={e.src} className="card overflow-hidden p-2">
                    <iframe
                      src={e.src}
                      title={e.title}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="h-[70vh] min-h-[480px] w-full rounded-xl bg-white"
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {reports.map(({ file, pages }) => (
            <Section
              key={file.name}
              number={num()}
              title="Power BI dashboards"
              intro={`All ${pages.length} report pages from ${file.name}. Switch pages with the tabs.`}
            >
              <ReportViewer pages={pages} showHints={isDev} />
            </Section>
          ))}

          {otherScreenshots.length > 0 && (
            <Section number={num()} title="Dashboard" intro="Click any page to view it full size.">
              <Gallery images={otherScreenshots} />
            </Section>
          )}

          {charts.length > 0 && (
            <Section number={num()} title="Charts from the analysis" intro="Visual outputs generated in the Jupyter notebooks.">
              <Gallery images={charts} />
            </Section>
          )}

          {viewable.length > 0 && (
            <Section number={num()} title="Code & data" intro="Browse the actual notebooks, scripts and datasets behind this project.">
              <FileExplorer files={viewable} />
            </Section>
          )}

          {downloads.length > 0 && (
            <Section number={num()} title="Project files">
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {downloads.map((f) => (
                  <li key={f.name}>
                    <a
                      href={f.url}
                      download
                      className="card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-accent/40"
                    >
                      <FileBadge ext={f.ext} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{f.name}</span>
                        <span className="block text-xs text-muted">
                          {DOWNLOAD_HINT[f.kind] ?? f.label} · {formatBytes(f.size)}
                        </span>
                      </span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0 text-muted transition group-hover:text-accent">
                        <path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" />
                      </svg>
                      <span className="sr-only">Download</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {files.length === 0 && embeds.length === 0 && !isDev && (
            <p className="mt-16 text-muted">Project files for this work are available on request.</p>
          )}
        </div>
      </main>
    </>
  );
}

function Section({ number, title, intro, children }: { number: string; title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="mt-20">
      <Reveal className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{number}</p>
        <h2 className="mt-2 font-display text-4xl tracking-tight">{title}</h2>
        {intro && <p className="mt-2 text-muted">{intro}</p>}
      </Reveal>
      <Reveal>{children}</Reveal>
    </section>
  );
}

const BADGE: Record<string, string> = {
  pbix: "bg-amber-100 text-amber-700",
  twb: "bg-sky-100 text-sky-700",
  twbx: "bg-sky-100 text-sky-700",
  xlsx: "bg-emerald-100 text-emerald-700",
  csv: "bg-emerald-100 text-emerald-700",
  ipynb: "bg-orange-100 text-orange-700",
  sql: "bg-violet-100 text-violet-700",
  py: "bg-blue-100 text-blue-700",
};

function FileBadge({ ext }: { ext: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-11 shrink-0 place-items-center rounded-xl font-mono text-[10px] font-semibold uppercase ${BADGE[ext] ?? "bg-soft-2 text-accent"}`}
    >
      {ext.slice(0, 5) || "file"}
    </span>
  );
}

/** Only rendered during `npm run dev`, never in the published site. */
function UploadHint({ slug }: { slug: string }) {
  return (
    <div className="mt-12 rounded-2xl border-2 border-dashed border-accent/30 bg-soft/60 p-6 text-sm leading-relaxed text-foreground/85">
      <p className="font-medium text-accent">Dev tip (hidden on the live site): add your dashboard visuals</p>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        <li>
          Screenshots: drop PNG/JPG files into <code className="rounded bg-surface px-1.5 py-0.5 font-mono">public/project-files/{slug}/</code>{" "}
          (name them <code className="font-mono">01-overview.png</code>, <code className="font-mono">02-sales.png</code>… to set the order).
        </li>
        <li>
          Live interactive dashboard: publish to Tableau Public or Power BI &ldquo;Publish to web&rdquo;, then add the link to{" "}
          <code className="font-mono">embeds</code> for this project in <code className="font-mono">src/data/resume.ts</code>.
        </li>
      </ul>
    </div>
  );
}
