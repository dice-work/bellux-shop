import type { Locale, Localized } from "@/i18n/config";

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
  // ชื่อรุ่นเป็นภาษาอังกฤษ ใช้เหมือนกันทั้งสองภาษา
  name: string;
  fitLabel: Localized;
  price: number;
  color: string;
  stitch: string;
  description: Localized;
  details: Localized<string[]>;
  fit: Fit;
  // ใส่ path ของไฟล์ใน public/ เช่น "/models/classic-straight.glb" เพื่อใช้โมเดลจริงแทนตัวชั่วคราว
  model?: string;
  // ภาพสินค้า 2D สำหรับการ์ด (path ใน public/) ถ้าไม่มีจะวาดภาพทรงกางเกงแทน
  // background คือสีพื้นของภาพ ใช้เป็นพื้นการ์ดให้กลืนเป็นแผ่นเดียว
  image?: { src: string; width: number; height: number; alt: Localized; background: string };
  // ทรงเดียวกันหลายแบบ: ใส่ style เดียวกัน ตั้งชื่อแบบใน variantName
  // variantType บอกว่าต่างกันที่สี (แสดงเป็นจุดสี) หรือดีเทล (แสดงเป็นปุ่มข้อความ)
  style?: string;
  variantName?: Localized;
  variantType?: "color" | "detail";
};

export const sizes = ["24", "25", "26", "27", "28", "29", "30", "32"];

const belluxDescription: Localized = {
  th: "ขอบเอวซ้อนสองชั้นติดกระดุมคู่ ขากว้างทิ้งตัว ซิปยาวกลางด้านหลัง และโลโก้แบรนด์ปั๊มนูนบนกระเป๋าหลัง",
  en: "A stacked double waistband with twin buttons, wide relaxed legs, a full-length back zipper and the brand logo embossed on the back pockets.",
};

const bootcutFit: Localized = { th: "เอวต่ำ ขาม้า", en: "Low rise, bootcut" };

export const products: Product[] = [
  {
    id: "low-rise-stacked",
    name: "Low-Rise Stacked",
    fitLabel: { th: "เอวต่ำ ขาย่นบาน", en: "Low rise, stacked flare" },
    price: 2490,
    color: "#2b2b2e",
    stitch: "#6f6f74",
    description: {
      th: "เอวต่ำ ขาจับย่นเป็นชั้นตั้งแต่เข่าลงไป สายหัวเข็มขัดด้านข้าง และลูกไม้ดอกไม้ใต้กระเป๋าหลังขาด",
      en: "Low rise with legs ruched in stacked folds from the knee down, buckle straps at the sides and floral lace under distressed back pockets.",
    },
    details: {
      th: ["สีดำฟอก", "เอวต่ำ ขาจับย่น (stacked)", "สายหัวเข็มขัดด้านข้าง 2 ข้าง", "ลูกไม้ดอกไม้ที่กระเป๋าหลัง"],
      en: ["Washed black", "Low rise, stacked legs", "Buckle straps on both sides", "Floral lace at the back pockets"],
    },
    fit: { thigh: 0.112, knee: 0.11, hem: 0.15, length: 1.06 },
    model: "/models/low-rise-stacked-jeans.glb",
    image: {
      src: "/products/low-rise-stacked.webp",
      width: 1132,
      height: 1390,
      alt: {
        th: "กางเกงยีนส์ Low-Rise Stacked สีดำฟอก ด้านหน้าและด้านหลัง",
        en: "Low-Rise Stacked jeans in washed black, front and back",
      },
      background: "#f0eeec",
    },
  },
  {
    id: "belleux-greige",
    style: "belleux",
    name: "Bellux Double Waist",
    variantName: { th: "Greige Wash", en: "Greige Wash" },
    variantType: "color",
    fitLabel: { th: "เอวสูงสองชั้น ขากว้าง", en: "High double waist, wide leg" },
    price: 2690,
    color: "#8a7d68",
    stitch: "#5a5246",
    description: belluxDescription,
    details: {
      th: ["ฟอกลายหินอ่อนสีเทาเบจ", "ขอบเอวสองชั้น กระดุมคู่", "ซิปโลหะกลางด้านหลัง", "โลโก้ปั๊มนูนที่กระเป๋าหลัง"],
      en: ["Marbled greige wash", "Double waistband, twin buttons", "Metal zipper down the back", "Embossed logo on back pockets"],
    },
    fit: { thigh: 0.125, knee: 0.13, hem: 0.15, length: 1 },
    model: "/models/belleux-greige.glb",
    image: {
      src: "/products/belleux-greige.webp",
      width: 1312,
      height: 1199,
      alt: {
        th: "กางเกงยีนส์ Bellux Double Waist สี Greige Wash ด้านหน้าและด้านหลัง",
        en: "Bellux Double Waist jeans in Greige Wash, front and back",
      },
      background: "#f6f5f2",
    },
  },
  {
    id: "belleux-black-gray",
    style: "belleux",
    name: "Bellux Double Waist",
    variantName: { th: "Black Gray", en: "Black Gray" },
    variantType: "color",
    fitLabel: { th: "เอวสูงสองชั้น ขากว้าง", en: "High double waist, wide leg" },
    price: 2690,
    color: "#3a3a3c",
    stitch: "#6f6f74",
    description: belluxDescription,
    details: {
      th: ["ฟอกสีดำไล่เทา", "ขอบเอวสองชั้น กระดุมคู่", "ซิปโลหะกลางด้านหลัง", "โลโก้ปั๊มนูนที่กระเป๋าหลัง"],
      en: ["Black-to-gray fade wash", "Double waistband, twin buttons", "Metal zipper down the back", "Embossed logo on back pockets"],
    },
    fit: { thigh: 0.125, knee: 0.13, hem: 0.15, length: 1 },
    model: "/models/belleux-black-gray.glb",
    image: {
      src: "/products/belleux-black-gray.webp",
      width: 1312,
      height: 1199,
      alt: {
        th: "กางเกงยีนส์ Bellux Double Waist สี Black Gray ด้านหน้าและด้านหลัง",
        en: "Bellux Double Waist jeans in Black Gray, front and back",
      },
      background: "#fcfcf9",
    },
  },
  {
    id: "black-bootcut-plain",
    style: "black-bootcut",
    name: "Black Lace Bootcut",
    variantName: { th: "แบบเรียบ", en: "Plain" },
    variantType: "detail",
    fitLabel: bootcutFit,
    price: 2390,
    color: "#2a2a2c",
    stitch: "#6f6f74",
    description: {
      th: "เอวต่ำ ทรงขาม้าบานยาวคลุมรองเท้า สีดำฟอก และลูกไม้ดอกไม้ใต้กระเป๋าหลังขาด",
      en: "Low rise with a long bootcut flare that covers the shoe, washed black, with floral lace under distressed back pockets.",
    },
    details: {
      th: ["สีดำฟอก", "เอวต่ำ ขาม้าบาน", "ลูกไม้ดอกไม้ที่กระเป๋าหลัง", "ด้านข้างเรียบ ไม่แต่งหมุด"],
      en: ["Washed black", "Low rise, flared bootcut", "Floral lace at the back pockets", "Clean side seams, no studs"],
    },
    fit: { thigh: 0.11, knee: 0.095, hem: 0.14, length: 1 },
    model: "/models/black-bootcut-plain.glb",
    image: {
      src: "/products/black-bootcut-plain.webp",
      width: 1132,
      height: 1390,
      alt: {
        th: "กางเกงยีนส์ Black Lace Bootcut แบบเรียบ ด้านหน้าและด้านหลัง",
        en: "Black Lace Bootcut jeans, plain version, front and back",
      },
      background: "#f8f6f3",
    },
  },
  {
    id: "black-bootcut-studded",
    style: "black-bootcut",
    name: "Black Lace Bootcut",
    variantName: { th: "แต่งหมุดข้าง", en: "Side studs" },
    variantType: "detail",
    fitLabel: bootcutFit,
    price: 2590,
    color: "#2a2a2c",
    stitch: "#6f6f74",
    description: {
      th: "เอวต่ำ ทรงขาม้าบานยาวคลุมรองเท้า สีดำฟอก ลูกไม้ใต้กระเป๋าหลังขาด และแถบหมุดสีกันเมทัลตลอดตะเข็บข้าง",
      en: "Low rise with a long bootcut flare that covers the shoe, washed black, lace under distressed back pockets and a row of gunmetal studs down each side seam.",
    },
    details: {
      th: ["สีดำฟอก", "เอวต่ำ ขาม้าบาน", "ลูกไม้ดอกไม้ที่กระเป๋าหลัง", "แถบหมุดกันเมทัลตลอดตะเข็บข้าง"],
      en: ["Washed black", "Low rise, flared bootcut", "Floral lace at the back pockets", "Gunmetal studs down the side seams"],
    },
    fit: { thigh: 0.11, knee: 0.095, hem: 0.14, length: 1 },
    model: "/models/black-bootcut-studded.glb",
    image: {
      src: "/products/black-bootcut-studded.webp",
      width: 1132,
      height: 1390,
      alt: {
        th: "กางเกงยีนส์ Black Lace Bootcut แต่งหมุดตลอดตะเข็บข้าง ด้านหน้าและด้านหลัง",
        en: "Black Lace Bootcut jeans with side studs, front and back",
      },
      background: "#faf9f6",
    },
  },
];

export const displayName = (product: Product, locale: Locale) =>
  product.variantName ? `${product.name} (${product.variantName[locale]})` : product.name;

// สินค้าทุกแบบของทรงเดียวกัน (สินค้าที่ไม่มี style ถือเป็นทรงเดี่ยว)
export const variantsOf = (product: Product) =>
  product.style ? products.filter((p) => p.style === product.style) : [product];

// รวมสินค้าเป็นกลุ่มตามทรง เรียงตามลำดับที่ปรากฏครั้งแรก
export const productStyles = () => {
  const seen = new Set<string>();
  return products.filter((p) => {
    const key = p.style ?? p.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(variantsOf);
};
