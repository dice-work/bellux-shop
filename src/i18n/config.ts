export const locales = ["th", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "th";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

// ข้อความที่ต้องมีครบทั้งสองภาษา ใช้กับข้อมูลสินค้า
export type Localized<T = string> = Record<Locale, T>;
