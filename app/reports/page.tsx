import { redirect } from "next/navigation";
import { AppShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { buildCsvReport, formatCurrency, getSummaryForUser } from "@/lib/finance";
import { readStore } from "@/lib/store";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const store = await readStore();
  const summary = getSummaryForUser(user.id, store.accounts, store.transactions, store.categories, store.budgets, store.savingsGoals, "month");

  const csvRows = store.transactions
    .filter((tx) => tx.userId === user.id)
    .slice(0, 10)
    .map((tx) => ({ title: tx.title, amount: tx.amount, type: tx.type, account: store.accounts.find((account) => account.id === tx.accountId)?.name ?? "N/A", date: new Date(tx.occurredAt).toISOString().slice(0, 10) }));

  const csv = buildCsvReport(csvRows);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Monthly income</div>
            <div className="mt-2 text-2xl font-bold">{formatCurrency(summary.totalIncome)}</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Monthly expenses</div>
            <div className="mt-2 text-2xl font-bold">{formatCurrency(summary.totalExpenses)}</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Net cash flow</div>
            <div className="mt-2 text-2xl font-bold">{formatCurrency(summary.remainingMonthlyBudget)}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Export report</div>
            <a href="/api/reports" className="rounded-2xl bg-emerald-500 px-4 py-2 font-medium text-white">Download CSV</a>
          </div>
          <div className="rounded-2xl bg-white p-3 text-sm text-slate-600">CSV preview: {csv.split("\n").slice(0, 4).join(" | ")}</div>
        </div>
      </div>
    </AppShell>
  );
}
