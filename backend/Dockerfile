# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files (for workspaces)
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy backend source code only
COPY backend ./backend

# Build the backend
WORKDIR /app/backend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install production dependencies only
RUN npm install --only=production --workspace=backend

# Copy built code from builder
COPY --from=builder /app/backend/dist ./backend/dist

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Expose port
EXPOSE 3001

# Run the application
WORKDIR /app/backend
CMD ["node", "dist/server.js"]