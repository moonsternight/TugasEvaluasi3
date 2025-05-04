"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/berita");
    }
  }, [status, router]);

  return (
    <main className="flex h-screen justify-center items-center bg-gray-100 dark:bg-gray-900">
      <button
        onClick={() => signIn("google", { callbackUrl: "/berita" })}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded shadow text-lg"
      >
        Login dengan Google
      </button>
    </main>
  );
}
