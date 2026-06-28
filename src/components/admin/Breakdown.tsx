export function Breakdown({
  title,
  items,
}: {
  title: string;
  items: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="rounded-3xl bg-card p-5 ring-1 ring-line">
      <h3 className="font-semibold text-sage-text">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sage-text/50">No data yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.slice(0, 8).map((i) => (
            <li key={i.label} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-sage-text/70" title={i.label}>
                {i.label}
              </span>
              <span className="h-2 flex-1 rounded-full bg-cream-soft">
                <span
                  className="block h-2 rounded-full bg-blush"
                  style={{ width: `${(i.count / max) * 100}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right text-sage-text/70">{i.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
