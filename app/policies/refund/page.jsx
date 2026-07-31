import PolicyLayout from "@/components/PolicyLayout";
import { BRAND } from "@/lib/constants";
import { RefreshCcw } from "lucide-react";

export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund &amp; Return Policy" updated="July 2026" icon={RefreshCcw}>
      <p>Because our products are fragrances applied to the skin, we're unable to accept returns or exchanges once a bottle has been opened or used, for hygiene reasons.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Damaged or Incorrect Orders</h2>
      <p>If your order arrives damaged, leaking, or different from what you ordered, contact us within 48 hours of delivery with photos of the product and packaging. We'll send a free replacement or issue a full refund.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Cancellations</h2>
      <p>Orders can be cancelled free of charge any time before they are dispatched. Once an order has shipped, it can no longer be cancelled.</p>
      <h2 className="font-display text-xl font-medium text-gold-200">Refund Timeline</h2>
      <p>Approved refunds for prepaid orders are credited to your original payment method within 5-7 business days.</p>
      <p>For any of the above, reach us at {BRAND.email} or on WhatsApp at {BRAND.whatsappDisplay}.</p>
    </PolicyLayout>
  );
}
