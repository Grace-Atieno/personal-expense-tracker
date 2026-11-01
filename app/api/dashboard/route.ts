import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSummaryForUser } from "@/lib/finance";
import { readStore } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await readStore();
  const summary = getSummaryForUser(
    user.id,
    store.accounts,
    store.transactions,
    store.categories,
    store.budgets,
    store.savingsGoals,
    "month",
  );

  return NextResponse.json(summary);
}
