FROM node:20-alpine AS base
WORKDIR /app/authService

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 4000
CMD ["npm", "start"]

