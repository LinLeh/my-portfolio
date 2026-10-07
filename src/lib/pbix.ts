// Reads report page metadata from a Power BI .pbix file (a zip archive) without extra dependencies.
// Power BI stores page definitions in "Report/Layout" as UTF-16LE JSON. The visuals themselves can only
// be rendered by Power BI, so the portfolio pairs each page with an exported screenshot.
import fs from "node:fs/promises";
import { inflateRawSync } from "node:zlib";

export type PbixPage = { ordinal: number; id: string; name: string; visuals: number; width: number; height: number };

function readZipEntry(buf: Buffer, entryName: string): Buffer | null {
  // Locate the End Of Central Directory record (scan backwards, it's within the last 64KB)
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd === -1) return null;

  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let n = 0; n < count && buf.readUInt32LE(p) === 0x02014b50; n++) {
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);

    if (name === entryName) {
      const dataStart = localOffset + 30 + buf.readUInt16LE(localOffset + 26) + buf.readUInt16LE(localOffset + 28);
      const data = buf.subarray(dataStart, dataStart + compSize);
      if (method === 0) return Buffer.from(data);
      if (method === 8) return inflateRawSync(data);
      return null;
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  return null;
}

export async function readPbixPages(filePath: string): Promise<PbixPage[]> {
  try {
    const layout = readZipEntry(await fs.readFile(filePath), "Report/Layout");
    if (!layout) return [];
    const json = JSON.parse(layout.toString("utf16le").replace(/^\uFEFF/, "")) as {
      sections?: { ordinal?: number; name?: string; displayName?: string; width?: number; height?: number; visualContainers?: unknown[] }[];
    };
    return (json.sections ?? [])
      .map((s, i) => ({
        ordinal: s.ordinal ?? i,
        id: s.name ?? "",
        name: s.displayName ?? `Page ${i + 1}`,
        visuals: s.visualContainers?.length ?? 0,
        width: s.width ?? 1280,
        height: s.height ?? 720,
      }))
      .sort((a, b) => a.ordinal - b.ordinal);
  } catch {
    return [];
  }
}
