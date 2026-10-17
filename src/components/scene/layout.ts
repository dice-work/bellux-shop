import { products } from "@/lib/products";

export const RACK_Y = 1.5;
export const WAIST_Y = 1.33;
export const FRONT_Z = 1.3;
// ตัวที่หยิบออกมาดูจะยกสูงขึ้นจากราวเล็กน้อย
export const SELECTED_LIFT = 0.08;
export const SPACING = 0.66;

export const rackX = (index: number) => (index - (products.length - 1) / 2) * SPACING;
