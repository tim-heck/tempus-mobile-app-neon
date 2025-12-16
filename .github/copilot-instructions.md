# AI Agent Instructions for Time Blocking App

## Architecture Overview

This is a **full-stack mobile + web app** combining:

- **Frontend**: Expo Router (React Native) with NativeWind (Tailwind CSS)
- **Backend**: Hono + Better Auth (server at `server/index.ts`)
- **Database**: PostgreSQL with Drizzle ORM + Neon serverless driver
- **Package Manager**: Bun
- **Environment**: Development uses local Pool; Production uses Neon HTTP

### Data Flow

1. **Authentication**: Users authenticate via Better Auth (email/password, OAuth via plugins)
2. **Session Management**: Sessions stored in PostgreSQL; AsyncStorage caches auth state locally
3. **Protected Routes**: Expo Router's `(protected)` layout redirects unauthenticated users to `/login`
4. **Database Access**: Server queries DB via Drizzle; clients call `/api/auth/*` endpoints

## Critical Conventions

### Path Aliases (tsconfig.json)

Use these consistently:

- `@/*` → `src/*` (generic imports)
- `@app/*` → `src/app/*` (screens/routes)
- `@lib/*` → `src/lib/*` (utilities)
- `@components/*` → `src/components/*` (UI components)

Example: `import { Button } from "@components/Button"`

### Styling: NativeWind + Tailwind

- All styling uses **className (not inline styles)**
- Use `cn()` utility (`src/utils/cn.ts`) to merge Tailwind classes safely with `clsx` + `twMerge`
- Components must accept optional `className` prop to allow overrides
- See `Button.tsx` and `AppText.tsx` for patterns

### React Native Components

- Import from `react-native` (not deprecated platforms)
- Use Pressable for touch interactions (not TouchableOpacity)
- Use Text component with className for all text content

### Authentication & Auth Context

- `AuthProvider` wraps root layout (`src/app/_layout.tsx`)
- `AuthContext` provides: `isLoggedIn`, `isReady`, `logIn()`, `logOut()` methods
- Auth state persists to `AsyncStorage` (key: `"auth-key"`)
- Protect routes in `src/app/(protected)/_layout.tsx` by checking `AuthContext`
- Initial auth state loads with 1s simulated delay; handle with `isReady` check

## Database Schema

Core tables in `server/db/schema.ts`:

- **user**: Basic auth profile (id, email, name, image)
- **session**: Active sessions with expiry and tokens
- **account**: OAuth provider mappings
- **todos**: Time blocks/tasks (userId, title, completed, timestamps)
- **tasks**: Extended task metadata (task_id, bucket_id, color, notes, date ranges)

**Foreign Keys**: `todos` and `session` cascade-delete on user deletion.

## Development Workflows

### Initial Setup

```bash
bun install
bun run db:up          # Start PostgreSQL via docker-compose
bun run db:generate    # Scaffold schema to migrations
bun run db:migrate     # Apply migrations
bun run db:seed        # Optional: populate sample data
```

### Running Locally

- **Both server + app**: `bun run dev` (runs server + iOS via concurrently)
- **Server only**: `bun run server` (Hono + hot reload)
- **App only**: `bun run ios`, `bun run android`, or `bun run web`

### Database Tools

- **Drizzle Studio**: `bun run db:studio` (interactive DB explorer)
- **Auth API docs**: `bun run open-auth-docs` (opens http://localhost:3000/api/auth/reference)

### Linting & Code Quality

- `bun run lint` (Expo lint configuration)

## Key Files Reference

| Path                                       | Purpose                                                           |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `src/app/_layout.tsx`                      | Root navigation layout; wraps with AuthProvider                   |
| `src/app/(protected)`                      | Protected screens; redirects to login if not authenticated        |
| `src/utils/authContext.tsx`                | Global auth state + AsyncStorage persistence                      |
| `src/components/Button.tsx`, `AppText.tsx` | Reusable UI components with className styling                     |
| `src/utils/cn.ts`                          | Utility for safe Tailwind class merging                           |
| `server/index.ts`                          | Hono API server; handles `/api/auth/*` routes                     |
| `server/lib/auth.ts`                       | Better Auth configuration                                         |
| `server/db/schema.ts`                      | Drizzle schema definitions                                        |
| `server/db/db.ts`                          | Database client initialization (Pool for dev, Neon HTTP for prod) |

## Common Tasks

**Add a new protected screen**: Create file in `src/app/(protected)/(tabs)/`, import AuthContext if needed, style with `className` + `cn()`

**Create a reusable component**: Place in `src/components/`, accept `className` prop, use `cn()` for styling

**Add database table**: Define in `server/db/schema.ts`, run `bun run db:generate` + `bun run db:migrate`

**Modify authentication**: Update `server/lib/auth.ts` (e.g., add OAuth providers), restart server

**Fix auth state issues**: Check `src/utils/authContext.tsx` (AsyncStorage, isReady flag, router navigation)
