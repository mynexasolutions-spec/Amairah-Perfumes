import { getActiveCategories } from "@/actions/categories";
import { getActiveAnnouncement } from "@/actions/site";
import { getBundleSettings } from "@/actions/bundle";
import { createClient } from "@/lib/supabase/server";
import Header from "./Header";

export default async function SiteHeader() {
  const supabase = await createClient();
  const [categories, announcement, bundleSettings, { data: { user } }] = await Promise.all([
    getActiveCategories(),
    getActiveAnnouncement(),
    getBundleSettings(),
    supabase.auth.getUser(),
  ]);

  return (
    <Header
      categories={categories}
      announcement={announcement}
      isLoggedIn={Boolean(user)}
      bundleEnabled={Boolean(bundleSettings.enabled)}
    />
  );
}
