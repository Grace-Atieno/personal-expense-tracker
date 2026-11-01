"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signInUser, signOutUser } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { Transaction, User } from "@/lib/types";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginUser(formData: FormData) {
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");

  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const store = await readStore();
  const user = store.users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Invalid email or password.");
  }

  await signInUser(user.id);
  redirect("/dashboard");
}

export async function registerUser(formData: FormData) {
  const name = getRequiredString(formData, "name");
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required.");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  const store = await readStore();

  if (store.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with that email already exists.");
  }

  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.users.push(user);
  await writeStore(store);
  await signInUser(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await signOutUser();
  redirect("/login");
}

export async function addAccount(formData: FormData) {
  const name = getRequiredString(formData, "name");
  const type = getRequiredString(formData, "type");
  const balance = Number(getRequiredString(formData, "balance") || 0);

  const user = await requireUser();
  const store = await readStore();

  store.accounts.push({
    id: crypto.randomUUID(),
    userId: user.id,
    name,
    type,
    balance,
    currency: "KES",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await writeStore(store);
  redirect("/accounts");
}

export async function addCategory(formData: FormData) {
  const name = getRequiredString(formData, "name");
  const type = getRequiredString(formData, "type");
  const color = getRequiredString(formData, "color") || "#22c55e";
  const icon = getRequiredString(formData, "icon") || "💸";

  const user = await requireUser();
  const store = await readStore();

  store.categories.push({
    id: crypto.randomUUID(),
    userId: user.id,
    name,
    type: type === "income" ? "income" : "expense",
    color,
    icon,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await writeStore(store);
  redirect("/budgets");
}

export async function addBudget(formData: FormData) {
  const name = getRequiredString(formData, "name");
  const limit = Number(getRequiredString(formData, "limit") || 0);
  const categoryId = getRequiredString(formData, "categoryId");
  const month = getRequiredString(formData, "month") || new Date().toISOString().slice(0, 7);

  const user = await requireUser();
  const store = await readStore();

  store.budgets.push({
    id: crypto.randomUUID(),
    userId: user.id,
    name,
    limit,
    categoryId: categoryId || null,
    month,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await writeStore(store);
  redirect("/budgets");
}

export async function addSavingsGoal(formData: FormData) {
  const name = getRequiredString(formData, "name");
  const targetAmount = Number(getRequiredString(formData, "targetAmount") || 0);
  const currentAmount = Number(getRequiredString(formData, "currentAmount") || 0);
  const targetDate = getRequiredString(formData, "targetDate");
  const description = getRequiredString(formData, "description");

  const user = await requireUser();
  const store = await readStore();

  store.savingsGoals.push({
    id: crypto.randomUUID(),
    userId: user.id,
    name,
    targetAmount,
    currentAmount,
    targetDate,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await writeStore(store);
  redirect("/savings");
}

export async function addTransaction(formData: FormData) {
  const title = getRequiredString(formData, "title");
  const amount = Number(getRequiredString(formData, "amount") || 0);
  const type = getRequiredString(formData, "type");
  const accountId = getRequiredString(formData, "accountId");
  const categoryId = getRequiredString(formData, "categoryId");
  const description = getRequiredString(formData, "description");
  const paymentMethod = getRequiredString(formData, "paymentMethod") || "Cash";
  const occurredAt = getRequiredString(formData, "occurredAt") || new Date().toISOString();

  const user = await requireUser();
  const store = await readStore();

  if (!title || amount <= 0 || !accountId) {
    throw new Error("Valid title, amount, and account are required.");
  }

  const account = store.accounts.find((item) => item.id === accountId && item.userId === user.id);
  if (!account) {
    throw new Error("Account not found.");
  }

  if (type === "income") {
    account.balance = Number(account.balance || 0) + amount;
  } else if (type === "expense") {
    account.balance = Number(account.balance || 0) - amount;
  }

  const transaction: Transaction = {
    id: crypto.randomUUID(),
    userId: user.id,
    accountId,
    categoryId: categoryId || null,
    title,
    amount,
    type: type === "income" || type === "expense" ? type : "expense",
    description,
    paymentMethod,
    occurredAt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedAccountId: null,
  };

  store.transactions.push(transaction);
  await writeStore(store);
  redirect("/transactions");
}

async function requireUser() {
  const { getCurrentUser } = await import("@/lib/auth");
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}
