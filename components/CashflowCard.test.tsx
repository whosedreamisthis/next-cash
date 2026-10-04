import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { MonthlyCashflow } from "@/data/getAnnualCashflow";
import CashflowCard from "./CashflowCard";

// Recharts needs a real layout engine and the year select needs the router,
// neither of which this test is about
vi.mock("@/components/CashflowChart", () => ({ default: () => null }));
vi.mock("@/components/CashflowYearSelect", () => ({ default: () => null }));

function cashflow(
  months: Partial<Record<number, Omit<MonthlyCashflow, "month">>>,
) {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    income: months[i + 1]?.income ?? 0,
    expenses: months[i + 1]?.expenses ?? 0,
  }));
}

// Each total is a <dt> label followed by its <dd> value
function total(label: string) {
  return screen.getByText(label).nextElementSibling;
}

describe("CashflowCard", () => {
  it("adds up the year's income, expenses and balance", () => {
    render(
      <CashflowCard
        year={2026}
        cashflow={cashflow({
          1: { income: 3000, expenses: 1200.5 },
          6: { income: 500, expenses: 300 },
        })}
      />,
    );

    expect(total("Income")).toHaveTextContent("$3,500");
    expect(total("Expenses")).toHaveTextContent("$1,500.50");
    expect(total("Balance")).toHaveTextContent("$1,999.50");
  });

  it("shows a positive balance in green", () => {
    render(
      <CashflowCard
        year={2026}
        cashflow={cashflow({ 1: { income: 100, expenses: 50 } })}
      />,
    );

    expect(total("Balance")).toHaveClass("text-lime-700");
  });

  it("shows a negative balance in red", () => {
    render(
      <CashflowCard
        year={2026}
        cashflow={cashflow({ 1: { income: 50, expenses: 100 } })}
      />,
    );

    expect(total("Balance")).toHaveTextContent("-$50");
    expect(total("Balance")).toHaveClass("text-red-600");
  });
});
