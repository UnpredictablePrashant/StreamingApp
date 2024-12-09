# Use Node.js 20 Alpine base image
FROM node:20-alpine3.18

# Set working directory
WORKDIR /app

# # Install system dependencies required for Node.js
# RUN apk update && apk add --no-cache bash curl

# Copy only necessary files to leverage Docker caching
COPY package.json .

# Configure npm retry settings and install dependencies
RUN npm set fetch-retries 5 && \
    npm set fetch-retry-mintimeout 20000 && \
    npm set fetch-retry-maxtimeout 120000 && \
    npm install && \
    npm install -g pm2

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application using npm
CMD ["npm", "start"]
