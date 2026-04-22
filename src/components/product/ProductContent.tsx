import { getProductFirstPage, getSTFilterFirstPage } from "@/lib/queries/products";
import { StatsHeader } from "./StatsHeader";
import { CompatibilityClient } from "./CompatibilityClient";

interface ProductContentProps {
  product: string;
}

export async function ProductContent({ product }: ProductContentProps) {
  const isSTFilter = product === "stfilter";

  const { grouped, nextCursor } = isSTFilter
    ? await getSTFilterFirstPage()
    : await getProductFirstPage(product);

  // Initial counts reflect what's on-screen now; client will update as more loads
  const stats = {
    vehicleCount: Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0),
    brandCount: Object.keys(grouped).length,
  };

  return (
    <>
      <StatsHeader slug={product} stats={stats} />
      <CompatibilityClient
        groupedData={grouped}
        slug={product}
        initialCursor={nextCursor}
      />
    </>
  );
}
