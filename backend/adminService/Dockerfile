# -------- Stage 1: Build --------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# -------- Stage 2: Production --------
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app /app

ENV NODE_ENV=production
EXPOSE 3003

CMD ["npm", "run", "start"]
