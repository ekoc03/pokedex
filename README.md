# Pokémon App

Full-stack Pokémon browser with search, sort, and detail views.

## Stack

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React + TypeScript + Create React App + TanStack Query
- **Styling:** Tailwind CSS

## Quick Start

### Backend
\`\`\`bash
cd backend
npm install
cp .env.example .env
npm run dev  # http://localhost:3000
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
cp .env.example .env
npm start    # http://localhost:3001 (or 3000 if backend is off)
\`\`\`

## Testing

\`\`\`bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
\`\`\`

## Project Structure

\`\`\`
backend/src/
  ├── api/          # Routes, controllers, middleware
  ├── services/     # Business logic
  ├── models/       # Types
  └── lib/          # Utils, external clients

frontend/src/
  ├── components/   # Reusable UI
  ├── pages/        # Page components
  ├── hooks/        # Custom hooks
  ├── services/     # API layer
  └── store/        # State management
\`\`\`

## Features

- ✅ Login with validation
- ✅ Paginated Pokémon list
- ✅ Search & sort
- ✅ Detail view
- ✅ Responsive design
- ✅ Protected routes

## User Story

**As a** Pokémon trainer  
**I want to** browse Pokémon easily  
**So that** I can learn about them