import Link from "next/link";
import { redirect } from "next/navigation";
import { loginUser } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">PocketFlow</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in to manage your finances and savings.</p>
        </div>

        <form action={loginUser} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input id="email" name="email" type="email" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-emerald-500" placeholder="demo@tracker.com" />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input id="password" name="password" type="password" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-emerald-500" placeholder="Password123!" />
          </div>

          <button type="submit" className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">Sign in</button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Need an account? <Link href="/register" className="font-semibold text-emerald-600">Create one</Link>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          Demo account: demo@tracker.com / Password123!
        </div>
      </div>
    </main>
  );
}
