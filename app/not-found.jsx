import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow justify-center">
          <span className="gold-line" /> 404
        </p>
        <h1 className="section-heading mt-4">This Page Has Evaporated</h1>
        <p className="mt-3 max-w-sm text-sm text-ivory/55">
          The page you're looking for doesn't exist, or has moved. Let's get you back to the collection.
        </p>
        <Link href="/shop" className="btn-gold mt-8">
          Back to Shop
        </Link>
      </main>
      <Footer />
    </>
  );
}
