FROM node:18-alpine AS base
WORKDIR /app/chatService

COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 4001
CMD ["npm", "start"]

