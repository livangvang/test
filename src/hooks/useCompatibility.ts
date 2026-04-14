"use client";

import { useMemo } from "react";
import { useSearch } from "./useSearch";
import { useFilter } from "./useFilter";
import type { ProductVehicle, STFilterVehicle } from "@/lib/types/vehicle";

type VehicleItem = ProductVehicle | STFilterVehicle;

interface UseCompatibilityProps {
  groupedData: Record<string, VehicleItem[]>;
  searchFields: (keyof VehicleItem)[];
}

export function useCompatibility({
  groupedData,
  searchFields,
}: UseCompatibilityProps) {
  // Flatten grouped data for search
  const flatData = useMemo(
    () => Object.values(groupedData).flat(),
    [groupedData]
  );

  const brands = useMemo(
    () => Object.keys(groupedData).sort(),
    [groupedData]
  );

  const { query, setQuery, results: searchResults } = useSearch({
    data: flatData,
    searchFields,
  });

  const { activeBrand, setActiveBrand, applyFilter } =
    useFilter<VehicleItem>();

  // Apply filter on search results
  const filteredResults = useMemo(
    () => applyFilter(searchResults),
    [applyFilter, searchResults]
  );

  // Re-group filtered results by brand
  const displayData = useMemo(() => {
    const grouped: Record<string, VehicleItem[]> = {};
    for (const item of filteredResults) {
      const brand = item.brand || "Unknown";
      if (!grouped[brand]) {
        grouped[brand] = [];
      }
      grouped[brand].push(item);
    }
    // Sort brands
    const sorted: Record<string, VehicleItem[]> = {};
    for (const brand of Object.keys(grouped).sort()) {
      sorted[brand] = grouped[brand];
    }
    return sorted;
  }, [filteredResults]);

  const totalVisible = filteredResults.length;

  return {
    query,
    setQuery,
    activeBrand,
    setActiveBrand,
    brands,
    displayData,
    totalVisible,
  };
}
