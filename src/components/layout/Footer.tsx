import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-border px-6 py-10 text-xs text-text3">
      <span>{t("copyright", { year: 2026 })}</span>
      <a
        href="https://www.shadowmotor.com.tw"
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange no-underline"
      >
        www.shadowmotor.com.tw
      </a>
    </footer>
  );
}
