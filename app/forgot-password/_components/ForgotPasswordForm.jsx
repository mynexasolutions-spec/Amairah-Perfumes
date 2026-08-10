"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, SendHorizonal } from "lucide-react";
import { requestPasswordReset } from "@/actions/auth";
import BottleGlyph from "@/components/BottleGlyph";

const inputClass =
  "w-full rounded-2xl border border-gold-400/10 bg-ink/40 py-4 pl-12 pr-4 text-base text-ivory placeholder:text-ivory/20 transition-all duration-500 focus:border-gold-300/50 focus:bg-ink/70 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/20";

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, {});

  return (
    <div className="relative w-full max-w-md rounded-[2.5rem] border border-gold-400/10 bg-gradient-to-b from-[#120f0d]/90 via-[#0b0a0a]/90 to-[#080707]/95 p-8 sm:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(212,163,89,0.02)] backdrop-blur-xl transition-all duration-500 hover:border-gold-400/20">

      {/* Top Border Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent rounded-t-[2.5rem]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold-300/5 blur-3xl" />

      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 shadow-[0_0_25px_rgba(212,163,89,0.12)]">
        <BottleGlyph className="h-7 w-7 text-gold-300/80" />
      </div>

      <span className="eyebrow relative flex justify-center text-[11px] font-semibold uppercase tracking-widest text-gold-300">
        Forgot Password
      </span>
      <h1 className="relative mt-3 text-center font-display text-3xl sm:text-4xl text-ivory font-light">Reset Your Password</h1>
      <p className="relative mt-3 text-center text-base text-ivory/50 font-light">
        Enter your account email and we&apos;ll send you a reset link.
      </p>

      {state.success ? (
        <div className="relative mt-9 flex items-center gap-2 rounded-2xl border border-green-500/25 bg-green-500/10 p-4 text-sm text-green-300 animate-fadeUp">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          {state.message}
        </div>
      ) : (
        <form action={formAction} className="relative mt-9 space-y-4">
          {state.error && (
            <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 animate-fadeUp">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              {state.error}
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
            <input required name="email" type="email" placeholder="Email Address" className={inputClass} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="btn-gold group w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-500 disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                Sending…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <SendHorizonal className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                Send Reset Link
              </span>
            )}
          </button>
        </form>
      )}

      <p className="relative mt-7 text-center text-base text-ivory/50 font-light">
        Remembered it?{" "}
        <Link href="/login" className="text-gold-300 hover:text-gold-200 transition-colors font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
