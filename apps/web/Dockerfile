FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
ENV CI=true
ENV pnpm_config_dangerously_allow_all_builds=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json

RUN pnpm install --frozen-lockfile --filter web...
FROM base AS build
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app/apps/web
RUN pnpm run build

FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static

WORKDIR /app/apps/web

CMD ["node", "server.js"]
