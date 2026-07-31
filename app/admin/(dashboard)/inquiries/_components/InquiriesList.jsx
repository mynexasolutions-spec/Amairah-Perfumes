"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { resolveInquiry } from "@/actions/admin/inquiries";

const TABS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "resolved", label: "Resolved" },
];

export default function InquiriesList({ inquiries }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState("all");

  const toggle = (id, current) => {
    startTransition(async () => {
      await resolveInquiry(id, !current);
      router.refresh();
    });
  };

  const filtered = inquiries.filter((inq) => {
    if (tab === "new") return !inq.is_resolved;
    if (tab === "resolved") return inq.is_resolved;
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
          No inquiries here.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((inq) => (
            <li
              key={inq.id}
              className="rounded-2xl border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-5 backdrop-blur-md"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-base text-ivory">{inq.name}</p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                        inq.is_resolved
                          ? "bg-green-400/15 text-green-300 border-green-400/20"
                          : "bg-gold-400/10 text-gold-200 border-gold-400/20"
                      }`}
                    >
                      {inq.is_resolved ? "Resolved" : "New"}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-ivory/40">
                    {inq.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {inq.email}
                      </span>
                    )}
                    {inq.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {inq.phone}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-ivory/70">{inq.message}</p>
                  <p className="mt-2 text-sm text-ivory/30">{new Date(inq.created_at).toLocaleString("en-IN")}</p>
                </div>
                <button
                  onClick={() => toggle(inq.id, inq.is_resolved)}
                  disabled={pending}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-300 ${
                    inq.is_resolved
                      ? "border-gold-400/10 text-ivory/50 hover:text-gold-300"
                      : "border-green-400/20 bg-green-400/10 text-green-300 hover:bg-green-400/20"
                  }`}
                >
                  Mark {inq.is_resolved ? "Unresolved" : "Resolved"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
