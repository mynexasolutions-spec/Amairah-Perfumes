"use server";

import { createClient } from "@/lib/supabase/server";
import { SHIPPING_DEFAULTS, calculateQuantityDiscount, calculateBundleDiscount } from "@/lib/constants";
import { isCodEnabled, isOnlinePaymentEnabled } from "@/actions/settings";
import { getQuantityDiscountSettings } from "@/actions/admin/quantityDiscount";
import { getBundleSettings } from "@/actions/bundle";
import crypto from "crypto";

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;

  const Razorpay = require("razorpay");
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function isRazorpayEnabled() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

async function resolveCoupon(supabase, code, subtotal) {
  if (!code) return { discountAmount: 0, couponCode: null };

  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", code)
    .eq("is_active", true)
    .maybeSingle();

  if (!coupon) return { error: "Invalid or expired coupon code." };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { error: "This coupon has expired." };
  }
  if (subtotal < Number(coupon.min_purchase)) {
    return { error: `This coupon requires a minimum order of ₹${Number(coupon.min_purchase).toLocaleString("en-IN")}.` };
  }

  const discountAmount =
    coupon.type === "percent"
      ? Math.round((subtotal * Number(coupon.value)) / 100)
      : Number(coupon.value);

  return { discountAmount: Math.min(discountAmount, subtotal), couponCode: coupon.code };
}

export async function validateCoupon(code, subtotal) {
  const supabase = await createClient();
  const result = await resolveCoupon(supabase, code, subtotal);
  if (result.error) return { valid: false, error: result.error };
  return { valid: true, discountAmount: result.discountAmount };
}

export async function processCheckout(addressInput, items, paymentMethod, couponCode) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Please log in to complete checkout.", requiresLogin: true };
  }

  if (!items || items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  if (paymentMethod === "COD" && !(await isCodEnabled())) {
    return { success: false, error: "Cash on Delivery is currently unavailable. Please pay online instead." };
  }
  if (paymentMethod === "RAZORPAY" && !(await isOnlinePaymentEnabled())) {
    return { success: false, error: "Online payment is currently unavailable. Please choose Cash on Delivery." };
  }

  // 1. Save the shipping address (reuse existing latest address if present)
  const { data: existingAddress } = await supabase
    .from("addresses")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const addressPayload = {
    user_id: user.id,
    full_name: addressInput.fullName,
    phone: addressInput.phone,
    address_line_1: addressInput.addressLine1,
    address_line_2: addressInput.addressLine2 || null,
    city: addressInput.city,
    state: addressInput.state,
    postal_code: addressInput.postalCode,
    country: "India",
    is_default: true,
  };

  let addressId;
  if (existingAddress) {
    await supabase.from("addresses").update(addressPayload).eq("id", existingAddress.id);
    addressId = existingAddress.id;
  } else {
    const { data: newAddress, error: addressError } = await supabase
      .from("addresses")
      .insert(addressPayload)
      .select("id")
      .single();
    if (addressError || !newAddress) {
      return { success: false, error: addressError?.message || "Failed to save address." };
    }
    addressId = newAddress.id;
  }

  // 2. Totals
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: settingsRow } = await supabase.from("settings").select("shipping").eq("id", 1).maybeSingle();
  const shipping = settingsRow?.shipping || SHIPPING_DEFAULTS;

  const shippingCost = subtotal >= (shipping.free_threshold ?? SHIPPING_DEFAULTS.free_threshold)
    ? 0
    : shipping.flat_rate ?? SHIPPING_DEFAULTS.flat_rate;
  const codCost = paymentMethod === "COD" ? shipping.cod_charge ?? SHIPPING_DEFAULTS.cod_charge : 0;

  const couponResult = await resolveCoupon(supabase, couponCode, subtotal);
  if (couponResult.error) {
    return { success: false, error: couponResult.error };
  }
  const couponDiscount = couponResult.discountAmount || 0;

  // Automatic discount based on total cart quantity — always recomputed
  // server-side from the live rules, independent of any coupon code.
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const [quantityDiscountSettings, bundleSettings] = await Promise.all([getQuantityDiscountSettings(), getBundleSettings()]);
  const quantityDiscount = calculateQuantityDiscount(totalQuantity, quantityDiscountSettings);
  const bundleDiscount = calculateBundleDiscount(items, bundleSettings);

  const discountAmount = couponDiscount + quantityDiscount + bundleDiscount;

  const totalAmount = Math.max(0, subtotal + shippingCost + codCost - discountAmount);

  const orderNumber = `AMR-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      address_id: addressId,
      subtotal,
      shipping_cost: shippingCost + codCost,
      discount_amount: discountAmount,
      coupon_discount: couponDiscount,
      quantity_discount: quantityDiscount,
      bundle_discount: bundleDiscount,
      coupon_code: couponResult.couponCode || null,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return { success: false, error: orderError?.message || "Failed to create order." };
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    product_name: item.name,
    variant_name: item.variantName,
    price_at_purchase: item.price,
    quantity: item.quantity,
    line_total: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    return { success: false, error: "Failed to save order items." };
  }

  if (paymentMethod === "RAZORPAY") {
    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return { success: false, error: "Online payments are not configured yet. Please choose Cash on Delivery." };
    }
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: order.id,
      });
      // orders has no UPDATE RLS policy for the customer session (only
      // SELECT/INSERT of their own rows) — same class of bug as the stock
      // decrement below, same fix: route it through the service-role client.
      const { createAdminClient: createAdminClientForOrder } = await import("@/lib/supabase/admin");
      await createAdminClientForOrder().from("orders").update({ razorpay_order_id: rzpOrder.id }).eq("id", order.id);

      return {
        success: true,
        isRazorpay: true,
        razorpayOrderId: rzpOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        orderNumber: order.order_number,
        amount: rzpOrder.amount,
      };
    } catch (e) {
      const reason = e?.error?.description || e?.message || "Unknown error";
      console.error("Razorpay order creation failed:", e?.error || e);
      return { success: false, error: `Failed to start online payment: ${reason}` };
    }
  }

  // product_variants only has a public read RLS policy — no update policy
  // for the customer's own session — so this must run with the service-role
  // client, same as the Razorpay path below already does.
  const { createAdminClient } = await import("@/lib/supabase/admin");
  await decrementStock(createAdminClient(), items);

  return { success: true, isRazorpay: false, orderId: order.id, orderNumber: order.order_number };
}

export async function verifyRazorpayPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature, internalOrderId, items) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return { success: false, error: "Razorpay is not configured." };

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return { success: false, error: "Payment verification failed." };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();

  await admin
    .from("orders")
    .update({ payment_status: "paid", razorpay_payment_id: razorpayPaymentId })
    .eq("id", internalOrderId)
    .eq("user_id", user.id);

  await decrementStock(admin, items || []);

  return { success: true, razorpayPaymentId };
}

async function decrementStock(client, items) {
  for (const item of items) {
    if (!item.variantId) continue;
    const { data: variant } = await client
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", item.variantId)
      .maybeSingle();
    if (variant) {
      await client
        .from("product_variants")
        .update({ stock_quantity: Math.max(0, variant.stock_quantity - item.quantity) })
        .eq("id", item.variantId);
    }
  }
}
