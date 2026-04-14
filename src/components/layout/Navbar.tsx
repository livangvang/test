"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  // Build switch URL: replace locale segment
  const switchLocale = locale === "en" ? "zh-TW" : "en";
  const switchPath = pathname.replace(`/${locale}`, `/${switchLocale}`);

  return (
    <nav className="fixed top-1 left-0 right-0 z-999 flex h-15 items-center justify-between border-b border-border bg-bg/85 px-6 backdrop-blur-[20px] md:px-10">
      {/* Logo */}
      <Link href={`/${locale}`}>
        <img
          className="h-7 opacity-90"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAAAfCAMAAAB6fxkFAAAAaVBMVEUAAAD////pVQT////pVQT////pVQT////pVQT////pVQT////pVQT////pVQT////pVQT////pVQT////pVQT////pVQT////pVQT////98uz3vp7pVQT////pVQT////pVQT////pVQShvh4sAAAAIXRSTlMAEBAgIDAwQEBQUGBgcHCAgI+Pn5+vr7+/z8/Pz9/f7+/AFcCyAAADo0lEQVR42tWX23ajMAxFZUhirrUJEMMMwZj//8hZONgSxc2kTV/YT6IrJdblHCvgyJpOnmAl5hyOSjMvFDZmyhijUzgkcn5gu9IbC4cjMs4PJADk5oGCIzKvXAFAmBU4IhP25DcyuSQRvEeqlGpjGwoMXxO8JXl3upJCdqN90VvEZuG8hGcbvpxJNMwLDRDF58/LLm/djnF2wA85c1G6ampYKJfwDi8TNePcFeBceKF+9vHbvGPMCh/fvt8FXgpla9gvCbVKqRQAwx9yzvXzjg7zSpZ46J8/vv2NxlPBb2Jl38JXFFj7gJl/XyaozrfuseLWXU8YN/YUTC99rt1beaUqDp5buPanwMg1EbwEMysafkpH9pQB45zKvraxIKa9cgHKxxxgAOBiRw4LsfAos9ICxGWtNgh8bgEEPsRo2SBddZMkuZGdpTQPSs65+NT3i684ILRV1yRJGpw01psdPQNWmwAlCPMMDmeND96yWxxtgkQrRohwZKDy8nOrOqIZxj0CT+y+Qqecp8YRV4YU8R7IBPDD1tPswhvDHKADABNA4UDuabBVE12A5sheEw7fB5FjgYh33WMfQfAYfG2CH3hus7Z1RMj2dX+SyRwEPqijJUQnZehlvHVRTlekqnRRDVh9AqeWLdaT9mRPkUmSDcRDK1cwIUTrvvJZT8ato0ksi/t3rZTq0aK0C2M6zOkmwconSDNRNBPh9BINXhpwdXOC3lXj/oL3y2UITldYJpmgVx6OFM4T9WBDIjoZnDgCxkZArP0pIzlMt8xGy1GmrgBw7+hLeCB604vNsuvwjlF8JZM7NZrWHyicoOIu6gEFQTso6OBX9oWawRa5it3tbYrBf4nwxBuZZF4mKE8AICOlqP/UPsEKT0w7iBMlSoMoJ/cN2WSvEgvXL64NeOKtTK5eJtSicDDuLJzguQ93EDOptEGs7nqgRA1KhFXay4LV2mjBIAw9MZUJXTGx3BuLSoMerJmPth3ErumAm1EGsvkp7Drr/cyGGZ02TkQmdOjkn6BFlaWLBLWoPqWOTx+EIWwequBy25DhrEkNc0Aiud8LpgwCMrH8NUF6bULo3uywghVbdSCaBTemkahPkxq24DlN+6vkGuHFNGf0NhkTEHez457DuTV7araM8xaVf/oBo3lskBQQ4v4TlRkZVAVHQZLJKImhtziLB+E0oeKZxralqNajcLH3e2Hjs0aRW6HpHA5ElMkiWmOWi9J1IRaiPERH/gF7RzMLqhMdhgAAAABJRU5ErkJggg=="
          alt="Shadow Performance"
        />
      </Link>

      {/* Nav Links */}
      <div className="hidden items-center gap-6 md:flex">
        <a
          href="https://www.shadowmotor.com.tw"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium tracking-wide text-text2 transition-colors hover:text-orange"
        >
          {t("officialSite")}
        </a>
        <a
          href="https://vehicle.shadolink.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium tracking-wide text-text2 transition-colors hover:text-orange"
        >
          {t("products")}
        </a>
      </div>

      {/* Language Switch */}
      <div className="flex items-center gap-1.5">
        <Link
          href={locale === "zh-TW" ? pathname : switchPath}
          className={`rounded px-1.5 py-0.5 text-[13px] font-medium tracking-wide transition-colors ${
            locale === "zh-TW"
              ? "font-bold text-orange"
              : "text-text3 hover:text-text"
          }`}
        >
          中文
        </Link>
        <span className="text-xs text-text3">|</span>
        <Link
          href={locale === "en" ? pathname : switchPath}
          className={`rounded px-1.5 py-0.5 text-[13px] font-medium tracking-wide transition-colors ${
            locale === "en"
              ? "font-bold text-orange"
              : "text-text3 hover:text-text"
          }`}
        >
          EN
        </Link>
      </div>
    </nav>
  );
}
