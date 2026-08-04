"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, User, Mail, Phone, ChevronRight, Truck, ExternalLink } from "lucide-react";

const STATUS_STYLES = {
  pending: "text-ivory/60 bg-ivory/5 border-ivory/10",
  processing: "text-gold-300 bg-gold-400/10 border-gold-400/20 shadow-[0_0_12px_rgba(212,163,89,0.15)]",
  shipped: "text-blue-300 bg-blue-500/10 border-blue-500/20 shadow-[0_0_12px_rgba(59,130,246,0.12)]",
  delivered: "text-green-400 bg-green-500/10 border-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.15)]",
  cancelled: "text-red-400 bg-red-500/10 border-red-500/20",
};

const TABS = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "profile", label: "My Profile", icon: User },
];

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default function AccountTabs({ profile, orders }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders =
    statusFilter === "all" ? orders : (orders || []).filter((o) => o.order_status === statusFilter);

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 rounded-2xl border border-gold-400/10 bg-ink-soft/30 p-1.5 w-full sm:w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-gold-gradient text-ink shadow-gold"
                  : "text-ivory/60 hover:text-gold-200 hover:bg-ink-soft/50"
              }`}
            >
              <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="mt-8">
          <h2 className="font-display text-xl sm:text-2xl text-ivory mb-6">Order History</h2>

          {orders && orders.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => {
                const isActive = statusFilter === f.key;
                const count = f.key === "all" ? orders.length : orders.filter((o) => o.order_status === f.key).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setStatusFilter(f.key)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "border-gold-400/60 bg-gold-400/10 text-gold-200 shadow-[0_0_15px_rgba(212,163,89,0.1)]"
                        : "border-ink-line bg-ink-soft/30 text-ivory/50 hover:border-gold-400/25 hover:text-ivory"
                    }`}
                  >
                    {f.label}
                    <span className={`text-xs ${isActive ? "text-gold-300/80" : "text-ivory/30"}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          {!orders || orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-line py-16 text-center">
              <p className="text-base text-ivory/40">You haven't placed any orders yet.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-line py-16 text-center">
              <p className="text-base text-ivory/40">No {statusFilter} orders found.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredOrders.map((order) => (
                <li key={order.id} className="card-panel p-5 sm:p-6 hover:border-gold-400/20 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(212,163,89,0.06)] transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-lg sm:text-xl text-ivory break-words">{order.order_number}</p>
                      <p className="text-sm text-ivory/40 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-semibold text-gold-200 mb-1.5">₹{Number(order.total_amount).toLocaleString("en-IN")}</p>
                      <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[order.order_status] || "text-ivory/60 bg-ivory/5 border-ivory/10"}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5 border-t border-ink-line pt-4 text-base text-ivory/55">
                    {order.order_items.map((item, i) => (
                      <li key={i}>
                        {item.product_name} {item.variant_name ? `(${item.variant_name})` : ""} × {item.quantity}
                      </li>
                    ))}
                  </ul>

                  {order.tracking_number && (
                    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gold-400/20 bg-gradient-to-r from-gold-400/10 via-gold-300/5 to-transparent px-4 py-3">
                      <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-gradient shadow-gold">
                        <Truck className="h-4 w-4 text-ink" />
                        {order.order_status !== "delivered" && (
                          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-300/80">
                          {order.courier_name || "Delhivery"} · {order.order_status === "delivered" ? "Delivered" : "On the way"}
                        </p>
                        <p className="truncate font-mono text-sm text-ivory">{order.tracking_number}</p>
                      </div>
                      <a
                        href={order.tracking_url || `https://www.delhivery.com/track/package/${order.tracking_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gold-200 transition-all duration-300 hover:border-gold-300/50 hover:bg-gold-400/20"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Track
                      </a>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end border-t border-ink-line pt-4">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="group/link inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-gold-300 hover:text-gold-200 transition-colors"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* My Profile Tab */}
      {activeTab === "profile" && (
        <div className="mt-8">
          <h2 className="font-display text-xl sm:text-2xl text-ivory mb-6">My Profile</h2>
          <div className="card-panel p-6 sm:p-10 space-y-6">
            <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b border-ink-line">
              <div className="flex h-14 w-14 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.1)]">
                <User className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl sm:text-3xl text-ivory font-medium break-words">{profile?.full_name || "Amairah Customer"}</p>
                <p className="text-sm uppercase tracking-widest text-gold-300/70 mt-1.5">Customer Account</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <Mail className="h-5 w-5 text-gold-400/60 shrink-0" />
              <span className="text-ivory/40">Email</span>
              <ChevronRight className="h-3.5 w-3.5 text-ivory/20 hidden sm:block" />
              <span className="text-ivory font-medium break-all">{profile?.email || "—"}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base">
              <Phone className="h-5 w-5 text-gold-400/60 shrink-0" />
              <span className="text-ivory/40">Phone</span>
              <ChevronRight className="h-3.5 w-3.5 text-ivory/20 hidden sm:block" />
              <span className="text-ivory font-medium break-all">{profile?.phone || "Not provided"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
