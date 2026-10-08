"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Certificate } from "@/data/resume";

/** Certificate previews with a click-to-enlarge lightbox, PDF download and verify link. */
export default function Certificates({ items }: { items: Certificate[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const cert = items[current];

  function open(i: number) {
    setCurrent(i);
    dialog.current?.showModal();
  }
  const step = (d: number) => setCurrent((c) => (c + d + items.length) % items.length);

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c, i) => (
          <li key={c.title} className="card group flex flex-col overflow-hidden p-2 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10">
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Enlarge ${c.title} certificate`}
              className="relative block aspect-[11/8.5] w-full overflow-hidden rounded-xl bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <Image
                src={c.image}
                alt={`${c.title} certificate issued by ${c.provider} through ${c.issuer}`}
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                className="object-contain transition duration-500 group-hover:scale-[1.02]"
              />
              <span
                aria-hidden="true"
                className="absolute right-2 bottom-2 rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-medium text-background opacity-0 transition group-hover:opacity-100"
              >
                Enlarge ↗
              </span>
            </button>

            <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{c.provider}</p>
              <h4 className="mt-1.5 font-medium leading-snug text-foreground">{c.title}</h4>
              <p className="mt-1 text-xs text-muted">
                {c.kind} · {c.issuer}
              </p>
              <p className="mt-0.5 text-xs text-muted">Issued {c.date}</p>

              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                <a
                  href={c.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-[#c026d3] px-3.5 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
                >
                  Verify <span aria-hidden="true">↗</span>
                  <span className="sr-only">{c.title} on Coursera (opens in new tab)</span>
                </a>
                <a
                  href={c.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:border-accent/40 hover:bg-soft"
                >
                  PDF<span className="sr-only"> of {c.title} certificate (opens in new tab)</span>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Certificate preview"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-[92vh] w-[min(1100px,94vw)] rounded-2xl bg-surface p-3 text-foreground shadow-2xl backdrop:bg-[#3d1a2e]/60 backdrop:backdrop-blur-sm"
      >
        {cert && (
          <figure>
            <div className="relative h-[76vh] w-full rounded-xl bg-white">
              <Image
                src={cert.image}
                alt={`${cert.title} certificate issued by ${cert.provider} through ${cert.issuer}`}
                fill
                sizes="94vw"
                className="object-contain"
              />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 text-sm">
              <span className="truncate text-muted">
                {current + 1} / {items.length} · {cert.title} · {cert.provider}
              </span>
              <span className="flex gap-2">
                {items.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous certificate" className="rounded-full border border-line px-3 py-1.5 hover:bg-soft">
                      ←
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label="Next certificate" className="rounded-full border border-line px-3 py-1.5 hover:bg-soft">
                      →
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
                  className="rounded-full bg-gradient-to-r from-accent to-[#c026d3] px-4 py-1.5 font-medium text-white"
                >
                  Close
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
