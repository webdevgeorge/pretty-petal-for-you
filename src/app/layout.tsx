import type { Metadata } from "next";
import { Quicksand, Great_Vibes } from "next/font/google";
import Script from "next/script";
import { LanguageProvider } from "@/components/i18n";
import "./globals.css";

const GA_ID = "G-F4R5KXB6PQ";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

// An elegant script used only for the hero flourish.
const greatVibes = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
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
    <html
      lang="en"
      className={`${quicksand.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <LanguageProvider>{children}</LanguageProvider>
      </body>

      {/* Google Analytics (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </html>
  );
}
