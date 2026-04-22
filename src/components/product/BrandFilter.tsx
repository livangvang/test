"use client";

import { useTranslations } from "next-intl";

interface BrandFilterProps {
  brands: string[];
  activeBrand: string | null;
  onSelect: (brand: string | null) => void;
}

export function BrandFilter({
  brands,
  activeBrand,
  onSelect,
}: BrandFilterProps) {
  const t = useTranslations("product");

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium tracking-wide transition-all ${
          activeBrand === null
            ? "bg-orange text-white"
            : "border border-border bg-bg3 text-text2 hover:border-orange hover:text-orange"
        }`}
      >
        {t("allBrands")}
      </button>
      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => onSelect(activeBrand === brand ? null : brand)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium tracking-wide transition-all ${
            activeBrand === brand
              ? "bg-orange text-white"
              : "border border-border bg-bg3 text-text2 hover:border-orange hover:text-orange"
          }`}
        >
          {brand}
        </button>
      ))}
    </div>
  );
}
