import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { LanguageProvider } from "@/components/i18n";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Pretty Petal — Handmade Decoration Candles",
  description:
    "Pretty Petal makes hand-poured decoration candles in small batches — pretty little things, made slowly and with a lot of love.",
  icons: {
    icon: "/pretty-petal-logo.jpg",
    apple: "/pretty-petal-logo.jpg",
  },
  openGraph: {
    title: "Pretty Petal — Handmade Decoration Candles",
    description:
      "Hand-poured decoration candles, made in small batches with a lot of love.",
    images: ["/pretty-petal-logo.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} h-full antialiased`}>
      <body className="min-h-full">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
