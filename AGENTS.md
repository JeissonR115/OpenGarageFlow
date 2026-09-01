# AGENTS.md — Guidance for AI coding agents

## For AI Agents

This file provides concise, actionable guidance for AI coding agents working in this repository:

- Quick purpose: help agents find build/test commands, conventions, likely pitfalls, and where to make changes.
- Quick commands: `pnpm install`, `pnpm dev`, `pnpm api:dev`, `pnpm web:dev`.
- When in doubt, consult the linked READMEs (root, apps/api, apps/web) before making changes.

## Purpose

This repo is a monorepo for OpenGarageFlow. The main implementation is the NestJS API in [apps/api](apps/api), and this file is intentionally biased toward backend work so agents can be productive in the API app without losing the repo context.

## Quick links

- [README.md](README.md) — project overview
- [apps/api/README.md](apps/api/README.md) — backend docs and NestJS starter notes
- [apps/web/README.md](apps/web/README.md) — frontend app context
- [apps/api/src/app.module.ts](apps/api/src/app.module.ts) — top-level API module composition
- [apps/api/src/main.ts](apps/api/src/main.ts) — bootstrap, validation, CORS, Swagger, versioning
- [apps/api/prisma/schema](apps/api/prisma/schema) — Prisma schema files

## API-first repo context

- The core product logic lives in [apps/api](apps/api).
- The app uses NestJS 11 with modular feature folders under [apps/api/src/modules](apps/api/src/modules).
- The API is configured as a versioned, prefixed REST service with Swagger and global validation enabled in [apps/api/src/main.ts](apps/api/src/main.ts).
- Database access is Prisma-based; Prisma setup and schema files are under [apps/api/prisma](apps/api/prisma).
- The web app is secondary context; do not treat it as the primary implementation target unless the task explicitly concerns the frontend.

## Local workflow for the API app

1. Install dependencies from the repo root:
   ```bash
   pnpm install
   ```
2. Start PostgreSQL:
   ```bash
   docker compose -f docker/compose.yml up -d
   ```
3. Configure env vars for the API, especially `DATABASE_URL` in [apps/api](apps/api).
4. Start the backend in watch mode:
   ```bash
   pnpm api:dev
   ```
   or:
   ```bash
   cd apps/api && pnpm run start:dev
   ```
5. Run targeted backend checks:
   ```bash
   pnpm api:test
   pnpm --dir apps/api run test:e2e
   ```

## Backend conventions

### Structure and naming

- Use the NestJS module/service/controller pattern for each feature.
- Prefer directories under [apps/api/src/modules](apps/api/src/modules) with names like `auth`, `core`, `crm`, `system`.
- Keep files aligned with NestJS conventions: `*.module.ts`, `*.service.ts`, `*.controller.ts`, `*.spec.ts`, `*.e2e-spec.ts`.
- For DTOs and validators, place them close to the feature or under [apps/api/src/dto](apps/api/src/dto) if shared.

### Application bootstrap

- The application entry point is [apps/api/src/main.ts](apps/api/src/main.ts).
- Respect the existing bootstrap behavior:
  - global prefix
  - versioning via URI path
  - CORS
  - validation pipe with `whitelist`, `transform`, and `forbidNonWhitelisted`
  - Swagger docs if enabled
- Do not add ad hoc app-level bootstrap logic without checking whether it belongs in a config module or feature module.

### Config and environment

- Configuration is centralized in the API config package under [apps/api/src/config](apps/api/src/config).
- Read env values through `@nestjs/config` and avoid hardcoded secrets or URLs.
- Guard against missing env variables with typed config objects rather than implicit `process.env` lookups.
- Keep environment names stable and consistent with config files already used by the app.

### Database and Prisma

- Prisma is the persistence layer for the API; do not bypass it with ad hoc SQL or direct database access in services.
- Use the Prisma service/module pattern and inject `PrismaService` in feature services.
- Before using Prisma models or generating client artifacts, verify whether the schema and generated client already exist in [apps/api/prisma](apps/api/prisma).
- When changing Prisma schema, plan the migration and test the schema update before finalizing the change.

### Auth and API contracts

- API endpoints should be versioned and follow the established global prefix.
- Use DTOs for request validation and API contract boundaries.
- Prefer explicit, typed responses and avoid leaking raw Prisma models directly to controllers.
- For auth flows, keep the JWT strategy and route-handling semantics consistent with the existing config and module structure.

## Testing expectations for API work

- Prefer writing or updating a focused unit spec for new backend logic.
- Use `@nestjs/testing` for module- and service-level tests.
- E2E coverage belongs in [apps/api/test](apps/api/test) and should be used for route-level behavior.
- Run only the relevant backend tests for the changed feature when possible, instead of broad suite runs.

## Project-specific pitfalls to avoid

1. Do not assume shared packages are implemented; verify before importing from `@open-garage-flow/*`.
2. Do not start writing new feature code without checking the existing module layout in [apps/api/src/modules](apps/api/src/modules).
3. Do not ignore the database and env requirements: PostgreSQL and `DATABASE_URL` must be set up before app-level behavior is meaningful.
4. Do not create duplicate config patterns when a NestJS config module already exists in [apps/api/src/config](apps/api/src/config).
5. Do not add new API routes without considering versioning, DTO validation, and Swagger docs.
6. Do not bypass the Prisma service for persistence or schema operations.

## Agent behavior

- Default to the API app unless the request explicitly targets frontend work.
- Check existing code in [apps/api/src](apps/api/src) before introducing new modules or service patterns.
- Prefer minimal, feature-scoped changes that follow the existing NestJS structure.
- Keep naming and code style consistent with the repo’s TypeScript and NestJS conventions.
- When the task is architectural, state the intended module/config pattern before implementing it.
- Link to existing docs instead of duplicating them. Use [README.md](README.md), [apps/api/README.md](apps/api/README.md), and this file as the canonical references.

## Useful commands

```bash
pnpm install
pnpm dev
pnpm api:dev
pnpm api:test
pnpm --dir apps/api run test:e2e
pnpm --dir apps/api run lint
```

---

This AGENTS file is intentionally tuned for API work so backend agents can identify the correct module boundaries, config patterns, database conventions, and verification steps quickly.
