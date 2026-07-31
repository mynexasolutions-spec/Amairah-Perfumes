"use client";

import Link from "next/link";
import { Menu, ExternalLink } from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";

export default function AdminHeader({ adminName }) {
  const { setMobileOpen } = useAdminSidebar();
  const initial = (adminName || "A").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-gold-400/10 bg-[#0b0a0a]/90 px-4 backdrop-blur-md md:px-6">
      <button onClick={() => setMobileOpen(true)} className="p-1.5 text-ivory/60 hover:text-ivory lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <p className="text-lg text-ivory font-light">
          Welcome back, <span className="font-semibold text-gold-200">{adminName || "Admin"}</span>
        </p>
        <p className="text-sm text-ivory/35 font-light tracking-wide mt-0.5">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-full border border-gold-400/15 bg-gold-400/5 px-4 py-1.5 text-sm text-ivory/60 transition-all duration-300 hover:border-gold-400/35 hover:text-gold-300 hover:shadow-[0_0_15px_rgba(212,163,89,0.05)] sm:flex"
        >
          View Store <ExternalLink className="h-3.5 w-3.5" />
        </Link>

        <div className="h-8 w-px bg-gold-400/10 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-sm font-semibold text-ink shadow-[0_2px_10px_rgba(202,161,75,0.25)]">
            {initial}
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="rounded-full border border-gold-400/10 px-4 py-1.5 text-sm text-ivory/60 transition-colors hover:border-red-400/35 hover:text-red-300"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
