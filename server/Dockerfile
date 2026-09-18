# ==============================================================================
# Recip52 Backend Production Container (Multi-Stage Build)
# ==============================================================================

# --- Stage 1: Dependencies Cache ---
FROM node:20-alpine AS deps
WORKDIR /app

# Install build essentials if native dependencies ever required
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# --- Stage 2: Production Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install curl for reliable container health check
RUN apk add --no-cache curl

# Copy pruned production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src/ ./src/

# Set security file permissions to non-root user
RUN chown -R node:node /app
USER node

EXPOSE 5000

# Container Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
