import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-black text-orange">404</h1>
      <p className="mb-8 text-text2">Page not found</p>
      <Link
        href="/"
        className="rounded-lg border-2 border-orange px-6 py-2 text-sm font-bold text-orange no-underline transition-colors hover:bg-orange hover:text-white"
      >
        Back to Home
      </Link>
    </main>
  );
}
