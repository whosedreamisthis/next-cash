import NewTransactionBreadcrumbs from "@/components/NewTransactionBreadcrumbs";
import NewTransactionCard from "@/components/NewTransactionCard";
import React from "react";

export default function NewTransactionPage() {
  return (
    <div className="py-10 px-10">
      <NewTransactionBreadcrumbs />
      <NewTransactionCard />
    </div>
  );
}
