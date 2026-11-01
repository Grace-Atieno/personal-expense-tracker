import { describe, expect, it } from "vitest";
import { getBudgetUtilization, getSummaryForUser } from "@/lib/finance";

const accounts = [
  { id: "a1", userId: "u1", name: "Bank", type: "bank", balance: 15000, currency: "KES", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: "a2", userId: "u1", name: "Savings", type: "savings", balance: 30000, currency: "KES", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const categories = [
  { id: "c1", userId: "u1", name: "Food", type: "expense" as const, color: "#f97316", icon: "🍽️", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
  { id: "c2", userId: "u1", name: "Salary", type: "income" as const, color: "#22c55e", icon: "💰", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const transactions = [
  { id: "t1", userId: "u1", accountId: "a1", categoryId: "c2", title: "Pay", amount: 120000, type: "income" as const, description: "Salary", paymentMethod: "Bank", occurredAt: new Date().toISOString(), createdAt: "2024-01-01", updatedAt: "2024-01-01", relatedAccountId: null },
  { id: "t2", userId: "u1", accountId: "a1", categoryId: "c1", title: "Groceries", amount: 8000, type: "expense" as const, description: "Food", paymentMethod: "Card", occurredAt: new Date().toISOString(), createdAt: "2024-01-01", updatedAt: "2024-01-01", relatedAccountId: null },
];

const budgets = [
  { id: "b1", userId: "u1", categoryId: "c1", name: "Food", limit: 10000, month: "2026-11", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

const goals = [
  { id: "g1", userId: "u1", name: "Emergency", targetAmount: 200000, currentAmount: 50000, targetDate: "2027-01-01", description: "Emergency", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
];

describe("finance calculations", () => {
  it("provides a valid monthly summary", () => {
    const summary = getSummaryForUser("u1", accounts, transactions, categories, budgets, goals, "month");

    expect(summary.totalIncome).toBe(120000);
    expect(summary.totalExpenses).toBe(8000);
    expect(summary.totalSavings).toBe(50000);
    expect(summary.monthlySavingsRate).toBeGreaterThan(0);
  });

  it("calculates utilization percentage safely", () => {
    expect(getBudgetUtilization(8000, 10000)).toBeCloseTo(80, 5);
    expect(getBudgetUtilization(0, 0)).toBe(0);
  });
});
