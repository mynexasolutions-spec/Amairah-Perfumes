import { Users, IndianRupee, Repeat, UserPlus } from "lucide-react";
import { getAllUsers } from "@/actions/admin/users";

export const metadata = { title: "Users" };

const ROLE_STYLES = {
  admin: "border-gold-400/25 bg-gold-400/10 text-gold-300",
  customer: "border-ivory/15 bg-ivory/5 text-ivory/60",
};

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  const totalSpend = users.reduce((sum, u) => sum + u.totalSpend, 0);
  const repeatCount = users.filter((u) => u.orderCount > 1).length;
  const newThisMonth = users.filter((u) => {
    const created = new Date(u.created_at);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    { label: "Total Users", value: users.length, icon: Users },
    { label: "Total Spend", value: `₹${totalSpend.toLocaleString("en-IN")}`, icon: IndianRupee },
    { label: "Repeat Buyers", value: repeatCount, icon: Repeat },
    { label: "New This Month", value: newThisMonth, icon: UserPlus },
  ];

  return (
    <div>
      {/* Header Panel */}
      <div className="mb-8 border-b border-gold-400/10 pb-6">
        <h1 className="font-display text-3xl font-light text-ivory">
          All <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-200 to-gold-400">Users</span>
        </h1>
        <p className="text-sm text-ivory/50 font-light mt-1">
          {users.length} registered user{users.length === 1 ? "" : "s"} — customers and admins.
        </p>
      </div>

      {/* Stat Strip */}
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
              <p className="truncate font-display text-lg leading-none text-ivory sm:text-xl">{s.value}</p>
              <p className="truncate text-xs uppercase tracking-wide text-ivory/40">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table (sm and up) */}
      <div className="hidden overflow-x-auto rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-6 backdrop-blur-md shadow-2xl sm:block md:p-8">
        {users.length === 0 ? (
          <p className="py-12 text-center text-sm text-ivory/40">No users yet.</p>
        ) : (
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gold-400/10 text-xs uppercase tracking-widest text-ivory/40 font-semibold">
                <th className="pb-4 font-medium pl-2">Name</th>
                <th className="pb-4 font-medium">Role</th>
                <th className="pb-4 font-medium">Contact</th>
                <th className="pb-4 font-medium">Orders</th>
                <th className="pb-4 font-medium">Total Spend</th>
                <th className="pb-4 font-medium pr-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-400/5">
              {users.map((u) => (
                <tr key={u.id} className="transition-colors duration-300 hover:bg-white/[0.01]">
                  <td className="py-4 pr-4 pl-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ivory">{u.full_name || "—"}</span>
                      {u.orderCount > 1 && (
                        <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-300">
                          VIP
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.customer}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivory/60">
                    <p>{u.email}</p>
                    {u.phone && <p className="text-ivory/35">{u.phone}</p>}
                  </td>
                  <td className="py-4 pr-4 text-sm text-ivory/70">{u.orderCount}</td>
                  <td className="py-4 pr-4 text-sm font-medium text-ivory">₹{u.totalSpend.toLocaleString("en-IN")}</td>
                  <td className="py-4 pr-2 text-sm text-ivory/45">
                    {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card List (mobile only) */}
      <div className="rounded-[2rem] border border-gold-400/10 bg-gradient-to-b from-ink-soft/80 to-ink-soft/30 p-4 backdrop-blur-md shadow-2xl sm:hidden">
        {users.length === 0 ? (
          <p className="py-12 text-center text-sm text-ivory/40">No users yet.</p>
        ) : (
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u.id} className="rounded-2xl border border-gold-400/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-medium text-ivory">{u.full_name || "—"}</span>
                    {u.orderCount > 1 && (
                      <span className="shrink-0 rounded-full border border-gold-400/20 bg-gold-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-300">
                        VIP
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-ivory">₹{u.totalSpend.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.customer}`}>
                    {u.role}
                  </span>
                  <p className="truncate text-sm text-ivory/50">{u.email}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-ivory/40">
                  <span>{u.orderCount} order{u.orderCount === 1 ? "" : "s"}</span>
                  <span>Joined {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
