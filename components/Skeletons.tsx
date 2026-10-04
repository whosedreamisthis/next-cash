import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Placeholders shaped like the real UI, shown by the loading.tsx files while
// a page's data loads

export function BreadcrumbSkeleton({ items = 2 }: { items?: number }) {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      {Array.from({ length: items }, (_, i) => (
        <Skeleton key={i} className="h-4 w-20" />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="mt-4 flex flex-col" aria-hidden>
      <Skeleton className="mb-3 h-5 w-full" />
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 border-b py-3">
          <Skeleton className="h-4 w-12 sm:w-24" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="hidden h-5 w-16 rounded-full sm:block" />
          <Skeleton className="hidden h-4 w-24 md:block" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

const FORM_FIELD_LABELS = [
  "Transaction Type",
  "Category",
  "Transaction Date",
  "Amount",
  "Description",
];

// Matches TransactionForm inside the New/Edit transaction cards. The title and
// field labels are known up front, so only the inputs are placeholders.
export function TransactionFormSkeleton({
  title,
  withAction = false,
}: {
  title: string;
  withAction?: boolean;
}) {
  return (
    <Card className="mt-4 w-full max-w-3xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {withAction && <Skeleton className="size-8" aria-hidden />}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
          {FORM_FIELD_LABELS.map((label, i) => (
            <div
              key={label}
              className={`flex flex-col gap-2 ${i === FORM_FIELD_LABELS.length - 1 ? "sm:col-span-2" : ""}`}
            >
              <span className="text-sm leading-snug font-medium">{label}</span>
              <Skeleton className="h-8 w-full" aria-hidden />
            </div>
          ))}
        </div>
        <Skeleton className="mt-5 h-8 w-full" aria-hidden />
      </CardContent>
    </Card>
  );
}

// Visually hidden text so screen readers announce that content is loading
export function LoadingAnnouncement({ label }: { label: string }) {
  return (
    <span role="status" className="sr-only">
      {label}
    </span>
  );
}
