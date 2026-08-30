"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ShoppingBag, User, Sparkles, ChevronDown, ChevronRight, LayoutDashboard, LogOut, LogIn, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { logout } from "@/actions/auth";

const STATIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function AnnouncementBar({ message }) {
  if (!message) return null;

  return (
    <div className="relative overflow-hidden border-b border-gold-400/15 bg-gradient-to-r from-[#120f0d] via-[#1c1611] to-[#120f0d]">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/[0.08] blur-[60px]" />
      <div className="relative mx-auto flex max-w-wrap items-center justify-center gap-2.5 px-10 py-2 sm:px-12">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-300 animate-pulse" />
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 sm:text-sm sm:tracking-[0.2em]">
          {message}
        </p>
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-300 animate-pulse" />
      </div>
    </div>
  );
}

export default function Header({ categories = [], announcement, isLoggedIn = false, bundleEnabled = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, setDrawerOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = bundleEnabled
    ? [...STATIC_LINKS.slice(0, 2), { label: "Gift Set", href: "/bundle" }, ...STATIC_LINKS.slice(2)]
    : STATIC_LINKS;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-40 border-b border-gold-400/10 transition-colors duration-300 ${mobileOpen ? "bg-[#0b0a0a]" : "bg-[#0b0a0a]/85 backdrop-blur-lg"
      }`}>
      <AnnouncementBar message={announcement} />

      {/* Shimmering bottom hairline */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold-gradient bg-[length:200%_200%] animate-shimmer" />

      {/* Main Navbar Row */}
      <div className="mx-auto flex max-w-wrap items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-5 md:px-12">

        {/* Brand Logo */}
        <Link href="/" className="relative flex h-10 w-[120px] items-center shrink-0 group sm:h-14 sm:w-[168px]">
          <div className="absolute left-0 top-1/2 aspect-[3/2] h-20 -translate-y-1/2 overflow-hidden rounded-xl transition-transform duration-500 group-hover:scale-105 sm:h-28">
            <Image
              src="/navbar-logo.png"
              alt="Amairah Perfumes"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.label === "Shop") {
              return (
                <div key={link.href} className="group relative py-2">
                  <Link
                    href={link.href}
                    className={`text-base font-medium tracking-wide flex items-center gap-1.5 transition-colors ${pathname?.startsWith("/shop") ? "text-gold-200" : "text-ivory/70 hover:text-gold-300"
                      }`}
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5 text-gold-400/70 group-hover:rotate-180 transition-transform duration-300" />
                  </Link>

                  {/* Dropdown Menu (Glassmorphic panel) */}
                  {categories.length > 0 && (
                    <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-3 scale-95 rounded-[1.75rem] border border-gold-400/15 bg-gradient-to-b from-[#181310] via-[#120f0d] to-[#0b0a0a] p-3 opacity-0 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(212,163,89,0.08)] transition-all duration-300 group-hover:visible group-hover:translate-y-2 group-hover:scale-100 group-hover:opacity-100">
                      {/* Caret pointer */}
                      <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] border-l border-t border-gold-400/15 bg-[#181310]" />
                      {/* Decorative glow */}
                      <div className="pointer-events-none absolute -top-8 left-1/2 h-24 w-44 -translate-x-1/2 rounded-full bg-gold-400/10 blur-2xl" />
                      <div className="pointer-events-none absolute -bottom-6 right-2 h-16 w-16 rounded-full bg-gold-300/10 blur-2xl" />

                      <div className="relative z-10">
                        <p className="flex items-center gap-2 px-4 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-300/60">
                          <Sparkles className="h-3 w-3 text-gold-400/60" />
                          Browse Categories
                        </p>
                        <div className="mx-4 mb-2 h-px bg-gradient-to-r from-gold-400/30 via-gold-400/10 to-transparent" />
                        <div className="space-y-0.5">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/shop?category=${cat.id}`}
                              className="group/item relative flex items-center justify-between overflow-hidden rounded-xl px-4 py-3 text-sm text-ivory/65 transition-all duration-300 hover:bg-gold-400/10 hover:text-gold-200"
                            >
                              <span className="relative z-10 flex items-center gap-3">
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400/30 transition-all duration-300 group-hover/item:bg-gold-300 group-hover/item:shadow-[0_0_10px_rgba(212,163,89,0.6)]" />
                                {cat.name}
                              </span>
                              <ChevronRight className="relative z-10 h-3.5 w-3.5 text-gold-300 opacity-0 -translate-x-1 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                              <span className="absolute inset-y-0 left-0 w-0.5 bg-gold-400/50 scale-y-0 transition-transform duration-300 group-hover/item:scale-y-100" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group/link text-base font-medium tracking-wide relative py-2 transition-colors ${isActive ? "text-gold-200" : "text-ivory/70 hover:text-gold-300"
                  }`}
              >
                {link.label}
                {isActive ? (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-300 shadow-gold animate-pulse" />
                ) : (
                  <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-300 to-transparent transition-all duration-300 group-hover/link:w-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">

          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen((o) => !o)}
            aria-label="Search"
            className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_25px_-12px_rgba(202,161,75,0.4)] ${
              searchOpen
                ? "border-gold-400/40 bg-gold-400/10 text-gold-300"
                : "border-ink-line bg-ink-soft/40 text-ivory/75 hover:border-gold-400/25 hover:bg-ink-soft/80 hover:text-gold-300"
            }`}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Account (Mobile, logged in) */}
          {isLoggedIn && (
            <Link
              href="/account"
              aria-label="My Account"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-200 transition-all duration-300 hover:border-gold-300/40 hover:bg-gold-400/10 hover:scale-105 sm:hidden"
            >
              <User className="h-4 w-4" />
            </Link>
          )}

          {/* Account (Desktop) */}
          {isLoggedIn ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/account"
                className="flex h-10 items-center gap-2 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 text-xs font-semibold uppercase tracking-widest text-gold-200 transition-all duration-300 hover:border-gold-300/40 hover:bg-gold-400/10 hover:scale-[1.03]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Account
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  aria-label="Log out"
                  title="Log out"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-line bg-ink-soft/40 text-ivory/75 transition-all duration-300 hover:border-red-400/30 hover:bg-red-500/5 hover:text-red-300 hover:scale-105"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/account"
              aria-label="Account"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-ink-line bg-ink-soft/40 text-ivory/75 transition-all duration-300 hover:border-gold-400/25 hover:bg-ink-soft/80 hover:text-gold-300 hover:scale-105 hover:shadow-[0_10px_25px_-12px_rgba(202,161,75,0.4)] sm:flex"
            >
              <User className="h-4.5 w-4.5" />
            </Link>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open cart"
            className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink-line bg-ink-soft/40 text-ivory/75 transition-all duration-300 hover:border-gold-400/25 hover:bg-ink-soft/80 hover:text-gold-300 hover:scale-105 hover:shadow-[0_10px_25px_-12px_rgba(202,161,75,0.4)]"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gold-gradient text-[8px] sm:text-[9px] font-bold text-ink shadow-gold animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-ink-line bg-ink-soft/40 text-ivory/75 hover:border-gold-400/20 hover:text-gold-300 md:hidden transition-all"
          >
            <Menu className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
          </button>
        </div>
      </div>

      {/* Search Panel */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-full z-30 border-b border-gold-400/10 bg-[#0b0a0a]/95 backdrop-blur-lg animate-fadeUp">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-wrap items-center gap-3 px-4 py-4 sm:px-6 md:px-12">
            <Search className="h-4.5 w-4.5 shrink-0 text-gold-300/70" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fragrances..."
              className="flex-1 bg-transparent text-base text-ivory placeholder:text-ivory/30 focus:outline-none"
            />
            <button type="submit" className="btn-gold px-5 py-2 text-xs font-semibold uppercase tracking-wide shrink-0">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-line text-ivory/60 transition-all hover:border-gold-300/30 hover:text-gold-300"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b0a0a] md:hidden animate-fadeUp">
          <div className="absolute inset-0 bg-radial-gradient opacity-[0.03] pointer-events-none" />
          <div className="flex items-center justify-between px-6 py-4 border-b border-gold-400/10">

            {/* Logo */}
            <div className="relative flex h-8 w-28 items-center">
              <div className="absolute left-0 top-1/2 aspect-[3/2] h-20 -translate-y-1/2 overflow-hidden rounded-xl">
                <Image
                  src="/navbar-logo.png"
                  alt="Amairah Perfumes"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Close Toggle */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-full border border-ink-line text-ivory/75 hover:text-gold-300 hover:border-gold-300/30 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-6 py-6 overflow-y-auto max-h-[80vh]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-4 py-3 font-display text-lg tracking-wide transition-all ${pathname === link.href
                    ? "bg-gold-400/10 text-gold-200 font-medium"
                    : "text-ivory hover:bg-ink-soft/50 hover:text-gold-300"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex flex-1 items-center gap-2 rounded-xl px-4 py-3 font-display text-lg tracking-wide text-gold-200 bg-gold-400/5 border border-gold-400/20 hover:bg-gold-400/10 transition-all"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Account
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    aria-label="Log out"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-ink-line text-ivory/75 hover:border-red-400/30 hover:bg-red-500/5 hover:text-red-300 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="btn-gold flex items-center justify-center gap-2 py-3 text-sm font-semibold tracking-widest uppercase"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}

            {categories.length > 0 && (
              <div className="mt-6 border-t border-gold-400/10 pt-6">
                <p className="px-4 pb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold-300/60">Shop Categories</p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm text-ivory hover:bg-ink-soft/50 hover:text-gold-200 transition-all"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
