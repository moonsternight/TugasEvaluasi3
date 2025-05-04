"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type NewsItem = {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  imageUrl?: string;
};

export default function NewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [news, setNews] = useState<NewsItem[]>([]);

  const url = searchParams.get("url");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [status, session]);

  useEffect(() => {
    if (!url && session) {
      fetch("/api/news")
        .then((res) => res.json())
        .then(setNews)
        .catch((err) => console.error("❌ Gagal ambil data:", err));
    }
  }, [url, session]);

  if (status === "loading") {
    return <p className="p-6 text-center">Memuat...</p>;
  }

  if (!session) {
    return <p className="p-6 text-center">Belum login...</p>;
  }

  if (url) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Detail Berita</h1>
        <iframe
          src={url}
          className="w-full h-[80vh] border rounded"
          title="Detail Berita"
        />
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Portal Berita</h1>
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
          >
            Logout
          </button>
        </form>
      </header>

      <ul className="grid gap-6">
        {news.map((item, i) => (
          <li
            key={i}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded overflow-hidden shadow hover:shadow-md transition-shadow"
          >
            <a href={`/berita?url=${encodeURIComponent(item.link)}`}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.title.length > 80
                    ? item.title.slice(0, 80) + "..."
                    : item.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {item.source} • {item.pubDate}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
