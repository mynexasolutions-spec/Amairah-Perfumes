"use client";

import { useState } from "react";
import { Check, X, MapPin, Loader2 } from "lucide-react";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'serviceable' | 'unserviceable' | 'error'
  const [info, setInfo] = useState(null); // { district, state, cod }

  const handleCheck = async (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setStatus("error");
      setInfo({ message: "Please enter a valid 6-digit PIN code." });
      return;
    }

    setLoading(true);
    setStatus(null);
    setInfo(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/delhivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check_serviceability",
          payload: { pincode: cleanPin },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await res.json();
      
      if (result.success && result.data?.delivery_codes?.length > 0) {
        const codeInfo = result.data.delivery_codes[0]?.postal_code;
        if (codeInfo && codeInfo.is_active === "Y") {
          setStatus("serviceable");
          setInfo({
            district: codeInfo.district,
            state: codeInfo.state_code,
            cod: codeInfo.cod === "Y" || codeInfo.cash === "Y",
          });
        } else {
          setStatus("unserviceable");
        }
      } else {
        setStatus("unserviceable");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setStatus("error");
      if (err.name === "AbortError") {
        setInfo({ message: "Request timed out. Delhivery API is not responding. Please try again." });
      } else {
        setInfo({ message: "Unable to check pincode. Pincode check failed or API not configured." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gold-400/10 bg-ink-soft/20 p-4 sm:p-5 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-gold-300 animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-200">
          Delivery Availability
        </span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
            if (status) setStatus(null);
          }}
          placeholder="Enter 6-digit PIN Code"
          className="flex-1 rounded-xl border border-gold-400/15 bg-ink-soft/40 px-4 py-2.5 text-sm text-ivory placeholder-ivory/30 outline-none transition-colors focus:border-gold-300/40 font-mono"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="rounded-xl bg-gold-gradient px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink transition-opacity hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 flex items-center justify-center min-w-[70px]"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </button>
      </form>

      {status === "serviceable" && info && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300 animate-[fadeIn_0.2s_ease-out] px-1">
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>
            Delivery available to <span className="font-semibold text-ivory">{info.district}, {info.state}</span>
          </span>
        </div>
      )}

      {status === "unserviceable" && (
        <div className="mt-3.5 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-300 animate-[fadeIn_0.2s_ease-out]">
          <X className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
          <div>
            <p className="font-semibold text-red-200">Not Serviceable</p>
            <p className="mt-0.5 text-ivory/60">
              Sorry, we currently do not deliver to this pincode via Delhivery.
            </p>
          </div>
        </div>
      )}

      {status === "error" && info && (
        <div className="mt-3.5 text-xs text-red-400 px-1 animate-[fadeIn_0.2s_ease-out]">
          {info.message}
        </div>
      )}
    </div>
  );
}
