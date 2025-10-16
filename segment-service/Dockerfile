# Segment Service Dockerfile
FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime
ENV NODE_ENV=production
EXPOSE 4001
CMD ["node", "dist/index.js"]
