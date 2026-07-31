import Link from "next/link";
import Reveal from "@/components/Reveal";
import { whatsappLink } from "@/lib/constants";
import { Sparkles, MessageSquare, ArrowRight } from "lucide-react";

export default function FindYourScent() {
  return (
    <section className="mx-auto max-w-wrap px-6 pb-20 sm:pb-28 md:px-12">
      <Reveal>
        <div className="group relative overflow-hidden rounded-[2rem] border border-gold-400/20 bg-ink-gradient px-6 py-14 text-center shadow-2xl transition-all duration-500 hover:border-gold-400/35 hover:shadow-[0_20px_50px_-24px_rgba(202,161,75,0.25)] sm:rounded-[2.5rem] sm:px-8 sm:py-20 md:px-16">

          {/* Ambient glows */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(202,161,75,0.06),transparent_60%)]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gold-400/10 blur-[110px]" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-400/10 blur-[100px]" />

          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-gold-300 to-transparent transition-transform duration-700 group-hover:scale-x-100"
          />

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/20 bg-ink-soft/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-200 backdrop-blur-md">
              <Sparkles className="h-3 w-3 animate-pulse text-gold-300" />
              Not Sure Where to Start?
            </span>

            <h2 className="mb-6 font-display text-3xl font-light leading-tight text-ivory sm:text-4xl md:text-5xl lg:text-6xl">
              Let Us Help You Find <br />
              <span className="bg-gradient-to-r from-gold-100 to-gold-400 bg-clip-text font-semibold text-transparent">
                Your Signature Scent
              </span>
            </h2>

            <p className="mb-8 max-w-lg text-sm font-light leading-relaxed text-ivory/60 sm:mb-10 sm:text-lg lg:text-xl">
              Just tell us what you like — woody, floral, fresh, or smoky — and we&rsquo;ll help you pick the right perfume.
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <a
                href={whatsappLink("Hi Amairah Perfumes, can you help me find a fragrance? I usually like...")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-transform hover:scale-[1.02] sm:w-auto sm:px-8 sm:py-4"
              >
                <MessageSquare className="h-4 w-4 text-ink" /> Chat on WhatsApp
              </a>
              <Link
                href="/shop"
                className="btn-outline group/link flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-medium transition-all hover:bg-gold-400/5 sm:w-auto sm:px-8 sm:py-4"
              >
                Browse Full Collection
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
