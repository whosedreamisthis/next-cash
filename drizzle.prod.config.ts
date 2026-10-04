// Production: only applies the committed migrations in ./drizzle to the Neon
// production branch configured in .env.prod. Never generate from this config.
// .env.prod is not loaded by Next.js, so the app can't connect to production
// by accident during local builds.
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

const { error } = config({ path: ".env.prod", override: true, quiet: true });
if (error) {
  throw new Error(".env.prod not found; it must hold the production branch URL");
}

const url = process.env.DATABASE_URL_UNPOOLED;
if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED is not set in .env.prod");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
});
