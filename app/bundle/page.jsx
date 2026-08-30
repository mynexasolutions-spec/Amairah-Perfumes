import { notFound } from "next/navigation";
import Image from "next/image";
import { Sparkles } from "lucide-react";
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
      <main className="relative overflow-hidden pb-24 bg-[#0b0a0a] text-ivory">
        {settings.banner_image_url && (
          <div className="relative w-full bg-black">
            <Image
              src={settings.banner_image_url}
              alt={settings.title}
              width={1600}
              height={900}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        )}

        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-gold-400/5 blur-[100px]" />
          <div className="pointer-events-none absolute -right-16 top-10 h-80 w-80 rounded-full bg-gold-300/5 blur-[100px]" />
          <div className="pointer-events-none absolute left-1/3 bottom-0 h-72 w-72 rounded-full bg-gold-600/5 blur-[120px]" />
          <div className="relative mx-auto max-w-wrap px-6 py-10 sm:py-14 md:px-12">
            <p className="eyebrow">
              <span className="gold-line" /> Build Your Own
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-ivory mt-4">{settings.title}</h1>
            {settings.subtitle && <p className="mt-3 max-w-xl text-base sm:text-lg text-ivory/60 font-semibold">{settings.subtitle}</p>}
            {settings.fixed_price != null && (
              <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-200">
                <Sparkles className="h-3 w-3 text-gold-300" />
                Any {settings.bottle_count} for ₹{Number(settings.fixed_price).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </section>

        <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-gold-400/[0.03] blur-[140px]" />

        <div className="relative mx-auto max-w-wrap px-6 pt-8 md:px-12">
          <BundleBuilder products={safeProducts} bottleCount={settings.bottle_count} fixedPrice={settings.fixed_price} />
        </div>
      </main>
      <Footer />
    </>
  );
}
