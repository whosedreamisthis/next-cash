import CashflowCard from "@/components/CashflowCard";
import RecentTransactionsCard from "@/components/RecentTransactionsCard";
import { getAnnualCashflow } from "@/data/getAnnualCashflow";
import { getRecentTransactions } from "@/data/getRecentTransactions";
import { getUserId } from "@/lib/auth";
import { parseSearchParam } from "@/lib/parseSearchParam";

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const userId = await getUserId();

  // Falls back to the current year when the param is missing or invalid
  const currentYear = new Date().getFullYear();
  const year = parseSearchParam(
    (await searchParams).year,
    1900,
    currentYear,
    currentYear,
  );

  const [cashflow, recentTransactions] = await Promise.all([
    getAnnualCashflow({ userId, year }),
    getRecentTransactions({ userId }),
  ]);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-10 sm:py-10">
      <CashflowCard year={year} cashflow={cashflow} />
      <RecentTransactionsCard transactions={recentTransactions} />
    </div>
  );
}
