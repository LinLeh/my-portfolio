// Serves chart images embedded inside Jupyter notebook outputs as real image files,
// so pages don't have to inline large base64 blobs. Generated at build time.
import { projects } from "@/data/resume";
import { loadNotebooks, mimeFromExt, notebookImageUrl } from "@/lib/projectFiles";

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { slug: string; image: string }[] = [];
  for (const { slug } of projects) {
    for (const { index, notebook } of await loadNotebooks(slug)) {
      notebook?.images.forEach((img, i) => {
        params.push({ slug, image: notebookImageUrl(slug, index, i, img.mime).split("/").pop()! });
      });
    }
  }
  return params;
}

export async function GET(_req: Request, ctx: RouteContext<"/notebook-images/[slug]/[image]">) {
  const { slug, image } = await ctx.params;
  const match = /^(\d+)-(\d+)\.(png|jpg|svg)$/.exec(image);
  if (!match || !projects.some((p) => p.slug === slug)) return new Response("Not found", { status: 404 });

  const [, nbIndex, imgIndex, ext] = match;
  const notebooks = await loadNotebooks(slug);
  const img = notebooks[Number(nbIndex)]?.notebook?.images[Number(imgIndex)];
  if (!img || img.mime !== mimeFromExt(ext)) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(Buffer.from(img.base64, "base64")), {
    headers: {
      "Content-Type": img.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
