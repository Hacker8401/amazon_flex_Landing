# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable Corepack to use the exact pnpm version from package.json
RUN corepack enable

# Copy package files and pnpm configuration
COPY package.json pnpm-lock.yaml .pnpmfile.cjs* .npmrc ./

# Install pnpm using Corepack (respects packageManager field in package.json)
RUN corepack prepare --activate

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Enable Corepack to use the exact pnpm version from package.json
RUN corepack enable

# Copy package files and pnpm configuration
COPY package.json pnpm-lock.yaml .pnpmfile.cjs* .npmrc ./

# Install pnpm using Corepack (respects packageManager field in package.json)
RUN corepack prepare --activate

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# The app binds to PORT env var or 3000
EXPOSE 3000

# Health check - using 3000 as default but it's better to use a script that checks the actual PORT
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.PORT || 3000; require('http').get(\`http://localhost:\${port}\`, (r) => {if (r.statusCode < 200 || r.statusCode >= 400) throw new Error(r.statusCode)})"

# Start the application
CMD ["node", "dist/index.js"]
