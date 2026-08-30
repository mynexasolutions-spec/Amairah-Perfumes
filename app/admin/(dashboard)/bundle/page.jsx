import { PackagePlus, Package, CheckCircle2, PackageX, Radio } from "lucide-react";
import { getBundleSettingsAdmin, getBundleItemsAdmin } from "@/actions/admin/bundle";
import BundleSettingsForm from "./_components/BundleSettingsForm";
import BundleItemsManager from "./_components/BundleItemsManager";

export const metadata = { title: "Gift Set Builder" };

export default async function AdminBundlePage() {
  const [settings, items] = await Promise.all([getBundleSettingsAdmin(), getBundleItemsAdmin()]);

  const inStockCount = items.filter((i) => (i.stock ?? 0) > 0).length;
  const outOfStockCount = items.length - inStockCount;

  const stats = [
    { label: "Total Products", value: items.length, icon: Package },
    { label: "In Stock", value: inStockCount, icon: CheckCircle2 },
    { label: "Out of Stock", value: outOfStockCount, icon: PackageX },
    { label: "Gift Set Page", value: settings.enabled ? "Live" : "Hidden", icon: Radio },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 border-b border-gold-400/10 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-ivory">
            Gift Set{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">
              Builder
            </span>
          </h1>
          <p className="text-base text-ivory/50 font-light mt-1">
            Let customers pick any N bottles and build their own gift set at `/bundle`.
          </p>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
          <PackagePlus className="h-4 w-4" />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 px-4 py-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-300">
              <s.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-xl leading-none text-ivory">{s.value}</p>
              <p className="truncate text-xs uppercase tracking-wide text-ivory/40">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <BundleSettingsForm settings={settings} />
        <BundleItemsManager items={items} />
      </div>
    </div>
  );
}
