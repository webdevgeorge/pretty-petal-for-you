"use client";

import { deleteCandle } from "@/lib/actions/candles";

export function DeleteCandleButton({ id, name }: { id: string; name: string }) {
  const action = deleteCandle.bind(null, id);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-200 px-3 py-1 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
      >
        Delete
      </button>
    </form>
  );
}
