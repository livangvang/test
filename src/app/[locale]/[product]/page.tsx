import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PRODUCT_SLUGS } from "@/lib/types/product";
import { getProductData, getSTFilterData, getProductStats } from "@/lib/queries/products";
import { StatsHeader } from "@/components/product/StatsHeader";
import { CompatibilityClient } from "@/components/product/CompatibilityClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; product: string }>;
}) {
  const { locale, product } = await params;
  const t = await getTranslations({ locale, namespace: `products.${product}` });

  return {
    title: `Shadow Performance — ${t("name")} Compatibility List`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; product: string }>;
}) {
  const { locale, product } = await params;
  setRequestLocale(locale);

  // Validate slug
  if (!PRODUCT_SLUGS.includes(product as typeof PRODUCT_SLUGS[number])) {
    notFound();
  }

  // Fetch data based on product type
  const isSTFilter = product === "stfilter";
  const [stats] = await Promise.all([getProductStats(product)]);

  if (isSTFilter) {
    const groupedData = await getSTFilterData();
    return (
      <main>
        <StatsHeader slug={product} stats={stats} />
        <CompatibilityClient groupedData={groupedData} slug="stfilter" />
      </main>
    );
  }

  const groupedData = await getProductData(product);
  return (
    <main>
      <StatsHeader slug={product} stats={stats} />
      <CompatibilityClient groupedData={groupedData} slug={product} />
    </main>
  );
}
