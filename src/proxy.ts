import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/i18n/config";

// เลือกภาษาจาก Accept-Language ของเบราว์เซอร์ (เรียงตามค่า q) ถ้าไม่ตรงเลยใช้ภาษาไทย
function preferredLocale(request: NextRequest): Locale {
  const ranked = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  const match = ranked.find(({ lang }) => (locales as readonly string[]).includes(lang));
  return (match?.lang as Locale | undefined) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return;

  request.nextUrl.pathname = `/${preferredLocale(request)}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // ข้ามไฟล์ของ Next.js และไฟล์ใน public (มีนามสกุล) เช่น โมเดล .glb และรูปสินค้า
  matcher: ["/((?!_next|.*\\..*).*)"],
};
