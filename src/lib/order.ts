import type { Locale } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { displayName, products } from "./products";
import { formatPrice, shop } from "./shop";
import type { CartItem } from "./store";

export function cartLines(items: CartItem[]) {
  return items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? [{ ...item, product, subtotal: product.price * item.qty }] : [];
  });
}

// ข้อความสั่งซื้อใช้ภาษาเดียวกับหน้าเว็บที่ลูกค้าเปิดอยู่
export function buildOrderMessage(items: CartItem[], locale: Locale) {
  const t = dictionaries[locale].order;
  const lines = cartLines(items);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  return [
    t.greeting(shop.name),
    "",
    ...lines.map(
      (line, i) =>
        `${i + 1}. ${t.line(displayName(line.product, locale), line.size, line.qty, formatPrice(line.subtotal))}`,
    ),
    "",
    t.total(count, formatPrice(total)),
    "",
    t.name,
    t.address,
    t.phone,
  ].join("\n");
}
