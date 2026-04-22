import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PRODUCT_SLUGS } from "@/lib/types/product";
import { getProductData, getSTFilterData } from "@/lib/queries/products";
import { StatsHeader } from "@/components/product/StatsHeader";
import { CompatibilityClient } from "@/components/product/CompatibilityClient";

export const revalidate = 300;

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

  if (!PRODUCT_SLUGS.includes(product as typeof PRODUCT_SLUGS[number])) {
    notFound();
  }

  const isSTFilter = product === "stfilter";

  if (isSTFilter) {
    const groupedData = await getSTFilterData();
    const stats = {
      vehicleCount: Object.values(groupedData).reduce((sum, arr) => sum + arr.length, 0),
      brandCount: Object.keys(groupedData).length,
    };
    return (
      <main>
        <StatsHeader slug={product} stats={stats} />
        <CompatibilityClient groupedData={groupedData} slug="stfilter" />
      </main>
    );
  }

  const groupedData = await getProductData(product);
  const stats = {
    vehicleCount: Object.values(groupedData).reduce((sum, arr) => sum + arr.length, 0),
    brandCount: Object.keys(groupedData).length,
  };
  return (
    <main>
      <StatsHeader slug={product} stats={stats} />
      <CompatibilityClient groupedData={groupedData} slug={product} />
    </main>
  );
}
