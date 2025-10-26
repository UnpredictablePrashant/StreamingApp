FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]