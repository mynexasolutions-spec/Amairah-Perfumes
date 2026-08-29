import { PackagePlus } from "lucide-react";
import { getBundleSettingsAdmin, getBundleItemsAdmin, getAdminProductPickerList } from "@/actions/admin/bundle";
import BundleSettingsForm from "./_components/BundleSettingsForm";
import BundleItemsManager from "./_components/BundleItemsManager";

export const metadata = { title: "Bundle Builder" };

export default async function AdminBundlePage() {
  const [settings, items, pickerProducts] = await Promise.all([
    getBundleSettingsAdmin(),
    getBundleItemsAdmin(),
    getAdminProductPickerList(),
  ]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 border-b border-gold-400/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-ivory">
            Bundle{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
              Builder
            </span>
          </h1>
          <p className="text-sm text-ivory/50 font-light mt-1">
            Let customers pick any N bottles and build their own set at `/bundle`.
          </p>
          <p className="mt-2 text-sm font-semibold text-red-500">Development phase — not completed yet.</p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
          <PackagePlus className="h-4 w-4" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <BundleSettingsForm settings={settings} />
        <BundleItemsManager items={items} pickerProducts={pickerProducts} />
      </div>
    </div>
  );
}
