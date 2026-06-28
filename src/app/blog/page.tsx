import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BlogIndex } from "@/components/BlogIndex";

export const metadata: Metadata = {
  title: "The Candle Journal — Care Tips, Ideas & Gifts | Pretty Petal",
  description:
    "Candle care, decorating ideas and gift inspiration from Lize at Pretty Petal — handmade decoration candles, made with love.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "The Candle Journal | Pretty Petal",
    description:
      "Candle care, decorating ideas and gift inspiration from Lize at Pretty Petal.",
    type: "website",
  },
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <BlogIndex />
      <SiteFooter />
    </>
  );
}
