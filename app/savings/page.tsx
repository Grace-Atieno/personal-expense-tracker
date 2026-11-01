import { redirect } from "next/navigation";
import { addSavingsGoal } from "@/app/actions";
import { AppShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/finance";
import { readStore } from "@/lib/store";

export default async function SavingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const store = await readStore();
  const goals = store.savingsGoals.filter((goal) => goal.userId === user.id);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 text-lg font-semibold">Create savings goal</div>
          <form action={addSavingsGoal} className="grid gap-4 md:grid-cols-2">
            <input name="name" placeholder="Goal name" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
            <input name="targetAmount" type="number" min="1" placeholder="Target amount" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
            <input name="currentAmount" type="number" min="0" placeholder="Current saved amount" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" defaultValue={0} />
            <input name="targetDate" type="date" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
            <textarea name="description" placeholder="Description" rows={3} className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 md:col-span-2" />
            <button type="submit" className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white md:col-span-2">Save goal</button>
          </form>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {goals.map((goal) => {
            const progress = goal.targetAmount <= 0 ? 0 : (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <div key={goal.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-lg font-semibold text-slate-800">{goal.name}</div>
                  <div className="text-sm text-slate-500">{Math.round(progress)}%</div>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200">
                  <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
                <div className="mt-3 text-sm text-slate-600">{formatCurrency(goal.currentAmount)} saved of {formatCurrency(goal.targetAmount)}</div>
                <div className="mt-1 text-xs text-slate-500">Target date: {new Date(goal.targetDate).toLocaleDateString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
