/* Shared brand shapes — pure SVG, safe in both server and client components. */

export function Flame({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
      <path
        d="M12 2c2.6 3.2 5.4 5.7 5.4 9.4A5.4 5.4 0 0 1 6.6 11.4c0-1.6.8-3 2.1-4.4C8 9 8.6 6.2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Petal({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={style}>
      <path d="M12 2C7 6 5 10 5 14a7 7 0 0 0 14 0c0-4-2-8-7-12Z" fill="currentColor" />
    </svg>
  );
}
