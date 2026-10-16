"use client";

import Image from "next/image";
import { useState } from "react";
import { productStyles, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/shop";
import { showInShowroom } from "@/lib/showroom";
import { JeansSilhouette } from "../ui/JeansSilhouette";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

function ProductVisual({ colors, active, featured }: { colors: Product[]; active: Product; featured: boolean }) {
  const photos = colors.filter((p) => p.image);
  if (active.image) {
    // ภาพถ่ายพื้นสว่าง วางบนพื้นสีเดียวกับภาพให้กลืนเป็นแผ่นเดียว
    // โหลดภาพทุกสีไว้ซ้อนกันแล้วสลับด้วย opacity จะได้ไม่เห็นภาพว่างตอนกดเปลี่ยนสี
    return (
      <div
        className={`grid place-items-center transition-colors duration-500 ${featured ? "p-6 sm:p-10" : "p-5"}`}
        style={{ background: active.image.background }}
      >
        {photos.map((p) => (
          <Image
            key={p.id}
            src={p.image!.src}
            width={p.image!.width}
            height={p.image!.height}
            alt={p.id === active.id ? p.image!.alt : ""}
            aria-hidden={p.id !== active.id}
            sizes={featured ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 380px, 100vw"}
            className={`col-start-1 row-start-1 mx-auto h-auto max-h-[560px] w-auto transition duration-500 group-hover:scale-[1.02] ${
              p.id === active.id ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    );
  }
  const product = active;
  return (
    <div className="relative grid h-64 place-items-center overflow-hidden bg-[radial-gradient(60%_70%_at_50%_100%,rgba(255,255,255,0.12),transparent)] p-6">
      <div className="grid-bg absolute inset-0 opacity-50" />
      <div className="relative h-full transition duration-500 group-hover:-translate-y-1.5">
        <JeansSilhouette fit={product.fit} color={product.color} />
      </div>
    </div>
  );
}

// การ์ดหนึ่งใบต่อหนึ่งทรง ถ้ามีหลายสีให้กดสลับสีดูภาพได้ในการ์ด
function StyleCard({ colors, featured, index }: { colors: Product[]; featured: boolean; index: number }) {
  const [active, setActive] = useState(colors[0]);

  return (
    <Reveal
      delay={index * 50}
      className={`glass group overflow-hidden rounded-3xl ${featured ? "grid lg:grid-cols-[1.15fr_1fr]" : "flex flex-col"}`}
    >
      <ProductVisual colors={colors} active={active} featured={featured} />
      <div className={`flex flex-col ${featured ? "justify-center gap-6 p-6 sm:p-10" : "flex-1 justify-between gap-4 border-t border-white/8 p-5"}`}>
        <div>
          <h3 className={featured ? "text-chrome text-3xl font-semibold tracking-tight sm:text-4xl" : "text-lg font-medium"}>
            {active.name}
          </h3>
          <p className="mt-1.5 text-sm text-mute">{active.fitLabel}</p>
          <p className={featured ? "mt-4 text-2xl" : "mt-3 text-sm"}>{formatPrice(active.price)}</p>
        </div>
        {colors.length > 1 && (
          <div>
            <p className="text-xs text-mute">
              {colors.length} สี: <span className="text-fg">{active.colorName}</span>
            </p>
            <div className="mt-2.5 flex gap-2.5">
              {colors.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-label={`ดูสี ${option.colorName}`}
                  aria-pressed={option.id === active.id}
                  onClick={() => setActive(option)}
                  className={`h-8 w-8 rounded-full ring-1 ring-white/15 transition ${
                    option.id === active.id ? "ring-2 ring-white ring-offset-2 ring-offset-night" : "hover:ring-white/45"
                  }`}
                  style={{ background: option.color }}
                />
              ))}
            </div>
          </div>
        )}
        {featured && (
          <>
            <p className="text-sm leading-relaxed text-fg/75">{active.description}</p>
            <ul className="space-y-1.5 border-t border-white/8 pt-5 text-sm text-mute">
              {active.details.map((detail) => (
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
            onClick={() => showInShowroom(active.id)}
            className={featured ? "btn-primary" : "btn-ghost py-2! text-xs!"}
          >
            ดูแบบ 3D และเลือกไซซ์
          </button>
        </div>
      </div>
    </Reveal>
  );
}

export function Collection() {
  const styles = productStyles();
  // ไม่เกิน 2 ทรงแสดงเป็นการ์ดใหญ่เรียงลงมา มากกว่านั้นเรียงเป็นตาราง
  const featured = styles.length <= 2;

  return (
    <section id="collection" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:py-32">
      <Reveal>
        <SectionHeading badge="New Arrival" title="คอลเลกชันล่าสุด">
          ดูภาพด้านหน้าและด้านหลัง แล้วกดดูแบบ 3D เพื่อหมุนดูทุกมุมก่อนตัดสินใจ
        </SectionHeading>
      </Reveal>
      <div className={`mt-14 grid gap-6 ${featured ? "mx-auto max-w-5xl" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {styles.map((colors, i) => (
          <StyleCard key={colors[0].style ?? colors[0].id} colors={colors} featured={featured} index={i} />
        ))}
      </div>
    </section>
  );
}
