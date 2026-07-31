"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Trash2 } from "lucide-react";
import StarRating from "@/components/StarRating";
import { approveReview, deleteReview } from "@/actions/admin/reviews";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
];

export default function ReviewList({ reviews }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("all");

  const handleApprove = (id) => {
    startTransition(async () => {
      await approveReview(id);
      router.refresh();
    });
  };

  const handleDelete = (id) => {
    startTransition(async () => {
      await deleteReview(id);
      router.refresh();
    });
  };

  const filtered = reviews.filter((r) => {
    if (tab === "pending") return !r.is_approved;
    if (tab === "approved") return r.is_approved;
    return true;
  });

  return (
    <div>
      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-300 ${
              tab === t.key
                ? "border-gold-400/30 bg-gold-400/10 text-gold-200"
                : "border-gold-400/10 text-ivory/40 hover:text-ivory"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 py-12 text-center text-sm text-ivory/40 backdrop-blur-md">
          No reviews here.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-5 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating rating={r.rating} size={13} />
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        r.is_approved
                          ? "bg-green-400/15 text-green-300 border-green-400/20"
                          : "bg-gold-400/10 text-gold-200 border-gold-400/20"
                      }`}
                    >
                      {r.is_approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ivory/70">{r.review_text || <em className="text-ivory/30">No comment</em>}</p>
                  <p className="mt-2 text-sm text-ivory/40">
                    {r.profiles?.full_name || r.profiles?.email} on <span className="text-ivory/60">{r.products?.name}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!r.is_approved && (
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={pending}
                      className="flex items-center gap-1 rounded-xl bg-green-400/15 px-3 py-1.5 text-xs font-medium text-green-300 transition-colors hover:bg-green-400/25"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(r.id)}
                    disabled={pending}
                    className="rounded-xl p-2 text-ivory/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
