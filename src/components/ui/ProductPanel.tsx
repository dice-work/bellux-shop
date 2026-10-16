"use client";

import { useState } from "react";
import { colorways, products, sizes, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/shop";
import { useShop } from "@/lib/store";

function PanelBody({ product, index }: { product: Product; index: number }) {
  const [size, setSize] = useState<string | null>(null);
  const select = useShop((state) => state.select);
  const addItem = useShop((state) => state.addItem);
  const colors = colorways(product);
  const step = (offset: number) =>
    select(products[(index + offset + products.length) % products.length].id);
  const iconButton = "grid h-9 w-9 place-items-center rounded-full border border-white/10 text-mute transition hover:border-white/30 hover:text-fg";

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="badge">
          {String(index + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-1.5">
          <button type="button" aria-label="ตัวก่อนหน้า" onClick={() => step(-1)} className={iconButton}>
            ←
          </button>
          <button type="button" aria-label="ตัวถัดไป" onClick={() => step(1)} className={iconButton}>
            →
          </button>
          <button type="button" aria-label="กลับไปดูทั้งโชว์รูม" onClick={() => select(null)} className={iconButton}>
            ✕
          </button>
        </div>
      </div>

      <h2 className="text-chrome mt-4 text-3xl font-semibold tracking-tight sm:mt-7 sm:text-4xl">{product.name}</h2>
      <p className="mt-1.5 text-sm text-mute">{product.fitLabel}</p>
      {colors.length > 1 && (
        <fieldset className="mt-4 sm:mt-5">
          <legend className="text-xs text-mute">
            สี: <span className="text-fg">{product.colorName}</span>
          </legend>
          <div className="mt-2.5 flex gap-2.5">
            {colors.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-label={option.colorName}
                aria-pressed={option.id === product.id}
                onClick={() => select(option.id)}
                className={`h-9 w-9 rounded-full ring-1 ring-white/15 transition ${
                  option.id === product.id ? "ring-2 ring-white ring-offset-2 ring-offset-ash" : "hover:ring-white/45"
                }`}
                style={{ background: option.color }}
              />
            ))}
          </div>
        </fieldset>
      )}
      <p className="mt-3 text-xl sm:mt-5">{formatPrice(product.price)}</p>

      <p className="mt-4 text-sm leading-relaxed text-fg/75 sm:mt-6">{product.description}</p>
      <ul className="mt-4 hidden space-y-1.5 border-t border-white/8 pt-4 text-sm text-mute tall:block">
        {product.details.map((detail) => (
          <li key={detail} className="flex gap-2">
            <span aria-hidden className="text-fg/40">—</span>
            {detail}
          </li>
        ))}
      </ul>

      <fieldset className="mt-5 sm:mt-7">
        <legend className="text-xs text-mute">ไซซ์เอว (นิ้ว)</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={size === option}
              onClick={() => {
                setSize(option);
              }}
              className={`h-10 w-10 rounded-full text-sm transition ${
                size === option
                  ? "bg-white text-night shadow-[0_0_24px_-4px_rgba(255,255,255,0.5)]"
                  : "border border-white/12 text-mute hover:border-white/35 hover:text-fg"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        disabled={!size}
        onClick={() => {
          if (!size) return;
          addItem(product.id, size);
        }}
        className="btn-primary mt-6 w-full py-3!"
      >
        {size ? "เพิ่มลงตะกร้า" : "เลือกไซซ์ก่อน"}
      </button>
      <p className="mt-3 text-center text-xs text-mute">ลากบนฉากเพื่อหมุนดูรอบตัว</p>
    </>
  );
}

export function ProductPanel() {
  const selectedId = useShop((state) => state.selectedId);
  const index = products.findIndex((product) => product.id === selectedId);
  const product = products[index];

  return (
    <aside
      aria-label="รายละเอียดสินค้า"
      className={`glass absolute inset-x-0 bottom-0 z-10 max-h-[52dvh] overflow-y-auto rounded-t-3xl bg-ash/70! p-5 pb-6 transition duration-500 sm:inset-x-auto sm:top-24 sm:right-6 sm:bottom-6 sm:max-h-none sm:w-[390px] sm:rounded-3xl sm:p-7 ${
        product ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {product && <PanelBody key={product.style ?? product.id} product={product} index={index} />}
    </aside>
  );
}
