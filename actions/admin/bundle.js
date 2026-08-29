"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { BUNDLE_DEFAULTS } from "@/lib/constants";

export async function getBundleSettingsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("settings").select("bundle").eq("id", 1).maybeSingle();
  return data?.bundle || BUNDLE_DEFAULTS;
}

export async function updateBundleSettings(_prevState, formData) {
  const supabase = createAdminClient();

  const enabled = formData.get("enabled") === "on";
  const bottleCount = Number(formData.get("bottle_count"));
  const title = (formData.get("title") || "").trim();
  const subtitle = (formData.get("subtitle") || "").trim();
  const bannerImageUrl = formData.get("banner_image_url") || null;

  if (!Number.isFinite(bottleCount) || bottleCount < 2) {
    return { error: "Bottle count must be at least 2." };
  }
  if (!title) {
    return { error: "Title is required." };
  }

  const bundle = { enabled, bottle_count: bottleCount, title, subtitle, banner_image_url: bannerImageUrl };

  const { error } = await supabase.from("settings").update({ bundle }).eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/admin/bundle");
  revalidatePath("/bundle");
  return { success: true };
}

export async function getBundleItemsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("bundle_items")
    .select(
      `
      id, sort_order, is_active, created_at,
      products ( id, name, featured_image_url ),
      product_variants ( id, variant_name, price )
    `
    )
    .order("sort_order", { ascending: true });

  return (data || []).map((row) => ({
    id: row.id,
    isActive: row.is_active,
    productId: row.products?.id,
    productName: row.products?.name || "(deleted product)",
    productImage: row.products?.featured_image_url,
    variantId: row.product_variants?.id,
    variantName: row.product_variants?.variant_name || "—",
    price: row.product_variants?.price ?? null,
  }));
}

export async function getAdminProductPickerList() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, is_active, product_variants ( id, variant_name, price, is_active )")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (data || [])
    .map((p) => ({
      id: p.id,
      name: p.name,
      variants: (p.product_variants || [])
        .filter((v) => v.is_active)
        .map((v) => ({ id: v.id, variantName: v.variant_name, price: v.price })),
    }))
    .filter((p) => p.variants.length > 0);
}

export async function addBundleItem(_prevState, formData) {
  const supabase = createAdminClient();
  const productId = formData.get("product_id");
  const variantId = formData.get("variant_id");

  if (!productId || !variantId) return { error: "Choose a product and a size." };

  const { data: existingMax } = await supabase
    .from("bundle_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (existingMax?.sort_order ?? -1) + 1;

  const { error } = await supabase
    .from("bundle_items")
    .insert({ product_id: productId, variant_id: variantId, sort_order: nextSortOrder });

  if (error) {
    if (error.code === "23505") return { error: "This product size is already in the bundle." };
    return { error: error.message };
  }

  revalidatePath("/admin/bundle");
  revalidatePath("/bundle");
  return { success: true };
}

export async function removeBundleItem(id) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("bundle_items").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/bundle");
  revalidatePath("/bundle");
  return { success: true };
}
