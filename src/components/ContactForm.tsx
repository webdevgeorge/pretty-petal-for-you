"use client";

import { useActionState } from "react";
import {
  submitContact,
  type ContactResult,
  type ContactError,
} from "@/lib/actions/contact";
import { useLang } from "@/components/i18n";
import { Flame } from "@/components/icons";

const inputCls =
  "rounded-xl border border-cream/30 bg-cream-bg/10 px-4 py-2.5 text-cream placeholder:text-cream/55 outline-none backdrop-blur-sm transition-colors focus:border-blush";

export function ContactForm() {
  const { t } = useLang();
  const f = t.contact.form;
  const [state, action, pending] = useActionState<ContactResult | null, FormData>(
    submitContact,
    null,
  );

  const errMap: Record<ContactError, string> = {
    fields: f.errFields,
    email: f.errEmail,
    server: f.errServer,
    config: f.errConfig,
  };

  if (state?.ok) {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-2xl bg-cream-bg/15 p-6 text-cream ring-1 ring-cream/25">
        <Flame className="mx-auto h-6 w-6 text-blush anim-flicker" />
        <p className="mt-2">{f.success}</p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 text-left"
    >
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" required placeholder={f.name} className={inputCls} />
        <input name="phone" required placeholder={f.phone} className={inputCls} />
      </div>
      <input
        name="email"
        type="email"
        required
        placeholder={f.email}
        className={inputCls}
      />
      <textarea name="note" rows={3} placeholder={f.note} className={inputCls} />

      {state?.error && <p className="text-blush-soft">{errMap[state.error]}</p>}

      <button
        type="submit"
        disabled={pending}
        className="shine mt-1 rounded-full bg-blush px-7 py-3 font-semibold text-sage-text transition-all duration-300 hover:-translate-y-0.5 hover:bg-blush-deep hover:text-white disabled:opacity-60"
      >
        {pending ? f.sending : f.send}
      </button>
    </form>
  );
}
