import { Suspense } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import SortSelect from "@/components/shop/SortSelect";
import { getActiveCategories } from "@/actions/categories";
import { getProducts } from "@/actions/products";

export const metadata = { title: "Shop All Fragrances - Amairah Perfumes" };

const PAGE_SIZE = 20;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const withEllipsis = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(p);
  });
  return withEllipsis;
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getProducts({
      categoryId: params.category || undefined,
      gender: params.gender || undefined,
      sort: params.sort || undefined,
      search: params.search || undefined,
    }),
  ]);

  const activeCategoryName = categories.find((c) => c.id === params.category)?.name;

  const activeChips = [
    params.search ? { key: "search", label: `"${params.search}"` } : null,
    params.category ? { key: "category", label: activeCategoryName || "Category" } : null,
    params.gender ? { key: "gender", label: params.gender } : null,
  ].filter(Boolean);

  const chipHref = (omitKey) => {
    const usp = new URLSearchParams();
    if (params.search && omitKey !== "search") usp.set("search", params.search);
    if (params.category && omitKey !== "category") usp.set("category", params.category);
    if (params.gender && omitKey !== "gender") usp.set("gender", params.gender);
    if (params.sort) usp.set("sort", params.sort);
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(parseInt(params.page, 10) || 1, 1), totalPages);
  const pagedProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pageHref = (pageNum) => {
    const usp = new URLSearchParams();
    if (params.search) usp.set("search", params.search);
    if (params.category) usp.set("category", params.category);
    if (params.gender) usp.set("gender", params.gender);
    if (params.sort) usp.set("sort", params.sort);
    if (pageNum > 1) usp.set("page", String(pageNum));
    const qs = usp.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  // Serialize properties to strip non-serializable fields/prototypes for React 19 compatibility
  const safeProducts = JSON.parse(JSON.stringify(pagedProducts));
  const safeCategories = JSON.parse(JSON.stringify(categories));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen overflow-hidden pb-24 pt-4 sm:pt-10 bg-[#0b0a0a] text-ivory">
        <section className="relative">
          
          {/* Subtle background glows */}
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-400/5 blur-[100px]" />
          <div className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-gold-300/5 blur-[100px]" />
          <div className="pointer-events-none absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-gold-600/5 blur-[120px]" />

          <div className="relative mx-auto max-w-wrap px-6 py-6 sm:py-10 md:px-12 md:py-14">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">
                  <span className="gold-line" /> The Collection
                </p>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory mt-4">
                  {params.search ? `Results for "${params.search}"` : activeCategoryName || "Shop All Fragrances"}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-ivory/50 font-light">
                  {products.length} fragrance{products.length === 1 ? "" : "s"}
                </p>
              </div>
              <Suspense fallback={null}>
                <SortSelect className="hidden w-56 md:block" />
              </Suspense>
            </div>

            {activeChips.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2 animate-fadeUp">
                {activeChips.map((chip) => (
                  <Link
                    key={chip.key}
                    href={chipHref(chip.key)}
                    scroll={false}
                    className="flex items-center gap-1.5 rounded-full border border-gold-400/20 bg-gold-400/10 px-3.5 py-1.5 text-sm text-gold-200 transition-colors hover:border-gold-300"
                  >
                    {chip.label}
                    <X className="h-3 w-3" />
                  </Link>
                ))}
                <Link href="/shop" scroll={false} className="text-sm text-ivory/40 hover:text-red-400 transition-colors ml-2">
                  Clear all
                </Link>
              </div>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-wrap px-6 md:px-12">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[240px_1fr]">
            <aside className="md:sticky md:top-24 md:self-start">
              <Suspense fallback={null}>
                <ShopFilters categories={safeCategories} />
              </Suspense>
            </aside>
            <div>
              <ProductGrid
                products={safeProducts}
                emptyMessage="No fragrances match these filters yet. Try clearing a filter, or message us on WhatsApp for a recommendation."
              />

              {totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <Link
                    href={pageHref(currentPage - 1)}
                    scroll={false}
                    aria-disabled={currentPage === 1}
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                      currentPage === 1
                        ? "pointer-events-none border-ink-line text-ivory/20"
                        : "border-gold-400/20 bg-ink-soft/80 text-gold-300 hover:border-gold-300/40 hover:text-gold-200"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>

                  {getPageNumbers(currentPage, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-sm text-ivory/30">
                        &hellip;
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={pageHref(p)}
                        scroll={false}
                        className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-all ${
                          p === currentPage
                            ? "border-gold-300 bg-gold-400/15 text-gold-200 shadow-gold"
                            : "border-gold-400/10 text-ivory/60 hover:border-gold-400/40 hover:text-ivory"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  )}

                  <Link
                    href={pageHref(currentPage + 1)}
                    scroll={false}
                    aria-disabled={currentPage === totalPages}
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                      currentPage === totalPages
                        ? "pointer-events-none border-ink-line text-ivory/20"
                        : "border-gold-400/20 bg-ink-soft/80 text-gold-300 hover:border-gold-300/40 hover:text-gold-200"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </nav>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
