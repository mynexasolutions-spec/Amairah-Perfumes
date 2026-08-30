"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath, revalidateTag } from "next/cache";

// A Razorpay order only represents a real sale once the webhook (or the
// post-payment verify call) has flipped it to "paid" — until then the
// customer may still be sitting in the checkout modal, or may have
// abandoned/failed it entirely. COD has no online-payment step, so it's
// always a real order the moment it's placed.
// Note: kept local (not exported) — a "use server" file may only export
// async functions, and this same filter is duplicated in admin/dashboard.js.
const VISIBLE_ORDERS_FILTER = "payment_method.neq.RAZORPAY,payment_status.eq.paid";

export async function getAllOrdersAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, total_amount, order_status, payment_status, payment_method, tracking_number, courier_name, created_at, profiles ( full_name, email )")
    .or(VISIBLE_ORDERS_FILTER)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getOrderById(id) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select(`
      id, order_number, subtotal, shipping_cost, discount_amount, coupon_discount, quantity_discount, bundle_discount, coupon_code, total_amount,
      payment_method, payment_status, order_status, created_at, razorpay_order_id, razorpay_payment_id,
      tracking_number, courier_name, shipment_status, shipped_at,
      profiles ( full_name, email, phone ),
      addresses ( full_name, phone, address_line_1, address_line_2, city, state, postal_code, country ),
      order_items ( id, product_name, variant_name, price_at_purchase, quantity, line_total, products ( featured_image_url ) )
    `)
    .eq("id", id)
    .or(VISIBLE_ORDERS_FILTER)
    .maybeSingle();

  return data;
}

export async function updateOrderStatus(orderId, orderStatus) {
  const supabase = createAdminClient();
  const payload = { order_status: orderStatus, updated_at: new Date().toISOString() };
  if (orderStatus === "cancelled") payload.cancelled_at = new Date().toISOString();

  const { error } = await supabase.from("orders").update(payload).eq("id", orderId);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function updatePaymentStatus(orderId, paymentStatus) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
