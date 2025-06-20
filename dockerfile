# ---------- Base image ----------
  FROM node:18-alpine AS base
  WORKDIR /app
  ENV NEXT_TELEMETRY_DISABLED=1
  RUN apk add --no-cache libc6-compat && npm install -g pnpm
  
  # ---------- Dependencies Layer ----------
  FROM base AS deps
  COPY package.json pnpm-lock.yaml ./
  RUN pnpm install --frozen-lockfile
  
  # ---------- Builder Layer ----------
  FROM base AS builder
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  RUN pnpm build
  
  # ---------- Production Runner ----------
  FROM node:18-alpine AS runner
  WORKDIR /app
  ENV NODE_ENV=production
  ENV NEXT_TELEMETRY_DISABLED=1
  RUN addgroup --system --gid 1001 nodejs && \
      adduser --system --uid 1001 nextjs && \
      npm install -g pnpm
  
  COPY --from=builder /app/.next ./.next
  COPY --from=builder /app/public ./public
  COPY --from=builder /app/package.json ./package.json
  COPY --from=builder /app/node_modules ./node_modules
  
  USER nextjs
  EXPOSE 3000
  CMD ["pnpm", "start"]
  