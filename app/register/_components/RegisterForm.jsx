"use client";

import { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, KeyRound, ShieldCheck } from "lucide-react";
import { requestSignupOtp, verifySignupOtp } from "@/actions/auth";
import BottleGlyph from "@/components/BottleGlyph";

const inputClass =
  "w-full rounded-2xl border border-gold-400/10 bg-ink/40 py-4 pl-12 pr-4 text-base text-ivory placeholder:text-ivory/20 transition-all duration-500 focus:border-gold-300/50 focus:bg-ink/70 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/20";

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);

  const [step, setStep] = useState("details");
  const [details, setDetails] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [cooldown, setCooldown] = useState(0);

  const [otpState, otpAction, otpSendPending] = useActionState(requestSignupOtp, {});
  const [verifyState, verifyAction, verifyPending] = useActionState(verifySignupOtp, {});

  useEffect(() => {
    if (otpState.success) {
      setStep("otp");
      setCooldown(60);
    }
  }, [otpState]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleDetailsSubmit = (e) => {
    const fd = new FormData(e.currentTarget);
    setDetails({
      full_name: fd.get("full_name") || "",
      email: fd.get("email") || "",
      phone: fd.get("phone") || "",
      password: fd.get("password") || "",
    });
  };

  return (
    <div className="relative w-full max-w-md rounded-[2.5rem] border border-gold-400/10 bg-gradient-to-b from-[#120f0d]/90 via-[#0b0a0a]/90 to-[#080707]/95 p-8 sm:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(212,163,89,0.02)] backdrop-blur-xl transition-all duration-500 hover:border-gold-400/20">

      {/* Top Border Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent rounded-t-[2.5rem]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold-300/5 blur-3xl" />

      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 shadow-[0_0_25px_rgba(212,163,89,0.12)]">
        <BottleGlyph className="h-7 w-7 text-gold-300/80" />
      </div>

      {step === "details" ? (
        <>
          <span className="eyebrow relative flex justify-center text-[11px] font-semibold uppercase tracking-widest text-gold-300">
            Join Amairah
          </span>
          <h1 className="relative mt-3 text-center font-display text-3xl sm:text-4xl text-ivory font-light">Create an Account</h1>
          <p className="relative mt-3 text-center text-base text-ivory/50 font-light">Faster checkout and order tracking, every visit.</p>

          <form action={otpAction} onSubmit={handleDetailsSubmit} className="relative mt-9 space-y-4">
            {otpState.error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 animate-fadeUp">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                {otpState.error}
              </div>
            )}

            {/* Name Input */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
              <input required name="full_name" defaultValue={details.full_name} placeholder="Full Name" className={inputClass} />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
              <input required name="email" type="email" defaultValue={details.email} placeholder="Email Address" className={inputClass} />
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
              <input name="phone" type="tel" defaultValue={details.phone} placeholder="Phone Number" className={inputClass} />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
              <input
                required
                name="password"
                type={showPassword ? "text" : "password"}
                defaultValue={details.password}
                placeholder="Password (min. 6 chars)"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-400/40 hover:text-gold-300 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={otpSendPending}
              className="btn-gold group w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-500 disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5"
            >
              {otpSendPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                  Sending code…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <UserPlus className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  Create Account
                </span>
              )}
            </button>
          </form>

          <p className="relative mt-7 text-center text-base text-ivory/50 font-light">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-gold-300 hover:text-gold-200 transition-colors font-medium"
            >
              Log in
            </Link>
          </p>
        </>
      ) : (
        <>
          <span className="eyebrow relative flex justify-center text-[11px] font-semibold uppercase tracking-widest text-gold-300">
            Verify Email
          </span>
          <h1 className="relative mt-3 text-center font-display text-3xl sm:text-4xl text-ivory font-light">Enter Your Code</h1>
          <p className="relative mt-3 text-center text-base text-ivory/50 font-light">
            We sent a 6-digit code to <span className="text-ivory/80">{details.email}</span>
          </p>

          <form action={verifyAction} className="relative mt-9 space-y-4">
            <input type="hidden" name="email" value={details.email} />
            <input type="hidden" name="full_name" value={details.full_name} />
            <input type="hidden" name="phone" value={details.phone} />
            <input type="hidden" name="password" value={details.password} />
            <input type="hidden" name="redirect_to" value={redirectTo} />

            {verifyState.error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 animate-fadeUp">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                {verifyState.error}
              </div>
            )}
            {otpState.error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 animate-fadeUp">
                <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                {otpState.error}
              </div>
            )}

            {/* OTP Input */}
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
              <input
                required
                name="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                className={`${inputClass} tracking-[0.5em]`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={verifyPending}
              className="btn-gold group w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-500 disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5"
            >
              {verifyPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                  Verifying…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  Verify &amp; Create Account
                </span>
              )}
            </button>
          </form>

          {/* Resend + change email */}
          <form action={otpAction} className="relative mt-5 flex items-center justify-between text-sm">
            <input type="hidden" name="full_name" value={details.full_name} />
            <input type="hidden" name="email" value={details.email} />
            <input type="hidden" name="phone" value={details.phone} />
            <input type="hidden" name="password" value={details.password} />
            <button
              type="button"
              onClick={() => setStep("details")}
              className="text-ivory/40 hover:text-gold-300 transition-colors duration-300"
            >
              Change email
            </button>
            <button
              type="submit"
              disabled={cooldown > 0 || otpSendPending}
              className="text-gold-300 hover:text-gold-200 transition-colors font-medium disabled:opacity-40 disabled:hover:text-gold-300"
            >
              {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
