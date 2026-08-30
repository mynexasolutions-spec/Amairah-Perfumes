import { Suspense } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import RegisterForm from "./_components/RegisterForm";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-[85vh] items-center justify-center bg-[#0b0a0a] px-6 py-10 sm:py-14 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-[10%] left-[-20%] w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-[120px]" />
          <div className="absolute -bottom-[10%] right-[-20%] w-[500px] h-[500px] rounded-full bg-gold-400/5 blur-[120px]" />
          <div className="absolute top-[45%] left-[45%] w-[400px] h-[400px] rounded-full bg-gold-300/5 blur-[130px]" />
        </div>

        <div className="relative z-10 flex w-full items-center justify-center">
          <Suspense fallback={null}>
            <RegisterForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
