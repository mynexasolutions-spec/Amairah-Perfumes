"use server";

import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

const getActiveCategoriesCached = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, description, image_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    return data || [];
  },
  ["active-categories"],
  { revalidate: 120, tags: ["categories"] }
);

export async function getActiveCategories() {
  return getActiveCategoriesCached();
}
