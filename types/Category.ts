import type { categoriesTable } from "@/db/schema";

export type Category = typeof categoriesTable.$inferSelect;
