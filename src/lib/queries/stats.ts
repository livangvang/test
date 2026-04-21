import { PRODUCT_SLUGS } from "@/lib/types/product";
import { getProductStats } from "./products";
import type { SiteStats } from "@/lib/types/product";

/** Get site-wide stats for the homepage hero */
export async function getSiteStats(): Promise<SiteStats> {
  let totalVehicles = 0;

  for (const slug of PRODUCT_SLUGS) {
    const stats = await getProductStats(slug);
    totalVehicles += stats.vehicleCount;
  }

  return {
    totalVehicles,
    totalProducts: PRODUCT_SLUGS.length,
    totalBrands: 108,
  };
}
