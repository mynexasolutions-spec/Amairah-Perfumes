import ProductCard from "./ProductCard";
import BottleGlyph from "./BottleGlyph";
import { whatsappLink } from "@/lib/constants";
import { MessageCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/40 to-ink-soft/10 p-8 sm:p-12 text-center shadow-xl backdrop-blur-sm max-w-xl mx-auto my-6">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(202,161,75,0.04),transparent_60%)] pointer-events-none" />
        
        <div className="relative flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_20px_rgba(212,163,89,0.08)]">
            <BottleGlyph className="h-9 w-auto text-gold-300/80 animate-floatSlow" />
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-light text-ivory tracking-wide">
            No Fragrances Found
          </h3>
          <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-4 mb-4" />
          
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-ivory/50 font-light">
            We couldn't find any fragrances matching your current selection. Try resetting your filters, or chat with us for a personalized recommendation.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/shop"
              className="btn-outline flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-ivory w-full sm:w-auto hover:bg-gold-400/5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gold-300" />
              Reset Filters
            </Link>
            <a
              href={whatsappLink("Hi Amairah Perfumes, I would love a fragrance recommendation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider w-full sm:w-auto hover:scale-[1.02] transition-transform"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
