import { redirect } from "next/navigation";
import { addTransaction } from "@/app/actions";
import { AppShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/finance";
import { readStore } from "@/lib/store";

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const store = await readStore();
  const accounts = store.accounts.filter((account) => account.userId === user.id);
  const categories = store.categories.filter((category) => category.userId === user.id);
  const transactions = store.transactions.filter((tx) => tx.userId === user.id).sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 text-lg font-semibold">Add transaction</div>
          <form action={addTransaction} className="grid gap-4 md:grid-cols-2">
            <input name="title" placeholder="Transaction title" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
            <input name="amount" type="number" min="1" placeholder="Amount" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
            <select name="type" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" defaultValue="expense">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select name="accountId" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" defaultValue={accounts[0]?.id ?? ""}>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
            <select name="categoryId" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <input name="paymentMethod" placeholder="Payment method" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" defaultValue="Card" />
            <input name="occurredAt" type="date" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 md:col-span-2" defaultValue={new Date().toISOString().slice(0, 10)} />
            <textarea name="description" placeholder="Description" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 md:col-span-2" rows={3} />
            <button type="submit" className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white md:col-span-2">Save transaction</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 text-lg font-semibold">Transactions</div>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-2xl bg-white p-3">
                <div>
                  <div className="font-medium text-slate-800">{tx.title}</div>
                  <div className="text-xs text-slate-500">{new Date(tx.occurredAt).toLocaleDateString()} • {tx.paymentMethod}</div>
                </div>
                <div className={tx.type === "income" ? "text-emerald-600" : "text-amber-600"}>
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
