import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ContactContent from "./_components/ContactContent";

export const metadata = {
  title: "Contact Us | Amairah Perfumes",
  description: "Get in touch with Amairah Perfumes for scent recommendations, gifting options, and order support.",
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen overflow-hidden pb-24 pt-10 sm:pt-14 bg-[#0b0a0a] text-ivory selection:bg-gold-400/30 selection:text-ivory">
        {/* Decorative background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[120px]" />
          <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-[150px]" />
          <div className="absolute bottom-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-gold-600/5 blur-[130px]" />
        </div>

        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
