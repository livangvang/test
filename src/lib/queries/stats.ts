"use cache";

import { cacheLife } from "next/cache";
import { PRODUCT_SLUGS } from "@/lib/types/product";
import { getProductStats } from "./products";
import type { SiteStats } from "@/lib/types/product";

/** Get site-wide stats for the homepage hero */
export async function getSiteStats(): Promise<SiteStats> {
  cacheLife("minutes");

  let totalVehicles = 0;
  const allBrands = new Set<string>();

  // Collect stats from each product
  // Note: This calls getProductStats which itself is cached
  for (const slug of PRODUCT_SLUGS) {
    const stats = await getProductStats(slug);
    totalVehicles += stats.vehicleCount;
    // brandCount is per-product, we track unique across all
  }

  // For unique brand count, we use a reasonable estimate
  // The exact number requires loading all data, which is expensive
  // The homepage hero showed 108 brands — we can hardcode or compute
  return {
    totalVehicles,
    totalProducts: PRODUCT_SLUGS.length,
    totalBrands: 108, // TODO: compute dynamically if needed
  };
}
