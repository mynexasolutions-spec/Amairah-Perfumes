"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin/orders";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const STATUS_STYLES = {
  pending: "text-ivory/70",
  processing: "text-gold-300",
  shipped: "text-blue-300",
  delivered: "text-green-300",
  cancelled: "text-red-300",
  paid: "text-green-300",
  failed: "text-red-300",
  refunded: "text-blue-300",
};

const selectClass =
  "w-full rounded-xl border border-gold-400/10 bg-ink/40 px-4 py-2.5 text-sm capitalize text-ivory transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/20 hover:border-gold-400/20 disabled:opacity-50";
const labelClass = "mb-1.5 block text-sm font-semibold uppercase tracking-wide text-ivory/40";

export default function OrderStatusManager({ order }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleOrderStatus = (e) => {
    startTransition(async () => {
      await updateOrderStatus(order.id, e.target.value);
      router.refresh();
    });
  };

  const handlePaymentStatus = (e) => {
    startTransition(async () => {
      await updatePaymentStatus(order.id, e.target.value);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Order Status</label>
        <select
          defaultValue={order.order_status}
          onChange={handleOrderStatus}
          disabled={pending}
          className={`${selectClass} ${STATUS_STYLES[order.order_status] || ""}`}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-ink capitalize text-ivory">{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Payment Status</label>
        <select
          defaultValue={order.payment_status}
          onChange={handlePaymentStatus}
          disabled={pending}
          className={`${selectClass} ${STATUS_STYLES[order.payment_status] || ""}`}
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-ink capitalize text-ivory">{s}</option>
          ))}
        </select>
      </div>
      {pending && <p className="text-sm text-gold-300/70">Updating…</p>}
    </div>
  );
}
