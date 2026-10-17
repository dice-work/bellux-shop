"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { shop } from "@/lib/shop";
import { useShop } from "@/lib/store";
import { Sparkle } from "./Sparkle";

export function Header() {
  const select = useShop((state) => state.select);
  const setCartOpen = useShop((state) => state.setCartOpen);
  const count = useShop((state) => state.items.reduce((sum, item) => sum + item.qty, 0));
  const { t, locale } = useI18n();
  const other = locale === "th" ? "en" : "th";
  const links = [
    { href: "#how", label: t.nav.how },
    { href: "#collection", label: t.nav.collection },
    { href: "#order", label: t.nav.order },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-20 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full bg-black/55! py-2 pr-2 pl-5">
        <a
          href="#showroom"
          onClick={() => select(null)}
          className="flex items-center gap-2 text-sm font-semibold tracking-[0.22em]"
        >
          <Sparkle className="h-4 w-4" />
          {shop.name}
        </a>
        <nav aria-label={t.nav.main} className="hidden items-center gap-7 text-sm text-mute md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-fg">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {/* ตะกร้าเก็บใน localStorage จึงยังอยู่ครบหลังสลับภาษา */}
          <Link
            href={`/${other}`}
            hrefLang={other}
            aria-label={t.nav.switchLanguage}
            className="grid h-9 min-w-9 place-items-center rounded-full border border-white/15 px-2.5 text-xs font-medium tracking-wide text-mute transition hover:border-white/35 hover:text-fg"
          >
            {other.toUpperCase()}
          </Link>
          <button type="button" onClick={() => setCartOpen(true)} className="btn-primary py-2! pr-2! pl-4!">
            {t.nav.cart}
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-night px-1.5 text-xs text-fg">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
