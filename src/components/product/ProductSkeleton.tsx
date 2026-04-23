import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { PRODUCTS } from "@/lib/types/product";

interface ProductSkeletonProps {
  slug: string;
}

/**
 * Visually matches the real StatsHeader so the swap from loading state to
 * data-loaded state is seamless. Text that doesn't need Notion (title,
 * subtitle, description, product image) renders for real. Only the Notion-
 * dependent parts (stat numbers, table rows) use pulsing grey placeholders.
 */
export async function ProductSkeleton({ slug }: ProductSkeletonProps) {
  const t = await getTranslations("product");
  const tProducts = await getTranslations(`products.${slug}`);
  const locale = await getLocale();
  const isZh = locale.startsWith("zh");
  const product = PRODUCTS.find((p) => p.slug === slug);

  const productIndex = Math.max(
    1,
    PRODUCTS.findIndex((p) => p.slug === slug) + 1,
  );
  const total = PRODUCTS.length || 6;
  const indexLabel = `${String(productIndex).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  return (
    <>
      <section className="relative mt-16 border-b border-border bg-bg">
        <div className="mx-auto max-w-[1440px] px-6 pt-10 pb-8 md:px-12 md:pt-14 md:pb-10">
          <Link
            href={`/${locale}`}
            className="mb-8 inline-flex items-center gap-1.5 text-xs text-text3 no-underline transition-colors hover:text-orange"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t("backToHome")}
          </Link>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14 items-stretch">
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3.5 font-brand text-[11px] font-black tracking-[3px] text-text3 uppercase">
                  <span>
                    PRODUCT <span className="text-text2">·</span> {indexLabel}
                  </span>
                  <span className="inline-block h-px w-10 bg-border" />
                  <span className={`text-orange ${isZh ? "zh" : ""}`}>
                    {tProducts("subtitle")}
                  </span>
                </div>

                <h1
                  className="font-display m-0 text-[56px] md:text-[88px] leading-[0.92] tracking-[-2px] uppercase"
                  style={{ textWrap: "balance" }}
                >
                  {renderProductWordmark(slug, tProducts("name"))}
                </h1>

                <p
                  className={`mt-5 max-w-[520px] text-[14px] md:text-[15px] leading-[1.65] text-text2 ${isZh ? "zh" : ""}`}
                >
                  {tProducts("description")}
                </p>
              </div>

              {/* Stat strip — only numbers are skeleton-pulsing */}
              <div className="mt-8 flex gap-px border border-border bg-border">
                <div className="flex-1 min-w-[120px] bg-bg px-6 py-5 md:px-8">
                  <div className="h-10 w-24 animate-pulse rounded bg-bg3" />
                  <div className={`mt-2 font-brand text-[10px] font-black tracking-[2px] uppercase text-text3 ${isZh ? "zh" : ""}`}>
                    {t("vehicles")}
                  </div>
                </div>
                <div className="flex-1 min-w-[120px] bg-bg px-6 py-5 md:px-8">
                  <div className="h-10 w-16 animate-pulse rounded bg-bg3" />
                  <div className={`mt-2 font-brand text-[10px] font-black tracking-[2px] uppercase text-text3 ${isZh ? "zh" : ""}`}>
                    {t("brands")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel — real product image if available */}
            <div
              className="relative min-h-[360px] md:min-h-[440px] overflow-hidden border border-border"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 20%, rgba(234,85,4,0.18), transparent 55%), linear-gradient(160deg, #141414 0%, #0A0A0A 60%, #050505 100%)",
              }}
            >
              <div
                className="pointer-events-none absolute"
                style={{
                  top: -60,
                  right: -120,
                  width: 400,
                  height: 700,
                  background:
                    "linear-gradient(105deg, transparent 45%, rgba(234,85,4,0.08) 48%, rgba(234,85,4,0.18) 50%, rgba(234,85,4,0.08) 52%, transparent 55%)",
                  transform: "rotate(8deg)",
                }}
              />
              <span className="absolute top-3 left-3 h-5 w-5 border-t border-l border-orange" />
              <span className="absolute top-3 right-3 h-5 w-5 border-t border-r border-orange" />
              <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-orange" />
              <span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-orange" />
              <div className="absolute inset-0 flex items-center justify-center">
                {product?.image && (
                  <div className="relative h-[72%] w-[72%]">
                    <Image
                      src={product.image}
                      alt={tProducts("name")}
                      fill
                      sizes="(max-width: 768px) 80vw, 45vw"
                      className="object-contain"
                      style={{ filter: "drop-shadow(0 30px 60px rgba(234,85,4,0.35))" }}
                      priority
                    />
                  </div>
                )}
              </div>
              <div className="font-brand absolute right-5 top-5 text-[10px] font-black tracking-[2.5px] text-orange">
                ◢ FIG. {String(productIndex).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table skeleton */}
      <section className="mx-auto max-w-[1200px] px-5 py-10 md:px-10">
        <div className="mb-6 h-10 w-full animate-pulse rounded-lg bg-bg3" />
        <div className="mb-6 flex gap-2">
          <div className="h-8 w-16 animate-pulse rounded-full bg-bg3" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-bg3" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-bg3" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-bg3" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-md bg-bg3"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function renderProductWordmark(slug: string, name: string) {
  const hasCJK = /[㐀-鿿豈-﫿]/.test(name);
  if (hasCJK) {
    return <span className="zh">{name}</span>;
  }
  const splits: Record<string, [string, string]> = {
    "4s": ["E-Drive", "4S"],
    fdevo: ["FD-", "EVO"],
    dmeter2plus: ["D-Meter", "2Plus"],
    iboost2: ["I-Boost", "2"],
    valve: ["Valve", "Controller"],
    stfilter: ["ST-", "Filter"],
  };
  const parts = splits[slug];
  if (!parts) return <>{name}</>;
  return (
    <>
      {parts[0]}
      <br />
      <span className="text-orange">{parts[1]}</span>
    </>
  );
}
