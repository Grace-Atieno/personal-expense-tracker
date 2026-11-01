# PocketFlow

PocketFlow is a personal expense and savings tracker built with Next.js, TypeScript, Tailwind CSS, and a server-based financial data store. It includes account tracking, spending categories, budgets, savings goals, and expense reporting.

## Features

- Secure login and registration flow with hashed passwords
- Dashboard with total balance, income, expenses, and savings analytics
- Account management for multiple accounts and balances
- Transaction capture and tracking
- Category and budget management
- Savings goal tracking
- CSV export reports
- Responsive dashboard UI

## Tech stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL-ready schema
- Vitest

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Set `DATABASE_URL` to your PostgreSQL connection, then run:

```bash
npx prisma generate
```

4. Start the app:

```bash
npm run dev
```

5. Log in with:

- demo@tracker.com
- Password123!

## Production deployment

- Use Neon or Supabase for PostgreSQL.
- Set `DATABASE_URL`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` in your environment.
- Run `npx prisma migrate deploy` during deployment.
- Deploy to Vercel using the project root.

## Scripts

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Project structure

- `app/` contains route pages and API endpoints
- `components/` contains reusable dashboard and UI pieces
- `lib/` contains store logic, auth utilities, and finance calculations
- `prisma/schema.prisma` contains the database schema

## Screenshots

Add screenshots to `public/` and reference them here before production release.
