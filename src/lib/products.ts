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
  image?: { src: string; width: number; height: number; alt: string };
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
    },
  },
];
