"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Locale, type Localized } from "./config";
import { dictionaries, type Dictionary } from "./dictionaries";

type I18n = {
  locale: Locale;
  t: Dictionary;
  // เลือกข้อความภาษาปัจจุบันจากข้อมูลที่มีสองภาษา (เช่น ข้อมูลสินค้า)
  l: <T>(value: Localized<T>) => T;
};

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value: I18n = { locale, t: dictionaries[locale], l: (v) => v[locale] };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
