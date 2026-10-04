"use client";

import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyCashflow } from "@/data/getAnnualCashflow";
import { formatCurrency } from "@/lib/formatCurrency";

// lime-600 and orange-500: checked for colour-blind separation. Income is
// always the left bar of each pair and the legend and tooltip name each
// series, so colour is never the only cue.
const chartConfig = {
  income: { label: "Income", color: "#5ea500" },
  expenses: { label: "Expenses", color: "#ff6900" },
} satisfies ChartConfig;

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
});

export default function CashflowChart({ data }: { data: MonthlyCashflow[] }) {
  const chartData = data.map((month) => ({
    ...month,
    label: format(new Date(2000, month.month - 1, 1), "MMM"),
  }));

  return (
    <ChartContainer config={chartConfig} className="h-64 w-full sm:h-72">
      <BarChart accessibilityLayer data={chartData} barGap={2}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(value: number) => compactCurrency.format(value)}
        />
        <ChartTooltip
          cursor={{ fill: "var(--muted)", opacity: 0.5 }}
          content={<ChartTooltipContent valueFormatter={formatCurrency} />}
        />
        <ChartLegend
          verticalAlign="top"
          align="right"
          content={<ChartLegendContent className="justify-end pt-0 pb-3" />}
        />
        <Bar
          dataKey="income"
          fill="var(--color-income)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="expenses"
          fill="var(--color-expenses)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
