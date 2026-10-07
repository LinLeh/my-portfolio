"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type ExplorerFile = {
  name: string;
  label: string;
  size: string;
  url: string;
  content: ReactNode;
};

/** Tabbed viewer for code, notebooks and datasets. Content is pre-rendered on the server. */
export default function FileExplorer({ files }: { files: ExplorerFile[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const file = files[active];

  function onKeyDown(e: KeyboardEvent) {
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (active + 1) % files.length
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (active - 1 + files.length) % files.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? files.length - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="card overflow-hidden lg:grid lg:grid-cols-[260px_1fr]">
      <div
        role="tablist"
        aria-label="Project files"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto border-b border-line bg-soft/50 p-2 lg:flex-col lg:border-r lg:border-b-0"
      >
        {files.map((f, i) => (
          <button
            key={f.name}
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
            className={`shrink-0 rounded-lg px-3 py-2.5 text-left transition lg:w-full ${
              i === active ? "bg-surface shadow-sm ring-1 ring-accent/25" : "hover:bg-surface/70"
            }`}
          >
            <span className={`block max-w-[220px] truncate text-sm ${i === active ? "font-medium text-foreground" : "text-foreground/80"}`}>
              {f.name}
            </span>
            <span className="block text-xs text-muted">
              {f.label} · {f.size}
            </span>
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        className="min-w-0 focus:outline-none"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
          <div className="min-w-0">
            <div className="truncate font-mono text-sm text-foreground">{file.name}</div>
            <div className="text-xs text-muted">{file.label}</div>
          </div>
          <div className="flex gap-2">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-line px-3 py-1.5 text-xs transition hover:border-accent/40 hover:bg-soft"
            >
              Open raw
            </a>
            <a
              href={file.url}
              download
              className="rounded-full bg-gradient-to-r from-accent to-[#c026d3] px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
            >
              Download
            </a>
          </div>
        </div>
        <div className="max-h-[760px] overflow-auto">{file.content}</div>
      </div>
    </div>
  );
}
