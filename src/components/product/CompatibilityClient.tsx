"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCompatibility } from "@/hooks/useCompatibility";
import { SearchBar } from "./SearchBar";
import type { ProductVehicle, STFilterVehicle } from "@/lib/types/vehicle";

type AnyVehicle = ProductVehicle | STFilterVehicle;

function mergeIntoGrouped(
  existing: Record<string, AnyVehicle[]>,
  incoming: AnyVehicle[]
): Record<string, AnyVehicle[]> {
  const merged: Record<string, AnyVehicle[]> = {};
  for (const [brand, list] of Object.entries(existing)) {
    merged[brand] = [...list];
  }
  for (const v of incoming) {
    const brand = v.brand || "Unknown";
    if (!merged[brand]) merged[brand] = [];
    merged[brand].push(v);
  }
  const sorted: Record<string, AnyVehicle[]> = {};
  for (const brand of Object.keys(merged).sort()) {
    sorted[brand] = [...merged[brand]].sort((a, b) => a.model.localeCompare(b.model));
  }
  return sorted;
}

// ─── Feature definitions for card view (FD-EVO / D-Meter) ───

interface Feature {
  key: string;
  labelKey: string;
}

const FDEVO_FEATURES: Feature[] = [
  { key: "basicInfo", labelKey: "basicInfo" },
  { key: "oilTemp", labelKey: "oilTemp" },
  { key: "transTemp", labelKey: "transTemp" },
];

const DMETER_FEATURES: Feature[] = [
  { key: "speed", labelKey: "speed" },
  { key: "rpm", labelKey: "rpm" },
  { key: "coolant", labelKey: "coolant" },
  { key: "oilTemp", labelKey: "oilTemp" },
  { key: "transTemp", labelKey: "transTemp" },
  { key: "boost", labelKey: "boost" },
  { key: "egt", labelKey: "egt" },
  { key: "intakeTemp", labelKey: "intakeTemp" },
  { key: "voltage", labelKey: "voltage" },
  { key: "afr", labelKey: "afr" },
  { key: "mileage", labelKey: "mileage" },
];

/** Single vehicle card for FD-EVO / D-Meter */
function VehicleCard({
  vehicle,
  features,
  tTable,
  t,
}: {
  vehicle: ProductVehicle;
  features: Feature[];
  tTable: (key: string) => string;
  t: (key: string) => string;
}) {
  const data = vehicle as unknown as Record<string, string | undefined>;

  // Count supported vs total features that have data (O or X)
  const tested = features.filter((f) => data[f.key] === "O" || data[f.key] === "X");
  const supported = features.filter((f) => data[f.key] === "O");
  const isVerified = vehicle.compatibility === "☑️";

  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80">
      {/* Top: name + year + engine */}
      <div className="mb-2">
        <span className="text-sm font-bold text-text">
          {vehicle.model}
        </span>
        {vehicle.year && (
          <span className="ml-2 rounded bg-bg3 px-1.5 py-0.5 text-[11px] text-text2">
            {vehicle.year}
          </span>
        )}
        {vehicle.engine && (
          <span className="ml-1.5 rounded bg-bg3 px-1.5 py-0.5 text-[11px] text-text2">
            {vehicle.engine}
          </span>
        )}
      </div>

      {/* Summary line: verified badge + count + version */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {isVerified ? (
          <span className="rounded-md bg-green-bg border border-green-border px-2 py-0.5 text-[11px] font-medium text-green">
            ✓ {t("verified")}
          </span>
        ) : (
          <span className="rounded-md border border-border bg-bg3 px-2 py-0.5 text-[11px] text-text3">
            ✗ {t("unverified")}
          </span>
        )}
        {tested.length > 0 && (
          <span className="text-[11px] text-text3">
            ✓ {supported.length} / {tested.length}
          </span>
        )}
        {vehicle.version && (
          <span className="text-[11px] text-text3">
            {vehicle.version}
          </span>
        )}
      </div>

      {/* Feature badges — show all tested features */}
      <div className="flex flex-wrap gap-1">
        {features.map((f) => {
          const val = data[f.key];
          if (!val || (val !== "O" && val !== "X")) return null;
          const isOk = val === "O";
          return (
            <span
              key={f.key}
              className={
                isOk
                  ? "rounded-md bg-green-bg border border-green-border px-1.5 py-0.5 text-[10px] font-medium text-green"
                  : "rounded-md border border-border bg-bg3 px-1.5 py-0.5 text-[10px] text-text3 line-through"
              }
            >
              {isOk ? "✓" : "✗"} {tTable(f.labelKey)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Table column definitions (for non-card products) ───
interface Column {
  key: string;
  labelKey: string;
  type: "text" | "harness" | "stock";
}

const COMMON_COLS: Column[] = [
  { key: "model", labelKey: "model", type: "text" },
  { key: "chassis", labelKey: "chassis", type: "text" },
  { key: "year", labelKey: "year", type: "text" },
  { key: "engine", labelKey: "engine", type: "text" },
];

const TABLE_COLUMNS: Record<string, Column[]> = {
  "4s": [...COMMON_COLS, { key: "harness", labelKey: "harness", type: "harness" }],
  iboost2: [...COMMON_COLS, { key: "harness", labelKey: "connector", type: "harness" }],
  valve: [...COMMON_COLS, { key: "harness", labelKey: "controller", type: "harness" }],
  stfilter: [
    ...COMMON_COLS,
    { key: "knNumber", labelKey: "knNumber", type: "text" },
    { key: "swCode", labelKey: "swCode", type: "text" },
    { key: "oemNumber", labelKey: "oemNumber", type: "text" },
    { key: "shape", labelKey: "shape", type: "text" },
    { key: "packageContents", labelKey: "packageContents", type: "text" },
    { key: "inStock", labelKey: "stock", type: "stock" },
  ],
};

// Products that use card layout
const CARD_PRODUCTS: Record<string, Feature[]> = {
  fdevo: FDEVO_FEATURES,
  dmeter2plus: DMETER_FEATURES,
};

// ─── Main Component ───

interface CompatibilityClientProps {
  groupedData: Record<string, AnyVehicle[]>;
  slug: string;
  initialCursor?: string | null;
}

export function CompatibilityClient({
  groupedData: initialData,
  slug,
  initialCursor = null,
}: CompatibilityClientProps) {
  const t = useTranslations("product");
  const tTable = useTranslations("table");

  const [groupedData, setGroupedData] = useState(initialData);
  const [loadingMore, setLoadingMore] = useState(!!initialCursor);

  const { query, setQuery, displayData, totalVisible } = useCompatibility({
    groupedData,
    searchFields: ["brand", "model", "chassis", "year", "engine"],
  });

  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(
    () => new Set(Object.keys(initialData))
  );

  // Background progressive loading: keep fetching next pages until cursor is null
  useEffect(() => {
    if (!initialCursor) return;
    let cancelled = false;
    let cursor: string | null = initialCursor;

    (async () => {
      while (cursor && !cancelled) {
        try {
          const res = await fetch(
            `/api/vehicles/${slug}?cursor=${encodeURIComponent(cursor)}`
          );
          if (!res.ok) break;
          const data = (await res.json()) as {
            vehicles: AnyVehicle[];
            nextCursor: string | null;
          };
          if (cancelled) break;
          setGroupedData((prev) => mergeIntoGrouped(prev, data.vehicles));
          setExpandedBrands((prev) => {
            const next = new Set(prev);
            for (const v of data.vehicles) {
              next.add(v.brand || "Unknown");
            }
            return next;
          });
          cursor = data.nextCursor;
        } catch {
          break;
        }
      }
      if (!cancelled) setLoadingMore(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, initialCursor]);

  const displayBrands = useMemo(() => Object.keys(displayData), [displayData]);
  const allExpanded = displayBrands.every((b) => expandedBrands.has(b));

  function toggleBrand(brand: string) {
    setExpandedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }

  function toggleAll() {
    setExpandedBrands(allExpanded ? new Set() : new Set(displayBrands));
  }

  const isCardLayout = slug in CARD_PRODUCTS;
  const features = CARD_PRODUCTS[slug] ?? null;
  const columns = TABLE_COLUMNS[slug] ?? COMMON_COLS;

  function renderCell(vehicle: ProductVehicle | STFilterVehicle, col: Column) {
    const value = (vehicle as unknown as Record<string, unknown>)[col.key];
    switch (col.type) {
      case "harness":
        return value ? (
          <span className="rounded-md bg-orange-dim px-2 py-0.5 text-xs font-medium text-orange">
            {String(value)}
          </span>
        ) : (
          <span className="text-text3">—</span>
        );
      case "stock":
        return value ? (
          <span className="rounded-md bg-green-bg border border-green-border px-2 py-0.5 text-xs font-medium text-green">
            {t("inStock")}
          </span>
        ) : (
          <span className="rounded-md border border-border bg-bg3 px-2 py-0.5 text-xs text-text3">
            {t("orderAvailable")}
          </span>
        );
      default:
        return <span className="text-text2">{value ? String(value) : ""}</span>;
    }
  }

  return (
    <div>
      {/* Search + Controls */}
      <div className="mx-auto max-w-[1200px] space-y-4 px-5 py-6 md:px-10">
        <SearchBar value={query} onChange={setQuery} />
        <div className="flex items-center justify-between">
          <div className="text-sm text-text3">
            {totalVisible.toLocaleString()} {t("vehicles")}
            {" · "}
            {displayBrands.length} {t("brands")}
            {loadingMore && (
              <span className="ml-2 inline-flex items-center gap-1.5 text-xs text-orange">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange" />
                {t("loadingMore")}
              </span>
            )}
          </div>
          <button
            onClick={toggleAll}
            className="text-xs font-medium text-text3 transition-colors hover:text-orange"
          >
            {allExpanded ? tTable("collapseAll") : tTable("expandAll")}
          </button>
        </div>
      </div>

      {/* Brand Accordion */}
      <div className="mx-auto max-w-[1200px] px-5 pb-16 md:px-10">
        {displayBrands.length === 0 ? (
          <div className="py-15 text-center text-text3">{t("noResults")}</div>
        ) : (
          <div className="space-y-2">
            {displayBrands.map((brand) => {
              const vehicles = displayData[brand] ?? [];
              const isExpanded = expandedBrands.has(brand);

              return (
                <div
                  key={brand}
                  className="overflow-hidden rounded-xl border border-border"
                >
                  {/* Brand Header */}
                  <button
                    onClick={() => toggleBrand(brand)}
                    className="flex w-full items-center justify-between bg-bg3 px-5 py-3 text-left transition-colors hover:bg-bg3/80"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-orange">{brand}</span>
                      <span className="rounded-md bg-orange-dim px-2 py-0.5 text-[10px] font-medium text-orange">
                        {vehicles.length}
                      </span>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`text-text3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {/* Content — card grid or table */}
                  {isExpanded && (
                    isCardLayout && features ? (
                      <div className="grid grid-cols-1 gap-2 p-3 md:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((vehicle, i) => (
                          <VehicleCard
                            key={i}
                            vehicle={vehicle as ProductVehicle}
                            features={features}
                            tTable={tTable}
                            t={t}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border bg-bg2 text-left">
                              {columns.map((col) => (
                                <th key={col.key} className="px-4 py-2 font-semibold text-text3">
                                  {tTable(col.labelKey)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {vehicles.map((vehicle, i) => (
                              <tr key={i} className="border-b border-border/30 transition-colors hover:bg-bg3/30">
                                {columns.map((col) => (
                                  <td key={col.key} className="px-4 py-2">
                                    {renderCell(vehicle, col)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
