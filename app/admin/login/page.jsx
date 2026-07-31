"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { adminLogin } from "@/actions/auth";
import { Mail, Lock, ShieldCheck, Sparkles, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0b0a0a] px-6 overflow-hidden">
      
      {/* Cinematic Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-gold-500/5 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-[10%] right-[-20%] w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-[2.5rem] border border-gold-400/10 bg-gradient-to-b from-[#120f0d]/90 via-[#0b0a0a]/90 to-[#080707]/95 p-8 sm:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(212,163,89,0.02)] backdrop-blur-xl transition-all duration-500 hover:border-gold-400/20">
        
        {/* Decorative Top Border Highlight */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/20 to-transparent" />

        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative group mb-4">
            <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-lg opacity-50 group-hover:opacity-85 transition-opacity duration-500" />
            <div className="relative h-24 w-24 overflow-hidden rounded-full border border-gold-400/20 bg-ink p-2.5 shadow-2xl">
              <Image 
                src="/logo.png" 
                alt="Amairah Perfumes" 
                width={88} 
                height={88} 
                className="h-full w-full object-contain" 
              />
            </div>
          </div>
          
          <h1 className="font-display text-3xl font-light text-ivory tracking-wide">
            Admin <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Login</span>
          </h1>
          <p className="mt-2 text-sm text-ivory/50 font-light flex items-center gap-1.5 justify-center">
            <ShieldCheck className="h-4 w-4 text-gold-400/80" /> Authorized users only
          </p>
          
          {/* Subtle gold line divider */}
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent mt-5" />
        </div>

        {/* Form Section */}
        <form action={formAction} className="space-y-5">
          {state.error && (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-2 animate-fadeUp">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              {state.error}
            </div>
          )}

          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
            <input 
              required 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              className="w-full rounded-2xl border border-gold-400/10 bg-ink/40 pl-12 pr-5 py-4 text-sm text-ivory placeholder:text-ivory/20 transition-all duration-500 focus:border-gold-300/50 focus:bg-ink/70 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/20"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400/40 group-focus-within:text-gold-300 transition-colors duration-300" />
            <input 
              required 
              name="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full rounded-2xl border border-gold-400/10 bg-ink/40 pl-12 pr-12 py-4 text-sm text-ivory placeholder:text-ivory/20 transition-all duration-500 focus:border-gold-300/50 focus:bg-ink/70 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-400/40 hover:text-gold-300 transition-colors p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={pending} 
            className="btn-gold group w-full py-4 text-xs font-semibold tracking-widest uppercase transition-all duration-500 disabled:opacity-60 shadow-[0_4px_20px_rgba(212,163,89,0.12)] hover:shadow-[0_4px_25px_rgba(212,163,89,0.25)] hover:-translate-y-0.5"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-ink border-t-transparent rounded-full animate-spin" />
                Checking Details...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Sign In
              </span>
            )}
          </button>
        </form>

        {/* Back to Shop Link */}
        <div className="mt-8 text-center border-t border-gold-400/5 pt-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-ivory/40 hover:text-gold-300 transition-colors uppercase duration-300 group/btn"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-x-1" /> Back to Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
