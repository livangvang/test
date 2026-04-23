"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCompatibility } from "@/hooks/useCompatibility";
import { SearchBar } from "./SearchBar";
import { BrandFilter } from "./BrandFilter";
import type { ProductVehicle, STFilterVehicle } from "@/lib/types/vehicle";

type AnyVehicle = ProductVehicle | STFilterVehicle;

/* ─── Card-layout feature definitions (FD-EVO / D-Meter) ─── */

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

const CARD_PRODUCTS: Record<string, Feature[]> = {
  fdevo: FDEVO_FEATURES,
  dmeter2plus: DMETER_FEATURES,
};

/* ─── Table column definitions ─── */

interface Column {
  key: string;
  labelKey: string;
  type: "text" | "chassis" | "harness" | "stock" | "status";
  align?: "left" | "right";
  width?: string;
  mono?: boolean;
}

const TABLE_COLUMNS: Record<string, Column[]> = {
  "4s": [
    { key: "model", labelKey: "model", type: "text", width: "1.8fr" },
    { key: "chassis", labelKey: "chassis", type: "chassis", width: "110px" },
    { key: "year", labelKey: "year", type: "text", width: "110px", mono: true },
    { key: "engine", labelKey: "engine", type: "text", width: "1.5fr", mono: true },
    { key: "harness", labelKey: "harness", type: "harness", width: "110px" },
    { key: "__status", labelKey: "status", type: "status", width: "110px", align: "right" },
  ],
  iboost2: [
    { key: "model", labelKey: "model", type: "text", width: "1.8fr" },
    { key: "chassis", labelKey: "chassis", type: "chassis", width: "110px" },
    { key: "year", labelKey: "year", type: "text", width: "110px", mono: true },
    { key: "engine", labelKey: "engine", type: "text", width: "1.5fr", mono: true },
    { key: "harness", labelKey: "connector", type: "harness", width: "110px" },
    { key: "__status", labelKey: "status", type: "status", width: "110px", align: "right" },
  ],
  valve: [
    { key: "model", labelKey: "model", type: "text", width: "1.8fr" },
    { key: "chassis", labelKey: "chassis", type: "chassis", width: "110px" },
    { key: "year", labelKey: "year", type: "text", width: "110px", mono: true },
    { key: "engine", labelKey: "engine", type: "text", width: "1.5fr", mono: true },
    { key: "harness", labelKey: "controller", type: "harness", width: "110px" },
    { key: "__status", labelKey: "status", type: "status", width: "110px", align: "right" },
  ],
  // stfilter uses a custom spec-sheet card layout instead of table.
  // Kept here for type consistency but not actually rendered as a table.
  stfilter: [],
};

/* ─── Status marker ─── */

function StatusBadge({ verified, tLabels }: { verified: boolean; tLabels: (k: string) => string }) {
  if (verified) {
    return (
      <span className="font-brand inline-flex items-center gap-1.5 text-[10px] font-black tracking-[1.5px] text-green">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-green"
          style={{ boxShadow: "0 0 8px #4ADE80" }}
        />
        {tLabels("verified").toUpperCase()}
      </span>
    );
  }
  return (
    <span className="font-brand inline-flex items-center gap-1.5 text-[10px] font-black tracking-[1.5px] text-yellow">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow" />
      {tLabels("unverified").toUpperCase()}
    </span>
  );
}

/* ─── ST-Filter spec-sheet card: primary row + supporting row ─── */

function STFilterCard({
  vehicle,
  idx,
  tTable,
  t,
  isZh,
}: {
  vehicle: STFilterVehicle;
  idx: number;
  tTable: (k: string) => string;
  t: (k: string) => string;
  isZh: boolean;
}) {
  const [hover, setHover] = useState(false);

  // Compose dimensions + weight from separate fields
  const dims = [vehicle.outsideLength, vehicle.outsideWidth, vehicle.height]
    .filter((v) => v && String(v).trim().length > 0)
    .join(" × ");
  const weight = vehicle.weight && String(vehicle.weight).trim().length > 0
    ? String(vehicle.weight).trim()
    : null;

  const supporting: { label: string; value: string; mono?: boolean }[] = [];
  if (vehicle.year) supporting.push({ label: tTable("year"), value: vehicle.year, mono: true });
  if (vehicle.engine) supporting.push({ label: tTable("engine"), value: vehicle.engine, mono: true });
  if (vehicle.oemNumber) supporting.push({ label: tTable("oemNumber"), value: vehicle.oemNumber, mono: true });
  if (vehicle.swCode) supporting.push({ label: tTable("swCode"), value: vehicle.swCode, mono: true });
  if (vehicle.packageContents) supporting.push({ label: tTable("packageContents"), value: vehicle.packageContents });
  if (dims) supporting.push({ label: tTable("dimensions"), value: `${dims} mm`, mono: true });
  if (weight) supporting.push({ label: tTable("weight"), value: `${weight} g`, mono: true });

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative border-b border-[#141414] transition-colors"
      style={{
        padding: "20px 24px",
        background: hover
          ? "linear-gradient(90deg, rgba(234,85,4,0.08), transparent 70%)"
          : "transparent",
        borderLeft: `2px solid ${hover ? "#EA5504" : "transparent"}`,
      }}
    >
      {/* Primary row: index + model / chassis / part# */}
      <div className="grid items-baseline gap-4" style={{ gridTemplateColumns: "48px 1fr auto" }}>
        <div
          className="font-brand text-[12px] font-black tracking-[1px] transition-colors"
          style={{ color: hover ? "#EA5504" : "#333" }}
        >
          {String(idx + 1).padStart(3, "0")}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-display text-[20px] md:text-[22px] font-black leading-tight tracking-[-0.5px] uppercase">
            {vehicle.model}
          </span>
          {vehicle.chassis && (
            <span
              className="font-brand text-[11px] font-black tracking-[0.5px] text-orange"
              style={{
                padding: "2px 8px",
                background: "rgba(234,85,4,0.1)",
                border: "1px solid rgba(234,85,4,0.35)",
              }}
            >
              {vehicle.chassis}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {vehicle.knNumber && (
            <span className="font-mono text-[13px] md:text-[14px] font-bold tracking-[0.5px] text-orange">
              {vehicle.knNumber}
            </span>
          )}
          <StockBadge inStock={vehicle.inStock} t={t} />
        </div>
      </div>

      {/* Supporting row: year · engine · OEM · SW · package · dims · weight */}
      {supporting.length > 0 && (
        <div className="mt-3 ml-12 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px]">
          {supporting.map((s, i) => (
            <span key={i} className="inline-flex items-baseline gap-1.5">
              <span className={`font-brand text-[9px] font-black uppercase tracking-[1.5px] text-text3 ${isZh ? "zh" : ""}`}>
                {s.label}
              </span>
              <span className={`${s.mono ? "font-mono text-text2" : "text-text2"} ${isZh && !s.mono ? "zh" : ""}`}>
                {s.value}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StockBadge({ inStock, t }: { inStock: boolean; t: (k: string) => string }) {
  if (inStock) {
    return (
      <span className="font-brand inline-flex items-center gap-1.5 text-[10px] font-black tracking-[1.5px] text-green">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full bg-green"
          style={{ boxShadow: "0 0 8px #4ADE80" }}
        />
        {t("inStock").toUpperCase()}
      </span>
    );
  }
  return (
    <span className="font-brand inline-flex items-center gap-1.5 text-[10px] font-black tracking-[1.5px] text-text3">
      {t("orderAvailable").toUpperCase()}
    </span>
  );
}

/* ─── Single row with orange hover-sweep ─── */

function VehicleRow({
  vehicle,
  idx,
  columns,
  gridTemplate,
  t,
}: {
  vehicle: AnyVehicle;
  idx: number;
  columns: Column[];
  gridTemplate: string;
  t: (k: string) => string;
}) {
  const [hover, setHover] = useState(false);
  const data = vehicle as unknown as Record<string, unknown>;

  // compatibility check is the source-of-truth for "verified"
  const verifiedFlag =
    (vehicle as ProductVehicle).compatibility === "☑️" ||
    (vehicle as STFilterVehicle).inStock === true ||
    (data["__verifiedOverride"] as boolean | undefined) === true ||
    // default: assume verified for row products unless flagged otherwise
    !("compatibility" in vehicle);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid items-center border-b border-[#141414] transition-colors"
      style={{
        gridTemplateColumns: `48px ${gridTemplate}`,
        padding: "14px 24px",
        background: hover
          ? "linear-gradient(90deg, rgba(234,85,4,0.08), transparent 70%)"
          : "transparent",
        borderLeft: `2px solid ${hover ? "#EA5504" : "transparent"}`,
      }}
    >
      {/* Index */}
      <div
        className="font-brand text-[12px] font-black tracking-[1px] transition-colors"
        style={{ color: hover ? "#EA5504" : "#333" }}
      >
        {String(idx + 1).padStart(3, "0")}
      </div>

      {columns.map((col) => {
        const val = col.key === "__status" ? undefined : data[col.key];
        const align = col.align === "right" ? "text-right" : "text-left";

        if (col.type === "status") {
          return (
            <div key={col.key} className={align}>
              <StatusBadge verified={verifiedFlag} tLabels={t} />
            </div>
          );
        }
        if (col.type === "chassis") {
          return (
            <div key={col.key}>
              {val ? (
                <span
                  className="font-brand text-[12px] font-black tracking-[0.5px] text-orange"
                  style={{
                    padding: "3px 9px",
                    background: "rgba(234,85,4,0.1)",
                    border: "1px solid rgba(234,85,4,0.35)",
                  }}
                >
                  {String(val)}
                </span>
              ) : (
                <span className="text-text3">—</span>
              )}
            </div>
          );
        }
        if (col.type === "harness") {
          return (
            <div key={col.key} className="font-mono text-[11px] text-text3">
              {val ? String(val) : <span className="text-text3">—</span>}
            </div>
          );
        }
        if (col.type === "stock") {
          return (
            <div key={col.key} className={align}>
              {val ? (
                <span className="font-brand text-[10px] font-black tracking-[1.5px] text-green inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-green"
                    style={{ boxShadow: "0 0 8px #4ADE80" }}
                  />
                  {t("inStock").toUpperCase()}
                </span>
              ) : (
                <span className="font-brand text-[10px] font-black tracking-[1.5px] text-text3">
                  {t("orderAvailable").toUpperCase()}
                </span>
              )}
            </div>
          );
        }

        // default text / mono
        const isModel = col.key === "model";
        return (
          <div
            key={col.key}
            className={`${align} ${col.mono ? "font-mono text-[12px] text-text2" : isModel ? "text-[15px] font-bold text-text" : "text-[13px] text-text2"}`}
          >
            {val ? String(val) : ""}
          </div>
        );
      })}
    </div>
  );
}

/* ─── FD-EVO / D-Meter card — preserved from upstream, re-skinned V4 ─── */

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
  const tested = features.filter((f) => data[f.key] === "O" || data[f.key] === "X");
  const supported = features.filter((f) => data[f.key] === "O");
  const isVerified = vehicle.compatibility === "☑️";

  return (
    <div className="border border-border bg-card p-4 transition-colors hover:border-[#2a2a2a]">
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        <span className="text-[14px] font-bold text-text">{vehicle.model}</span>
        {vehicle.year && (
          <span className="font-mono bg-bg3 px-1.5 py-0.5 text-[11px] text-text2">
            {vehicle.year}
          </span>
        )}
        {vehicle.engine && (
          <span className="font-mono bg-bg3 px-1.5 py-0.5 text-[11px] text-text2">
            {vehicle.engine}
          </span>
        )}
        {vehicle.fuel && (
          <span
            className="font-brand px-1.5 py-0.5 text-[10px] font-black tracking-[1px]"
            style={
              vehicle.fuel === "DIESEL"
                ? {
                    color: "#facc15",
                    background: "rgba(250,204,21,0.1)",
                    border: "1px solid rgba(250,204,21,0.4)",
                  }
                : {
                    color: "#EA5504",
                    background: "rgba(234,85,4,0.1)",
                    border: "1px solid rgba(234,85,4,0.4)",
                  }
            }
          >
            {vehicle.fuel}
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge verified={isVerified} tLabels={t} />
        {tested.length > 0 && (
          <span className="font-mono text-[11px] text-text3">
            {supported.length}/{tested.length}
          </span>
        )}
        {vehicle.version && (
          <span className="font-mono text-[11px] text-text3">{vehicle.version}</span>
        )}
      </div>

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
                  ? "font-brand bg-green-bg border border-green-border px-1.5 py-0.5 text-[10px] font-black tracking-[1px] text-green"
                  : "font-brand border border-border bg-bg3 px-1.5 py-0.5 text-[10px] font-black tracking-[1px] text-text3 line-through"
              }
            >
              {isOk ? "✓" : "✗"} {tTable(f.labelKey).toUpperCase()}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Brand section (accordion) ─── */

function BrandSection({
  brand,
  vehicles,
  open,
  onToggle,
  slug,
  columns,
  gridTemplate,
  features,
  isCardLayout,
  isStFilter,
  isZh,
  t,
  tTable,
}: {
  brand: string;
  vehicles: AnyVehicle[];
  open: boolean;
  onToggle: () => void;
  slug: string;
  columns: Column[];
  gridTemplate: string;
  features: Feature[] | null;
  isCardLayout: boolean;
  isStFilter: boolean;
  isZh: boolean;
  t: (k: string) => string;
  tTable: (k: string) => string;
}) {
  const verifiedCount = vehicles.filter((v) => {
    const pv = v as ProductVehicle;
    if ("compatibility" in v) return pv.compatibility === "☑️";
    const sf = v as STFilterVehicle;
    if (slug === "stfilter") return sf.inStock;
    return true;
  }).length;

  return (
    <div className="mb-5 border border-border bg-[#0c0c0c]">
      <button
        onClick={onToggle}
        className="grid w-full cursor-pointer items-center gap-6 border-0 bg-transparent px-7 py-5 text-left"
        style={{ gridTemplateColumns: "auto 1fr auto", borderBottom: open ? "1px solid #1a1a1a" : "none" }}
      >
        <div className="flex items-baseline gap-4">
          <span
            className="font-display text-[28px] md:text-[36px] font-black uppercase leading-none tracking-[-1px]"
            style={{ textWrap: "nowrap" }}
          >
            {brand}
          </span>
          <span className="font-brand text-[14px] font-black tracking-[0.5px] text-orange">
            [{String(vehicles.length).padStart(2, "0")}]
          </span>
        </div>
        <div
          className="h-px"
          style={{ background: "linear-gradient(90deg, #222, transparent)" }}
        />
        <div className="flex items-center gap-5">
          <span className="font-brand text-[11px] font-black tracking-[2px] text-green">
            ● {verifiedCount}/{vehicles.length} {t("verified").toUpperCase()}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EA5504"
            strokeWidth="2.5"
            className="transition-transform"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </button>

      {open &&
        (isStFilter ? (
          <div>
            {vehicles.map((v, i) => (
              <STFilterCard
                key={i}
                vehicle={v as STFilterVehicle}
                idx={i}
                tTable={tTable}
                t={t}
                isZh={isZh}
              />
            ))}
          </div>
        ) : isCardLayout && features ? (
          <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((v, i) => (
              <VehicleCard
                key={i}
                vehicle={v as ProductVehicle}
                features={features}
                tTable={tTable}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div style={{ minWidth: 900 }}>
              {/* Column header row */}
              <div
                className="grid border-b border-border bg-[#070707]"
                style={{
                  gridTemplateColumns: `48px ${gridTemplate}`,
                  padding: "10px 24px",
                }}
              >
                <div className="font-brand text-[10px] font-black tracking-[2px] text-text3">#</div>
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`font-brand text-[10px] font-black tracking-[2px] text-text3 ${col.align === "right" ? "text-right" : ""}`}
                  >
                    {tTable(col.labelKey).toUpperCase()}
                  </div>
                ))}
              </div>

              {vehicles.map((v, i) => (
                <VehicleRow
                  key={i}
                  vehicle={v}
                  idx={i}
                  columns={columns}
                  gridTemplate={gridTemplate}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

/* ─── Main client component ─── */

interface CompatibilityClientProps {
  groupedData: Record<string, AnyVehicle[]>;
  slug: string;
  loadingMore?: boolean;
}

export function CompatibilityClient({
  groupedData,
  slug,
  loadingMore = false,
}: CompatibilityClientProps) {
  const t = useTranslations("product");
  const tTable = useTranslations("table");
  const locale = useLocale();
  const isZh = locale.startsWith("zh");

  const { query, setQuery, displayData, totalVisible } = useCompatibility({
    groupedData,
    // STFilter-only fields (oemNumber / swCode / knNumber) are safe to include
    // across all products — missing fields on other products simply don't match.
    searchFields: [
      "brand",
      "model",
      "chassis",
      "year",
      "engine",
      "oemNumber",
      "swCode",
      "knNumber",
    ],
  });

  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(
    () => new Set(Object.keys(groupedData)),
  );

  // Auto-expand newly-arriving brands from progressive loading
  const dataBrandsKey = Object.keys(groupedData).sort().join("|");
  useMemo(() => {
    setExpandedBrands((prev) => {
      const keys = Object.keys(groupedData);
      if (keys.every((k) => prev.has(k))) return prev;
      const next = new Set(prev);
      for (const k of keys) next.add(k);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataBrandsKey]);

  const allDisplayBrands = useMemo(() => Object.keys(displayData), [displayData]);
  // brand filter applied on top of search
  const filteredBrands = useMemo(
    () => (activeBrand ? allDisplayBrands.filter((b) => b === activeBrand) : allDisplayBrands),
    [allDisplayBrands, activeBrand],
  );
  const allExpanded = filteredBrands.length > 0 && filteredBrands.every((b) => expandedBrands.has(b));

  // total shown after brand filter
  const shownCount = filteredBrands.reduce((acc, b) => acc + (displayData[b]?.length ?? 0), 0);

  function toggleBrand(brand: string) {
    setExpandedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) next.delete(brand);
      else next.add(brand);
      return next;
    });
  }
  function toggleAll() {
    setExpandedBrands(allExpanded ? new Set() : new Set(filteredBrands));
  }

  const isStFilter = slug === "stfilter";
  const isCardLayout = slug in CARD_PRODUCTS;
  const features = CARD_PRODUCTS[slug] ?? null;
  const columns = TABLE_COLUMNS[slug] ?? TABLE_COLUMNS["4s"];
  const gridTemplate = columns.map((c) => c.width ?? "1fr").join(" ");

  return (
    <div>
      {/* Sticky toolbar — search + expand + brand chips + result counter */}
      <div
        className="sticky z-30 border-b border-border"
        style={{
          top: 64,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="mx-auto max-w-[1440px] px-6 py-4 md:px-12">
          {/* Row 1 — search + expand */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[260px] flex-1">
              <SearchBar value={query} onChange={setQuery} />
            </div>
            <button
              onClick={toggleAll}
              className="font-brand cursor-pointer border border-orange bg-transparent px-5 py-3 text-[11px] font-black tracking-[2.5px] text-orange transition-colors hover:bg-orange hover:text-white"
            >
              {(allExpanded ? tTable("collapseAll") : tTable("expandAll")).toUpperCase()}
            </button>
          </div>

          {/* Row 2 — brand filter + result counter */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <BrandFilter
              brands={allDisplayBrands}
              activeBrand={activeBrand}
              onSelect={setActiveBrand}
            />
            <span className="ml-auto inline-flex items-center gap-3">
              {loadingMore && (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-orange">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-orange" />
                  <span className={isZh ? "zh" : ""}>{t("loadingMore")}</span>
                </span>
              )}
              <span className="font-brand text-[11px] font-black tracking-[2px] text-orange">
                {String(shownCount).padStart(3, "0")}{" "}
                <span className={isZh ? "zh" : ""}>
                  {t("vehicles").toUpperCase()}
                </span>
                <span className="mx-2 text-text3">·</span>
                {filteredBrands.length}{" "}
                <span className={isZh ? "zh" : ""}>
                  {t("brands").toUpperCase()}
                </span>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Brand sections */}
      <div className="mx-auto max-w-[1440px] px-6 pt-9 pb-24 md:px-12">
        {filteredBrands.length === 0 ? (
          <div className="py-20 text-center text-text3">
            <span className={isZh ? "zh" : ""}>{t("noResults")}</span>
          </div>
        ) : (
          filteredBrands.map((brand) => (
            <BrandSection
              key={brand}
              brand={brand}
              vehicles={displayData[brand] ?? []}
              open={expandedBrands.has(brand)}
              onToggle={() => toggleBrand(brand)}
              slug={slug}
              columns={columns}
              gridTemplate={gridTemplate}
              features={features}
              isCardLayout={isCardLayout}
              isStFilter={isStFilter}
              isZh={isZh}
              t={t}
              tTable={tTable}
            />
          ))
        )}
        <span className="sr-only">{totalVisible}</span>
      </div>
    </div>
  );
}
