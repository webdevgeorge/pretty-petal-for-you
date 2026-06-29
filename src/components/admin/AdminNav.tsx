"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/qr", label: "QR codes" },
  { href: "/admin/candles", label: "Candles" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center gap-1">
      {links.map((l) => {
        const active =
          l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
              active
                ? "bg-blush text-white"
                : "text-sage-text/70 hover:bg-cream-soft hover:text-sage-text"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
