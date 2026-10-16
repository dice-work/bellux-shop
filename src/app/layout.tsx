import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai, Inter } from "next/font/google";
import { shop } from "@/lib/shop";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plex = IBM_Plex_Sans_Thai({
  variable: "--font-plex",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${shop.name} | ร้านกางเกงยีนส์`,
  description: "เดินเลือกกางเกงยีนส์ในโชว์รูม 3D หมุนดูได้รอบตัวก่อนสั่งซื้อ",
};

export const viewport: Viewport = {
  themeColor: "#050506",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${inter.variable} ${plex.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
