# ---------------- BASE ----------------
ARG NODE_VERSION="22"
FROM node:${NODE_VERSION}-alpine AS base

ENV NODE_ENV="production"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED="1"

WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable

# ---------------- BUILD ----------------
ARG APP_NAME
FROM base AS builder
WORKDIR /app

# Copier uniquement ce qui est nécessaire pour installer
COPY package.json pnpm-lock.yaml .npmrc* ./
COPY packages ./packages
COPY apps/${APP_NAME} ./apps/${APP_NAME}

# Installer les dépendances nécessaires au package (et devDeps pour build)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --filter "${APP_NAME}..." --frozen-lockfile

# Build et deploy standalone
RUN pnpm run build --filter "${APP_NAME}"
RUN pnpm deploy --filter "${APP_NAME}" --prod "/app/${APP_NAME}"

# ---------------- CMS STANDALONE ----------------
FROM base AS cms
ARG APP_NAME
ARG CMS_PORT="3000"

ENV PORT=$CMS_PORT

# Création utilisateur non root
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

WORKDIR /app

# Copier le déploiement standalone complet + public
COPY --from=builder --chown=nextjs:nodejs /app/${APP_NAME} ./

USER nextjs

EXPOSE $CMS_PORT

# server.js généré par build standalone
CMD ["node", "server.js"]
