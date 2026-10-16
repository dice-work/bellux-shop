"use client";

import Image from "next/image";
import { products, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/shop";
import { showInShowroom } from "@/lib/showroom";
import { JeansSilhouette } from "../ui/JeansSilhouette";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

function ProductVisual({ product, featured }: { product: Product; featured: boolean }) {
  if (product.image) {
    // ภาพถ่ายสินค้าพื้นสว่าง วางบนพื้นสีเดียวกับภาพให้กลืนเป็นแผ่นเดียว
    return (
      <div className={`bg-[#f0edea] ${featured ? "p-6 sm:p-10" : "p-5"}`}>
        <Image
          src={product.image.src}
          width={product.image.width}
          height={product.image.height}
          alt={product.image.alt}
          sizes={featured ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
          className="mx-auto h-auto max-h-[560px] w-auto transition duration-500 group-hover:scale-[1.02]"
        />
      </div>
    );
  }
  return (
    <div className="relative grid h-64 place-items-center overflow-hidden bg-[radial-gradient(60%_70%_at_50%_100%,rgba(255,255,255,0.12),transparent)] p-6">
      <div className="grid-bg absolute inset-0 opacity-50" />
      <div className="relative h-full transition duration-500 group-hover:-translate-y-1.5">
        <JeansSilhouette fit={product.fit} color={product.color} />
      </div>
    </div>
  );
}

export function Collection() {
  // สินค้าตัวเดียวแสดงเป็นการ์ดใหญ่แบบภาพคู่รายละเอียด หลายตัวค่อยเรียงเป็นตาราง
  const featured = products.length === 1;

  return (
    <section id="collection" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:py-32">
      <Reveal>
        <SectionHeading badge="New Arrival" title={featured ? "ตัวเด่นของซีซันนี้" : "คอลเลกชันล่าสุด"}>
          ดูภาพด้านหน้าและด้านหลัง แล้วกดดูแบบ 3D เพื่อหมุนดูทุกมุมก่อนตัดสินใจ
        </SectionHeading>
      </Reveal>
      <div className={`mt-14 grid gap-4 ${featured ? "mx-auto max-w-5xl" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {products.map((product, i) => (
          <Reveal
            key={product.id}
            delay={i * 50}
            className={`glass group overflow-hidden rounded-3xl ${featured ? "grid lg:grid-cols-[1.15fr_1fr]" : "flex flex-col"}`}
          >
            <ProductVisual product={product} featured={featured} />
            <div className={`flex flex-col ${featured ? "justify-center gap-6 p-6 sm:p-10" : "flex-1 justify-between gap-4 border-t border-white/8 p-5"}`}>
              <div>
                <h3 className={featured ? "text-chrome text-3xl font-semibold tracking-tight sm:text-4xl" : "text-lg font-medium"}>
                  {product.name}
                </h3>
                <p className="mt-1.5 text-sm text-mute">{product.fitLabel}</p>
                <p className={featured ? "mt-4 text-2xl" : "mt-3 text-sm"}>{formatPrice(product.price)}</p>
              </div>
              {featured && (
                <>
                  <p className="text-sm leading-relaxed text-fg/75">{product.description}</p>
                  <ul className="space-y-1.5 border-t border-white/8 pt-5 text-sm text-mute">
                    {product.details.map((detail) => (
                      <li key={detail} className="flex gap-2">
                        <span aria-hidden className="text-fg/40">—</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div>
                <button
                  type="button"
                  onClick={() => showInShowroom(product.id)}
                  className={featured ? "btn-primary" : "btn-ghost py-2! text-xs!"}
                >
                  ดูแบบ 3D และเลือกไซซ์
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
