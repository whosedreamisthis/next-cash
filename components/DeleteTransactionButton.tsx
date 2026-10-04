"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { deleteTransaction } from "@/app/dashboard/transactions/[transactionId]/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const destructiveClassName = "bg-red-500 text-white hover:bg-red-600";

export default function DeleteTransactionButton({
  transactionId,
  transactionDate,
}: {
  transactionId: number;
  // Used to return to the month the transaction was in
  transactionDate: Date;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteTransaction(transactionId);

    if (result.error) {
      setIsDeleting(false);
      toast.error("ERROR", {
        description: result.message,
        richColors: true,
      });
      return;
    }

    toast.success("SUCCESS", {
      description: "Transaction deleted",
      richColors: true,
    });

    router.push(
      `/dashboard/transactions?month=${transactionDate.getMonth() + 1}&year=${transactionDate.getFullYear()}`,
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            size="icon"
            aria-label="Delete transaction"
            className={destructiveClassName}
          />
        }
      >
        <Trash2Icon />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
          <AlertDialogDescription>
            This can&apos;t be undone. The transaction will be permanently
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={destructiveClassName}
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
