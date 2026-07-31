"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  LayoutTemplate,
  Quote,
  Megaphone,
  Tag,
  Truck,
  Layers,
  UserCog,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { adminLogout } from "@/actions/auth";

const NAV_GROUPS = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Products", href: "/admin/products", icon: Package },
    ],
  },
  {
    title: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Home Customization", href: "/admin/hero-slides", icon: LayoutTemplate },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Coupons", href: "/admin/settings/coupons", icon: Tag },
      { label: "Shipping Settings", href: "/admin/settings/shipping", icon: Truck },
      { label: "Quantity Discount", href: "/admin/settings/quantity-discount", icon: Layers },
      { label: "My Profile", href: "/admin/settings/profile", icon: UserCog },
    ],
  },
];

export default function AdminSidebar({ adminName = "Admin", badges = {} }) {
  const pathname = usePathname();
  const { mobileOpen, setMobileOpen } = useAdminSidebar();
  const initial = adminName.trim().charAt(0).toUpperCase();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-gold-400/10 bg-gradient-to-b from-[#110e0d] via-[#090807] to-[#050404] backdrop-blur-md transition-transform duration-300 lg:static lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top accent line */}
        <div className="h-px w-full shrink-0 bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

        <div className="relative flex h-16 shrink-0 items-center gap-3 border-b border-gold-400/10 px-5">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-gold-400/10 blur-3xl" />
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold-400/20 bg-gradient-to-tr from-gold-500/10 to-gold-400/20 p-1.5 shadow-[0_0_15px_rgba(212,163,89,0.15)]">
            <Image src="/logo.png" alt="Amairah" width={20} height={20} className="h-5 w-5 object-contain" />
          </div>
          <div className="relative flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold tracking-wider text-ivory">Amairah Perfumes</p>
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-gold-300/60 font-semibold">Admin Panel</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="relative p-1 text-ivory/50 hover:text-ivory lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gold-400/5 scrollbar-track-transparent">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-400/35">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === "/admin" || item.href === "/admin/settings"
                      ? pathname === item.href
                      : pathname.startsWith(item.href);
                  const badgeCount = badges[item.href];
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group relative flex items-center gap-3 rounded-xl border-l-2 px-3 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 ${
                        active
                          ? "border-gold-400 bg-gradient-to-r from-gold-400/12 to-transparent text-gold-200 shadow-[inset_1px_0_0_rgba(212,163,89,0.1)]"
                          : "border-transparent text-ivory/50 hover:border-gold-400/25 hover:bg-white/[0.02] hover:text-ivory hover:translate-x-0.5"
                      }`}
                    >
                      <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors duration-300 ${
                          active ? "text-gold-300 filter drop-shadow-[0_0_5px_rgba(212,163,89,0.5)]" : "text-ivory/40 group-hover:text-gold-300/80"
                        }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {!!badgeCount && (
                        <span
                          className={`flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                            active ? "bg-gold-400/25 text-gold-200" : "bg-red-400/20 text-red-300 group-hover:bg-red-400/25"
                          }`}
                        >
                          {badgeCount > 99 ? "99+" : badgeCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-gold-400/10 bg-black/20 p-3">
          <div className="flex items-center gap-3 rounded-2xl border border-gold-400/10 bg-white/[0.02] p-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-gradient text-xs font-bold text-ink shadow-gold">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ivory">{adminName}</p>
              <p className="truncate text-[10px] uppercase tracking-widest text-gold-300/50">Administrator</p>
            </div>
            <form action={adminLogout}>
              <button
                type="submit"
                title="Log out"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ivory/40 transition-colors hover:bg-red-400/10 hover:text-red-300"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
