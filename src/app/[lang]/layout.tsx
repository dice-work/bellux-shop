import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { I18nProvider } from "@/i18n/I18nProvider";
import { hasLocale, locales } from "@/i18n/config";
import { dictionaries } from "@/i18n/dictionaries";
import { shop } from "@/lib/shop";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plex = IBM_Plex_Sans_Thai({
  variable: "--font-plex",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = dictionaries[lang].meta;
  return {
    title: `${shop.name} | ${t.title}`,
    description: t.description,
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}`])),
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#050506",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${inter.variable} ${plex.variable} antialiased`}>
      <body className="font-sans">
        <I18nProvider locale={lang}>{children}</I18nProvider>
      </body>
    </html>
  );
}
