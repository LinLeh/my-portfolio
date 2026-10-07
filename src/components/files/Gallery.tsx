"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  /** Notebook chart images are served by a route handler and skip the optimizer */
  unoptimized?: boolean;
};

/** Grid of dashboard screenshots / charts with a click-to-enlarge lightbox. */
export default function Gallery({ images }: { images: GalleryImage[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const img = images[current];

  function open(i: number) {
    setCurrent(i);
    dialog.current?.showModal();
  }
  const step = (d: number) => setCurrent((c) => (c + d + images.length) % images.length);

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2">
        {images.map((im, i) => (
          <li key={im.src} className={i === 0 && images.length % 2 === 1 ? "sm:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group card block w-full overflow-hidden p-2 text-left transition hover:-translate-y-0.5 hover:border-accent/40"
            >
              <span className={`relative block aspect-video overflow-hidden rounded-xl ${im.unoptimized ? "bg-white" : "bg-soft"}`}>
                <Image
                  src={im.src}
                  alt={im.alt}
                  fill
                  unoptimized={im.unoptimized}
                  sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
                  className="object-contain transition duration-500 group-hover:scale-[1.02]"
                />
              </span>
              <span className="flex items-center justify-between px-2 pt-2.5 pb-1 text-xs text-muted">
                <span className="truncate">{im.caption}</span>
                <span aria-hidden="true" className="text-accent opacity-0 transition group-hover:opacity-100">
                  Enlarge ↗
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Image preview"
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-[92vh] w-[min(1200px,94vw)] rounded-2xl bg-surface p-3 text-foreground shadow-2xl backdrop:bg-[#3d1a2e]/60 backdrop:backdrop-blur-sm"
      >
        {img && (
          <figure>
            <div className="relative h-[78vh] w-full">
              <Image src={img.src} alt={img.alt} fill unoptimized={img.unoptimized} sizes="94vw" className="object-contain" />
            </div>
            <figcaption className="flex items-center justify-between gap-3 px-2 pt-3 text-sm">
              <span className="truncate text-muted">
                {current + 1} / {images.length} · {img.caption}
              </span>
              <span className="flex gap-2">
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="rounded-full border border-line px-3 py-1.5 hover:bg-soft">
                      ←
                    </button>
                    <button type="button" onClick={() => step(1)} aria-label="Next image" className="rounded-full border border-line px-3 py-1.5 hover:bg-soft">
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
