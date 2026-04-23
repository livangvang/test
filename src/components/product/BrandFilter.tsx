"use client";

import { useTranslations } from "next-intl";

interface BrandFilterProps {
  brands: string[];
  activeBrand: string | null;
  onSelect: (brand: string | null) => void;
}

/**
 * V4 brand chip row — Eurostar caps, square chips, orange accent when active.
 * Prefixed by a "BRANDS ▸" eyebrow so the row reads as a filter channel.
 */
export function BrandFilter({ brands, activeBrand, onSelect }: BrandFilterProps) {
  const t = useTranslations("product");

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-brand mr-2 text-[10px] font-black tracking-[2px] text-text3">
        BRANDS ▸
      </span>
      <Chip active={activeBrand === null} onClick={() => onSelect(null)}>
        {t("allBrands")}
      </Chip>
      {brands.map((b) => (
        <Chip
          key={b}
          active={activeBrand === b}
          onClick={() => onSelect(activeBrand === b ? null : b)}
        >
          {b}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const base =
    "font-brand cursor-pointer border px-3 py-1.5 text-[11px] font-black tracking-[1.5px] transition-colors";
  const cls = active
    ? "bg-orange text-white border-orange"
    : "bg-transparent text-text2 border-border hover:border-orange hover:text-orange";
  return (
    <button onClick={onClick} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}
