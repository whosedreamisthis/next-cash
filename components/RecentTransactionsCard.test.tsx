import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RecentTransactionsCard from "./RecentTransactionsCard";

describe("RecentTransactionsCard", () => {
  it("shows a message when there are no transactions", () => {
    render(<RecentTransactionsCard transactions={[]} />);

    expect(
      screen.getByText("You don't have any transactions yet"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("lists the transactions", () => {
    render(
      <RecentTransactionsCard
        transactions={[
          {
            id: 1,
            description: "Paycheck",
            amount: "2500.00",
            transactionDate: "2026-10-01",
            category: "Salary",
            transactionType: "income",
          },
        ]}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Paycheck")).toBeInTheDocument();
  });

  // Base UI's <Button> gives the links it renders role="button"
  it("links to all transactions and the new transaction page", () => {
    render(<RecentTransactionsCard transactions={[]} />);

    expect(screen.getByRole("button", { name: "View All" })).toHaveAttribute(
      "href",
      "/dashboard/transactions",
    );
    expect(screen.getByRole("button", { name: "Create New" })).toHaveAttribute(
      "href",
      "/dashboard/transactions/new",
    );
  });
});
