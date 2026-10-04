import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

// Shown when the page calls notFound(): the id doesn't exist, isn't a valid
// id, or belongs to another user
export default function TransactionNotFound() {
  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/transactions" />}>
              Transactions
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Transaction Not Found</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4 w-full max-w-3xl">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <SearchXIcon className="size-6 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-medium">Transaction not found</h1>
          <p className="max-w-sm text-muted-foreground">
            This transaction doesn&apos;t exist or may have been deleted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
