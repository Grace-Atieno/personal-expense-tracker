import Link from "next/link";
import { redirect } from "next/navigation";
import { registerUser } from "@/app/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Start tracking</div>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Create account</h1>
          <p className="mt-2 text-sm text-slate-600">Build a complete financial picture in minutes.</p>
        </div>

        <form action={registerUser} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input id="name" name="name" type="text" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-emerald-500" placeholder="Jane Doe" />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input id="email" name="email" type="email" required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-emerald-500" placeholder="jane@example.com" />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input id="password" name="password" type="password" required minLength={8} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-emerald-500" placeholder="At least 8 characters" />
          </div>

          <button type="submit" className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600">Create account</button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link href="/login" className="font-semibold text-emerald-600">Sign in</Link>
        </div>
      </div>
    </main>
  );
}
