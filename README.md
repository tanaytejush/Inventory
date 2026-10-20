# Inventory Management System

A multi-tenant inventory management app built for Indian small businesses. Each shop manages its own products, sales and purchase orders, with GST, PAN and ₹ currency support.

## Features

- **Multi-tenant**: shop-based data separation
- **Authentication** with Supabase Auth
- **Product management**: full product catalogue
- **Sales tracking** and **purchase orders** with supplier management
- **Reports and analytics** for business insights
- **Indian business context**: GST, PAN and ₹ formatting
- Clean black and white UI

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State and data | Zustand, TanStack React Query, React Hook Form, Zod |
| Backend | Express.js, TypeScript |
| Database and auth | Supabase |
| Testing | Jest (backend) |

## Project structure

The project lives in the `inv-frontend/` folder:

```
inv-frontend/
  frontend/   React + TypeScript app (Vite)
  backend/    Express API
  package.json   Root scripts that run both together
```

## Getting started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### Install and configure

```bash
cd inv-frontend
npm run install:all
```

Copy the example environment files and fill in your Supabase URL, keys and secrets:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

See `inv-frontend/frontend/SUPABASE_SETUP.md` for the Supabase setup steps.

### Run

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |

Run only one side with `npm run dev:frontend` or `npm run dev:backend`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend and backend together |
| `npm run build` | Build both |
| `npm run install:all` | Install all dependencies |
| `npm run clean` | Clean build output |
| `npm test` | Run tests |
