# Inventory Management Backend

Express.js API server for the Inventory Management System.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your configuration:
   - Supabase URL and Service Key
   - JWT Secret
   - Frontend URL for CORS

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check
- `GET /api` - API information

## Project Structure

```
src/
├── controllers/     # Route handlers
├── routes/         # API routes
├── middleware/     # Custom middleware
├── models/         # Data models
├── utils/          # Utility functions
├── config/         # Configuration files
└── index.ts        # Application entry point
```