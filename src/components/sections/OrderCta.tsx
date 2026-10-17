"use client";

import { shop } from "@/lib/shop";
import { useI18n } from "@/i18n/I18nProvider";
import { useShop } from "@/lib/store";
import { Reveal } from "../ui/Reveal";
import { Sparkle } from "../ui/Sparkle";

export function OrderCta() {
  const setCartOpen = useShop((state) => state.setCartOpen);
  const { t } = useI18n();
  return (
    <section id="order" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16">
      <Reveal className="glass relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-16">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative">
          <span className="badge">
            <Sparkle className="h-3 w-3 text-fg" />
            {t.orderCta.badge}
          </span>
          <h2 className="text-chrome mx-auto mt-5 max-w-xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            {t.orderCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">
            {t.orderCta.text}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setCartOpen(true)} className="btn-primary">
              {t.orderCta.openCart}
            </button>
            <a href={shop.lineUrl} target="_blank" rel="noreferrer" className="btn-ghost">
              LINE
            </a>
            <a href={shop.instagramUrl} target="_blank" rel="noreferrer" className="btn-ghost">
              Instagram
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
