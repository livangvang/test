import localFont from "next/font/local";
import { Inter, JetBrains_Mono } from "next/font/google";

// Body / UI sans (Latin)
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

// Mono (for technical codes)
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Traditional Chinese — self-hosted to guarantee coverage for CJK glyphs
export const notoSansTC = localFont({
  src: [
    { path: "../../public/fonts/NotoSansHant-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/NotoSansHant-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/NotoSansHant-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/NotoSansHant-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-noto-tc",
  display: "block",
  fallback: ["system-ui", "PingFang TC", "Microsoft JhengHei", "sans-serif"],
});

// Brand display — Eurostar
export const eurostar = localFont({
  src: [
    { path: "../../public/fonts/eurostar.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Eurostar_black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-eurostar",
  display: "block",
  fallback: ["Arial Black", "Impact", "sans-serif"],
});

// Brand display — Eurostar Extended (for huge wordmarks)
export const eurostarExtended = localFont({
  src: "../../public/fonts/Eurostar_black_extended.ttf",
  weight: "900",
  variable: "--font-eurostar-ext",
  display: "block",
  fallback: ["Arial Black", "Impact", "sans-serif"],
});
