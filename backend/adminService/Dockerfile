FROM node:20-alpine AS base
WORKDIR /app/adminService

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5002
CMD ["npm", "start"]

