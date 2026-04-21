import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductCard } from "@/components/home/ProductCard";
import { StoryBanner } from "@/components/home/StoryBanner";
import { PRODUCTS } from "@/lib/types/product";
import { getProductStats } from "@/lib/queries/products";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: `Shadow Performance — ${t("titleAccent")} ${t("titleEnd")}`,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  // Fetch stats for all products in parallel
  const statsResults = await Promise.all(
    PRODUCTS.map((p) => getProductStats(p.slug))
  );

  const totalVehicles = statsResults.reduce(
    (sum, s) => sum + s.vehicleCount,
    0
  );

  const siteStats = {
    totalVehicles,
    totalProducts: PRODUCTS.length,
    totalBrands: 108,
  };

  return (
    <main>
      <HeroSection stats={siteStats} />

      {/* Section Bar */}
      <div className="mx-auto flex max-w-[1200px] items-baseline justify-between px-5 pt-12 pb-6 md:px-10">
        <div className="text-[11px] font-semibold tracking-[3px] uppercase text-text3">
          {t("selectProduct")}
        </div>
        <div className="text-xs text-text3">
          {t("productLines", { count: PRODUCTS.length })}
        </div>
      </div>

      {/* Product Grid */}
      <section className="mx-auto max-w-[1200px] px-5 pb-15 md:px-10">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              nameKey={product.nameKey}
              subtitleKey={product.subtitleKey}
              descriptionKey={product.descriptionKey}
              image={product.image}
              stats={statsResults[i]}
              index={i}
            />
          ))}
        </div>
      </section>

      <StoryBanner />
    </main>
  );
}
