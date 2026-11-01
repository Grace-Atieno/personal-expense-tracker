import { redirect } from "next/navigation";
import { AppShell, MetricCard } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency, getSummaryForUser } from "@/lib/finance";
import { readStore } from "@/lib/store";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const store = await readStore();
  const summary = getSummaryForUser(user.id, store.accounts, store.transactions, store.categories, store.budgets, store.savingsGoals, "month");

  const chartData = store.transactions
    .filter((tx) => tx.userId === user.id)
    .slice(0, 5)
    .map((tx) => ({
      name: new Date(tx.occurredAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      income: tx.type === "income" ? tx.amount : 0,
      expense: tx.type === "expense" ? tx.amount : 0,
    }));

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Total Balance" value={formatCurrency(summary.totalBalance)} tone="emerald" />
          <MetricCard label="Income" value={formatCurrency(summary.totalIncome)} tone="blue" />
          <MetricCard label="Expenses" value={formatCurrency(summary.totalExpenses)} tone="amber" />
          <MetricCard label="Savings" value={formatCurrency(summary.totalSavings)} tone="violet" />
          <MetricCard label="Savings Rate" value={`${summary.monthlySavingsRate.toFixed(1)}%`} tone="emerald" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Cash flow overview</h2>
              <div className="text-sm text-slate-500">This month</div>
            </div>
            <div className="flex gap-10 text-sm text-slate-600">
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Income</div>
              <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" />Expenses</div>
            </div>
            <div className="mt-4 space-y-2">
              {chartData.length ? chartData.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <span className="text-sm text-slate-500">{item.name}</span>
                  <span className="text-sm font-medium text-emerald-600">{formatCurrency(item.income)}</span>
                  <span className="text-sm font-medium text-amber-600">{formatCurrency(item.expense)}</span>
                </div>
              )) : <p className="text-sm text-slate-500">No transactions yet.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 text-lg font-semibold">Savings goals</div>
            <div className="space-y-4">
              {store.savingsGoals.filter((goal) => goal.userId === user.id).map((goal) => {
                const ratio = goal.targetAmount <= 0 ? 0 : (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{goal.name}</span>
                      <span className="text-slate-500">{Math.round(ratio)}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-200">
                      <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(ratio, 100)}%` }} />
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 text-lg font-semibold">Recent transactions</div>
            <div className="space-y-3">
              {store.transactions.filter((tx) => tx.userId === user.id).slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-2xl bg-white p-3">
                  <div>
                    <div className="font-medium text-slate-800">{tx.title}</div>
                    <div className="text-xs text-slate-500">{new Date(tx.occurredAt).toLocaleDateString()}</div>
                  </div>
                  <div className={tx.type === "income" ? "text-emerald-600" : "text-amber-600"}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 text-lg font-semibold">Budget status</div>
            <div className="space-y-4">
              {summary.budgetStatus.map((budget) => (
                <div key={budget.id} className="rounded-2xl bg-white p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{budget.name}</span>
                    <span className="text-slate-500">{Math.round(budget.utilization)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200">
                    <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(budget.utilization, 100)}%` }} />
                  </div>
                  <div className="mt-2 text-xs text-slate-500">{formatCurrency(budget.spent)} spent of {formatCurrency(budget.limit)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
