import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Beauty / Food / Places Hub",
  description: "整合美妝、美食地圖與景點的個人整理網站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">{children}</main>
      </body>
    </html>
  );
}