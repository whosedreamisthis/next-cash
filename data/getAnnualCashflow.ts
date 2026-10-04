import "server-only";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";

export type MonthlyCashflow = {
  // 1-12
  month: number;
  income: number;
  expenses: number;
};

// Income and expense totals for each month of the year, including empty months
export async function getAnnualCashflow({
  userId,
  year,
}: {
  userId: string;
  year: number;
}): Promise<MonthlyCashflow[]> {
  const month = sql<number>`extract(month from ${transactionsTable.transactionDate})::int`;

  const rows = await db
    .select({
      month,
      type: categoriesTable.type,
      // numeric sums come back as strings to keep their precision
      total: sql<string>`sum(${transactionsTable.amount})`,
    })
    .from(transactionsTable)
    .innerJoin(
      categoriesTable,
      eq(transactionsTable.categoryId, categoriesTable.id),
    )
    .where(
      and(
        eq(transactionsTable.userId, userId),
        gte(transactionsTable.transactionDate, `${year}-01-01`),
        lt(transactionsTable.transactionDate, `${year + 1}-01-01`),
      ),
    )
    .groupBy(month, categoriesTable.type);

  return Array.from({ length: 12 }, (_, i) => {
    const total = (type: "income" | "expense") =>
      Number(
        rows.find((row) => row.month === i + 1 && row.type === type)?.total ??
          0,
      );

    return {
      month: i + 1,
      income: total("income"),
      expenses: total("expense"),
    };
  });
}
