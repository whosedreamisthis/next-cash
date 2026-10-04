import NewTransactionBreadcrumbs from "@/components/NewTransactionBreadcrumbs";
import {
  LoadingAnnouncement,
  TransactionFormSkeleton,
} from "@/components/Skeletons";

export default function NewTransactionLoading() {
  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <LoadingAnnouncement label="Loading new transaction form" />
      {/* The breadcrumbs don't depend on data, so they render for real */}
      <NewTransactionBreadcrumbs />
      <TransactionFormSkeleton title="New Transaction" />
    </div>
  );
}
