import { redirect } from "next/navigation";
import { addBudget, addCategory } from "@/app/actions";
import { AppShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency, getBudgetUtilization } from "@/lib/finance";
import { readStore } from "@/lib/store";

export default async function BudgetsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const store = await readStore();
  const categories = store.categories.filter((category) => category.userId === user.id);
  const budgets = store.budgets.filter((budget) => budget.userId === user.id);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 text-lg font-semibold">Create category</div>
            <form action={addCategory} className="space-y-3">
              <input name="name" placeholder="Category name" className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
              <select name="type" className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5" defaultValue="expense">
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <input name="color" type="color" defaultValue="#22c55e" className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-1 py-1" />
              <input name="icon" placeholder="Emoji icon (optional)" className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5" defaultValue="💸" />
              <button type="submit" className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white">Add category</button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 text-lg font-semibold">Set monthly budget</div>
            <form action={addBudget} className="space-y-3">
              <input name="name" placeholder="Budget name" className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
              <input name="limit" type="number" min="1" placeholder="Budget limit in KES" className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
              <select name="categoryId" className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <button type="submit" className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white">Save budget</button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          {budgets.map((budget) => {
            const spent = store.transactions
              .filter((tx) => tx.userId === user.id && tx.categoryId === budget.categoryId && tx.type === "expense")
              .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
            const utilization = getBudgetUtilization(spent, budget.limit);

            return (
              <div key={budget.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-semibold text-slate-800">{budget.name}</div>
                  <div className="text-sm text-slate-500">{Math.round(utilization)}% used</div>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200">
                  <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(utilization, 100)}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Budget: {formatCurrency(budget.limit)}</span>
                  <span>Spent: {formatCurrency(spent)}</span>
                  <span>Remaining: {formatCurrency(budget.limit - spent)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
