import { displayName, products, sizes } from "@/lib/products";
import { formatPrice } from "@/lib/shop";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";
import { Sparkle } from "../ui/Sparkle";

function FitList() {
  return (
    <ul className="space-y-1.5 text-xs">
      {products.map((product, i) => (
        <li
          key={product.id}
          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 ${
            i === 0 ? "bg-white/12 text-fg" : "bg-white/[0.03] text-mute"
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: product.color }} />
          {displayName(product)}
        </li>
      ))}
    </ul>
  );
}

function Orbit() {
  return (
    <div className="relative mx-auto grid h-40 w-40 place-items-center">
      <div className="absolute inset-0 animate-[spin_14s_linear_infinite] rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a3a40,#0b0b0d_70%)] shadow-[0_0_60px_-10px_rgba(255,255,255,0.25)]" />
      <Sparkle className="relative h-7 w-7 text-fg" />
      <span className="absolute -bottom-1 text-[11px] tracking-[0.2em] text-mute">360°</span>
    </div>
  );
}

function SizeGrid() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {sizes.map((size) => (
        <span
          key={size}
          className={`grid h-10 place-items-center rounded-full text-xs ${
            size === "27" ? "bg-white text-night" : "border border-white/12 text-mute"
          }`}
        >
          {size}
        </span>
      ))}
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-mute">
      <div className="mb-2 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
      </div>
      <p className="text-fg">ขอสั่งซื้อสินค้า</p>
      <p>1. {displayName(products[0])} | ไซซ์ 27 | 1 ตัว</p>
      <p>รวม: {formatPrice(products[0].price)}</p>
      <p className="text-white/40">ชื่อผู้รับ: _</p>
    </div>
  );
}

const steps = [
  { title: "หยิบจากราว", text: "แตะกางเกงบนราวในโชว์รูมเพื่อหยิบมาดูใกล้ๆ", visual: <FitList /> },
  { title: "หมุนดูรอบตัว", text: "ลากเพื่อหมุนดูทั้งด้านหน้า ด้านหลัง และกระเป๋า", visual: <Orbit /> },
  { title: "เลือกไซซ์", text: "เลือกไซซ์เอวแล้วเพิ่มลงตะกร้า", visual: <SizeGrid /> },
  { title: "ส่งออเดอร์ในแชต", text: "คัดลอกข้อความสั่งซื้อไปวางใน LINE หรือ IG", visual: <ChatPreview /> },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:py-32">
      <Reveal>
        <SectionHeading badge="เลือก • หมุน • ใส่ตะกร้า • ส่งแชต" title="ช้อปยีนส์ใน 4 ขั้นตอน">
          ไม่ต้องสมัครสมาชิก ไม่ต้องกรอกฟอร์ม เลือกเสร็จแล้วคุยกับร้านในแชตได้เลย
        </SectionHeading>
      </Reveal>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 60} className="glass flex flex-col rounded-3xl p-5">
            <span className="text-xs tracking-[0.2em] text-mute">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 text-lg font-medium">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">{step.text}</p>
            <div className="mt-6 flex flex-1 items-end">
              <div className="w-full">{step.visual}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
