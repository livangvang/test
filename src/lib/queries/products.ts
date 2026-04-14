"use cache";

import { cacheLife } from "next/cache";
import { notion } from "@/lib/notion";
import { transformProductVehicle } from "@/lib/transformers/vehicle";
import { PRODUCT_DATA_SOURCES } from "@/lib/types/product";
import type { ProductVehicle, STFilterVehicle } from "@/lib/types/vehicle";
import type { ProductStats } from "@/lib/types/product";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints/common";
import { promises as fs } from "fs";
import path from "path";

const RATE_LIMIT_DELAY = 350; // ms between requests (Notion limit: 3 req/s)

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch all pages from a Notion data source with pagination (SDK v5) */
async function fetchAllPages(dataSourceId: string): Promise<PageObjectResponse[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;
  let retries = 0;

  do {
    try {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor,
        page_size: 100,
      });

      const pageResults = response.results.filter(
        (r): r is PageObjectResponse => "properties" in r
      );
      pages.push(...pageResults);
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
      retries = 0;

      if (cursor) {
        await sleep(RATE_LIMIT_DELAY);
      }
    } catch (error) {
      retries++;
      if (retries >= 3) throw error;
      await sleep(1000 * retries);
    }
  } while (cursor);

  return pages;
}

/** Group vehicles by brand and sort */
function groupByBrand(
  vehicles: ProductVehicle[]
): Record<string, ProductVehicle[]> {
  const grouped: Record<string, ProductVehicle[]> = {};

  for (const v of vehicles) {
    const brand = v.brand || "Unknown";
    if (!grouped[brand]) {
      grouped[brand] = [];
    }
    grouped[brand].push(v);
  }

  const sorted: Record<string, ProductVehicle[]> = {};
  for (const brand of Object.keys(grouped).sort()) {
    sorted[brand] = grouped[brand].sort((a, b) =>
      a.model.localeCompare(b.model)
    );
  }

  return sorted;
}

/** Get all vehicle data for a Notion-based product */
export async function getProductData(
  slug: string
): Promise<Record<string, ProductVehicle[]>> {
  cacheLife("minutes");

  const dataSourceId = PRODUCT_DATA_SOURCES[slug];
  if (!dataSourceId) {
    throw new Error(`Unknown product slug: ${slug}`);
  }

  const pages = await fetchAllPages(dataSourceId);

  const vehicles = pages.map((page) => transformProductVehicle(page, slug));

  return groupByBrand(vehicles);
}

/** Get ST-Filter data from JSON file */
export async function getSTFilterData(): Promise<
  Record<string, STFilterVehicle[]>
> {
  cacheLife("hours");

  const filePath = path.join(process.cwd(), "public", "data", "stfilter_data.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const items: Array<{
    brand: string;
    model: string;
    chassis: string;
    year: string;
    engine: string;
    kn_number: string;
    sw_code: string | null;
    in_stock: boolean;
    outside_length: number | null;
    outside_width: number | null;
    height: number | null;
    weight: number | null;
    note: string | null;
  }> = JSON.parse(raw);

  const grouped: Record<string, STFilterVehicle[]> = {};

  for (const item of items) {
    const brand = item.brand || "Unknown";
    if (!grouped[brand]) {
      grouped[brand] = [];
    }
    grouped[brand].push({
      brand: item.brand,
      model: item.model,
      chassis: item.chassis || "",
      year: item.year || "",
      engine: item.engine || "",
      knNumber: item.kn_number || "",
      swCode: item.sw_code,
      inStock: item.in_stock ?? false,
      outsideLength: item.outside_length,
      outsideWidth: item.outside_width,
      height: item.height,
      weight: item.weight,
    });
  }

  const sorted: Record<string, STFilterVehicle[]> = {};
  for (const brand of Object.keys(grouped).sort()) {
    sorted[brand] = grouped[brand].sort((a, b) =>
      a.model.localeCompare(b.model)
    );
  }

  return sorted;
}

/** Get stats for a product */
export async function getProductStats(slug: string): Promise<ProductStats> {
  cacheLife("minutes");

  if (slug === "stfilter") {
    const data = await getSTFilterData();
    const brands = Object.keys(data);
    const vehicleCount = Object.values(data).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    return { vehicleCount, brandCount: brands.length };
  }

  const data = await getProductData(slug);
  const brands = Object.keys(data);
  const vehicleCount = Object.values(data).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  return { vehicleCount, brandCount: brands.length };
}
