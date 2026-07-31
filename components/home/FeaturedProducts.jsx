import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";

export default function FeaturedProducts({ products }) {
  const items = (products || []).slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section className="relative bg-[#0b0a0a] py-16 sm:py-24 overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <div className="absolute right-[10%] top-0 h-[400px] w-[450px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute left-[5%] top-1/3 h-[400px] w-[450px] rounded-full bg-gold-300/10 blur-[130px]" />
        <div className="absolute right-1/3 bottom-0 h-[350px] w-[400px] rounded-full bg-gold-600/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-400/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-wrap px-6 md:px-12">
        <Reveal className="mb-12 sm:mb-16 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/20 bg-ink-soft/80 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold-200 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-pulse" />
              Handpicked For You
            </span>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-light text-ivory leading-tight">
              Featured{" "}
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400 drop-shadow-[0_2px_15px_rgba(212,175,55,0.2)]">
                Products
              </span>
            </h2>
            <div className="mt-4 h-px w-20 bg-gradient-to-r from-gold-400/60 to-transparent mx-auto sm:mx-0" />
          </div>
          <Link
            href="/shop"
            className="group mt-6 sm:mt-0 inline-flex shrink-0 items-center gap-2 rounded-full border border-gold-400/20 bg-ink-soft/60 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gold-300 backdrop-blur-sm transition-all duration-300 hover:border-gold-300/40 hover:bg-gold-400/10 hover:text-gold-200 hover:scale-[1.03]"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {items.map((product) => (
            <div key={product.id} className="group/slot relative h-full">
              {/* Glow that blooms behind the card on hover */}
              <div className="pointer-events-none absolute -inset-3 rounded-[2.5rem] bg-gold-400/0 blur-2xl transition-all duration-500 group-hover/slot:bg-gold-400/10" />
              <div className="relative h-full">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
