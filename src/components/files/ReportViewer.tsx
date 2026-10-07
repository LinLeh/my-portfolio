"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";

export type ReportPage = {
  name: string;
  visuals: number;
  /** Aspect ratio of the Power BI canvas, e.g. 1280 / 720 */
  aspect: number;
  image?: string;
  /** Filename to save a screenshot as (only shown during development) */
  suggestedFile?: string;
};

/** Tabbed viewer for the pages of a Power BI report. */
export default function ReportViewer({
  pages,
  showHints,
}: {
  pages: ReportPage[];
  showHints: boolean;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const page = pages[active];

  function onKeyDown(e: KeyboardEvent) {
    const next =
      e.key === "ArrowRight" ? (active + 1) % pages.length
      : e.key === "ArrowLeft" ? (active - 1 + pages.length) % pages.length
      : e.key === "Home" ? 0
      : e.key === "End" ? pages.length - 1
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="card overflow-hidden">
      <div
        role="tablist"
        aria-label="Report pages"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto border-b border-line bg-soft/50 px-2 py-2"
      >
        {pages.map((p, i) => (
          <button
            key={p.name}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm transition ${
              i === active ? "bg-surface font-medium text-accent shadow-sm ring-1 ring-accent/25" : "text-foreground/75 hover:bg-surface/70"
            }`}
          >
            <span className="mr-2 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
            {p.name}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        className="bg-gradient-to-br from-soft via-surface to-soft-2/60 p-4 sm:p-8"
      >
        {/* Frame matches the dashboard's 16:9 canvas so the image fills it edge to edge */}
        <div
          className="relative w-full overflow-hidden rounded-2xl bg-white shadow-xl shadow-accent/10 ring-1 ring-black/5"
          style={{ aspectRatio: page.aspect }}
        >
          {page.image ? (
            <Image
              key={page.image}
              src={page.image}
              alt={`Power BI dashboard page: ${page.name}`}
              fill
              quality={90}
              sizes="(min-width: 1152px) 1100px, 94vw"
              className="object-cover object-center"
              priority={active === 0}
            />
          ) : (
            <Placeholder page={page} showHints={showHints} />
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <span>
            Page {active + 1} of {pages.length} · <span className="text-foreground">{page.name}</span> · {page.visuals} visuals
          </span>
          {page.image && (
            <a href={page.image} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-2 hover:underline">
              View full size ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Placeholder({ page, showHints }: { page: ReportPage; showHints: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-soft/40 p-6 text-center">
      {/* Skeleton hinting at a dashboard layout */}
      <div aria-hidden="true" className="grid w-full max-w-md grid-cols-4 gap-2 opacity-60">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-8 rounded-md bg-soft-2" />
        ))}
        <div className="col-span-3 h-20 rounded-md bg-soft-2" />
        <div className="h-20 rounded-md bg-soft-2" />
      </div>
      <div>
        <p className="font-display text-2xl tracking-tight text-foreground">{page.name}</p>
        <p className="mt-1 text-sm text-muted">{page.visuals} visuals · open the .pbix in Power BI Desktop to explore</p>
      </div>
      {showHints && page.suggestedFile && (
        <p className="max-w-md rounded-lg border-2 border-dashed border-accent/30 bg-surface px-4 py-2 text-xs text-foreground/80">
          Dev tip: save a screenshot of this page as{" "}
          <code className="font-mono text-accent">{page.suggestedFile}</code> in this project&apos;s folder.
        </p>
      )}
    </div>
  );
}
