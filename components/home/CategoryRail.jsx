import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function CategoryRail({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-wrap px-6 py-20 md:px-12">
      <Reveal className="mb-10 text-center">
        <p className="eyebrow justify-center">
          <span className="gold-line" /> Shop by Concentration <span className="gold-line" />
        </p>
        <h2 className="section-heading mt-4">Find Your Category</h2>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {categories.map((cat, i) => (
          <Reveal key={cat.id} delay={i * 80}>
            <Link
              href={`/shop?category=${cat.id}`}
              className="group relative block aspect-square overflow-hidden rounded-2xl border border-ink-line bg-ink-soft"
            >
              {cat.image_url ? (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover opacity-70 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                />
              ) : (
                <div className="absolute inset-0 bg-gold-gradient opacity-20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-base text-ivory md:text-lg">{cat.name}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
