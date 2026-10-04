import Link from "next/link";
import React from "react";

export default function DashboardPage() {
  return (
    <div>
      <Link href="/dashboard/transactions/new">New Transaction</Link>
    </div>
  );
}
