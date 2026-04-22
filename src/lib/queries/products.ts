import { notion } from "@/lib/notion";
import {
  transformProductVehicle,
  transformSTFilterVehicle,
} from "@/lib/transformers/vehicle";
import { PRODUCT_DATA_SOURCES } from "@/lib/types/product";
import type { ProductVehicle, STFilterVehicle } from "@/lib/types/vehicle";
import type { ProductStats } from "@/lib/types/product";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints/common";

const RATE_LIMIT_DELAY = 350; // ms between requests (Notion limit: 3 req/s)
const PAGE_SIZE = 100;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch ONE page (up to 100 rows) from a Notion data source */
async function fetchNotionPage(
  dataSourceId: string,
  cursor?: string
): Promise<{ pages: PageObjectResponse[]; nextCursor: string | null }> {
  let retries = 0;
  while (true) {
    try {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        start_cursor: cursor,
        page_size: PAGE_SIZE,
      });
      const pages = response.results.filter(
        (r): r is PageObjectResponse => "properties" in r
      );
      const nextCursor = response.has_more ? response.next_cursor ?? null : null;
      return { pages, nextCursor };
    } catch (error) {
      retries++;
      if (retries >= 3) throw error;
      await sleep(1000 * retries);
    }
  }
}

/** Fetch all pages from a Notion data source with pagination */
async function fetchAllPages(dataSourceId: string): Promise<PageObjectResponse[]> {
  const all: PageObjectResponse[] = [];
  let cursor: string | undefined = undefined;
  do {
    const { pages, nextCursor } = await fetchNotionPage(dataSourceId, cursor);
    all.push(...pages);
    cursor = nextCursor ?? undefined;
    if (cursor) await sleep(RATE_LIMIT_DELAY);
  } while (cursor);
  return all;
}

/** Group vehicles by brand and sort (works for both Product & STFilter) */
function groupByBrand<T extends { brand?: string; model: string }>(
  vehicles: T[]
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  for (const v of vehicles) {
    const brand = v.brand || "Unknown";
    if (!grouped[brand]) grouped[brand] = [];
    grouped[brand].push(v);
  }
  const sorted: Record<string, T[]> = {};
  for (const brand of Object.keys(grouped).sort()) {
    sorted[brand] = grouped[brand].sort((a, b) => a.model.localeCompare(b.model));
  }
  return sorted;
}

// ─── Legacy full-fetch APIs (still used by stats) ───

export async function getProductData(
  slug: string
): Promise<Record<string, ProductVehicle[]>> {
  const dataSourceId = PRODUCT_DATA_SOURCES[slug];
  if (!dataSourceId) throw new Error(`Unknown product slug: ${slug}`);
  const pages = await fetchAllPages(dataSourceId);
  const vehicles = pages.map((page) => transformProductVehicle(page, slug));
  return groupByBrand(vehicles);
}

export async function getSTFilterData(): Promise<Record<string, STFilterVehicle[]>> {
  const dataSourceId = PRODUCT_DATA_SOURCES["stfilter"];
  if (!dataSourceId) throw new Error("ST-Filter data source ID not configured");
  const pages = await fetchAllPages(dataSourceId);
  const vehicles = pages.map((page) => transformSTFilterVehicle(page));
  return groupByBrand(vehicles);
}

// ─── Progressive (first page + cursor) APIs ───

export async function getProductFirstPage(slug: string): Promise<{
  grouped: Record<string, ProductVehicle[]>;
  nextCursor: string | null;
}> {
  const dataSourceId = PRODUCT_DATA_SOURCES[slug];
  if (!dataSourceId) throw new Error(`Unknown product slug: ${slug}`);
  const { pages, nextCursor } = await fetchNotionPage(dataSourceId);
  const vehicles = pages.map((page) => transformProductVehicle(page, slug));
  return { grouped: groupByBrand(vehicles), nextCursor };
}

export async function getSTFilterFirstPage(): Promise<{
  grouped: Record<string, STFilterVehicle[]>;
  nextCursor: string | null;
}> {
  const dataSourceId = PRODUCT_DATA_SOURCES["stfilter"];
  if (!dataSourceId) throw new Error("ST-Filter data source ID not configured");
  const { pages, nextCursor } = await fetchNotionPage(dataSourceId);
  const vehicles = pages.map((page) => transformSTFilterVehicle(page));
  return { grouped: groupByBrand(vehicles), nextCursor };
}

/** Fetch a subsequent page (called by /api route) */
export async function fetchVehiclePage(
  slug: string,
  cursor: string
): Promise<{
  vehicles: (ProductVehicle | STFilterVehicle)[];
  nextCursor: string | null;
}> {
  const dataSourceId = PRODUCT_DATA_SOURCES[slug];
  if (!dataSourceId) throw new Error(`Unknown product slug: ${slug}`);
  const { pages, nextCursor } = await fetchNotionPage(dataSourceId, cursor);
  const vehicles =
    slug === "stfilter"
      ? pages.map((page) => transformSTFilterVehicle(page))
      : pages.map((page) => transformProductVehicle(page, slug));
  return { vehicles, nextCursor };
}

// ─── Stats (uses full fetch, but called separately from page render) ───

export async function getProductStats(slug: string): Promise<ProductStats> {
  const data = slug === "stfilter" ? await getSTFilterData() : await getProductData(slug);
  const brands = Object.keys(data);
  const vehicleCount = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);
  return { vehicleCount, brandCount: brands.length };
}
