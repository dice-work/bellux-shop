import type { Fit } from "@/lib/products";

// ภาพกางเกงแบบ 2D จากค่าทรงเดียวกับโมเดล 3D ใช้ในการ์ดสินค้า
export function JeansSilhouette({ fit, color }: { fit: Fit; color: string }) {
  const scale = 120 / (0.285 + fit.length);
  const hip = fit.thigh * 1.94 * scale;
  const waist = hip * 0.88;
  const thigh = fit.thigh * scale;
  const knee = fit.knee * scale;
  const hem = fit.hem * scale;
  const top = 10;
  const hipY = top + 0.285 * scale;
  const kneeY = hipY + fit.length * 0.55 * scale;
  const hemY = top + (0.285 + fit.length) * scale;
  const cx = 50;

  // ขาบานกว้างกว่าต้นขาได้ จึงเลื่อนแกนขาออกด้านข้างให้เห็นช่องระหว่างขาเสมอ
  const at = (radius: number, y: number, side: number) => {
    const center = cx + side * Math.max(thigh, radius + 1.2);
    return [`${center + side * radius},${y}`, `${center - side * radius},${y}`];
  };

  const leg = (side: number) => {
    const [kneeOut, kneeIn] = at(knee, kneeY, side);
    const [hemOut, hemIn] = at(hem, hemY, side);
    return [`${cx + side * 2 * thigh},${hipY}`, kneeOut, hemOut, hemIn, kneeIn];
  };

  const points = [
    `${cx - waist},${top}`,
    `${cx + waist},${top}`,
    ...leg(1),
    `${cx},${hipY + 4}`,
    ...leg(-1).reverse(),
  ].join(" ");

  return (
    <svg viewBox="0 0 100 140" aria-hidden className="h-full w-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]">
      <polygon points={points} fill={color} strokeLinejoin="round" />
      <line x1={cx - waist} y1={top + 6} x2={cx + waist} y2={top + 6} stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
      <line x1={cx + 3} y1={top + 7} x2={cx + 3} y2={hipY - 2} stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
      <circle cx={cx} cy={top + 3} r="1.4" fill="#d4d4d8" />
    </svg>
  );
}
