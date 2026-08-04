"use client";

import { useEffect, useState } from "react";
import { Truck, ExternalLink } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function DelhiveryTracking({ orderId, trackingNumber, trackingUrl, courierName, cachedStatus }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/delhivery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "track_shipment", payload: { orderId } }),
        });
        const data = await res.json();
        if (!cancelled && data.success) setTracking(data.tracking);
      } catch {
        // Best-effort — the cached status below still shows.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const scans = tracking?.ShipmentData?.[0]?.Shipment?.Scans || [];
  const liveStatus = tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status;

  return (
    <Reveal delay={40} className="card-panel p-6 sm:p-8 hover:border-gold-400/20 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold-400/20 bg-gold-400/10 text-gold-300 shadow-[0_0_15px_rgba(212,163,89,0.1)]">
          <Truck className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl text-ivory">Shipment Tracking</h2>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-base mb-4">
        <span className="text-ivory/50">Courier:</span>
        <span className="text-ivory font-medium">{courierName || "Delhivery"}</span>
        <span className="text-ivory/20">|</span>
        <span className="text-ivory/50">Tracking No:</span>
        <span className="text-ivory font-mono select-all">{trackingNumber}</span>
      </div>

      <a
        href={trackingUrl || `https://www.delhivery.com/track/package/${trackingNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gold-200 transition-all duration-300 hover:border-gold-300/40 hover:bg-gold-400/10"
      >
        <ExternalLink className="h-3.5 w-3.5" /> Track on Delhivery
      </a>

      {loading ? (
        <p className="border-t border-gold-400/10 pt-4 text-sm text-ivory/40">Fetching latest status…</p>
      ) : scans.length > 0 ? (
        <div className="space-y-2 border-t border-gold-400/10 pt-4">
          {scans.map((scan, i) => {
            const sd = scan.ScanDetail || {};
            return (
              <div key={i} className="flex flex-wrap justify-between gap-2 text-sm text-ivory/60">
                <span>{sd.Scan} {sd.ScannedLocation ? `at ${sd.ScannedLocation}` : ""}</span>
                <span className="text-ivory/40">{sd.StatusDateTime ? new Date(sd.StatusDateTime).toLocaleString("en-IN") : ""}</span>
              </div>
            );
          })}
          {liveStatus && (
            <p className="pt-2 font-display text-lg font-semibold capitalize text-gold-300">{liveStatus}</p>
          )}
        </div>
      ) : (
        cachedStatus && (
          <p className="border-t border-gold-400/10 pt-4 text-base text-ivory/60">
            Last known status: <span className="text-ivory">{cachedStatus}</span>
          </p>
        )
      )}
    </Reveal>
  );
}
