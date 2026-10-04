import {
  date,
  index,
  integer,
  numeric,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { TRANSACTION_TYPES } from "../lib/schemas/transaction";

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  type: text({ enum: TRANSACTION_TYPES }).notNull(),
});

export const transactionsTable = pgTable(
  "transactions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").notNull(),
    description: text().notNull(),
    // Returned as a string (e.g. "12.50") to avoid floating point errors
    amount: numeric({ precision: 12, scale: 2 }).notNull(),
    // "yyyy-MM-dd" string, so the stored date never shifts with timezones
    transactionDate: date("transaction_date", { mode: "string" }).notNull(),
    categoryId: integer("category_id")
      .references(() => categoriesTable.id)
      .notNull(),
  },
  (table) => [
    index("transactions_user_id_date_idx").on(
      table.userId,
      table.transactionDate,
    ),
  ],
);
