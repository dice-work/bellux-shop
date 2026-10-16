"use client";

import { shop } from "@/lib/shop";
import { useShop } from "@/lib/store";
import { Sparkle } from "./Sparkle";

const links = [
  { href: "#how", label: "วิธีเลือกซื้อ" },
  { href: "#collection", label: "คอลเลกชัน" },
  { href: "#order", label: "สั่งซื้อ" },
];

export function Header() {
  const select = useShop((state) => state.select);
  const setCartOpen = useShop((state) => state.setCartOpen);
  const count = useShop((state) => state.items.reduce((sum, item) => sum + item.qty, 0));

  return (
    <header className="fixed inset-x-0 top-0 z-20 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pr-2 pl-5">
        <a
          href="#showroom"
          onClick={() => select(null)}
          className="flex items-center gap-2 text-sm font-semibold tracking-[0.22em]"
        >
          <Sparkle className="h-4 w-4" />
          {shop.name}
        </a>
        <nav aria-label="เมนูหลัก" className="hidden items-center gap-7 text-sm text-mute md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-fg">
              {link.label}
            </a>
          ))}
        </nav>
        <button type="button" onClick={() => setCartOpen(true)} className="btn-primary py-2! pr-2! pl-4!">
          ตะกร้า
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-night px-1.5 text-xs text-fg">
            {count}
          </span>
        </button>
      </div>
    </header>
  );
}
