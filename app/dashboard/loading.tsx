import Link from "next/link";
import { LoadingAnnouncement, TableSkeleton } from "@/components/Skeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Titles and links are known up front; only the data is a placeholder
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-10 sm:py-10">
      <LoadingAnnouncement label="Loading dashboard" />
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Cashflow</CardTitle>
          <Skeleton className="h-8 w-20" aria-hidden />
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1fr_14rem]">
          <Skeleton className="h-64 w-full sm:h-72" aria-hidden />
          <dl className="grid grid-cols-3 gap-4 border-t pt-4 lg:grid-cols-1 lg:content-start lg:gap-0 lg:divide-y lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            {["Income", "Expenses", "Balance"].map((label) => (
              <div key={label} className="lg:py-4 lg:first:pt-0">
                <dt className="text-sm font-medium text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1">
                  <Skeleton className="h-7 w-24 sm:h-8" aria-hidden />
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard/transactions" />}
            >
              View All
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/transactions/new" />}
            >
              Create New
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
