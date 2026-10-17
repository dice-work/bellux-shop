"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { shop } from "@/lib/shop";
import { Sparkle } from "../ui/Sparkle";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mx-auto mt-16 max-w-6xl px-5">
      <div className="flex flex-col justify-between gap-8 border-t border-white/8 pt-10 sm:flex-row">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold tracking-[0.22em]">
            <Sparkle className="h-4 w-4" />
            {shop.name}
          </p>
          <p className="mt-3 max-w-xs text-sm text-mute">{t.footer.about}</p>
        </div>
        <div className="flex gap-12 text-sm">
          <ul className="space-y-2 text-mute">
            <li><a href="#how" className="hover:text-fg">{t.nav.how}</a></li>
            <li><a href="#collection" className="hover:text-fg">{t.nav.collection}</a></li>
            <li><a href="#order" className="hover:text-fg">{t.nav.order}</a></li>
          </ul>
          <ul className="space-y-2 text-mute">
            <li><a href={shop.lineUrl} target="_blank" rel="noreferrer" className="hover:text-fg">LINE</a></li>
            <li><a href={shop.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-fg">Instagram</a></li>
          </ul>
        </div>
      </div>
      <p
        aria-hidden
        className="mt-10 -mb-[0.2em] bg-linear-to-b from-white/60 via-white/20 to-transparent bg-clip-text text-center text-[19vw] leading-none font-semibold tracking-tighter text-transparent select-none lg:text-[12.5rem]"
      >
        {shop.name}
      </p>
    </footer>
  );
}
