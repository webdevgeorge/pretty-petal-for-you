import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Article } from "@/components/Article";
import { getPost, posts } from "@/components/blog";

const INSTAGRAM = "https://www.instagram.com/prettypetalforyou";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  // Metadata follows the site's default language (English) so it matches the
  // server-rendered HTML. Both keywords are included for discoverability.
  const c = post.en;
  return {
    title: `${c.title} | Pretty Petal`,
    description: c.excerpt,
    keywords: [post.en.keyword, post.fr.keyword],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: c.title,
      description: c.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["Lize"],
      images: [{ url: post.image.src }],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const c = post.en; // schema in the default (server-rendered) language

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: c.title,
      description: c.excerpt,
      image: post.image.src,
      datePublished: post.date,
      dateModified: post.date,
      inLanguage: "en",
      keywords: c.keyword,
      author: { "@type": "Person", name: "Lize", url: INSTAGRAM },
      publisher: { "@type": "Organization", name: "Pretty Petal" },
      mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${slug}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "en",
      mainEntity: c.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <SiteHeader />
      <Article slug={slug} />
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
