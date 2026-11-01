import type { Account, Budget, Category, SavingsGoal, Transaction } from "@/lib/types";

export type SummaryRange = "week" | "month" | "last-month" | "quarter" | "year";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function toSafeNumber(value: number | string | null | undefined) {
  return Number(value ?? 0) || 0;
}

export function getDateRange(range: SummaryRange) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  switch (range) {
    case "week":
      return {
        from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        to: now,
      };
    case "last-month": {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return {
        from: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        to: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0),
      };
    }
    case "quarter": {
      const quarterStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      return {
        from: quarterStart,
        to: now,
      };
    }
    case "year":
      return {
        from: new Date(now.getFullYear(), 0, 1),
        to: now,
      };
    case "month":
    default:
      return {
        from: start,
        to: now,
      };
  }
}

export function getRangeTransactions(transactions: Transaction[], range: SummaryRange) {
  const { from, to } = getDateRange(range);

  return transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.occurredAt);
    return transactionDate >= from && transactionDate <= to;
  });
}

export function getAccountTotals(accounts: Account[]) {
  return accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
}

export function getBudgetUtilization(amount: number, limit: number) {
  if (limit <= 0) return 0;
  return Math.min((amount / limit) * 100, 100);
}

export function getSummaryForUser(
  userId: string,
  accounts: Account[],
  transactions: Transaction[],
  categories: Category[],
  budgets: Budget[],
  goals: SavingsGoal[],
  range: SummaryRange = "month",
) {
  const userAccounts = accounts.filter((account) => account.userId === userId);
  const userTransactions = transactions.filter((transaction) => transaction.userId === userId);
  const filtered = getRangeTransactions(userTransactions, range);

  const totalBalance = getAccountTotals(userAccounts);
  const totalIncome = filtered
    .filter((txn) => txn.type === "income")
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);
  const totalExpenses = filtered
    .filter((txn) => txn.type === "expense")
    .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);
  const totalSavings = goals
    .filter((goal) => goal.userId === userId)
    .reduce((sum, goal) => sum + Number(goal.currentAmount || 0), 0);

  const monthlySavingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  const remainingMonthlyBudget = totalIncome - totalExpenses;
  const expensesByCategory = categories
    .filter((category) => category.type === "expense")
    .map((category) => ({
      category,
      total: filtered
        .filter((txn) => txn.categoryId === category.id && txn.type === "expense")
        .reduce((sum, txn) => sum + Number(txn.amount || 0), 0),
    }))
    .filter((entry) => entry.total > 0)
    .sort((a, b) => b.total - a.total);

  const budgetStatus = budgets
    .filter((budget) => budget.userId === userId)
    .map((budget) => {
      const spent = filtered
        .filter((txn) => txn.categoryId === budget.categoryId && txn.type === "expense")
        .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);
      return {
        ...budget,
        spent,
        remaining: budget.limit - spent,
        utilization: getBudgetUtilization(spent, budget.limit),
      };
    });

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    totalSavings,
    monthlySavingsRate,
    remainingMonthlyBudget,
    totalTransactions: filtered.length,
    expensesByCategory,
    budgetStatus,
    goals: goals.filter((goal) => goal.userId === userId),
    accounts: userAccounts,
  };
}

export function buildCsvReport(rows: Array<Record<string, string | number>>) {
  if (!rows.length) {
    return "title,amount,type,account,date\n";
  }

  const headers = Object.keys(rows[0]);
  const csvLine = [headers.join(",")]
    .concat(
      rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    )
    .join("\n");

  return csvLine;
}
