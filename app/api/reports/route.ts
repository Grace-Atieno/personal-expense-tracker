import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { buildCsvReport } from "@/lib/finance";
import { readStore } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await readStore();
  const rows = store.transactions
    .filter((tx) => tx.userId === user.id)
    .slice(0, 25)
    .map((tx) => ({
      title: tx.title,
      amount: tx.amount,
      type: tx.type,
      account: store.accounts.find((account) => account.id === tx.accountId)?.name ?? "N/A",
      date: new Date(tx.occurredAt).toISOString().slice(0, 10),
    }));

  const csv = buildCsvReport(rows);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pocketflow-report-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
