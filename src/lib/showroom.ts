import { useShop } from "./store";

// เลื่อนกลับขึ้นโชว์รูมแล้วหยิบสินค้าตัวนั้นมาให้หมุนดู
export function showInShowroom(id: string) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("showroom")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  useShop.getState().select(id);
}
