# AGENTS.md — Guidance for AI coding agents

## Purpose

Short instructions to help AI agents be productive in this repository.

## Quick links

- [README.md](README.md) — Project overview
- [apps/api/README.md](apps/api/README.md) — Backend documentation
- [apps/web/README.md](apps/web/README.md) — Frontend documentation

## Project Status & Important Notes

🔧 **This project is in early development.** All shared packages (`@open-garage-flow/auth`, `@open-garage-flow/config`, `@open-garage-flow/database`, `@open-garage-flow/shared`, `@open-garage-flow/ui`) are currently **scaffolded but empty**. Prisma schema is not initialized, and no database migrations exist yet. Do not assume implementations exist in these packages — verify before using.

## Repository overview

- **Root layout**: `apps/`, `packages/`, `docker/`, `scripts/`.
- **apps/api**: NestJS 11 backend. Backend code lives under `apps/api/src/` and `apps/api/test/`. Currently only bootstrap files (`app.module.ts`, `app.controller.ts`, `app.service.ts`, `main.ts`). Feature modules expected to follow NestJS conventions (e.g., `users/`, `auth/`, `customers/`).
- **apps/web**: Next.js 16 frontend with App Directory (server components by default). Code lives under `apps/web/app/` and `apps/web/public/`. Uses Tailwind CSS 4 and PostCSS.
- **packages/**: Shared implementation directories (`auth`, `config`, `database`, `shared`, `ui`). Each has a `package.json` but contains no implementation code yet. Import using `@open-garage-flow/<package-name>` syntax.
- **Workspace configuration**: Uses `pnpm-workspace.yaml` (pnpm 11.11.0+), `pnpm-lock.yaml`, and root `package.json` with orchestration scripts. No root TypeScript code — all code in `apps/` or `packages/`.

## Getting Started (Local Development)

1. **Prerequisites**: Node 24+ and pnpm 11.11.0+.
2. **Install dependencies**: `pnpm install` (from workspace root).
3. **Start PostgreSQL**: `docker-compose -f docker/compose.yml up -d`.
4. **Initialize database** (when Prisma schema is ready): `cd apps/api && pnpm exec prisma migrate dev`.
5. **Run both services**:
   - `pnpm dev` (all services in parallel)
   - Or individual services: `pnpm api:dev` (backend at http://localhost:3001) and `pnpm web:dev` (frontend at http://localhost:3000)
6. **Backend API docs**: http://localhost:3001/api (Swagger auto-configured via `@nestjs/swagger`)

## Database & Prisma Setup

- **Status**: Not yet initialized. Prisma schema should be created at `packages/database/schema.prisma` (plan only—not yet implemented).
- **Database**: PostgreSQL 17 configured in `docker/compose.yml`.
- **Environment**: Docker `.env` variables are defined in `docker/compose.yml` (POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT).
- **Migrations**: When ready, place SQL init scripts in `docker/postgres/init/` for non-Prisma migrations, or use Prisma migrations in `apps/api`.
- **Backend integration**: Once Prisma schema exists, import models from `@open-garage-flow/database` in backend services.

## TypeScript & Path Configuration

- **Base config**: `tsconfig.base.json` enables strict mode (`strict: true`, `strictNullChecks: true`).
- **Path aliases**: Currently empty (`paths: {}`). When adding, update `tsconfig.base.json#compilerOptions.paths` and reference in app-specific `tsconfig.json` files. Example: `"@/*": ["app/*"]` for frontend (already used but needs verification in `tsconfig`).
- **All code is TypeScript**. No JavaScript files unless strictly necessary (e.g., ESLint config).

## Architecture Guidance

- Follow the project principles: open-source SaaS, API-first, Docker-first, modular, Clean Architecture, domain-driven, multi-tenant shared DB, enterprise-ready.
- Prefer workspace-level configuration. Do not create duplicate configurations at app or package level unless necessary.
- Do not install dependencies inside individual apps unless strictly necessary—use pnpm `--filter` to scope installs.
- **Reuse shared packages** (`@open-garage-flow/auth`, `@open-garage-flow/config`, `@open-garage-flow/shared`, `@open-garage-flow/ui`) rather than duplicating code. When these packages are empty (currently), propose their implementation structure first.
- Preserve Node ecosystem conventions and keep naming consistent across backend, frontend, and packages.
- Use **English** for code, comments, docs, API interfaces, variables, and database models.

## Conventions & Common Commands

### Root workspace commands

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all services in parallel (api + web)
pnpm build                # Build all apps
pnpm lint                 # Lint all code
pnpm test                 # Run tests for all packages
pnpm format               # Format code with Prettier (printWidth: 100, singleQuote: true)
```

### Backend (apps/api) commands

```bash
pnpm api:dev              # Start NestJS dev server with watch mode (port 3001)
pnpm api:build            # Build backend to dist/
pnpm api:test             # Run Jest unit tests
# Inside apps/api:
pnpm run test:watch       # Watch mode for tests
pnpm run test:cov         # Generate coverage report
pnpm run test:e2e         # Run e2e tests (jest-e2e.json config)
pnpm run start:prod       # Run production build
```

### Frontend (apps/web) commands

```bash
pnpm web:dev              # Start Next.js dev server (port 3000)
pnpm web:build            # Build frontend (output: .next/)
pnpm web:lint             # Lint frontend code
```

### Backend Code Structure (NestJS)

- **Module pattern**: Create feature modules under `apps/api/src/[feature]/`. Example: `apps/api/src/users/users.module.ts`, `apps/api/src/users/users.service.ts`, `apps/api/src/users/users.controller.ts`.
- **Naming**: Use `.service.ts`, `.controller.ts`, `.module.ts`, `.spec.ts`, `.e2e-spec.ts` suffixes.
- **Testing**: Unit tests (`*.spec.ts`) use Jest and `@nestjs/testing`. E2e tests in `test/` directory use same Jest config.
- **Database access**: Will use Prisma models from `@open-garage-flow/database` when implemented.
- **Configuration**: Environment variables (e.g., `JWT_SECRET`, `JWT_EXPIRES_IN`, `HOST`, `PORT`) loaded via `dotenv`.

### Frontend Code Structure (Next.js)

- **App Directory**: Default React Server Components. Mark interactive sections with `'use client'`.
- **Routing**: File-based routing under `apps/web/app/`. Example: `apps/web/app/dashboard/page.tsx` → route `/dashboard`.
- **Styling**: Tailwind CSS 4 with PostCSS. Global styles in `apps/web/app/globals.css`.
- **Environment**: Frontend API calls use `NEXT_PUBLIC_API_URL=http://localhost:3001` (in `.env.local`).
- **Components**: Will import UI components from `@open-garage-flow/ui` when implemented.
- **Layout**: Shared layout in `apps/web/app/layout.tsx`.

### Testing Patterns

- **Backend unit tests**: Jest in `apps/api/` with TypeScript support. Use `@nestjs/testing` for module testing.
- **Backend e2e tests**: In `apps/api/test/` directory. Run with `pnpm run test:e2e`.
- **Frontend tests**: No tests configured yet (Next.js testing setup pending).
- **Coverage**: Generate backend coverage with `pnpm run test:cov`.

### Shared Packages Status

| Package                      | Purpose                                             | Status | Import                                        |
| ---------------------------- | --------------------------------------------------- | ------ | --------------------------------------------- |
| `@open-garage-flow/auth`     | Authentication logic, JWT utilities, auth guards    | Empty  | `import {} from '@open-garage-flow/auth'`     |
| `@open-garage-flow/config`   | Centralized config, environment parsing, validation | Empty  | `import {} from '@open-garage-flow/config'`   |
| `@open-garage-flow/database` | Prisma schema, migrations, model types              | Empty  | `import {} from '@open-garage-flow/database'` |
| `@open-garage-flow/shared`   | Shared utilities, types, constants, helpers         | Empty  | `import {} from '@open-garage-flow/shared'`   |
| `@open-garage-flow/ui`       | React components (forms, buttons, layouts, etc.)    | Empty  | `import {} from '@open-garage-flow/ui'`       |

**When implementing shared packages:**

1. Define `package.json#exports` clearly (ESM and CJS if needed).
2. Place implementation code in `packages/[name]/src/`.
3. Configure `tsconfig.json` to point to `src/` as entry.
4. Export types and functions from `packages/[name]/src/index.ts`.
5. Add to `tsconfig.base.json#paths` if needed (e.g., `"@open-garage-flow/auth": ["packages/auth/src"]`).

### Code Quality

- **TypeScript**: Strict mode enabled. All new code must be TypeScript.
- **Linting**: ESLint configured at root. Use `pnpm lint` before committing.
- **Formatting**: Prettier with `printWidth: 100`, `singleQuote: true`. Use `pnpm format`.
- **Git**: Conventional commits recommended (e.g., `feat:`, `fix:`, `refactor:`, `docs:`).

### Common Pitfalls & Gotchas

1. **Shared packages are scaffolded but empty** — Always check if code exists before referencing it.
2. **No Prisma schema yet** — Database models need to be defined and migrations created before backend features depend on them.
3. **Backend bootstrap only** — Only `app.*.ts` files exist. New feature modules must follow NestJS folder conventions.
4. **Frontend is template** — `page.tsx` still has create-next-app placeholder. Replace with actual dashboard.
5. **Path aliases not fully configured** — `tsconfig.base.json#paths` is empty. Update as new packages are implemented.
6. **Environment setup required** — Must run Docker for PostgreSQL before backend can connect to database.
7. **JWT config exists but no auth module** — Environment variables (`JWT_SECRET`, `JWT_EXPIRES_IN`) are defined but `packages/auth` is not yet implemented.
8. **No CI/CD defined** — GitHub Actions workflows are not yet configured. Plan deployment strategy before release.
9. **Multi-tenant shared DB assumption** — Architecture assumes single PostgreSQL database with tenant isolation via schema/rows. Confirm this approach before adding tenancy logic.

## Recommended Agent Behavior

- **Verify before using**: Check if shared packages have implementations before importing. If empty, propose implementation structure first.
- **Propose before implementing**: For architectural changes (especially workspace layout, shared packages, or database changes), outline the approach before proceeding.
- **Link to existing docs**: Rather than copying documentation, link to [README.md](README.md), [apps/api/README.md](apps/api/README.md), [apps/web/README.md](apps/web/README.md), or AGENTS.md.
- **Follow NestJS conventions**: When adding backend features, create module → service → controller. Use dependency injection.
- **Use server components by default**: In Next.js, default to server components; add `'use client'` only when needed for interactivity.
- **Prefer workspace commands**: Use `pnpm` at root level with `--filter` rather than navigating into individual apps.
- **Run tests locally**: Before suggesting changes, verify with `pnpm test` and `pnpm api:test`.
- **Maintain strict TypeScript**: Do not disable `strict` mode. All new types must be explicit.
- **Keep changes modular and scalable**: Avoid large monolithic refactors without a clear incremental path.
- **Document new patterns**: When introducing a new convention (e.g., error handling, logging), update AGENTS.md or linked READMEs.

## Editing & PR Guidance

- **Keep commits focused**: One feature or fix per commit. Use descriptive messages.
- **Test before committing**: Run `pnpm test`, `pnpm api:test`, and `pnpm lint` locally.
- **Update shared packages intentionally**: Before modifying `packages/*`, consider if the change belongs in a shared package or in a specific app.
- **Coordinate database changes**: If modifying Prisma schema (future), notify that migrations must be created and tested.
- **Document breaking changes**: If modifying shared package exports, update consumers and AGENTS.md.

## For Specialized Work

- **Ask for dedicated guidance** on backend development: Request "backend development guide" to focus on NestJS patterns, database integration, and API design.
- **Ask for dedicated guidance** on frontend development: Request "frontend development guide" to focus on Next.js app directory, component patterns, and UI/UX.
- **Ask for dedicated guidance** on database/Prisma setup: Request "database setup guide" for schema design, migrations, and multi-tenancy architecture.

---

Generated to help AI agents work safely and effectively in this repository.
