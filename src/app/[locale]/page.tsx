import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { StoryBanner } from "@/components/home/StoryBanner";
import { HomeContent } from "@/components/home/HomeContent";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: `Shadow Performance — ${t("titleAccent")} ${t("titleEnd")}`,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
      <StoryBanner />
    </main>
  );
}
