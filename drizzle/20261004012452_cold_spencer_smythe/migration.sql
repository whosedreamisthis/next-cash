CREATE TABLE "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"description" text NOT NULL,
	"amount" numeric(12,2) NOT NULL,
	"transaction_date" date NOT NULL,
	"category_id" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX "transactions_user_id_date_idx" ON "transactions" ("user_id","transaction_date");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");