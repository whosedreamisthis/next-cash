import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable } from "@/db/schema";

export async function getCategories() {
  return db.select().from(categoriesTable).orderBy(asc(categoriesTable.name));
}
