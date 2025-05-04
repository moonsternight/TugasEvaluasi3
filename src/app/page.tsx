"use client";

import { getNews } from "@/lib/fetchNews";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    getNews().then(setNews);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Portal Berita</h1>
        {news.length === 0 && (
          <p className="text-center text-gray-400">Memuat berita...</p>
        )}
        {news.map((item, idx) => (
          <div
            key={idx}
            className="mb-4 border border-gray-700 rounded p-4 hover:bg-gray-900 transition"
          >
            <Link
              href={item.link}
              target="_blank"
              className="text-lg font-semibold hover:underline"
            >
              {item.title}
            </Link>
            <p className="text-sm text-gray-400 mt-1">
              {item.source} &middot; {new Date(item.pubDate).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
