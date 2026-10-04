import {
  BreadcrumbSkeleton,
  LoadingAnnouncement,
  TransactionFormSkeleton,
} from "@/components/Skeletons";

export default function EditTransactionLoading() {
  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10">
      <LoadingAnnouncement label="Loading transaction" />
      {/* The Transactions breadcrumb links to the transaction's month, which
          isn't known until it loads */}
      <BreadcrumbSkeleton items={3} />
      <TransactionFormSkeleton title="Edit Transaction" withAction />
    </div>
  );
}
