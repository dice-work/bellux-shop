"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { displayName, products } from "@/lib/products";
import { formatPrice, shop } from "@/lib/shop";
import { useShop } from "@/lib/store";
import { Collection } from "./sections/Collection";
import { HowItWorks } from "./sections/HowItWorks";
import { OrderCta } from "./sections/OrderCta";
import { SiteFooter } from "./sections/SiteFooter";
import { CartDrawer } from "./ui/CartDrawer";
import { CartToast } from "./ui/CartToast";
import { Header } from "./ui/Header";
import { ProductPanel } from "./ui/ProductPanel";

const Scene = dynamic(() => import("./scene/Scene"), { ssr: false });

export function Shop() {
  const selectedId = useShop((state) => state.selectedId);
  const select = useShop((state) => state.select);
  const browsing = selectedId === null;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void useShop.persist.rehydrate();
  }, []);

  return (
    <main className="relative overflow-x-clip">
      <Header />

      <section id="showroom" aria-label="โชว์รูม 3D" className="relative h-dvh min-h-[620px] overflow-clip">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <Scene onReady={() => setReady(true)} />
        </div>
        {!ready && (
          <p role="status" className="absolute inset-0 grid place-items-center text-xs text-mute">
            กำลังเปิดโชว์รูม
          </p>
        )}

        <div
          aria-hidden={!browsing}
          className={`pointer-events-none absolute inset-x-0 top-24 px-5 text-center transition duration-500 sm:top-28 ${
            browsing ? "opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          <span className="badge">
            <span className="rounded-full bg-white px-1.5 py-px text-[10px] font-semibold tracking-normal text-night">New</span>
            {shop.tagline}
          </span>
          <h1 className="text-chrome mx-auto mt-4 max-w-3xl text-[2rem] leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl">
            {/* ภาษาไทยไม่มีเว้นวรรคระหว่างคำ จึงแบ่งวลีเองเพื่อไม่ให้ตัดกลางคำ */}
            <span className="inline-block">เดินเลือกยีนส์ตัวโปรด</span>{" "}
            <span className="inline-block">ในโชว์รูม 3D</span>
          </h1>
          <p className="mt-3 text-sm text-mute">แตะกางเกงบนราวเพื่อหยิบมาหมุนดูรอบตัว</p>
        </div>

        <nav
          aria-label="เลือกสินค้าในโชว์รูม"
          className={`absolute inset-x-0 bottom-0 z-10 flex gap-2 overflow-x-auto px-5 pb-6 transition duration-500 sm:justify-center ${
            browsing ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              tabIndex={browsing ? 0 : -1}
              onClick={() => select(product.id)}
              className="glass flex shrink-0 items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5 text-left transition hover:border-white/25"
            >
              <span aria-hidden className="h-8 w-8 rounded-full ring-1 ring-white/15" style={{ background: product.color }} />
              <span className="text-sm leading-tight">
                {displayName(product)}
                <span className="block text-xs text-mute">{formatPrice(product.price)}</span>
              </span>
            </button>
          ))}
        </nav>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-night" />
        <ProductPanel />
      </section>

      <HowItWorks />
      <Collection />
      <OrderCta />
      <SiteFooter />

      <CartDrawer />
      <CartToast />
    </main>
  );
}
