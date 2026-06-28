import Link from "next/link";

export function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-3xl bg-card p-5 ring-1 ring-line transition-colors hover:bg-cream-soft/40">
      <p className="text-sage-text/60">{label}</p>
      <p className="mt-1 text-3xl font-bold text-sage-text">{value}</p>
    </div>
  );
  return href ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}
