import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { FileText } from "lucide-react";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" updated="July 2026" icon={FileText}>
      <p>By using amairahperfumes.com and placing an order, you agree to the following terms.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Orders &amp; Pricing</h2>
      <p>All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to correct pricing errors and to limit order quantities.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Product Descriptions</h2>
      <p>We describe fragrance notes and longevity to the best of our knowledge; scent perception varies by individual skin chemistry, and we can't guarantee an identical experience for every wearer.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Accounts</h2>
      <p>You're responsible for keeping your account credentials secure and for all activity under your account.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Governing Law</h2>
      <p>These terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts where Amairah Perfumes operates.</p>
      <p>Questions? Write to {BRAND.email}.</p>
    </PolicyLayout>
  );
}
