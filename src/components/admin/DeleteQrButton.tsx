"use client";

import { deleteQrCode } from "@/lib/actions/qr";

export function DeleteQrButton({ id, name }: { id: string; name: string }) {
  const action = deleteQrCode.bind(null, id);
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? All scan history will be lost.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-200 px-3 py-1 font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
      >
        Delete
      </button>
    </form>
  );
}
