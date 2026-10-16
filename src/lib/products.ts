// ทรงกางเกงของโมเดลชั่วคราว (หน่วยเป็นเมตร) — ใช้เมื่อสินค้ายังไม่มีไฟล์ .glb
export type Fit = {
  thigh: number;
  knee: number;
  hem: number;
  length: number;
  cuff?: boolean;
};

export type Product = {
  id: string;
  name: string;
  fitLabel: string;
  price: number;
  color: string;
  stitch: string;
  description: string;
  details: string[];
  fit: Fit;
  // ใส่ path ของไฟล์ใน public/ เช่น "/models/classic-straight.glb" เพื่อใช้โมเดลจริงแทนตัวชั่วคราว
  model?: string;
  // ภาพสินค้า 2D สำหรับการ์ด (path ใน public/) ถ้าไม่มีจะวาดภาพทรงกางเกงแทน
  // background คือสีพื้นของภาพ ใช้เป็นพื้นการ์ดให้กลืนเป็นแผ่นเดียว
  image?: { src: string; width: number; height: number; alt: string; background: string };
  // ทรงเดียวกันหลายสี: ใส่ style เดียวกัน และตั้งชื่อสีใน colorName
  style?: string;
  colorName?: string;
};

export const sizes = ["24", "25", "26", "27", "28", "29", "30", "32"];

export const products: Product[] = [
  {
    id: "low-rise-stacked",
    name: "Low-Rise Stacked",
    fitLabel: "เอวต่ำ ขาย่นบาน",
    price: 2490,
    color: "#2b2b2e",
    stitch: "#6f6f74",
    description:
      "เอวต่ำ ขาจับย่นเป็นชั้นตั้งแต่เข่าลงไป สายหัวเข็มขัดด้านข้าง และลูกไม้ดอกไม้ใต้กระเป๋าหลังขาด",
    details: ["สีดำฟอก", "เอวต่ำ ขาจับย่น (stacked)", "สายหัวเข็มขัดด้านข้าง 2 ข้าง", "ลูกไม้ดอกไม้ที่กระเป๋าหลัง"],
    fit: { thigh: 0.112, knee: 0.11, hem: 0.15, length: 1.06 },
    model: "/models/low-rise-stacked-jeans.glb",
    image: {
      src: "/products/low-rise-stacked.webp",
      width: 1132,
      height: 1390,
      alt: "กางเกงยีนส์ Low-Rise Stacked สีดำฟอก ด้านหน้าและด้านหลัง",
      background: "#f0eeec",
    },
  },
  {
    id: "belleux-greige",
    style: "belleux",
    name: "Bellux Double Waist",
    colorName: "Greige Wash",
    fitLabel: "เอวสูงสองชั้น ขากว้าง",
    price: 2690,
    color: "#8a7d68",
    stitch: "#5a5246",
    description:
      "ขอบเอวซ้อนสองชั้นติดกระดุมคู่ ขากว้างทิ้งตัว ซิปยาวกลางด้านหลัง และโลโก้แบรนด์ปั๊มนูนบนกระเป๋าหลัง",
    details: ["ฟอกลายหินอ่อนสีเทาเบจ", "ขอบเอวสองชั้น กระดุมคู่", "ซิปโลหะกลางด้านหลัง", "โลโก้ปั๊มนูนที่กระเป๋าหลัง"],
    fit: { thigh: 0.125, knee: 0.13, hem: 0.15, length: 1 },
    model: "/models/belleux-greige.glb",
    image: {
      src: "/products/belleux-greige.webp",
      width: 1312,
      height: 1199,
      alt: "กางเกงยีนส์ Bellux Double Waist สี Greige Wash ด้านหน้าและด้านหลัง",
      background: "#f6f5f2",
    },
  },
  {
    id: "belleux-black-gray",
    style: "belleux",
    name: "Bellux Double Waist",
    colorName: "Black Gray",
    fitLabel: "เอวสูงสองชั้น ขากว้าง",
    price: 2690,
    color: "#3a3a3c",
    stitch: "#6f6f74",
    description:
      "ขอบเอวซ้อนสองชั้นติดกระดุมคู่ ขากว้างทิ้งตัว ซิปยาวกลางด้านหลัง และโลโก้แบรนด์ปั๊มนูนบนกระเป๋าหลัง",
    details: ["ฟอกสีดำไล่เทา", "ขอบเอวสองชั้น กระดุมคู่", "ซิปโลหะกลางด้านหลัง", "โลโก้ปั๊มนูนที่กระเป๋าหลัง"],
    fit: { thigh: 0.125, knee: 0.13, hem: 0.15, length: 1 },
    model: "/models/belleux-black-gray.glb",
    image: {
      src: "/products/belleux-black-gray.webp",
      width: 1312,
      height: 1199,
      alt: "กางเกงยีนส์ Bellux Double Waist สี Black Gray ด้านหน้าและด้านหลัง",
      background: "#fcfcf9",
    },
  },
];

export const displayName = (product: Product) =>
  product.colorName ? `${product.name} (${product.colorName})` : product.name;

// สินค้าทุกสีของทรงเดียวกัน (สินค้าที่ไม่มี style ถือเป็นทรงเดี่ยว)
export const colorways = (product: Product) =>
  product.style ? products.filter((p) => p.style === product.style) : [product];

// รวมสินค้าเป็นกลุ่มตามทรง เรียงตามลำดับที่ปรากฏครั้งแรก
export const productStyles = () => {
  const seen = new Set<string>();
  return products.filter((p) => {
    const key = p.style ?? p.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(colorways);
};
