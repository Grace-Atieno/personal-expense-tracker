import { promises as fs } from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { FinanceStore, User } from "@/lib/types";

export const STORE_PATH = path.join(process.cwd(), "data", "finance-store.json");

export const defaultUser: User = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@tracker.com",
  passwordHash: bcrypt.hashSync("Password123!", 10),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultData: FinanceStore = {
  users: [defaultUser],
  accounts: [
    {
      id: "acct-cash",
      userId: defaultUser.id,
      name: "Cash",
      type: "cash",
      balance: 18400,
      currency: "KES",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "acct-bank",
      userId: defaultUser.id,
      name: "Bank Account",
      type: "bank",
      balance: 97000,
      currency: "KES",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "acct-savings",
      userId: defaultUser.id,
      name: "Savings",
      type: "savings",
      balance: 65000,
      currency: "KES",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  categories: [
    { id: "cat-food", userId: defaultUser.id, name: "Food", type: "expense", color: "#f97316", icon: "🍽️", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "cat-transport", userId: defaultUser.id, name: "Transport", type: "expense", color: "#0ea5e9", icon: "🚍", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "cat-rent", userId: defaultUser.id, name: "Rent", type: "expense", color: "#8b5cf6", icon: "🏠", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "cat-shopping", userId: defaultUser.id, name: "Shopping", type: "expense", color: "#ec4899", icon: "🛍️", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "cat-salary", userId: defaultUser.id, name: "Salary", type: "income", color: "#22c55e", icon: "💰", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "cat-freelance", userId: defaultUser.id, name: "Freelancing", type: "income", color: "#14b8a6", icon: "🧩", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  transactions: [
    { id: "tx-1", userId: defaultUser.id, accountId: "acct-bank", categoryId: "cat-salary", title: "Monthly Salary", amount: 120000, type: "income", description: "Salary deposit", paymentMethod: "Bank Transfer", occurredAt: new Date(Date.now() - 2 * 86400000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), relatedAccountId: null },
    { id: "tx-2", userId: defaultUser.id, accountId: "acct-bank", categoryId: "cat-food", title: "Groceries", amount: 6500, type: "expense", description: "Weekly groceries", paymentMethod: "Card", occurredAt: new Date(Date.now() - 5 * 86400000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), relatedAccountId: null },
    { id: "tx-3", userId: defaultUser.id, accountId: "acct-bank", categoryId: "cat-transport", title: "Fuel", amount: 3200, type: "expense", description: "Fuel refill", paymentMethod: "Cash", occurredAt: new Date(Date.now() - 9 * 86400000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), relatedAccountId: null },
    { id: "tx-4", userId: defaultUser.id, accountId: "acct-cash", categoryId: "cat-freelance", title: "Freelance Payment", amount: 24000, type: "income", description: "Design project payment", paymentMethod: "Cash", occurredAt: new Date(Date.now() - 12 * 86400000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), relatedAccountId: null },
    { id: "tx-5", userId: defaultUser.id, accountId: "acct-bank", categoryId: "cat-rent", title: "Rent", amount: 35000, type: "expense", description: "Apartment rent", paymentMethod: "Bank Transfer", occurredAt: new Date(Date.now() - 15 * 86400000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), relatedAccountId: null },
  ],
  budgets: [
    { id: "budget-food", userId: defaultUser.id, categoryId: "cat-food", name: "Food Budget", limit: 8000, month: new Date().toISOString().slice(0, 7), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "budget-transport", userId: defaultUser.id, categoryId: "cat-transport", name: "Transport Budget", limit: 5000, month: new Date().toISOString().slice(0, 7), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "budget-rent", userId: defaultUser.id, categoryId: "cat-rent", name: "Rent Budget", limit: 35000, month: new Date().toISOString().slice(0, 7), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  savingsGoals: [
    { id: "goal-emergency", userId: defaultUser.id, name: "Emergency Fund", targetAmount: 250000, currentAmount: 120000, targetDate: "2027-12-31", description: "Emergency cushion", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "goal-laptop", userId: defaultUser.id, name: "Laptop Fund", targetAmount: 120000, currentAmount: 60000, targetDate: "2027-02-28", description: "Upgrade laptop", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  notifications: [
    { id: "n-1", userId: defaultUser.id, title: "Budget alert", message: "Food budget is at 80% utilization", read: false, createdAt: new Date().toISOString() },
    { id: "n-2", userId: defaultUser.id, title: "Savings milestone", message: "Emergency fund reached 48% of target", read: false, createdAt: new Date().toISOString() },
  ],
};

export async function ensureStore() {
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(defaultData, null, 2));
  }
}

export async function readStore(): Promise<FinanceStore> {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, "utf-8");
  return JSON.parse(raw) as FinanceStore;
}

export async function writeStore(data: FinanceStore) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2));
}

export async function getUserByEmail(email: string) {
  const store = await readStore();
  return store.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserById(userId: string) {
  const store = await readStore();
  return store.users.find((user) => user.id === userId) ?? null;
}
