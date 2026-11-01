import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const store = await readStore();
  return NextResponse.json(store.accounts.filter((account) => account.userId === user.id));
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  const store = await readStore();

  const account = {
    id: crypto.randomUUID(),
    userId: user.id,
    name: data.name,
    type: data.type ?? "bank",
    balance: Number(data.balance ?? 0),
    currency: "KES",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.accounts.push(account);
  await writeStore(store);

  return NextResponse.json({ account });
}
