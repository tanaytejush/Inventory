# Inventory Management System

A complete inventory management solution for Indian businesses with frontend and backend components.

## Project Structure

```
├── frontend/           # React TypeScript frontend
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Express.js API backend
│   ├── src/           # Source code
│   └── package.json   # Backend dependencies
└── README.md          # This file
```

## Quick Start

### Frontend (React + TypeScript + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### Backend (Express.js + TypeScript)

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

Backend runs on: http://localhost:3000

## Features

- 🏪 **Multi-tenant**: Shop-based inventory management
- 🔐 **Authentication**: Supabase Auth integration
- 📦 **Product Management**: Complete product catalog
- 📊 **Sales Tracking**: Real-time sales monitoring
- 🛒 **Purchase Orders**: Supplier management
- 📈 **Reports & Analytics**: Business insights
- 💰 **Indian Business Context**: GST, PAN, ₹ currency
- 🎨 **Professional UI**: Black & white theme

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for data fetching
- Zustand for state management
- React Router for navigation

### Backend
- Express.js + TypeScript
- Supabase for database
- CORS & Helmet for security
- Jest for testing

## Environment Setup

Both frontend and backend require environment variables. Copy the `.env.example` files and update with your configuration:

- Supabase URL and keys
- JWT secrets
- API endpoints

## Development

1. Set up Supabase project
2. Configure environment variables
3. Start backend server
4. Start frontend development server

See individual README files in `frontend/` and `backend/` directories for detailed setup instructions.