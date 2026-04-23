"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

interface ProductSpecsProps {
  slug: string;
}

/**
 * HKS/TRD-style performance spec insert — big numbers, tech close-up, CTA.
 * Only rendered for products where we have validated data. Currently: stfilter.
 */
export function ProductSpecs({ slug }: ProductSpecsProps) {
  const locale = useLocale();
  const isZh = locale.startsWith("zh");
  const t = useTranslations("productSpecs");
  // Hooks must be called unconditionally: only ST-Filter has validated specs today.
  const tProduct = useTranslations(`productSpecs.stfilter`);

  if (slug !== "stfilter") return null;

  const specs = [
    { value: tProduct("spec1Value"), label: tProduct("spec1Label"), sub: tProduct("spec1Sub") },
    { value: tProduct("spec2Value"), label: tProduct("spec2Label"), sub: tProduct("spec2Sub") },
    { value: tProduct("spec3Value"), label: tProduct("spec3Label"), sub: tProduct("spec3Sub") },
    { value: tProduct("spec4Value"), label: tProduct("spec4Label"), sub: tProduct("spec4Sub") },
  ];

  const techBullets = [tProduct("tech1"), tProduct("tech2"), tProduct("tech3"), tProduct("tech4")];

  const mainSiteUrl = isZh
    ? "https://www.shadowmotor.com.tw/zh-TW/product/ST-Filter-High-Flow-Intake.html"
    : "https://www.shadowmotor.com.tw/zh-TW/product/ST-Filter-High-Flow-Intake.html";

  return (
    <section className="relative border-b border-border bg-bg">
      <div className="mx-auto max-w-[1440px] px-6 pt-14 pb-16 md:px-12 md:pt-20 md:pb-24">
        {/* ── Tagline block ─────────────────────────────────── */}
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3 font-brand text-[10px] font-black tracking-[4px] text-text3 uppercase">
            <span className="inline-block h-px w-10 bg-border" />
            <span>{tProduct("eyebrow")}</span>
            <span className="inline-block h-px w-10 bg-border" />
          </div>
          <h2
            className={`font-display text-[32px] md:text-[52px] leading-[1] tracking-[-1.5px] uppercase ${isZh ? "zh" : ""}`}
            style={{ textWrap: "balance" }}
          >
            <span className="text-orange">{tProduct("tagline")}</span>
          </h2>
        </div>

        {/* ── Stats grid — 4 cells, hairline dividers ──────── */}
        <div className="mb-6 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
          {specs.map((s, i) => (
            <div key={i} className="relative bg-bg px-5 py-8 md:px-8 md:py-10">
              <div className="font-brand text-[40px] md:text-[56px] font-black leading-none tracking-[-1.5px] text-orange">
                {s.value}
              </div>
              <div
                className={`mt-4 font-brand text-[11px] font-black tracking-[2px] uppercase text-text ${isZh ? "zh" : ""}`}
              >
                {s.label}
              </div>
              {s.sub && (
                <div className={`mt-1 text-[10px] tracking-[0.5px] text-text3 ${isZh ? "zh" : ""}`}>
                  {s.sub}
                </div>
              )}
              {/* hairline orange accent at top */}
              <span className="absolute top-0 left-0 h-px w-6 bg-orange" />
            </div>
          ))}
        </div>

        {/* ── Data source caption ──────────────────────────── */}
        <div className={`mb-20 text-center font-mono text-[10px] tracking-[1.5px] uppercase text-text3 ${isZh ? "zh" : ""}`}>
          {tProduct("dataSource")}
        </div>

        {/* ── Technology split: image | text ────────────────── */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1fr_1fr] md:gap-12">
          {/* Image panel */}
          <div
            className="relative min-h-[320px] overflow-hidden border border-border md:min-h-[440px]"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(234,85,4,0.14), transparent 55%), linear-gradient(160deg, #141414 0%, #0A0A0A 60%, #050505 100%)",
            }}
          >
            <Image
              src="https://www.shadowmotor.com.tw/Templates/pic/web%20for%20fiber.jpg"
              alt={tProduct("techTitle")}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {/* overlay darken + orange tint */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[rgba(0,0,0,0.35)]" />
            {/* corner marks */}
            <span className="absolute top-3 left-3 h-5 w-5 border-t border-l border-orange" />
            <span className="absolute top-3 right-3 h-5 w-5 border-t border-r border-orange" />
            <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-orange" />
            <span className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-orange" />
            {/* Top-right caption */}
            <div className="font-brand absolute right-5 top-5 text-[10px] font-black tracking-[2.5px] text-orange">
              ◢ FIBER.MACRO
            </div>
          </div>

          {/* Text + CTA */}
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex items-center gap-3 font-brand text-[11px] font-black tracking-[3px] text-orange uppercase">
              <span className="inline-block h-px w-8 bg-orange" />
              <span>{tProduct("techEyebrow")}</span>
            </div>
            <h3
              className={`mb-8 font-display text-[28px] md:text-[40px] leading-[1.05] font-black tracking-[-0.5px] uppercase ${isZh ? "zh" : ""}`}
              style={{ textWrap: "balance" }}
            >
              {tProduct("techTitle")}
            </h3>
            <ul className="mb-10 space-y-3.5">
              {techBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-[10px] inline-block h-px w-4 flex-shrink-0 bg-orange" />
                  <span className={`text-[14px] md:text-[15px] leading-[1.6] text-text2 ${isZh ? "zh" : ""}`}>
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href={mainSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2.5 border border-orange bg-transparent px-6 py-3 font-brand text-[11px] font-black tracking-[3px] uppercase text-orange no-underline transition-all hover:bg-orange hover:text-white"
            >
              <span className={isZh ? "zh" : ""}>{t("ctaLearnMore")}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m7 17 10-10M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
