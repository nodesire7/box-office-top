# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .

# Environment variables
ENV PORT=3000
ENV API_BASE_URL=https://api.example.com
ENV TMDB_API_KEY=your_tmdb_api_key

EXPOSE ${PORT}
CMD ["node", "server.js"]