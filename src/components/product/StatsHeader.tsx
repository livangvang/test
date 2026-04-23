"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PRODUCTS, type ProductStats } from "@/lib/types/product";

interface StatsHeaderProps {
  slug: string;
  stats: ProductStats;
}

/**
 * V4 spec-sheet header.
 * Left column: product index, huge Eurostar Extended wordmark, description, stat strip.
 * Right column: product image (or engineered SVG placeholder) inside a framed panel with
 * corner marks, grid backdrop, diagonal light sweep, and monospace spec overlay.
 */
export function StatsHeader({ slug, stats }: StatsHeaderProps) {
  const t = useTranslations("product");
  const tProducts = useTranslations(`products.${slug}`);
  const locale = useLocale();
  const isZh = locale.startsWith("zh");
  const product = PRODUCTS.find((p) => p.slug === slug);

  const productIndex = Math.max(
    1,
    PRODUCTS.findIndex((p) => p.slug === slug) + 1,
  );
  const total = PRODUCTS.length || 6;
  const indexLabel = `${String(productIndex).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  return (
    <section className="relative mt-16 border-b border-border bg-bg">
      <div className="mx-auto max-w-[1440px] px-6 pt-10 pb-8 md:px-12 md:pt-14 md:pb-10">
        <Link
          href={`/${locale}`}
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-text3 no-underline transition-colors hover:text-orange"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          {t("backToHome")}
        </Link>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14 items-stretch">
          {/* ── Left: wordmark + copy + stats ───────────────────── */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Eyebrow — index + subtitle */}
              <div className="mb-5 flex flex-wrap items-center gap-3.5 font-brand text-[11px] font-black tracking-[3px] text-text3 uppercase">
                <span>
                  PRODUCT <span className="text-text2">·</span> {indexLabel}
                </span>
                <span className="inline-block h-px w-10 bg-border" />
                <span className={`text-orange ${isZh ? "zh" : ""}`}>
                  {tProducts("subtitle")}
                </span>
              </div>

              {/* Giant wordmark */}
              <h1
                className="font-display m-0 text-[56px] md:text-[88px] leading-[0.92] tracking-[-2px] uppercase"
                style={{ textWrap: "balance" }}
              >
                {renderProductWordmark(slug, tProducts("name"))}
              </h1>

              <p
                className={`mt-5 max-w-[520px] text-[14px] md:text-[15px] leading-[1.65] text-text2 ${isZh ? "zh" : ""}`}
              >
                {tProducts("description")}
              </p>
            </div>

            {/* Stat strip — hairline-divided cells */}
            <div className="mt-8 flex gap-px border border-border bg-border">
              <StatCell value={stats.vehicleCount.toLocaleString()} label={t("vehicles")} isZh={isZh} />
              <StatCell value={String(stats.brandCount)} label={t("brands")} isZh={isZh} />
            </div>
          </div>

          {/* ── Right: product panel ────────────────────────────── */}
          <ProductPanel slug={slug} image={product?.image} alt={tProducts("name")} />
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
 * Subcomponents
 * ──────────────────────────────────────────────────────────── */

function StatCell({ value, label, isZh }: { value: string; label: string; isZh: boolean }) {
  return (
    <div className="flex-1 min-w-[120px] bg-bg px-6 py-5 md:px-8 md:py-5">
      <div className="font-brand text-[36px] md:text-[40px] font-black leading-none tracking-[-1px] text-orange">
        {value}
      </div>
      <div
        className={`mt-2 font-brand text-[10px] font-black tracking-[2px] uppercase text-text3 ${isZh ? "zh" : ""}`}
      >
        {label}
      </div>
    </div>
  );
}

/**
 * Render the product name as a wordmark: for products with a numeric/letter
 * suffix (4S, EVO, 2PLUS, 2, etc.) we stack the suffix on its own line and
 * tint it orange — same vibe as the mockup's "E-DRIVE / 4S".
 */
function renderProductWordmark(slug: string, name: string) {
  // Only keep one-line layout when the name actually contains CJK characters.
  // If the product name is still in English (even on zh pages), use the
  // English two-line split so the visual stays consistent with /en.
  const hasCJK = /[㐀-鿿豈-﫿]/.test(name);
  if (hasCJK) {
    return <span className="zh">{name}</span>;
  }

  // Known split points per product slug
  const splits: Record<string, [string, string]> = {
    "4s": ["E-Drive", "4S"],
    fdevo: ["FD-", "EVO"],
    dmeter2plus: ["D-Meter", "2Plus"],
    iboost2: ["I-Boost", "2"],
    valve: ["Valve", "Controller"],
    stfilter: ["ST-", "Filter"],
  };
  const parts = splits[slug];
  if (!parts) return <>{name}</>;
  return (
    <>
      {parts[0]}
      <br />
      <span className="text-orange">{parts[1]}</span>
    </>
  );
}

function ProductPanel({
  slug,
  image,
  alt,
}: {
  slug: string;
  image?: string;
  alt: string;
}) {
  return (
    <div
      className="relative min-h-[360px] md:min-h-[440px] overflow-hidden border border-border"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, rgba(234,85,4,0.18), transparent 55%), linear-gradient(160deg, #141414 0%, #0A0A0A 60%, #050505 100%)",
      }}
    >
      {/* diagonal accent sweep */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: -60,
          right: -120,
          width: 400,
          height: 700,
          background:
            "linear-gradient(105deg, transparent 45%, rgba(234,85,4,0.08) 48%, rgba(234,85,4,0.18) 50%, rgba(234,85,4,0.08) 52%, transparent 55%)",
          transform: "rotate(8deg)",
        }}
      />
      {/* technical grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(234,85,4,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(234,85,4,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* orange corner marks */}
      <span className="absolute top-3 left-3 h-5 w-5 border-t border-l border-orange" />
      <span className="absolute top-3 right-3 h-5 w-5 border-t border-r border-orange" />
      <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-orange" />
      <span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-orange" />

      {/* Product image OR engineered SVG placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        {image ? (
          <div className="relative h-[72%] w-[72%]">
            <Image
              src={image}
              alt={alt}
              fill
              sizes="(max-width: 768px) 80vw, 45vw"
              className="object-contain"
              style={{ filter: "drop-shadow(0 30px 60px rgba(234,85,4,0.35))" }}
              priority
            />
          </div>
        ) : (
          <DeviceSVGPlaceholder slug={slug} />
        )}
      </div>

      {/* Spec overlay — bottom-left */}
      <div className="font-mono absolute left-5 bottom-5 text-[10px] tracking-[1.5px] leading-[1.7] text-text3">
        <div>
          MODEL <span className="ml-2 text-text">{modelCode(slug)}</span>
        </div>
        <div>
          CONNECT <span className="ml-2 text-text">OBD-II · PLUG &amp; PLAY</span>
        </div>
        <div>
          MODES <span className="ml-2 text-orange">ECO / NORMAL / SPORT / SPORT+</span>
        </div>
      </div>
      {/* Top-right caption */}
      <div className="font-brand absolute right-5 top-5 text-[10px] font-black tracking-[2.5px] text-orange">
        ◢ FIG. {String(Math.max(1, PRODUCTS.findIndex((p) => p.slug === slug) + 1)).padStart(2, "0")}
      </div>
    </div>
  );
}

function modelCode(slug: string): string {
  const codes: Record<string, string> = {
    "4s": "SH-4S-V4.2",
    fdevo: "SH-FDE-R3",
    dmeter2plus: "SH-DM2P",
    iboost2: "SH-IB2",
    valve: "SH-EV2",
    stfilter: "SH-STF",
  };
  return codes[slug] ?? "SH-XX";
}

/** Engineered SVG fallback when product.image isn't set. Small controller render. */
function DeviceSVGPlaceholder({ slug }: { slug: string }) {
  const label = slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 10);
  return (
    <svg
      viewBox="0 0 400 260"
      xmlns="http://www.w3.org/2000/svg"
      className="h-[72%] w-[72%]"
      style={{ filter: "drop-shadow(0 30px 60px rgba(234,85,4,0.35))" }}
    >
      <defs>
        <linearGradient id="svp-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a2a" />
          <stop offset="1" stopColor="#0d0d0d" />
        </linearGradient>
        <linearGradient id="svp-bezel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EA5504" />
          <stop offset="1" stopColor="#B33E02" />
        </linearGradient>
      </defs>
      <rect x="40" y="60" width="320" height="150" rx="10" fill="url(#svp-body)" stroke="#3a3a3a" />
      <rect x="52" y="72" width="296" height="126" rx="6" fill="#050505" stroke="#1a1a1a" />
      <rect x="60" y="80" width="280" height="36" rx="3" fill="url(#svp-bezel)" opacity="0.9" />
      <text x="76" y="104" fill="#fff" fontFamily="Eurostar Extended, sans-serif" fontWeight="900" fontSize="18" letterSpacing="2">
        {label}
      </text>
      <text x="76" y="140" fill="#EA5504" fontFamily="monospace" fontSize="11" letterSpacing="3">
        MODE SPORT+
      </text>
      <circle cx="300" cy="150" r="28" fill="#0a0a0a" stroke="#EA5504" strokeWidth="2" />
      <circle cx="300" cy="150" r="20" fill="#141414" stroke="#2a2a2a" />
      <text x="288" y="155" fill="#EA5504" fontFamily="Eurostar, sans-serif" fontWeight="900" fontSize="14">
        ◉
      </text>
      <rect x="76" y="160" width="120" height="6" rx="3" fill="#1a1a1a" />
      <rect x="76" y="160" width="85" height="6" rx="3" fill="#EA5504" />
      <rect x="76" y="172" width="120" height="4" rx="2" fill="#1a1a1a" />
      <rect x="76" y="172" width="50" height="4" rx="2" fill="#4ADE80" />
      <rect x="60" y="206" width="280" height="4" fill="#0a0a0a" />
      <path
        d="M 200 210 Q 200 240 260 250"
        stroke="#1a1a1a"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="254" y="244" width="18" height="12" rx="2" fill="#2a2a2a" stroke="#EA5504" />
    </svg>
  );
}
