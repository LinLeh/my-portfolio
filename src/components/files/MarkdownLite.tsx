import type { ReactNode } from "react";

// Small, safe Markdown renderer for notebook text cells. It outputs React elements only
// (no innerHTML), covering headings, lists, paragraphs, fenced code, bold, italic, code and links.

export default function MarkdownLite({ source }: { source: string }) {
  // Drop inline HTML tags (e.g. <br>, <b>) that notebooks often contain
  const lines = source.replace(/<\/?[a-z][^>]*>/gi, "").split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) code.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={i} className="overflow-x-auto rounded-lg bg-soft p-3 font-mono text-sm">
          {code.join("\n")}
        </pre>,
      );
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const cls =
        level === 1
          ? "font-display text-3xl tracking-tight text-foreground"
          : level === 2
            ? "font-display text-2xl tracking-tight text-foreground"
            : "text-lg font-semibold text-foreground";
      const Tag = (`h${Math.min(level + 2, 6)}`) as "h3" | "h4" | "h5" | "h6";
      blocks.push(
        <Tag key={i} className={cls}>
          {inline(heading[2])}
        </Tag>,
      );
      i++;
      continue;
    }

    const isBullet = (l: string) => /^\s*[-*+]\s+/.test(l);
    const isOrdered = (l: string) => /^\s*\d+[.)]\s+/.test(l);
    if (isBullet(line) || isOrdered(line)) {
      const ordered = isOrdered(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? isOrdered(lines[i]) : isBullet(lines[i]))) {
        items.push(lines[i].replace(ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*+]\s+/, ""));
        i++;
      }
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={i} className={`space-y-1 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-accent`}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </List>,
      );
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !isBullet(lines[i]) &&
      !isOrdered(lines[i]) &&
      !lines[i].trim().startsWith("```")
    ) {
      para.push(lines[i++].trim());
    }
    blocks.push(<p key={i}>{inline(para.join(" "))}</p>);
  }

  return <div className="space-y-3 leading-relaxed text-foreground/85">{blocks}</div>;
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = m.index;
    if (t.startsWith("**") || t.startsWith("__")) out.push(<strong key={k} className="font-semibold text-foreground">{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={k} className="rounded bg-soft-2 px-1.5 py-0.5 font-mono text-[0.9em]">{t.slice(1, -1)}</code>);
    else if (t.startsWith("[")) {
      const [, label, href] = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(t)!;
      out.push(
        /^https?:\/\//.test(href) ? (
          <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
            {label}
          </a>
        ) : (
          label
        ),
      );
    } else out.push(<em key={k}>{t.slice(1, -1)}</em>);
    last = k + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
