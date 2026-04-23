"use client";

import { useLocale, useTranslations } from "next-intl";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * V4 search — squared-off, industrial. No rounded corners, hairline border
 * that lights orange on focus. Icon sits left, placeholder in Noto Sans TC
 * when locale is zh.
 */
export function SearchBar({ value, onChange }: SearchBarProps) {
  const t = useTranslations("product");
  const locale = useLocale();
  const isZh = locale.startsWith("zh");

  return (
    <div className="relative">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text3"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("searchPlaceholder")}
        className={`w-full border border-border bg-bg2 py-3 pr-4 pl-10 text-[13px] text-text outline-none transition-colors placeholder:text-text3 focus:border-orange ${isZh ? "zh" : ""}`}
      />
    </div>
  );
}
