import Link from "next/link";
import TransactionsBreadcrumbs from "@/components/TransactionsBreadcrumbs";
import { LoadingAnnouncement, TableSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsLoading() {
  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <LoadingAnnouncement label="Loading transactions" />
      {/* The breadcrumbs don't depend on data, so they render for real */}
      <TransactionsBreadcrumbs />
      <Card className="mt-4">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* The month comes from the URL, which loading.tsx can't read */}
          <CardTitle>Transactions</CardTitle>
          <Skeleton className="h-8 w-52" aria-hidden />
        </CardHeader>
        <CardContent>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/transactions/new" />}
          >
            New Transaction
          </Button>
          <TableSkeleton rows={8} />
        </CardContent>
      </Card>
    </div>
  );
}
