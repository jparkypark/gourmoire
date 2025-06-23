# Gourmoire - Claude Context

## Project Overview
Gourmoire is a personal recipe web application built as a monorepo with React frontend and Cloudflare Workers backend.

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Mantine + TanStack Query + React Router + React Hook Form + Zod
- **Backend**: Cloudflare Workers + TypeScript + D1 (SQLite) + JWT auth + Zod
- **State Management**: React built-in (useState, useContext, useReducer)
- **Deployment**: Cloudflare Pages + Workers

## Project Structure
```
gourmoire/
├── frontend/          # React application
├── backend/           # Cloudflare Workers API  
├── shared/            # Shared TypeScript types
└── package.json       # Workspace configuration
```

## Development Commands

### Root Workspace
```bash
npm install              # Install all dependencies
npm run dev             # Start frontend dev server
npm run build           # Build frontend and backend
npm run lint            # Lint frontend and backend
npm run type-check      # Type check frontend and backend
```

### Frontend (when in frontend/ directory)
```bash
npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # ESLint
npm run type-check      # TypeScript checking
```

### Backend (when in backend/ directory)
```bash
npm run dev             # Start Wrangler dev server
npm run build           # Build worker
npm run deploy          # Deploy to Cloudflare
npm run lint            # ESLint
npm run type-check      # TypeScript checking
```

## Key Library Choices & Rationale

### React Hook Form
- **Why**: Essential for recipe creation/editing forms with complex validation
- **Benefits**: Excellent performance, minimal re-renders, great TypeScript support
- **Use Cases**: Recipe forms with dynamic ingredient lists, validation, and file uploads (v2)
- **Integration**: Works seamlessly with Mantine components and Zod validation

### Zod
- **Why**: Shared validation schemas between frontend and backend
- **Benefits**: Runtime type safety, excellent TypeScript inference, composable schemas
- **Use Cases**: Recipe data validation, API request/response validation, form validation
- **Integration**: Used in shared/ package, works with React Hook Form via @hookform/resolvers/zod

## Development Phases
1. **Init Project** - Basic setup and documentation ✅
2. **Feature Planning** - Define features, API, and database schema
3. **Frontend Skeleton** - React app with Mantine and routing
4. **Backend Foundation** - Cloudflare Workers with D1 database
5. **Core Functionality** - Recipe CRUD operations
6. **Features & Polish** - Search, tags, deployment

## Key Features (v1)
- Recipe CRUD operations
- Search and filtering by ingredients, tags, cuisine
- Recipe categories/tags management
- Simple ingredient management
- Recipe rating system (1-5 stars)
- Cooking time and difficulty tracking
- JWT authentication (single hardcoded user)
- Responsive design with Mantine components

## Authentication
- Single hardcoded user with JWT tokens
- No user registration or management needed for v1

## Database Design
- SQLite-compatible D1 database
- Main tables: recipes, tags, recipe_tags (junction)
- Focus on simplicity for personal use

## Notes
- This is a personal project, not multi-user
- Prioritize simplicity over complex features
- Use modern, lightweight tools and libraries