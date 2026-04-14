import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ProductStats } from "@/lib/types/product";

interface ProductCardProps {
  slug: string;
  nameKey: string;
  subtitleKey: string;
  descriptionKey: string;
  image: string;
  stats: ProductStats;
  index: number;
}

export function ProductCard({
  slug,
  nameKey,
  subtitleKey,
  descriptionKey,
  image,
  stats,
  index,
}: ProductCardProps) {
  const t = useTranslations();
  const tProduct = useTranslations("product");
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/${slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card no-underline transition-all duration-350 hover:-translate-y-1.5 hover:border-orange hover:shadow-[0_20px_50px_rgba(234,85,4,0.12)]"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Image */}
      <div className="h-[220px] overflow-hidden">
        <img
          src={image}
          alt={t(nameKey)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="px-7 py-6">
        <div className="mb-1.5 text-[22px] font-extrabold leading-tight tracking-tight">
          {t(nameKey)}
        </div>
        <div className="mb-4 text-[13px] tracking-wide text-text3">
          {t(subtitleKey)}
        </div>

        {/* Stats */}
        <div className="mb-3.5 flex gap-5">
          <div>
            <div className="text-[28px] font-black leading-none tracking-tight text-orange">
              {stats.vehicleCount.toLocaleString()}
            </div>
            <div className="text-[10px] tracking-[1px] uppercase text-text3">
              {tProduct("vehicles")}
            </div>
          </div>
          <div>
            <div className="text-[28px] font-black leading-none tracking-tight text-orange">
              {stats.brandCount}
            </div>
            <div className="text-[10px] tracking-[1px] uppercase text-text3">
              {tProduct("brands")}
            </div>
          </div>
        </div>

        <div className="mb-4 text-[13px] leading-relaxed text-text2">
          {t(descriptionKey)}
        </div>

        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold tracking-wide uppercase text-orange">
          {tProduct("viewList")}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="transition-transform duration-200 group-hover:translate-x-1.5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
