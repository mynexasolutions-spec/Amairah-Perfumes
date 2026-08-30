"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { BUNDLE_DEFAULTS } from "@/lib/constants";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseImages(formData) {
  try {
    const images = JSON.parse(formData.get("images") || "[]");
    return Array.isArray(images) ? images.filter(Boolean) : [];
  } catch {
    return [];
  }
}

// First image becomes the featured/thumbnail image; the rest go into
// product_images as the gallery shown in the storefront product modal.
async function syncBundleImages(supabase, productId, images) {
  await supabase.from("products").update({ featured_image_url: images[0] || null }).eq("id", productId);
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (images.length > 1) {
    await supabase.from("product_images").insert(
      images.slice(1).map((url, i) => ({ product_id: productId, image_url: url, sort_order: i }))
    );
  }
}

export async function getBundleSettingsAdmin() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("settings").select("bundle").eq("id", 1).maybeSingle();
  return data?.bundle || BUNDLE_DEFAULTS;
}

export async function updateBundleSettings(_prevState, formData) {
  const supabase = createAdminClient();

  const enabled = formData.get("enabled") === "on";
  const bottleCount = Number(formData.get("bottle_count"));
  const fixedPriceRaw = formData.get("fixed_price");
  const fixedPrice = fixedPriceRaw ? Number(fixedPriceRaw) : null;
  const title = (formData.get("title") || "").trim();
  const subtitle = (formData.get("subtitle") || "").trim();
  const bannerImageUrl = formData.get("banner_image_url") || null;

  if (!Number.isFinite(bottleCount) || bottleCount < 2) {
    return { error: "Bottle count must be at least 2." };
  }
  if (fixedPrice != null && (!Number.isFinite(fixedPrice) || fixedPrice <= 0)) {
    return { error: "Fixed bundle price must be a positive number, or left blank." };
  }
  if (!title) {
    return { error: "Title is required." };
  }

  const bundle = { enabled, bottle_count: bottleCount, fixed_price: fixedPrice, title, subtitle, banner_image_url: bannerImageUrl };

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
      products ( id, name, short_description, featured_image_url, product_images ( image_url, sort_order ) ),
      product_variants ( id, variant_name, price, original_price, stock_quantity )
    `
    )
    .order("sort_order", { ascending: true });

  return (data || []).map((row) => {
    const gallery = (row.products?.product_images || []).slice().sort((a, b) => a.sort_order - b.sort_order).map((i) => i.image_url);
    return {
      id: row.id,
      isActive: row.is_active,
      productId: row.products?.id,
      productName: row.products?.name || "(deleted product)",
      productDescription: row.products?.short_description || "",
      productImage: row.products?.featured_image_url,
      productImages: [row.products?.featured_image_url, ...gallery].filter(Boolean),
      variantId: row.product_variants?.id,
      variantName: row.product_variants?.variant_name || "—",
      price: row.product_variants?.price ?? null,
      originalPrice: row.product_variants?.original_price ?? null,
      stock: row.product_variants?.stock_quantity ?? null,
    };
  });
}

// Bundle products are created fresh here, not picked from the existing
// catalog — they're inserted into products/product_variants (so cart,
// checkout, and orders keep working completely unmodified) but flagged
// show_in_shop = false so they never surface on /shop, search, or the
// main admin Products list. They only exist for the bundle picker.
export async function addBundleItem(_prevState, formData) {
  const supabase = createAdminClient();

  const name = (formData.get("name") || "").trim();
  const description = (formData.get("description") || "").trim();
  const variantName = (formData.get("variant_name") || "").trim() || "Standard";
  const price = Number(formData.get("price"));
  const originalPriceRaw = formData.get("original_price");
  const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : null;
  const stockQuantity = Number(formData.get("stock_quantity"));
  const images = parseImages(formData);

  if (!name) return { error: "Product name is required." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Valid price is required." };
  if (originalPrice != null && (!Number.isFinite(originalPrice) || originalPrice <= price)) {
    return { error: "Cut price must be a number greater than the actual price, or left blank." };
  }
  if (!Number.isFinite(stockQuantity) || stockQuantity < 0) return { error: "Valid stock quantity is required." };

  const slug = `${slugify(name)}-bundle-${Date.now().toString(36).slice(-5)}`;

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({ name, short_description: description || null, slug, featured_image_url: images[0] || null, is_active: true, show_in_shop: false })
    .select("id")
    .single();

  if (productError || !product) return { error: productError?.message || "Failed to create bundle product." };

  if (images.length > 1) {
    await supabase.from("product_images").insert(
      images.slice(1).map((url, i) => ({ product_id: product.id, image_url: url, sort_order: i }))
    );
  }

  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .insert({
      product_id: product.id,
      variant_name: variantName,
      price,
      original_price: originalPrice,
      stock_quantity: stockQuantity,
      is_active: true,
    })
    .select("id")
    .single();

  if (variantError || !variant) {
    await supabase.from("products").delete().eq("id", product.id);
    return { error: variantError?.message || "Failed to create bundle product size." };
  }

  const { data: existingMax } = await supabase
    .from("bundle_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextSortOrder = (existingMax?.sort_order ?? -1) + 1;

  const { error: bundleItemError } = await supabase
    .from("bundle_items")
    .insert({ product_id: product.id, variant_id: variant.id, sort_order: nextSortOrder });

  if (bundleItemError) {
    await supabase.from("products").delete().eq("id", product.id);
    return { error: bundleItemError.message };
  }

  revalidatePath("/admin/bundle");
  revalidatePath("/bundle");
  return { success: true };
}

export async function updateBundleItem(_prevState, formData) {
  const supabase = createAdminClient();

  const productId = formData.get("product_id");
  const variantId = formData.get("variant_id");
  const name = (formData.get("name") || "").trim();
  const description = (formData.get("description") || "").trim();
  const variantName = (formData.get("variant_name") || "").trim() || "Standard";
  const price = Number(formData.get("price"));
  const originalPriceRaw = formData.get("original_price");
  const originalPrice = originalPriceRaw ? Number(originalPriceRaw) : null;
  const stockQuantity = Number(formData.get("stock_quantity"));
  const images = parseImages(formData);

  if (!productId || !variantId) return { error: "Missing product reference." };
  if (!name) return { error: "Product name is required." };
  if (!Number.isFinite(price) || price <= 0) return { error: "Valid price is required." };
  if (originalPrice != null && (!Number.isFinite(originalPrice) || originalPrice <= price)) {
    return { error: "Cut price must be a number greater than the actual price, or left blank." };
  }
  if (!Number.isFinite(stockQuantity) || stockQuantity < 0) return { error: "Valid stock quantity is required." };

  const { error: productError } = await supabase
    .from("products")
    .update({
      name,
      short_description: description || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);
  if (productError) return { error: productError.message };

  await syncBundleImages(supabase, productId, images);

  const { error: variantError } = await supabase
    .from("product_variants")
    .update({ variant_name: variantName, price, original_price: originalPrice, stock_quantity: stockQuantity })
    .eq("id", variantId);
  if (variantError) return { error: variantError.message };

  revalidatePath("/admin/bundle");
  revalidatePath("/bundle");
  return { success: true };
}

// Bundle-exclusive products have no other purpose, so removing them from
// the bundle deletes the underlying product outright — product_variants
// and the bundle_items row both cascade from that delete.
export async function removeBundleItem(bundleItemId) {
  const supabase = createAdminClient();

  const { data: item } = await supabase
    .from("bundle_items")
    .select("product_id")
    .eq("id", bundleItemId)
    .maybeSingle();

  if (!item) return { success: false, error: "Bundle item not found." };

  const { error } = await supabase.from("products").delete().eq("id", item.product_id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/bundle");
  revalidatePath("/bundle");
  return { success: true };
}
