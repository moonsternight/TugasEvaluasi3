import { XMLParser } from "fast-xml-parser";

export const dynamic = "force-dynamic";

const sources = [
  { name: "ANTARA", url: "https://www.antaranews.com/rss/terkini.xml" },
  { name: "DETIK", url: "https://news.detik.com/berita/rss" },
  { name: "JPNN", url: "https://www.jpnn.com/index.php?mib=rss" },
];

function extractImageUrl(description: string): string | undefined {
  const match = description?.match(/<img[^>]+src="([^">]+)"/);
  return match?.[1];
}

export async function GET() {
  const parser = new XMLParser({ ignoreAttributes: false });
  const allItems: any[] = [];

  for (const source of sources) {
    try {
      const res = await fetch(source.url);
      if (!res.ok) throw new Error(`Status code ${res.status}`);
      const xmlText = await res.text();
      const json = parser.parse(xmlText);

      const channel = json?.rss?.channel ?? json?.channel;
      const rawItems = channel?.item;

      const items = Array.isArray(rawItems)
        ? rawItems
        : rawItems
        ? [rawItems]
        : [];

      const news = items
        .filter((item) => item?.title && item?.link)
        .map((item) => ({
          title: item.title,
          link: item.link,
          pubDate: new Date(
            item.pubDate || item.pubdate || ""
          ).toLocaleDateString("id-ID"),
          source: source.name,
          imageUrl:
            item.enclosure?.["@_url"] ||
            item["media:content"]?.["@_url"] ||
            extractImageUrl(item.description || ""),
        }));

      allItems.push(...news);
    } catch (err: any) {
      console.error(`❌ Gagal ambil dari ${source.name}:`, err.message);
    }
  }

  return Response.json(allItems);
}
