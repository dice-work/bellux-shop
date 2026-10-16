"use client";

import { useEffect, useState } from "react";
import { buildOrderMessage, cartLines } from "@/lib/order";
import { formatPrice, shop } from "@/lib/shop";
import { useShop } from "@/lib/store";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // เบราว์เซอร์ในแอปบางตัว (เช่น LINE, IG) ไม่ให้ใช้ Clipboard API
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export function CartDrawer() {
  const open = useShop((state) => state.cartOpen);
  const items = useShop((state) => state.items);
  const setCartOpen = useShop((state) => state.setCartOpen);
  const setQty = useShop((state) => state.setQty);
  const clear = useShop((state) => state.clear);
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");

  const lines = cartLines(items);
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const message = buildOrderMessage(items);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setCartOpen]);

  return (
    <div className={`fixed inset-0 z-30 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <button
        type="button"
        aria-label="ปิดตะกร้า"
        onClick={() => setCartOpen(false)}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="ตะกร้าสินค้า"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/8 bg-ash shadow-2xl transition duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-chrome text-2xl font-semibold tracking-tight">Your Bag</h2>
          <button type="button" aria-label="ปิดตะกร้า" onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-mute hover:border-white/30 hover:text-fg">
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="px-6 py-10 text-sm text-mute">ตะกร้ายังว่างอยู่ ลองหยิบยีนส์จากราวมาดูสักตัว</p>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <ul className="divide-y divide-white/8 border-y border-white/8">
              {lines.map((line) => (
                <li key={`${line.productId}-${line.size}`} className="flex items-center gap-4 py-4">
                  <span className="h-12 w-9 shrink-0 rounded-md ring-1 ring-white/10" style={{ background: line.product.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{line.product.name}</p>
                    <p className="text-xs text-mute">
                      ไซซ์ {line.size} · {formatPrice(line.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center rounded-full border border-white/12 text-sm">
                    <button
                      type="button"
                      aria-label={`ลดจำนวน ${line.product.name}`}
                      onClick={() => setQty(line.productId, line.size, line.qty - 1)}
                      className="h-8 w-8 text-mute hover:text-fg"
                    >
                      −
                    </button>
                    <span className="w-5 text-center">{line.qty}</span>
                    <button
                      type="button"
                      aria-label={`เพิ่มจำนวน ${line.product.name}`}
                      onClick={() => setQty(line.productId, line.size, line.qty + 1)}
                      className="h-8 w-8 text-mute hover:text-fg"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-baseline justify-between py-4">
              <span className="text-sm text-mute">รวม (ยังไม่รวมค่าจัดส่ง)</span>
              <span className="text-xl">{formatPrice(total)}</span>
            </div>

            <h3 className="mt-2 text-xs text-mute">ข้อความสั่งซื้อ</h3>
            <pre className="mt-2 rounded-2xl border border-white/8 bg-black/50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-fg/80">
              {message}
            </pre>

            <button
              type="button"
              onClick={async () => setCopied((await copyText(message)) ? "done" : "failed")}
              className="btn-primary mt-4 w-full py-3!"
            >
              คัดลอกข้อความสั่งซื้อ
            </button>
            <p aria-live="polite" className="mt-2 min-h-5 text-center text-xs text-mute">
              {copied === "done" && "คัดลอกแล้ว เปิดแชตแล้ววางข้อความได้เลย"}
              {copied === "failed" && "คัดลอกอัตโนมัติไม่ได้ กดค้างที่ข้อความด้านบนเพื่อคัดลอก"}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={shop.lineUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                เปิด LINE
              </a>
              <a href={shop.instagramUrl} target="_blank" rel="noreferrer" className="btn-ghost">
                เปิด Instagram
              </a>
            </div>
            <button type="button" onClick={clear} className="mt-5 w-full text-xs text-mute underline underline-offset-4">
              ล้างตะกร้า
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
