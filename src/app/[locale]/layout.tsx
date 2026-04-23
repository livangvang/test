import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  eurostar,
  eurostarExtended,
  inter,
  jetbrainsMono,
  notoSansTC,
} from "@/lib/fonts";
import "@/app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const fontVars = [
    inter.variable,
    jetbrainsMono.variable,
    notoSansTC.variable,
    eurostar.variable,
    eurostarExtended.variable,
  ].join(" ");

  return (
    <html lang={locale} className={fontVars}>
      <body>
        <NextIntlClientProvider locale={locale}>
          <TopBar />
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
