import CashflowChart from "@/components/CashflowChart";
import CashflowYearSelect from "@/components/CashflowYearSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyCashflow } from "@/data/getAnnualCashflow";
import { formatCurrency } from "@/lib/formatCurrency";

export default function CashflowCard({
  year,
  cashflow,
}: {
  year: number;
  cashflow: MonthlyCashflow[];
}) {
  const income = cashflow.reduce((sum, month) => sum + month.income, 0);
  const expenses = cashflow.reduce((sum, month) => sum + month.expenses, 0);
  const balance = income - expenses;

  const totals = [
    { label: "Income", value: formatCurrency(income), className: "" },
    { label: "Expenses", value: formatCurrency(expenses), className: "" },
    {
      label: "Balance",
      value: formatCurrency(balance),
      className:
        balance >= 0 ? "font-bold text-lime-700" : "font-bold text-red-600",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Cashflow</CardTitle>
        <CashflowYearSelect year={year} />
      </CardHeader>
      {/* The totals sit beside the chart on large screens, below it otherwise */}
      <CardContent className="grid gap-6 lg:grid-cols-[1fr_14rem]">
        <CashflowChart data={cashflow} />
        <dl className="grid grid-cols-3 gap-4 border-t pt-4 lg:grid-cols-1 lg:content-start lg:gap-0 lg:divide-y lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          {totals.map((total) => (
            <div key={total.label} className="lg:py-4 lg:first:pt-0">
              <dt className="text-sm font-medium text-muted-foreground">
                {total.label}
              </dt>
              <dd
                className={`mt-1 text-lg tabular-nums sm:text-2xl ${total.className}`}
              >
                {total.value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
