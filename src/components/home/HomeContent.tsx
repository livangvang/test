import { getTranslations } from "next-intl/server";
import { HeroSection } from "./HeroSection";
import { ProductCard } from "./ProductCard";
import { PRODUCTS } from "@/lib/types/product";
import { getProductStats } from "@/lib/queries/products";

export async function HomeContent() {
  const t = await getTranslations("home");

  // Fetch all product stats in parallel
  const statsResults = await Promise.all(
    PRODUCTS.map((p) => getProductStats(p.slug))
  );

  const totalVehicles = statsResults.reduce((sum, s) => sum + s.vehicleCount, 0);

  const siteStats = {
    totalVehicles,
    totalProducts: PRODUCTS.length,
    totalBrands: 108,
  };

  return (
    <>
      <HeroSection stats={siteStats} />

      <div className="mx-auto flex max-w-[1200px] items-baseline justify-between px-5 pt-12 pb-6 md:px-10">
        <div className="text-[11px] font-semibold tracking-[3px] uppercase text-text3">
          {t("selectProduct")}
        </div>
        <div className="text-xs text-text3">
          {t("productLines", { count: PRODUCTS.length })}
        </div>
      </div>

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
    </>
  );
}
