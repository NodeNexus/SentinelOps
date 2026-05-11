# ── API ──────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS api-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
RUN npm ci --workspace @sentinelops/api --ignore-scripts

FROM node:20-alpine AS api-builder
WORKDIR /app
COPY --from=api-deps /app/node_modules ./node_modules
COPY . .
RUN npm --workspace @sentinelops/api run build

FROM node:20-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
COPY --from=api-builder /app/node_modules ./node_modules
COPY --from=api-builder /app/apps/api/dist ./apps/api/dist
COPY --from=api-builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=api-builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=api-builder /app/package.json .
EXPOSE 4000
WORKDIR /app/apps/api
CMD ["node", "dist/index.js"]
