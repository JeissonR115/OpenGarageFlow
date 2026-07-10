# AGENTS.md — Guidance for AI coding agents

Purpose

- Short instructions to help AI agents be productive in this repository.

Quick links

- Root README: [README.md](README.md)
- Backend app README: [apps/api/README.md](apps/api/README.md)
- Frontend app README: [apps/web/README.md](apps/web/README.md)
- Root AGENTS: [AGENTS.md](AGENTS.md)

Repository overview

- Root layout: `apps/`, `packages/`, `docker/`, `scripts/`, `docs/`.
- `apps/api`: NestJS backend application with local pnpm workspace files and Jest e2e config. Backend code lives under `apps/api/src` and `apps/api/test`.
- `apps/web`: Next.js frontend application with local pnpm workspace files. Frontend code lives under `apps/web/app` and `apps/web/public`.
- `packages/*`: Shared implementation directories (`auth`, `config`, `database`, `shared`, `ui`) currently present but not yet packaged with their own `package.json` manifests.
- Current repo state: no root `package.json`, no root `pnpm-workspace.yaml`, and no root `pnpm-lock.yaml`. Avoid creating duplicate workspace manifests without explicit approval.

Architecture guidance

- Follow the project principles: open-source SaaS, API-first, Docker-first, modular, Clean Architecture, domain-driven, multi-tenant shared DB, enterprise-ready.
- Prefer workspace-level configuration when the repository is fully converted to a root pnpm workspace.
- Do not install dependencies inside individual apps unless strictly necessary.
- Reuse shared packages rather than adding duplicate code.
- Preserve node ecosystem conventions and keep naming consistent across backend, frontend, and packages.
- Use English for code, comments, docs, API interfaces, variables, and database models.

Conventions & common commands

- Use pnpm where possible, but verify the actual workspace layout before running installs.
- Backend app commands (inside `apps/api`):
  - `pnpm install`
  - `pnpm run build`
  - `pnpm run start:dev`
  - `pnpm run test`
  - `pnpm run test:e2e`
- Frontend app commands (inside `apps/web`):
  - `pnpm install`
  - `pnpm run dev`
  - `pnpm run build`
  - `pnpm run lint`
- TypeScript and ESLint are used in both apps; maintain consistent formatting and lint rules.
- Do not create duplicate configuration files. If a root-level config is missing, ask before introducing a second copy at the app level.

Recommended agent behavior

- Propose architectural changes before applying them, especially when they affect workspace layout or package structure.
- Link to existing documentation rather than copying it into new files.
- Prefer explicit code over magic, and avoid unnecessary abstractions.
- Follow SOLID and Clean Architecture principles.
- Keep changes modular and scalable; avoid large monolithic refactors without a clear incremental path.
- When a recommended change touches shared packages, explain why it improves reuse and maintainability.

Editing & PR guidance

- Keep commits small and focused; document reasoning for workspace or package-manager changes.
- If root workspace configuration is added later, clearly state that this is a structural repository upgrade.
- Include tests when introducing behavior changes or new features.
- When applicable, update docs in `README.md`, `docs/`, or `AGENTS.md` rather than duplicating content.

If you want more specialized guidance

- Ask for dedicated instructions for `apps/api` (backend), `apps/web` (frontend), or `packages/` (shared libraries).

---

Generated to help AI agents work safely and effectively in this repository.
