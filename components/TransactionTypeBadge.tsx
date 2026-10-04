import { Badge } from "@/components/ui/badge";

export default function TransactionTypeBadge({
  type,
}: {
  type: "income" | "expense";
}) {
  return (
    <Badge
      className={
        type === "income"
          ? "bg-lime-500 capitalize"
          : "bg-orange-500 capitalize"
      }
    >
      {type}
    </Badge>
  );
}
