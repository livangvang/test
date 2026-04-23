"use client";

import { useState, useEffect, useMemo } from "react";
import { StatsHeader } from "./StatsHeader";
import { CompatibilityClient } from "./CompatibilityClient";
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

interface ProductViewProps {
  slug: string;
  initialData: Record<string, AnyVehicle[]>;
  initialCursor: string | null;
}

export function ProductView({ slug, initialData, initialCursor }: ProductViewProps) {
  const [groupedData, setGroupedData] = useState(initialData);
  const [loadingMore, setLoadingMore] = useState(!!initialCursor);

  // Progressive loading in the background
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

  // Stats are derived from live data — they update as more vehicles load in
  const stats = useMemo(
    () => ({
      vehicleCount: Object.values(groupedData).reduce((sum, arr) => sum + arr.length, 0),
      brandCount: Object.keys(groupedData).length,
    }),
    [groupedData]
  );

  return (
    <>
      <StatsHeader slug={slug} stats={stats} />
      <CompatibilityClient
        groupedData={groupedData}
        slug={slug}
        loadingMore={loadingMore}
      />
    </>
  );
}
