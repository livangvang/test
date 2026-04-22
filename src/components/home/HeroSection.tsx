import { getTranslations } from "next-intl/server";
import type { SiteStats } from "@/lib/types/product";

interface HeroSectionProps {
  stats: SiteStats;
}

export async function HeroSection({ stats }: HeroSectionProps) {
  const t = await getTranslations("home");

  return (
    <section className="relative mt-16 overflow-hidden bg-gradient-to-br from-bg via-bg2 to-bg">
      <div className="mx-auto grid min-h-[520px] max-w-[1200px] grid-cols-1 md:grid-cols-2">
        {/* Text */}
        <div className="flex flex-col justify-center px-5 py-15 md:px-10 md:py-25">
          <div className="mb-5 text-[13px] font-bold tracking-[4px] uppercase text-orange">
            {t("eyebrow")}
          </div>
          <h1 className="mb-5 max-w-[700px] text-[42px] font-black leading-none tracking-tight md:text-[72px] md:tracking-[-3px]">
            {t("title")}
            <br />
            <span className="text-orange">{t("titleAccent")}</span>
            <br />
            {t("titleEnd")}
          </h1>
          <p className="mb-10 max-w-[550px] text-[15px] leading-relaxed text-text2 md:text-lg">
            {t("description")}
          </p>
          <div className="flex flex-wrap gap-6 md:gap-12">
            <div>
              <div className="text-4xl font-black leading-none tracking-tight text-orange md:text-[52px] md:tracking-[-2px]">
                {stats.totalVehicles.toLocaleString()}
              </div>
              <div className="mt-1 text-xs font-medium tracking-[2px] uppercase text-text3">
                {t("statVehicles")}
              </div>
            </div>
            <div>
              <div className="text-4xl font-black leading-none tracking-tight text-orange md:text-[52px] md:tracking-[-2px]">
                {stats.totalProducts}
              </div>
              <div className="mt-1 text-xs font-medium tracking-[2px] uppercase text-text3">
                {t("statProducts")}
              </div>
            </div>
            <div>
              <div className="text-4xl font-black leading-none tracking-tight text-orange md:text-[52px] md:tracking-[-2px]">
                {stats.totalBrands}
              </div>
              <div className="mt-1 text-xs font-medium tracking-[2px] uppercase text-text3">
                {t("statBrands")}
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-[280px] overflow-hidden md:h-auto">
          <img
            src="https://www.shadowmotor.com.tw/Templates/pic/Shadow%20PRO3%20racing%20gauge%20in%20HONDA%20FIT%20GE8%20(5).jpg"
            alt="Shadow PRO3 in Honda Fit GE8"
            className="h-full w-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg2 to-transparent to-40%" />
        </div>
      </div>
    </section>
  );
}
