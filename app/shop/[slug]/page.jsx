import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ChevronDown, Sparkles, Flame, Wind, Anchor } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import StarRating from "@/components/StarRating";
import ProductGallery from "./_components/ProductGallery";
import ProductPurchasePanel from "./_components/ProductPurchasePanel";
import { ProductVariantProvider } from "./_components/ProductVariantContext";
import ReviewForm from "./_components/ReviewForm";
import ReviewsList from "./_components/ReviewsList";
import { getProductBySlug, getRelatedProducts } from "@/actions/products";
import Reveal from "@/components/Reveal";

// Dedupes the fetch: generateMetadata and the page component both need this
// product, and without caching each would trigger its own DB round trip.
const getCachedProduct = cache(getProductBySlug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) return {};
  return {
    title: `${product.seo_title || product.name} - Amairah Perfumes`,
    description: product.seo_description || product.short_description || undefined,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);

  // Map notes with corresponding luxury icons
  const notes = [
    { label: "Top Notes", value: product.notes_top, icon: Wind, desc: "The initial impression, opening instantly" },
    { label: "Heart Notes", value: product.notes_middle, icon: Flame, desc: "The core identity, evolving over hours" },
    { label: "Base Notes", value: product.notes_base, icon: Anchor, desc: "The lingering depth, lasting all day" },
  ].filter((n) => n.value);

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProduct = JSON.parse(JSON.stringify(product));
  const safeRelatedProducts = JSON.parse(JSON.stringify(relatedProducts));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#0b0a0a] text-ivory overflow-hidden pb-16 sm:pb-24 pt-6 sm:pt-10">
        
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[120px] animate-pulse" />
          <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gold-400/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[5%] left-[25%] w-[500px] h-[500px] rounded-full bg-gold-600/5 blur-[130px]" />
        </div>

        <div className="mx-auto max-w-wrap px-6 md:px-12 relative z-10">

          {/* Breadcrumbs */}
          <div className="mb-6 sm:mb-10 flex flex-wrap items-center gap-2 text-sm text-ivory/40">
            <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="hover:text-gold-300 transition-colors">Shop</Link>
            {product.categoryName && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={`/shop?category=${product.category_id}`} className="hover:text-gold-300 transition-colors">
                  {product.categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-ivory/60 font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <ProductVariantProvider variants={safeProduct.variants}>

            {/* Gallery Panel — sticks in place while purchase details scroll on desktop */}
            <Reveal className="lg:sticky lg:top-[104px] lg:self-start">
              <ProductGallery images={safeProduct.images} name={safeProduct.name} featuredImage={safeProduct.featured_image_url} />
            </Reveal>

            {/* Purchase Options */}
            <Reveal delay={100} className="flex flex-col">
              {product.gender && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/20 bg-ink-soft/80 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-200 backdrop-blur-md mb-4 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-gold-300 animate-pulse" />
                  {product.gender}
                </span>
              )}

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory leading-[1.08]">
                {product.name}
              </h1>
              <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold-400/60 to-transparent" />

              <div className="mt-4 flex items-center gap-2.5">
                <StarRating rating={product.review_count > 0 ? product.average_rating : 0} showValue />
                <span className="text-sm text-ivory/40 font-medium">
                  {product.review_count > 0
                    ? `(${product.review_count} Customer review${product.review_count === 1 ? "" : "s"})`
                    : "No reviews yet"}
                </span>
              </div>

              {product.description && (
                <p className="mt-6 text-base sm:text-lg leading-relaxed text-ivory/65 font-light whitespace-pre-wrap">{product.description}</p>
              )}

              <div className="mt-8 border-t border-ink-line pt-8">
                <ProductPurchasePanel product={safeProduct} variants={safeProduct.variants} />
              </div>

              {/* Olfactory Scent Pyramid Section */}
              {notes.length > 0 && (
                <div className="mt-10 sm:mt-12 border-t border-ink-line pt-6 sm:pt-8">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300 block mb-5">
                    Olfactory Composition
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {notes.map((n, i) => {
                      const NoteIcon = n.icon;
                      return (
                        <div
                          key={n.label}
                          className="group relative rounded-2xl border border-ink-line bg-ink-soft/30 p-5 sm:p-6 hover:border-gold-400/35 hover:bg-ink-soft/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(212,163,89,0.08)] overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none" />
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-400/20 bg-gold-400/5 text-gold-300 shadow-[0_0_15px_rgba(212,163,89,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:border-gold-300/50 group-hover:text-gold-200 group-hover:shadow-[0_0_20px_rgba(212,163,89,0.2)]">
                              <NoteIcon className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-gold-200">
                              {n.label}
                            </p>
                          </div>
                          <p className="text-lg sm:text-xl text-ivory font-medium leading-snug">
                            {n.value}
                          </p>
                          <p className="text-sm text-ivory/45 font-light mt-2 leading-relaxed">
                            {n.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Reveal>
          </ProductVariantProvider>
          </div>

          {/* Product Description Section (Full Width) */}
          {product.short_description && (
            <Reveal className="mt-14 sm:mt-24 border-t border-ink-line pt-10 sm:pt-16 max-w-4xl">
              <p className="eyebrow">
                <span className="gold-line" /> The Story
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-ivory mt-4 mb-6">Product Details</h2>
              <p className="text-base sm:text-lg leading-relaxed text-ivory/60 font-light">
                {product.short_description}
              </p>
            </Reveal>
          )}

          {/* Symmetrical Grid: FAQs on left, Reviews on right */}
          <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 border-t border-ink-line pt-10 sm:pt-16">

            {/* Left Column: FAQs */}
            <Reveal>
              {product.faqs && product.faqs.length > 0 ? (
                <div>
                  <p className="eyebrow">
                    <span className="gold-line" /> Need to Know
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-light text-ivory mt-4 mb-6">Common Questions</h2>
                  <div className="space-y-4">
                    {product.faqs.map((faq) => (
                      <details key={faq.id} className="group overflow-hidden rounded-2xl border border-ink-line bg-ink-soft/30 hover:border-gold-400/30 hover:shadow-[0_0_25px_rgba(212,163,89,0.06)] transition-all duration-300">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base sm:text-lg font-medium text-ivory hover:bg-ink-soft/60">
                          {faq.question}
                          <ChevronDown className="h-4.5 w-4.5 shrink-0 text-gold-300 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="px-5 pb-5 text-sm sm:text-base leading-relaxed text-ivory/60 font-light border-t border-ink-line/30 pt-4 animate-fadeUp">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full rounded-[2rem] border border-dashed border-ink-line p-8 text-center text-ivory/40 py-16 bg-ink-soft/10">
                  <p className="text-base">No FAQs available for this item.</p>
                </div>
              )}
            </Reveal>

            {/* Right Column: Reviews */}
            <Reveal delay={100} className="space-y-6">
              <p className="eyebrow">
                <span className="gold-line" /> Customer Love
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-ivory mt-4 mb-6">Ratings &amp; Reviews</h2>
              <ReviewForm productId={product.id} existingReview={safeProduct.myReview} />

              <ReviewsList reviews={safeProduct.reviews} hasOwnReview={!!safeProduct.myReview} />
            </Reveal>

          </div>

          {/* Related Products */}
          {safeRelatedProducts.length > 0 && (
            <Reveal className="mt-14 sm:mt-24 border-t border-ink-line pt-10 sm:pt-16">
              <p className="eyebrow">
                <span className="gold-line" /> Complementary Selections
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-light text-ivory mt-4 mb-10">You Might Also Like</h2>
              <ProductGrid products={safeRelatedProducts} />
            </Reveal>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
