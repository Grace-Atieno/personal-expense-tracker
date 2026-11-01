import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await readStore();
  return NextResponse.json(store.transactions.filter((tx) => tx.userId === user.id));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const store = await readStore();
  const account = store.accounts.find((item) => item.id === data.accountId && item.userId === user.id);

  if (!account || !data.title || !data.amount) {
    return NextResponse.json({ error: "Invalid transaction payload" }, { status: 400 });
  }

  const transaction = {
    id: crypto.randomUUID(),
    userId: user.id,
    accountId: data.accountId,
    categoryId: data.categoryId ?? null,
    title: data.title,
    amount: Number(data.amount),
    type: data.type ?? "expense",
    description: data.description ?? "",
    paymentMethod: data.paymentMethod ?? "Cash",
    occurredAt: data.occurredAt ?? new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedAccountId: null,
  };

  store.transactions.push(transaction);
  await writeStore(store);

  return NextResponse.json({ transaction });
}
