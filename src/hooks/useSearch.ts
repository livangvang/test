"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "./useDebounce";

interface UseSearchProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  debounceMs?: number;
}

interface UseSearchReturn<T> {
  query: string;
  setQuery: (q: string) => void;
  results: T[];
}

export function useSearch<T>({
  data,
  searchFields,
  debounceMs = 300,
}: UseSearchProps<T>): UseSearchReturn<T> {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, debounceMs);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return data;

    const lower = debouncedQuery.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lower);
        }
        return false;
      })
    );
  }, [data, debouncedQuery, searchFields]);

  return { query, setQuery, results };
}
