# Gourmoire

A personal recipe web application for organizing and managing your favorite recipes.

## Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Mantine** - UI component library
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation

### Backend
- **Cloudflare Workers** - Serverless functions
- **Cloudflare D1** - SQLite-compatible database
- **JWT** - Authentication (single hardcoded user)
- **Zod** - Request validation and shared schemas

### Shared
- **TypeScript** - Type safety
- **Zod** - Schema definition and type validation


### Deployment
- **Cloudflare Pages** - Frontend hosting
- **Cloudflare Workers** - Backend hosting

## Project Structure

```
gourmoire/
├── frontend/          # React application
├── backend/           # Cloudflare Workers API
├── shared/            # Shared TypeScript types
├── PHASES.md          # Development phases tracker
├── CLAUDE.md          # Project context for development
└── package.json       # Workspace configuration
```

## Development

This is a monorepo using npm workspaces.

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## Features (Planned)

- Recipe CRUD operations
- Search and filtering
- Tag management
- Responsive design
- Simple authentication

## Planning Documents

- **[PHASES.md](./PHASES.md)** - Development phases and progress tracking
- **[EPICS.md](./EPICS.md)** - High-level feature specifications and requirements
- **[STORIES.md](./STORIES.md)** - User stories with acceptance criteria

## Current Phase

See [PHASES.md](./PHASES.md) for development progress tracking.