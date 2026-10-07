import type { ProjectVisual as Visual } from "@/data/resume";

// Lightweight, decorative SVG previews that hint at each project's output.
export default function ProjectVisual({ type }: { type: Visual }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-40 overflow-hidden rounded-lg border border-line bg-surface-2/70 p-4"
    >
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative h-full">{renderVisual(type)}</div>
    </div>
  );
}

function renderVisual(type: Visual) {
  switch (type) {
    case "finance":
      return <Finance />;
    case "netflix":
      return <Netflix />;
    case "sql":
      return <Sql />;
    case "platform":
      return <Platform />;
  }
}

function Finance() {
  const bars = [38, 52, 44, 66, 58, 74, 62, 86, 78, 92];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          ["Sales", "$118M"],
          ["Profit", "$16.9M"],
          ["Margin", "14.3%"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-md border border-line bg-soft px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-wider text-muted">{k}</div>
            <div className="font-mono text-xs text-foreground">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className="animate-bar flex-1 rounded-t-sm bg-gradient-to-t from-accent/30 to-accent"
            style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function Netflix() {
  const genres = [
    ["International", 92],
    ["Dramas", 78],
    ["Comedies", 61],
    ["Documentaries", 48],
    ["Action", 40],
  ] as const;
  return (
    <div className="flex h-full gap-4">
      <div className="flex w-1/3 flex-col justify-between">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-muted">Titles</div>
          <div className="font-mono text-lg text-foreground">8,807</div>
        </div>
        <svg viewBox="0 0 36 36" className="size-16">
          <circle cx="18" cy="18" r="14" fill="none" stroke="var(--soft-2)" strokeWidth="5" />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#f43f5e"
            strokeWidth="5"
            strokeDasharray="61.6 88"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <div className="text-[9px] text-muted">
          <span className="text-rose-500">●</span> Movies 70%
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2">
        {genres.map(([g, w], i) => (
          <div key={g}>
            <div className="mb-0.5 text-[9px] text-muted">{g}</div>
            <div className="h-2 rounded-full bg-soft-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-300"
                style={{ width: `${w}%`, opacity: 1 - i * 0.12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sql() {
  return (
    <div className="flex h-full flex-col justify-between font-mono text-[11px] leading-relaxed">
      <div>
        <span className="text-accent">WITH</span> monthly <span className="text-accent">AS</span> (
        <div className="pl-4">
          <span className="text-accent">SELECT</span> category,{" "}
          <span className="text-accent-2">SUM</span>(total_sale)
        </div>
        <div className="pl-4">
          <span className="text-accent">OVER</span> (<span className="text-accent">PARTITION BY</span> month)
        </div>
        )
      </div>
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line text-[10px]">
        {["category", "orders", "revenue", "Clothing", "702", "$311K", "Electronics", "684", "$313K"].map((c, i) => (
          <div key={i} className={`bg-surface px-2 py-1 ${i < 3 ? "text-muted" : "text-foreground"}`}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}

function Platform() {
  return (
    <div className="flex h-full gap-3">
      <div className="flex w-2/5 flex-col gap-2 rounded-lg border border-line bg-soft p-2.5">
        <div className="h-14 rounded-md bg-gradient-to-br from-violet-500/50 to-accent-2/40" />
        <div className="h-1.5 w-4/5 rounded bg-accent/25" />
        <div className="h-1.5 w-3/5 rounded bg-soft-2" />
        <div className="mt-auto flex items-center gap-1.5 text-[9px] text-amber-600">
          <span className="grid size-3.5 place-items-center rounded-full bg-amber-400 text-[7px] text-white">
            ¢
          </span>
          120 coins
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {[
          ["AI moderation", "Passed", "text-emerald-600"],
          ["LINE notify", "Sent", "text-green-600"],
          ["Stripe", "Paid", "text-accent"],
          ["Search", "Typesense", "text-accent-2"],
        ].map(([k, v, c]) => (
          <div key={k} className="flex items-center justify-between rounded-md border border-line bg-soft px-2.5 py-1.5 text-[10px]">
            <span className="text-muted">{k}</span>
            <span className={c}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
