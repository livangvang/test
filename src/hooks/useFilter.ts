"use client";

import { useState, useCallback, useMemo } from "react";

interface UseFilterReturn<T> {
  activeBrand: string | null;
  setActiveBrand: (brand: string | null) => void;
  applyFilter: (data: T[]) => T[];
}

export function useFilter<T extends { brand: string }>(): UseFilterReturn<T> {
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const applyFilter = useCallback(
    (data: T[]): T[] => {
      if (!activeBrand) return data;
      return data.filter((item) => item.brand === activeBrand);
    },
    [activeBrand]
  );

  return { activeBrand, setActiveBrand, applyFilter };
}

/** Extract unique sorted brand list from grouped data */
export function extractBrands(
  groupedData: Record<string, unknown[]>
): string[] {
  return Object.keys(groupedData).sort();
}
