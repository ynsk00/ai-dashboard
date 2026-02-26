import type { Metadata } from "next";
import { Sora, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "3大AI 機能一覧 2026年最新版 | AI Feature Dashboard",
  description:
    "Gemini・Claude・ChatGPTの最新機能・モデル・料金を一覧比較。毎日自動更新のAIダッシュボード。",
  openGraph: {
    title: "3大AI 機能一覧 2026年最新版",
    description:
      "Gemini・Claude・ChatGPTの最新機能・モデル・料金を一覧比較するダッシュボード",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "3大AI 機能一覧 2026年最新版",
    description:
      "Gemini・Claude・ChatGPTの最新機能・モデル・料金を一覧比較",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${sora.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
