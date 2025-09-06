ARG NODE_VERSION="22"

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ----------------------
# CMS
# ----------------------
# CMS build
FROM base AS build_cms
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --filter "cms..." --frozen-lockfile --ignore-scripts
RUN pnpm run build --filter "cms"
RUN pnpm deploy --filter "cms" --prod "/prod/cms"

# CMS Runtime
FROM base AS cms
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true

WORKDIR /prod/cms

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build_cms --chown=nextjs:nodejs /prod/cms/public ./public
COPY --from=build_cms --chown=nextjs:nodejs /prod/cms/.next/standalone ./
COPY --from=build_cms --chown=nextjs:nodejs /prod/cms/.next/static ./.next/static
COPY --from=build_cms --chown=nextjs:nodejs /prod/cms/node_modules ./node_modules

RUN chmod -R a-w+x /prod/cms && chmod -R a+x /prod/cms/.next /prod/cms/node_modules

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# CMS Production
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12 AS cms-distroless
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

WORKDIR /prod/cms
COPY --from=build_cms --chown=1001:1001 /prod/cms/public ./public
COPY --from=build_cms --chown=1001:1001 /prod/cms/.next/standalone ./
COPY --from=build_cms --chown=1001:1001 /prod/cms/.next/static ./.next/static
COPY --from=build_cms --chown=1001:1001 /prod/cms/node_modules ./node_modules

USER 1001
EXPOSE 3000
CMD ["server.js"]

# ----------------------
# DESIGN SYSTEM
# ----------------------
# DESIGN SYSTEM build
FROM base AS build_design_system
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --filter "design-system..." --frozen-lockfile --ignore-scripts
RUN pnpm run build --filter "design-system"
RUN pnpm deploy --filter "design-system" --prod "/prod/design-system"

# DESIGN SYSTEM Runtime
FROM base AS design-system
ENV NODE_ENV=production

WORKDIR /prod/design-system

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 storybookjs

COPY --from=build_design_system --chown=storybookjs:nodejs /prod/design-system/storybook-static ./storybook-static
COPY --from=build_design_system --chown=storybookjs:nodejs /prod/design-system/node_modules ./node_modules
COPY --from=build_design_system --chown=storybookjs:nodejs /prod/design-system/server.js ./server.js

RUN chmod -R a-w+x /prod/design-system && chmod -R a+x /prod/design-system/storybook-static /prod/design-system/node_modules

USER storybookjs

EXPOSE 3001

ENV PORT=3001

CMD ["node", "server.js"]

# DESIGN SYSTEM Production
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12 AS design-system-distroless
EXPOSE 3001

ENV PORT=3001

WORKDIR /prod/design-system
COPY --from=build_design_system --chown=storybookjs:nodejs /prod/design-system/storybook-static ./storybook-static
COPY --from=build_design_system --chown=storybookjs:nodejs /prod/design-system/node_modules ./node_modules
COPY --from=build_design_system --chown=storybookjs:nodejs /prod/design-system/server.js ./server.js

USER 1001
EXPOSE 3001

CMD ["server.js"]

# ----------------------
# WEBSITE
# ----------------------
# WEBSITE build
FROM base AS build_website
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --filter "website..." --frozen-lockfile --ignore-scripts
RUN pnpm run build --filter "website"
RUN pnpm deploy --filter "website" --prod "/prod/website"

# WEBSITE Runtime
FROM base AS website
ENV NODE_ENV=production

WORKDIR /prod/website

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astrojs

COPY --from=build_website --chown=astrojs:nodejs /prod/website/dist ./dist
COPY --from=build_website --chown=astrojs:nodejs /prod/website/node_modules ./node_modules
COPY --from=build_website --chown=astrojs:nodejs /prod/website/server.js ./server.js

RUN chmod -R a-w+x /prod/website && chmod -R a+x /prod/website/dist /prod/website/node_modules

USER astrojs

EXPOSE 3002

ENV PORT=3002

CMD ["node", "server.js"]

# WEBSITE Production
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12 AS website-distroless
EXPOSE 3002

ENV PORT=3002

WORKDIR /prod/website
COPY --from=build_website --chown=astrojs:nodejs /prod/website/dist ./dist
COPY --from=build_website --chown=astrojs:nodejs /prod/website/node_modules ./node_modules
COPY --from=build_website --chown=astrojs:nodejs /prod/website/server.js ./server.js

USER 1001
EXPOSE 3002

CMD ["server.js"]

# ----------------------
# EDITOR
# ----------------------
# EDITOR build
FROM base AS build_editor
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --filter "editor..." --frozen-lockfile --ignore-scripts
RUN pnpm run build --filter "editor"
RUN pnpm deploy --filter "editor" --prod "/prod/editor"

# EDITOR Runtime
FROM base AS editor
ENV NODE_ENV=production

WORKDIR /prod/editor

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 vitejs

COPY --from=build_editor --chown=vitejs:nodejs /prod/editor/dist ./dist
COPY --from=build_editor --chown=vitejs:nodejs /prod/editor/node_modules ./node_modules
COPY --from=build_editor --chown=vitejs:nodejs /prod/editor/server.js ./server.js

RUN chmod -R a-w+x /prod/editor && chmod -R a+x /prod/editor/dist /prod/editor/node_modules

USER vitejs

EXPOSE 3003

ENV PORT=3003

CMD ["node", "server.js"]

# EDITOR Production
FROM gcr.io/distroless/nodejs${NODE_VERSION}-debian12 AS editor-distroless
EXPOSE 3003

ENV PORT=3003

COPY --from=build_editor --chown=vitejs:nodejs /prod/editor/dist ./dist
COPY --from=build_editor --chown=vitejs:nodejs /prod/editor/node_modules ./node_modules
COPY --from=build_editor --chown=vitejs:nodejs /prod/editor/server.js ./server.js

USER 1001
EXPOSE 3003

CMD ["server.js"]
