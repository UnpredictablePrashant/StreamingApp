#Dockerfile to containerise the React frontend application
FROM node:22-alpine 
WORKDIR /app
COPY package.json ./
RUN npm install 
COPY . .
EXPOSE 3000                                                         
CMD ["npm", "start"]
