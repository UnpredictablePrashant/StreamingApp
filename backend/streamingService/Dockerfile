FROM node:18-alpine AS base
WORKDIR /app/streamingService

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5003
CMD ["npm", "start"]

