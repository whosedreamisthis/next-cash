# NextCash

Track your income and expenses and see your monthly cashflow at a glance.

**Live demo:** https://next-cash-six.vercel.app

## Features

- Sign in and sign up with Clerk
- Add, edit and delete income and expense transactions
- Browse transactions by month and year
- Dashboard with an annual cashflow chart and your recent transactions
- Responsive layout for phones, tablets and desktops
- Loading skeletons and cached data via Next.js 16 Cache Components

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Cache Components) and React 19
- [Clerk](https://clerk.com) for authentication
- [Neon](https://neon.tech) Postgres with [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS 4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) (Base UI)
- [Recharts](https://recharts.org) for charts
- React Hook Form and Zod for forms and validation

## Getting started

### Prerequisites

- Node.js 20 or later
- A [Clerk](https://clerk.com) application
- A [Neon](https://neon.tech) Postgres database

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Create a `.env` file in the project root:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# From the Neon dashboard: the pooled and direct connection strings
DATABASE_URL=postgresql://...-pooler...neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://...neon.tech/neondb?sslmode=require
```

### 3. Set up the database

```bash
npm run db:migrate   # create the tables
npm run db:seed      # add the transaction categories
```

To fill your account with a year of sample transactions, sign in once, copy
your user id (`user_...`) from the Clerk dashboard, then run:

```bash
npm run db:seed:transactions -- user_123
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                         | What it does                                        |
| ------------------------------ | --------------------------------------------------- |
| `npm run dev`                  | Start the development server                        |
| `npm run build`                | Build for production                                |
| `npm start`                    | Run the production build                            |
| `npm run lint`                 | Lint with ESLint                                    |
| `npm run db:generate`          | Generate a migration after changing `db/schema.ts`  |
| `npm run db:migrate`           | Apply migrations to the development database        |
| `npm run db:migrate:prod`      | Apply migrations to the production database         |
| `npm run db:studio`            | Open Drizzle Studio                                 |
| `npm run db:seed`              | Add categories to the development database          |
| `npm run db:seed:prod`         | Add categories to the production database           |
| `npm run db:seed:transactions` | Add sample transactions for one user (development)  |

## Production database

The production commands (`db:migrate:prod`, `db:seed:prod`) read their
connection strings from a separate `.env.prod` file, so local work never
touches production by accident. It needs `DATABASE_URL` and
`DATABASE_URL_UNPOOLED` for your production Neon branch.

## Project structure

```
app/          Routes: landing page, dashboard, transactions, sign-in/up
components/   UI components (components/ui holds the shadcn/ui primitives)
data/         Cached database queries
db/           Drizzle schema, client and seed scripts
drizzle/      Generated SQL migrations
lib/          Auth helper, cache tags, Zod schemas and utilities
proxy.ts      Clerk middleware that protects /dashboard
```

## Deployment

The app deploys to [Vercel](https://vercel.com). Add the four environment
variables from step 2 to the Vercel project, then run
`npm run db:migrate:prod` and `npm run db:seed:prod` against your production
database.

For best performance, set the Vercel function region to the one closest to
your Neon database (for example `pdx1` for `us-west-2`).
