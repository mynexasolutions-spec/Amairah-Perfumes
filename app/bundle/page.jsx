import { notFound } from "next/navigation";
import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import BundleBuilder from "./_components/BundleBuilder";
import { getBundleSettings, getBundleEligibleProducts } from "@/actions/bundle";

export const metadata = { title: "Build Your Own Bundle - Amairah Perfumes" };

export default async function BundlePage() {
  const [settings, products] = await Promise.all([getBundleSettings(), getBundleEligibleProducts()]);

  if (!settings.enabled || products.length === 0) notFound();

  const safeProducts = JSON.parse(JSON.stringify(products));

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen overflow-hidden pb-24 bg-[#0b0a0a] text-ivory">
        {settings.banner_image_url ? (
          <div className="relative h-56 w-full sm:h-72 md:h-96">
            <Image src={settings.banner_image_url} alt={settings.title} fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a0a] via-[#0b0a0a]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-wrap px-6 pb-8 md:px-12">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory drop-shadow-lg">{settings.title}</h1>
              {settings.subtitle && <p className="mt-2 max-w-xl text-sm sm:text-base text-ivory/70 font-light">{settings.subtitle}</p>}
            </div>
          </div>
        ) : (
          <section className="relative">
            <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-400/5 blur-[100px]" />
            <div className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-gold-300/5 blur-[100px]" />
            <div className="relative mx-auto max-w-wrap px-6 py-10 sm:py-14 md:px-12">
              <p className="eyebrow">
                <span className="gold-line" /> Build Your Own
              </p>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory mt-4">{settings.title}</h1>
              {settings.subtitle && <p className="mt-2 max-w-xl text-sm sm:text-base text-ivory/50 font-light">{settings.subtitle}</p>}
            </div>
          </section>
        )}

        <div className="mx-auto max-w-wrap px-6 pt-8 md:px-12">
          <BundleBuilder products={safeProducts} bottleCount={settings.bottle_count} />
        </div>
      </main>
      <Footer />
    </>
  );
}
