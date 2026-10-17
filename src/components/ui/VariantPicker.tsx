"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { Product } from "@/lib/products";

// เลือกแบบของทรงเดียวกัน: ต่างกันที่สีแสดงเป็นจุดสี ต่างกันที่ดีเทลแสดงเป็นปุ่มข้อความ
export function VariantPicker({
  options,
  activeId,
  onPick,
  offsetClass,
}: {
  options: Product[];
  activeId: string;
  onPick: (product: Product) => void;
  offsetClass: string;
}) {
  const { t, l } = useI18n();
  const active = options.find((option) => option.id === activeId) ?? options[0];
  const byColor = active.variantType !== "detail";

  return (
    <fieldset>
      <legend className="text-xs text-mute">
        {byColor ? t.panel.colors(options.length) : t.panel.details(options.length)}:{" "}
        <span className="text-fg">{active.variantName && l(active.variantName)}</span>
      </legend>
      <div className="mt-2.5 flex flex-wrap gap-2.5">
        {options.map((option) => {
          const selected = option.id === active.id;
          return byColor ? (
            <button
              key={option.id}
              type="button"
              aria-label={option.variantName && l(option.variantName)}
              aria-pressed={selected}
              onClick={() => onPick(option)}
              className={`h-9 w-9 rounded-full ring-1 ring-white/15 transition ${
                selected ? `ring-2 ring-white ring-offset-2 ${offsetClass}` : "hover:ring-white/45"
              }`}
              style={{ background: option.color }}
            />
          ) : (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onPick(option)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                selected ? "bg-white text-night" : "border border-white/12 text-mute hover:border-white/35 hover:text-fg"
              }`}
            >
              {option.variantName && l(option.variantName)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
