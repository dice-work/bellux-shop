"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { displayName, products, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/shop";
import { useShop, type CartToast as Toast } from "@/lib/store";
import { Sparkle } from "./Sparkle";

const VISIBLE_MS = 3200;

function ToastCard({ toast, product }: { toast: Toast; product: Product }) {
  const dismiss = useShop((state) => state.dismissToast);
  const setCartOpen = useShop((state) => state.setCartOpen);
  const [hovered, setHovered] = useState(false);
  const { t, locale } = useI18n();

  // ปิดเองหลังไม่กี่วินาที แต่หยุดนับระหว่างเอาเมาส์ชี้ เพื่อให้กด "ดูตะกร้า" ทัน
  useEffect(() => {
    if (hovered) return;
    const timer = setTimeout(dismiss, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [hovered, dismiss]);

  return (
    <div
      role="status"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl bg-ash/80! py-2.5 pr-2.5 pl-3 motion-safe:animate-[toast-in_320ms_cubic-bezier(.22,1,.36,1)]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-white/10" style={{ background: product.color }}>
        <Sparkle className="h-3.5 w-3.5 text-white/80" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{t.toast.added}</p>
        <p className="truncate text-xs text-mute">
          {displayName(product, locale)} · {t.cart.size(toast.size)} · {formatPrice(product.price)}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          dismiss();
          setCartOpen(true);
        }}
        className="btn-primary shrink-0 px-3.5! py-2! text-xs!"
      >
        {t.toast.view}
      </button>
      <button
        type="button"
        aria-label={t.toast.close}
        onClick={dismiss}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-mute hover:text-fg"
      >
        ✕
      </button>
    </div>
  );
}

export function CartToast() {
  const toast = useShop((state) => state.toast);
  const product = products.find((p) => p.id === toast?.productId);

  return (
    // มือถือแสดงใต้ header (แผงสินค้าอยู่ด้านล่าง) จอใหญ่แสดงมุมล่างซ้าย (แผงสินค้าอยู่ด้านขวา)
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-20 z-40 flex justify-center px-4 sm:top-auto sm:bottom-6 sm:justify-start sm:px-6"
    >
      {/* key ใหม่ทุกครั้งที่เพิ่มของ ทำให้ toast เล่นแอนิเมชันและนับเวลาใหม่ */}
      {toast && product && <ToastCard key={toast.key} toast={toast} product={product} />}
    </div>
  );
}
