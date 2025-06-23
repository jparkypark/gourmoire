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