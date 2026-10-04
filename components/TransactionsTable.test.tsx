import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TransactionsTable, { type TransactionRow } from "./TransactionsTable";

const transactions: TransactionRow[] = [
  {
    id: 1,
    description: "Paycheck",
    amount: "2500.00",
    transactionDate: "2026-10-01",
    category: "Salary",
    transactionType: "income",
  },
  {
    id: 2,
    description: "Weekly shop",
    amount: "84.20",
    transactionDate: "2026-10-03",
    category: "Groceries",
    transactionType: "expense",
  },
];

describe("TransactionsTable", () => {
  it("renders a row per transaction", () => {
    render(<TransactionsTable transactions={transactions} />);

    // The header row plus one per transaction
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByText("Paycheck")).toBeInTheDocument();
    expect(screen.getByText("Weekly shop")).toBeInTheDocument();
  });

  it("formats amounts as currency", () => {
    render(<TransactionsTable transactions={transactions} />);

    expect(screen.getByText("$2,500")).toBeInTheDocument();
    expect(screen.getByText("$84.20")).toBeInTheDocument();
  });

  it("shows the full date, and the day only on phones for one month", () => {
    render(<TransactionsTable transactions={transactions} singleMonth />);

    const row = screen.getByText("Paycheck").closest("tr")!;
    expect(within(row).getByText("1st")).toBeInTheDocument();
    expect(within(row).getByText("1st Oct 2026")).toBeInTheDocument();
  });

  // Base UI's <Button> gives the links it renders role="button"
  it("links each row to its edit page only when asked", () => {
    const { rerender } = render(
      <TransactionsTable transactions={transactions} />,
    );
    expect(
      screen.queryByRole("button", { name: "Edit transaction" }),
    ).not.toBeInTheDocument();

    rerender(<TransactionsTable transactions={transactions} showEdit />);
    const links = screen.getAllByRole("button", { name: "Edit transaction" });
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/dashboard/transactions/1",
      "/dashboard/transactions/2",
    ]);
  });
});
