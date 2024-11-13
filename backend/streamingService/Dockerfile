FROM node:20

WORKDIR /app

COPY . .

# Configure npm retry settings to handle network issues better
RUN npm set fetch-retries 5 && \
    npm set fetch-retry-mintimeout 20000 && \
    npm set fetch-retry-maxtimeout 120000

RUN npm install


EXPOSE 3002

CMD ["node", "index.js"]