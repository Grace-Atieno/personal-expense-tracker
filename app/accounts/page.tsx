import { redirect } from "next/navigation";
import { addAccount } from "@/app/actions";
import { AppShell } from "@/components/dashboard-shell";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency } from "@/lib/finance";
import { readStore } from "@/lib/store";

export default async function AccountsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const store = await readStore();
  const accounts = store.accounts.filter((account) => account.userId === user.id);

  return (
    <AppShell user={user}>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 text-lg font-semibold">Create account</div>
          <form action={addAccount} className="grid gap-4 md:grid-cols-3">
            <input name="name" placeholder="Name" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" required />
            <select name="type" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" defaultValue="bank">
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="savings">Savings</option>
              <option value="mobile">Mobile wallet</option>
            </select>
            <input name="balance" type="number" placeholder="Opening balance" className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5" defaultValue={0} />
            <button type="submit" className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white md:col-span-3">Add account</button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <div key={account.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-slate-800">{account.name}</div>
                <div className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">{account.type}</div>
              </div>
              <div className="mt-4 text-2xl font-bold">{formatCurrency(account.balance)}</div>
              <div className="mt-2 text-sm text-slate-500">{account.currency}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
