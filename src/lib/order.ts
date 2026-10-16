import { displayName, products } from "./products";
import { formatPrice, shop } from "./shop";
import type { CartItem } from "./store";

export function cartLines(items: CartItem[]) {
  return items.flatMap((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? [{ ...item, product, subtotal: product.price * item.qty }] : [];
  });
}

export function buildOrderMessage(items: CartItem[]) {
  const lines = cartLines(items);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);

  return [
    `สวัสดีค่ะ ขอสั่งซื้อสินค้าจาก ${shop.name}`,
    "",
    ...lines.map(
      (line, i) =>
        `${i + 1}. ${displayName(line.product)} | ไซซ์ ${line.size} | ${line.qty} ตัว | ${formatPrice(line.subtotal)}`,
    ),
    "",
    `รวม ${count} ตัว: ${formatPrice(total)} (ยังไม่รวมค่าจัดส่ง)`,
    "",
    "ชื่อผู้รับ: ",
    "ที่อยู่จัดส่ง: ",
    "เบอร์โทร: ",
  ].join("\n");
}
