import ProductCard from "./ProductCard";
import BottleGlyph from "./BottleGlyph";

export default function ProductGrid({ products, emptyMessage = "No products found." }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-line bg-ink-soft/20 px-6 py-20 text-center">
        <BottleGlyph className="h-14 w-auto opacity-30" />
        <p className="mt-5 max-w-sm text-sm sm:text-base leading-relaxed text-ivory/40">{emptyMessage}</p>
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
