import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftRight, BarChart3, Banknote, PiggyBank, ShieldCheck, Wallet, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/transactions", label: "Transactions", icon: Banknote },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/budgets", label: "Budgets", icon: ShieldCheck },
  { href: "/savings", label: "Savings", icon: PiggyBank },
  { href: "/reports", label: "Reports", icon: ArrowLeftRight },
];

export function AppShell({ user, children }: { user: { name: string; email: string }; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white">P</div>
            <div>
              <div className="text-lg font-bold">PocketFlow</div>
              <div className="text-xs text-slate-500">Expense tracker</div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl bg-slate-50 p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">Profile</div>
            <div className="mt-3 font-semibold">{user.name}</div>
            <div className="text-sm text-slate-500">{user.email}</div>
            <form action={logoutAction} className="mt-4">
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </form>
          </div>
        </aside>

        <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-emerald-600">Overview</div>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Financial dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                This month
              </div>
              <div className="rounded-2xl bg-emerald-500 px-3 py-2 text-sm font-medium text-white">KES</div>
            </div>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, tone = "emerald" }: { label: string; value: string; tone?: "emerald" | "blue" | "violet" | "amber" }) {
  const toneClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneClasses[tone]}`}>{label}</div>
      <div className="mt-5 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}
