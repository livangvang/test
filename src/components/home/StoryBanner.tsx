import { getTranslations } from "next-intl/server";

export async function StoryBanner() {
  const t = await getTranslations("story");

  return (
    <div className="grid min-h-[320px] grid-cols-1 border-y border-border bg-bg2 md:grid-cols-2">
      {/* Text */}
      <div className="flex flex-col justify-center px-5 py-10 md:px-12 md:py-15">
        <div className="mb-4 text-[11px] font-bold tracking-[3px] uppercase text-orange">
          {t("eyebrow")}
        </div>
        <div className="mb-4 text-[28px] font-black leading-tight tracking-tight md:text-4xl md:tracking-[-1px]">
          {t("title1")}
          <br />
          {t("title2")}
        </div>
        <div className="mb-6 max-w-[440px] text-[15px] leading-relaxed text-text2">
          {t("description")}
        </div>
        <a
          href="https://www.shadowmotor.com.tw"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-lg border-2 border-orange bg-transparent px-7 py-3 text-[13px] font-bold tracking-[1px] uppercase text-orange no-underline transition-all hover:bg-orange hover:text-white"
        >
          {t("cta")}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="m7 17 10-10M7 7h10v10" />
          </svg>
        </a>
      </div>

      {/* Image */}
      <div className="group relative h-[240px] overflow-hidden md:h-auto">
        <img
          src="https://www.shadowmotor.com.tw/Templates/pic/Shadow%20PRO3%20racing%20gauge%20in%20HONDA%20FIT%20GE8%20(2).jpg"
          alt="Shadow PRO3 in Honda Fit GE8"
          className="h-full w-full object-cover brightness-70 transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-bg2 to-100% via-transparent via-60%" />
      </div>
    </div>
  );
}
