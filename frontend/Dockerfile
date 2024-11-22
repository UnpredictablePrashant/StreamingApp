# Use Node.js 20 base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy project files to container
COPY . .

# Install dependencies and pm2
RUN npm install
RUN npm install -g pm2

# Copy and set permissions for start script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["/app/start.sh"]


# RUN npm install -g pm2
