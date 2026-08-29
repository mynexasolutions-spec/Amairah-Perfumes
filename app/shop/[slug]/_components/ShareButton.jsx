"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Link as LinkIcon, Send, Share2, X } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";

export default function ShareButton({ productName }) {
  const [productUrl, setProductUrl] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const shareText = `Check out ${productName} by Amairah Perfumes`;

  useEffect(() => {
    setProductUrl(window.location.href);
  }, []);

  const copyProductLink = async () => {
    if (!productUrl) return;
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      showToast("Product link copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast("Failed to copy link.");
    }
  };

  const shareNative = async () => {
    if (!productUrl) return;
    if (!navigator.share) {
      await copyProductLink();
      return;
    }
    try {
      await navigator.share({
        title: productName,
        text: shareText,
        url: productUrl,
      });
    } catch (error) {
      if (error?.name !== "AbortError") {
        await copyProductLink();
      }
    }
  };

  const shareOnInstagram = async () => {
    await copyProductLink();
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative z-[1000]">
      <button
        type="button"
        onClick={() => setShareOpen((open) => !open)}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/20 bg-ink-soft/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-200 backdrop-blur-md transition-all duration-300 hover:border-gold-300 hover:text-gold-100 hover:scale-105 hover:shadow-[0_0_15px_rgba(212,163,89,0.15)]"
      >
        <Share2 className="w-3.5 h-3.5 text-gold-300 animate-pulse" />
        <span>Share</span>
      </button>

      {shareOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 transition-all duration-300 animate-[fadeIn_0.2s_ease-out]"
            onClick={() => setShareOpen(false)}
          >
            <div
              className="relative w-full max-w-[min(23rem,calc(100vw-2rem))] overflow-hidden rounded-[2rem] border border-gold-400/25 bg-gradient-to-b from-[#1c1815] via-[#12100e] to-[#0b0a0a] p-6 shadow-[0_32px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(212,163,89,0.12)] transition-all duration-300 animate-[scaleUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Premium Glows */}
              <div className="pointer-events-none absolute -top-24 -left-20 h-48 w-48 rounded-full bg-gold-400/[0.07] blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-20 h-48 w-48 rounded-full bg-gold-500/[0.07] blur-3xl" />
              
              <div className="absolute inset-x-0 top-0 h-px bg-gold-gradient" />
              
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-medium tracking-wide text-ivory">
                    Share Product
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-gold-400/60 mt-0.5">Amairah Perfumes</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/10 bg-ink-soft/85 text-ivory/50 transition-all duration-300 hover:border-gold-400/30 hover:text-gold-200 hover:bg-gold-400/5"
                  aria-label="Close share popup"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="my-5 h-px bg-ink-line" />

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ivory/60 mb-4">Share via social media</p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${shareText}: ${productUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </a>
                <button
                  type="button"
                  onClick={shareOnInstagram}
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-pink-500/25 bg-pink-500/10 text-pink-300 transition-all duration-300 hover:-translate-y-1 hover:border-pink-400/50 hover:bg-pink-500/20 hover:shadow-[0_0_20px_rgba(236,72,153,0.35)]"
                  aria-label="Share on Instagram"
                >
                  <FaInstagram className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </button>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-sky-500/25 bg-sky-500/10 text-sky-300 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/50 hover:bg-sky-500/20 hover:shadow-[0_0_20px_rgba(14,165,233,0.35)]"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                  aria-label="Share on Twitter"
                >
                  <FaTwitter className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                </a>
                <button
                  type="button"
                  onClick={shareNative}
                  className="group flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/25 bg-gold-400/10 text-gold-200 transition-all duration-300 hover:-translate-y-1 hover:border-gold-300/50 hover:bg-gold-400/20 hover:shadow-[0_0_20px_rgba(212,163,89,0.35)]"
                  aria-label="Open more share options"
                >
                  <Send className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>

              <div className="my-5 h-px bg-ink-line" />

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ivory/60 mb-3">Or copy product link</p>

              <div className="group/copy flex items-stretch overflow-hidden rounded-2xl border border-gold-400/15 bg-ink-soft/40 transition-colors duration-300 hover:border-gold-400/35">
                <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3 text-sm text-ivory/60">
                  <LinkIcon className="h-4 w-4 shrink-0 text-gold-300" />
                  <span className="truncate pr-2 font-mono text-xs text-ivory/50">{productUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={copyProductLink}
                  className={`shrink-0 px-5 text-xs font-semibold uppercase tracking-wider text-ink transition-all duration-300 flex items-center gap-1.5 ${
                    copied
                      ? "bg-emerald-500 text-white font-medium"
                      : "bg-gold-gradient hover:opacity-90 active:scale-95"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 animate-[scaleUp_0.2s_ease-out]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <span>Copy</span>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
